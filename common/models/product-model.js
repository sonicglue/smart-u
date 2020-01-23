'use strict';
// NodeJs modules
let _ = require('underscore');
let async = require('async');
let moment = require('moment');

module.exports = function(ProductModel) {
  // TODO: implementar código del modelo
  function beforeCreate(ctx, instance, done) {
    console.log('ProductModel call beforeCreate');
    let tag = ProductModel.app.convertToSlug(ctx.args.data.name);
    ProductModel.findOne({where: {tag: tag}}, (err, iModel) => {
      if (err) return done(err);

      if (iModel) {
        console.log(iModel);
        return done(ProductModel.app.newError(422,
          'Error X01: No se puede registrar el modelo \'' +
          ctx.args.data.name +
          '\' Este modelo ya se encuentra en la lista del sistema.'));
      } else {
        ctx.args.data.tag = tag;
        done();
      }
    });
  }// End beforeCreate
  // Middlewares
  ProductModel.beforeRemote('create', beforeCreate);
  // Métodos remotos
  ProductModel.prototype.updatePrices = function(newPrice, done) {
    console.log('Stock call updatePrices');
    let wf = [];
    let cc = ProductModel.app.commonCallback;
    let day = moment().subtract(30, 'days').format('YYYY-MM-DD');
    let result = {count: 0};
    day += ' 00:00:00';
    let filter = {
      include: {
        relation: 'products', scope: {
          include: {
            relation: 'stocks', scope: {
              where: {
                and: [
                  {isRefurb: false},
                  {refunded: false}],
                or: [
                  {status: 'active'},
                  {status: 'assigned'},
                  {and: [
                    {status: 'sold'},
                    {saleDate: {gte: day}}]}]}}}}}};
    // Buscar todos los productos de ese modelo
    ProductModel.findById(this.id, filter, (err, iModel) => {
      if (err) return done(err);
      _.each(iModel.products(), product => {
        if (product.stocks().length) {
          // ...solo si tiene existencias en stock
          _.each(product.stocks(), stock => {
            let refundPrice =
              (stock.salesPrice) - parseFloat(newPrice);
            let updStock = {
              publicPrice: parseFloat(newPrice),
              forRefund: false,
              refundPrice: null,
              refundNote: null};
            if (stock.refunded) {
              // ...no ha habido una bonificiación previa
              refundPrice -= stock.refundPrice;
            }
            if (stock.status === 'sold' && stock.confirmSale && refundPrice > 0) {
              // ...control de equipos vendidos (marcar para bonificar)
              updStock.forRefund = true;
              updStock.refunded = false;
              updStock.refundValidate = false;
              updStock.refundPrice = refundPrice;
              updStock.refundNote = 'Bonificación baja de precio';
            }
            result.count++;
            wf.push(next => {
              stock.updateAttributes(updStock, cc(next));
            });
          });// End _.each
        }
      });// End _.each
      async.waterfall(wf, err => {
        if (err) return done(err);
        iModel.updateAttributes({price: newPrice}, (err, model) => {
          if (err) return done(err);
          ProductModel.sendNotifications(model, (err, result) => {
            if (err) return done(err);
            done(null, result);
          });
        });
      });
    });// End ProductModel.findById
  };// End updatePrices
  /**
   * @name sendNotification
   * @description Envia una notificación debido al cambio de precio de un producto.
   * @param {object} model Objeto con los datos del modelo.
   * @param {function} done Función de callback.
   */
  ProductModel.sendNotifications = function(model, done) {
    console.log('ProductModel call sendNotification');
    let AppUser = ProductModel.app.models.AppUser;
    let wf = [];
    let filter = {
      where: {type: 'seller'}};
    AppUser.find(filter, (err, users) => {
      if (err) return done(err);
      _.each(users, (user) => {
        if (user.deviceId) {
          wf.push(next => {
            let message = {
              to: user.deviceId,
              title: 'Notificación Smart-U',
              body: 'El siguiente producto ha cambiado su precio de lista',
              data: {
                type: {message: 'Aviso por baja de precio.'},
                Model1: {model: model.name}}};
            ProductModel.app.sendNotification(message, next);
          });// End wf.push
        }
      });// End _.each
      async.waterfall(wf, done);
    });// End AppUser.find
  };// End sendNotification
};
