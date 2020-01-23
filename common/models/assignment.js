'use strict';
// Modulos de NodeJs
let _ = require('underscore');
let async = require('async');
let moment = require('moment');

module.exports = function(Assignment) {
  function beforeCreate(ctx, instance, done) {
    console.log('Assignment call beforeCreate');
    let today = moment().format('YYYYMMDD');
    let orderFilter = {
      limit: 1,
      where: {number: {like: today + '%'}},
      order: ['number DESC']};
    Assignment.find(orderFilter, (err, iAssignment) => {
      if (err) return done(err);
      let num = 1;
      let tmp = '00';
      if (iAssignment.length) {
        num = iAssignment[0].number.substr(-3);
        num = parseInt(num) + 1;
      }
      tmp += num;
      ctx.args.data.number = today + tmp.substr(-3);
      done();
    });
  }// End beforeCreate
  // Middlewares
  Assignment.beforeRemote('create', beforeCreate);
  // Metodos remotos
  /**
   * @name addStock
   * @description
   */
  Assignment.prototype.addStock = function(idStock, index, done) {
    console.log('Assignment call addStock');
    let Stock = Assignment.app.models.Stock;
    let AssignmentHasStock = Assignment.app.models.AssignmentHasStock;
    let result;
    let filter = {
      include: {
        relation: 'product', scope: {
          include: {
            relation: 'model', scope: {
              include: 'brand'}}}}};
    Stock.findById(idStock, filter, (err, iStock) => {
      if (err) return done(Assignment.app.newError(404,
        'No se encontró el equipo solicitado.'));
      if (iStock.status === 'active' || iStock.status === 'assigned') {
        let newAHS = {
          idAssignment: this.id,
          idStock: iStock.id};
        AssignmentHasStock.create(newAHS, (err, iANS) => {
          if (err) return done(err);
          let updateStock = {
            status: 'in-transit',
            validate: false,
            index: index};
          result = iANS.toObject();
          iStock.updateAttributes(updateStock, (err, stock) => {
            if (err) return done(err);
            result.stock = stock.toObject();
            done(null, result);
          });
        });
      } else {
        done(Assignment.app.newError(402,
          `El equipo ${iStock.IMEI} ya está asignado en un traspaso.`));
      }
    });
  };// End addStock
  /**
   * @name cancel
   * @description Cancela el traspaso.
   * @param {string} idReceiver Identificador del receptor del traspaso.
   * @param {function} done Función de callback.
   */
  Assignment.prototype.cancel = function(idReceiver, done) {
    console.log('Assignment call cancel');
    let cc = Assignment.app.commonCallback;
    let wf = [];
    // Evitar cerrar dos veces el traspaso
    if (this.status === 'received' || this.status === 'canceled') {
      return done(Assignment.app.newError(404,
        'Este traspaso fué concluido anteriormente.'));
    }
    let assignmentStatus = {
      idReceiver: idReceiver,
      status: 'canceled',
      received: new Date()};
    let filter = {
      include: ['stocks']};
    Assignment.findById(this.id, filter, (err, iAssignment) => {
      if (err) return done(err);
      let stockStatus = {
        idWarehouse: this.idOrigin,
        status: 'active',
        validate: true};
      _.each(iAssignment.stocks(), iStock => {
        // Actualizar el stock
        wf.push(next => {
          iStock.updateAttributes(stockStatus, cc(next));
        });
      });
      // Actualiza el traspaso
      wf.push(next => {
        iAssignment.updateAttributes(assignmentStatus, cc(next));
      });
      async.waterfall(wf, done);
    });
  };// End cancel
  /**
   * @name delStock
   * @description Elimina de la asignación el equipo búscado.
   * @param {string} idStock Identificador del stock.
   * @param {function} done Función de callback.
   */
  Assignment.prototype.delStock = function(idStock, done) {
    console.log('Assignment call delStock');
    let AssignmentHasStock = Assignment.app.models.AssignmentHasStock;
    let filter = {
      include: 'stock',
      where: {
        and: [
          {idAssignment: this.id},
          {idStock: idStock}]}};
    AssignmentHasStock.findOne(filter, (err, iAHS) => {
      if (err) return done(err);
      if (iAHS) {
        if (iAHS.stock().status === 'in-transit') {
          iAHS.stock().updateAttributes({status: 'assigned'}, (err, iStock) => {
            if (err) return done(err);
            iAHS.destroy(done);
          });
          // borrar el registro
        } else {
          // ...devolver error
          done(Assignment.app.newError(404,
            `El equipo ${iAHS.stock().IMEI} no se encuentra en este traspaso`));
        }
      } else {
        done(Assignment.app.newError(404,
          'El equipo no se encuentra en este traspaso.'));
      }
    });
  };// End delStock
  /**
   * @name receive
   * @description Acepta el traspaso.
   * @param {string} idReceiver Identificador del receptor.
   * @param {function} done Función de callback.
   */
  Assignment.prototype.receive = function(idReceiver, done) {
    console.log('Assignment call receive');
    let cc = Assignment.app.commonCallback;
    let StockLog = Assignment.app.models.StockLog;
    let wf = [];
    // Evitar cerrar dos veces el traspaso
    if (this.status === 'received' || this.status === 'canceled') {
      return done(Assignment.app.newError(404,
        'Este traspaso fue concluido anteriormente.'));
    }
    let assignmentStatus = {
      idReceiver: idReceiver,
      status: 'received',
      received: new Date()};
    let filter = {
      include: [
        'origin',
        'stocks',
        {relation: 'destiny', scope: {
          include: ['users']}}]};
    Assignment.findById(this.id, filter, (err, iAssignment) => {
      if (err) return done(err);
      let sellers = iAssignment.destiny().users();
      let stockStatus = {
        idWarehouse: this.idDestiny,
        status: iAssignment.destiny().type === 'place' ? 'active' : 'assigned'};
      if (iAssignment.destiny().type === 'seller') {
        // ...si es ruta incluir el id del vendedor
        stockStatus.idUser = sellers[0].id;
      }
      _.each(iAssignment.stocks(), iStock => {
        let newLog = {
          idStock: iStock.id,
          event: 'assigned',
          description: 'Traspaso de ' + iAssignment.origin().name +
            ' a ' + iAssignment.destiny().name + '.'};
        // Crea log del stock (asignación)
        wf.push(next => {
          StockLog.create(newLog, cc(next));
        });
        // Actualizar el stock
        wf.push(next => {
          iStock.updateAttributes(stockStatus, cc(next));
          console.log('mi cambio en atributos', iStock.updateAttributes);
        });
      });
      // Actualiza el traspaso
      wf.push(next => {
        iAssignment.updateAttributes(assignmentStatus, cc(next));
      });
      async.waterfall(wf, done);
    });
  };// End receive
  /**
   * @name valStock
   * @description
   * @param
   * @param {function} done Función de callback.
   */
  Assignment.prototype.valStock = function(idStock, done) {
    let self = this;
    let AssignmentHasStock = Assignment.app.models.AssignmentHasStock;
    let newError = Assignment.app.newError;
    let filter = {
      where: {
        and: [
          {idAssignment: self.id},
          {idStock: idStock}]}};
    AssignmentHasStock.findOne(filter, (err, iAHS) => {
      if (err) return done(err);
      if (!iAHS) {
        return done(newError(404, 'No se encontró el producto.'));
      } else if (!iAHS.validate) {
        iAHS.updateAttributes({validate: true}, (err, ahs) => {
          if (err) return done(err);
          return done(null, ahs);
        });
      } else {
        done(newError(404, 'Este producto ya fué validado.'));
      }
    });
  };// End valStock
};
