"use client";

import { env } from "#/env";
import { useDoubleCheck } from "#/lib/utils";
import { api } from "#/trpc/react";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

import { Icon } from "./Icon";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

type ExistingProgramCardProps = {
  id: number;
  name: string;
  slug: string;
  uploadedFileName: string;
  createdAt: string;
};

export function ExistingProgramCard({
  card,
}: {
  card: ExistingProgramCardProps;
}) {
  const router = useRouter();
  const dc = useDoubleCheck();

  const deleteProgramMutation = api.program.deleteProgram.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Card key={card.id} className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex flex-row items-center">
          <CardTitle>{card.name}</CardTitle>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto hover:text-gray-900 active:text-gray-800"
          >
            <Icon name="square-pen" />
          </Button>
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
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="pdf">{card.uploadedFileName} (Click to Edit)</Label>
          <Input accept=".pdf" id="pdf" type="file" />
        </div>
        <div className="flex items-center justify-center rounded-lg bg-white p-4">
          <a target="_blank" href={`/${card.slug}`}>
            <QRCode value={`${env.NEXT_PUBLIC_DEPLOY_URL}/${card.slug}`} />
          </a>
        </div>
        <Button className="self-start">Print QR Code</Button>
      </CardContent>
    </Card>
  );
}
