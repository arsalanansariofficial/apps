import { useEffect } from 'react';
import { App_User } from '../utility/types';
import Quote from '../components/quote/quote';
import Header from '../components/header/header';
import Orders from '../components/orders/orders';
import { API_END_POINTS } from '../utility/enums';
import useAsync, { action } from '../hooks/use-async';
import { getRequestConfig } from '../utility/utility';
import Products from '../components/products/products';
import ConfirmationModal from '../components/confirmation-modal/confirmation';

export default function Home() {
  const sendRequest = useAsync();
  const user = JSON.parse(sessionStorage.getItem('user') as string) as App_User;

  useEffect(function () {
    if (user?.token) {
      sendRequest(
        action.bind(
          null,
          getRequestConfig(API_END_POINTS.READ_USER, {
            method: 'GET',
            url: String(),
            baseURL: import.meta.env.VITE_BASE_URL,
            headers: {
              Authorization: `Bearer ${user?.token}`
            }
          })
        ),
        'READ_USER'
      ).then((response: App_User) =>
        sessionStorage.setItem('userHavingOrders', JSON.stringify(response))
      );
    }
  }, []);

  return (
    <>
      <ConfirmationModal />
      <Header />
      <Quote />
      <main>
        <Orders />
        <Products />
      </main>
    </>
  );
}
