import type { Route } from "./+types/articles";
import { Link, useLoaderData } from "react-router";
import PublicWrapper from "#app/components/public-wrapper";
import { getCollection } from "#app/cms/loader.server";

export async function loader() {
  const articles = await getCollection("articles");
  return { articles };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Articles" }];
}

export default function Articles() {
  const { articles } = useLoaderData<typeof loader>();
  return (
    <PublicWrapper>
      <div className="container mx-auto max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>
        <ul className="space-y-4">
          {articles.map((a) => (
            <li key={a.slug} className="border-b border-gray-200 pb-4">
              <Link to={`/articles/${a.slug}`} className="text-xl font-semibold hover:underline">
                {(a.frontmatter as any).title}
              </Link>
              {(a.frontmatter as any).date ? (
                <div className="text-sm text-gray-500">{String((a.frontmatter as any).date)}</div>
              ) : null}
              {(a.frontmatter as any).excerpt ? (
                <p className="mt-2 text-gray-700">{(a.frontmatter as any).excerpt}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </PublicWrapper>
  );
}
