// import { client } from "../../../sanity/lib/client";

export const dynamic = "force-dynamic"; // defaults to auto

type GetParams = {
  params: {
    slug: string;
  };
};

export async function POST(_request: Request, { params: _params }: GetParams) {
  return new Response(
    JSON.stringify({ status: "Error", reason: "Not implemented" }),
    {
      status: 501,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  // The Sanity Slug that we want to download
  // const slug = params.slug;

  // if (request.body === null) {
  //   return new Response(
  //     JSON.stringify({ status: "Error", reason: "Body is required" }),
  //     {
  //       status: 400,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  // }

  // try {
  //   const imageAsset = await client.assets.upload("file", request.body);

  //   // Here you can decide what to do with the returned asset document.
  //   // If you want to set a specific asset field you can to the following:
  //   await client
  //     .patch("some-document-id")
  //     .set({
  //       theImageField: {
  //         _type: "image",
  //         asset: {
  //           _type: "reference",
  //           _ref: imageAsset._id,
  //         },
  //       },
  //     })
  //     .commit();
  // } catch (error) {
  //   console.error(error);
  //   return new Response(JSON.stringify({ status: "Error" }), {
  //     status: 500,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // }

  // // return a new response but use 'content-disposition' to suggest saving the file to the user's computer
  // return new Response(JSON.stringify({ status: "Created" }), {
  //   status: 201,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
}
