/**
* @author MadMedia
* @description Servicio para obtener la hoja de cambaceo.
* @module  MadMediaOnlineStore Nombre del módulo
* @enum   {(type | Array)} Lista de dependencias y servicios
*/

angular.module("systemax")
  .factory("CambaceoService", [ '$rootScope', 'SysUser', function($rootScope, SysUser) {

    /**
     * @function getCambaceo
     * @description Función para obtener la hoja de cambaceo del ejecutivo.
     * @param {string} idSeller ID del ejecutivo
     */
    function getCambaceo (idSeller) {
      //..Query para obtener la hoja de cambaceo del vendedor
      let sellerFilter = {
        include: {
          relation: 'warehouseACL',
          scope: {
          include: {
            relation: 'warehouse',
            scope: {
              include: {
                relation: 'stocks',
                scope: {
                  where: {and: [{ or: [ {status: 'assigned'},{status: 'guarantee'}]}, { validate: false}]},
                  include: [{ relation: 'logs', scope: { where: { event: 'assigned'}}},
                  {relation: 'product', scope: {
                    include: {
                      relation: 'model', scope: {
                        include: 'brand'}}}}],
                  order: 'idProduct'}}}},
                                  limit: 1,
                                  order: 'index'}}};

        return SysUser.findById({id: idSeller, filter: sellerFilter})
          .$promise
          .then(
            function(seller) {
              //console.log("Hoja de cambaceo desde --->cambaceo-service.js", seller);
              return(seller)
            },
            function(err) {
              console.log(err);
            });

    }


    /**
     * @function getStockSold
     * @description Función para obtener las ventas realizadas
     * @param {string} idSeller ID del ejecutivo
     */

     function getStockSold (idSeller) {
       let sellerFilter = {
         include: {
           relation: 'warehouseACL',
           scope: {
           include: {
             relation: 'warehouse',
             scope: {
               include: {
                 relation: 'stocks',
                 scope: {
                   where: {and: [{ or: [ {status: 'sold'}]}, { validate: true}, {idClient: null}]},
                   include: [{ relation: 'logs', scope: { where: { event: 'sold'}}},
                   {relation: 'product', scope: {
                     include: {
                       relation: 'model', scope: {
                         include: 'brand'}}}}],
                   order: 'idProduct'}}}},
                                   limit: 1,
                                   order: 'index'}}};

        return SysUser.findById({id: idSeller, filter: sellerFilter})
          .$promise
          .then(
            function(stock) {
              //console.log("Respuesta de las ventas del ejecutivo", stock);
              let dateToday = moment().format('L');
              let stocks = stock.warehouseACL[0].warehouse.stocks;
              let soldToday = []

              _.each(stocks, function(stock, index) {
                var format = moment(stock.saleDate).format('L');
                if (format === dateToday) {
                  let newItemStock = {
                    imei: stock.IMEI,
                    saleDate: stock.saleDate,
                    status: stock.status
                  }
                  soldToday.push(newItemStock);
                }
              })
              return(soldToday)
            },
            function(err) {
              console.log(err);
            });
     }



    return {
      getCambaceo : getCambaceo,
      getStockSold: getStockSold
    }

  }]);
