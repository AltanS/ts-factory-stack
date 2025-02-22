import type { SelectPage } from '#drizzle/schema';
import type { MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';
import { getPages } from '#app/models/pages.server';
import { Button } from '#app/components/ui/button';

export const meta: MetaFunction = () => {
  return [{ title: 'Pages Dashboard' }, { name: 'description', content: 'Manage your pages' }];
};

export async function loader() {
  const pages = await getPages();
  return { pages };
}

export const handle = {
  title: 'Pages',
};

export default function Home() {
  const { pages } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-zinc-900">Pages</h1>
            <p className="text-sm text-zinc-500">Manage your website pages</p>
          </div>
          <Link to="/pages/new">
            <Button className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add New Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm">
          <ul className="divide-y divide-gray-100">
            {pages.map((page: SelectPage) => (
              <li key={page.id} className="p-4 hover:bg-gray-50">
                <Link to={`/pages/${page.id}`} className="block">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{page.title}</h2>
                      <p className="text-sm text-gray-500">{page.slug}</p>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(page.updatedAt).toLocaleDateString()}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {pages.length === 0 && (
            <div className="p-4 text-center text-gray-500">No pages found. Create your first page to get started.</div>
          )}
        </div>
      </div>
    </div>
  );
}
