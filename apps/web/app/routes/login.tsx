import type { SubmissionResult } from '@conform-to/react';
import type { Route } from './+types/login';
import type { MetaFunction } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod/v4';
import { authenticator } from '#app/services/auth.server';
import { sessionStorage } from '#app/services/session.server';
import { Form, redirect, useActionData, isRouteErrorResponse, useRouteError } from 'react-router';
import { z } from 'zod';
import { clsx } from 'clsx';
import { redirectWithToast } from '#app/utils/toast.server';
import { H1 } from '#app/components/typography';

export const meta: MetaFunction = () => {
  return [{ title: 'Delphi' }];
};

const schema = z.object({
  email: z.email(),
  password: z.string(),
  remember: z.boolean().optional(),
});

export const handle = {
  title: 'Login',
};

export async function action({ request }: Route.ActionArgs) {
  const clonedRequest = request.clone();
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const user = await authenticator.authenticate('user-pass', clonedRequest);
    if (user.deactivated) {
      return redirectWithToast('/login', {
        type: 'error',
        title: 'Account Deactivated',
        description: 'Your account has been deactivated. Please contact support.',
      });
    }
    const session = await sessionStorage.getSession(clonedRequest.headers.get('cookie'));
    session.set('user', user);

    return redirect('/dashboard', {
      headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
    });
  } catch (error) {
    return {
      status: 'error',
      error: {
        'login-error': ['Invalid email or password'],
      },
    } as SubmissionResult;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');

  if (user) throw redirect('/dashboard');

  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div className="text-red-500 text-center mt-4">
      {isRouteErrorResponse(error) ?
        <p>Error: {error.statusText}</p>
      : error instanceof Error ?
        <p>Error: {error.message}</p>
      : <p>Unknown error occurred</p>}
    </div>
  );
}

export default function Index() {
  const lastResult = useActionData<typeof action>() as SubmissionResult;
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onBlur',
  });

  return (
    <main className="py-8">
      <div>
        <div className="bg-zinc-100 max-w-md mx-auto p-4 rounded border shadow">
          <div className="mb-10 mx-auto pb-4 border-b">
            <H1 variant="loginHeader">Delphi Login</H1>
            <img src="/delphi.png" alt="Delphi" className="mx-auto size-40" />
            {lastResult?.error && (
              <div className="text-red-500 text-center mt-4">{lastResult?.error['login-error']}</div>
            )}
          </div>
          <Form className="space-y-2" method="post" {...getFormProps(form)}>
            <div className="grid grid-cols-2 relative">
              <label htmlFor="email">Email</label>
              <input
                className={clsx('border rounded', !fields.email.valid && 'border-red-500')}
                {...getInputProps(fields.email, { type: 'email' })}
              />
              <span className="text-red-500 absolute right-2">{fields.email.errors}</span>
            </div>
            <div className="grid grid-cols-2 relative">
              <label htmlFor="password">Password</label>
              <input
                className={clsx('border rounded', !fields.password.valid && 'border-red-500')}
                {...getInputProps(fields.password, { type: 'password' })}
              />
              <div className="text-red-500 absolute right-2">{fields.password.errors}</div>
            </div>
            <div className="grid grid-cols-2">
              <label htmlFor="rememberMe">Remember me</label>
              <div className="flex justify-end">
                <input {...getInputProps(fields.remember, { type: 'checkbox' })} />
              </div>
            </div>
            <hr />
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white p-2 rounded">Login</button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}
