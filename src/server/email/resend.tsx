import "server-only";

import type { EmailConfig } from "next-auth/providers/email";
import { Resend } from "resend";
import { env } from "#/env";

import { MagicLinkAuthEmail } from "./magic-link-auth";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationRequest: EmailConfig["sendVerificationRequest"] =
  async params => {
    const { identifier: email, provider, url } = params;
    console.log("Sending email to", email);
    const { error } = await resend.emails.send({
      from: provider.from ?? "noreply@accounts.jakerob.pro",
      to: [email],
      subject: "Login Link to your Account",
      react: MagicLinkAuthEmail({
        loginHref: url,
      }),
    });
    if (error) {
      throw error;
    }
  };
