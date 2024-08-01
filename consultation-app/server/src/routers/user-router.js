import express from 'express';
import UserModel from '../models/user.js';
import authentication from '../middlewares/authentication.js';
import {
  responseCodes,
  sendResponse,
  usersMethods,
  usersURL,
  generateError,
  get_user,
  populateAppointments
} from '../utils/utils.js';

const userRouter = new express.Router();

async function generateResponse(method, request, response) {
  let _user, user, tokens, token, appointmentId;
  switch (method) {
    case usersMethods.CREATE_USER:
      try {
        user = new UserModel(request.body);
        return sendResponse(responseCodes.CREATED, await user.save(), response);
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case usersMethods.LOGIN_USER:
      try {
        const auth = atob(request.headers.authorization.split(' ')[1]).split(
          ':'
        );
        const emailId = auth[0];
        const password = auth[1];
        _user = await UserModel.findByCredentials(emailId, password);
        token = await _user.generateAuthenticationToken();
        user = get_user(_user, token);
        return sendResponse(responseCodes.OK, user, response);
      } catch (error) {
        return sendResponse(error.code, error, response);
      }
    case usersMethods.LOGOUT_USER:
      try {
        user = request.user;
        user.tokens = user.tokens.filter(
          ({ token }) => token !== request.token
        );
        return sendResponse(responseCodes.OK, await user.save(), response);
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case usersMethods.GET_USER:
      try {
        return sendResponse(responseCodes.OK, request.user, response);
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
    case usersMethods.GET_APPOINTMENTS:
      try {
        const appointments = await populateAppointments(request.user, request);
        return sendResponse(responseCodes.OK, appointments, response);
      } catch (error) {
        return sendResponse(
          responseCodes.INTERNAL_SERVER_ERROR,
          generateError(responseCodes.INTERNAL_SERVER_ERROR, error.message),
          response
        );
      }
  }
}

userRouter.get(
  usersURL.GET_USER,
  authentication,
  generateResponse.bind(this, usersMethods.GET_USER)
);

userRouter.get(
  usersURL.GET_APPOINTMENTS,
  authentication,
  generateResponse.bind(this, usersMethods.GET_APPOINTMENTS)
);

userRouter.post(
  usersURL.CREATE_USER,
  generateResponse.bind(this, usersMethods.CREATE_USER)
);

userRouter.post(
  usersURL.LOGIN_USER,
  generateResponse.bind(this, usersMethods.LOGIN_USER)
);

userRouter.post(
  usersURL.LOGOUT_USER,
  authentication,
  generateResponse.bind(this, usersMethods.LOGOUT_USER)
);

export default userRouter;
