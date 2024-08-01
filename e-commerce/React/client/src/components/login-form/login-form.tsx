import './login-form.scss';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AlertModal from '../modal/alert-modal';
import { App_State } from '../../store/store';
import { Modal_Ref } from '../../utility/types';
import { API_END_POINTS } from '../../utility/enums';
import { getRequestConfig } from '../../utility/utility';
import useAsync, { action } from '../../hooks/use-async';
import ConfirmationModal from '../confirmation-modal/confirmation';

export default function LoginForm() {
  const sendRequest = useAsync();
  const alertRef = useRef<Modal_Ref>();
  const exception = useSelector((state: App_State) => state.app.exception);

  async function login(event: any) {
    event.preventDefault();
    event.target.classList.add('was-validated');
    const formData = new FormData(event.target);
    if (event.target.checkValidity()) {
      sendRequest(
        action.bind(
          null,
          getRequestConfig(API_END_POINTS.LOGIN, {
            method: 'POST',
            url: String(),
            baseURL: import.meta.env.VITE_BASE_URL,
            data: {
              username: formData.get('username') as string,
              password: formData.get('password') as string
            }
          })
        ),
        'LOGIN'
      ).then(response => {
        if (response.code || response.message) alertRef.current?.open();
      });
    }
  }

  return (
    <>
      <ConfirmationModal />
      <AlertModal
        id="alert-login"
        message={exception?.message || 'Something went wrong!'}
      />
      <div className="m-auto d-flex flex-column align-items-center container-sm gap-2 form-container">
        <span>Login</span>
        <form
          className="p-3 w-75 d-flex flex-column align-items-center needs-validation login-form"
          onSubmit={login}
          noValidate
        >
          <div className="mb-3 align-self-stretch">
            <input
              required
              type="text"
              name="username"
              placeholder="Username"
              className="form-control"
            />
            <span className="ms-1 invalid-feedback">Username is required.</span>
          </div>
          <div className="mb-3 align-self-stretch">
            <input
              required
              minLength={8}
              name="password"
              type="password"
              placeholder="Password"
              className="form-control"
            />
            <span className="ms-1 invalid-feedback">
              Password must be of atleast 8 characters.
            </span>
          </div>
          <button type="submit" className="btn--primary">
            Login
          </button>
        </form>
        <span className="text-center my-1 banner">
          Don't have have an account ? <Link to="/signup">Sign Up</Link>
        </span>
      </div>
    </>
  );
}
