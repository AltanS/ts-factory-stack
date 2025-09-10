import type { SelectUser as User } from '#drizzle/schema';

export function userIsAdmin(user: User | null): boolean {
  if (!user || !user.role) {
    return false;
  }
  return user.role === 'admin';
}
