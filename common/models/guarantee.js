'use strict';
// Modulos de NodeJs
let _ = require('underscore');
let xl = require('excel4node');
let async = require('async');
let moment = require('moment');
let path = require('path');

module.exports = function(Guarantee) {
  /**
   * @name afterCreate
   * @description Función para registrar un evento en el log posterior al
   * registro de la garantía.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterCreate(ctx, instance, done) {
    console.log('Guarantee call afterCreate');
    let wf = [];
    let cc = Guarantee.app.commonCallback;
    let GuaranteeHasAccessory = Guarantee.app.models.GuaranteeHasAccessory;
    let GuaranteeHasFailure = Guarantee.app.models.GuaranteeHasFailure;
    let GuaranteeLog = Guarantee.app.models.GuaranteeLog;
    // Registrar los accesorios
    if (ctx.args.accessories) {
      _.each(ctx.args.accessories, accessory => {
        let newGHA = {
          idGuarantee: instance.id,
          idProduct: ctx.args.idProduct,
          idAccessory: accessory.id};
        wf.push(next => {
          GuaranteeHasAccessory.create(newGHA, cc(next));
        });
      });
    }
    // Registrar las fallas
    if (ctx.args.failures) {
      _.each(ctx.args.failures, failure => {
        let newGHF = {
          idGuarantee: instance.id,
          idProduct: ctx.args.idProduct,
          idFailure: failure.id};
        wf.push(next => {
          GuaranteeHasFailure.create(newGHF, cc(next));
        });
      });
    }
    // Registrar el log
    let newLog = {
      idGuarantee: instance.id,
      event: 'create',
      description: 'Registro de garantía.'};
    if (instance.status === 'check-in') {
      newLog.event = 'check-in';
    }
    if (ctx.args.description) {
      newLog.description = ctx.args.description;
    }
    wf.push(next => {
      GuaranteeLog.create(newLog, cc(next));
    });
    async.waterfall(wf, done);
  }// End afterCreate
  /**
   * @name afterUpdate
   * @description Función para registrar un evento en el log posterior a la
   * actualización de la garantía.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterUpdate(ctx, instance, done) {
    console.log('Guarantee call afterUpdate');
    let wf = [];
    let cc = Guarantee.app.commonCallback;
    let GuaranteeHasAccessory = Guarantee.app.models.GuaranteeHasAccessory;
    let GuaranteeHasFailure = Guarantee.app.models.GuaranteeHasFailure;
    let GuaranteeLog = Guarantee.app.models.GuaranteeLog;
    let filter = {
      where: {
        idGuarantee: instance.id}};
    // Registrar los accesorios
    if (ctx.args.accessories) {
      GuaranteeHasAccessory.find(filter, (err, accessories) => {
        if (err) return done(err);
        if (accessories) {
          // ...tiene accesorios
          _.each(accessories, accessory => {
            wf.push(next => {
              accessory.destroy(cc(next));
            });
          });
        }
        _.each(ctx.args.accessories, accessory => {
          let newGHA = {
            idGuarantee: instance.id,
            idProduct: ctx.args.idProduct,
            idAccessory: accessory.idAccessory ? accessory.idAccessory : accessory.id};
          wf.push(next => {
            GuaranteeHasAccessory.create(newGHA, cc(next));
          });
        });
      });
    }
    // Registrar las fallas
    if (ctx.args.failures) {
      GuaranteeHasFailure.find(filter, (err, failures) => {
        if (err) return done(err);
        if (failures) {
          // ...tiene fallas
          _.each(failures, failure => {
            wf.push(next => {
              failure.destroy(cc(next));
            });
          });
        }
        _.each(ctx.args.failures, failure => {
          let newGHF = {
            idGuarantee: instance.id,
            idProduct: ctx.args.idProduct,
            idFailure: failure.idFailure ? failure.idFailure :  failure.id};
          wf.push(next => {
            GuaranteeHasFailure.create(newGHF, cc(next));
          });
        });
      });
    }
    // Registrar el log
    let newLog = {
      idGuarantee: instance.id,
      event: instance.status};
    switch (instance.status) {
      case 'check-in':
        newLog.description = 'Recepción de la garntía.';
        break;
      case 'entry':
        newLog.description = 'Ingreso al Almacén Central.';
        break;
      case 'departure':
        newLog.description = 'Salida con el proveedor.';
        break;
      case 'refurb':
        newLog.description = 'Marcado como reacondicionado.';
        break;
      case 're-entry':
        newLog.description = 'Reingreso a Almacén Central.';
        break;
      case 're-assignment':
        newLog.description = 'Reasignación de la garantía.';
        break;
      case 'refund':
        newLog.description = 'Devolución al cliente.';
        break;
      case 'canceled':
        newLog.description = 'Cancelación de la garantía';
        break;
    }
    if (ctx.args.description) {
      newLog.description = ctx.args.description;
    }
    wf.push(next => {
      GuaranteeLog.create(newLog, cc(next));
    });
    async.waterfall(wf, done);
  }// End afterUpdate
  /**
   * @name beforeCreate
   * @description Función para registrar un evento en el log posterior al
   * registro de la garantía.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeCreate(ctx, instance, done) {
    console.log('Guarantee call beforeCreate');
    ctx.args.accessories = ctx.args.data.accessories;
    delete ctx.args.data.accessories;
    ctx.args.failures = ctx.args.data.failures;
    delete ctx.args.data.failures;
    ctx.args.idProduct = ctx.args.data.idProduct;
    delete ctx.args.data.idProduct;
    if (ctx.args.data.description) {
      ctx.args.description = ctx.args.data.description;
      delete ctx.args.data.description;
    }
    Guarantee.makeGuideNumber((err, number) => {
      if (err) return done(err);
      ctx.args.data.guideNumber = number;
      done();
    });
  }// End beforeCreate
  /**
   * @name beforeUpdate
   * @description Función para
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeUpdate(ctx, instance, done) {
    console.log('Guarantee call beforeUpdate');
    if (ctx.args.data.logs) {
      delete ctx.args.data.logs;
    }
    if (ctx.args.data.accessories) {
      ctx.args.accessories = ctx.args.data.accessories;
      delete ctx.args.data.accessories;
    }
    if (ctx.args.data.failures) {
      ctx.args.failures = ctx.args.data.failures;
      delete ctx.args.data.failures;
    }
    if (ctx.args.data.idProduct) {
      ctx.args.idProduct = ctx.args.data.idProduct;
      delete ctx.args.data.idProduct;
    }
    if (ctx.args.data.description) {
      ctx.args.description = ctx.args.data.description;
      delete ctx.args.data.description;
    }
    ctx.args.data.updated = new Date();
    done();
  }// End beforeUpdate
  // Middlewares
  Guarantee.afterRemote('create', afterCreate);
  Guarantee.afterRemote('prototype.patchAttributes', afterUpdate);
  Guarantee.beforeRemote('create', beforeCreate);
  Guarantee.beforeRemote('prototype.patchAttributes', beforeUpdate);
  // Metodos remotos
  /**
   * @name makeGuideNumber
   * @description Genera el número de ticket de la garantía.
   * @param {function} done Función de callaback.
   */
  Guarantee.makeGuideNumber = function(done) {
    console.log('Guarantee call makeGuideNumber');
    let today = moment().format('YYYYMMDD');
    let guaranteeFilter = {
      where: {guideNumber: {like: today + '%'}},
      order: ['guideNumber DESC']};
    Guarantee.findOne(guaranteeFilter, (err, iGuarantee) => {
      if (err) return done(err);
      let num = 1;
      let tmp = '00';
      if (iGuarantee) {
        num = iGuarantee.guideNumber.substr(-3);
        num = parseInt(num) + 1;
      }
      tmp += num;
      done(null, today + tmp.substr(-3));
    });
  };// End makeGuideNumber
  /**
   * @name tracing
   * @description Recupera los datos para generar el gráfico de avance en garantías.
   * @param {string} warehouseId Identificador del almacén actual.
   * @param {boolean} isMain Bandera para identificar si se recupera la información total o la referente a un almacén en particular.
   * @param {date} date Fecha de referencia para la busqueda de datos.
   * @param {function} done Función de callback.
   */
  Guarantee.tracing = function(warehouseId, isMain, date, done) {
    console.log('Guarantee call tracing');
    let conn = Guarantee.dataSource.connector;
    if (!date) {
      date = moment();
    }
    let start = moment(date).day();
    let end = 6 - start;
    let init = 0 - start;
    let date1 = moment(date).add(end, 'days').toObject();
    let date2 = moment(date).add(init, 'days').toObject();
    let params = [date1.years + '-' + (date1.months + 1) + '-' + date1.date +
      ' 23:59:59', date2.years + '-' + (date2.months + 1) + '-' + date2.date +
      ' 00:00:00'];
    let sql = 'SELECT SUBSTRING(date, 1, 10) AS eventDate, event, COUNT(event' +
      ') AS total FROM GuaranteeLog WHERE date <= ? AND date >= ? GROUP BY ev' +
      'entDate, event ORDER BY eventDate, event;';
    if (warehouseId && !isMain) {
      params.unshift(warehouseId);
      sql = 'SELECT eventDate, table3.event, COUNT(table3.event) AS total FRO' +
        'M (SELECT * FROM Warehouse WHERE id = ?) AS table1 INNER JOIN (SELEC' +
        'T * FROM Warehouse) AS table2 ON table1.id = table2.idParent LEFT JO' +
        'IN (SELECT * FROM Guarantee LEFT JOIN (SELECT GuaranteeLog.idGuarant' +
        'ee, SUBSTRING(GuaranteeLog.date, 1, 10) AS eventDate, GuaranteeLog.e' +
        'vent FROM GuaranteeLog WHERE date <= ? AND date >= ?) AS Logs ON Gua' +
        'rantee.id = Logs.idGuarantee) AS table3 ON table2.id = table3.idWare' +
        'house GROUP BY eventDate, table3.event ORDER BY eventDate, table3.ev' +
        'ent;';
    }
    return conn.query(sql, params, (err, guaranties) => {
      if (err) return done(err);
      done(null, guaranties);
    });
  };// End tracing
  /**
   * @name makeReport
   * @description Genera el archivo de Excel para el reporte de garantías.
   * @param {object} data Objeto con los filtros de busqueda.
   * @param {funciton} done Función de callback.
   */
  Guarantee.makeReport = function(data, done) {
    console.log('Guarantee call makeReport');
    let newError = Guarantee.app.newError;
    let today = moment().format('YYYY-MM-DD');
    let start = `${today} 00:00:00`;
    let finish = `${today} 23:59:59`;
    let filter = {
      include: ['client', 'warehouse', 'logs',
        {relation: 'stock', scope: {
          include: [
            {relation: 'purchaseOrder', scope: {
              include: 'provider'}}]}},
        {relation: 'accessories', scope: {
          include: 'accessory'}},
        {relation: 'failures', scope: {
          include: [
            'failure',
            {relation: 'product', scope: {
              include: ['color',
                {relation: 'model', scope: {
                  include: 'brand'}}]}}]}},
        {relation: 'logs', scope: {
          order: ['date']}}],
      where: {
        and: [
          {status: {neq: 'all'}},
          {created: {between: [start, finish]}}]},
      order: ['guideNumber']};
    if (data.status) {
      // ...si cambiaron el status
      filter.where.and[0].status = data.status;
      // filter.include[5].scope.where.event = data.status;
    }
    if (data.date) {
      // ...si se envio la fecha
      let tmp = data.date.split(' to ');
      filter.where.and[1].created = {
        between: [`${tmp[0]} 00:00:00`, `${tmp[1]} 23:59:59`]};
    }
    if (data.idSeller) {
      // ...si se envío el vendedor
      filter.where.and.push({idSeller: data.idSeller});
    }
    if (data.idClient) {
      // ...si se envío el cliente
      filter.where.and.push({idClient: data.idClient});
    }
    let idProvider = !data.idProvider ? null : data.idProvider;
    // Funciones generales
    /**
     * @name createExcel
     * @param {object} guarantees Objeto con los datos de las garantías.
     * @param {string} idProvider Identificador del proveedor.
     * @param {function} cb Función de callback.
     */
    function createExcel(guarantees, idProvider, cb) {
      let style = Guarantee.app;
      let wb = new xl.Workbook({
        defaultFont: {
          size: 11,
          name: 'Calibri'}});
      let ws = wb.addWorksheet('Reporte_de_garantias');
      let titles = ['No', 'Folio', 'IMEI', 'Marca', 'Modelo', 'Color',
        'Proveedor', 'Almacen', 'Diagnostico(Falla)', 'Ingreso garantía',
        'Fecha de compra', 'Fecha de venta', 'Dias de venta', 'Accesorios',
        'Descripcion', 'Estatus'];
      // 'Tienda', 'Contacto', 'Direccion', 'Telefono', 'Email'];
      let row = 1;
      let col = 1;
      ws.cell(row++, col)
        .string('Reporte de garantías')
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
      _.each(guarantees, (guarantee, idx) => {
        // console.log(guarantee);
        col = 1;
        if (idProvider !== null &&
        guarantee.stock.purchaseOrder.provider.id !== idProvider) {
          // ...evitar continuar
          return;
        }
        guarantee = guarantee.toObject();
        let product = {
          model: {
            name: 'no se encontró',
            brand: {
              name: 'no se encontró.'}},
          color: {
            name: 'no se encontró.'}};
        if (guarantee.failures.length) {
          product = guarantee.failures[0].product;
        }
        let fill = '#FFE79B';
        if (row % 2 == 0) {
          fill = '#FFFFFF';
        }
        ws.cell(row, col++)
          .number(++idx) // Número
          .style(style.excelFormat(11, 'gBL', fill));
        ws.cell(row, col++) // ticket
          .string(guarantee.guideNumber)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // IMEI
          .string(!guarantee.idStock ? '' : guarantee.stock.IMEI)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Marca
          .string(product.model.brand.name)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Modelo
          .string(product.model.name)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Color
          .string(product.color.name)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Proveedor
          .string(guarantee.idStock && guarantee.stock.purchaseOrder ?
            guarantee.stock.purchaseOrder.provider.name : '')
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Almacén
          .string(guarantee.warehouse.name)
          .style(style.excelFormat(11, 'gB', fill));
        let failures = '';
        _.each(guarantee.failures, f => {
          if (failures !== '') failures += ', ';
          failures += f.failure.name;
        });
        ws.cell(row, col++) // Fallas
          .string(failures)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Fecha de ingreso a garantias
          .string(!guarantee.logs ? '' : moment(
            guarantee.logs[0].date).tz('America/Mexico_City')
            .format('DD/MM/YYYY hh:mm'))
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Fecha de registro
          .string(guarantee.idStock && guarantee.stock.date ?
            moment(guarantee.stock.date).format('DD/MM/YYYY') : '')
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Fecha de venta
          .string(guarantee.idStock && guarantee.stock.saleDate ?
            moment(guarantee.stock.saleDate).format('DD/MM/YYYY') : '')
          .style(style.excelFormat(11, 'gB', fill));
        let tmp = 0;
        if (guarantee.idStock && guarantee.stock.saleDate) {
          let days = moment();
          tmp = days.diff(moment(guarantee.stock.saleDate), 'days');
        }
        ws.cell(row, col++)
          .number(tmp) // Diferencia de días
          .style(style.excelFormat(11, 'gB', fill));
        let accesories = '';
        _.each(guarantee.accessories, a => {
          if (accesories !== '') accesories += ', ';
          accesories += a.accessory.name;
        });
        ws.cell(row, col++) // Accesorios
          .string(accesories)
          .style(style.excelFormat(11, 'gB', fill));
        let log = _.find(guarantee.logs, f => {
          return f.event === guarantee.status;
        });
        ws.cell(row, col++) // Descripción
          // .string(!log ? '' : log.description)
          .string(guarantee.logs[0].description)
          .style(style.excelFormat(11, 'gBR', fill));
        /*
        ws.cell(row, col++) // Nombre del cliente
          .string(!guarantee.client ? '' : guarantee.client.name)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Contacto
          .string(!guarantee.client ? '' : guarantee.client.name)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Dirección
          .string(!guarantee.client ? '' :
            guarantee.client.street + ' ' + guarantee.client.extNumber)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Número teléfonico
          .string(!guarantee.client ? '' : guarantee.client.phoneNumber)
          .style(style.excelFormat(11, 'gB', fill));
        ws.cell(row, col++) // Email
          .string(!guarantee.client ? '' : guarantee.client.email)
          .style(style.excelFormat(11, 'gB', fill));
        */
        ws.cell(row++, col) // Estado de la garantía
          .string(guaranteeStatus(guarantee.status))
          .style(style.excelFormat(11, 'gB', fill));
      });
      // Terminar la hoja
      let fileLocation = path.join('./report', 'reporte-de-garantias.xlsx');
      wb.write(fileLocation, cb);
    }// End createExcel
    /**
     * @name guaranteeStatus
     * @description Devuelve el estado de la garantía en español.
     * @param {string} status Estado de la garantía.
     */
    function guaranteeStatus(status) {
      switch (status) {
        case 'check-in':
          return 'Recepción de la garntía.';
        case 'entry':
          return 'Ingreso al Almacén Central.';
        case 'departure':
          return 'Salida con el proveedor.';
        case 're-entry':
          return 'Reingreso a Almacén Central.';
        case 're-assignment':
          return 'Reasignación de la garantía.';
        case 'refund':
          return 'Devolución al cliente.';
        case 'canceled':
          return 'Cancelación de la garantía';
        default:
          return 'No aplica';
      }
    }// End guaranteeStatus
    // Código principal
    Guarantee.find(filter, (err, guarantees) => {
      if (err) {
        // console.log(err);
        return done(newError(500,
          'No es posible generar el archivo.',
          'No es posible generar el archivo'));
      }
      createExcel(guarantees, idProvider, done);
    });
  };// End makeReport
  /**
   *
   **/
  Guarantee.setReportGuarantee = function(data, res, done) {
    // console.log('mis datos a buscar son', data);
    let newError = Guarantee.app.newError;
    let conn = Guarantee.dataSource.connector;
    // Validar rango de fechas.
    if (!data.date) {
      return done(newError(500, 'No se incluye el rango de fechas.',
      'No se incluye el rango de fechas.'));
    }
    let tmp = data.date.split(' to ');
    let params = [tmp[0] + ' 00:00:00', tmp[1] + ' 23:59:59'];
    // console.log(params);

/******************************************************************************/
  var filter = {
    include: ['client',
    {relation: 'accessories', scope: {
      include: 'accessory'
    }},
      {relation: 'failures', scope: {
      include: ['failure',{relation:'product',scope: {
        include: ['color',
          {relation: 'model', scope: {
            include: 'brand'}}]} } ]
    }},
    {relation: 'stock'}, 'logs','warehouse'
    ]      };

    Guarantee.find(filter, (err, iGuarantee) => {
      //console.log('mis garantias', iGuarantee);
      if (err)  return done(err);

      let listGuarantee = [];
      //... Información de cada garantía
      _.each(iGuarantee, (itemGuarantee, index) => {
        let newItemGuarantee = {
          failure: [],
          accesorie:[],
          logs:[0]
        }
        let converToJson = JSON.stringify(itemGuarantee);
        let convertToJson2 = JSON.parse(converToJson);
        // console.log('mis datos son', convertToJson2);
        // console.log(`Index: ${index}, Item de la garantía: ${converToJson}`);
        newItemGuarantee.createdG = convertToJson2.created ?  moment(convertToJson2.created).format('L')  : 'No tiene';
        newItemGuarantee.store = convertToJson2.client ? convertToJson2.client : 'No tiene';
        newItemGuarantee.address = convertToJson2.client ? convertToJson2.client : 'No tiene';
        newItemGuarantee.phone = convertToJson2.client ? convertToJson2.client : 'No tiene';
        newItemGuarantee.email = convertToJson2.client ? convertToJson2.client : 'No tiene';
        newItemGuarantee.warehouse = convertToJson2.warehouse.name ? convertToJson2.warehouse.name : 'No tiene';
        newItemGuarantee.imei = convertToJson2.idStock ? convertToJson2.stock.IMEI : 'No tiene';
        newItemGuarantee.saleDate = convertToJson2.idStock ? moment(convertToJson2.stock.saleDate).format('L') : 'No tiene';
        newItemGuarantee.date = convertToJson2.idStock ? moment(convertToJson2.stock.date).format('L') : 'No tiene';
        //newItemGuarantee.accessorie = convertToJson2.accessories.accessory.name ? convertToJson2.accessories.accessory.name : 'No tiene';

        //.. Obtener datos del producto
        _.each(itemGuarantee.failures(), (iProduct, index2) => {
          let converToJsonProduct = JSON.stringify(iProduct);
          let converToJsonProduct2 = JSON.parse(converToJsonProduct);
          //console.log(`Index: ${index2}, Fallas de la garantía: ${JSON.stringify(converToJsonProduct2.product)}`);
          newItemGuarantee.brand = converToJsonProduct2.product.model.brand.name ? converToJsonProduct2.product.model.brand.name : 'No tiene';
          newItemGuarantee.model = converToJsonProduct2.product.model.name ? converToJsonProduct2.product.model.name : 'No tiene';
          newItemGuarantee.color = converToJsonProduct2.product.color.name ? converToJsonProduct2.product.color.name : 'No tiene';
          let newFailure = converToJsonProduct2.failure.name ? converToJsonProduct2.failure.name : 'No tiene';
          newItemGuarantee.failure.push(newFailure);
        });
        _.each(itemGuarantee.logs(), (iGuarantee, index2) => {
          let converToJsonLogs = JSON.stringify(iGuarantee);
          let converToJsonProduct2 = JSON.parse(converToJsonLogs);
          let newDescription = converToJsonProduct2.description ? converToJsonProduct2.description : 'No tiene';
          newItemGuarantee.logs.push(newDescription);
          // console.log("Arreglo de mis garantías para generar excel",   newItemGuarantee.logs);

        });
        _.each(itemGuarantee.accessories(), (iAccesorie, index2) => {
          let converToJsonAccesory = JSON.stringify(iAccesorie);
          let converToJsonProduct3 = JSON.parse(converToJsonAccesory);
          let newAccessories = converToJsonProduct3.accessory.name ? converToJsonProduct3.accessory.name : 'No tiene';
          newItemGuarantee.accesorie.push(newAccessories);
          //console.log("Accesorios", newAccessories );

        });
        listGuarantee.push(newItemGuarantee);
      });

      if (listGuarantee.length > 0) {
        return createExcel(listGuarantee, res);
      } else {
        return done(Guarantee.app.newError(422,
          'Error 302: No se puede generar el archivo de Excel'));
      }
    });
    /**
      * @name createExcel
      * @description Función para crear el reporte de ordenes de compra.
      * @param {object} data Objeto con los datos de las ordenes de compra.
      * @param {object} res Objeto de respuesta (res).
      */
     function createExcel(data, res) {
       //console.log('aqui estoy', data);
       let style = Guarantee.app;
       let wb = new xl.Workbook({
         defaultFont: {
           size: 11,
           name: 'Calibri'}});
       let ws = wb.addWorksheet('Formato_Proveedor');
       let titles = ['No','Almacen', 'Marca', 'Modelo',
                     'Color', 'IMEI', 'Diagnostico(Falla)', 'Fecha de compra',
                     'Fecha de venta', 'Dias de venta', 'Ingreso garantía', 'Tienda',
                     'Contacto', 'Direccion', 'Telefono',
                     'Email', 'Linea del Producto', 'Accesorios', 'Descripcion'];
       let row = 1;
       let col = 1;
       ws.cell(row++, col)
         .string('Garantías ingresadas')
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

       _.each(data, Guarantee => {
          //console.log('ffffff', Guarantee  );

         var fechaInicio = new Date(Guarantee.saleDate).getTime();
         var fechaFin    = new Date(Guarantee.createdG).getTime();
         var diff = fechaFin - fechaInicio;
         let res =Math.round( diff/(1000*60*60*24) ?  diff/(1000*60*60*24) : 0 ) ;
         let days = res;


         let fill = '#FFE79B';
         if (row % 2 == 0) {
           fill = '#FFFFFF';
         }
         col = 1;
         ws.cell(row, col++).number(count++)
           .style(style.excelFormat(11, 'gBL', fill));
         ws.cell(row, col++).string(Guarantee.warehouse)
          .style(style.excelFormat(11, 'cB', fill));
        ws.cell(row, col++).string(Guarantee.brand)
          .style(style.excelFormat(11, 'cB', fill));
         ws.cell(row, col++).string(Guarantee.model)
           .style(style.excelFormat(11, 'cB', fill));
         ws.cell(row, col++).string(Guarantee.color)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.imei)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.failure.join(", "))
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.date)
          .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.saleDate)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).number(days)
         .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.createdG)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.store)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.store)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.address)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.phone)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.email)
           .style(style.excelFormat(11, 'gB', fill));
           ws.cell(row, col++).string(Guarantee.brand)
             .style(style.excelFormat(11, 'gB', fill));
             ws.cell(row, col++).string(Guarantee.accesorie.join(", "))
               .style(style.excelFormat(11, 'gB', fill));
           ws.cell(row, col++).string(Guarantee.logs)
             .style(style.excelFormat(11, 'gB', fill));

           row++;
       });

       // console.log('Generando archivo de Excel: garantias');
       wb.write('lista-de-garantias.xlsx', res);
     }// End createExcel
  };

  Guarantee.guaranteeList = function(filter, req, res, done) {
    let wf = [];
    if (!filter) {
      var filter = {
        include: ['client',
        {relation: 'accessories', scope: {
          include: 'accessory'
        }},
          {relation: 'failures', scope: {
          include: ['failure',{relation:'product',scope: {
            include: ['color',
              {relation: 'model', scope: {
                include: 'brand'}}]} } ]
        }},
        {relation: 'stock'}, 'logs','warehouse'
        ]      };
    }

    Guarantee.find(filter, (err, iGuarantee) => {
      //console.log('mis garantias', iGuarantee);
      if (err)  return done(err);

      let listGuarantee = [];
      //... Información de cada garantía
      _.each(iGuarantee, (itemGuarantee, index) => {
        let newItemGuarantee = {
          failure: [],
          accesorie:[],
          logs:[0]
        }
        let converToJson = JSON.stringify(itemGuarantee);
        let convertToJson2 = JSON.parse(converToJson);
        //console.log('mis datos son', convertToJson2);
        // console.log(`Index: ${index}, Item de la garantía: ${converToJson}`);
        newItemGuarantee.createdG = convertToJson2.created ?  moment(convertToJson2.created).format('L')  : 'No tiene';
        newItemGuarantee.store = convertToJson2.client ? convertToJson2.client : 'No tiene';
        newItemGuarantee.address = convertToJson2.client ? convertToJson2.client : 'No tiene';
        newItemGuarantee.phone = convertToJson2.client ? convertToJson2.client : 'No tiene';
        newItemGuarantee.email = convertToJson2.client ? convertToJson2.client : 'No tiene';
        newItemGuarantee.warehouse = convertToJson2.warehouse.name ? convertToJson2.warehouse.name : 'No tiene';
        newItemGuarantee.imei = convertToJson2.idStock ? convertToJson2.stock.IMEI : 'No tiene';
        newItemGuarantee.saleDate = convertToJson2.idStock ? moment(convertToJson2.stock.saleDate).format('L') : 'No tiene';
        newItemGuarantee.date = convertToJson2.idStock ? moment(convertToJson2.stock.date).format('L') : 'No tiene';
        //newItemGuarantee.accessorie = convertToJson2.accessories.accessory.name ? convertToJson2.accessories.accessory.name : 'No tiene';

        //.. Obtener datos del producto
        _.each(itemGuarantee.failures(), (iProduct, index2) => {
          let converToJsonProduct = JSON.stringify(iProduct);
          let converToJsonProduct2 = JSON.parse(converToJsonProduct);
          //console.log(`Index: ${index2}, Fallas de la garantía: ${JSON.stringify(converToJsonProduct2.product)}`);
          newItemGuarantee.brand = converToJsonProduct2.product.model.brand.name ? converToJsonProduct2.product.model.brand.name : 'No tiene';
          newItemGuarantee.model = converToJsonProduct2.product.model.name ? converToJsonProduct2.product.model.name : 'No tiene';
          newItemGuarantee.color = converToJsonProduct2.product.color.name ? converToJsonProduct2.product.color.name : 'No tiene';
          let newFailure = converToJsonProduct2.failure.name ? converToJsonProduct2.failure.name : 'No tiene';
          newItemGuarantee.failure.push(newFailure);
        });
        _.each(itemGuarantee.logs(), (iGuarantee, index2) => {
          let converToJsonLogs = JSON.stringify(iGuarantee);
          let converToJsonProduct2 = JSON.parse(converToJsonLogs);
          let newDescription = converToJsonProduct2.description ? converToJsonProduct2.description : 'No tiene';
          newItemGuarantee.logs.push(newDescription);
         // console.log("Arreglo de mis garantías para generar excel",   newItemGuarantee.logs);

        });
        _.each(itemGuarantee.accessories(), (iAccesorie, index2) => {
          let converToJsonAccesory = JSON.stringify(iAccesorie);
          let converToJsonProduct3 = JSON.parse(converToJsonAccesory);
          let newAccessories = converToJsonProduct3.accessory.name ? converToJsonProduct3.accessory.name : 'No tiene';
          newItemGuarantee.accesorie.push(newAccessories);
          //console.log("Accesorios", newAccessories );

        });
        listGuarantee.push(newItemGuarantee);
      });

      if (listGuarantee.length > 0) {
        return createExcel(listGuarantee, res);
      } else {
        return done(Guarantee.app.newError(422,
          'Error 302: No se puede generar el archivo de Excel'));
      }
    });


    /**
      * @name createExcel
      * @description Función para crear el reporte de ordenes de compra.
      * @param {object} data Objeto con los datos de las ordenes de compra.
      * @param {object} res Objeto de respuesta (res).
      */
     function createExcel(data, res) {
       //console.log('aqui estoy', data);
       let style = Guarantee.app;
       let wb = new xl.Workbook({
         defaultFont: {
           size: 11,
           name: 'Calibri'}});
       let ws = wb.addWorksheet('Formato_Proveedor');
       let titles = ['No','Almacen', 'Marca', 'Modelo',
                     'Color', 'IMEI', 'Diagnostico(Falla)', 'Fecha de compra',
                     'Fecha de venta', 'Dias de venta', 'Ingreso garantía', 'Tienda',
                     'Contacto', 'Direccion', 'Telefono',
                     'Email', 'Linea del Producto', 'Accesorios', 'Descripcion'];
       let row = 1;
       let col = 1;
       ws.cell(row++, col)
         .string('Garantías ingresadas')
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

       _.each(data, Guarantee => {
          //console.log('ffffff', Guarantee  );

         var fechaInicio = new Date(Guarantee.saleDate).getTime();
         var fechaFin    = new Date(Guarantee.createdG).getTime();
         var diff = fechaFin - fechaInicio;
         let res =Math.round( diff/(1000*60*60*24) ?  diff/(1000*60*60*24) : 0 ) ;
         let days = res;


         let fill = '#FFE79B';
         if (row % 2 == 0) {
           fill = '#FFFFFF';
         }
         col = 1;
         ws.cell(row, col++).number(count++)
           .style(style.excelFormat(11, 'gBL', fill));
         ws.cell(row, col++).string(Guarantee.warehouse)
          .style(style.excelFormat(11, 'cB', fill));
        ws.cell(row, col++).string(Guarantee.brand)
          .style(style.excelFormat(11, 'cB', fill));
         ws.cell(row, col++).string(Guarantee.model)
           .style(style.excelFormat(11, 'cB', fill));
         ws.cell(row, col++).string(Guarantee.color)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.imei)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.failure.join(", "))
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.date)
          .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.saleDate)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).number(days)
         .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.createdG)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.store)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.store)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.address)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.phone)
           .style(style.excelFormat(11, 'gB', fill));
         ws.cell(row, col++).string(Guarantee.email)
           .style(style.excelFormat(11, 'gB', fill));
           ws.cell(row, col++).string(Guarantee.brand)
             .style(style.excelFormat(11, 'gB', fill));
             ws.cell(row, col++).string(Guarantee.accesorie.join(", "))
               .style(style.excelFormat(11, 'gB', fill));
           ws.cell(row, col++).string(Guarantee.logs)
             .style(style.excelFormat(11, 'gB', fill));

           row++;
       });

       // console.log('Generando archivo de Excel: garantias');
       wb.write('lista-de-garantias.xlsx', res);
     }// End createExcel
  };
};
/******************************************************************************/
