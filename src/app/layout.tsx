import "#/styles/globals.css";

import { ourFileRouter } from "#/app/api/uploadthing/core";
import { TailwindIndicator } from "#/components/tailwind-indicator";
import { env } from "#/env";
import { TRPCReactProvider } from "#/trpc/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Inter } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "QR Program Manager",
  description:
    "Create a QR code for anything, and manage the content behind it. No app required.",
  icons: [{ rel: "icon", url: "/icon.svg" }],
  metadataBase: env.NEXT_PUBLIC_DEPLOY_URL,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <TRPCReactProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </TRPCReactProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
