"use strict";

/**
 * download-verification router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::download-verification.download-verification"
);
