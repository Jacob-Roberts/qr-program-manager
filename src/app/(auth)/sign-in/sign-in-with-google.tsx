"use client";

import { Button } from "#components/ui/button.tsx";
import Form from "next/form";
import { signInWithGoogle } from "./actions";
import { LoadingSpinner } from "#components/loading-spinner.tsx";
import { Icon } from "#components/Icon.tsx";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { CallbackUrlHiddenInput } from "./callback-url-hidden-input";

export function SignInWithGoogle() {
  const [_, submitAction, isGoogleLoading] = useActionState(
    signInWithGoogle,
    null,
  );

  return (
    <Form action={submitAction}>
      <CallbackUrlHiddenInput />
      <Button
        type="submit"
        variant="outline"
        className="dark:text-white w-full"
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <LoadingSpinner className="mr-2 h-4 w-4" />
        ) : (
          <Icon name="google" className="mr-2 h-10 w-10" />
        )}{" "}
        Continue with Google
      </Button>
    </Form>
  );
}
