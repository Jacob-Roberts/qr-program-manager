import { api } from "#/trpc/server";
import { unstable_noStore as noStore } from "next/cache";

import { EditQRCode } from "./edit-qrcode.tsx";

export default async function AdminPage() {
  noStore();

  const cards = (await api.program.getPrograms.query()).map(card => ({
    id: card.id,
    slug: card.slug,
    createdAt: formatDate(card.createdAt),
    updatedAt: formatDate(card.updatedAt),
    uploadedFileName: card.fileUploadName,
  }));

  return <EditQRCode cards={cards} />;
}

function formatDate(date: string | Date) {
  if (date instanceof Date) {
    date = date.toISOString();
  }
  noStore();
  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

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
