import type { Route } from './+types/articles.$slug';
import { useLoaderData } from 'react-router';
import PublicWrapper from '#app/components/public-wrapper';
import { getEntry } from '#app/cms/loader.server';

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug as string;
  const article = await getEntry('articles', slug);
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
  const fm = article.frontmatter as any;
  return (
    <PublicWrapper>
      <article className="container mx-auto max-w-3xl py-8 prose dark:prose-invert">
        <h1>{fm.title}</h1>
        {fm.date ?
          <p className="text-sm text-gray-500">{String(fm.date)}</p>
        : null}
        {article.bodyHtml ?
          <div className="prose" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
        : <pre className="text-sm bg-gray-50 p-4 rounded">No markdown body.</pre>}
      </article>
    </PublicWrapper>
  );
}
