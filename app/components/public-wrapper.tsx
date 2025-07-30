import { ThemeToggle } from './theme-toggle';
import { Layers } from 'lucide-react';
import * as React from 'react';

export default function PublicWrapper({
  children,
  showLogo = true,
}: {
  children: React.ReactNode;
  showLogo?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 right-0 p-4 z-50">
        <ThemeToggle />
      </header>
      {showLogo && (
        <div className="fixed top-4 left-4 z-50">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
              <Layers className="h-5 w-5 text-zinc-100 dark:text-zinc-900" />
            </div>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">AppName</span>
          </a>
        </div>
      )}
      {children}
    </div>
  );
}