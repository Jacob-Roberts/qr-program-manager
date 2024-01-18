import { db } from "#/server/db";
import { keepAlive } from "#/server/db/schema";

export async function PUT(request: Request) {
  const keepAliveApiSecret = request.headers.get("keep-alive-api-secret");
  if (keepAliveApiSecret !== process.env.KEEP_ALIVE_API_SECRET) {
    return new Response(undefined, {
      status: 403,
    });
  }

  await db
    .insert(keepAlive)
    .values({ id: 1, dummy: Math.random() < 0.5 ? 1 : 0 })
    .onDuplicateKeyUpdate({ set: { dummy: Math.random() < 0.5 ? 1 : 0 } });

  return new Response(undefined, {
    status: 204,
  });
}
