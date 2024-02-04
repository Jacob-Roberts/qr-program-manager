"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { useDoubleCheck } from "#/lib/client-utils";
import { api } from "#/trpc/react";
import React from "react";
import { useForm } from "react-hook-form";

const SharedWith = [
  {
    id: "1",
    email: "shadcn@gmail.com",
    profileImage: "https://github.com/shadcn.png",
  },
];

type ShareWithFriendsProps = {
  programId: number;
};

type FormData = {
  email: string;
};

export default function ShareWithFriends({ programId }: ShareWithFriendsProps) {
  const dc = useDoubleCheck();
  const [loading, setLoading] = React.useState(false);

  const unshareProgramMutation = api.program.unshareProgram.useMutation();
  const shareProgramMutation = api.program.shareProgram.useMutation();

  const { register, formState, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    shareProgramMutation.mutate({
      email: data.email,
      programId: programId,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black dark:text-white">
          Share Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-black dark:text-white">
            Share Document
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              autoFocus
              className="col-span-4 text-black dark:text-white"
              id="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
              placeholder="Add people you want to share this document with"
            />
            {formState.errors.email && (
              <p className="text-red-500 dark:text-red-400">
                {formState.errors.email.message}
              </p>
            )}
          </form>
        </div>
        <div className="grid gap-4 py-4">
          <h2 className="text-md font-semibold text-gray-900 dark:text-gray-50">
            People with Access
          </h2>
          {SharedWith.map(person => (
            <div className="flex flex-row gap-4" key={person.id}>
              <Avatar>
                <AvatarImage src={person.profileImage} />
                <AvatarFallback>{person.email[0]}</AvatarFallback>
              </Avatar>
              <div className="mr-auto flex flex-shrink flex-grow basis-0 flex-col">
                <p className="text-gray-900 dark:text-gray-50">
                  {person.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Can edit
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    {...dc.getButtonProps({
                      type: "button",
                      value: "Remove",
                      onClick: () => {
                        if (loading) return;
                        if (dc.doubleCheck) {
                          unshareProgramMutation.mutate({
                            programId: programId,
                            email: person.email,
                          });
                        }
                      },
                    })}
                    variant="destructive"
                  >
                    {dc.doubleCheck ? "Are you sure?" : "Remove"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-black dark:text-white">
                      Success!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This program is no longer shared with Shad.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-black dark:text-white">
                      Close
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="hidden" variant="outline">
            Show Dialog
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              The document has been successfully shared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
