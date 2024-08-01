import { App_Request } from './types';
import { API_END_POINTS } from './enums';

export function deleteObject(identifier: string) {
  return sessionStorage.removeItem(identifier);
}

export function storeObject(identifier: string, value: any) {
  sessionStorage.setItem(identifier, JSON.stringify(value));
}

export function retrieveObject<T>(identifier: string) {
  return JSON.parse(sessionStorage.getItem(identifier)!) as T;
}

export function getRequestConfig(identifier: number, request: App_Request) {
  let url;

  switch (identifier) {
    // User Routes
    case API_END_POINTS.LOGIN:
      url = '/api/auth/local';
      break;
    case API_END_POINTS.READ_ORDERS:
      url = `/api/orders?populate=*`;
      break;
    case API_END_POINTS.READ_ORDERS:
      url = `/api/orders?populate=*`;
      break;
    case API_END_POINTS.REGISTER:
      url = '/api/auth/local/register';
      break;
    case API_END_POINTS.CREATE_ORDER:
      url = '/api/orders';
      break;
    case API_END_POINTS.READ_PRODUCTS:
      url = '/api/products?populate[imagePath]=*';
      break;
    case API_END_POINTS.READ_ORDER:
      url = `/api/orders/${request.params.id}?populate=*`;
      break;
    case API_END_POINTS.READ_DOWNLOAD:
      url = `/api/download-verifications/${request.params.id}`;
      break;
    case API_END_POINTS.READ_USER:
      url = '/api/users/me?populate[orders][populate][products]=*';
      break;
    case API_END_POINTS.READ_PRODUCT:
      url = `/api/products/${request.params.id}?populate[imagePath]=*`;
      break;

    // Admin routes

    case API_END_POINTS.LOGIN_ADMIN:
      url = '/admin/login';
      break;
    case API_END_POINTS.UPLOAD_FILES_ADMIN:
      url = '/upload';
      break;
    case API_END_POINTS.DELETE_FILES_ADMIN:
      url = '/upload/actions/bulk-delete';
      break;
    case API_END_POINTS.GET_MEDIA_LIBRARY_ADMIN:
      url = '/upload/files';
      break;
    case API_END_POINTS.READ_ORDERS_ADMIN:
      url = '/content-manager/collection-types/api::order.order';
      break;
    case API_END_POINTS.UPDATE_PRODUCT_ADMIN:
      url = `/content-manager/collection-types/api::product.product/${request.params.id}`;
      break;

    // Default
    default:
      url = '/api/products?populate[imagePath]=*';
  }

  request.url = url;
  return request;
}
