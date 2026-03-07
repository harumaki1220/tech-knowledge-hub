import Link from "next/link";
import { Roadmap } from "../../types";

export default async function RoadmapListPage() {
  const response = await fetch("http://localhost:3000/roadmaps", {
    cache: "no-store",
  });
  const roadmaps: Roadmap[] = await response.json();

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        学習ロードマップ
      </h1>

      <div className="grid gap-8">
        {roadmaps.map((roadmap) => (
          <section
            key={roadmap.id}
            className="border rounded-2xl p-6 shadow-sm bg-white"
          >
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              {roadmap.title}
            </h2>
            <p className="text-gray-600 mb-6">{roadmap.description}</p>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-400 text-sm uppercase tracking-wider">
                学習ステップ
              </h3>
              {roadmap.items
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {item.order}
                    </div>
                    <Link
                      href={`/posts/slug/${item.post.slug}`}
                      className="flex-grow p-3 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all text-gray-700 font-medium"
                    >
                      {item.post.title}
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12">
        <Link href="/" className="text-blue-600 hover:underline">
          ← トップページに戻る
        </Link>
      </div>
    </main>
  );
}
