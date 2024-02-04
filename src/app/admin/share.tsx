"use client";

import { LoadingSpinner } from "#/components/loading-spinner";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { useDoubleCheck } from "#/lib/client-utils";
import { api } from "#/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ShareWithFriendsProps = {
  programId: number;
};

const formSchema = z.object({
  email: z.string().email("Email is invalid"),
});

export default function ShareWithFriends({ programId }: ShareWithFriendsProps) {
  const dc = useDoubleCheck();

  const sharesQuery = api.program.shares.useQuery({ programId: programId });
  const unshareProgramMutation = api.program.unshareProgram.useMutation();
  const shareProgramMutation = api.program.shareProgram.useMutation();

  const [unshareRefetching, setUnshareRefetching] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (shareProgramMutation.isLoading) return;

    shareProgramMutation.mutate({
      email: values.email,
      programId: programId,
    });
  }

  const shareLoading = shareProgramMutation.isLoading;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black dark:text-white">
          Share Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-black dark:text-white">
            Share Document
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-black dark:text-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add people you want to share this document with
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={shareLoading}>
                Share {shareLoading && <LoadingSpinner className="ml-2" />}
              </Button>
            </form>
          </Form>
        </div>
        <div className="grid gap-4 py-4">
          <h2 className="text-md font-semibold text-gray-900 dark:text-gray-50">
            People with Access
          </h2>
          {sharesQuery.isLoading && <LoadingSpinner />}
          {sharesQuery.error && (
            <p className="text-red-500 dark:text-red-400">
              {sharesQuery.error.message}
            </p>
          )}
          {sharesQuery.data?.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              No one has access to this document yet
            </p>
          )}
          {sharesQuery.data?.map(share => (
            <div
              className="flex flex-row gap-4"
              key={`${share.programShare.programId}_${share.programShare.userId}`}
            >
              <Avatar>
                <AvatarImage src={share.user?.image ?? undefined} />
                <AvatarFallback>
                  {share.user?.name?.[0] ?? share.user?.email?.[0] ?? null}
                </AvatarFallback>
              </Avatar>
              <div className="mr-auto flex flex-shrink flex-grow basis-0 flex-col">
                <p className="text-gray-900 dark:text-gray-50">
                  {share.user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Can edit
                </p>
              </div>
              <Button
                {...dc.getButtonProps({
                  type: "button",
                  value: "Remove",
                  onClick: () => {
                    if (unshareProgramMutation.isLoading || unshareRefetching)
                      return;
                    if (dc.doubleCheck) {
                      async function removeShare() {
                        setUnshareRefetching(true);
                        await unshareProgramMutation.mutateAsync({
                          programId: programId,
                          userId: share.programShare.userId,
                        });
                        await sharesQuery.refetch();
                        setUnshareRefetching(false);
                      }
                      void removeShare();
                    }
                  },
                  disabled: unshareProgramMutation.isLoading,
                })}
                variant={dc.doubleCheck ? "destructive" : "secondary"}
              >
                {dc.doubleCheck ? "Are you sure?" : "Remove"}{" "}
                {unshareRefetching && <LoadingSpinner className="ml-2" />}
              </Button>
            </div>
          ))}
        </div>
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
