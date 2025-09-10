import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import PublicWrapper from "#app/components/public-wrapper";

export const meta: MetaFunction = () => [
  { title: "Welcome" },
  { name: "description", content: "Public home" },
];

export default function Index() {
  return (
    <PublicWrapper>
      <h1 className="text-3xl font-bold mb-4">Welcome</h1>
      <p className="text-zinc-600 dark:text-zinc-300 mb-8">
        Explore public content or sign in to manage your site.
      </p>
      <div className="flex gap-4">
        <Link
          to="/articles"
          className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          View Articles
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Login
        </Link>
      </div>
    </PublicWrapper>
  );
}
