import { api } from "#/trpc/server";
import { get } from "@vercel/edge-config";
import { env } from "#/env";

import { AddNewProgram } from "./add-new-program";
import { ExistingProgramCard } from "./existing-program";

export async function EditQRCode() {
  const enableShareWithFriends =
    Boolean(await get("enableShareWithFriends")) ||
    env.OVERRIDE_ENABLE_SHARE_WITH_FRIENDS;
  const programs = await api.program.getPrograms();

  return (
    <>
      {programs
        .map(card => ({
          id: card.id,
          slug: card.slug,
          name: card.name,
          createdAt: formatDate(card.createdAt),
          updatedAt: formatDate(card.updatedAt),
          uploadedFileName: card.fileUploadName,
          sharedWithMe: card.shared,
        }))
        .map(card => (
          <ExistingProgramCard
            key={card.id}
            card={card}
            enableShareWithFriends={
              enableShareWithFriends && !card.sharedWithMe
            }
          />
        ))}
      <AddNewProgram />
    </>
  );
}

function formatDate(date: string | Date) {
  let dateString = "";
  if (date instanceof Date) {
    dateString = date.toISOString();
  } else {
    dateString = date;
  }
  const currentDate = new Date();
  if (!dateString.includes("T")) {
    dateString = `${dateString}T00:00:00`;
  }
  const targetDate = new Date(dateString);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `${fullDate} (${formattedDate})`;
}
