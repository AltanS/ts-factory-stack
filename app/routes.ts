import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export default [
  route('/healthcheck', 'routes/healthcheck.ts'),
  // Public root
  route('/', 'routes/index.tsx'),
  route('/login', 'routes/login.tsx'),
  route('/logout', 'routes/logout.tsx'),
  route('/terms', 'routes/legal/terms.tsx'),
  route('/privacy', 'routes/legal/privacy.tsx'),
  // Public articles (content-driven)
  route('/articles', 'routes/articles.tsx'),
  route('/articles/:slug', 'routes/articles.$slug.tsx'),
  layout('routes/_auth.tsx', { id: '_auth' }, [
    layout('routes/_layout.tsx', { id: '_layout' }, [
      route('/dashboard', 'routes/dashboard.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
