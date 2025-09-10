import type { Route } from './+types/articles.$slug';
import { useLoaderData } from 'react-router';
import PublicWrapper from '#app/components/public-wrapper';
import { getEntry } from '#app/cms/loader.server';
import { ArticleSchema, type Article } from '#app/cms/schemas';
import type { ContentEntry } from '#app/cms/types';

export async function loader({ params }: Route.LoaderArgs) {
  const slug = String(params.slug);
  const article = await getEntry<typeof ArticleSchema>('articles', slug);
  if (!article) {
    throw new Response('Not found', { status: 404 });
  }
  return { article };
}

export function meta({ data }: Route.MetaArgs) {
  const title = data?.article?.frontmatter?.title ?? 'Article';
  return [{ title }];
}

export default function ArticleDetail() {
  const { article } = useLoaderData<typeof loader>();
  const { frontmatter } = article as ContentEntry<Article>;
  const { title, date } = frontmatter;
  const hasBody = Boolean(article.bodyHtml && article.bodyHtml.trim().length > 0);

  return (
    <PublicWrapper>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {date && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{String(date)}</p>
        )}
      </header>
      {hasBody ? (
        <div
          className="prose prose-zinc dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.bodyHtml! }}
        />
      ) : (
        <p className="text-sm text-zinc-500">No content.</p>
      )}
    </PublicWrapper>
  );
}
