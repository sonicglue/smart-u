'use strict';

module.exports = function(Brand) {
  // Funciones generales
  function beforeCreate(ctx, instance, done) {
    console.log('Brand call beforeCreate');
    let tag = Brand.app.convertToSlug(ctx.args.data.name);
    Brand.findOne({where: {tag: tag}}, (err, iBrand) => {
      if (err) return done(err);

      if (iBrand) {
        // ...la marca ya está registrada
        return done(Brand.app.newError(422,
          'Error X01: No se puede registrar la marca \'' +
          ctx.args.data.name +
          '\' Esta marca ya se encuentra en la lista del sistema.',
          {field: 'name'}));
      } else {
        // ...es una marca nueva
        ctx.args.data.tag = tag;
        done();
      }
    });
  }// End beforeCreate
  // Middlewares
  Brand.beforeRemote('create', beforeCreate);
};
