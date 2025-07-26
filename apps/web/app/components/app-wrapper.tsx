import type { InsertUser as User } from '#drizzle/schema';
import { useLoading } from '#app/hooks/use-loading';
import { Link, useNavigation } from 'react-router';
import { cn } from '#app/lib/utils';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { AppSidebar } from './app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import * as React from 'react';

function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    // Check if dark mode is set
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 w-8 p-0"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function AppWrapper({
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
  const navigation = useNavigation();
  const { isLoading } = useLoading();
  const showLoadingBar = navigation.state === 'loading' || isLoading;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <InnerContent title={title} backTo={backTo} showLoadingBar={showLoadingBar}>
          {children}
        </InnerContent>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Inner content component that can use useSidebar hook
function InnerContent({
  title,
  backTo,
  showLoadingBar,
  children,
}: {
  title?: string;
  backTo?: string;
  showLoadingBar: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[4px] bg-transparent z-50 pointer-events-none">
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
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background">
        <div className="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold">{title || 'Dashboard'}</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>
      {backTo && (
        <div className="bg-muted/50 border-b px-4 py-2 sm:px-6 lg:px-8">
          <Link
            to={backTo}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>
      )}
      <div className="flex-1 p-4 md:p-6">{children}</div>
    </>
  );
}
