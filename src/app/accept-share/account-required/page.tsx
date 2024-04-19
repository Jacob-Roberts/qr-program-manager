import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "#/components/ui/button";
import { db } from "#/server/db";
import { programShareInvites, programs } from "#/server/db/schema";

export default async function AccountRequired({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const programId = searchParams.programId;
  const token = searchParams.token;

  if (!programId || !token) {
    return notFound();
  }

  if (Array.isArray(programId) || Array.isArray(token)) {
    return notFound();
  }

  const parsedProgramID = parseInt(programId, 10);
  if (Number.isNaN(parsedProgramID)) {
    return notFound();
  }

  const searchPrograms = await db
    .select({
      name: programs.name,
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

  const foundProgram = searchPrograms[0];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            You&apos;ve been invited to manage {foundProgram.name}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            To get started, you need to create an account first.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Button
            className="w-full rounded-md bg-indigo-600 py-3 text-white shadow-sm hover:bg-indigo-700"
            variant="default"
            asChild
          >
            <Link
              href={`/api/auth/signin?callbackUrl=${encodeURIComponent(
                `/accept-share?programId=${programId}&token=${token}`,
              )}`}
            >
              Click here to get started
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
