import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export default [
  route('/healthcheck', 'routes/healthcheck.ts'),
  route('/login', 'routes/login.tsx'),
  route('/login-simple', 'routes/login-simple.tsx'),
  route('/logout', 'routes/logout.tsx'),
  layout('routes/_auth.tsx', { id: '_auth' }, [
    layout('routes/_layout.tsx', { id: '_layout' }, [
      route('/', 'routes/home.tsx'),
      route('/dashboard', 'routes/dashboard.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
