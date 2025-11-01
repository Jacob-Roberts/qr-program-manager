import { Suspense } from "react";
import { EditQRCode, EditQRCodeSkeleton } from "./edit-qrcode.tsx";

export default function AdminPage() {
  return (
    <main className="flex-1 p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <Suspense fallback={<EditQRCodeSkeleton />}>
          <EditQRCode />
        </Suspense>
      </div>
    </main>
  );
}
