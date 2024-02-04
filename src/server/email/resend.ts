import { env } from "#/env";
import { Resend } from "resend";
import "server-only";

export const resend = new Resend(env.RESEND_API_KEY);
