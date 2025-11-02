import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { auth } from "#/server/auth";
import { headers } from "next/headers";
import { AddPasskeyButton } from "./add-passkey-button";

import { Icon } from "./Icon";

export async function UserButton() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="ml-auto h-9 w-9 cursor-pointer">
          <AvatarImage alt="User Avatar" src={user.image ?? undefined} />
          <AvatarFallback>{user.name?.[0] ?? "Me"}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-white p-0 dark:bg-white">
        <div className="mb-2 flex w-full min-w-0 flex-row flex-nowrap items-center justify-start gap-4 px-6 pt-4">
          <Avatar className="h-9 w-9">
            <AvatarImage alt="User Avatar" src={user.image ?? undefined} />
            <AvatarFallback>{user.name?.[0] ?? "Me"}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col flex-nowrap items-stretch justify-center text-left">
            <p className="m-0 text-sm font-medium text-black dark:text-black">
              {user.name}
            </p>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-black/65 dark:text-black/65">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col flex-nowrap items-stretch justify-start gap-2 p-2">
          <AddPasskeyButton />
          <Link
            href="/api/auth/sign-out"
            className="inline-flex min-h-9 shrink grow basis-0 flex-row items-center justify-start gap-4 rounded-md px-6 py-3 text-gray-700 transition-colors hover:bg-gray-200"
          >
            <div className="flex basis-11 flex-row flex-nowrap items-stretch justify-center">
              <Icon name="log-out" />
            </div>
            <span className="text-sm">Sign Out</span>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function UserButtonFallback() {
  return (
    <Avatar className="ml-auto h-9 w-9 cursor-pointer">
      <AvatarFallback />
    </Avatar>
  );
}
