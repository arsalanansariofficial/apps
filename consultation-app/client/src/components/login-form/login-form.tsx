import './login-form.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'bootstrap';
import { User } from '../../utility/types';
import useHttp from '../../hooks/use-http';
import AlertModal from '../modal/alert-modal';
import { getLoginRequest } from '../../utility/utility';
import useAuthentication from '../../hooks/use-authentication';
import ConfirmationModal from '../confirmation-modal/confirmation';

export default function LoginForm() {
  const { sendRequest } = useHttp();
  const { loginHandler } = useAuthentication();
  const [error, setError] = useState<string>(String());

  async function login(event: any) {
    event.preventDefault();
    if (event.target.checkValidity()) {
      event.stopPropagation();
      const formData = new FormData(event.target);
      const request = getLoginRequest(formData);
      try {
        const user: User = await sendRequest(request);
        return loginHandler(user);
      } catch (error: any) {
        setError(error.message);
        return new Modal('#alert-login').show();
      }
    }
    event.target.classList.add('was-validated');
  }

  return (
    <>
      <AlertModal id="alert-login" message={error} />
      <ConfirmationModal />
      <div className="m-auto d-flex flex-column align-items-center container-sm gap-2 form-container">
        <span>Login</span>
        <form
          className="p-3 w-75 d-flex flex-column align-items-center needs-validation login-form"
          onSubmit={login}
          noValidate
        >
          <div className="mb-3 align-self-stretch">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              required
            />
            <span className="ms-1 invalid-feedback">
              Enter the valid email.
            </span>
          </div>
          <div className="mb-3 align-self-stretch">
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              minLength={8}
              required
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
