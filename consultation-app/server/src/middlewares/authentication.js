import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';
import {
  responseCodes,
  generateError,
  sendResponse,
  usersExceptions
} from '../utils/utils.js';

export default async function authentication(request, response, next) {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const _id = jwt.verify(token, process.env.secret)._id;
    const user = await UserModel.findOne({ _id, 'tokens.token': token });
    if (!user)
      return sendResponse(
        responseCodes.UN_AUTHORIZED,
        generateError(
          responseCodes.UN_AUTHORIZED,
          usersExceptions.UN_AUTHORIZED
        ),
        response
      );
    request.user = user;
    request.token = token;
    next();
  } catch (error) {
    return sendResponse(
      responseCodes.UN_AUTHORIZED,
      generateError(responseCodes.UN_AUTHORIZED, usersExceptions.UN_AUTHORIZED),
      response
    );
  }
}
