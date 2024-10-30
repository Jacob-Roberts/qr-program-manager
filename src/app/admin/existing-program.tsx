"use client";

import type { DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { InlineEdit } from "#/components/ui/inline-edit";
import { Input } from "#/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { env } from "#/env";
import { useDoubleCheck } from "#/lib/client-utils";
import { cn } from "#/lib/utils";
import { api } from "#/trpc/react";
import { UploadButton } from "#/utils/uploadthing";
import { Label } from "#components/ui/label.tsx";
import styles from "./existing-program.module.css";

import ShareWithFriends from "./share";

export type ExistingProgramCardProps = {
  id: number;
  slug: string;
  name: string;
  uploadedFileName: string;
  createdAt: string;
  updatedAt: string;
  sharedWithMe: boolean;
};

export function ExistingProgramCard({
  card,
  enableShareWithFriends,
}: {
  card: ExistingProgramCardProps;
  enableShareWithFriends: boolean;
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

  const loading = deleteProgramMutation.isPending || isLoading;

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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = useCallback(
    (type: "svg" | "png") => {
      if (type === "png") {
        const qrCodeCanvas = canvasRef.current;
        if (qrCodeCanvas == null) {
          return;
        }

        const dataURI = qrCodeCanvas.toDataURL("image/png");
        downloadStringAsFile(dataURI, `${card.slug}.png`);
      } else if (type === "svg") {
        const node = svgRef.current;
        if (node == null) {
          return;
        }

        // For SVG, we need to get the markup and turn it into XML.
        // Using XMLSerializer is the easiest way to ensure the markup
        // contains the xmlns. Then we make sure it gets the right DOCTYPE,
        // encode all of that to be safe to be encoded as a URI (which we
        // need to stuff into href).
        const serializer = new XMLSerializer();
        const fileURI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
          `<?xml version="1.0" standalone="no"?>${serializer.serializeToString(node)}`,
        )}`;

        downloadStringAsFile(fileURI, `${card.slug}.svg`);
      }
    },
    [card.slug],
  );

  return (
    <Card key={card.id} className="mx-auto flex w-full flex-col sm:w-96">
      <CardHeader className="relative">
        {card.sharedWithMe ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="absolute right-3 top-3 cursor-default">
                <Icon name="users" />
              </TooltipTrigger>
              <TooltipContent>
                <p>This program has been shared with you.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
        <CardTitle className="tracking-normal">
          <InlineEdit
            isRequired
            defaultValue={card.name}
            onCancel={() => console.log("cancel")}
            editView={(
              {
                disabled,
                errorMessage,
                isInvalid,
                name,
                onBlur,
                onChange,
                max,
                maxLength,
                min,
                minLength,
                pattern,
                required,
              },
              ref,
            ) => (
              <>
                <Input
                  className="mb-2 mt-[2px] h-10 text-2xl"
                  type="text"
                  disabled={disabled || isChangingName}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  max={max}
                  maxLength={maxLength}
                  min={min}
                  minLength={minLength}
                  pattern={pattern}
                  required={required}
                  ref={ref}
                />
                {isInvalid && errorMessage ? (
                  <span className="text-red-500">{errorMessage}</span>
                ) : null}
              </>
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
            onEdit={() => console.log("Edit")}
            onConfirm={value => {
              console.log("confirm", value);
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
                type="button"
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
              onBeforeUploadBegin={f => {
                setError(null);
                return f;
              }}
              onUploadError={error => {
                //@ts-expect-error upload thing error types are wrong
                if (error.cause?.data?.message === "File too large") {
                  setError("File is too large");
                } else {
                  setError(error.message);
                }
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
            rel="noreferrer"
          >
            <QRCodeCanvas
              ref={canvasRef}
              size={256}
              title={`${card.name} QR Code`}
              level="L"
              value={`${env.NEXT_PUBLIC_DEPLOY_URL}/${card.slug}`}
            />
            <div className="hidden" aria-hidden="true">
              <QRCodeSVG
                ref={svgRef}
                size={256}
                title={`${card.name} QR Code`}
                level="L"
                value={`${env.NEXT_PUBLIC_DEPLOY_URL}/${card.slug}`}
              />
            </div>
          </a>
        </div>
      </CardContent>
      <CardFooter className="mt-auto justify-between">
        <DownloadImageButton downloadImage={handleDownload} />
        {enableShareWithFriends ? (
          <ShareWithFriends programId={card.id} />
        ) : null}
        <Button
          {...dc.getButtonProps({
            type: "button",
            value: "delete",
            onClick: () => {
              if (loading) return;
              if (dc.doubleCheck) {
                deleteProgramMutation.mutate({
                  programId: card.id,
                  sharedWithMe: card.sharedWithMe,
                });
              }
            },
          })}
          variant="outline"
          size={dc.doubleCheck ? "default" : "icon"}
          className={cn(
            "min-w-10 text-red-500 hover:text-red-600 active:text-red-700",
            dc.doubleCheck && "w-30",
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

interface DownloadImageButtonProps extends DropdownMenuTriggerProps {
  downloadImage: (type: "svg" | "png") => void;
}

export function DownloadImageButton({
  className,
  downloadImage,
  ...props
}: DownloadImageButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props} asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn("relative z-10", className)}
        >
          {hasCopied ? (
            <Icon name="check" className="h-3 w-3" />
          ) : (
            <Icon name="download" className="h-3 w-3" />
          )}
          <span className="sr-only">Download image</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            downloadImage("svg");
            setHasCopied(true);
          }}
        >
          Vector (.svg)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            downloadImage("png");
            setHasCopied(true);
          }}
        >
          Raster (.png)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function downloadStringAsFile(data: string, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = data;
  a.click();
}
