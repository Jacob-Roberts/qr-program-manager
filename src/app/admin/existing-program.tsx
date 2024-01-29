"use client";

import { Icon } from "#/components/Icon";
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
import { useState } from "react";
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
  const dc = useDoubleCheck();

  const [error, setError] = useState<string | null>(null);

  const deleteProgramMutation = api.program.deleteProgram.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Card key={card.id} className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex flex-row items-center">
          <CardTitle>{card.uploadedFileName}</CardTitle>
          {/* <Button
            variant="outline"
            size="icon"
            className="ml-auto hover:text-gray-900 active:text-gray-800"
          >
            <Icon name="square-pen" />
          </Button> */}
          <Button
            {...dc.getButtonProps({
              type: "button",
              value: "delete",
              onClick: () => {
                if (dc.doubleCheck) {
                  deleteProgramMutation.mutate(card.id);
                }
              },
            })}
            variant="outline"
            size={dc.doubleCheck ? "default" : "icon"}
            className="ml-2 text-red-500 hover:text-red-600 active:text-red-700"
          >
            {dc.doubleCheck ? `Are you sure?` : <Icon name="trash-2" />}
          </Button>
        </div>
        <CardDescription>Created {card.createdAt}</CardDescription>
        <CardDescription>Updated {card.updatedAt}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="flex justify-center text-xl">Replace File</Label>
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
