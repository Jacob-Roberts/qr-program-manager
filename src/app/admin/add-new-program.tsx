"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icon } from "#/components/Icon";
import { LoadingSpinner } from "#/components/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { cn } from "#/lib/utils";
import { api } from "#/trpc/react";

export function AddNewProgram() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const addNewProgramMutation = api.program.addProgram.useMutation({
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
    },
  });

  return (
    <Card
      className={cn(
        "group mx-auto flex h-[100px] max-w-2xl items-center justify-center border-2 border-dashed border-gray-300 hover:cursor-pointer hover:border-blue-400 dark:border-gray-600",
        addNewProgramMutation.isPending && "opacity-50",
      )}
      onClick={() => {
        if (addNewProgramMutation.isPending) return;
        addNewProgramMutation.mutate();
      }}
    >
      <CardHeader>
        <CardTitle>Add more</CardTitle>
        <CardDescription>Add new QR codes to your account.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-0 pr-6">
        <Icon
          name="plus"
          className="h-10 w-10 text-gray-300 group-hover:text-blue-400 dark:text-gray-600"
        />
        {(addNewProgramMutation.isPending || isPending) && (
          <LoadingSpinner className="h-10 w-10 text-blue-400" />
        )}
      </CardContent>
    </Card>
  );
}
