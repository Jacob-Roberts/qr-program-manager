"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { LoadingSpinner } from "#components/loading-spinner.tsx";
import { authClient } from "#/lib/auth-client";
import { toast } from "sonner";
import { Icon } from "#/components/Icon";

export function SignInWithPasskey() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePasskeySignIn = async () => {
    try {
      setIsLoading(true);

      await authClient.signIn.passkey({
        // Enable conditional UI for passkey autofill
        autoFill: true,
      });

      toast.success("Signed in successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Passkey sign-in error:", error);
      toast.error("Failed to sign in with passkey", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="dark:text-white w-full"
      onClick={handlePasskeySignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSpinner className="mr-2 h-4 w-4" />
      ) : (
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      )}
      Sign In with Passkey
    </Button>
  );
}
