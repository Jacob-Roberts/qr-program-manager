import { env } from "#/env";
import { type SendVerificationRequestParams } from "next-auth/providers/email";
import { Resend } from "resend";
import "server-only";

import { MagicLinkAuthEmail } from "./magic-link-auth";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  const { identifier: email, url } = params;
  try {
    console.log("Sending email to", email);
    const { error } = await resend.emails.send({
      from: "QR Program Manager <onboarding@resend.dev>",
      to: [email],
      subject: "Login Link to your Account",
      react: MagicLinkAuthEmail({
        loginHref: url,
      }) as React.ReactElement,
    });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.log({ error });
  }
};
