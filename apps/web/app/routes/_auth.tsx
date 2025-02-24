import type { Route } from './+types/_auth';
import type { SelectUser as User } from '#drizzle/schema';
import { sessionStorage } from '#app/services/session.server';
import { redirect } from 'react-router';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user') as User | null;
  if (!user) throw redirect('/');

  if (user.deactivated) {
    return redirect('/', {
      headers: { 'Set-Cookie': await sessionStorage.destroySession(session) },
    });
  }
  return user;
}
