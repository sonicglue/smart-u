'use strict';
// Módulos de NodeJS
let _ = require('underscore');
let fs = require('fs');
let csv = require('fast-csv');
let path = require('path');
let rands = require('randomstring');

module.exports = function(Batch) {
  // TODO: implementar código del modelo
  /**
   * @name afterCreate
   * @description Middleware posterior a crear/actualizar un registro.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterCreate(ctx, instance, done) {
    console.log('Batch call afterCreate');
    if (ctx.args.data.idPurchaseOrder) {
      updateAmount(ctx, done);
    } else {
      done();
    }
  }// End afterCreate
  /**
   * @name afterDelete
   * @description Middleware posterior a eliminar un registro.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterDelete(ctx, instance, done) {
    console.log('Batch call afterDelete');
    updateAmount(ctx, done);
  }// End afterDelete
  /**
   * @name beforeCreate
   * @description Middleware previo a crear/actualizar un registro.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeCreate(ctx, instance, done) {
    console.log('Batch call beforeCreate');
    if (ctx.args.data.product) {
      let Product = Batch.app.models.Product;
      let product = ctx.args.data.product;
      let filter = {
        where: {
          and: [
            {idBrand: product.idBrand},
            {idProductModel: product.idProductModel},
            {idColor: product.idColor},
            {idProductType: product.idProductType},
            {idProductVariant: product.idProductVariant},
            {idVariantOption: product.idVariantOption}]}};
      // Recuperar Id del producto por si cambiaron los datos en el form.
      Product.findOne(filter, (err, iProduct) => {
        if (err) return done(err);
        // ¿Existe un producto igula?
        if (iProduct) {
          // ...recuperar su id
          ctx.args.data.idProduct = iProduct.id;
          delete ctx.args.data.product;
          validateBatch(ctx, done);
        } else {
          // ...crear uno nuevo
          console.log('Crear como producto nuevo:', product);
          createProduct(ctx, done);
        }
      });
    } else {
      done();
    }
  }// End beforeCreate
  /**
   * @name beforeDelete
   * @description Middleware previo a eliminar un registro.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeDelete(ctx, instance, done) {
    console.log('Batch call beforeDelete');
    let idBatch = ctx.args.id;
    let Stock = Batch.app.models.Stock;
    // Filtro where
    // Stock que coincida con el Id del lote
    let where = {
      idBatch: ctx.args.id};
    Batch.findById(idBatch, (err, iBatch) => {
      if (err) return done(err);
      // Recuperar el id de la orden de compra antes de eliminar el registro
      ctx.args.data = {
        idPurchaseOrder: iBatch.idPurchaseOrder};
      // Buscar stock del lote
      Stock.count(where, (err, stock) => {
        if (err) return done(err);

        if (parseInt(stock)) {
          // ...si tiene stock no eliminar
          return done(Batch.app.newError(422,
            'Error 401: No puede eliminar el lote, tiene' + stock +
            ' IMEIs registrados.',
            `${ctx.args.id}`
          ));
        }
        done();
      });
    });
  }// End beforeDelete
  /**
   * @name createProduct
   * @description Registra un nuevo producto desde el formulario de Batch.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {function} done Función de callback.
   */
  function createProduct(ctx, done) {
    console.log('Batch call createProduct');
    let product = ctx.args.data.product;
    let Color = Batch.app.models.Color;
    let Product = Batch.app.models.Product;
    let ProductModel = Batch.app.models.ProductModel;
    let ProductVariantOption = Batch.app.models.ProductVariantOption;
    product.name = '';

    ProductModel.findById(product.idProductModel, {include: 'brand'},
      (err, iModel) => {
        if (err) return done(err);
        if (iModel) {
          product.name += `${iModel.brand().name} ${iModel.name}, `;
          Color.findById(product.idColor, (err, iColor) => {
            if (err) return done(err);
            if (iColor) {
              product.name += `${iColor.name} `;
              ProductVariantOption.findById(product.idVariantOption,
                (err, iOption) => {
                  if (err) return done(err);
                  product.name += iOption.value;
                  Product.create(product, (err, iProduct) => {
                    if (err) return done(err);
                    if (iProduct) {
                      ctx.args.data.idProduct = iProduct.id;
                      delete ctx.args.data.product;
                      validateBatch(ctx, done);
                    }
                  });
                });
            }
          });
        }
      });
  }// End createProduct
  /**
   * @name observeLoaded
   * @description Obtiene la cantidad de IMEIs registrados en el lote del producto.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {function} done Función de callback.
   */
  function observeLoaded(ctx, done) {
    let iva = 1.16;
    let Stock = Batch.app.models.Stock;
    // Filtro where
    // Stock que coincida con el Id del lote
    let where = {
      idBatch: ctx.data.id};
    // Costo con IVA
    ctx.data.costWithTax =
      parseFloat(((ctx.data.cost - ctx.data.providerSupport) * iva).toFixed(2));
    // Costo modificado
    ctx.data.modifiedCost = parseFloat((ctx.data.costWithTax -
      (ctx.data.brandSupport + ctx.data.additionalSupport)).toFixed(2));
    // Buscar stock del lote
    Stock.count(where, (err, stock) => {
      if (err) return done(err);
      // Devolver la cuenta
      ctx.data.stockCount = parseInt(stock);
      done();
    });
  }// End observeLoaded
  /**
   * @name updateAmount
   * @description Función para actualizar los totales de la orden de compra.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {function} done Función de callback.
   */
  function updateAmount(ctx, done) {
    console.log('Batch call updateAmount');
    let idPurchaseOrder = ctx.args.data.idPurchaseOrder;
    let purchaseOrder = {
      total: 0,
      brandDiscount: 0,
      additionalDiscount: 0};
    let PurchaseOrder = Batch.app.models.PurchaseOrder;
    let Stock = Batch.app.models.Stock;
    let filter = {include: 'batches'};
    PurchaseOrder.findById(idPurchaseOrder, filter, (err, iOrder) => {
      if (err) return done(err);
      _.each(iOrder.batches(), (b) => {
        purchaseOrder.total += b.stockSize * b.costWithTax;
        purchaseOrder.brandDiscount += b.stockSize * b.brandSupport;
        purchaseOrder.additionalDiscount += b.stockSize * b.additionalSupport;
      });
      console.log('Los nuevos valores son: ', purchaseOrder);
      iOrder.updateAttributes(purchaseOrder, (err, result) => {
        if (err) return done(err);

        if (ctx.args.data.id && result) {
          // ...paso por actualización del lote
          let batch = _.find(result.batches(), b => {
            return b.id === ctx.args.data.id;
          });
          let newPrice = {
            cost: parseFloat((batch.costWithTax *
              result.currencyExchange).toFixed(2)),
            modifiedCost: parseFloat((batch.modifiedCost *
              result.currencyExchange).toFixed(2)),
            publicPrice: parseFloat((batch.costWithTax *
              result.currencyExchange).toFixed(2))};
          Stock.updateAll({idBatch: batch.id}, newPrice, done);
        } else {
          // ...paso por creación del lote
          done();
        }
      });
    });
  }// End updateAmount
  /**
   * @name validateBatch
   * @description Valida que un producto no este registrado en un lote.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {function} done Función de callback.
   */
  function validateBatch(ctx, done) {
    console.log('Batch call validateBatch');
    let idBatch = '';
    if (ctx.args.data.id) {
      idBatch = ctx.args.data.id;
    }
    let filter = {
      include: ['product'],
      where: {
        and: [
          {id: {neq: idBatch}},
          {idPurchaseOrder: ctx.args.data.idPurchaseOrder},
          {idProduct: ctx.args.data.idProduct}]}};
    // Prevenir registros duplicados
    Batch.findOne(filter, (err, iBatch) => {
      if (err) return done(err);
      // ¿Existe un registro del producto en la orden de compra?
      if (iBatch) {
        // ...lanzar error
        return done(Batch.app.newError(422,
          `Error 402: El producto '${iBatch.product().name}' ya fué ` +
            'incluido  en la orden de compra.'));
      }
      done();
    });
  }// End validateBatch
  Batch.afterRemote('create', afterCreate);
  Batch.afterRemote('prototype.patchAttributes', afterCreate);
  Batch.afterRemote('deleteById', afterDelete);
  Batch.beforeRemote('create', beforeCreate);
  Batch.beforeRemote('prototype.patchAttributes', beforeCreate);
  Batch.beforeRemote('deleteById', beforeDelete);
  Batch.observe('loaded', observeLoaded);
  // Métodos remotos
  /**
   * @name insertStock
   * @description Insertar una fila como un nuevo registro de Stock.
   * @param {object} row Fila del archivo CSV como objeto.
   * @param {object} options Objeto de parametros adicionales al envío del form.
   * @param {function} done Función de callback.
   */
  Batch.insertStock = (row, extra, done) => {
    let Stock = Batch.app.models.Stock;
    let StockLog = Batch.app.models.StockLog;
    let filter = {
      include: ['product', 'purchaseOrder']};
    let idUser = extra.idUser[0];
    let idWarehouse = extra.idWarehouse[0];
    let idBatch = extra.idBatch[0];

    Batch.findById(idBatch, filter, (err, iBatch) => {
      if (err) return done(err);
      if (iBatch && iBatch.product().serieLength === row[0].length) {
        let newStok = {
          idBatch: iBatch.id,
          idPurchaseOrder: iBatch.idPurchaseOrder,
          idProduct: iBatch.product().id,
          idWarehouse: idWarehouse,
          idUser: idUser,
          IMEI: row[0],
          cost: parseFloat((iBatch.costWithTax *
            iBatch.purchaseOrder().currencyExchange).toFixed(2)),
          modifiedCost: parseFloat((iBatch.modifiedCost *
            iBatch.purchaseOrder().currencyExchange).toFixed(2)),
          publicPrice: parseFloat((iBatch.costWithTax *
            iBatch.purchaseOrder().currencyExchange).toFixed(2)),
          satatus: 'active'};
        Stock.create(newStok, (err, stock) => {
          if (err) {
            console.log('Error: ', err);
            return done(Batch.app.newError(402,
              'El IMEI ' + row[0] + ' ya fue registrado previamente.'));
          }
          let newLog = {
            idStock: stock.id,
            event: 'create',
            description: 'Ingreso del equipo en el sistema.'};
          StockLog.create(newLog, (err, log) => {
            if (err) return done(err);
            done(null, stock);
          });
        });
      } else {
        done(Batch.app.newError(402,
          'El IMEI ' + row[0] + ' no tiene el tamaño esperado.'));
      }
    });
  };// End insertStock
  /**
   * @name processCSV
   * @description Procesa un archivo CSV para insertar IMEIs.
   * @param {file} file Archivo CSV con los IMEI's a registrar.
   * @param {object} extra Objeto con datos adicionales al sotck.
   * @param {function} done Función de callback.
   */
  Batch.processCSV = (file, extra, done) => {
    let processResult = [];
    let count = 1;
    let csvstream = csv.fromPath(file, {headers: false})
      .on('data', function(row) {
        csvstream.pause();
        Batch.insertStock(row, extra, (err, res) => {
          if (err) {
            processResult.push({isError: true, message: err.message});
            csvstream.resume();
            return;
          } else {
            processResult.push(res);
            csvstream.resume();
          }
        });
      })
      .on('end', function(row) {
        done(null, processResult);
      })
      .on('error', function(error) {
        done(Batch.app.newError(402, error));
      });
  };// End processCSV
  /**
   * @name prototype.addFile
   * @description End-point para adjuntar un archivo CSV a la orden de compra.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} options Objeto de parametros adicionales al envío del form.
   * @param {function} done Función de callback.
   */
  Batch.prototype.importFile = function(ctx, options, done) {
    let Container = Batch.app.models.Container;
    if (!options) options = {};
    let container = 'tmp';
    ctx.req.params.container = container;
    // Subir el archivo
    Container.upload(ctx.req, ctx.result, options, (err, fileObj) => {
      if (err) return done(err);
      let route = path.resolve(__dirname +
        `/../../storage/${container}/${fileObj.files.file[0].name}`);
      let originalName = path.basename(route, '.csv');
      let newFilename = path.dirname(route) + '/' +
        rands.generate({length: 10, charset: 'alphanumeric'}) + '.csv';

      fs.renameSync(route, newFilename);

      Batch.processCSV(newFilename, fileObj.fields, (err, results) => {
        fs.unlinkSync(newFilename);
        if (err) return done(err);
        done(null, results);
      });
    });
  };// End prototype.importFile
};
