import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { env } from "#/env";

import { db } from "#/server/db";
import { sendVerificationRequest } from "../email/resend";
import {
  users,
  sessions,
  accounts,
  verifications,
  passkeys,
} from "./db-schema";

/**
 * Better Auth configuration
 *
 * @see https://better-auth.com/docs
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts,
      verifications,
      passkeys,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: false, // We're using magic links only for email auth
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        await sendVerificationRequest({
          identifier: email,
          url,
          provider: {
            id: "email",
            from: "QR Program Manager <noreply@accounts.jakerob.pro>",
          },
          theme: {
            logo: "/icon.svg",
            colorScheme: "auto",
          },
        });
      },
    }),
    passkey({
      rpID:
        env.NODE_ENV === "production"
          ? new URL(env.NEXT_PUBLIC_DEPLOY_URL).hostname
          : "localhost",
      rpName: "QR Program Manager",
      origin: env.NEXT_PUBLIC_DEPLOY_URL,
    }),
  ],
});
