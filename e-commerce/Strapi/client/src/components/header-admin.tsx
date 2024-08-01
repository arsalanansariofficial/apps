import Link from 'next/link';
import { Show } from '@/lib/views';
import { App_Admin } from '@/lib/types';
import { ROUTES } from '@/lib/constants';

export type App_Header = {
  handleLogout: () => void;
  user: null | undefined | App_Admin;
};

export default function Header({ user, handleLogout }: App_Header) {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href={ROUTES.LOGIN}>
              <h1>Login</h1>
            </Link>
          </li>
          <li>
            <Link href={ROUTES.SALES}>Sales</Link>
          </li>
          <li>
            <Link href={ROUTES.ORDERS}>Orders</Link>
          </li>
          <li>
            <Link href={ROUTES.PRODUCTS}>Products</Link>
          </li>
          <li>
            <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
          </li>
          <Show>
            <Show.When isTrue={!!user}>
              <li>
                <div>
                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </li>
            </Show.When>
          </Show>
        </ul>
      </nav>
    </header>
  );
}
