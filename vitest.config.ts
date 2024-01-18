import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  //@ts-expect-error react doesn't have correct types
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});
