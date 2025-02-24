import type { SelectPage } from '#drizzle/schema';
import type { MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';
import { getPages } from '#app/models/pages.server';
import { Button } from '#app/components/ui/button';

export const meta: MetaFunction = () => {
  return [{ title: 'Pages Dashboard' }, { name: 'description', content: 'Manage your pages' }];
};

export const handle = {
  title: 'Dashboard',
};

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500">Manage your website</p>
          </div>
        </div>
      </div>
    </div>
  );
}
