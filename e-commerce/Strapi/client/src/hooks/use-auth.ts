import { useEffect, useRef } from 'react';
import { App_Admin } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { IDENTIFIERS, ROUTES } from '@/lib/constants';
import { deleteObject, retrieveObject, storeObject } from '@/lib/utils';

export default function useAuth(sessionTime: number) {
  const router = useRouter();
  const timeout = useRef<null | NodeJS.Timeout>(null);

  function cleanUp() {
    clearTimeout(timeout.current as NodeJS.Timeout);
    timeout.current = null;
  }

  function logout() {
    const user = retrieveObject<App_Admin>(IDENTIFIERS.USER);

    if (user && user.token) {
      cleanUp();
      deleteObject(IDENTIFIERS.USER);
      return router.push(ROUTES.LOGIN);
    }
  }

  function autoLogin() {
    const user = retrieveObject<App_Admin>(IDENTIFIERS.USER);

    if (user && user.token) {
      const date = new Date();

      const sessionTime = new Date(user.sessionTime).getTime();
      const difference = sessionTime - date.getTime();

      timeout.current = setTimeout(logout, difference);
    }
  }

  function login(user: App_Admin) {
    const date = new Date();
    const sessionTimeInMillis = sessionTime * 1000;
    const sessionTimeout = date.getTime() + sessionTimeInMillis;

    user.sessionTime = new Date(sessionTimeout).toISOString();
    timeout.current = setTimeout(logout, sessionTimeInMillis);
    storeObject(IDENTIFIERS.USER, user);

    return router.push(ROUTES.DASHBOARD);
  }

  useEffect(() => cleanUp, []);

  return { logout, login, autoLogin };
}
