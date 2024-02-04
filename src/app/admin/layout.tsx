import { Icon } from "#/components/Icon";
import { UserButton } from "#/components/user-button";
import { unstable_noStore as noStore } from "next/cache";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="flex h-16 w-full items-center border-b bg-white px-4 md:px-6 dark:bg-gray-800 dark:text-gray-100">
        <span className="-m-1.5 p-1.5">
          <span className="sr-only">QR Program Manager</span>
          <Icon name="logo" className="h-12 w-12 text-black dark:text-white" />
        </span>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <UserButton />
      </header>
      {children}
      <footer className="flex h-16 w-full items-center border-t bg-white px-4 md:px-6 dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 QR Program Manager. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
