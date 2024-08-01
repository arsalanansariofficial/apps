'use server';
import axios from 'axios';
import processEnv from '../../next-env';
import { API_END_POINTS } from './enums';
import { getRequestConfig } from './utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  App_Request,
  App_Exception,
  App_Response_File,
  App_Product_Public,
  App_Authenticated_User
} from './types';
import {
  ROUTES,
  BOOLEAN,
  IDENTIFIERS,
  REQUEST_BODY,
  RESPONSE_STATUS,
  REQUEST_METHODS
} from './constants';

export async function sendRequest(request: App_Request) {
  try {
    return (await axios.request(request as any)).data;
  } catch (error: any) {
    const exception = error?.response?.data?.error as App_Exception;
    return {
      details: exception?.details || {},
      name: exception?.name || RESPONSE_STATUS.INTERNAL_SERVER_ERROR.text,
      message: exception?.message || RESPONSE_STATUS.INTERNAL_SERVER_ERROR.text,
      status: exception?.status || RESPONSE_STATUS.INTERNAL_SERVER_ERROR.status
    } as App_Exception;
  }
}

export async function loginUser(
  _state: App_Authenticated_User | App_Exception,
  formdata: FormData
) {
  const identifier = formdata.get(REQUEST_BODY.USER_AUTHENTICATION.identifier);
  const password = formdata.get(REQUEST_BODY.USER_AUTHENTICATION.password);

  if (!identifier || !password)
    return {
      details: {},
      name: RESPONSE_STATUS.BAD_REQUEST.text,
      message: RESPONSE_STATUS.BAD_REQUEST.text,
      status: RESPONSE_STATUS.BAD_REQUEST.status
    } as App_Exception;

  return (await sendRequest(
    getRequestConfig(API_END_POINTS.LOGIN, {
      url: String(),
      method: REQUEST_METHODS.POST,
      baseURL: processEnv.BASE_URL,
      headers: { 'content-type': 'application/json' },
      params: {},
      data: {
        identifier,
        password
      }
    })
  )) as App_Authenticated_User | App_Exception;
}

export async function loginAdmin(_state: any, formdata: FormData) {
  const email = formdata.get(REQUEST_BODY.USER_AUTHENTICATION.identifier);
  const password = formdata.get(REQUEST_BODY.USER_AUTHENTICATION.password);

  if (!email || !password)
    return {
      details: {},
      name: RESPONSE_STATUS.BAD_REQUEST.text,
      message: RESPONSE_STATUS.BAD_REQUEST.text,
      status: RESPONSE_STATUS.BAD_REQUEST.status
    } as App_Exception;

  return await sendRequest(
    getRequestConfig(API_END_POINTS.LOGIN_ADMIN, {
      url: String(),
      method: REQUEST_METHODS.POST,
      baseURL: processEnv.BASE_URL,
      headers: {},
      params: {},
      data: {
        email,
        password
      }
    })
  );
}

export async function getSales(_state: any, formdata: FormData) {
  const token = formdata.get(IDENTIFIERS.TOKEN) as string;

  return await sendRequest(
    getRequestConfig(API_END_POINTS.READ_ORDERS_ADMIN, {
      url: String(),
      method: REQUEST_METHODS.GET,
      baseURL: processEnv.BASE_URL,
      headers: {
        authorization: `${IDENTIFIERS.BEARER} ${token}`
      },
      params: {},
      data: {}
    })
  );
}

export async function getProducts() {
  return await sendRequest(
    getRequestConfig(API_END_POINTS.READ_PRODUCTS, {
      url: String(),
      method: REQUEST_METHODS.GET,
      baseURL: processEnv.BASE_URL,
      headers: {},
      params: {},
      data: {}
    })
  );
}

export async function getProduct(id: string) {
  return await sendRequest(
    getRequestConfig(API_END_POINTS.READ_PRODUCT, {
      url: String(),
      method: REQUEST_METHODS.GET,
      baseURL: processEnv.BASE_URL,
      headers: {},
      params: { id },
      data: {}
    })
  );
}

export async function updateProductAdmin(
  token: string,
  product: App_Product_Public,
  images: App_Response_File[],
  formdata: FormData
) {
  const name = String(formdata.get('product-name'));
  const priceInCents = Number(formdata.get('product-price'));
  const description = String(formdata.get('product-description'));
  const isAvailableForPurchase =
    String(formdata.get('product-availability')) === BOOLEAN.TRUE;
  const newProduct = {
    ...product.attributes,
    imagePath: images,
    isAvailableForPurchase,
    name: name || product.attributes.name,
    description: description || product.attributes.description,
    priceInCents: priceInCents || product.attributes.priceInCents
  };

  await sendRequest(
    getRequestConfig(API_END_POINTS.UPDATE_PRODUCT_ADMIN, {
      url: String(),
      method: REQUEST_METHODS.PUT,
      baseURL: processEnv.BASE_URL,
      headers: {
        authorization: `${IDENTIFIERS.BEARER} ${token}`
      },
      params: { id: product.id },
      data: newProduct
    })
  );

  revalidatePath(ROUTES.PRODUCTS);
  return redirect(ROUTES.PRODUCTS);
}

export async function getMediaLibraryAdmin(formdata: FormData) {
  const token = formdata.get(IDENTIFIERS.TOKEN) as string;

  return await sendRequest(
    getRequestConfig(API_END_POINTS.GET_MEDIA_LIBRARY_ADMIN, {
      url: String(),
      method: REQUEST_METHODS.GET,
      baseURL: processEnv.BASE_URL,
      headers: {
        authorization: `${IDENTIFIERS.BEARER} ${token}`
      },
      params: {},
      data: {}
    })
  );
}

export async function uploadFilesAdmin(formdata: FormData) {
  try {
    const files: FormData[] = [];
    const token = formdata.get(IDENTIFIERS.TOKEN) as string;

    formdata.forEach(fd => {
      if (fd instanceof File) {
        const formdata = new FormData();

        formdata.append(IDENTIFIERS.FILES, fd);
        formdata.append(
          IDENTIFIERS.FILE_INFO,
          JSON.stringify({ name: fd.name, folder: null })
        );

        return files.push(formdata);
      }
    });

    const filesPromise = files.map(fd =>
      sendRequest(
        getRequestConfig(API_END_POINTS.UPLOAD_FILES_ADMIN, {
          url: String(),
          method: REQUEST_METHODS.POST,
          baseURL: processEnv.BASE_URL,
          headers: {
            authorization: `${IDENTIFIERS.BEARER} ${token}`
          },
          params: {},
          data: fd
        })
      )
    );

    return (await Promise.all(filesPromise)).map(response => ({
      ...response[0]
    }));
  } catch (error: any) {
    return error;
  }
}

export async function deleteFilesAdmin(formdata: FormData) {
  const token = formdata.get(IDENTIFIERS.TOKEN) as string;
  const fileIds = JSON.parse(
    formdata.get(REQUEST_BODY.DELETE_FILES_ADMIN.fileIds) as string
  ) as number[];

  return await sendRequest(
    getRequestConfig(API_END_POINTS.DELETE_FILES_ADMIN, {
      url: String(),
      method: REQUEST_METHODS.POST,
      baseURL: processEnv.BASE_URL,
      headers: {
        authorization: `${IDENTIFIERS.BEARER} ${token}`
      },
      params: {},
      data: { fileIds }
    })
  );
}
