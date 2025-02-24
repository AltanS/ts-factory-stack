import type { SelectUser as User, InsertUser } from '#drizzle/schema';
import invariant from 'tiny-invariant';
import bcrypt from 'bcryptjs';
import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { createUser, getUserByEmail } from '#app/models/users.server';
// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>();

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email');
    const password = form.get('password');

    // You can validate the inputs however you want
    invariant(typeof email === 'string', 'username must be a string');
    invariant(email.length > 0, 'username must not be empty');

    invariant(typeof password === 'string', 'password must be a string');
    invariant(password.length > 0, 'password must not be empty');

    return await login({ email, password });
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'user-pass',
);

export async function login({ email, password }: { email: string; password: string }) {
  const user = await getUserByEmail(email);

  invariant(user, `Incorrect Login`);

  const isValid = await bcrypt.compare(password, user.password);

  invariant(isValid, `Incorrect Login`);

  return user;
}

export async function register(user: InsertUser) {
  const exists = await getUserByEmail(user.email);
  if (exists) {
    return { error: `User already exists with that email` };
  }

  const newUser = await createUser(user);
  if (!newUser) {
    return {
      error: `Something went wrong trying to create a new user.`,
      fields: { email: user.email, password: user.password },
    };
  }
}
