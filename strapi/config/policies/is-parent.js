'use strict';

/**
 * `is-parent` policy.
 */

module.exports = async (ctx, next) => {
  const { id } = ctx.params;
  const [child] = await strapi.services.child.find({
    id,
    'parent.id': ctx.state.user.id,
  });

  if (!child) {
    return ctx.unauthorized(`You can't update this entry`);
  }

  return await next();
};
