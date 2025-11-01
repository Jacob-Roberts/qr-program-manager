import { eq } from "drizzle-orm";
import { db } from "#/server/db";
import { programs } from "#/server/db/schema";

import { utapi } from "../api/uploadthing/core";

type GetParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, props: GetParams) {
  const params = await props.params;
  // The Program ID Slug that we want to download
  const slug = params.slug;

  const file = await db.select().from(programs).where(eq(programs.slug, slug));

  if (!file?.[0]?.fileUploadId) {
    return new Response(notFoundBody, {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (file[0].fileUploadId === "not-uploaded-yet") {
    return new Response(notUploadedYetBody, {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  // get the file url
  let url = "";

  try {
    const uploadThingRes = await utapi.getFileUrls([file[0].fileUploadId]);

    if (!uploadThingRes.data?.[0]?.url) {
      throw new Error("No URL");
    }
    url = uploadThingRes.data?.[0].url;
  } catch (e) {
    console.log(e);
    return new Response(notFoundBody, {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    // use fetch to get a response
    const response = await fetch(url);

    // Clone the response to ensure the stream is not locked
    const clonedResponse = response.clone();

    const h = clonedResponse.headers;
    // Convert Headers object to a plain object
    const headers: Record<string, string> = {
      "content-disposition": `inline; filename="${
        file[0].fileUploadName || file[0].slug
      }"`,
    };

    addHeader(headers, h, "Age");
    addHeader(headers, h, "cache-control");
    addHeader(headers, h, "Content-Length");
    addHeader(headers, h, "Content-Type");
    addHeader(headers, h, "etag");
    addHeader(headers, h, "Last-Modified");

    // return a new response and use 'content-disposition' to open in the browser
    return new Response(clonedResponse.body, {
      headers: headers,
    });
  } catch (error) {
    console.error(error);
    return new Response(somethingWentWrongBody, {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}

function addHeader(res: Record<string, string>, h: Headers, key: string) {
  const j = h.get(key); // this is case insensitive
  if (j !== null) {
    res[key] = j;
  }
}

const notFoundBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            text-align: center;
        }

        h1 {
            font-size: 4em;
            color: #343a40;
        }

        p {
            font-size: 1.2em;
            color: #6c757d;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 Not Found</h1>
        <p>Sorry, the page you're looking for could not be found.</p>
        <p>Go back to <a href="/">homepage</a>.</p>
    </div>
</body>
</html>
`;

const notUploadedYetBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            text-align: center;
        }

        h1 {
            font-size: 4em;
            color: #343a40;
        }

        p {
            font-size: 1.2em;
            color: #6c757d;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 Not Found</h1>
        <p>A file hasn't been uploaded to this QR code yet.</p>
        <p>Go back to <a href="/">homepage</a>.</p>
    </div>
</body>
</html>
`;

const somethingWentWrongBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 Internal Server Error</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            text-align: center;
        }

        h1 {
            font-size: 4em;
            color: #343a40;
        }

        p {
            font-size: 1.2em;
            color: #6c757d;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Something unexpected happened</h1>
        <p>Go back to <a href="/">homepage</a>.</p>
    </div>
</body>
</html>
`;
