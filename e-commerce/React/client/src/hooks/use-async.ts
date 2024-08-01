import axios from 'axios';
import { useDispatch } from 'react-redux';
import { appActions } from '../store/app-slice';
import useAuthentication from './use-authentication';
import { App_Exception, App_Request } from '../utility/types';

export async function action(request: App_Request) {
  try {
    return (await axios.request(request as any)).data;
  } catch (error: any) {
    const exception = error?.response?.data as App_Exception;
    return {
      code: exception?.code || 500,
      message: exception?.message || 'Internal Server Error'
    };
  }
}

export default function useAsync() {
  const dispatch = useDispatch();
  const { loginHandler, logoutHandler } = useAuthentication();

  async function sendRequest(
    action: () => Promise<any>,
    responseType:
      | 'LOGIN'
      | 'PRODUCTS'
      | 'PRODUCT'
      | 'LOGOUT'
      | 'SIGN_UP'
      | 'CREATE_ORDER'
      | 'READ_USER'
  ) {
    dispatch(appActions.setIsLoading(true));

    const response = await action();

    if (response.code || response.message)
      dispatch(appActions.setException(response as App_Exception));
    else {
      switch (responseType) {
        case 'PRODUCTS':
          dispatch(appActions.setProducts(response));
          break;

        case 'PRODUCT':
          loginHandler(response);
          break;

        case 'LOGOUT':
          logoutHandler();
          break;

        case 'CREATE_ORDER':
          break;

        case 'READ_USER':
          dispatch(appActions.setUserHavingOrders(response));
          break;

        default:
          loginHandler(response);
      }
    }

    dispatch(appActions.setIsLoading(false));
    return response;
  }

  return sendRequest;
}
