import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import AdminPage from "./page.tsx";

test("Admin Page", () => {
  render(<AdminPage />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Admin" }),
  ).toBeDefined();
});
