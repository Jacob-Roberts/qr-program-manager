import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "#/server/api/trpc";
import { posts, programs } from "#/server/db/schema";
import { asc, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { z } from "zod";

export const programRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise(resolve => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getPrograms: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(programs)
      .where(eq(programs.createdById, ctx.session.user.id))
      .orderBy(asc(programs.createdAt));
  }),

  addProgram: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.insert(programs).values({
      slug: createSlug("program"),
      createdById: ctx.session.user.id,
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
