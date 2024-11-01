"use server";

import { workUnitAsyncStorage } from "next/dist/server/app-render/work-unit-async-storage.external";
import { ReadonlyURLSearchParams } from "next/navigation";
import { z } from "zod";
import { signIn } from "#server/auth.ts";

// this is cursed and shouldn't be relied upon
function getSearchParams() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // biome-ignore lint/suspicious/noExplicitAny: undocumented secret usage
  const pageStore = workUnitAsyncStorage.getStore() as any;

  if (!pageStore?.url?.search) return new ReadonlyURLSearchParams();

  const readonlySearchParams = new ReadonlyURLSearchParams(
    pageStore.url.search,
  );

  return readonlySearchParams;
}

const googleAuthSchema = z.object({
  callbackUrl: z.string().optional().nullable(),
});

// biome-ignore lint/suspicious/noExplicitAny: we ignore previous state
export async function signInWithGoogle(_: any, formData: FormData) {
  const parsedFields = googleAuthSchema.safeParse(Object.entries(formData));
  const searchParams = getSearchParams();

  let _callback: string | undefined | null;
  if (parsedFields.success) {
    _callback = parsedFields.data.callbackUrl;
  } else if (searchParams.has("callbackUrl")) {
    _callback = searchParams.get("callbackUrl");
  }

  await signIn("google", {
    callbackUrl: _callback ?? "/admin",
  });
}

const userAuthSchema = z.object({
  email: z.string().email(),
  callbackUrl: z.string().optional().nullable(),
});

// biome-ignore lint/suspicious/noExplicitAny: we ignore previous state
export async function signInWithEmail(_: any, formData: FormData) {
  const searchParams = getSearchParams();

  const parsedFields = userAuthSchema.safeParse(Object.entries(formData));

  // Return early if the form data is invalid
  if (!parsedFields.success) {
    return {
      errors: parsedFields.error.flatten().fieldErrors,
    };
  }

  await signIn("email", {
    email: parsedFields.data.email,
    redirect: false,
    callbackUrl:
      parsedFields.data.callbackUrl ||
      searchParams.get("callbackUrl") ||
      "/admin",
  });

  return {
    errors: null,
  };
}
