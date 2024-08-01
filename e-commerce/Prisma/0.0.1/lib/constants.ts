export const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 0
});

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
