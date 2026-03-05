"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "本当にこの記事を消し去りますか？復元はできません。",
    );

    if (!isConfirmed) {
      return;
    }

    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("記事を跡形もなく消去しました。");
      router.push("/");
      router.refresh();
    } else {
      alert("消去に失敗しました。");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition"
    >
      この記事を削除する
    </button>
  );
}
