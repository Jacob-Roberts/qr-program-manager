/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [] } },
  test: {
    setupFiles: ["./tests/setup/setup-test-env.ts"],
    environment: "jsdom",
  },
});
