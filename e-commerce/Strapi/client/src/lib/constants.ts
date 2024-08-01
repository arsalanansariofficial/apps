export const BOOLEAN = {
  TRUE: 'true',
  FALSE: 'false'
};

export const REQUEST_METHODS = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export const ROUTES = {
  LOGIN: '/login',
  SALES: '/sales',
  ORDERS: '/orders',
  PRODUCTS: '/products/',
  DASHBOARD: '/dashboard'
};

export const IDENTIFIERS = {
  USER: 'USER',
  FILES: 'files',
  TOKEN: 'TOKEN',
  BEARER: 'Bearer',
  FILE_INFO: 'fileInfo',
  AVAILABLE: 'AVAILABLE',
  NOT_AVAILABLE: 'NOT_AVAILABLE'
};

export const REQUEST_BODY = {
  DELETE_FILES_ADMIN: {
    fileIds: 'fileIds'
  },
  USER_AUTHENTICATION: {
    password: 'password',
    identifier: 'identifier'
  }
};

export const RESPONSE_STATUS = {
  OK: {
    status: 200,
    text: 'Success'
  },
  BAD_REQUEST: {
    status: 400,
    text: 'Bad Request'
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    text: 'Internal Server Error'
  }
};
