import { useDispatch } from 'react-redux';
import { userActions } from '../store/user-slice';
import { User } from '../utility/types';
import { calculateExpirationTime, setExpirationDate } from '../utility/utility';

export let logoutTimer: number | undefined;

export default function useAuthentication() {
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem('user')!);

  function logoutHandler() {
    clearTimeout(logoutTimer);
    sessionStorage.clear();
    dispatch(userActions.logout());
  }

  function autoLogin() {
    if (user) {
      const expirationTime = calculateExpirationTime(user.expirationDate);
      dispatch(userActions.login(user));
      logoutTimer = setTimeout(logoutHandler, expirationTime);
    }
  }

  function loginHandler(response: User & { emailId: string }) {
    const user: User = {
      ...response,
      emailAddress: response.emailId,
      expirationDate: setExpirationDate()
    };
    sessionStorage.setItem('user', JSON.stringify(user));
    dispatch(userActions.login(user));
    const expirationTime = calculateExpirationTime(user.expirationDate!);
    logoutTimer = setTimeout(logoutHandler, expirationTime);
  }

  return { autoLogin, loginHandler, logoutHandler };
}
