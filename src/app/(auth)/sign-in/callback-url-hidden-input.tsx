"use client";

import { useEffect, useState } from "react";

// This could be loaded on the server, but that would require making this route by dynamically loaded.
// I want it to be statically loaded, so I'm okay with this callback functionality to be missing if the
// browser hasn't yet loaded JS and they submit.
export function CallbackUrlHiddenInput() {
  const [callbackUrl, setCallbackUrl] = useState("");
  useEffect(() => {
    // Check if window is defined (i.e., we're in the browser)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const url = params.get("callbackUrl");

      if (url) {
        setCallbackUrl(url);
      }
    }
  }, []);
  return <input type="hidden" name="callbackUrl" value={callbackUrl} />;
}
