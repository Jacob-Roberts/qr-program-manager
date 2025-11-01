import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "#/components/ui/button";
import { db } from "#/server/db";
import { programShareInvites, programs } from "#/server/db/schema";
import { Suspense } from "react";
import { FailResult, OkResult, type Result } from "#utils/result.ts";

export default function AccountRequired(props: {
  searchParams: Promise<Record<string, string | Array<string> | undefined>>;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Suspense fallback={<AccountRequiredHeadingFallback />}>
            <AccountRequiredHeading searchParams={props.searchParams} />
          </Suspense>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            To get started, you need to create an account first.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Button
            className="w-full rounded-md bg-indigo-600 py-3 text-white shadow-xs hover:bg-indigo-700"
            variant="default"
            asChild
          >
            <Suspense fallback={""}>
              <AccountLink searchParams={props.searchParams}>
                Click here to get started
              </AccountLink>
            </Suspense>
          </Button>
        </div>
      </div>
    </main>
  );
}

async function findProgram(
  programID: number,
  token: string,
): Promise<
  Result<{
    name: string | null;
  }>
> {
  const searchPrograms = await db
    .select({
      name: programs.name,
    })
    .from(programShareInvites)
    .where(
      and(
        eq(programShareInvites.programId, programID),
        eq(programShareInvites.inviteToken, token),
      ),
    )
    .leftJoin(programs, eq(programs.id, programShareInvites.programId))
    .limit(1);

  if (searchPrograms.length === 0 || typeof searchPrograms[0] === "undefined") {
    return FailResult(new Error("Invalid token"));
  }

  return OkResult(searchPrograms[0]);
}

async function AccountRequiredHeading(props: {
  searchParams: Promise<Record<string, string | Array<string> | undefined>>;
}) {
  const sp = await props.searchParams;
  const programId = sp.programId;
  const token = sp.token;

  if (!programId || !token) {
    return notFound();
  }

  if (Array.isArray(programId) || Array.isArray(token)) {
    return notFound();
  }

  const parsedProgramID = Number.parseInt(programId, 10);
  if (Number.isNaN(parsedProgramID)) {
    return notFound();
  }

  const foundProgramResult = await findProgram(parsedProgramID, token);
  if (!foundProgramResult.ok) {
    return notFound();
  }
  return (
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
      You&apos;ve been invited to manage {foundProgramResult.data.name}
    </h2>
  );
}

function AccountRequiredHeadingFallback() {
  return (
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
      Loading...
    </h2>
  );
}

async function AccountLink(props: {
  searchParams: Promise<Record<string, string | Array<string> | undefined>>;
  children: React.ReactNode;
}) {
  const searchParams = await props.searchParams;
  const programId = searchParams.programId;
  const token = searchParams.token;
  return (
    <Link
      href={`/api/auth/signin?callbackUrl=${encodeURIComponent(
        `/accept-share?programId=${programId}&token=${token}`,
      )}`}
    >
      {props.children}
    </Link>
  );
}
