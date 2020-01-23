'use strict';

module.exports = function(Brand) {
  // TODO: implementar código del modelo
  function beforeCreate(ctx, instance, done) {
    console.log('Brand call beforeCreate');
    let tag = Brand.app.convertToSlug(ctx.args.data.name);
    Brand.findOne({where: {tag: tag}}, (err, iBrand) => {
      if (err) return done(err);

      if (iBrand) {
        console.log(iBrand);
        return done(Brand.app.newError(422,
          'Error X01: No se puede registrar la marca \'' +
          ctx.args.data.name +
          '\' Esta marca ya se encuentra en la lista del sistema.'));
      } else {
        ctx.args.data.tag = tag;
        done();
      }
    });
  }// End beforeCreate
  // Middlewares
  Brand.beforeRemote('create', beforeCreate);
};
