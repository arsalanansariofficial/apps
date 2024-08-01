import './order-form.scss';
import { Modal } from 'bootstrap';
import { useEffect, useRef } from 'react';
import useCache from '../../hooks/use-cache';
import { App_State } from '../../store/store';
import AlertModal from '../modal/alert-modal';
import { useNavigate } from 'react-router-dom';
import { API_END_POINTS } from '../../utility/enums';
import { useSelector } from 'react-redux';
import useAsync, { action } from '../../hooks/use-async';
import { getRequestConfig } from '../../utility/utility';
import { App_User, Modal_Ref } from '../../utility/types';
import { Cart_Items } from '../../store/app-slice';
import ConfirmationModal from '../confirmation-modal/confirmation';

export default function OrderForm() {
  const sendRequest = useAsync();
  const navigate = useNavigate();

  const alertRef = useRef<Modal_Ref>();
  const exception = useSelector((state: App_State) => state.app.exception);

  const { value: user } = useCache<App_User>('user');
  const { value: cart } = useCache<Cart_Items[]>('cart');

  const totalAmount = cart.reduce(
    (prev, current) => prev + current.price * current.quantity,
    0
  );

  async function createOrder(event: any) {
    event.preventDefault();
    sendRequest(
      action.bind(
        null,
        getRequestConfig(API_END_POINTS.CREATE_ORDER, {
          method: 'POST',
          url: String(),
          baseURL: import.meta.env.VITE_BASE_URL,
          headers: {
            Authorization: `Bearer ${user?.token}`
          },
          data: {
            totalAmount,
            products: cart,
            userId: user?._id
          }
        })
      ),
      'CREATE_ORDER'
    ).then(response => {
      new Modal(`#confirmation-modal`).show();
      if (response.code || response.message) alertRef.current?.open();
    });
  }

  useEffect(
    function () {
      if (!user) return navigate('/login', { replace: true });
      if (user && !cart.length) return navigate('/', { replace: true });
    },
    [cart]
  );

  if (user && !cart.length) return null;

  return (
    <>
      <ConfirmationModal />
      <AlertModal
        ref={alertRef}
        id="alert-order"
        message={exception?.message || 'Something went wrong!'}
      />
      {!exception && (
        <div className="m-auto pb-3 d-flex flex-column align-items-center container-sm gap-2 form-container">
          <span>Confirm your order</span>
          <form
            noValidate
            onSubmit={createOrder}
            className="p-3 w-75 d-flex flex-column align-items-center needs-validation appointment-form"
          >
            <span className="align-self-end mb-2">Rs. {totalAmount}</span>
            {cart.map(function (item, index) {
              return (
                <div
                  key={index}
                  className="mb-3 align-self-stretch d-flex flex-column gap-2"
                >
                  <input
                    disabled
                    type="text"
                    placeholder="Price"
                    className="form-control"
                    value={`Rs. ${item.price}`}
                  />
                  <input
                    disabled
                    type="text"
                    placeholder="Price"
                    className="form-control"
                    value={`Qty: ${item.quantity}`}
                  />
                  <input
                    disabled
                    type="text"
                    value={item.name}
                    className="form-control"
                    placeholder="Product Name"
                  />
                  <input
                    disabled
                    type="text"
                    value={item.description}
                    className="form-control"
                    placeholder="Product description"
                  />
                </div>
              );
            })}
            <button type="submit" className="btn--primary">
              Place Order
            </button>
          </form>
        </div>
      )}
    </>
  );
}
