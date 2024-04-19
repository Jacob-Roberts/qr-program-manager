import "server-only";

import type { SendVerificationRequestParams } from "next-auth/providers/email";
import { Resend } from "resend";
import { env } from "#/env";

import { MagicLinkAuthEmail } from "./magic-link-auth";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  const { identifier: email, url } = params;
  console.log("Sending email to", email);
  const { error } = await resend.emails.send({
    from: "QR Program Manager <noreply@accounts.jakerob.pro>",
    to: [email],
    subject: "Login Link to your Account",
    react: MagicLinkAuthEmail({
      loginHref: url,
    }) as React.ReactElement,
  });
  if (error) {
    throw error;
  }
};
