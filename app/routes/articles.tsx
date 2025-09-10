import type { Route } from "./+types/articles";
import { Link, useLoaderData } from "react-router";
import PublicWrapper from "#app/components/public-wrapper";
import { getCollection } from "#app/cms/loader.server";
import { ArticleSchema, type Article } from "#app/cms/schemas";
import type { ContentEntry } from "#app/cms/types";

export async function loader() {
  const articles = await getCollection<typeof ArticleSchema>("articles");
  return { articles };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Articles" }];
}

export default function Articles() {
  const { articles } = useLoaderData<typeof loader>();
  return (
    <PublicWrapper>
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      <ArticlesList articles={articles} />
    </PublicWrapper>
  );
}

function ArticlesList({ articles }: { articles: Array<ContentEntry<Article>> }) {
  return (
    <ul className="space-y-4">
      {articles.map(({ slug, frontmatter }) => {
        const { title, date, excerpt } = frontmatter;
        return (
          <li key={slug} className="border-b border-gray-200 pb-4">
            <Link to={`/articles/${slug}`} className="text-xl font-semibold hover:underline">
              {title}
            </Link>
            {date && <div className="text-sm text-gray-500">{String(date)}</div>}
            {excerpt && <p className="mt-2 text-gray-700">{excerpt}</p>}
          </li>
        );
      })}
    </ul>
  );
}
