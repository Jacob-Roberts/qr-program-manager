import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
// import { Button } from "#/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "#/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { auth } from "#/server/auth";

import { Icon } from "./Icon";

export async function UserButton() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="ml-auto h-9 w-9 cursor-pointer">
          <AvatarImage
            alt="User Avatar"
            src={session.user.image ?? undefined}
          />
          <AvatarFallback>{session.user.name?.[0] ?? "Me"}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-white p-0 dark:bg-white">
        <div className="mb-2 flex w-full min-w-0 flex-row flex-nowrap items-center justify-start gap-4 px-6 pt-4">
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt="User Avatar"
              src={session.user.image ?? undefined}
            />
            <AvatarFallback>{session.user.name?.[0] ?? "Me"}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col flex-nowrap items-stretch justify-center text-left">
            <p className="m-0 text-sm font-medium text-black dark:text-black">
              {session.user.name}
            </p>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-black/65 dark:text-black/65">
              {session.user.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col flex-nowrap items-stretch justify-start">
          {/* <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex min-h-9  flex-shrink flex-grow basis-0 flex-row items-center justify-start gap-4 rounded-md px-6 py-3 text-gray-700 transition-colors hover:bg-gray-200">
                <div className="flex basis-11 flex-row flex-nowrap items-stretch justify-center">
                  <Icon name="settings" />
                </div>
                <span className="text-sm">Manage Account</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <input
                    id="name"
                    value="Pedro Duarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="username" className="text-right">
                    Username
                  </label>
                  <input
                    id="username"
                    value="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
          <Link
            href="/api/auth/signout?callbackUrl=/"
            className="inline-flex min-h-9 flex-shrink flex-grow basis-0 flex-row items-center justify-start gap-4 rounded-md px-6 py-3 text-gray-700 transition-colors hover:bg-gray-200"
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
