import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { ClientPage } from "./client-page.tsx";

test("Admin Page", () => {
  render(<ClientPage />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Client page" }),
  ).toBeDefined();
});
