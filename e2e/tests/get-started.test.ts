import { expect, test } from "@playwright/test";

test("can navigate to the get started page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Get started" }).click();
  const emailInput = page.getByRole("textbox", { name: /email/i });
  await emailInput.click();
  await emailInput.fill("test");
  await page.getByRole("button", { name: "Sign In with Email" }).click();
});
