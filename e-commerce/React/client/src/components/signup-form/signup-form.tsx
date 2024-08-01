import './signup-form.scss';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AlertModal from '../modal/alert-modal';
import { App_State } from '../../store/store';
import { Modal_Ref } from '../../utility/types';
import { API_END_POINTS } from '../../utility/enums';
import useAsync, { action } from '../../hooks/use-async';
import { getRequestConfig } from '../../utility/utility';
import ConfirmationModal from '../confirmation-modal/confirmation';

export default function SignupForm() {
  const sendRequest = useAsync();
  const alertRef = useRef<Modal_Ref>();
  const exception = useSelector((state: App_State) => state.app.exception);

  async function signup(event: any) {
    event.preventDefault();
    event.target.classList.add('was-validated');
    const formData = new FormData(event.target);
    if (event.target.checkValidity()) {
      sendRequest(
        action.bind(
          null,
          getRequestConfig(API_END_POINTS.SIGN_UP, {
            method: 'POST',
            url: String(),
            baseURL: import.meta.env.VITE_BASE_URL,
            data: {
              username: formData.get('username') as string,
              password: formData.get('password') as string
            }
          })
        ),
        'SIGN_UP'
      ).then(response => {
        if (response.code || response.message) alertRef.current?.open();
      });
    }
  }

  return (
    <>
      <AlertModal
        ref={alertRef}
        id="alert-signup"
        message={exception?.message || 'Something went wrong!'}
      />
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
              required
              type="text"
              name="username"
              placeholder="Username"
              className="form-control"
            />
            <span className="ms-1 invalid-feedback">
              Enter the valid email.
            </span>
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
