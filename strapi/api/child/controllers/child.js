'use strict';
const { sanitizeEntity } = require('strapi-utils');


/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        let entity;
        if (ctx.state.user.role.name === "Parent"){
            ctx.request.body.parent = ctx.state.user.id;
        }
        entity = await strapi.services.child.create(ctx.request.body);
        return sanitizeEntity(entity, { model: strapi.models.child });
    },

    async find(ctx) {
        let entities;
        if (ctx.query._q) {
          entities = await strapi.services.child.search(ctx.query);
        } else {
          entities = await strapi.services.child.find(ctx.query);
        }
        // Filter only user's children
        let children = entities.filter((child) => child.parent != null && child.parent.id === ctx.state.user.id)
        return children.map(entity => sanitizeEntity(entity, { model: strapi.models.child }));
    },
};
