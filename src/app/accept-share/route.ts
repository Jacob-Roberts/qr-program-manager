import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getServerAuthSession } from "#/server/auth";
import { db } from "#/server/db";
import {
  programShareInvites,
  programs,
  programsShares,
} from "#/server/db/schema";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const programId = searchParams.get("programId");
  const token = searchParams.get("token");

  if (!programId || !token) {
    return new Response("Invalid request", { status: 400 });
  }
  const parsedProgramID = Number.parseInt(programId, 10);
  if (Number.isNaN(parsedProgramID)) {
    return new Response("Invalid programId", { status: 400 });
  }

  const searchPrograms = await db
    .select({
      ownerId: programs.ownerId,
    })
    .from(programShareInvites)
    .where(
      and(
        eq(programShareInvites.programId, parsedProgramID),
        eq(programShareInvites.inviteToken, token),
      ),
    )
    .leftJoin(programs, eq(programs.id, programShareInvites.programId))
    .limit(1);

  if (searchPrograms.length === 0 || typeof searchPrograms[0] === "undefined") {
    return new Response("Invalid token", { status: 400 });
  }

  const foundProgramInvite = searchPrograms[0];

  // Check if they are logged in
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    return redirect(
      `/accept-share/account-required?programId=${programId}&token=${token}`,
    );
  }

  // If the user is the owner, redirect them to admin
  if (session.user.id === foundProgramInvite.ownerId) {
    console.log("Owner of the file. No need to accept invite.");
    await db
      .delete(programShareInvites)
      .where(
        and(
          eq(programShareInvites.programId, parsedProgramID),
          eq(programShareInvites.inviteToken, token),
        ),
      );
    return redirect(`/admin`);
  }

  // Check if the user is already shared
  const shares = await db
    .select()
    .from(programsShares)
    .where(eq(programsShares.userId, session.user.id));
  if (shares.length > 0 && typeof shares[0] !== "undefined") {
    console.log("Already shared with this user. No need to accept invite");
    await db
      .delete(programShareInvites)
      .where(
        and(
          eq(programShareInvites.programId, parsedProgramID),
          eq(programShareInvites.inviteToken, token),
        ),
      );
    return redirect("/admin");
  }

  // Otherwise, add the user to this share, and then redirect them to admin
  await db.insert(programsShares).values({
    programId: parsedProgramID,
    userId: session.user.id,
  });

  await db
    .delete(programShareInvites)
    .where(
      and(
        eq(programShareInvites.programId, parsedProgramID),
        eq(programShareInvites.inviteToken, token),
      ),
    );

  console.log(`Successfully added user ${session.user.id} to ${programId}`);

  return redirect("/admin");
}
