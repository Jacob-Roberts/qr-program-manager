import { EditQRCode } from "#/components/edit-qrcode1.tsx";
import { unstable_noStore as noStore } from "next/cache";

export default function AdminPage() {
  noStore();

  const cards = [
    {
      id: "1",
      name: "QR Code 1",
      slug: "qr-code-1",
      createdAt: formatDate("2021-01-01"),
      uploadedFileName: "Ward Program 2024-01-21.pdf",
    },
    {
      id: "2",
      name: "QR Code 2",
      slug: "qr-code-2",
      createdAt: formatDate("2021-01-02"),
      uploadedFileName: "Ward Program 2024-01-21.pdf",
    },
    {
      id: "3",
      name: "QR Code 3",
      slug: "qr-code-3",
      createdAt: formatDate("2024-01-03"),
      uploadedFileName: "Ward Program 2024-01-21.pdf",
    },
  ];
  return <EditQRCode cards={cards} />;
}

function formatDate(date: string) {
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
