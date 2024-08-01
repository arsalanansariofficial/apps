'use client';
import { App_Admin } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { retrieveObject } from '@/lib/utils';
import { IDENTIFIERS, ROUTES } from '@/lib/constants';

export default function useRouterGuard() {
  const router = useRouter();
  const [user, setUser] = useState<App_Admin>();

  useEffect(function () {
    const user = retrieveObject<App_Admin>(IDENTIFIERS.USER);
    if (!user || !user.token) router.replace(ROUTES.LOGIN);
    setUser(user);
  }, []);

  return user;
}
