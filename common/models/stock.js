'use strict';
// Modulos NodeJs adicionales
let _ = require('underscore');
let path = require('path');
let async = require('async');
let moment = require('moment');
moment.locale();
let xl = require('excel4node');
let rands = require('randomstring');

module.exports = function(Stock) {
  /**
   * @name afterCreate
   * @description Registra en el StockLog el evento crear.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterCreate(ctx, instance, done) {
    console.log('Stock call afterCreate');
    let StockLog = Stock.app.models.StockLog;
    let newLog = {
      idStock: instance.id,
      event: 'create',
      description: 'Ingreso del equipo al sistema.'};
    StockLog.create(newLog, done);
  }// End afterCreate
  /**
   * @name afterUpdate
   * @description Registra un evento en el StockLog al actualizar el stock.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterUpdate(ctx, instance, done) {
    console.log('Stock call afterUpdate');
    if (ctx.args.log) {
      let StockLog = Stock.app.models.StockLog;
      let newLog = ctx.args.log;
      newLog.idStock = instance.id;
      StockLog.create(newLog, (err, iStockLog) => {
        if (err) return done(err);
        done();
      });
    } else {
      done();
    }
  }// End afterUpdate
  /**
   * @name beforeUpdate
   * @description Prepara el registro en StockLog al actualizar.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeUpdate(ctx, instance, done) {
    console.log('Stock call beforeUpdate');
    if (ctx.args.data.log &&
    (ctx.args.data.log.event && ctx.args.data.log.description)) {
      // ...se lanza un evento con descripción
      ctx.args.log = {
        event: ctx.args.data.log.event,
        description: ctx.args.data.log.description};
      delete ctx.args.data.log;
    }
    done();
  }// End beforeUpdate
  /**
   * @name createError
   * @description Función para prevenir la duplicidad en los IMEIs.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {function} done Función de callback.
   */
  function createError(ctx, done) {
    console.log('Error on Create');
    if (ctx.error.code === 'ER_DUP_ENTRY') {
      // ...el error es por duplicidad de dato
      let filter = {
        include: ['product'],
        where: {
          IMEI: ctx.args.data.IMEI}};
      Stock.findOne(filter, (err, iStock) => {
        if (err) return done(err);
        // ¿Existe un registro del IMEI en la base de datos?
        if (iStock) {
          // ...lanzar error
          return done(Stock.app.newError(422,
            `El IMEI '${ctx.args.data.IMEI}' está repetido. Se registro ` +
              `previamente a un ${iStock.product().name}`));
        }
      });
    } else {
      console.log(ctx.error);
      return done(Stock.app.newError(422,
        `El IMEI '${ctx.args.data.IMEI}' no se pudo registrar.`));
    }
  }// End createError
  /**
   * @name createSerieReport
   * @description Crea el archivo de Excel con los datos de los productos.
   * @param {object} stocks Objeto con los datos de los stocks.
   * @param {function} cb Función de callback.
   * @deprecated
   */
  function createSerieReport(stocks, done) {
    // TODO: eliminar funcion
  }// End createSerieReport
  // Middlewares
  // Before
  Stock.beforeRemote('prototype.patchAttributes', beforeUpdate);
  // After
  Stock.afterRemote('create', afterCreate);
  Stock.afterRemote('prototype.patchAttributes', afterUpdate);
  Stock.afterRemoteError('create', createError);
  // Métodos remotos
  /**
   * @name setReportSale
   * @description Método para generar el reporte de series masivas.
   * @param {object} data Arreglo con los números de series de los equipos.
   * @param {function} cb Función de callback.
   */
  Stock.setReportSale = function(data, done) {
    console.log('Stock call setReportSale');
    let newError = Stock.app.newError;
    let conn = Stock.dataSource.connector;
    // Validar rango de fechas.
    if (!data.date) {
      return done(newError(500, 'No se incluye el rango de fechas.',
      'No se incluye el rango de fechas.'));
    }
    let tmp = data.date.split(' to ');
    let params = [tmp[0] + ' 00:00:00', tmp[1] + ' 23:59:59'];
/******************************************************************************/
    let sql1 = 'SELECT Warehouse.name AS sellerName, Brand.name AS brandName,' +
      'ProductModel.name AS modelName, Billing.name AS clientName, COUNT(*) A' +
      'S total FROM Stock INNER JOIN Warehouse ON Stock.idWarehouse = Warehou' +
      'se.id INNER JOIN Product ON Stock.idProduct = Product.id INNER JOIN Pr' +
      'oductModel ON Product.idProductModel = ProductModel.id INNER JOIN Bran' +
      'd ON ProductModel.idBrand = Brand.id LEFT JOIN Billing ON Stock.idClie' +
      'nt = Billing.id WHERE Stock.status = \'sold\'';
    if (data.idClient) {
      sql1 += ` AND Stock.idClient = '${data.idClient}'`;
    }
    if (data.idSeller) {
      sql1 += ` AND Stock.idUser = '${data.idSeller}'`;
    }
    if (data.idModel) {
      sql1 += ` AND Product.idProductModel = '${data.idProductModel}'`;
    }
    if (data.idBrand) {
      sql1 += ` AND Product.idBrand = '${data.idBrand}'`;
    }
/******************************************************************************/
    let sql2 = ' AND Stock.saleDate BETWEEN ? AND ? GROUP BY Warehouse.name, ' +
      'Brand.name, ProductModel.name, Billing.name ORDER BY Warehouse.name, B' +
      'rand.name, ProductModel.name, Billing.name;';
    /**
     * @name createExcel
     * @param {object} products Objeto con los datos de las ventas.
     * @param {function} cb Función de callback.
     */
    function createExcel(products, cb) {
      let style = Stock.app;
      let wb = new xl.Workbook({
        defaultFont: {
          size: 11,
          name: 'Calibri'}});
      let ws = wb.addWorksheet('Reporte_de_ventas');
      let titles = ['Vendedor', 'Marca', 'Modelo', 'Cliente', 'Total'];
      let row = 1;
      let col = 1;
      ws.cell(row++, col)
        .string('Reporte de ventas')
        .style(style.excelFormat(14));
      ws.cell(row++, col).date(new Date())
        .style(style.excelFormat(10, 'gF'));
      // Colocar titulos a la hoja
      for (var x = 0; x < titles.length; x++) {
        ws.cell(row, col + x)
          .string(titles[x])
          .style(style.excelFormat(11, 'cbTBLR', '#FFC000'));
      }
      row++;
      // Procesar los datos
      _.each(products, product => {
        col = 1;
        // product = product.toObject();
        // console.log(stock.toObject());
        let fill = '#FFE79B';
        if (row % 2 == 0) {
          fill = '#FFFFFF';
        }
        ws.cell(row, col++)
          .string(product.sellerName)
          .style(style.excelFormat(11, 'gBL', fill));
        ws.cell(row, col++)
          .string(product.brandName)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++)
          .string(product.modelName)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++)
          .string(product.clientName)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row++, col)
          .number(product.total)
          .style(style.excelFormat(11, 'gBR', fill));
      });
      let fileLocation = path.join('./report', 'reporte-de-ventas.xlsx');
      wb.write(fileLocation, cb);
    }// End createExcel
    let sql = sql1 + sql2;
    return conn.query(sql, params, (err, products) => {
      if (err) {
        // console.log(err);
        return done(newError(500,
          'No es posible generar el archivo.',
          'No es posible generar el archivo'));
      }
      createExcel(products, done);
    });
  };// ...End SysUser.setReportSeries
  /**
   * @name setReportSeries
   * @description Recupera los datos de varíos productos de acuerdo a sus números de serie.
   * @param {object} data Objeto con los datos de los números de serie.
   * @param {function} done Función de callback.
   */
  Stock.setReportSeries = function(data, done) {
    console.log('Stock call setReportSeries');
    let wf = [];
    let result = [];
    let newError = Stock.app.newError;
    /**
     * @name createExcel
     * @param {object} stocks Objeto con los datos de los productos.
     * @param {function} cb Función de callback.
     */
    function createExcel(stocks, cb) {
      let style = Stock.app;
      let wb = new xl.Workbook({
        defaultFont: {
          size: 11,
          name: 'Calibri'}});
      let ws = wb.addWorksheet('Reporte_de_series');
      let titles = [
        'Marca', 'Modelo', 'Color', 'IMEI', 'Almacén',
        'Proveedor', 'Cliente', 'Vendedor'];
      let row = 1;
      let col = 1;
      ws.cell(row++, col)
        .string('Reporte de series masivas')
        .style(style.excelFormat(14));
      ws.cell(row++, col).date(new Date())
        .style(style.excelFormat(10, 'gF'));
      // Colocar titulos a la hoja
      for (var x = 0; x < titles.length; x++) {
        ws.cell(row, col + x)
          .string(titles[x])
          .style(style.excelFormat(11, 'cbTBLR', '#FFC000'));
      }
      row++;
      // Procesar los datos
      _.each(stocks, stock => {
        col = 1;
        stock = stock.toObject();
        // console.log(stock.toObject());
        let fill = '#FFE79B';
        if (row % 2 == 0) {
          fill = '#FFFFFF';
        }
        ws.cell(row, col++)
          .string(stock.product.model.brand.name)
          .style(style.excelFormat(11, 'gBL', fill));
        ws.cell(row, col++)
          .string(stock.product.model.name)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++)
          .string(stock.product.color.name)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++)
          .string(stock.IMEI)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++)
          .string(stock.warehouse.name)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++)
          .string(stock.purchaseOrder.provider.name)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++)
          .string(stock.client ? stock.client.name : '')
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row++, col)
          .string(stock.confirmSale ? stock.warehouse.name : '')
          .style(style.excelFormat(11, 'gBR', fill));
      });
      let fileLocation = path.join('./report', 'reporte-de-series.xlsx');
      wb.write(fileLocation, cb);
    }// End createExcel
    if (!data.imeis || data.imeis.length < 1) {
      // ...si no se incluyeron los números de serie
      return done(newError(404, 'Sin IMEIs',
        'Solicitud sin números de serie.'));
    }
    _.each(data.imeis, imei => {
      wf.push(next => {
        Stock.findByImei(imei, (err, stock) => {
          if (err) return next(err);
          result.push(stock);
          next();
        });
      });
    });
    async.waterfall(wf, err => {
      if (err) return done(err);
      createExcel(result, done);
    });
  };// End setReportSeries
  /**
   * @name setReportRoutes
   * @description Recupera los datos de las rutas y su stock.
   * @param {object} data Objeto con los datos de las rutas.
   * @param {function} done Función de callback.
   */
  Stock.setReportRoutes = function(data, done) {
    console.log('Stock call setReportRoutes');
    let wf = [];
    let newError = Stock.app.newError;
    let cc = Stock.app.commonCallback;
    let SysUser = Stock.app.models.SysUser;

    let sellerFilter = {
      include: {
        relation: 'warehouseACL', scope: {
          include: {
            relation: 'warehouse', scope: {
              include: {
                relation: 'stocks', scope: {
                  include: 'product',
                  where: {
                    and: [
                      {status: 'assigned'},
                      {validate: false}]}}}}},
          limit: 1,
          order: 'index'}}};
    let result = {
      sellers: [],
      models: []};
    // Funciones generales
    /**
     * @name createExcel
     * @description Función para crear el reporte de rutas.
     * @param {object} data Objeto con los datos de las ordenes de compra.
     * @param {object} res Objeto de respuesta (res).
     */
    function createExcel(data, cb) {
      // console.log("Datos recibidos desde la función--->createExcel", data);
      let style = SysUser.app;
      let wb = new xl.Workbook({
        defaultFont: {
          size: 11,
          name: 'Calibri'}});
      let ws = wb.addWorksheet('Formato_Rutas');
      let titles = ['No', 'Modelo'];
      _.each(data.sellers, seller => {
        titles.push(seller.name + ' ' + seller.lastName);
      });
      titles.push('Total');

      let row = 1;
      let col = 1;
      ws.cell(row++, col)
        .string('Reporte Rutas')
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
      _.each(data.models, model => {
        let amount = 0;
        let fill = '#FFE79B';
        if (row % 2 == 0) {
          fill = '#FFFFFF';
        }
        col = 1;
        ws.cell(row, col++).number(count++)
          .style(style.excelFormat(11, 'gBL', fill));
        ws.cell(row, col++).string(model.name)
          .style(style.excelFormat(11, 'cB', fill));
        _.each(model.stocks, item => {
          amount += item;
          ws.cell(row, col++).number(item)
            .style(style.excelFormat(11, 'cB', fill));
        });
        ws.cell(row, col++).number(amount)
        .style(style.excelFormat(11, 'cB', fill));
        row++;
      });
      // console.log('Generando archivo de Excel: Reporte');
      var fileLocation = path.join('./report', 'reporte-de-rutas.xlsx');
      wb.write(fileLocation, cb);
    };// End createExcel
    /**
     * @name processStocks
     * @description Procesa los datos del stock del vendedor.
     * @param {object} seller Datos del vendedor y su stock.
     * @param {fuction} cb Función de callback.
     */
    function processStocks(seller, cb) {
      // return console.log(seller);
      let idx = result.sellers.length;
      let sellerStocks = seller.warehouseACL[0].warehouse.stocks;
      result.sellers[idx] = _.pick(seller, 'id', 'name', 'lastName');
      _.each(sellerStocks, stock => {
        let find = _.find(result.models, (m) => {
          return m.idProductModel === stock.product.idProductModel;
        });
        if (find) {
          // ...ya está registrado el modelo
          if (!find.stocks[idx]) find.stocks[idx] = 0;
          find.stocks[idx]++;
        } else {
          // ...debe registrarse por primera vez el modelo
          let model = _.pick(stock.product, 'idProductModel', 'name');
          let tmp = model.name.split(',');
          model.name = tmp[0];
          model.stocks = [];
          model.stocks[idx] = 1;
          result.models.push(model);
        }
      });
      cb();
    }// End processStocks
    // Código principal
    if (!data.sellers || data.sellers.length < 1) {
      // ...no se incluyo los ID de los vendedores
      return done(newError(400, 'Sin vendedores',
        'No se incluyó identificadores para los vendedores'));
    }
    // Recorrer los id de los vendedores
    _.each(data.sellers, sellerId => {
      wf.push(next => {
        SysUser.findById(sellerId, sellerFilter, (err, iSeller) => {
          if (err) return next(err);
          if (!iSeller) {
            // ...no existe el vendedor
            return next(newError(404, 'No se encontró el vendedor.',
              'No se encontró el vendedor.'));
          }
          processStocks(iSeller.toObject(), cc(next));
        });
      });
    });
    async.waterfall(wf, err => {
      if (err) return done(err);
      // Evitar pasar null
      _.each(result.models, model => {
        for (let x = 0; x < result.sellers.length; x++) {
          if (!model.stocks[x]) model.stocks[x] = 0;
        }
      });
      // result.sellers = _.sortBy(result.sellers, 'name');
      result.models = _.sortBy(result.models, 'name');
      if (result.models.length === 0) {
        return done(newError(400, 'Sin productos',
          'No hay equipos para generar el reporte de cambaceo'));
      } else {
        createExcel(result, done);
      }
    });
  };// End setReportRoutes
  /**
   * @name findByImei
   * @description Recupera los datos de un producto desde su número de serie
   * (IMEI)
   * @param {string} imei Número de serie/IMEI del producto.
   * @param {function} done Función de callback.
   */
  Stock.findByImei = function(imei, done) {
    console.log('Stock call findByImei');
    let newError = Stock.app.newError;
    let filter = {
      include: [
        'client',
        'warehouse',
        {relation: 'product', scope: {
          include: [
            'color',
            {relation: 'model', scope: {
              include: 'brand'}}]}},
        {relation: 'logs', scope: {
          order: ['date']}},
        {relation: 'purchaseOrder', scope: {
          include: ['provider']}}],
      where: {IMEI: imei}};
    Stock.find(filter, (err, stocks) => {
      if (err) return done(err);
      if (!stocks || stocks.length === 0) {
        // ...resultado vacío
        return done(newError(404,
          `El IMEI '${imei}' no se encuentra en la base de datos.`,
          `El IMEI '${imei}' no se encuentra en la base de datos.`));
      } else {
        // ...regresar la primer coincidencia
        done(null, stocks[0]);
      }
    });
  };// End findByImei
  /**
   * @name getAssignment
   * @description Recupera la asignación del stock en una fecha indicada.
   * @param {string} warehouseId Identificador del almacén.
   * @param {date} date Fecha de búsqueda.
   * @param {function} done Función de callback.
   */
  Stock.getAssignment = function(warehouseId, date, done) {
    console.log('Stok calls getAssignment');
    let Warehouse = Stock.app.models.Warehouse;
    let end = date.toISOString().substr(0, 10) + ' 23:59:59';
    let start = date.toISOString().substr(0, 10) + ' 00:00:00';
    let wf = [];
    let filter = {
      include: {
        relation: 'stocks', scope: {
          include: [{
            relation: 'product', scope: {
              include: {
                relation: 'model', scope: {
                  include: 'brand'}}}},
          {relation: 'logs', scope: {
            where: {
              and: [{event: 'assigned'},
                  {date: {gte: start}},
                  {date: {lte: end}}]}}}]}}};
    Warehouse.findById(warehouseId, filter, (err, iWarehouse) => {
      if (err) return done(err);
      if (!iWarehouse) {
        // ...el identificador invalido
        return done(Stock.app.newError(404,
          'No se encontró el almacén solicitado.'));
      }
      let warehouse = iWarehouse.toObject();
      wf.push((next) => {
        for (let x = warehouse.stocks.length - 1; x >= 0; x--) {
          if (!warehouse.stocks[x].logs.length) {
            warehouse.stocks.splice(x, 1);
          }
        }
        return next(warehouse);
      });
      async.waterfall(wf, err => {
        done(null, warehouse);
      });
    });
  };// End getAssignment
  /**
   * @name setScanByImei
   * @description Marca un producto como escaneado.
   * @param {object} data Datos del producto para marcar como escaneado.
   * @param {function} done Función de callback.
   */
  Stock.setScanByImei = function(data, done) {
    let newError = Stock.app.newError;
    if (!data.IMEI) {
      // ...sin IMEI
      return done(newError(400, 'No se incluyó el IMEI del producto.'));
    }
    if (!data.idWarehouse) {
      // ...sin  identificador del almacén
      return done(newError(400, 'No se incluyó el ID del almacén.'));
    }
    let filter = {
      where: {
        and: [
          {idWarehouse: data.idWarehouse},
          {IMEI: data.IMEI}]}};
    Stock.findOne(filter, (err, iStock) => {
      if (err) return done(err);
      if (!iStock) {
        // ...no se encontro el registro
        return done(newError(404,
          `No se encontró el IMEI '${data.IMEI}' en el almacén.`));
      } else if (iStock.scanByAvailable) {
        // ...el producto ya fue escaneado
        return done(newError(404, 'El producto ya se encuentra escaneado.'));
      } else {
        // ...marcar como escaneado
        iStock.updateAttributes({scanByAvailable: true}, done);
      }
    });
  };// End setSoldByImei
  /**
   * @name multipleAssignmentClient
   * @description Asigna un cliente a varios stocks
   * @param {object} data objeto con todos los datos
   * @param {function} cb Función de callback.
   */
  Stock.multipleAssignmentClient = (data, done) => {
    // console.log("Datos recibidos desde el server", data);

    let cc = Stock.app.commonCallback;
    let Billing = Stock.app.models.Billing;
    let Seller = Stock.app.models.SysUser;

    let wf = [];
    if (typeof data !== 'object') {
      return done(Stock.app.newError(422,
        'Tipo de dato invalido, se esperaba un objeto.'));
    }
    if (!data.items || data.items.length <= 0) {
      return done(Stock.app.newError(422,
        'Arreglo vacío, sin datos del stock.'));
    }

    Billing.findById(data.idClient, (err, iClient) => {
      if (err) return done(Stock.app.newError(422,
          'Identificador de cliente inválido.'));
      _.each(data.items, stock => {
        wf.push(next => {
          Stock.findById(stock.id, (err, iStock) => {
            if (err) return next(Stock.app.newError(422,
              'Identificador del stock inválido.'));
            if (iStock) {
              iStock.updateAttributes({idClient: data.idClient}, cc(next));
            } else {
              next();
            }
          });
        });
      });
      async.waterfall(wf, done);
    });
  };// End multipleAssignmentClient

  /**
   * @name setMultipleSale
   * @description Registra las ventas realizadas por un vendedor
   * @param {object} data objeto con todos ID del stock
   * @param {function} cb Función de callback.
   */
  Stock.setMultipleSale = (data,cb) => {
    //console.log("Datos recibidos desde el server para el registro de la venta", data);
    let cc = Stock.app.commonCallback;
    let Billing = Stock.app.models.Billing;
    let Seller = Stock.app.models.SysUser;
    let StockLog = Stock.app.models.StockLog;
    let AccessToken = Stock.app.models.AccessToken;
    let SysUser = Stock.app.models.SysUser;

    let wf = [];
    if (typeof data !== 'object') {
      return done(Stock.app.newError(422,
        'Tipo de dato invalido, se esperaba un objeto.'));
    }
    if (!data.items || data.items.length <= 0) {
      return done(Stock.app.newError(422,
        'Arreglo vacío, sin datos del stock.'));
    }

    _.each(data.items, stock => {
        wf.push(next => {
          Stock.findById(stock.id, (err, iStock) => {
            if (err) return next(Stock.app.newError(422, 'Identificador del stock inválido.'));
            //console.log("Respuesta de la consulta Stock.findById", iStock);
            if (iStock) {
              let stockStatus = {
                idUser: data.idUser,
                status: (iStock.scanByAvailable === true)? 'assigned' : 'sold',
                idClient: (iStock.scanByAvailable === true)? " " : stock.idClient,
                saleDate: (iStock.scanByAvailable === true)? null : moment().format(),
                validate: (iStock.scanByAvailable === true)? "false" : "true",
                scanByAvailable: (iStock.scanByAvailable === true)? "false" : "false"
              };

              iStock.updateAttributes(stockStatus, (err, s) => {
                if (err) return next(err);

                if (iStock.scanByAvailable === false) {
                  let newLog = {
                    idStock: iStock.id,
                    date: moment().format(),
                    event: 'sold',
                    description: "Venta del equipo"
                  }
                  StockLog.create(newLog, cc(next));
              }else {
                next();
              }
              });
            } else {
              next();
            }
          });
        });
      });
      async.waterfall(wf, cb);
  }; //End setMultipleSale

  /**
   * @name registerSale
   * @description Registrar una venta realizada por el vendedor
   * @param {object} data objeto con todos ID del stock
   * @param {function} cb Función de callback.
   */
  Stock.registerSale = (data,cb) => {
    console.log("Datos recibidos desde el server para el registro de la venta por el vendedor", data);

    let cc = Stock.app.commonCallback;
    let Billing = Stock.app.models.Billing;
    let Seller = Stock.app.models.SysUser;
    let StockLog = Stock.app.models.StockLog;
    let Payment = Stock.app.models.registerSale;
    let Order = Stock.app.models.Order;
    let OrderHasProduct = Stock.app.models.OrderHasProduct;
    let Product = Stock.app.models.Product;


    let wf = [];
    let wf2 = [];

    if (typeof data !== 'object') {
      return done(Stock.app.newError(422,
        'Tipo de dato invalido, se esperaba un objeto.'));
    }
    if (!data.items || data.items.length <= 0) {
      return done(Stock.app.newError(422,
        'Arreglo vacío, sin datos del stock.'));
    }

    //Generar el número de orden para la venta
    Stock.generateOrderNumber((err, newOrderNumber) => {
      if (err) return cb(err);
      console.log("Número de orden de venta", newOrderNumber);
      //cb(null, newOrderNumber); //Probando a enviar el número de orden

      let newOrder = {
        idSeller: data.idSeller,
        idClient: data.idClient,
        orderNumber: newOrderNumber,
        created: moment().format(),
        totalItems: data.totalItems,
        subtotal: data.subTotal,
        discount: 0,
        total: data.total,
        credit: (data.paymentMethod === 'credit')?  data.total : 0,
        cash: (data.paymentMethod === 'cash')? data.total : 0,
        status: (data.paymentMethod === 'credit')? 'pendiente' : 'pagado',
        clientNotes: 'ninguna'
      }

      //Crear la orden de venta
      Order.create( newOrder, function(err, iOrder) {
        if (err) return cb(err);
        console.log("Orden registrada correctamente!!!", iOrder);
        //cb(null, iOrder); Probando enviar la orden creada

        _.each(data.items, product => {
          wf.push( next => {
            Product.findById(product.idProduct, (err, iProduct) => {
              if (err) return next(Stock.app.newError(422, 'Identificador del producto inválido.'));
              console.log("Respuesta de la consulta Product.findById", iProduct);

              var newOrderHasProduct = {
                idOrder: iOrder.id,
                idProduct: iProduct.id,
                totalItems: product.totalItems,
                subtotal: product.subTotal,
                discount: iOrder.discount,
                total: product.total
              };

              //Crear cada item de la orden
              OrderHasProduct.create( newOrderHasProduct, function(err, iOrderHasProduct) {
                if (err) return next(Stock.app.newError(422, 'No se pudo crear el item del producto.'));
                console.log("iOrderHasProduct", iOrderHasProduct);

                _.each(product.stock, itemStock => {
                  console.log("Item stock", itemStock);
                  wf2.push( next2 => {
                    Stock.findById(itemStock.idStock, (err, iStock) => {
                      if (err) return next2(Stock.app.newError(422, 'Identificador del stock inválido.'));
                      console.log("Respuesta de la consulta Stock.findById", iStock);

                      let stockStatus = {
                        idClient: data.idClient,
                        salesPrice: product.salesPrice,
                        idOrderHasProduct: iOrderHasProduct.id,
                        confirmSale: true
                      }

                      let newLog = {
                        idStock: iStock.id,
                        date: moment().format(),
                        event: 'sold',
                        description: "Venta del equipo"
                      }

                      console.log("Datos para actualizar el stock", stockStatus);
                      iStock.updateAttributes(stockStatus, cc(next2));
                      /*StockLog.create(newLog, (err,newStockLog) => {
                        if (err) return cb(err);
                        console.log("StockLog creada correctamente !!!", newStockLog);
                        iStock.updateAttributes(stockStatus, cc(next2));
                      });*/

                    }
                  );//End Stock.findById
                  }); //End wf2.push
                });//End each
              });//End create OrderHasProduct

              next();

            });
          });
        });

        async.waterfall(wf, err => {
          if (err) return cb(err);

          async.waterfall(wf2,cb);
        });

      });//End Order.create
    });//End Stock.generateOrderNumber
  }; //End registerSale



  Stock.generateOrderNumber = function(cb) {
    let Order = Stock.app.models.Order;

    let newOrderNumber = moment().format("YYMMDD")+rands.generate( { length:6, charset: "numeric" } );
    Order.findOne( { where: { orderNumber: newOrderNumber } }, (err,iOrder) => {
      if (err) return cb(err);

      if (iOrder) {
        return Cart.generateOrderNumber(cb);
      }
      cb(null,newOrderNumber);
    });
  };



  Stock.pay = (data,options,cb) => {
    console.log("Datos recibidos desde la app para realizar el pago", data);

    let cc = Stock.app.commonCallback;
    let Billing = Stock.app.models.Billing;
    let Seller = Stock.app.models.SysUser;
    let StockLog = Stock.app.models.StockLog;
    let Payment = Stock.app.models.Payment;
    let Order = Stock.app.models.Order;
    let OrderHasProduct = Stock.app.models.OrderHasProduct;
    let Product = Stock.app.models.Product;


    /*if (!data.key || data.key !== "f4k3") {
      return next(Stock.app.newError(422, 'Datos inválidos, operación cancelada.'));
    }*/

    let wf = [];
    let wf2 = [];

    //Generar el número de orden para la venta
    Stock.generateOrderNumber((err, newOrderNumber) => {
      if (err) return cb(err);
      console.log("Número de orden de venta", newOrderNumber);
      //cb(null, newOrderNumber); //Probando a enviar el número de orden

      let newOrder = {
        idSeller: data.idSeller,
        idClient: data.idClient,
        orderNumber: newOrderNumber,
        created: moment().format(),
        totalItems: data.totalItems,
        subtotal: data.subTotal,
        discount: 0,
        total: data.total,
        credit: (data.methodPayment === 'CRÉDITO')?  data.total : 0,
        cash: (data.methodPayment === 'EFECTIVO')? data.total : 0,
        status: (data.methodPayment === 'CRÉDITO')? 'pendiente' : 'pagado',
        clientNotes: 'ninguna'
      }

      //Crear la orden de venta
      Order.create( newOrder, function(err, iOrder) {
        if (err) return cb(err);
        console.log("Orden registrada correctamente!!!", iOrder);
        //cb(null, iOrder); Probando enviar la orden creada
        //cb(null, iOrder);

        _.each(data.items, product => {
          wf.push( next => {
            Product.findById(product.idProduct, (err, iProduct) => {
              if (err) return next(Stock.app.newError(422, 'Identificador del producto inválido.'));
              console.log("Respuesta de la consulta Product.findById", iProduct);

              //cb(null, iProduct);

              var newOrderHasProduct = {
                idOrder: iOrder.id,
                idProduct: iProduct.id,
                totalItems: product.totalItems,
                subtotal: product.subTotal,
                discount: iOrder.discount,
                total: product.total
              };

              //Crear cada item de la orden
              OrderHasProduct.create( newOrderHasProduct, function(err, iOrderHasProduct) {
                if (err) return next(Stock.app.newError(422, 'No se pudo crear el item del producto.'));
                console.log("iOrderHasProduct", iOrderHasProduct);

                cb(null, iOrderHasProduct);

                _.each(product.imeis, itemStock => {
                  console.log("Item stock", itemStock);
                  wf2.push( next2 => {
                    Stock.findById(itemStock.idStock, (err, iStock) => {
                      if (err) return next2(Stock.app.newError(422, 'Identificador del stock inválido.'));
                      console.log("Respuesta de la consulta Stock.findById", iStock);

                      let stockStatus = {
                        idClient: data.idClient,
                        salesPrice: product.price,
                        idOrderHasProduct: iOrderHasProduct.id,
                        confirmSale: true
                      }

                      let newLog = {
                        idStock: iStock.id,
                        date: moment().format(),
                        event: 'sold',
                        description: "Venta del equipo"
                      }

                      console.log("Datos para actualizar el stock", stockStatus);
                      iStock.updateAttributes(stockStatus, cc(next2));
                      /*StockLog.create(newLog, (err,newStockLog) => {
                        if (err) return cb(err);
                        console.log("StockLog creada correctamente !!!", newStockLog);
                        iStock.updateAttributes(stockStatus, cc(next2));
                      });*/

                    }
                  );//End Stock.findById
                  }); //End wf2.push
                });//End each
              });//End create OrderHasProduct

              next();

            });
          });
        });

        async.waterfall(wf, err => {
          if (err) return cb(err);

          async.waterfall(wf2,cb);
        });

      });//End Order.create
    });//End Stock.generateOrderNumber
  }
};
/******************************************************************************/
