import { get } from "@vercel/edge-config";
import { unstable_noStore as noStore } from "next/cache";
import { env } from "#/env";

import { AddNewProgram } from "./add-new-program";
import {
  ExistingProgramCard,
  type ExistingProgramCardProps,
} from "./existing-program";

type EditQRCodeProps = {
  programs: ExistingProgramCardProps[];
};

export async function EditQRCode({ programs }: EditQRCodeProps) {
  noStore();

  const enableShareWithFriends =
    Boolean(await get("enableShareWithFriends")) ||
    env.OVERRIDE_ENABLE_SHARE_WITH_FRIENDS;

  return (
    <main className="flex-1 p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {programs.map(card => (
          <ExistingProgramCard
            key={card.id}
            card={card}
            enableShareWithFriends={
              enableShareWithFriends && !card.sharedWithMe
            }
          />
        ))}
        <AddNewProgram />
      </div>
    </main>
  );
}
