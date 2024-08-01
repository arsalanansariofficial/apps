"use strict";

/**
 * download-verification service
 */

const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::download-verification.download-verification",
  ({ strapi }) => ({
    async findOne(entityId, params) {
      // getting request body
      const result = await super.findOne(entityId, params);

      // getting download link
      const dv = await strapi.entityService.findOne(
        "api::download-verification.download-verification",
        entityId
      );
      const expiresAt = new Date(dv.expiresAt.toString());

      // verifying download link
      if (new Date() > expiresAt)
        throw new ApplicationError("Download link expired", { expiresAt });

      // returning result
      return result;
    },
  })
);
