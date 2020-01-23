'use strict';

module.exports = function(SellerHasClient) {
  /**
   * @description Devuelve las lista de clientes que tiene asignado un vendedor en especifico.
   * @param {string} sellerId Id del vendedor
   * @param {function} done Función de callback.
   * @returns {object} Objeto con los datos del cliente.
   */
  SellerHasClient.prototype.getAssignedClients = function(done) {
    let Billing = SellerHasClient.app.models.Billing;
    let cc = SellerHasClient.app.commonCallback;

    console.log('SellerHasClient calls getAssignedClients', idSeller);
    let self = this;

    // Filtro de búsqueda
    var filter = {
      where: { idSeller:this.id },
      include: [{ relation: "client", scope: { fields: [ "id", "name", "debt" ] } }]
    };

  SysUser.find(this.id, filter, (err, iUser) => {
      if (err) return done(err);

      if (!iClient) {
        return done(SellerHasClient.app.newError(403, 'Vendedor no encontrado.'));
      }else {
        // Objeto de respuesta
        let response = []

        _.each(iClient, function(client) {
          response.push({
            id: client.client.id,
            name: client.client.name,
            debts: client.client.debt
          })
        });
        done(null, response);
      }
    });


    Billing.getClients = function(done) {
      let filter = { where: {class: 'client'}};
      Billing.find(filter, (err, users) => {
        if (err) return done(err);
        console.log("Lista de clientes", users);
        done(null, users);
      });
    };// End getClients


  };// End prototype.getAssignedClients


};
