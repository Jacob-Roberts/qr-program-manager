import { env } from "#/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "#/server/api/trpc";
import {
  programShareInvites,
  programs,
  programsShares,
  users,
} from "#/server/db/schema";
import InviteUserEmail from "#/server/email/invite-user";
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
    });
  }),

  deleteProgram: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(programs).where(eq(programs.id, input));
    }),

  shares: protectedProcedure
    .input(z.object({ programId: z.number() }))
    .query(async ({ ctx, input }) => {
      const sharesAndUsers = await ctx.db
        .select({
          programId: programsShares.programId,
          userId: programsShares.userId,
          userName: users.name,
          userEmail: users.email,
          userImage: users.image,
        })
        .from(programsShares)
        .where(eq(programsShares.programId, input.programId))
        .leftJoin(users, eq(users.id, programsShares.userId));
      const invitesAndUsers = await ctx.db
        .select({
          programId: programShareInvites.programId,
          email: programShareInvites.email,
        })
        .from(programShareInvites)
        .where(eq(programShareInvites.programId, input.programId));

      return {
        shares: sharesAndUsers,
        invites: invitesAndUsers,
      };
    }),

  shareProgram: protectedProcedure
    .input(
      z.object({
        programId: z.number(),
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First see if we can immediately add the share
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);
      if (user.length > 0 && typeof user[0] !== "undefined") {
        await ctx.db.insert(programsShares).values({
          programId: input.programId,
          userId: user[0].id,
        });
        return null;
      }

      // If we didn't find a user, then invite them
      const inviteToken = createInviteToken(40);

      // find the program name
      const program = await ctx.db
        .select({
          name: programs.name,
          id: programs.id,
        })
        .from(programs)
        .where(eq(programs.id, input.programId))
        .limit(1);
      if (program.length === 0 || typeof program[0] === "undefined") {
        throw new Error("not found");
      }

      await ctx.db.insert(programShareInvites).values({
        programId: input.programId,
        email: input.email,
        inviteToken: inviteToken,
      });
      if (process.env.ENABLE_EMAIL_INVITES !== "true") {
        console.log(
          "Not sending email invite because ENABLE_EMAIL_INVITES is not true",
        );
        return null;
      }
      try {
        const { data, error } = await ctx.emailClient.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: [input.email],
          subject: "Hello world",
          react: InviteUserEmail({
            username: input.email,
            invitedByEmail: ctx.session.user.email ?? undefined,
            invitedByUsername: ctx.session.user.name ?? undefined,
            userImage: ctx.session.user.image ?? undefined,
            inviteLink: `${env.NEXT_PUBLIC_DEPLOY_URL}/accept-share?programId=${input.programId}&token=${inviteToken}`,
            programName: program[0].name,
          }) as React.ReactElement,
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
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(programsShares)
        .where(
          and(
            eq(programsShares.programId, input.programId),
            eq(programsShares.userId, input.userId),
          ),
        );
    }),

  uninviteProgram: protectedProcedure
    .input(
      z.object({
        programId: z.number(),
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(programShareInvites)
        .where(
          and(
            eq(programShareInvites.programId, input.programId),
            eq(programShareInvites.email, input.email),
          ),
        );
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

function createInviteToken(size?: number) {
  return `PI_${nanoid(size)}`;
}
