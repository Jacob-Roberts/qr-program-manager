import { getServerAuthSession } from "#/server/auth";
import { db } from "#/server/db";
import { programs } from "#/server/db/schema";
import { eq } from "drizzle-orm";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    pdf: {
      maxFileSize: "4MB",
      acl: "public-read",
      contentDisposition: "inline",
    },
  })
    .input(
      z.object({
        programId: z.number(),
      }),
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const session = await getServerAuthSession();

      // If you throw, the user will not be able to upload
      if (!session) throw new Error("Unauthorized");

      const user = session.user;

      // Check that the user owns the program
      const program = await db
        .select()
        .from(programs)
        .where(eq(programs.id, input.programId));

      if (!program?.[0] || program[0].createdById !== user.id) {
        throw new Error("Unauthorized");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        userId: user.id,
        input,
        existingFileKey: program[0].fileUploadId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // Save the details to the DB
      await db
        .update(programs)
        .set({
          fileUploadId: file.key,
          fileUploadName: file.name,
        })
        .where(eq(programs.id, metadata.input.programId));

      if (metadata.existingFileKey) {
        utapi.deleteFiles([metadata.existingFileKey]).catch(e => {
          console.log("Error deleting file", e);
        });
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const utapi = new UTApi();
