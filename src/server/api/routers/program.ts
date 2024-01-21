import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "#/server/api/trpc";
import { posts, programs } from "#/server/db/schema";
import { eq } from "drizzle-orm";
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
      .orderBy(programs.updatedAt, programs.createdAt);
  }),

  addProgram: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(programs).values({
        slug: createSlug("program"),
        name: input.name,
        createdById: ctx.session.user.id,
        fileSanityId: "123",
        fileUploadName: "Workplace.pdf",
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
