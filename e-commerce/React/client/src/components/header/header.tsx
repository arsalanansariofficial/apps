import './header.scss';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useCache from '../../hooks/use-cache';
import AlertModal from '../modal/alert-modal';
import { App_State } from '../../store/store';
import { API_END_POINTS } from '../../utility/enums';
import { useDispatch, useSelector } from 'react-redux';
import useAsync, { action } from '../../hooks/use-async';
import { getRequestConfig } from '../../utility/utility';
import { App_User, Modal_Ref } from '../../utility/types';
import { appActions, Cart_Items } from '../../store/app-slice';

export default function Header() {
  const sendRequest = useAsync();
  const dispatch = useDispatch();
  const alertModal = useRef<Modal_Ref>();

  const { value: cart } = useCache<Cart_Items[]>('cart');

  const cartItems = cart.reduce((prev, current) => prev + current.quantity, 0);
  const exception = useSelector((state: App_State) => state.app.exception);
  const user = useSelector(function (state: App_State) {
    return state.app.user;
  });

  function resetCart() {
    sessionStorage.removeItem('cart');
    dispatch(appActions.resetCart());
  }

  async function logout() {
    const user = JSON.parse(
      sessionStorage.getItem('user') as string
    ) as App_User;
    await sendRequest(
      action.bind(
        null,
        getRequestConfig(API_END_POINTS.LOGOUT, {
          url: String(),
          method: 'POST',
          baseURL: import.meta.env.VITE_BASE_URL,
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
      ),
      'LOGOUT'
    );
  }

  return (
    <>
      <AlertModal
        ref={alertModal}
        id="alert-header"
        message={exception?.message || 'Something went wrong'}
      />
      <header>
        <nav className="py-3">
          <div className="mx-auto d-flex justify-content-between align-items-center container-sm">
            <Link to="/">Project 009</Link>
            <div className="dropdown-center">
              <a
                href="#"
                className="navigation-button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Cart <sup>{cartItems}</sup>
              </a>
              <ul className="m-auto p-0 dropdown-menu dropdown-menu-dark">
                <li>
                  <Link className="dropdown-item" to="/orders">
                    Checkout
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={resetCart}>
                    Reset Cart
                  </button>
                </li>
              </ul>
            </div>
            {user && (
              <div className="dropdown">
                <a
                  href="#"
                  className="profile-button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-github"></i>
                </a>
                <ul className="p-0 dropdown-menu dropdown-menu-dark dropdown-menu-end">
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
            {!user && (
              <Link to="/login" className="login-link">
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
