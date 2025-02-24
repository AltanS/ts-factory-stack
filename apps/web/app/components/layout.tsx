import type { InsertUser as User } from '#drizzle/schema';
import { useLoading } from '#app/hooks/useLoading';
import { Form, Link, NavLink, useNavigation, useParams } from 'react-router';
import { userIsAdmin } from '#app/utils/permissions';
import { cn } from '#app/utils/shadcn';

export default function Layout({
  user,
  title,
  backTo,
  children,
}: {
  user: User;
  title?: string;
  backTo?: string;
  children: React.ReactNode;
}) {
  const isAdmin = userIsAdmin(user);
  const navigation = useNavigation();
  const { isLoading } = useLoading();
  const showLoadingBar = navigation.state === 'loading' || isLoading;

  return (
    <div className="w-full h-full">
      <div className="fixed top-0 left-0 w-full h-[4px] bg-transparent z-50">
        <div
          className={cn(
            'absolute inset-0 overflow-hidden',
            showLoadingBar ? 'opacity-100' : 'opacity-0',
            'transition-opacity duration-200',
          )}
        >
          <div
            className={cn(
              'h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
              'absolute top-0 left-0 w-full',
              'animate-[loading-bar_2s_ease-in-out_infinite]',
            )}
          />
        </div>
      </div>
      <div className="bg-white grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div>
          <main className="py-2">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
