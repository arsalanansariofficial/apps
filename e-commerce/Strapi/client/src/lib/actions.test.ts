import { API_END_POINTS } from './enums';
import { getRequestConfig } from './utils';
import { loginUser, sendRequest } from './actions';
import { state_authenticated_user } from './state';
import { describe, expect, test } from '@jest/globals';
import { App_Authenticated_User, App_Exception } from './types';
import { REQUEST_BODY, REQUEST_METHODS, RESPONSE_STATUS } from './constants';

describe('API Module', function () {
  test.skip('Should not login user with invalid credentials', async function () {
    const formdata = new FormData();

    formdata.set(
      REQUEST_BODY.USER_AUTHENTICATION.identifier,
      'invalid.email@example.com'
    );
    formdata.set(REQUEST_BODY.USER_AUTHENTICATION.password, 'invalid.password');

    const exception = (await loginUser(
      state_authenticated_user,
      formdata
    )) as App_Exception;
    expect(exception.status).toBe(RESPONSE_STATUS.BAD_REQUEST.status);
  });

  test.skip('Should login user with valid credentials', async function () {
    const formdata = new FormData();

    formdata.set(
      REQUEST_BODY.USER_AUTHENTICATION.identifier,
      'first.user@example.com'
    );
    formdata.set(REQUEST_BODY.USER_AUTHENTICATION.password, 'first.user');

    const user = (await loginUser(
      state_authenticated_user,
      formdata
    )) as App_Authenticated_User;
    expect(user.jwt).toBeDefined();
  });

  test.skip('Should return an exception response if there is no network connection', async function () {
    try {
      sendRequest(
        getRequestConfig(API_END_POINTS.LOGIN, {
          url: String(),
          method: REQUEST_METHODS.POST,
          baseURL: String('http://some-invalid-url'),
          headers: { 'content-type': 'application/json' },
          params: {},
          data: {
            identifier: 'first.user@example.com',
            password: 'first.user'
          }
        })
      );
    } catch (error: any) {
      expect(error).toBe(error as App_Exception);
    }
  });
});
