// import { client } from "../../sanity/lib/client.ts";

export const dynamic = "force-dynamic"; // defaults to auto

type GetParams = {
  params: {
    slug: string;
  };
};

export async function GET(request: Request, { params }: GetParams) {
  // The Sanity Slug that we want to download
  const slug = params.slug;

  // const res = await client.fetch(
  //   "*[_type == 'program' && slug.current == $slug][0]",
  //   { slug },
  // );

  // external file URL
  const DUMMY_URL =
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  // use fetch to get a response
  const response = await fetch(DUMMY_URL);

  // return a new response but use 'content-disposition' to suggest saving the file to the user's computer
  return new Response(response.body, {
    headers: {
      ...response.headers, // copy the previous headers
      "content-disposition": `inline; filename="${slug}"`,
    },
  });
}
