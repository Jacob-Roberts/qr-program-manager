import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "#/components/Icon";
import { cn } from "#/lib/utils";
import { auth } from "#/server/auth";

export const experimental_ppr = true;

export default function Home() {
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <span className="-m-1.5 p-1.5">
              <span className="sr-only">QR Program Manager</span>
              <Icon name="logo" className="h-12 w-12 text-black" />
            </span>
          </div>
          <div className="flex flex-1 justify-end">
            <Suspense fallback={<StaticSignInLink isSignedIn={false} />}>
              <DynamicSignInLink />
            </Suspense>
          </div>
        </nav>
      </header>

      <main className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              QR Program Manager
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Easily digitize the physical world with QR codes. Create a QR code
              for anything, and manage the content behind it. No app required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Suspense
                fallback={<StaticGetStartedButton isSignedIn={false} />}
              >
                <DynamicGetStartedButton />
              </Suspense>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </main>
    </div>
  );
}

async function DynamicSignInLink() {
  const session = await auth();
  return <StaticSignInLink isSignedIn={session !== null} />;
}

function StaticSignInLink({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <Link
      href={isSignedIn ? "/admin" : "/sign-in?callbackUrl=/admin"}
      className={cn(
        `rounded-full border border-indigo-500 bg-white/10 px-10 py-3 text-sm font-semibold leading-6 text-indigo-500 no-underline transition hover:bg-indigo-500 hover:text-white`,
      )}
    >
      {isSignedIn ? "Dashboard" : "Sign in"} &rarr;
    </Link>
  );
}

async function DynamicGetStartedButton() {
  const session = await auth();
  return <StaticGetStartedButton isSignedIn={session !== null} />;
}

function StaticGetStartedButton({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <Link
      href={isSignedIn ? "/admin" : "/sign-in?callbackUrl=/admin"}
      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Get started
    </Link>
  );
}
