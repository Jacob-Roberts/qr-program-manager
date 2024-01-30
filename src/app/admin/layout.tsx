import { Icon } from "#/components/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { getServerAuthSession } from "#/server/auth";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="flex h-16 w-full items-center border-b bg-white px-4 md:px-6 dark:bg-gray-800 dark:text-gray-100">
        <span className="-m-1.5 p-1.5">
          <span className="sr-only">QR Program Manager</span>
          <Icon name="logo" className="h-12 w-12 text-black dark:text-white" />
        </span>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="ml-auto h-9 w-9 cursor-pointer">
              <AvatarImage
                alt="User Avatar"
                src={session.user.image ?? undefined}
              />
              <AvatarFallback>{session.user.name?.[0] ?? "Me"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem>
              <Link href="/api/auth/signout">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
