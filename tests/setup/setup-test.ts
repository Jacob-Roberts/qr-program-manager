// The below can be used in a Jest global setup file or similar for your testing set-up
import { loadEnvConfig } from "@next/env";
import "@testing-library/jest-dom/vitest";

export default async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
  await import("#/env");
};
