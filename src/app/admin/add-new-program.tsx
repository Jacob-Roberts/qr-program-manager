"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { api } from "#/trpc/react";
import { useRouter } from "next/navigation";

export function AddNewProgram() {
  const router = useRouter();

  const addNewProgramMutation = api.program.addProgram.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Card
      className="group mx-auto flex h-[100px] max-w-2xl items-center justify-center border-2 border-dashed border-gray-300 hover:cursor-pointer hover:border-blue-400 dark:border-gray-600"
      onClick={() => {
        addNewProgramMutation.mutate();
      }}
    >
      <CardHeader>
        <CardTitle>Add more</CardTitle>
        <CardDescription>Add new QR codes to your account.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="text-6xl text-gray-300 group-hover:text-blue-400 dark:text-gray-600">
          +
        </div>
      </CardContent>
    </Card>
  );
}
