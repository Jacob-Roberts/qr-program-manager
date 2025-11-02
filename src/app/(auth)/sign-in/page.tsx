import type { Metadata } from "next";
import { Icon } from "#/components/Icon";
import { cn } from "#/lib/utils";
import styles from "./authentication.module.css";
import { SignInWithEmail } from "./sign-in-with-email.tsx";
import { SignInWithGoogle } from "./sign-in-with-google.tsx";
import { SignInWithPasskey } from "./sign-in-with-passkey.tsx";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-slate-800">
      <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div
          className={cn(
            "z-10 hidden h-[150%] bg-slate-300 lg:block dark:bg-slate-900",
            styles.wrapper,
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/login-pattern.svg"
            alt="Pattern Background"
            className="z-20 min-h-full min-w-full object-cover"
          />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <Icon
                name="logo"
                className="mx-auto h-12 w-12 text-black dark:text-white"
              />
              <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                Sign in to your account
              </h1>
              <p className="text-sm text-slate-700 dark:text-slate-50">
                Enter your email below to continue.
              </p>
            </div>
            <div className={"grid gap-6"}>
              <SignInWithEmail />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-700 dark:bg-slate-800 dark:text-gray-50">
                    Or
                  </span>
                </div>
              </div>
              <SignInWithPasskey />
              <SignInWithGoogle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
