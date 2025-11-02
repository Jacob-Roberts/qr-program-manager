"use server";

import { ReadonlyURLSearchParams } from "next/navigation";
import { z } from "zod/v4";
import { authClient } from "#/lib/auth-client";

// this is cursed and shouldn't be relied upon
function getSearchParams() {
  // Note: This is a workaround to access search params in server actions
  // Better-Auth handles callbacks more cleanly, so we may be able to simplify this
  return new ReadonlyURLSearchParams();
}

const googleAuthSchema = z.object({
  callbackUrl: z.string().optional().nullable(),
});

// biome-ignore lint/suspicious/noExplicitAny: we ignore previous state
export async function signInWithGoogle(_: any, formData: FormData) {
  const parsedFields = googleAuthSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  let _callback: string | undefined | null = "/admin";
  if (parsedFields.success) {
    _callback = parsedFields.data.callbackUrl ?? "/admin";
  }

  // Better-Auth handles redirects automatically after successful sign-in
  await authClient.signIn.social({
    provider: "google",
    callbackURL: _callback,
  });
}

const userAuthSchema = z.object({
  email: z.email(),
  callbackUrl: z.string().optional().nullable(),
});

// biome-ignore lint/suspicious/noExplicitAny: we ignore previous state
export async function signInWithEmail(_: any, formData: FormData) {
  const parsedFields = userAuthSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  // Return early if the form data is invalid
  if (!parsedFields.success) {
    return {
      errors: z.treeifyError(parsedFields.error),
    };
  }

  await authClient.signIn.magicLink({
    email: parsedFields.data.email,
    callbackURL: parsedFields.data.callbackUrl || "/admin",
  });

  return {
    errors: null,
  };
}
