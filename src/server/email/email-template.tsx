import { env } from "#/env";
import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  inviteToken: string;
  programId: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  inviteToken,
  programId,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>
      Your invite token is <strong>{inviteToken}</strong>.
    </p>
    <p>
      Accept the invite by clicking the link below:
      <a
        href={`${env.NEXT_PUBLIC_DEPLOY_URL}/accept-share?programId=${programId}&token=${inviteToken}`}
      >
        Accept Invite
      </a>
    </p>
  </div>
);
