import { loader as authLoader } from './_auth';
import type { BaseHandle } from '#types/base';
import { useMatches, Outlet, useRouteLoaderData } from 'react-router';
import AppWrapper from '#app/components/app-wrapper';
import invariant from 'tiny-invariant';

export default function AppLayout() {
  const user = useRouteLoaderData<typeof authLoader>('_auth');
  invariant(user, 'User is required');
  const matches = useMatches();
  const handle = matches[matches.length - 1]?.handle as BaseHandle;
  return (
    <AppWrapper title={handle?.title} backTo={handle?.backTo} user={user}>
      <Outlet />
    </AppWrapper>
  );
}
