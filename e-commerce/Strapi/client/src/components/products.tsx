'use client';
import Link from 'next/link';
import Exception from './exception';
import Header from './header-admin';
import useAuth from '@/hooks/use-auth';
import { Show, Each } from '@/lib/views';
import useRouterGuard from '@/hooks/use-router-guard';
import { IDENTIFIERS, ROUTES } from '@/lib/constants';
import { App_Exception, App_Product_Public } from '@/lib/types';

type App_Products_Component = {
  baseURL: string;
  sessionTime: number;
  products: App_Product_Public[];
  exception: App_Exception | null;
};

export default function Products({
  baseURL,
  products,
  exception,
  sessionTime
}: App_Products_Component) {
  const user = useRouterGuard();
  const { logout, autoLogin } = useAuth(sessionTime);
  autoLogin();

  return (
    <>
      <Header user={user} handleLogout={logout} />
      <main>
        <Show>
          <Show.When isTrue={!!exception}>
            <Exception exception={exception} />
          </Show.When>
          <Show.Else>
            <Each
              of={products}
              render={function (product) {
                return (
                  <main>
                    <Each
                      of={product.attributes.imagePath.data}
                      render={function (image) {
                        return (
                          <Link href={ROUTES.PRODUCTS + product.id}>
                            <img
                              width={200}
                              height={200}
                              key={image.id}
                              alt={product.attributes.description}
                              src={baseURL + image.attributes.url}
                            />
                          </Link>
                        );
                      }}
                    />
                    <p>Product Id: {product.id}</p>
                    <h3>{product.attributes.name}</h3>
                    <p>{product.attributes.description}</p>
                    <p>Rs. {product.attributes.priceInCents}</p>
                    <Show>
                      <Show.When
                        isTrue={product.attributes.isAvailableForPurchase}
                      >
                        <p>{IDENTIFIERS.AVAILABLE}</p>
                      </Show.When>
                      <Show.Else>
                        <p>{IDENTIFIERS.NOT_AVAILABLE}</p>
                      </Show.Else>
                    </Show>
                  </main>
                );
              }}
            />
          </Show.Else>
        </Show>
      </main>
    </>
  );
}
