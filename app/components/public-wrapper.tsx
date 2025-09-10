import { ThemeToggle } from './theme-toggle';
import { Layers } from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router';

export default function PublicWrapper({
  children,
  showLogo = true,
}: {
  children: React.ReactNode;
  showLogo?: boolean;
}) {
  return (
    <div className="min-h-screen pt-16">
      <header className="fixed top-0 left-0 right-0 p-4 z-50 flex items-center justify-between">
        <div className="pl-0">
          {showLogo && (
            <a href="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
                <Layers className="h-5 w-5 text-zinc-100 dark:text-zinc-900" />
              </div>
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">AppName</span>
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Login
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">{children}</div>
    </div>
  );
}
