import { getServerAuthSession } from "#/server/auth";
import { db } from "#/server/db";
import { programShareInvites } from "#/server/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const programId = searchParams.get("programId");
  const token = searchParams.get("token");

  if (!programId || !token) {
    return new Response("Invalid request", { status: 400 });
  }
  const parsedProgramID = parseInt(programId, 10);
  if (Number.isNaN(parsedProgramID)) {
    return new Response("Invalid programId", { status: 400 });
  }

  const programs = await db
    .select()
    .from(programShareInvites)
    .where(
      and(
        eq(programShareInvites.programId, parsedProgramID),
        eq(programShareInvites.inviteToken, token),
      ),
    )
    .limit(1);

  if (programs.length === 0 || typeof programs[0] === "undefined") {
    return new Response("Invalid token", { status: 400 });
  }

  const foundProgram = programs[0];

  // Check if they are logged in
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    return redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(`/accept-share?${searchParams.toString()}`)}`,
    );
  }

  return new Response(JSON.stringify(foundProgram), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
