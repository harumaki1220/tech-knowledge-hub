"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();

  // 投稿ボタンが押された時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
        content,
        authorEmail: "test-1772729435666@example.com",
        tagNames: ["Next.js"],
      }),
    });

    if (response.ok) {
      alert("記事を投稿しました！");
      router.push("/");
    } else {
      alert("投稿に失敗しました。スラグが重複しているかも？");
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">新しい記事を書く</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            スラグ（URLになる英語）
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            本文（Markdown対応）
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded h-64"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          記事を公開する
        </button>
      </form>
    </main>
  );
}
