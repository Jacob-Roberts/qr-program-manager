"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export function CallbackUrlHiddenInput() {
  return (
    <Suspense>
      <Internal />
    </Suspense>
  );
}

function Internal() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback_url");
  return <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />;
}
