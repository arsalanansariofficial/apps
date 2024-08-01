import express from 'express';
import { OrderModel } from '../models/order.js';
import { authentication } from '../middleware/authentication.js';

const orderRouter = new express.Router();

// create new order
orderRouter.post('/orders', authentication, async (request, response) => {
  const order = new OrderModel({
    ...request.body,
    userId: request.user._id
  });
  try {
    response.status(201).send(await order.save());
  } catch (error) {
    response.status(500).send(error);
  }
});

// get all orders for a user
orderRouter.get('/orders', authentication, async (request, response) => {
  try {
    const sort = {};
    const match = {};

    // This uses one-to-many relationship from user --> order
    const { orders } = await request.user
      .populate({
        path: 'orders',
        match,
        options: {
          sort,
          skip: parseInt(request.query.skip),
          limit: parseInt(request.query.limit)
        }
      })
      .execPopulate();

    response.status(200).send(orders);
  } catch (error) {
    response.status(500).send(error);
  }
});

// get a single order by id for a user
orderRouter.get('/orders/:id', authentication, async (request, response) => {
  try {
    const order = await OrderModel.findOne({
      _id: request.params.id,
      userId: request.user._id
    });

    if (!order) {
      const errorResponse = {
        code: 404,
        message: `No order found with id: ${request.params.id}`
      };
      return response.status(404).send(errorResponse);
    }

    response.status(200).send(order);
  } catch (error) {
    response.status(500).send(error);
  }
});

// update an order by id for a user
orderRouter.put('/orders/:id', authentication, async (request, response) => {
  try {
    const keys = Object.keys(request.body);
    const order = await OrderModel.findOne({
      _id: request.params.id,
      userId: request.user._id
    });

    if (!order) {
      const errorResponse = {
        code: 404,
        message: `No order found with id: ${request.params.id}`
      };
      return response.status(404).send(errorResponse);
    }

    keys.forEach(key => (order[key] = request.body[key]));

    response.status(201).send(await order.save());
  } catch (error) {
    response.status(500).send(error);
  }
});

// delete an order by id for a user
orderRouter.delete('/orders/:id', authentication, async (request, response) => {
  try {
    const order = await OrderModel.findOneAndDelete({
      _id: request.params.id,
      userId: request.user._id
    });

    if (!order) {
      const errorResponse = {
        code: 404,
        message: `No order found with id: ${request.params.id}`
      };
      return response.status(404).send(errorResponse);
    }

    response.status(201).send(order);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default orderRouter;
