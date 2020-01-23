'use strict';
// Modulos NodeJs adicionales
let _ = require('underscore');
let async = require('async');

module.exports = function(AppUser) {
  /**
   * @name afterCreate
   * @description Función posterior actualización de un SysUser.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterLogin(ctx, instance, done) {
    console.log('AppUser call afterLogin');
    let newError = AppUser.app.newError;
    let AccessToken = AppUser.app.models.AccessToken;
    let iUser = instance.toObject().user;
    if (!(iUser.accountStatus === 'active' && iUser.type === 'seller')) {
      // ...si no esta activo y no es vendedor
      AccessToken.deleteById(instance.id, err => {
        if (err) return done(err);
        return done(newError(401, 'Acceso negado. Credenciales inválidas.'));
      });
    } else {
      if (iUser.deviceId === null) {
        // ...no hay un dispositivo registrado
        let updUser = {deviceId: ctx.args.credentials.deviceId};
        return AppUser.findById(iUser.id, (err, user) => {
          // ...registrar dispositivo
          if (err) return done(err);
          return user.updateAttributes(updUser, done);
        });
      } else if (iUser.deviceId !== ctx.args.credentials.deviceId) {
        // ...no coincide su deviceId con el proporcionado
        AccessToken.deleteById(instance.id, err => {
          if (err) return done(err);
          return done(newError(401, 'Acceso negado. Credenciales inválidas.'));
        });
      } else {
        done();
      }
    }
  }// End afterLogin
  /**
   * @name beforeLogin
   * @description Función para prevenir el incio de sesión.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeLogin(ctx, instance, done) {
    console.log('AppUser call beforeLogin');
    let newError = AppUser.app.newError;
    ctx.args.include = ['user'];
    if (!ctx.args.credentials.deviceId) {
      return done(newError(401, 'Acceso denegado'));
    }
    done();
  }// End beforeLogin
  /**
   * @name validateDevice
   * @description Middleware para validar que se envía el deviceId.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function validateDevice(ctx, instance, done) {
    console.log('AppUser call validateDevice');
    let newError = AppUser.app.newError;
    if (!ctx.req.query.deviceId) {
      // ...no incluye deviceId la petición
      return done(newError(401, 'Acceso denegado, solicitud incompleta'));
    }
    let idUser = ctx.req.accessToken.userId;
    AppUser.findById(idUser, (err, iUser) => {
      if (err) return done(err);
      if (!iUser || iUser.deviceId !== ctx.req.query.deviceId) {
        // ...no se encontro el Id o no coincide el deviceId
        return done(newError(401, 'Solicitud cancelada'));
      }
      done();
    });
  }// End validateDevice
  // Middlewares
  // Before
  AppUser.beforeRemote('login', beforeLogin);
  AppUser.beforeRemote('findById', validateDevice);
  //AppUser.beforeRemote('getAssignedClients', validateDevice); //deshabilitado por Josué
  // After
  AppUser.afterRemote('login', afterLogin);
  // Metodos remotos
  /**
   * @name getAssignedClients
   * @description Devuelve las lista de clientes que tiene asignado el vendedor.
   * @param {string} id Identificador del usuario.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {fucntion} done Función de callback.
   */
  AppUser.getAssignedClients = function(id, ctx, done) {
    console.log('AppUser call getAssignedClients');
    let SellerHasClient = AppUser.app.models.SellerHasClient;
    let filter = {
      include: {
        relation: 'client', scope: {
          fields: ['id', 'name', 'maxCredit', 'debt'],
          order: ['name']}},
      where: {idSeller: id}};
    SellerHasClient.find(filter, (err, iSHC) => {
      if (err) return done(err);
      let response = [];
      _.each(iSHC, row => {
        response.push(row.client());
      });
      done(null, response);
    });
  };// End getAssignedClients
  /**
   * @name getGuaranties
   * @description Recupera la lista de garantias para devolución del vendedor.
   * @param {string} id Identificador del usuario.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {fucntion} done Función de callback.
   */
  AppUser.getGuaranties = function(id, ctx, done) {
    console.log('AppUser call getGuaranties');
    let filter = {
      include: {
        relation: 'guaranties', scope: {
          include: [
            {relation: 'client', scope: {
              fields: ['id', 'name']}},
            {relation: 'stock', scope: {
              fields: [
                'id', 'idProduct', 'IMEI', 'salesPrice', 'isRefurb', 'class'],
              include: {
                relation: 'product', scope: {
                  fields: ['id', 'name']}}}}],
          where: {status: 're-assignment'}}}};
    AppUser.findById(id, filter, (err, iUser) => {
      if (err) return done(err);
      let response = [];
      if (iUser.guaranties.length) {
        // ...debe entregar garantías
        _.each(iUser.guaranties(), guarantee => {
          if (guarantee.idWarehouse === iUser.idWarehouse) {
            response.push(guarantee);
          }
        });
      }
      done(null, response);
    });
  };// End getGuaranties
  /**
   * @name getGuaranties
   * @description Recupera la lista de garantias para devolución del vendedor.
   * @param {string} id Identificador del usuario.
   * @param {object} client Objeto del cliente.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {fucntion} done Función de callback.
   */
  AppUser.setGuaranteeRefund = function(id, client, ctx, done) {
    console.log('AppUser call setGuaranteeRefund', client);
    let newError = AppUser.app.newError;
    let Guarantee = AppUser.app.models.Guarantee;
    let GuaranteeLog = AppUser.app.models.GuaranteeLog;
    let result = [];
    let wf = [];
    let cc = AppUser.app.commonCallback;
    if (!client.id) {
      // ...no se incluye el ID del cliente
      return done(newError(404, 'Solicitud incompleta, sin client ID'));
    }
    if (!client.guaranties || client.guaranties.length < 1) {
      // ...no se incluyen garantías
      return done(newError(404, 'Solicitud incompleta, sin garantías'));
    }
    _.each(client.guaranties, guarantee => {
      let filter = {
        include: [
          'client',
          {relation: 'stock', scope: {
            include: 'product'}}],
        where: {
          and: [
            {id: guarantee},
            {idClient: client.id}]}};
      wf.push(next => {
        return Guarantee.findOne(filter, (err, iGuarantee) => {
          if (err) return next(err);
          //
          if (!iGuarantee) {
            return next(newError(404,
              `La garantía ${guarantee} no le pertenece a este cliente`));
          } else {
            if (iGuarantee.status === 'refund') {
              return next(newError(404,
                `La garantía ${guarantee} ya fue devuelta.`));
            } else if (iGuarantee.status !== 're-assignment') {
              return next(newError(404,
                `La garantía ${guarantee} no está asignada para devolución`));
            } else {
              // ...marcar garantía como devuelta
              let updGuarantee = {
                status: 'refund',
                updated: Date.now()};
              return iGuarantee.updateAttributes(updGuarantee,
                (err, guarantee) => {
                  if (err) return next(err);
                  result.unshift(guarantee.toObject());
                  let newLog = {
                    idGuarantee: iGuarantee.id,
                    event: 'refund',
                    description: 'Garantía devuelta al cliente.'};
                  return GuaranteeLog.create(newLog, cc(next));
                  // next();
                });
            }
          }
        });
      });
    });
    async.waterfall(wf, err => {
      if (err) return done(err);
      // guarantiesMail(result, done);1
      done(null, result);
    });
  };// End setGuaranteeRefund
  /**
   * @name guarantiesMail
   * @description Función para enviar un correo electrónico con las garantías
   * devueltas.
   * @param {array} guaranties Arreglo de objetos de garantías.
   * @param {function} done Función de callback.
   * @deprecated
   */
  function guarantiesMail(guaranties, done) {
    console.log('AppUser call guarantiesMail');
    let data = {};
    data.url = AppUser.app.get('url');
    data.title = 'Devolución de garantías';
    data.name = guaranties[0].client.name;
    data.email = guaranties[0].client.email;
    data.table = '<table><tr><th>Número</th><th>Orden</th><th>Producto</th><t' +
      'h>IMEI</th></tr>';
    _.each(guaranties, (guarantee, index) => {
      data.table += `<tr><td>${index + 1}</td><td>${guarantee.guideNumber}</t` +
      `d><td>${guarantee.stock.product.name}</td><td>${guarantee.stock.IMEI}` +
      '</td></tr>';
    });
    data.table += '</table>';
    let body = AppUser.app.loadEmailBody('refund-guaranties', data);
    data.body = body;
    let mail = AppUser.app.loadEmailBody('generic', data);
    let Email = AppUser.app.models.Email;
    // Datos del correo
    let mailData = {
      to: data.email,
      from: 'contacto@multiplicame.com',
      subject: data.title,
      text: mail.replace(/<.*?>/g, ''),
      html: mail};
    // Mandar correo electrónico
    Email.send(mailData, function(err, mail) {
      if (err) return done(err);
      done(null, guaranties);
    });
  }// End guarantiesMail
  /**
   * @name searchStock
   * @description Devuelve los datos de un equipo para su garantía.
   * @param {string} id Identificador del usuario.
   * @param {string} idClient Identificador del cliente.
   * @param {string} imei Número de serie/imei del producto.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {fucntion} done Función de callback.
   */
  AppUser.searchStock = function(id, idClient, imei, ctx, done) {
    console.log('AppUser call searchStock');
    let newError = AppUser.app.newError;
    let Stock = AppUser.app.models.Stock;
    let filter = {
      fields: ['id', 'idProduct', 'idClient', 'IMEI', 'saleDate', 'publicPrice', 'salesPrice'],
      include: [
        {relation: 'product', scope: {
          fields: ['name']}},
        {relation: 'guaranties', scope: {
          fields: ['id', 'idStock', 'guideNumber', 'status'],
          where: {
            and: [
              {status: {neq: 'refund'}},
              {status: {neq: 'canceled'}}]}}}],
      where: {
        and: [
          {status: 'sold'},
          {confirmSale: true},
          {IMEI: imei}]}};
    // Buscar imei
    Stock.findOne(filter, (err, iStock) => {
      if (err) return done(newError(404,
        'El equipo no está registrado en Smart-U.'));
      if (!iStock) {
        // ...la consulta sin resultados
        return done(newError(404,
          'No se encontró el producto buscado.'));
      } else if (iStock.idClient !== idClient) {
        // ...no fue vendido al cliente
        return done(newError(400,
          'El equipo no fue vendido a este cliente.'));
      } else if (iStock.guaranties().length > 0) {
        // ...tiene garantías pendietes
        return done(newError(400,
          'El equipo cuenta con un ticket de garantía previo.'));
      } else {
        done(null, iStock);
      }
    });// End Stock.findOne
  };// End searchStock
  /**
   * @name setGuaranties
   * @description Registra una o varias garantías de un cliente.
   * @param {string} id Identificador del usuario.
   * @param {object} client Objeto con los datos de las garantías.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {fucntion} done Función de callback.
   */
  AppUser.addGuaranties = function(id, client, ctx, done) {
    console.log('AppUser call addGuaranties');
    let wf = [];
    let wf2 = [];
    let result = [];
    let cc = AppUser.app.commonCallback;
    let newError = AppUser.app.newError;
    let Stock = AppUser.app.models.Stock;
    let Guarantee = AppUser.app.models.Guarantee;
    let GuaranteeLog = AppUser.app.models.GuaranteeLog;
    /**
     * @name processGuarantee
     * @description Procesa los datos y registra la garantía.
     * @param {object} user Objeto con los datos del vendedor.
     * @param {string} idClient Identificador del cliente.
     * @param {object} stock Objeto con los datos del stock.
     * @param {function} cb Función de callback.
     */
    function processGuarantee(seller, idClient, stock, cb) {
      wf2.push(next => {
        // Plantilla para el registro de garantías
        let template = {
          idStock: stock.id,
          idSeller: seller.id,
          idWarehouse: seller.idWarehouse,
          idClient: idClient,
          status: 'open'};
        // Generar el ticket de la garantía
        Guarantee.makeGuideNumber((err, ticket) => {
          if (err) return next(err);
          let newGuarantee = _.extend({guideNumber: ticket}, template);
          // Registrar la garantía
          Guarantee.create(newGuarantee, (err, iGuarantee) => {
            if (err) return next(err);
            let guarantee = iGuarantee.toObject();
            guarantee.stock = _.extend({}, stock);
            result.push(guarantee);
            let newLog = {
              idGuarantee: iGuarantee.id,
              event: 'create',
              description: 'Registro de garantía.'};
            // Registrar el log de la garantía
            GuaranteeLog.create(newLog, cc(next));
          });
        });
      });
      cb();
    }// End processGuarantee
    if (!client.id) {
      // ...no se incluye el ID del cliente
      return done(newError(404, 'Solicitud incompleta, sin client ID'));
    }
    if (!client.guaranties || client.guaranties.length < 1) {
      // ...no se incluyen garantías
      return done(newError(404, 'Solicitud incompleta, sin garantías'));
    }
    AppUser.findById(id, (err, iUser) => {
      if (err) return done(err);
      let seller = iUser.toObject();
      // Validar los id de las garantías
      _.each(client.guaranties, guarantee => {
        let stockFilter = {
          fields: ['id', 'idProduct', 'IMEI', 'salesPrice'],
          include: [
            {relation: 'product', scope: {
              fields: ['id', 'name']}},
            {relation: 'guaranties', scope: {
              where: {
                and: [
                  {status: {neq: 'refund'}},
                  {status: {neq: 'canceled'}}]}}}]};
        wf.push(next => {
          // Valida que todos los productos no esten en garantía
          Stock.findById(guarantee.id, stockFilter, (err, iStock) => {
            if (err) return next(err);
            if (!iStock) {
              // ...no se encontró el id del stock
              return next(newError(404,
                `El IMEI '${guarantee.IMEI}' no fue encontrado en el stock.`));
                // 'El ID del equipo no fue encontrado en el sotck.'));
            }
            if (iStock.guaranties().length > 0) {
              // ...revisar garantías para evitar registrar un ticket nuevo.
              return next(newError(400,
                `El IMEI '${iStock.IMEI}' ya tiene un ticket de garantías.`));
            } else {
              processGuarantee(seller, client.id, iStock.toObject(), next);
            }
          });
        });// End wf.push
      });// End _.each
      async.waterfall(wf, err => {
        if (err) return done(err);
        async.waterfall(wf2, err => {
          if (err) return done(err);
          done(null, result);
        });
      });
    });// End AppUser.find
  };// End setGuaranties
  /**
   * @name getStockForRefund
   * @description Recupera los equipos que deben ser bonificados para un
   * cliente.
   * @param {string} id Identificador del usuario.
   * @param {string} idClient Identificador del cliente.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {function} done Fución de callback.
********************************************************************************
   */
  AppUser.getStockForRefund = function(id, idClient, ctx, done) {
    console.log('AppUser call getStockForRefund');
    let Stock = AppUser.app.models.Stock;
    let newError = AppUser.app.newError;
    let filter = {
      include: ['product', 'client'],
      where: {
        and: [
          {idUSer: id},
          {idClient: idClient},
          {forRefund: true},
          {refundValidate: true},
          {refunded: false}]}};
    Stock.find(filter, (err, stocks) => {
      if (err) return done(err);
      if (!stocks || stocks.length < 1) {
        // ...no hay equipos para abonar
        return done(newError(404,
          'El cliente no tiene equipos para bonificación.'));
      }
      let response = [];
      _.each(stocks, stock => {
        let find = _.find(response, r => {
          return r.idProdct === stock.idProdct;
        });
        if (find) {
          find.total += stock.refundPrice;
          find.totalItems++;
          find.stocks.push({id: stock.id});
        } else {
          let tmp = {
            idProdct: stock.idProdct,
            name: stock.product().name,
            refundPrice: stock.refundPrice,
            total: stock.refundPrice,
            totalItems: 1,
            stocks: [{id: stock.id}]};
          response.push(tmp);
        }
      });
      done(null, response);
    });// End Stock.find
  };// End getStockForRefund
/******************************************************************************/
  /**
   * @name swapStock
   * @description Realiza el intercambio entre uno o varios equipos vendidos
   * previamente por los que se encuentran en la hoja de cambaceo del vendedor.
   * @param {string} id Identificador del usuario.
   * @param {object} data Objeto del cliente.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {function} done Función de callback.
   */
  AppUser.sawpStock = function(id, data, ctx, done) {
    console.log('AppUser call swapStock');
    let wf = [];
    let wf2 = [];
    let refund = 0;
    let payment = 0;
    let cc = AppUser.app.commonCallback;
    let newError = AppUser.app.newError;
    let Stock = AppUser.app.models.Stock;
    let StockLog = AppUser.app.models.StockLog;
    let Billing = AppUser.app.models.Billing;
    /**
     * @name setStockAvailable
     * @description Habilita en la hoja de cambaceo un stock.
     * @param {object} stockA Instancia del objeto que será devuelto.
     * @param {function} cb Función de callback.
     */
    function setStockAvailable(stockA, cb) {
      let available = {
        status: 'assigned',
        confirmSale: false,
        validate: false,
        saleDate: null,
        salesPrice: null,
        idClient: null};
      wf2.push(next => {
        stockA.updateAttributes(available, (err, instance) => {
          if (err) return next(err);
          let newLog = {
            idStock: instance.id,
            event: 're-assigned',
            description: 'Ingresa por cambio físico del cliente ' +
              stockA.client().name};
          StockLog.create(newLog, cc(next));
        });
      });
      cb();
    }// End setStockAvailable
    /**
     * @name setStockSold
     * @description Marca en la hoja de cambaceo el stock como vendido.
     * @param {object} stockB Instancia del objeto que será entregado.
     * @param {function} cb Función de callback.
     */
    function setStockSold(stockB, client, cb) {
      let soldStock = {
        status: 'sold',
        confirmSale: true,
        validate: true,
        saleDate: Date.now(),
        salesPrice: stockB.publicPrice,
        idClient: client.id};
      wf2.push(next => {
        stockB.updateAttributes(soldStock, (err, instance) => {
          if (err) return next(err);
          let newLog = {
            idStock: instance.id,
            event: 'sold',
            description: 'Cambio de producto al cliente ' + client.name};
          StockLog.create(newLog, cc(next));
        });
      });
      cb();
    }// End setStockSold
    if (!data.idClient) {
      // ...no se incluye el ID del cliente
      return done(newError(400, 'Solicitud incompleta, sin client ID.'));
    }
    if (!data.stockIn || data.stockIn.length < 1) {
      // ...no se incluyen los IMEIs de cambio
      return done(newError(400,
        'Solicitud incompleta, sin productos devueltos.'));
    }
    if (!data.stockOut || data.stockOut.length < 1) {
      // ...no se incluye datos del producto
      return done(newError(400,
        'Solicitud incompleta, sin productos para cambio.'));
    }
    // Validar el ID del cliente
    Billing.findById(data.idClient, (err, iBilling) => {
      if (err) return done(err);
      if (!iBilling) {
        // ...no se encontró el cliente
        return done(newError(404, 'ID del cliente invalido.'));
      }
      let filter = {include: ['client', 'product']};
      // Recorrer la lista de IMEIs
      _.each(data.stockIn, stock => {
        wf.push(next => {
          // Búscar el producto a recibir a cambio
          Stock.findById(stock.id, filter, (err, stockA) => {
            if (err) return next(err);
            if (!stockA) {
              // ...no se encontró el IMEI
              return next(newError(404,
                `No se encontró el ID ${stock.id} solicitado.`));
            } else if (stockA.idClient !== data.idClient) {
              // ...el producto lo fue vendido a ese cliente
              return next(newError(400,
                `El producto ${stockA.product().name} no pertenece a este cliente.`));
            } else {
              // ...procede al siguiente proceso
              refund += stockA.salesPrice;
              setStockAvailable(stockA, next);
            }
          });// End Stock.findOne
        });// End wf.push
      });// End _.each
      // Recorrer la lista de stock
      _.each(data.stockOut, stock => {
        wf.push(next => {
          // Búscar el producto que se dara a cambio
          Stock.findById(stock.id, filter, (err, stockB) => {
            if (err) return next(err);
            if (!stockB) {
              // ...no se encontró el stock
              return next(newError(404,
                `No se encontró el ID ${stock.id} solicitado.`));
            } else if (stockB.status !== 'assigned' &&
            stockB.validate !== false) {
              // ...el stock no está disponible
              return next(newError(404,
                `El producto ${stockB.product().name} no está disponible para cambio.`));
            } else {
              // ...procede al siguiente proceso
              payment += stockB.publicPrice;
              setStockSold(stockB, iBilling, next);
            }
          });// End Stock.findById
        });// End wf.push
      });// End _.each
      async.waterfall(wf, err => {
        if (err) return done(err);
        async.waterfall(wf2, err => {
          if (err) return done(err);
          let newDebt = iBilling.debt - refund + payment;
          iBilling.updateAttributes({debt: newDebt}, done);
        });
      });// End Billing.findById
    });
  };
};
/******************************************************************************/
