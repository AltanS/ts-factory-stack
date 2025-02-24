import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export default [
  route('/healthcheck', 'routes/healthcheck.ts'),
  route('/', 'routes/home.tsx'),
  layout('routes/_auth.tsx', { id: '_auth' }, [
    layout('routes/_layout.tsx', { id: '_layout' }, [route('/dashboard', 'routes/dashboard.tsx')]),
  ]),
] satisfies RouteConfig;
