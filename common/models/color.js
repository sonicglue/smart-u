'use strict';
// Modulos de NodeJs
let _ = require('underscore');

module.exports = function(Color) {
  // TODO: implementar código del modelo
  function beforeCreate(ctx, instance, done) {
    console.log('Color call beforeCreate');
    let tag = Color.app.convertToSlug(ctx.args.data.name);
    Color.find({order: ['index DESC']}, (err, iColor) => {
      if (err) return done(err);
      let index = iColor[0].index + 1;
      let colorExist = _.find(iColor, color => {
        return color.tag === tag;
      });
      if (colorExist) {
        return done(Color.app.newError(422,
          'Error X01: No se puede registrar el color \'' +
          ctx.args.data.name +
          '\' Este color ya se encuentra en la lista del sistema.'));
      } else {
        ctx.args.data.tag = tag;
        ctx.args.data.index = index;
        done();
      }
    });
  }// End beforeCreate
  // Middlewares
  Color.beforeRemote('create', beforeCreate);
};
