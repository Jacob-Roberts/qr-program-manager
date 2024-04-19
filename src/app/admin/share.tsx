"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icon } from "#/components/Icon";
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

type ShareWithFriendsProps = {
  programId: number;
};

const formSchema = z.object({
  email: z.string().email("Email is invalid"),
});

export default function ShareWithFriends({ programId }: ShareWithFriendsProps) {
  const sharesQuery = api.program.shares.useQuery({ programId: programId });
  const shareProgramMutation = api.program.shareProgram.useMutation();
  const [mutationLoading, setMutationLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (shareProgramMutation.isPending) return;

    setMutationLoading(true);

    await shareProgramMutation.mutateAsync({
      email: values.email,
      programId: programId,
    });

    form.resetField("email");

    await sharesQuery.refetch();

    setMutationLoading(false);
  }

  const shareLoading = shareProgramMutation.isPending || mutationLoading;

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
          {sharesQuery.data?.shares.length === 0 &&
            sharesQuery.data?.invites.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                No one has access to this document yet
              </p>
            )}
          {sharesQuery.data?.shares.map(share => (
            <SharedRow
              share={share}
              key={`${share.programId}_${share.userId}`}
              refetchShare={sharesQuery.refetch}
            />
          ))}
          {sharesQuery.data?.invites.map(invite => (
            <InvitedRow
              key={`${invite.programId}_${invite.email}`}
              invite={invite}
              refetchInvite={sharesQuery.refetch}
            />
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

type SharedRowProps = {
  share: {
    programId: number;
    userId: string;
    userImage: string | null;
    userName: string | null;
    userEmail: string | null;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetchShare: () => Promise<any>;
};

function SharedRow({ share, refetchShare }: SharedRowProps) {
  const dc = useDoubleCheck();

  const unshareProgramMutation = api.program.unshareProgram.useMutation();
  const [unshareRefetching, setUnshareRefetching] = useState(false);

  const mutationLoading = unshareProgramMutation.isPending || unshareRefetching;

  return (
    <div className="flex flex-row gap-4">
      <Avatar>
        <AvatarImage src={share.userImage ?? undefined} />
        <AvatarFallback>
          {share.userName?.[0] ?? share.userEmail?.[0] ?? null}
        </AvatarFallback>
      </Avatar>
      <div className="mr-auto flex flex-shrink flex-grow basis-0 flex-col">
        <p className="text-gray-900 dark:text-gray-50">{share.userEmail}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Can edit</p>
      </div>
      <Button
        {...dc.getButtonProps({
          type: "button",
          value: "Remove",
          onClick: () => {
            if (mutationLoading) return;
            if (dc.doubleCheck) {
              async function removeShare() {
                setUnshareRefetching(true);
                await unshareProgramMutation.mutateAsync({
                  programId: share.programId,
                  userId: share.userId,
                });
                await refetchShare();
                setUnshareRefetching(false);
              }
              void removeShare();
            }
          },
          disabled: mutationLoading,
        })}
        variant={dc.doubleCheck ? "destructive" : "secondary"}
      >
        {dc.doubleCheck ? "Are you sure?" : "Remove"}{" "}
        {mutationLoading && <LoadingSpinner className="ml-2" />}
      </Button>
    </div>
  );
}

type InvitedRowProps = {
  invite: {
    programId: number;
    email: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetchInvite: () => Promise<any>;
};

function InvitedRow({ invite, refetchInvite }: InvitedRowProps) {
  const dc = useDoubleCheck();

  const uninviteProgramMutation = api.program.uninviteProgram.useMutation();
  const [uninviteRefetching, setUninviteRefetching] = useState(false);

  const mutationLoading =
    uninviteProgramMutation.isPending || uninviteRefetching;
  return (
    <div className="flex flex-row gap-4">
      <Avatar>
        <AvatarFallback>{invite.email[0] ?? null}</AvatarFallback>
      </Avatar>
      <div className="mr-auto flex flex-shrink flex-grow basis-0 flex-col">
        <p className="text-gray-900 dark:text-gray-50">{invite.email}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <Icon name="check" /> Invited
        </p>
      </div>
      <Button
        {...dc.getButtonProps({
          type: "button",
          value: "Remove",
          onClick: () => {
            if (mutationLoading) return;
            if (dc.doubleCheck) {
              async function removeShare() {
                setUninviteRefetching(true);
                await uninviteProgramMutation.mutateAsync({
                  programId: invite.programId,
                  email: invite.email,
                });
                await refetchInvite();
                setUninviteRefetching(false);
              }
              void removeShare();
            }
          },
          disabled: mutationLoading,
        })}
        variant={dc.doubleCheck ? "destructive" : "secondary"}
      >
        {dc.doubleCheck ? "Are you sure?" : "Remove"}{" "}
        {uninviteRefetching && <LoadingSpinner className="ml-2" />}
      </Button>
    </div>
  );
}
