import Link from "next/link";

export default async function Home() {
  const response = await fetch("http://localhost:3000/posts", {
    cache: "no-store",
  });
  const posts = await response.json();

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">技術記事一覧</h1>

      <div className="grid gap-6">
        {posts.map((post: any) => {
          const plainTextPreview = post.content
            .replace(/[#*`\-_>]/g, "")
            .trim();

          return (
            <div
              key={post.id}
              className="border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-2xl font-semibold text-blue-600 hover:underline">
                  {post.title}
                </h2>
              </Link>

              <p className="text-gray-600 mt-2 line-clamp-2">
                {plainTextPreview}
              </p>

              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Author: {post.author?.name || "Unknown"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
