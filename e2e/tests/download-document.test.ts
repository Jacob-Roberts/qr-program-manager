import { expect, test } from "@playwright/test";

test("Can download a document", async ({ request }) => {
  const pdfResponse = await request.get(`/P_tae4uhjYsXAekrwQoj2sCH`);
  expect(pdfResponse.ok()).toBeTruthy();
  const headers = pdfResponse.headers();
  expect(headers["content-disposition"]).toEqual(
    `inline; filename="DOC-20240606-WA0000..pdf"`,
  );
  expect(await pdfResponse.text()).not.toBeFalsy();
});
