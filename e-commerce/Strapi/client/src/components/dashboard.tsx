'use client';
import { Show } from '@/lib/views';
import Exception from './exception';
import useAuth from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { IDENTIFIERS } from '@/lib/constants';
import { getProducts, getSales } from '@/lib/actions';
import useRouterGuard from '@/hooks/use-router-guard';
import {
  App_User,
  App_Order,
  App_Response,
  App_Exception,
  App_Product_Public,
  App_Response_Public
} from '@/lib/types';
import Header from './header-admin';

export type App_Dashboard = {
  sessionTime: number;
  getSales: typeof getSales;
};

export default function Dashboard({ getSales, sessionTime }: App_Dashboard) {
  const user = useRouterGuard();
  const { logout, autoLogin } = useAuth(sessionTime);

  const [sales, setSales] = useState(0);
  const [averageValue, setAverageValue] = useState(0);
  const [orders, setOrders] = useState<App_Order[]>([]);
  const [customers, setCustomers] = useState<App_User[]>([]);
  const [products, setProducts] = useState<App_Product_Public[]>([]);
  const [exception, setException] = useState<App_Exception | null>(null);
  const [inactiveProducts, setInactiveProducts] = useState<
    App_Product_Public[]
  >([]);

  function handleException(
    salesResponse: App_Response<App_Order[]> | App_Exception,
    productsResponse: App_Response_Public<App_Product_Public[]> | App_Exception
  ) {
    let exception;
    const salesException = salesResponse as App_Exception;
    const productsException = productsResponse as App_Exception;

    if (salesException.status) exception = salesException;
    if (productsException.status) exception = productsException;
    if (exception?.status) {
      setException(exception);
      return true;
    }

    return false;
  }

  function handleSales(
    salesResponse: App_Response<App_Order[]> | App_Exception
  ) {
    let sales = 0;
    let customers = [];
    let averageValue = 0;
    let isExisting = false;
    let orders = (salesResponse as App_Response<App_Order[]>).results;

    for (const order of orders) {
      sales += order.pricePaidInCents;
      isExisting = !!customers.find(user => user.id === order.user.id);
      if (!isExisting) customers.push(order.user);
    } //  Handling Sales Data

    averageValue = sales / orders.length;

    setSales(sales);
    setOrders(orders);
    setCustomers(customers);
    setAverageValue(averageValue);
  }

  function handleProducts(
    productsResponse: App_Response_Public<App_Product_Public[]> | App_Exception
  ) {
    const acitveProducts = [];
    const inactiveProducts = [];
    const products = (
      productsResponse as App_Response_Public<App_Product_Public[]>
    ).data;

    for (const product of products) {
      if (product.attributes.isAvailableForPurchase)
        acitveProducts.push(product);
      else inactiveProducts.push(product);
    } //  Handling Products Data

    setProducts(products);
    setInactiveProducts(inactiveProducts);
  }

  useEffect(
    function () {
      async function init() {
        const formdata = new FormData();

        formdata.set(IDENTIFIERS.TOKEN, user?.token as string);

        const [salesResponse, productsResponse] = (await Promise.all([
          getSales(null, formdata),
          getProducts()
        ])) as [
          App_Response<App_Order[]> | App_Exception,
          App_Response_Public<App_Product_Public[]> | App_Exception
        ];

        if (handleException(salesResponse, productsResponse)) return;

        handleSales(salesResponse);
        handleProducts(productsResponse);
      }

      autoLogin();
      if (user && user.token) init();
    },
    [user]
  );

  return (
    <>
      <Header user={user} handleLogout={logout} />
      <main>
        <Show>
          <Show.When isTrue={!!exception}>
            <Exception exception={exception} />
          </Show.When>
          <Show.Else>
            <p>sales: {sales}</p>
            <p>orders: {orders.length}</p>
            <p>average value: {averageValue}</p>
            <p>customers: {customers.length}</p>
            <p>products: {products.length}</p>
            <p>inactive products: {inactiveProducts.length}</p>
          </Show.Else>
        </Show>
      </main>
    </>
  );
}
