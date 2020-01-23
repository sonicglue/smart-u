'use strict';
// Modulos de NodeJs
let _ = require('underscore');
let async = require('async');
let moment = require('moment');

module.exports = function(Order) {
  // Funciones generales
  /**
   * @name afterCreate
   * @description Función para el middelware despues de registrar una orden de
   * compra.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterCreate(ctx, instance, done) {
    console.log('Order call afterCreate');
    let wf = [];
    let wf2 = [];
    let cc = Order.app.commonCallback;
    let newError = Order.app.newError;
    let OrderHasProduct = Order.app.models.OrderHasProduct;
    let updOrder = {
      totalItems: 0,
      subtotal: 0,
      discount: 0,
      total: 0,
      credit: 0,
      cash: 0,
      status: 'full'};
    /**
     * @name processStocks
     * @description Recorre los stocks para actualizar el status de cada stock.
     * @param {object} stocks Arreglo con los datos del stock del producto.
     * @param {number} salesPrice Precio de venta del producto.
     * @param {function} cb Función de callback.
     */
    function processStocks(stocks, salesPrice, ohpId, cb) {
      _.each(stocks, stock => {
        wf2.push(next => {
          let updStock = {
            idOrderHasProduct: ohpId,
            idUser: instance.idSeller,
            idClient: instance.idClient,
            confirmSale: true,
            validate: true,
            status: 'sold',
            saleDate: Date.now(),
            salesPrice: salesPrice};
          updateStock(stock.id, instance.id, instance.orderNumber, 'sold',
            updStock, cc(next));
        });
      });
      cb();
    }// End processStocks
    // Código principal
    if (!ctx.args.payment.credit) {
      // ...prevenir que no exista credit
      ctx.args.payment.credit = 0;
    }
    ctx.args.payment.credit = 0;
    _.each(ctx.args.products, (product, idx) => {
      wf.push(next => {
        if (!product.totalItems && !product.salesPrice &&
        !product.publicPrice) {
          // ...no indica el total de la venta
          return next(newError(400,
            `No se indica el monto de compra del producto ${idx + 1}`));
        } else {
          let newOHP = {
            idOrder: instance.id,
            idProduct: product.idProduct,
            totalItems: product.totalItems,
            subtotal: product.salesPrice,
            discount: product.publicPrice - product.salesPrice,
            total: parseFloat((product.totalItems * product.salesPrice)
              .toFixed(2))};
          if (newOHP.discount <= 0) newOHP.discount = 0;
          OrderHasProduct.create(newOHP, (err, iOHP) => {
            if (err) return next(err);
            updOrder.totalItems += iOHP.totalItems;
            updOrder.subtotal += (iOHP.totalItems * iOHP.subtotal);
            updOrder.discount += (iOHP.totalItems * iOHP.discount);
            updOrder.total += iOHP.total;
            ctx.args.payment.credit += iOHP.total;
            processStocks(product.stocks, product.salesPrice, iOHP.id, next);
          });// End OHP.create
        }
      });// End wf.push
    });// End _.each
    async.waterfall(wf, err => {
      if (err) {
        // ...en caso de error borrar el registro
        instance.destroy();
        return done(err);
      }
      async.waterfall(wf2, err => {
        if (err) return done(err);
        setPayments(instance, ctx.args.payment, (err, result) => {
          if (err) return done(err);
          updOrder.credit = result.credit < 0 ? 0 : result.credit;
          updOrder.cash = result.cash;
          instance.updateAttributes(updOrder, done);
        });
      });
    });// End async.waterfall
  }// End afterCreate
  /**
   * @name beforeCreate
   * @description Prepara los datos adicionales en el registro de una orde de
   * compra.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeCreate(ctx, instance, done) {
    console.log('Order call beforeCreate');
    let wf = [];
    let wf2 = [];
    let cc = Order.app.commonCallback;
    let newError = Order.app.newError;
    ctx.args.stocks = [];
    /**
     * @name valStocks
     * @description Valida el stock del producto.
     * @param {object} stocks Arreglo con los datos del stock.
     * @param {functio} cb Función de callback.
     */
    function valStocks(stocks, cb) {
      wf2.push(next => {
        validateStocks(stocks, {status: {neq: 'sold'}}, cc(next));
      });
      cb();
    }// End valStocks
    // Validar información del formulario
    if (!ctx.args.data.payment || typeof ctx.args.data.payment !== 'object') {
      // ...validar que incluya los datos del pago
      return done(newError(400,
        'Solicitud incompeta, sin datos del pago.'));
    }
    if (!ctx.args.data.type) {
      // ...validar que incluya los datos del pago
      return done(newError(400,
        'Solicitud incompeta, sin tipo de orden.'));
    }
    if (ctx.args.data.type === 'sale' &&
    (!ctx.args.data.products || ctx.args.data.products.length < 1)) {
      // ...validar que incluya los datos de los productos
      return done(newError(400,
        'Solicitud incompeta, sin datos de los productos.'));
    }
    // Validar cliente
    wf.push(next => {
      getClient(ctx.args.data.idClient, cc(next));
    });
    // Validar vendedor
    wf.push(next => {
      getSeller(ctx.args.data.idSeller, cc(next));
    });
    // Validar productos
    _.each(ctx.args.data.products, product => {
      wf.push(next => {
        if (!product.idProduct) {
          // ...no incluye id del producto
          return next(newError(400,
            'No se incluye identificador del producto'));
        }
        if (!product.stocks || product.stocks.length < 1) {
          // ...no incluye datos del stock
          return next(newError(400,
            'Sollicitud incompleta, sin datos del stock'));
        } else {
          // ...validar los datos del stocks
          getProduct(product.idProduct, (err, iP) => {
            if (err) return next(err);
            valStocks(product.stocks, next);
          });
        }
      });// End wf.push
    });// End _.each
    // Código principal
    async.waterfall(wf, err => {
      if (err) return done(err);
      async.waterfall(wf2, err => {
        if (err) return done(err);
        ctx.args.payment = ctx.args.data.payment;
        ctx.args.products = ctx.args.data.products;
        delete ctx.args.data.payment;
        delete ctx.args.data.products;
        // Generar número de orden
        Order.makeOrderNumber((err, number) => {
          if (err) return done(err);
          ctx.args.data.orderNumber = number;
          done();
        });
      });
    });
  }// End beforeCreate
  /**
   * @name getClient
   * @description Recupera los datos del cliente por su identificador.
   * @param {string} clientId Identificador del cliente.
   * @param {function} done Función de callback.
   */
  function getClient(clientId, done) {
    let Billing = Order.app.models.Billing;
    let newError = Order.app.newError;
    Billing.findById(clientId, (err, iClient) => {
      if (err) return done(err);
      if (!iClient) {
        return done(newError(404,
          `Identificador de cliente invalido. - ${clientId}`));
      } else {
        return done(null, iClient);
      }
    });
  }// End getClient
  /**
   * @name getProduct
   * @description Recupera los datos de un producto por su identificador.
   * @param {string} productId Identificador del producto.
   * @param {function} done Función de callback.
   */
  function getProduct(productId, done) {
    let Product = Order.app.models.Product;
    let newError = Order.app.newError;
    Product.findById(productId, (err, iProduct) => {
      if (err) return done(err);
      if (!iProduct) {
        return done(newError(404,
          `Identificador de producto invalido - ${productId}.`));
      } else {
        return done(null, iProduct);
      }
    });
  }// End getProduct
  /**
   * @name getSeller
   * @description Recupera los datos del vendedor por su identificador.
   * @param {string} sellerId Identificador del vendedor.
   * @param {function} done Función de callback.
   */
  function getSeller(sellerId, done) {
    let SysUser = Order.app.models.SysUser;
    let newError = Order.app.newError;
    SysUser.findById(sellerId, (err, iSeller) => {
      if (err) return done(err);
      if (!iSeller) {
        return done(newError(404,
          `Identificador de vendedor invalido. - ${sellerId}`));
      } else {
        return done(null, iSeller);
      }
    });
  }// End getSeller
  /**
   * @name getStock
   * @description Recupera los datos de un stock por su identificador.
   * @param {string} stockId Identificador del stock.
   * @param {object} filter Objeto con los filtros de busqueda.
   * @param {function} done Funcción de callback.
   */
  function getStock(stockId, filter, done) {
    let Stock = Order.app.models.Stock;
    let newError = Order.app.newError;
    let stockFilter = _.extend({id: stockId}, filter);
    Stock.findOne({where: stockFilter}, (err, iStock) => {
      if (err) return done(err);
      if (!iStock) {
        return done(newError(404, 'Error al recuperar el stock. Revise ' +
          `disponibilidad del producto. - ${stockId}`));
      } else {
        return done(null, iStock);
      }
    });
  }// End getStock
  /**
   * @name getSysUser
   * @description Recupera los datos de un usuario por su identificador.
   * @param {string} userId Identificador del usuario.
   * @param {function} done Función de callback.
   */
  function getSysUser(userId, done) {
    let SysUser = Order.app.models.SysUser;
    let newError = Order.app.newError;
    SysUser.findById(userId, (err, iUser) => {
      if (err) return done(err);
      if (!iUser) {
        return done(newError(404,
          `Identificador de usuario invalido. - ${userId}`));
      } else {
        return done(null, iUser);
      }
    });
  }// End getSysUser
  /**
   * @name setPayments
   * @description Registra los pagos asociados a la orden.
   * @param {object} order Instancia de la orden.
   * @param {object} paymentObj Objeto con los datos de los pagos.
   * @param {function} done Función de callback.
   */
  function setPayments(order, paymentObj, done) {
    let wf = [];
    let result = {
      credit: 0,
      cash: 0};
    let Payment = Order.app.models.Payment;
    let cc = Order.app.commonCallback;
    let payments = ['credit', 'cash', 'check', 'deposit', 'refund', 'change'];
    getClient(order.idClient, (err, iC) => {
      if (err) return done(err);
      let currentDebt = iC.debt;
      _.each(payments, (payment, idx) => {
        if (paymentObj[payment] && parseFloat(paymentObj[payment]) > 0) {
          let newPayment = {
            idSeller: order.idSeller,
            idClient: order.idClient,
            idOrder: order.id,
            index: idx,
            type: payment,
            amount: parseFloat(paymentObj[payment]),
            previousDebt: currentDebt,
            status: 'paid'};
          if (payment === 'check' || payment === 'deposit') {
            // ...cambiar el status en caso de ser operaciones bancarias
            newPayment.status = 'pending';
          }
          switch (payment) {
            case 'change':
              currentDebt += newPayment.amount;
              result.credit -= newPayment.amount;
              break;
            case 'credit':
              currentDebt += newPayment.amount;
              result.credit += newPayment.amount;
              break;
            case 'refund':
              currentDebt -= newPayment.amount;
              break;
            default:
              currentDebt -= newPayment.amount;
              result.cash += newPayment.amount;
              result.credit -= newPayment.amount;
          }
          newPayment.currentDebt = currentDebt;
          wf.push(next => {
            Payment.create(newPayment, cc(next));
          });
        }
      });
      async.waterfall(wf, err => {
        if (err) return done(err);
        iC.updateAttributes({debt: currentDebt}, (err, uC) => {
          if (err) return done(err);
          done(null, result);
        });
      });// End async.waterfall
    });
  }// End setPayments
  /**
   * @name updateStock
   * @description Actualiza el estado de un stock, además de registrar el evento
   * en el log.
   * @param {string} stockId Identificador del stock.
   * @param {string} orderId Identificador de la orden.
   * @param {string} orderNumber Número de orden donde se registra el evento.
   * @param {string} event Evento que se registrará en el log del stock.
   * @param {object} update Objeto con los datos para actualizar.
   * @param {function} done Función de callback.
   */
  function updateStock(stockId, orderId, orderNumber, event, update, done) {
    let stock = {};
    let cc = Order.app.commonCallback;
    let StockLog = Order.app.models.StockLog;
    let OrderHasStock = Order.app.models.OrderHasStock;
    getStock(stockId, {}, (err, iS) => {
      if (err) return done(err);
      stock = iS;
      let newLog = {
        idStock: stock.id,
        event: event,
        description: ''};
      switch (event) {
        case 'change':
          newLog.description =
            `Cambio físico del producto, orden ${orderNumber}`;
          break;
        case 'refund':
          newLog.description =
            `${iS.refundNote} ($${iS.refundPrice}), orden ${orderNumber}`;
          break;
        case 'return':
          newLog.description =
            `Devolución del producto, orden ${orderNumber}`;
          break;
        case 'sold':
          newLog.description =
            `Producto vendido en la orden ${orderNumber}`;
          break;
        default:
          newLog.description =
            `Evento desconocido orden ${orderNumber}`;
          break;
      }
      stock.updateAttributes(update, (err, uS) => {
        if (err) return done(err);
        StockLog.create(newLog, (err, iL) => {
          if (err) return done(err);
          OrderHasStock.create({idStock: stock.id, idOrder: orderId}, cc(done));
        });
      });// End stock.updateAttributes
    });
  }// End updateStock
  /**
   * @name validateStocks
   * @description Valida los id de los equipos para la nota de venta.
   * @param {object} iProduct Objeto con los datos del producto.
   * @param {object} stocks Objeto con los datos de los equipos.
   * @param {function} done Función de callback.
   */
  function validateStocks(stocks, filter, done) {
    let wf = [];
    let result = [];
    let newError = Order.app.newError;
    _.each(stocks, stock => {
      wf.push(next => {
        if (!stock.id) {
          // ...no se incluye el identificador del stock
          return next(newError(400, 'No se incluye identificador del stock.'));
        }
        getStock(stock.id, filter, (err, stock) => {
          if (err) return next(err);
          result.push(stock);
          next();
        });
      });// End wf.push
    });// End _.each
    async.waterfall(wf, err => {
      if (err) return done(err);
      done(null, result);
    });
  }// End validateStocks
  // Middlewares
  Order.afterRemote('create', afterCreate);
  Order.beforeRemote('create', beforeCreate);
  // Métodos remotos
  /**
   * @name makeOrderNumber
   * @description Genera el número de la nota de venta.
   * @param {function} done Función de callaback.
   */
  Order.makeOrderNumber = function(done) {
    console.log('Order call makeOrderNumber');
    let today = moment().format('YYYYMMDD');
    let orderFilter = {
      where: {orderNumber: {like: today + '%'}},
      order: ['orderNumber DESC']};
    Order.findOne(orderFilter, (err, iOrder) => {
      if (err) return done(err);
      let num = 1;
      let tmp = '00';
      if (iOrder) {
        num = iOrder.orderNumber.substr(-3);
        num = parseInt(num) + 1;
      }
      tmp += num;
      done(null, today + tmp.substr(-3));
    });
  };// End makeOrderNumber
  /**
   * @name refund
   * @description Registra una nota de bonificación.
   * @param {object} data Objeto con los datos de la bonificación (idSeller,
   * idClient, stocks).
   * @param {function} done Función de callback.
   */
  Order.refund = function(data, done) {
    console.log('Order call refund');
    let wf = [];
    let stocks = [];
    let cc = Order.app.commonCallback;
    let newError = Order.app.newError;
    let OrderHasProduct = Order.app.models.OrderHasProduct;
    // Validar datos del formulario
    if (!data.idSeller || !data.idClient || !data.stocks ||
    data.stocks.length < 1) {
      return done(newError(404,
        'Solicitud incompleta, revise los datos proporcionados. (refund)'));
    }
    // Objeto de orden de compra
    let newOrder = {
      idSeller: data.idSeller,
      idClient: data.idClient,
      type: 'refund',
      totalItems: 0,
      discount: 0,
      total: 0};
    let newOHPs = [];
    /**
     * @name addProducts
     * @description Registra los productos a la nota de bonificación.
     * @param {object} order Instancia del objeto order.
     * @param {function} cb Función de callback.
     */
    function addProducts(order, cb) {
      let wf = [];
      let updOrder = {
        status: 'full',
        totalItems: 0,
        subtotal: 0,
        total: 0};
      _.each(newOHPs, OHP => {
        wf.push(next => {
          OHP.idOrder = order.id;
          updOrder.totalItems += OHP.totalItems;
          updOrder.subtotal += OHP.subtotal;
          updOrder.total += OHP.total;
          OrderHasProduct.create(OHP, cc(next));
        });
      });
      async.waterfall(wf, err => {
        if (err) return cb(err);
        let payment = {refund: updOrder.total};
        setPayments(order, payment, (err, result) => {
          if (err) return cb(err);
          order.updateAttributes(updOrder, (err, uO) => {
            if (err) return cb(err);
            cb(null, uO);
          });
        });
      });
    };// End addProducts
    /**
     * @name processStocks
     * @description Procesa los datos de los Stocks para incluirlos en la nota
     * de devolución.
     * @param {object} order Instancia de la nota de devolución.
     * @param {function} cb Función de callback.
     */
    function processStocks(order, cb) {
      let wf = [];
      _.each(stocks, stock => {
        let find = _.find(newOHPs, OHP => {
          return OHP.idProduct === stock.idProduct;
        });
        if (find) {
          find.totalItems++;
          find.total += stock.salesPrice;
        } else {
          let newOHP = {
            idProduct: stock.idProduct,
            totalItems: 1,
            subtotal: stock.salesPrice,
            discount: 0,
            total: stock.salesPrice};
          newOHPs.push(newOHP);
        }
        wf.push(next => {
          let updStock = {
            refunded: true};
          updateStock(stock.id, order.id, order.orderNumber, 'refund', updStock,
            cc(next));
        });
      });
      async.waterfall(wf, err => {
        if (err) return cb(err);
        addProducts(order, cb);
      });
    }// End processStocks
    // Validar cliente
    wf.push(next => {
      getClient(data.idClient, cc(next));
    });
    // Validar vendedor
    wf.push(next => {
      getSeller(data.idSeller, cc(next));
    });
    // Validar stocks
    wf.push(next => {
      let filter = {
        confirmSale: true,
        idClient: data.idClient,
        forRefund: true};
      validateStocks(data.stocks, filter, (err, iStocks) => {
        if (err) return next(err);
        stocks = iStocks;
        next();
      });
    });
    // Código principal
    async.waterfall(wf, err => {
      if (err) return done(err);
      // Recuperar numero de orden
      Order.makeOrderNumber((err, number) => {
        if (err) return done(err);
        newOrder.orderNumber = number;
        // Crear la nota de bonificación
        Order.create(newOrder, (err, iOrder) => {
          if (err) return done(err);
          // Pasar la ejecución a la función
          processStocks(iOrder, done);
        });// End Order.create
      });// End Order.makeOrderNumber
    });// End async.waterfall
  };
  /**
   * @name return
   * @description Registra una nota de devolución.
   * @param {object} data Objeto con los datos del reingreso (idSeller,
   * idClient, idUser, stocks).
   * @param {function} done Función de callback.
   */
  Order.return = function(data, done) {
    console.log('Order call return');
    let wf = [];
    let user = {};
    let stocks = [];
    let cc = Order.app.commonCallback;
    let newError = Order.app.newError;
    let OrderHasProduct = Order.app.models.OrderHasProduct;
    // Validar datos del formulario
    if (!data.idClient || !data.idUser || !data.idSeller || !data.stocks ||
    data.stocks.length < 1) {
      // ...información incompleta
      return done(newError(404,
        'Solicitud incompleta, revise los datos proporcionados (return).'));
    }
    let newOrder = {
      idSeller: data.idSeller,
      idClient: data.idClient,
      type: 'return',
      totalItems: 0,
      discount: 0,
      total: 0};
    let newOHPs = [];
    /**
     * @name addProducts
     * @description Registra los productos a la nota de devolución.
     * @param {object} order Instancia del objeto orden.
     * @param {function} cb Función de callback.
     */
    function addProducts(order, cb) {
      let wf = [];
      let updOrder = {
        status: 'full',
        totalItems: 0,
        subtotal: 0,
        total: 0};
      _.each(newOHPs, OHP => {
        wf.push(next => {
          OHP.idOrder = order.id;
          updOrder.totalItems += OHP.totalItems;
          updOrder.subtotal += OHP.subtotal;
          updOrder.total += OHP.total;
          OrderHasProduct.create(OHP, cc(next));
        });
      });
      async.waterfall(wf, err => {
        if (err) return cb(err);
        let payment = {refund: updOrder.total};
        if (data.payment && data.payment.change) {
          // ...si se incluye devolución de efectivo al cliente
          payment.change = parseFloat(data.payment.change);
        }
        setPayments(order, payment, (err, result) => {
          if (err) return cb(err);
          order.updateAttributes(updOrder, (err, uO) => {
            if (err) return cb(err);
            cb(null, uO);
          });
        });
      });// End async.waterfall
    };// End addProducts
    /**
     * @name processStocks
     * @description Procesa los datos de los Stocks para incluirlos en la nota
     * de devolución.
     * @param {object} order Instancia de la nota de venta.
     * @param {function} cb Función de callback.
     */
    function processStocks(order, cb) {
      let wf = [];
      _.each(stocks, stock => {
        let find = _.find(newOHPs, OHP => {
          return OHP.idProduct === stock.idProduct;
        });
        if (find) {
          find.totalItems++;
          find.discount += stock.salesPrice;
        } else {
          let newOHP = {
            idProduct: stock.idProduct,
            totalItems: 1,
            subtotal: stock.salesPrice,
            discount: 0,
            total: stock.salesPrice};
          newOHPs.push(newOHP);
        }
        wf.push(next => {
          let updStock = {
            idClient: null,
            saleDate: null,
            salesPrice: null,
            status: 'active',
            confirmSale: false,
            idOrderHasProduct: null,
            idUser: user.id,
            idWarehouse: user.idWarehouse};
          if (user.warehouse.type === 'seller') {
            // ...es un vendedor o punto de venta
            updStock.validate = false;
            updStock.status = 'assigned';
          }
          updateStock(stock.id, order.id, order.orderNumber, 'return', updStock,
            cc(next));
        });
      });
      async.waterfall(wf, err => {
        if (err) return cb(err);
        addProducts(order, cb);
      });
    }// End processStocks
    // Validar cliente
    wf.push(next => {
      getClient(data.idClient, cc(next));
    });
    // Validar vendedor
    wf.push(next => {
      getSeller(data.idSeller, cc(next));
    });
    // Validar usuario
    wf.push(next => {
      getSysUser(data.idUser, (err, iU) => {
        if (err) return next(err);
        user = iU;
        next();
      });
    });
    // Validar stocks
    wf.push(next => {
      let filter = {
        confirmSale: true,
        idClient: data.idClient,
        refunded: false};
      validateStocks(data.stocks, filter, (err, iStocks) => {
        if (err) return next(err);
        stocks = iStocks;
        next();
      });
    });
    async.waterfall(wf, err => {
      if (err) return done(err);
      // Recuperar número de orden
      Order.makeOrderNumber((err, number) => {
        if (err) return done(err);
        newOrder.orderNumber = number;
        // Crear la nota de bonificación
        Order.create(newOrder, (err, iOrder) => {
          if (err) return done(err);
          // Pasar la ejecución a la función
          processStocks(iOrder, done);
        });// End create
      });// End makeOrderNumber
    });// End async.waterfall
  };// End return
  /**
   * @name change
   * @description Registra una nota de cambio físico.
   * @param {object} data Objeto con los datos del reingreso (idSeller,
   * idClient, idUser, payment, returnStocks, changeStocks).
   * @param {function} done Función de callback.
   */
  Order.change = function(data, done) {
    console.log('Order call change');
    let wf = [];
    let stocks = [];
    let ohpIds = [];
    let cc = Order.app.commonCallback;
    let newError = Order.app.newError;
    let OrderHasProduct = Order.app.models.OrderHasProduct;
    // Validar datos del formulario
    if (!data.idSeller || !data.idUser || !data.idClient || !data.payment ||
    typeof data.payment !== 'object' || !data.returnStocks ||
    data.returnStocks.length < 1 || !data.changeStocks ||
    data.changeStocks.length < 1) {
      return done(newError(404,
        'Solicitud incompleta, revise los datos proporcionados. (change)'));
    }
    let refundData = {
      idClient: data.idClient,
      idUser: data.idUser,
      idSeller: data.idSeller,
      stocks: data.returnStocks};
    let newOrder = {
      idSeller: data.idSeller,
      idClient: data.idClient,
      type: 'sale',
      totalItems: 0,
      discount: 0,
      total: 0};
    let newOHPs = [];
    /**
     * @name setNewPrice
     * @description Asigna el precio de cambio al stock.
     * @param {object} order Instancia de la nota de venta.
     * @param {function} cb Función de callback.
     */
    function setNewPrice(order, cb) {
      let wf = [];
      _.each(stocks, stock => {
        wf.push(next => {
          let find = _.find(data.changeStocks, cStocks => {
            return cStocks.id === stock.id;
          });
          if (!find) {
            return next(newError(404,
              'No se pudo indicar el precio del producto.'));
          } else {
            stock.newPrice = stock.publicPrice;
            if (find.price) {
              stock.newPrice = parseFloat(find.price);
            }
            next();
          }
        });
      });
      async.waterfall(wf, err => {
        if (err) return cb(err);
        processStocks(order, cb);
      });
    }
    /**
     * @name addProducts
     * @description Registra los productos a la nota de devolución.
     * @param {object} order Instancia del objeto orden.
     * @param {function} cb Función de callback.
     */
    function addProducts(order, cb) {
      let wf = [];
      let updOrder = {
        status: 'full',
        totalItems: 0,
        subtotal: 0,
        total: 0};
      _.each(newOHPs, OHP => {
        wf.push(next => {
          OHP.idOrder = order.id;
          updOrder.totalItems += OHP.totalItems;
          updOrder.subtotal += OHP.subtotal;
          updOrder.total += OHP.total;
          OrderHasProduct.create(OHP, (err, iOHP) => {
            if (err) return next(err);
            ohpIds.push(iOHP.id);
            next();
          });
        });
      });// End _.each
      async.waterfall(wf, err => {
        if (err) return cb(err);
        setPayments(order, data.payment, (err, result) => {
          updOrder.credit = result.credit;
          updOrder.cash = result.cash;
          order.updateAttributes(updOrder, (err, uO) => {
            if (err) return cb(err);
            // cb(null, uO);
            updateOrderHasProduct(uO, cb);
          });
        });
      });// End async.waterfall
    };// End addProducts
    /**
     * @name processStocks
     * @description Procesa los datos de los Stocks para incluirlos en la nota
     * de devolución.
     * @param {object} order Instancia de la nota de venta.
     * @param {function} cb Función de callback.
     */
    function processStocks(order, cb) {
      let wf = [];
      let amount = parseFloat(order.discount);
      let tmp = parseFloat((amount / stocks.length).toFixed(2));
      let idx = 0;
      data.payment.credit = 0;
      _.each(stocks, stock => {
        data.payment.credit += stock.newPrice;
        let find = _.find(newOHPs, OHP => {
          return OHP.idProduct === stock.idProduct;
        });
        if (find) {
          // ...ya habia un elemento previo
          find.totalItems++;
          find.total = parseFloat((find.totalItems * find.subtotal).toFixed(2));
        } else {
          // ...es la primera coincidencia del elemento
          let newOHP = {
            idProduct: stock.idProduct,
            totalItems: 1,
            subtotal: 0,
            discount: 0,
            total: 0};
          newOHP.discount = stock.newPrice > tmp ? tmp : stock.newPrice;
          newOHP.subtotal = parseFloat(((0 - tmp) + stock.newPrice).toFixed(2));
          newOHP.total = newOHP.subtotal;
          newOHPs.push(newOHP);
          stock.idx = idx++;
        }
        wf.push(next => {
          let updStock = {
            idOrderHasProduct: order.id,
            salesPrice: stock.newPrice,
            status: 'sold',
            confirmSale: true,
            idClient: order.idClient,
            saleDate: new Date(),
            validate: true};
          updateStock(stock.id, order.id, order.orderNumber, 'change', updStock,
            cc(next));
        });
      });// End _.each
      async.waterfall(wf, err => {
        if (err) return cb(err);
        addProducts(order, cb);
      });// End async.waterfall
    }// End processStocks
    /**
     * @name updateOrderHasProduct
     * @description Actualiza el campo idOrderHasProduct con el nuevo identificador.
     * @param {object} order Instancia de la orden de cambio.
     * @param {function} cb Función de callback.
     */
    function updateOrderHasProduct(order, cb) {
      let wf = [];
      _.each(stocks, stock => {
        wf.push(next => {
          let updStock = {
            idOrderHasProduct: ohpIds[stock.idx]};
          stock.updateAttributes(updStock, cc(next));
        });
      });
      async.waterfall(wf, err => {
        if (err) return cb(err);
        cb(null, order);
      });
    }// End updateOrderHasProduct
    // Validar stock de cambio
    wf.push(next=> {
      let filter = {status: {neq: 'sold'}};
      validateStocks(data.changeStocks, filter, (err, iStocks) => {
        if (err) return next(err);
        stocks = iStocks;
        next();
      });
    });
    async.waterfall(wf, err => {
      if (err) return done(err);
      Order.return(refundData, (err, rO) => {
        if (err) return done(err);
        newOrder.discount = rO.total;
        // Recuperar número de orden
        Order.makeOrderNumber((err, number) => {
          if (err) return done(err);
          newOrder.orderNumber = number;
          // Crear la nota de bonificación
          Order.create(newOrder, (err, iOrder) => {
            if (err) return done(err);
            // done(null, iOrder);
            setNewPrice(iOrder, done);
          });// End Order.create
        });// End Order.makeOrderNumber
      });// End Order.return
    });// End async.waterfall
  };// End change
};
/******************************************************************************/
