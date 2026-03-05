import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response = await fetch(`http://localhost:3000/posts/${id}`, {
    cache: "no-store",
  });
  const post = await response.json();

  if (!post) return <div className="p-8 text-center">記事が見つかりません</div>;

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-extrabold text-gray-900">{post.title}</h1>
        <DeleteButton postId={post.id} />
      </div>

      <div className="text-sm text-gray-500 mb-8 pb-4 border-b">
        Author: {post.author?.name}
      </div>

      <article className="prose prose-blue max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>

      <div className="mt-12 pt-6 border-t">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          ← 記事一覧に戻る
        </Link>
      </div>
    </main>
  );
}
