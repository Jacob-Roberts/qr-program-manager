import { env } from "#/env";
import { type SendVerificationRequestParams } from "next-auth/providers/email";
import { Resend } from "resend";
import "server-only";

import { MagicLinkAuthEmail } from "./magic-link-auth";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  const {
    identifier: email,
    url,
    provider: { from },
  } = params;
  try {
    console.log("Sending email to", email);
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Login Link to your Account",
      react: MagicLinkAuthEmail({
        loginCode: url,
      }) as React.ReactElement,
    });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.log({ error });
  }
};
