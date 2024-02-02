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
// import { InlineEdit } from "#/components/ui/inline-edit";
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
  const [isChangingName, startTransitionChangingName] = useTransition();
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

  // const utils = api.useUtils();
  const changeNameMutation = api.program.changeName.useMutation({
    onSuccess: () => {
      startTransitionChangingName(() => {
        router.refresh();
      });
    },
  });
  // {
  //   onMutate: async ({ id, name }) => {
  //     // Cancel any outgoing refetches
  //     // (so they don't overwrite our optimistic update)
  //     await utils.program.getPrograms.cancel();

  //     // Snapshot the previous value
  //     const previousPrograms = utils.program.getPrograms.getData();

  //     debugger;

  //     // Optimistically update to the new value
  //     utils.program.getPrograms.setData(undefined, prevPrograms => {
  //       debugger;
  //       if (!prevPrograms) return;
  //       debugger;
  //       return prevPrograms.map(program => {
  //         if (program.id === id) {
  //           return {
  //             ...program,
  //             name,
  //           };
  //         }
  //         return program;
  //       });
  //     });

  //     // Return a context with the previous and new values
  //     return { previousPrograms };
  //   },
  //   // If the mutation fails, use the context to roll back
  //   onError: (err, variables, context) => {
  //     if (context?.previousPrograms) {
  //       utils.program.getPrograms.setData(undefined, context.previousPrograms);
  //     }
  //   },
  //   // Always refetch after error or success:
  //   onSettled: () => {
  //     void utils.program.getPrograms.invalidate();
  //   },
  // });

  const canvasID = `${card.id.toString()}-qr-canvas`;

  return (
    <Card key={card.id} className="mx-auto flex w-full flex-col sm:w-96">
      <CardHeader>
        <CardTitle className="tracking-normal">
          <InlineEdit
            isRequired
            defaultValue={card.name}
            editView={(
              {
                id,
                value,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                errorMessage,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                isRequired,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                isInvalid,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                isDisabled,
                ...rest
              },
              ref,
            ) => (
              <Input
                ref={ref}
                className={"mb-2 mt-[6px] h-10 text-2xl"}
                value={value}
                id={id}
                disabled={isChangingName}
                {...rest}
              />
            )}
            readView={() => (
              <Label
                className={cn(
                  styles.customLabel,
                  "ml-1 flex min-h-7 max-w-full border border-transparent px-3 py-2 text-2xl hover:cursor-text dark:text-white  dark:hover:text-slate-900",
                )}
              >
                {card.name} {isChangingName ? <LoadingSpinner /> : null}
              </Label>
            )}
            onConfirm={value => {
              if (
                typeof value === "string" &&
                value !== "" &&
                value !== card.name &&
                !isChangingName
              ) {
                changeNameMutation.mutate({
                  id: card.id,
                  name: value,
                });
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
              <div
                className="h-[1.25rem] text-xs leading-5 text-gray-600"
                data-state="ready"
                data-ut-element="allowed-content"
              >
                Pdf (4MB)
              </div>
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
