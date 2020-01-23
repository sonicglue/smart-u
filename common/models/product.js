'use strict';
// NodeJs modules
let _ = require('underscore');
let async = require('async');

module.exports = function(Product) {
  // TODO: implementar código del modelo
  // Métodos remotos
  /**
   * @name setAccesories
   */
  Product.setAccessories = function(data, done) {
    let newError = Product.app.newError;
    if (!data.idProduct) {
      // ...
      return done(newError(400,
        'No se incluyó el identificador del producto.'));
    }
    if (!data.accessories || !data.accessories.length) {
      // ...no hay accesorios
      return done(newError(400,
        'No se incluyó datos de los accesorios.'));
    }
    done();
  };// End setAccesories
};
