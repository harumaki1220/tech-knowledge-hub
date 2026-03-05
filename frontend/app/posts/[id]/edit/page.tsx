"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const params = useParams();
  const id = params.id;
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`http://localhost:3000/posts/${id}`);
      const data = await res.json();

      setTitle(data.title);
      setSlug(data.slug);
      setContent(data.content);
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // 更新ボタンが押された時の処理
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:3000/posts/${id}`, {
      method: "PATCH",
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
      alert("記事を更新しました！");
      router.push(`/posts/${id}`);
    } else {
      alert("更新に失敗しました。スラグが重複しているかも？");
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">記事を更新する</h1>

      <form onSubmit={handleEdit} className="flex flex-col gap-6">
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
          更新する
        </button>
      </form>
    </main>
  );
}
