"use client";

import { Icon } from "#/components/Icon";
import { LoadingSpinner } from "#/components/loading-spinner";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { env } from "#/env";
import { useDoubleCheck } from "#/lib/client-utils";
import { api } from "#/trpc/react";
import { UploadButton } from "#/utils/uploadthing";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import QRCode from "react-qr-code";

type ExistingProgramCardProps = {
  id: number;
  slug: string;
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

  return (
    <Card key={card.id} className="mx-auto w-full sm:w-96">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>{card.uploadedFileName}</CardTitle>
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
            className="ml-2 text-red-500 hover:text-red-600 active:text-red-700"
          >
            {loading ? (
              <LoadingSpinner />
            ) : dc.doubleCheck ? (
              `Are you sure?`
            ) : (
              <Icon name="trash-2" />
            )}
          </Button>
        </div>
        <CardDescription>Created {card.createdAt}</CardDescription>
        <CardDescription>Updated {card.updatedAt}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="flex justify-center text-xl">Replace File</Label>
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
            <QRCode value={`${env.NEXT_PUBLIC_DEPLOY_URL}/${card.slug}`} />
          </a>
        </div>
        {/* <Button className="self-start">Print QR Code</Button> */}
      </CardContent>
    </Card>
  );
}
