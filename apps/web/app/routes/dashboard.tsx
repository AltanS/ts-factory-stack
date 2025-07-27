import type { MetaFunction } from 'react-router';
import { H1, P } from '#app/components/typography';

export const meta: MetaFunction = () => {
  return [{ title: 'Dashboard' }, { name: 'description', content: 'Dashboard' }];
};

export const handle = {
  title: 'Dashboard',
};

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm dark:shadow-zinc-800/50 p-6 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <H1 variant="pageHeader">Dashboard</H1>
            <P variant="subtle">Manage your website</P>
          </div>
        </div>
      </div>
    </div>
  );
}
