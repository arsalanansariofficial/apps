import './signup-form.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'bootstrap';
import { User } from '../../utility/types';
import useHttp from '../../hooks/use-http';
import AlertModal from '../modal/alert-modal';
import ConfirmationModal from '../confirmation-modal/confirmation';
import { getSignupRequest, getLoginRequest } from '../../utility/utility';
import useAuthentication from '../../hooks/use-authentication';

export default function SignupForm() {
  const [error, setError] = useState<string>(String());
  const { sendRequest } = useHttp();
  const { loginHandler } = useAuthentication();

  async function signup(event: any) {
    event.preventDefault();
    if (event.target.checkValidity()) {
      event.stopPropagation();
      const formData = new FormData(event.target);
      try {
        const signupRequest = getSignupRequest(formData);
        await sendRequest(signupRequest);
        const loginRequest = getLoginRequest(formData);
        const user: User = await sendRequest(loginRequest);
        return loginHandler(user);
      } catch (error: any) {
        setError(error.message);
        return new Modal('#alert-signup');
      }
    }
    event.target.classList.add('was-validated');
  }

  return (
    <>
      <AlertModal id="alert-signup" message={error} />
      <ConfirmationModal />
      <div className="m-auto d-flex flex-column align-items-center container-sm gap-2 form-container">
        <span>Create your account</span>
        <form
          className="p-3 w-75 d-flex flex-column align-items-center needs-validation signup-form"
          onSubmit={signup}
          noValidate
        >
          <div className="mb-3 align-self-stretch">
            <input
              name="first-name"
              type="text"
              className="form-control"
              placeholder="First Name"
              minLength={3}
              required
            />
            <span className="ms-1 invalid-feedback">
              Enter atleat 5 characters.
            </span>
          </div>
          <div className="mb-3 align-self-stretch">
            <input
              name="last-name"
              type="text"
              className="form-control"
              placeholder="Last Name"
              minLength={3}
              required
            />
            <span className="ms-1 invalid-feedback">
              Enter atleat 5 characters.
            </span>
          </div>
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
          <div className="mb-3 align-self-stretch">
            <input
              name="mobile-number"
              type="text"
              className="form-control"
              placeholder="Mobile Number"
              pattern="[0-9]{10}"
              required
            />
            <span className="ms-1 invalid-feedback">
              Enter valid mobile number.
            </span>
          </div>
          <button type="submit" className="btn--primary">
            Sign Up
          </button>
        </form>
        <span className="text-center my-1 banner">
          Already have have an account ? <Link to="/login">Login</Link>
        </span>
      </div>
    </>
  );
}
