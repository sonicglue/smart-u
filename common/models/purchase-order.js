'use strict';
// Modulos de NodeJs adicionales
let _ = require('underscore');
let xl = require('excel4node');
let fs = require('fs');
let path = require('path');
let async = require('async');
let moment = require('moment');

module.exports = function(PurchaseOrder) {
  // TODO: Implementar códgio del módelo
  function afterUpdate(ctx, instance, done) {
    console.log('PurchaseOrder call afterUpdate');
    if (ctx.args.data.id) {
      // ...se actualiza desde el formulario de Purchase Order
      let id = ctx.args.data.id;
      let filter = {include: 'batches'};
      let Stock = PurchaseOrder.app.models.Stock;
      let wf = [];
      PurchaseOrder.findById(id, filter, (err, order) => {
        if (err) return done(err);
        // Recorrer los lotes de la orden de compra
        _.each(order.batches(), batch => {
          let newPrice = {
            cost: parseFloat((batch.costWithTax *
              order.currencyExchange).toFixed(2)),
            modifiedCost: parseFloat((batch.modifiedCost *
              order.currencyExchange).toFixed(2)),
            publicPrice: parseFloat((batch.costWithTax *
              order.currencyExchange).toFixed(2))};
          wf.push(next => {
            // Actualizar los precios
            Stock.updateAll({idBatch: batch.id}, newPrice, (err, success) => {
              if (err) return done(err);
              next();
            });
          });
        });
        async.waterfall(wf, done);
      });
    } else {
      // ...se actualiza por cambios de estado.
      done();
    }
  }// End afterUpdate
  /**
   * @name beforeDelete
   * @description Previene eliminar una orden de compra si esta relacionado con otros datos.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeDelete(ctx, instance, done) {
    console.log('PurchaseOrder call beforeDelete');
    let Batch = PurchaseOrder.app.models.Batch;
    let filter = {
      where: {
        idPurchaseOrder: ctx.args.id}};
    Batch.find(filter, (err, iBatches) => {
      if (err) return done(err);
      let delFlg = 0;
      if (iBatches) {
        _.each(iBatches, b => {
          delFlg += b.stockCount;
        });
        if (!delFlg) {
          Batch.deleteAll({idPurchaseOrder: ctx.args.id}, done);
        } else {
          return done(PurchaseOrder.app.newError(422,
            'Error 301: No se puede eliminar la orden de compra,' +
            'ya cuenta con números de series registrados'));
        }
      } else {
        done();
      }
    });
    // done();
  }// End beforeDelete
  /**
   * @name observeLoad
   * @description Función para el operation hook 'loaded'. Calcula la deuda por
   * pagar de la orden de compra.
   * @param {object} ctx Objecto de solicitud (request).
   * @param {function} next Función de callback.
   */
  function observeLoad(ctx, next) {
    let iva = 0.16;
    ctx.data.currencyTotal =
      parseFloat((ctx.data.total * ctx.data.currencyExchange).toFixed(2));
    ctx.data.discount = ctx.data.brandDiscount + ctx.data.additionalDiscount;
    ctx.data.neto = parseFloat((ctx.data.total / (1 + iva)).toFixed(2));
    ctx.data.iva = parseFloat((ctx.data.total - ctx.data.neto).toFixed(2));
    ctx.data.debt = ctx.data.total - ctx.data.payment;
    next();
  }// End observeLoad
  PurchaseOrder.afterRemote('prototype.patchAttributes', afterUpdate);
  PurchaseOrder.beforeRemote('deleteById', beforeDelete);
  PurchaseOrder.observe('loaded', observeLoad);
  // Metodos remotos
  PurchaseOrder.excelReport = function(where, req, res, done) {
    let filter = {
      include: ['products', 'provider'],
      where: {paymentStatus: false}};
    if (where !== undefined) {
      filter.where = where;
    }
    PurchaseOrder.find(filter, (err, iPO) => {
      if (err) return done(err);
      //
      if (iPO) {
        return createExcel(iPO, res);
      } else {
        return done(PurchaseOrder.app.newError(422,
          'Error 302: No se puede generar el archivo de Excel'));
      }
    });
  };// End excelReport
  /**
   * @name getStock
   * @description Recupera la información necesaria para calcular precios y
   * utilidades
   * @param {function} done Función de callback.
   */
  PurchaseOrder.getStock = function(done) {
    let conn = PurchaseOrder.dataSource.connector;
/******************************************************************************/
    let sql = 'SELECT Stock.idPurchaseOrder, Stock.idBatch, Stock.idProduct, ' +
      'Product.name, PurchaseOrder.number, PurchaseOrder.purchaseDate, Batch.' +
      'stockSize, COUNT(Stock.idBatch) AS realStockSize, Sales.sold, Stock.co' +
      'st, Stock.modifiedCost, Stock.publicPri' +
      'ce, Stock.salesPrice, SUM(Stock.cost) AS stockCost, SUM(Stock.modified' +
      'Cost) AS minimumProfit, SUM(Stock.publicPrice) AS expectedProfit, SUM(' +
      'Stock.salesPrice) AS profit FROM Stock INNER JOIN Product ON Stock.idP' +
      'roduct = Product.id INNER JOIN PurchaseOrder ON Stock.idPurchaseOrder ' +
      '= PurchaseOrder.id INNER JOIN Batch ON Stock.idBatch = Batch.id LEFT J' +
      'OIN (SELECT idPurchaseOrder, idProduct, COUNT(*) AS sold FROM SystemAx' +
      '.Stock WHERE Stock.status = \'sold\' GROUP BY idPurchaseOrder, idProdu' +
      'ct) AS Sales ON Stock.idPurchaseOrder = Sales.idPurchaseOrder AND Stoc' +
      'k.idProduct = Sales.idProduct GROUP BY idPurchaseOrder, Stock.idBatch,' +
      ' Stock.idProduct, Product.name, PurchaseOrder.number, PurchaseOrder.pu' +
      'rchaseDate, Batch.stockSize, Stock.cost, Stock.modifiedCost, Stock.pub' +
      'licPrice, Stock.salesPrice ORDER BY PurchaseOrder.purchaseDate DESC, P' +
      'roduct.name;';
    return conn.query(sql, (err, stocks) => {
      if (err) return done(err);
      // console.log(products);
      done(null, stocks);
    });
  };// End getStock
  /**
   * @name createExcel
   * @description Función para crear el reporte de ordenes de compra.
   * @param {object} data Objeto con los datos de las ordenes de compra.
   * @param {object} res Objeto de respuesta (res).
   */
  function createExcel(data, res) {
    let style = PurchaseOrder.app;
    let wb = new xl.Workbook({
      defaultFont: {
        size: 11,
        name: 'Calibri'}});
    let ws = wb.addWorksheet('Ordenes_de_compra');

    let titles = ['No.', 'Proveedor', 'Orden de compra',
      'Productos', 'Total', 'Condición de pago', 'Fecha de compra',
      'Fecha de pago', 'Días'];
    let row = 1;
    let col = 1;
    ws.cell(row++, col)
      .string('Ordenes de compra pendientes de pago')
      .style(style.excelFormat(14));
    // row++;
    ws.cell(row++, col).date(new Date())
      .style(style.excelFormat(10, 'gF'));
    for (var x = 0; x < titles.length; x++) {
      ws.cell(row, col + x)
        .string(titles[x])
        .style(style.excelFormat(11, 'cbTBLR', '#FFC000'));
    }
    row++;
    let count = 1;
    _.each(data, purchaseOrder => {
      let fill = '#FFE79B';
      if (row % 2 == 0) {
        fill = '#FFFFFF';
      }
      col = 1;
      ws.cell(row, col++).number(count++)
        .style(style.excelFormat(11, 'gBL', fill));
      ws.cell(row, col++).string(purchaseOrder.provider().name)
        .style(style.excelFormat(11, 'gB', fill));
      ws.cell(row, col++).string(purchaseOrder.number)
        .style(style.excelFormat(11, 'cB', fill));
      let tmp = '';
      _.each(purchaseOrder.products(), (product) => {
        tmp += product.name + '\n';
      });
      ws.cell(row, col++).string(tmp).style(style.excelFormat(9, 'gB', fill))
        .style({alignment: {wrapText: true}});
      ws.cell(row, col++).number(purchaseOrder.total)
        .style(style.excelFormat(11, 'gBC', fill));
      ws.cell(row, col++).string(purchaseOrder.paymentRule)
        .style(style.excelFormat(11, 'cB', fill));
      ws.cell(row, col++).date(purchaseOrder.purchaseDate)
        .style(style.excelFormat(11, 'cBF', fill));
      ws.cell(row, col++).date(purchaseOrder.paymentDate)
        .style(style.excelFormat(11, 'cBF', fill));
      ws.cell(row, col++).formula(`H${row} - G${row}`)
        .style(style.excelFormat(11, 'cBR', fill));
      row++;
    });
    ws.cell(row, 1, row, 4, true).string('Total')
      .style(style.excelFormat(11, 'rbTBLRC', '#FFC000'));
    ws.cell(row, 5).formula(`SUM(E4:E${row - 1})`)
      .style(style.excelFormat(11, 'gbTBLRC', '#FFFFFF'));
    ws.column(1).setWidth(11);
    ws.column(2).setWidth(30);
    ws.column(3).setWidth(16);
    ws.column(4).setWidth(48);
    ws.column(5).setWidth(25);
    ws.column(6).setWidth(16);
    ws.column(7).setWidth(16);
    ws.column(8).setWidth(16);
    console.log('Generando archivo de Excel: ordenes-de-compra');
    wb.write('ordenes-de-compra.xlsx', res);
  }// End createExcel
  /**
   * @name prototype.addFile
   * @description End-point para adjuntar un archivo PDF a la orden de compra.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} options Objeto de parametros adicionales al envío del form.
   * @param {function} done Función de callback.
   */
  PurchaseOrder.prototype.addFile = function(ctx, options, done) {
    let Container = PurchaseOrder.app.models.Container;
    if (!options) options = {};
    let container = 'purchase-orders';
    let self = this;
    ctx.req.params.container = container;
    // Subir el archivo
    Container.upload(ctx.req, ctx.result, options, (err, fileObj) => {
      if (err) return done(err);
      let file = fileObj.files.file[0];
      // Proceso para renombrar el archivo
      let route =
        path.resolve(__dirname + `/../../storage/${container}/${file.name}`);
      let originalName = path.basename(route);
      let extension = originalName.split('.');
      extension = extension[extension.length - 1];
      originalName = originalName.replace('.' + extension, '');
      let newName =
        PurchaseOrder.app.convertToSlug(originalName) + '-' +
        moment().format('YYYY-MM-DD') + '.' + extension;
      // Cambiar el nombre del archivo
      fs.renameSync(route, path.dirname(route) + '/' + newName);
      // Actualizar campo file en Purchase Order
      self.updateAttributes({file: newName}, (err, instance) => {
        if (err) return done(err);
        done();
      });
    });
  };// End prototype.addFile
};

/**
 * TODO:
SELECT Stock.idPurchaseOrder,
Stock.idBatch,
Stock.idProduct,
Product.name,
PurchaseOrder.number,
PurchaseOrder.purchaseDate,
Batch.stockSize,
Sales.sold,
Stock.cost,
Stock.modifiedCost,
Stock.publicPrice,
Stock.salesPrice,
SUM(Stock.cost) AS stockCost,
SUM(Stock.modifiedCost) AS minimumProfit,
SUM(Stock.publicPrice) AS expectedProfit,
SUM(Stock.salesPrice) AS profit
FROM Stock
INNER JOIN Product ON Stock.idProduct = Product.id
INNER JOIN PurchaseOrder ON Stock.idPurchaseOrder = PurchaseOrder.id
INNER JOIN Batch ON Stock.idBatch = Batch.id
LEFT JOIN (SELECT idPurchaseOrder, idProduct, COUNT(*) AS sold FROM SystemAx.Stock WHERE Stock.status = 'sold' GROUP BY idPurchaseOrder, idProduct) AS Sales ON Stock.idPurchaseOrder = Sales.idPurchaseOrder AND Stock.idProduct = Sales.idProduct
GROUP BY idPurchaseOrder, Stock.idBatch, Stock.idProduct, Product.name, PurchaseOrder.number, PurchaseOrder.purchaseDate, Batch.stockSize, Stock.cost, Stock.modifiedCost, Stock.publicPrice, Stock.salesPrice
ORDER BY PurchaseOrder.purchaseDate DESC, Product.name;
 */
