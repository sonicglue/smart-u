'use strict';
// Módulos adicionales de NodeJS
let _ = require('underscore');

module.exports = function(app) {
  let SysUser = app.models.SysUser;
  let AccessToken = app.models.AccessToken;
  // Crear la relación entre SysUser y Accesstoken
  AccessToken.belongsTo(SysUser, {foreignKey: 'userId', as: 'user'});
  // Fuciones generales
  /**
   * @name commonCallback
   * @description Devuelve una función de callback para los metodos de async.
   * @param {function} next Función de callback.
   */
  app.commonCallback = function(next) {
    return function(err) {
      if (err) return next(err);
      next();
    };
  };
  /**
   * @name convertToSlug
   * @description Prepara una cadena de texto en formato friendlyUrl.
   * @param {string} string Texto para dar formato.
   */
  app.convertToSlug = function(string) {
    const findThis = ['á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú', 'ñ',
      'Ñ', 'ü', 'Ü'];
    const replaceWithThis = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U',
      'n', 'N', 'u', 'U'];
    let result = string.toLowerCase();
    // Remplazar vocales acentuadas
    _.each(findThis, function(f, i) {
      result = result.replace(new RegExp(f, 'g'), replaceWithThis[i]);
    });
    // Quitar caracteres especiales y remplaza espacios por guión medio
    return result.replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };
  /**
   * @name newError
   * @description Genera un mensaje de error para ser devuelto en una petición HTTP.
   * @param {number} status Código de error de HTTP.
   * @param {string} message Mensaje de error devuelto por el servidor.
   * @param {string} extras Mensaje adicional sobre el error.
   */
  app.newError = function(status, message, extras) {
    let error = new Error(message);
    error.status = status;
    error.details = extras;
    return error;
  };
};
