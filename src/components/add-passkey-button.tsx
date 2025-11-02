"use client";

import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { LoadingSpinner } from "#components/loading-spinner.tsx";
import { authClient } from "#/lib/auth-client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

export function AddPasskeyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddPasskey = async () => {
    try {
      setIsLoading(true);

      await authClient.passkey.addPasskey({
        name: passkeyName || undefined,
      });

      toast.success("Passkey added successfully!", {
        description: "You can now sign in using your passkey",
      });

      setIsOpen(false);
      setPasskeyName("");
    } catch (error) {
      console.error("Add passkey error:", error);
      toast.error("Failed to add passkey", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
          Add Passkey
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add a Passkey</AlertDialogTitle>
          <AlertDialogDescription>
            Set up passwordless authentication using your device&apos;s
            biometrics or security key. This makes signing in faster and more
            secure.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="passkey-name">Passkey Name (Optional)</Label>
            <Input
              id="passkey-name"
              placeholder="e.g., My iPhone, My MacBook"
              value={passkeyName}
              onChange={e => setPasskeyName(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Give your passkey a name to help you identify it later
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddPasskey} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Adding...
              </>
            ) : (
              "Add Passkey"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
