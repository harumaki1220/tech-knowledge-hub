import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const app = new Hono();
const prisma = new PrismaClient();

// 全ての記事をタグ・著者情報込みで取得する
app.get("/posts", async (c) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      tags: true,
    },
  });
  return c.json(posts);
});

// 記事を新規作成する（タグの自動処理付き）
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
    console.error(error);
    return c.json(
      { error: "作成に失敗しました。詳細はサーバーログを確認してください。" },
      400,
    );
  }
});

// ロードマップを新規作成する
app.post("/roadmaps", async (c) => {
  const { title, description, items } = await c.req.json();
  // items は [{ postId: 1, order: 1 }, { postId: 2, order: 2 }] という形式を想定

  try {
    const result = await prisma.roadmap.create({
      data: {
        title,
        description,
        items: {
          create: items.map((item: { postId: number; order: number }) => ({
            order: item.order,
            post: { connect: { id: item.postId } },
          })),
        },
      },
      include: {
        items: {
          include: { post: true }, // 紐付いた記事の情報も一緒に返す
        },
      },
    });
    return c.json(result, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "ロードマップの作成に失敗しました。" }, 400);
  }
});

// 全てのロードマップを、紐付く記事情報と一緒に取得する
app.get("/roadmaps", async (c) => {
  const roadmaps = await prisma.roadmap.findMany({
    include: {
      items: {
        orderBy: { order: "asc" },
        include: {
          post: {
            select: { title: true, slug: true },
          },
        },
      },
    },
  });
  return c.json(roadmaps);
});

// 特定のタグを削除する
app.delete("/tags/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const deletedTag = await prisma.tag.delete({
      where: {
        id: Number(id),
      },
    });
    return c.json({ message: "タグを削除しました", deletedTag });
  } catch (error) {
    console.error(error);
    return c.json(
      { error: "削除に失敗しました。タグが存在しない可能性があります。" },
      400,
    );
  }
});

// 特定の記事を ID で検索して 1 つだけ返す
app.get("/posts/:id", async (c) => {
  const id = c.req.param("id");

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      author: true,
      tags: true,
    },
  });

  return c.json(post);
});

// スラグで記事を1つだけ検索する
app.get("/posts/slug/:slug", async (c) => {
  const slug = c.req.param("slug");

  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
    },
    include: {
      author: true,
      tags: true,
    },
  });

  if (!post) return c.json({ error: "記事が見つかりません" }, 404);
  return c.json(post);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
