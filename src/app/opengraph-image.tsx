import { ImageResponse } from "next/og";

// Image metadata
export const alt = "QR Program Manager";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Font
  const interSemiBold = fetch(
    new URL("../assets/Inter-SemiBold.ttf", import.meta.url),
  ).then(res => res.arrayBuffer());

  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        fontSize: 48,
        fontWeight: 600,
      }}
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: OpenGraph */}
      <svg
        width="200"
        height="200"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="17" cy="17" r="17" fill="black" />
        <path
          d="M12 8H9C8.4477 8 8 8.4477 8 9V12C8 12.5523 8.4477 13 9 13H12C12.5523 13 13 12.5523 13 12V9C13 8.4477 12.5523 8 12 8Z"
          stroke="#23F0C7"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M25 8H22C21.4477 8 21 8.4477 21 9V12C21 12.5523 21.4477 13 22 13H25C25.5523 13 26 12.5523 26 12V9C26 8.4477 25.5523 8 25 8Z"
          stroke="#EF767A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 21H9C8.4477 21 8 21.4477 8 22V25C8 25.5523 8.4477 26 9 26H12C12.5523 26 13 25.5523 13 25V22C13 21.4477 12.5523 21 12 21Z"
          stroke="#7D7ABC"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M23.4 21H21.6C21.2686 21 21 21.2686 21 21.6V23.4C21 23.7314 21.2686 24 21.6 24H23.4C23.7314 24 24 23.7314 24 23.4V21.6C24 21.2686 23.7314 21 23.4 21Z"
          stroke="#FFE347"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17 22V19C17 18.4696 17.2107 17.9609 17.5858 17.5858C17.9609 17.2107 18.4696 17 19 17H22"
          stroke="#7D7ABC"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 17H8.01"
          stroke="#FFE347"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17 8H17.01"
          stroke="#7D7ABC"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17 12V12.01"
          stroke="#FFE347"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M26 26V26.01"
          stroke="#23F0C7"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 17H13"
          stroke="#EF767A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M26 17V17.01"
          stroke="#23F0C7"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17 26V25"
          stroke="#EF767A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <span>QR Program Manager</span>
    </div>,
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
