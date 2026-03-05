import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const app = new Hono();
const prisma = new PrismaClient();

// 1. 全ての記事をタグ・著者情報込みで取得する
app.get("/posts", async (c) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      tags: true,
    },
  });
  return c.json(posts);
});

// 2. 記事を新規作成する（タグの自動処理付き）
app.post("/posts", async (c) => {
  const { title, content, slug, authorEmail, tagNames } = await c.req.json();

  try {
    const result = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        author: {
          connect: { email: authorEmail },
        },
        tags: {
          connectOrCreate: tagNames.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
    return c.json(result, 201);
  } catch (error) {
    return c.json(
      { error: "作成に失敗しました。slugが重複している可能性があります。" },
      400,
    );
  }
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
