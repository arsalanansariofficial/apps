"use strict";

/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

function generateRequestBody(product) {
  const currentDate = new Date();
  const currentTimeMs = currentDate.getTime();

  const expiresIn = 60 * 60 * 1000;
  const expiresAt = new Date(currentDate.setTime(currentTimeMs + expiresIn));

  return { expiresAt, product, publishedAt: currentDate };
}

module.exports = createCoreService("api::order.order", ({ strapi }) => ({
  async create(params) {
    // getting request body
    const { products } = params.data;
    const result = await super.create(params);

    // creating downloads
    const dvPromises = products.map((product) =>
      strapi.entityService.create(
        "api::download-verification.download-verification",
        { data: generateRequestBody(product) }
      )
    );

    // inserting downloads
    const dvs = (await Promise.all(dvPromises)).map((dv, index) => ({
      id: dv.id,
      product: products[index],
    }));

    // returning result
    return { ...result, dvs };
  },
}));
