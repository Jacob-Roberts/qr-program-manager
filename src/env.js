import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    // APPLE_CLIENT_ID: z.string(),
    // APPLE_CLIENT_SECRET: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    RESEND_API_KEY: z.string(),
    ENABLE_EMAIL_INVITES: z.coerce.boolean().optional().default(false),
    OVERRIDE_ENABLE_SHARE_WITH_FRIENDS: z.coerce
      .boolean()
      .optional()
      .default(false),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_DEPLOY_URL: z.string().url(),
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_PLAUSIBLE_SELF_HOSTED: z.boolean({ coerce: true }),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    // APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
    NEXT_PUBLIC_DEPLOY_URL: process.env.NEXT_PUBLIC_DEPLOY_URL,
    ENABLE_EMAIL_INVITES: process.env.ENABLE_EMAIL_INVITES,
    OVERRIDE_ENABLE_SHARE_WITH_FRIENDS:
      process.env.OVERRIDE_ENABLE_SHARE_WITH_FRIENDS,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN:
      process.env.NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_SELF_HOSTED:
      process.env.NEXT_PUBLIC_PLAUSIBLE_SELF_HOSTED,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
