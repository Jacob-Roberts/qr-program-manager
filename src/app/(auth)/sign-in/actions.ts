"use server";

import { z } from "zod";
import { signIn } from "#server/auth.ts";

const googleAuthSchema = z.object({
  callbackUrl: z.string().optional(),
});

export async function signInWithGoogle(_: any, formData: FormData) {
  const parsedFields = googleAuthSchema.safeParse({
    callbackUrl: formData.get("callbackUrl"),
  });

  let _callback: string | undefined;
  if (parsedFields.success) {
    _callback = parsedFields.data.callbackUrl;
  }
  await signIn("google", {
    callbackUrl: _callback ?? "/admin",
  });
}

const userAuthSchema = z.object({
  email: z.string().email(),
  callbackUrl: z.string().optional(),
});

export async function signInWithEmail(_: any, formData: FormData) {
  const parsedFields = userAuthSchema.safeParse({
    email: formData.get("email"),
    callbackUrl: formData.get("callbackUrl"),
  });

  // Return early if the form data is invalid
  if (!parsedFields.success) {
    return {
      errors: parsedFields.error.flatten().fieldErrors,
    };
  }

  await signIn("email", {
    email: parsedFields.data.email,
    redirect: false,
    callbackUrl: parsedFields.data.callbackUrl ?? "/admin",
  });

  return {
    errors: null,
  };
}
