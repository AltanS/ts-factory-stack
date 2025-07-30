import type { Route } from './+types/_auth';
import type { SelectUser as User } from '#drizzle/schema';
import { redirect } from 'react-router';
import { sessionStorage } from '#app/services/session.server';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user') as User | null;
  if (!user) throw redirect('/login');

  if (user.deactivated) {
    return redirect('/login', {
      headers: { 'Set-Cookie': await sessionStorage.destroySession(session) },
    });
  }
  return user;
}
