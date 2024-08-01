import express from 'express';
import { UserModel } from '../models/user.js';
import { authentication } from '../middleware/authentication.js';

const userRouter = new express.Router();

userRouter.post('/users', async (request, response) => {
  const user = new UserModel(request.body);
  user.profilePicture = 'default-profile-picture.png';
  try {
    const token = await user['generateAuthenticationToken']();
    // sendWelcomeEmail(user['email'], user['name']);
    response.status(201).send({ user, token });
  } catch (error) {
    response.status(500).send(error);
  }
});

userRouter.post('/users/login', async (request, response) => {
  try {
    const user = await UserModel['findByCredentials'](
      request.body.email,
      request.body.password
    );
    const token = await user['generateAuthenticationToken']();
    response.status(200).send({ user, token });
  } catch (error) {
    if (error.message === 'Failed to login') {
      const errorResponse = {
        code: 400,
        message: error.message
      };
      response.status(400).send(errorResponse);
    } else response.status(500).send(error);
  }
});

userRouter.post('/users/logout', authentication, async (request, response) => {
  try {
    request.user.tokens = request.user.tokens.filter(({ token }) => {
      return token !== request.token;
    });
    await request.user.save();
    response.status(200).send('Session deactivated');
  } catch (error) {
    response.status(500).send(error);
  }
});

userRouter.post(
  '/users/logoutAll',
  authentication,
  async (request, response) => {
    try {
      request.user.tokens = [];
      await request.user.save();
      response.status(200).send('Sessions deactivated');
    } catch (error) {
      response.status(500).send(error);
    }
  }
);

userRouter.get('/users', authentication, async (request, response) => {
  const { orders } = await request.user
    .populate({ path: 'orders' })
    .execPopulate();

  // populate orders for user
  request.user._doc.orders = orders;

  response.status(200).send(request.user);
});

userRouter.patch('/users', authentication, async (request, response) => {
  const keys = Object.keys(request.body);
  const allowedKeys = ['username', 'password'];
  const isValidUser = keys.every(key => allowedKeys.includes(key));

  if (!isValidUser) {
    const errorResponse = {
      code: 400,
      message: 'Invalid updates'
    };
    return response.status(400).send(errorResponse);
  }

  try {
    keys.forEach(key => (request.user[key] = request.body[key]));
    await request.user.save();
    response.status(201).send(request.user);
  } catch (error) {
    response.status(500).send(error);
  }
});

userRouter.delete('/users', authentication, async (request, response) => {
  try {
    await request.user.remove();
    response.send(request.user);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default userRouter;
