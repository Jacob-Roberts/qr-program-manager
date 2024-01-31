import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "#/server/api/trpc";
import { programs } from "#/server/db/schema";
import { asc, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { z } from "zod";

export const programRouter = createTRPCRouter({
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
      .where(eq(programs.ownerId, ctx.session.user.id))
      .orderBy(asc(programs.createdAt));
  }),

  addProgram: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.insert(programs).values({
      slug: createSlug("program"),
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
