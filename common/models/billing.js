'use strict';

module.exports = function(Billing) {
  // TODO: implementar código del modelo

  /**
   * @name getClients
   * @description Recupera los datos de los usuarios client.
   * @param {function} done Función de callback.
   */
    Billing.getClients = function(done) {
      let filter = { where: {class: 'client'}};
      Billing.find(filter, (err, users) => {
        if (err) return done(err);
        console.log("Lista de clientes", users);
        done(null, users);
      });
    };// End getClients

};
