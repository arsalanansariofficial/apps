import { App_Request } from './types';
import { API_END_POINTS } from './enums';

export function setExpirationDate() {
  return new Date(
    new Date().getTime() + import.meta.env.VITE_SESSION_TIMOUT * 1000
  ).toISOString();
}

export function calculateExpirationTime(expirationDate: string) {
  const currentTime = new Date().getTime();
  const expirationTime = new Date(expirationDate).getTime();
  return expirationTime - currentTime;
}

export function getRequestConfig(identifier: number, request: App_Request) {
  let url;

  switch (identifier) {
    case API_END_POINTS.LOGIN:
      url = `${request.baseURL}/users/login`;
      break;

    case API_END_POINTS.SIGN_UP:
      url = `${request.baseURL}/users`;
      break;

    case API_END_POINTS.LOGOUT:
      url = `${request.baseURL}/users/logout`;
      break;

    case API_END_POINTS.CREATE_ORDER:
      url = `${request.baseURL}/orders`;
      break;

    case API_END_POINTS.GET_PRODUCT:
      url = `${request.baseURL}/products/${request.params.productId}`;
      break;

    case API_END_POINTS.READ_USER:
      url = `${request.baseURL}/users`;
      break;

    default:
      url = '/products';
  }

  request.url = url;
  return request;
}
