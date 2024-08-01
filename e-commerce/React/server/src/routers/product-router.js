import express from 'express';
import { ProductModel } from '../models/product.js';

const productRouter = new express.Router();

// create new product
productRouter.post('/products', async (request, response) => {
  const product = new ProductModel(request.body);
  try {
    response.status(201).send(await product.save());
  } catch (error) {
    response.status(500).send(error);
  }
});

// get all products
productRouter.get('/products', async (request, response) => {
  try {
    const product = await ProductModel.find({});
    response.status(200).send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});

// get a single product
productRouter.get('/products/:id', async (request, response) => {
  try {
    const product = await ProductModel.findOne({
      _id: request.params.id
    });

    if (!product) {
      const errorResponse = {
        code: 404,
        message: `No product found with id: ${request.params.id}`
      };
      return response.status(404).send(errorResponse);
    }

    response.status(200).send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});

// update a product
productRouter.put('/products/:id', async (request, response) => {
  try {
    const keys = Object.keys(request.body);
    const product = await ProductModel.findOne({
      _id: request.params.id
    });

    if (!product) {
      const errorResponse = {
        code: 404,
        message: `No product found with id: ${request.params.id}`
      };
      return response.status(404).send(errorResponse);
    }

    keys.forEach(key => (product[key] = request.body[key]));

    response.status(201).send(await product.save());
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// delete a product
productRouter.delete('/products/:id', async (request, response) => {
  try {
    const product = await ProductModel.findOneAndDelete({
      _id: request.params.id
    });

    if (!product) {
      const errorResponse = {
        code: 404,
        message: `No product found with id: ${request.params.id}`
      };
      return response.status(404).send(errorResponse);
    }

    response.status(201).send(product);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default productRouter;
