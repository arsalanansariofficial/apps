import './header.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal } from 'bootstrap';
import useHttp from '../../hooks/use-http';
import AlertModal from '../modal/alert-modal';
import { Request, State } from '../../utility/types';
import { API_END_POINTS } from '../../utility/enums';
import { getRequestPath } from '../../utility/utility';
import useAuthentication from '../../hooks/use-authentication';

export default function Header() {
  const user = useSelector(function (state: State) {
    return state.user.user;
  });

  const { sendRequest } = useHttp();
  const { logoutHandler } = useAuthentication();

  const [error, setError] = useState<string>(String());

  async function logout() {
    const request: Request = {
      path: getRequestPath(API_END_POINTS.LOGOUT),
      method: 'POST',
      header: { Authorization: `Bearer ${user!.accessToken}` }
    };
    try {
      await sendRequest(request);
      logoutHandler();
    } catch (error: any) {
      setError(error.message);
      new Modal('#alert-header').show();
    }
  }

  return (
    <>
      <AlertModal id="alert-header" message={error} />
      <header>
        <nav className="py-3">
          <div className="mx-auto d-flex justify-content-between align-items-center container-sm">
            <Link to="/">Pocket</Link>
            <div className="dropdown-center">
              <a
                href="#"
                className="navigation-button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Navigate
              </a>
              <ul className="m-auto p-0 dropdown-menu dropdown-menu-dark">
                <li>
                  <a className="dropdown-item" href="#">
                    Page Name
                  </a>
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
