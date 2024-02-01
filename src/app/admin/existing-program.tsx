"use client";

import styles from "./existing-program.module.css";

import { Icon } from "#/components/Icon";
import { LoadingSpinner } from "#/components/loading-spinner";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { env } from "#/env";
import { useDoubleCheck } from "#/lib/client-utils";
import { cn } from "#/lib/utils";
import { api } from "#/trpc/react";
import { UploadButton } from "#/utils/uploadthing";
import InlineEdit from "@atlaskit/inline-edit";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useState, useTransition } from "react";

export type ExistingProgramCardProps = {
  id: number;
  slug: string;
  name: string;
  uploadedFileName: string;
  createdAt: string;
  updatedAt: string;
};

export function ExistingProgramCard({
  card,
}: {
  card: ExistingProgramCardProps;
}) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const dc = useDoubleCheck();

  const [error, setError] = useState<string | null>(null);

  const deleteProgramMutation = api.program.deleteProgram.useMutation({
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
    },
  });

  const loading = deleteProgramMutation.isLoading || isLoading;

  const utils = api.useUtils();
  const changeNameMutation = api.program.changeName.useMutation({
    // onMutate: async ({ id, name }) => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await utils.program.getPrograms.cancel();
    //   // Snapshot the previous value
    //   const previousProgram = utils.program.getPrograms.getData();
    //   // Optimistically update to the new value
    //   utils.todo.findAll.setData(
    //     undefined,
    //     (oldQueryData: TodoWithUser[] | undefined) =>
    //       [
    //         ...(oldQueryData ?? []),
    //         {
    //           author: {
    //             name: session?.user?.name,
    //             id: session?.user?.id,
    //           },
    //           content: newTodo.content,
    //           done: false,
    //           createdAt: new Date(),
    //           updatedAt: new Date(),
    //         },
    //       ] as TodoWithUser[],
    //   );
    //   // Return a context object with the snapshotted value
    //   return { previousTodos };
    // },
    // onError: (err, _newTodo, context) => {
    //   // Rollback to the previous value if mutation fails
    //   utils.todo.findAll.setData(undefined, context?.previousTodos);
    // },
    // onSuccess: () => {
    //   console.log("inside onSuccess");
    // },
    // onSettled: () => {
    //   void utils.todo.findAll.invalidate();
    // },
  });

  const canvasID = `${card.id.toString()}-qr-canvas`;

  return (
    <Card key={card.id} className="mx-auto flex w-full flex-col sm:w-96">
      <CardHeader>
        <CardTitle className="tracking-normal">
          <InlineEdit
            isRequired
            defaultValue={card.name}
            editView={({ errorMessage, ...fieldProps }) => (
              <Input className={"h-10"} {...fieldProps} />
            )}
            readView={() => (
              <Label
                className={cn(
                  styles.customLabel,
                  "ml-1 flex max-w-full px-3 py-2 text-sm hover:cursor-text dark:text-white  dark:hover:text-slate-900",
                )}
              >
                {card.name}
              </Label>
            )}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onConfirm={value => {
              if (typeof value === "string" && value !== "") {
                changeNameMutation.mutate(
                  {
                    id: card.id,
                    name: value,
                  },
                  {
                    onSuccess: () => {
                      router.refresh();
                    },
                  },
                );
              }
            }}
          />
        </CardTitle>
        <CardDescription>Created {card.createdAt}</CardDescription>
        <CardDescription>Updated {card.updatedAt}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="flex justify-center text-xl">
            {card.uploadedFileName}
          </Label>
          {loading ? (
            // Dummy button to keep the layout the same
            <div className="flex flex-col items-center justify-center gap-1">
              <button
                className="relative flex h-10 w-36 items-center justify-center overflow-hidden rounded-md bg-blue-400 text-gray-100 after:transition-[width] after:duration-500 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2"
                disabled
              >
                Choose File
              </button>
            </div>
          ) : (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={() => {
                // Do something with the response
                router.refresh();
              }}
              onUploadError={(error: Error) => {
                setError(error.message);
              }}
              input={{ programId: card.id }}
            />
          )}
          {error && <div className="text-red-500">{error}</div>}
        </div>
        <div className="flex items-center justify-center">
          <a
            target="_blank"
            href={`/${card.slug}`}
            className="rounded-lg bg-white p-4"
          >
            <QRCodeCanvas
              id={canvasID}
              size={256}
              value={`${env.NEXT_PUBLIC_DEPLOY_URL}/${card.slug}`}
            />
          </a>
        </div>
      </CardContent>
      <CardFooter className="mt-auto justify-between">
        <Button
          variant="outline"
          size="icon"
          className=""
          onClick={() => {
            const qrCodeCanvas = document.getElementById(canvasID);
            if (qrCodeCanvas === null) {
              return;
            }

            //@ts-expect-error toDataURL
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            const url = qrCodeCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `${card.slug}.png`;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            link.href = url;
            link.click();
          }}
        >
          <Icon name="download" />
        </Button>
        <Button
          {...dc.getButtonProps({
            type: "button",
            value: "delete",
            onClick: () => {
              if (loading) return;
              if (dc.doubleCheck) {
                deleteProgramMutation.mutate(card.id);
              }
            },
          })}
          variant="outline"
          size={dc.doubleCheck ? "default" : "icon"}
          className={cn(
            "min-w-10 text-red-500 hover:text-red-600 active:text-red-700",
            dc.doubleCheck && "w-44",
          )}
        >
          {loading ? (
            <LoadingSpinner />
          ) : dc.doubleCheck ? (
            `Are you sure?`
          ) : (
            <Icon name="trash-2" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
