import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  redirect,
} from 'react-router';
import type { Route } from './+types/root';
import { getToast } from '#app/utils/toast.server';
import stylesheet from './app.css?url';
import { combineHeaders } from '#app/utils/misc';
import { Toaster } from '#app/components/ui/toaster';
import { useToast } from '#app/hooks/use-toast';
import { LoadingProvider } from '#app/context/loading';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: stylesheet },
];

export async function loader({ request }: Route.LoaderArgs) {
  const { pathname, search } = new URL(request.url);
  if (pathname.endsWith('/') && pathname !== '/') {
    // Redirect to the same URL without a trailing slash
    return redirect(`${pathname.slice(0, -1)}${search}`, 301);
  }

  const { toast, headers: toastHeaders } = await getToast(request);

  return {
    toast,
    headers: combineHeaders(toastHeaders),
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-zinc-50 dark:bg-zinc-900">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  useToast(data?.toast);
  return (
    <LoadingProvider>
      <Outlet />
      <Toaster closeButton position="bottom-right" theme={'light'} />
    </LoadingProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
