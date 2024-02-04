import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "#/server/api/trpc";
import { programShareInvites, programs } from "#/server/db/schema";
import { EmailTemplate } from "#/server/email/email-template";
import { and, asc, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { z } from "zod";

export const programRouter = createTRPCRouter({
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  changeName: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(programs)
        .set({
          name: input.name,
        })
        .where(eq(programs.id, input.id));
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getPrograms: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(programs)
      .where(eq(programs.ownerId, ctx.session.user.id))
      .orderBy(asc(programs.createdAt));
  }),

  addProgram: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.insert(programs).values({
      slug: createSlug("program"),
      name: "untitled program",
      ownerId: ctx.session.user.id,
      fileUploadId: "not-uploaded-yet",
      fileUploadName: "No file uploaded yet",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }),

  deleteProgram: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(programs).where(eq(programs.id, input));
    }),

  shareProgram: protectedProcedure
    .input(
      z.object({
        programId: z.number(),
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(programShareInvites).values({
        programId: input.programId,
        email: input.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      try {
        const { data, error } = await ctx.emailClient.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: [input.email],
          subject: "Hello world",
          react: EmailTemplate({ firstName: "John" }) as React.ReactElement,
        });

        if (error) {
          throw error;
        }
        return data;
      } catch (error) {
        console.log("Error sending email", error);
        // Rollback the insert
        await ctx.db
          .delete(programShareInvites)
          .where(
            and(
              eq(programShareInvites.programId, input.programId),
              eq(programShareInvites.email, input.email),
            ),
          );
      }
    }),

  unshareProgram: protectedProcedure
    .input(
      z.object({
        programId: z.number(),
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO:
      // await ctx.db
      //   .update(programs)
      //   .set({
      //     sharedWith: ctx.db.raw(`array_remove(shared_with, '${input.email}')`),
      //   })
      //   .where(eq(programs.id, input.programId));
    }),
});

// Our custom nanoid ID generator uses base 63
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_",
  22,
);

function createSlug(type: "program", size?: number) {
  switch (type) {
    case "program":
      return `P_${nanoid(size)}`;
  }
}
