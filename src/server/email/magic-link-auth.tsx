import { env } from "#/env";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface MagicLinkAuthEmailProps {
  loginHref?: string;
}

const baseUrl = env.NEXT_PUBLIC_DEPLOY_URL;

export const MagicLinkAuthEmail = ({ loginHref }: MagicLinkAuthEmailProps) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white px-2 font-sans">
        <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Section className="mt-[32px]">
            <Img
              src={`${baseUrl}/static/qr-program-manager-round.png`}
              width="40"
              height="40"
              alt="QR Program Manager Logo"
              className="mx-auto my-0"
            />
          </Section>
          <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
            Login to <strong>QR Program Manager</strong>
          </Heading>
          <Section className="mb-[32px] mt-[32px] text-center">
            <Button
              className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
              href={loginHref}
            >
              Click here to log in with this magic link
            </Button>
          </Section>
          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          <Text className="text-[12px] leading-[24px] text-[#666666]">
            If you haven&apos;t requested this email, there&apos;s nothing to
            worry about - you can safely ignore it.
          </Text>
          <Img
            src={`${baseUrl}/static/qr-program-manager-round.png`}
            width="32"
            height="32"
            alt="QR Program Manager Logo"
          />
          <Text className="mb-6 mt-3">
            <Link
              href="https://qr-program-manager.vercel.app"
              className="text-sm text-[#2754C5] underline"
            >
              https://qr-program-manager.vercel.app
            </Link>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

MagicLinkAuthEmail.PreviewProps = {
  loginHref:
    "https://qr-program-manager.vercel.app/api/auth/callback/email?callbackUrl=https%3A%2F%2Fqr-program-manager.vercel.app%2Fadmin&token=1688cef6347d8fb716ac1ae171be2fde563e1ff61109b39b1953600811a0c2c8&email=jake.j.rob%40gmail.com",
} as MagicLinkAuthEmailProps;

export default MagicLinkAuthEmail;
