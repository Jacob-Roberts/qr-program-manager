// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.js"));

const IsVercelPreview = process.env.VERCEL_ENV !== "production";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.instagram.com/embed.js ${
    process.env.NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN
  }/js/plausible.js ${IsVercelPreview ? "https://vercel.live" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.sanity.io ${
    IsVercelPreview ? "https://assets.vercel.com" : ""
  };
  connect-src 'self' ${process.env.NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN}/api/event vitals.vercel-insights.com;
  font-src 'self';
  report-uri https://jacobroberts.report-uri.com/r/d/csp/reportOnly;
  frame-ancestors 'self';
  frame-src 'self' https://www.instagram.com/ ${
    IsVercelPreview ? "https://vercel.live" : ""
  };
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    /// Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: true,
  },
  experimental: {
    ppr: "incremental",
  },
  // biome-ignore lint/suspicious/useAwait: lib requires async
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=(), display-capture=()",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "Report-To",
            value: `{"group":"default","max_age":31536000,"endpoints":[{"url":"https://jacobroberts.report-uri.com/a/d/g"}],"include_subdomains":true}`,
          },
          {
            key: "Cross-Origin-Opener-Policy-Report-Only",
            value: `same-origin; report-to="default"`,
          },
          {
            key: "Cross-Origin-Embedder-Policy-Report-Only",
            value: `require-corp; report-to="default"`,
          },
          {
            key: "Cross-Origin-Resource-Policy-Report-Only",
            value: "same-site",
          },
        ],
      },
      {
        source: "/sprite.:hash.svg",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=9999999999, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
