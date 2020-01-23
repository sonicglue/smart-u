'use strict';
// Modulos NodeJs adicionales
let _ = require('underscore');
let async = require('async');
let moment = require('moment');
moment.locale();

module.exports = function(Payment) {
  /**
   * @name afterUpdate
   * @description Función posterior a la actualización de un Payment.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterUpdate(ctx, instance, done) {
    console.log('Payment call afterUpdate');
    if (ctx.args.updateDebt) {
      let Billing = Payment.app.models.Billing;
      let cc = Payment.app.commonCallback;
      let wf = [];
      let filter = {
        where: {
          and: [
            {idClient: instance.idClient},
            {date: {gte: instance.date}}]},
        order: ['date', 'idOrder', 'index']};
      Payment.find(filter, (err, payments) => {
        if (err) return done(err);
        let previousDebt = [];
        let currentDebt = [];
        let billingDebt = 0;
        _.each(payments, (payment, idx) => {
          if (previousDebt[0] === undefined) {
            // ...obtener ultima deuda del periodo
            previousDebt[0] = payment.previousDebt;
          } else {
            // ...obtener ultima deuda de la operacion anterior
            previousDebt[idx] = currentDebt[idx - 1];
          }
          currentDebt[idx] = previousDebt[idx];
          if (payment.status !== 'canceled' && payment.type !== 'credit') {
            // ...pago completado o pendiente quitar abono
            currentDebt[idx] -= payment.amount;
          } else if (payment.type === 'credit') {
            // ...sumar la deuda del crédito
            currentDebt[idx] += payment.amount;
          }
          wf.push(next => {
            let updDebt = {
              currentDebt: currentDebt[idx],
              previousDebt: previousDebt[idx]};
            payment.updateAttributes(updDebt, cc(next));
          });
          billingDebt = currentDebt[idx];
        });
        async.waterfall(wf, err => {
          if (err) return done(err);
          Billing.findById(instance.idClient, (err, iBilling) => {
            if (err) return done(err);
            iBilling.updateAttributes({debt: billingDebt}, done);
          });
        });
      });
    } else {
      done();
    }
  }// End afterUpdate
  /**
   * @name beforeUpdate
   * @description Función anterior a la actualización de un Payment.
   * @param {object} ctx Objeto de solicitud (context).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeUpdate(ctx, instance, done) {
    console.log('Payment call beforeUpdate');
    if (ctx.args.data.status && ctx.args.data.status === 'canceled') {
      ctx.args.updateDebt = true;
    }
    done();
  }// End beforeUpdate
  // Middlewares
  // Before
  Payment.beforeRemote('prototype.patchAttributes', beforeUpdate);
  // After
  Payment.afterRemote('prototype.patchAttributes', afterUpdate);
  // Métodos remotos

  Payment.cancelAll = done => {
    let wf = [];
    let wf2 = [];
    let cc = Payment.app.commonCallback;
    let filter = {
      where: {status: 'pending'},
      order: ['date']};
    let clients = [];
    let result = {count: 0};
    let newError = Payment.app.newError;
    /**
     * @name processPayments
     * @description Cancela los abonos de una nota de venta y actualiza el saldo
     * del cliente.
     * @param {object} payments Objeto con los abonos para actualización.
     * @param {function} cb Función de callback.
     */
    function processPayments(payments, cb) {
      let currentDebt = 0;
      _.each(payments, (payment, idx) => {
        wf2.push(next => {
          if (idx === 0) {
            // ...recuperar la deuda
            currentDebt = payment.previousDebt;
          }
          let updPaymet = {
            previousDebt: currentDebt};
          if (payment.type === 'credit') {
            // ...es un credito
            currentDebt += payment.amount;
            updPaymet.currentDebt = currentDebt;
          } else if (payment.status === 'pending') {
            // ...si está pendiente cancelarlo
            updPaymet.currentDebt = currentDebt;
            updPaymet.status = 'canceled';
          } else {
            // ...pagos en efectivo o bonificación
            currentDebt -= payment.amount;
            updPaymet.currentDebt = currentDebt;
          }
          payment.updateAttributes(updPaymet, (err, iPayment) => {
            if (err) return next(err);
            result.count++;
            payment.client().updateAttributes({debt: currentDebt}, cc(next));
          });
        });
      });
      cb();
    }// End processPayments
    Payment.find(filter, (err, payments) => {
      if (err) return done(err);
      // console.log('encontre estos abonos:', payments);
      // Recuperar notas de venta
      _.each(payments, payment => {
        let find = _.find(clients, client => {
          return client.idClient === payment.idClient;
        });// End _.find
        if (!find) {
          // ...no está en arreglo
          clients.push(payment);
        }
      });// End _.each
      // Recorrer las notas
      _.each(clients, client => {
        wf.push(next => {
          let filter = {
            include: 'client',
            where: {
              and: [
                {idClient: client.idClient},
                {date: {gte: client.date}}]},
            order: ['date', 'idOrder', 'type']};
          Payment.find(filter, (err, payments) => {
            if (err) return next(err);
            if (!payments) {
              // ...no se encontraron pagos de esa orden
              return next(newError(404,
                'No se encontraron abonos pendientes.'));
            } else {
              processPayments(payments, next);
            }
          });
        });
      });
      async.waterfall(wf, err => {
        if (err) return done(err);
        async.waterfall(wf2, err => {
          if (err) return done(err);
          done(null, result);
        });
      });
    });// End Payment.find
  };// End Payment.cancelAll

  Payment.getDebt = (data,  cb) => {
    // console.log('Datos recibidos de los vendedores', data);
    let cc = Payment.app.commonCallback;

    let debtClient = []; // Array para almacenar la lista de clientes con sus deudas
    let wf = [];

    // Recorrer el array de la lista de vendedores
    _.each(data, function(itemSeller, index) {
      // Query para la consulta
      let filter = {
        where: {idSeller: itemSeller, order: ['created DESC']},
        include: [{relation: 'client', scope: {fields: ['id', 'name', 'phoneNumber']}}, {relation: 'seller', scope: {fields: ['name', 'lastName']}}]};
      wf.push(next => {
        Payment.find(filter, (err, iSeller) => {
          // if (err) return next(Payment.app.newError(422, 'Identificador del vendedor inválido.'));
          // console.log('Respuesta de la consulta', iSeller);

          if (iSeller.length) {
            let response = iSeller[0];

            var json1 = JSON.stringify(iSeller[0]);
            var json = JSON.parse(json1);

            let mewItemSeller = {
              date: response.date,
              seller: json['seller'].name  + ' ' + json['seller'].lastName,
              idClient: response.idClient,
              client: json['client'].name,
              phone: json['client'].phoneNumber,
              idClient: json['client'].id,
              previousDebt: response.previousDebt,
              abono: response.payment,
              totalParcial: response.previousDebt -  response.payment,
              credit: response.credit,
              bonificacion: response.discount,
              total: response.currentDebt,
            };
            debtClient.push(mewItemSeller);
            next();
          } else {
            next();
          }
        });// End Payment.find
      });// End wf.push
    });// End each
    async.waterfall(wf, err => {
      if (err) return cb(err);
      cb(null, debtClient);
    });
  };// End getDebts



  /**
   * @name getSold
   * @description Función para obtener las ventas del día.
   * @param {object} data Objeto de array con los ejecutivos.
   * @param {function} cb Función de callback.
   */
  Payment.getSold = (data,  cb) => {
    // console.log('Datos recibidos de los vendedores', data);
    let cc = Payment.app.commonCallback;
    let debtClient = []; // Array para almacenar la lista de clientes con sus deudas
    let wf = [];
    let wf2 = [];

    /**
     * @name processOrder
     * @description Actualiza los datos del stock señalandolos como vendidos.
     * @param {object} payment Arreglo con todos los pagos.
     * @param {function} cb Función de callback.
     */
    function processOrder(payment, cb) {
      //console.log("processOrder", JSON.stringify(payment));
      _.each(payment, py => {
        let response = py;
        var json1 = JSON.stringify(py);
        var json = JSON.parse(json1);
        wf2.push(next => {
          debtClient.push(py);
          next();
        });// End wf2.push
      });
      cb();
    }// End processOrder

    // Recorrer el array de la lista de vendedores
    _.each(data.sellers, function(idSeller) {
      //console.log("ID SELLER", idSeller);
      // Query para la consulta
        var paymentFilter = {
          where: {
            and: [{idSeller: idSeller},
                  {date: {gte: data.date + ' 00:00:00'}},
                  {date: {lte: data.date + ' 23:59:59'}}]},
                  include: [{relation: 'client',
                  scope: {fields: ['id', 'name', 'lastName', 'email', 'debt', 'reference']}},
                  {relation: 'seller',
                  scope: {fields: ['name', 'lastName']}},
                  {relation: 'order', scope: {
                    include: {relation: 'orderhasproduct', scope: {
                    include: {relation: 'product', scope:{
                     include:['color', {relation: 'model', scope: {include: 'brand'}}]
                   }}
                 }
                 }
               }}]
             }

      wf.push(next => {
        Payment.find(paymentFilter, (err, iSeller) => {
          // if (err) return next(Payment.app.newError(422, 'Identificador del vendedor inválido.'));
           if (iSeller.length) {
             processOrder(iSeller, next);
           } else {
             next();
           }
        });// End Payment.find
      });// End wf.push
    });// End each

    async.waterfall(wf, err => {
      if (err) {
        return cb(err);
      }
      async.waterfall(wf2, err => {
        if (err) return cb(err);
        cb(null, debtClient);
      });
    });
  };// End getSold



  /**
   * @name getSalesHistory
   * @description Función para obtener todas las ventas.
   * @param {object} data Objeto de array con los ejecutivos.
   * @param {function} cb Función de callback.
   */
  Payment.getSalesHistory = (data,  cb) => {
    // console.log('Datos recibidos de los vendedores', data);
    let cc = Payment.app.commonCallback;
    let debtClient = []; // Array para almacenar la lista de clientes con sus deudas
    let wf = [];
    let wf2 = [];

    /**
     * @name processOrder
     * @description Actualiza los datos del stock señalandolos como vendidos.
     * @param {object} payment Arreglo con todos los pagos.
     * @param {function} cb Función de callback.
     */
    function processOrder(payment, cb) {
      //console.log("processOrder", JSON.stringify(payment));
      _.each(payment, py => {
        let response = py;
        var json1 = JSON.stringify(py);
        var json = JSON.parse(json1);
        wf2.push(next => {
          let newOrder = {
            id: py.id,
            index: py.index,
            idSeller: py.idSeller,
            idClient: py.idClient,
            idOrder: py.idOrder,
            date: py.date,
            type: py.type,
            amount: py.amount,
            previousDebt: py.previousDebt,
            currentDebt: py.currentDebt,
            transactionId: py.transactionId,
            status: py.status,
            orderNumber: json['order'].orderNumber,
            seller: {
              id: json['seller'].id,
              name: json['seller'].name  + ' ' + json['seller'].lastName,
            },
            client: {
              id: json['client'].id,
              name: json['client'].name,
              debt: json['client'].debt
            },
            order: {
              id: json['order'].id,
              orderNumber: json['order'].orderNumber,
              type: json['order'].type,
              created: json['order'].created,
              totalItems: json['order'].totalItems,
              subtotal: json['order'].subtotal,
              discount: json['order'].discount,
              total: json['order'].total,
              credit: json['order'].credit,
              cash: json['order'].cash,
              status: json['order'].status,
            },
            products: json['order'].products
          };
          debtClient.push(newOrder);
          next();
        });// End wf2.push
      });
      cb();
    }// End processOrder

    // Recorrer el array de la lista de vendedores
    _.each(data.sellers, function(idSeller) {
      // Query para la consulta
        var paymentFilter = {
          where: {
            and: [
              {idSeller: idSeller}]},
              include: [{relation: 'client',
               scope: {fields: ['id', 'name', 'lastName', 'email', 'debt', 'reference']}},
              {relation: 'seller',
               scope: {fields: ['name', 'lastName']}},
               {relation: 'order', scope: {
                 include: {relation: 'products', scope: {
                   include: ['color',
                     {relation: 'model', scope: {
                       include: 'brand'}}]}}
               }}
             ]
        }

      wf.push(next => {
        Payment.find(paymentFilter, (err, iSeller) => {
          // if (err) return next(Payment.app.newError(422, 'Identificador del vendedor inválido.'));
           //console.log('Respuesta de la consulta', iSeller);
           if (iSeller.length) {
             processOrder(iSeller, next);
           } else {
             next();
           }
        });// End Payment.find
      });// End wf.push
    });// End each

    async.waterfall(wf, err => {
      if (err) {
        return cb(err);
      }
      async.waterfall(wf2, err => {
        if (err) return cb(err);
        cb(null, debtClient);
      });
    });
  };// End getSalesHistory

};
