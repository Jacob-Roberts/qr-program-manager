"use client";

import Form from "next/form";
import { useActionState } from "react";
import { LoadingSpinner } from "#components/loading-spinner.tsx";
import { Button } from "#components/ui/button.tsx";
import { Input } from "#components/ui/input.tsx";
import { Label } from "#components/ui/label.tsx";
import { signInWithEmail } from "./actions.ts";
import { toast } from "sonner";
import { CallbackUrlHiddenInput } from "./callback-url-hidden-input";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function submitSignInWithEmail(prev: any, formData: FormData) {
  const res = await signInWithEmail(prev, formData);
  toast.success("Check your email", {
    description: "We sent you a login link. Be sure to check your spam too.",
  });
  return res;
}

export function SignInWithEmail() {
  const [state, submitAction, isPending] = useActionState(
    submitSignInWithEmail,
    {
      errors: null,
    },
  );

  const { errors } = state;

  return (
    <Form action={submitAction}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect="off"
            className="dark:text-white"
            required
            disabled={isPending}
          />
          {errors?.email && (
            <p className="px-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>
        <CallbackUrlHiddenInput />
        <Button type="submit" disabled={isPending}>
          {isPending && <LoadingSpinner className="mr-2 h-4 w-4" />}
          Sign In with Email
        </Button>
      </div>
    </Form>
  );
}
