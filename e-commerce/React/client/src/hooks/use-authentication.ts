import { useDispatch } from 'react-redux';
import { App_User } from '../utility/types';
import { appActions } from '../store/app-slice';
import { calculateExpirationTime, setExpirationDate } from '../utility/utility';

export let logoutTimer: number | undefined;

export default function useAuthentication() {
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem('user') as string);

  function logoutHandler() {
    sessionStorage.clear();
    clearTimeout(logoutTimer);
    dispatch(appActions.logout());
    dispatch(appActions.resetCart());
  }

  function autoLogin() {
    if (user) {
      const expirationTime = calculateExpirationTime(user.expirationDate);
      dispatch(appActions.login(user));
      logoutTimer = setTimeout(logoutHandler, expirationTime);
    }
  }

  function loginHandler(response: { user: App_User; token: string }) {
    const user = {
      ...response.user,
      token: response.token,
      expirationDate: setExpirationDate()
    } as App_User;
    sessionStorage.setItem('user', JSON.stringify(user));
    dispatch(appActions.login(user));
    const expirationTime = calculateExpirationTime(user.expirationDate!);
    logoutTimer = setTimeout(logoutHandler, expirationTime);
  }

  return { autoLogin, loginHandler, logoutHandler };
}
