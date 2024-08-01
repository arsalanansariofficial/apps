'use client';
import Button from './button';
import { Show } from '@/lib/views';
import Exception from './exception';
import useAuth from '@/hooks/use-auth';
import { useFormState } from 'react-dom';
import { App_Admin, App_Exception } from '@/lib/types';
import { loginAdmin as loginAdminAction } from '@/lib/actions';

export type App_Home = {
  sessionTime: number;
  loginAdmin: typeof loginAdminAction;
};

export default function Home({ loginAdmin, sessionTime }: App_Home) {
  const [state, formAction] = useFormState(loginAdmin, {});

  const user = state?.data as App_Admin;
  const exception = state as App_Exception;

  const { login } = useAuth(sessionTime);
  if (user && user.token) login(user);

  return (
    <main>
      <form action={formAction}>
        <Show>
          <Show.When isTrue={!!exception.status}>
            <Exception exception={exception} />
          </Show.When>
        </Show>
        <input type="text" name="identifier" placeholder="Email" />
        <input type="password" name="password" placeholder="password" />
        <Button type="submit" fallback="Working..." text="Login" />
      </form>
    </main>
  );
}
