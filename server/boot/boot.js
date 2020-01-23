'use strict';

let _ = require('underscore');
let fs = require('fs');
let path = require('path');
let schedule = require('node-schedule');
let https = require('https');
https.post = require('https-post');
let async = require('async'); // TODO: quitar cuando se cancele el trabajo de venta a mostrador

module.exports = function(app) {
  // Código para inicializar la bd
  let ds = app.dataSources.mysql;
  let lbTables = ['AccessToken', 'RoleMapping', 'Role'];
  // Modelos necesarios
  let Role = app.models.Role;
  let SysUser = app.models.SysUser;
  let AccessToken = app.models.AccessToken;
  let RoleMapping = app.models.RoleMapping;
  let Warehouse = app.models.Warehouse;
  let WarehouseACL = app.models.WarehouseACL;
  ds.autoupdate(lbTables, err => {
    if (err) throw err;
    // Inicializar usuarios
    SysUser.findOne({type: 'admin'}, (err, user) => {
      if (err) return console.log(err);
      // Si no hay usuario administrador
      if (!user) {
        // Definición de objetos para inicializar las tablas
        // Objeto almacén
        let newWarehouse = {
          idParent: null,
          name: 'Almacén Central',
          type: 'place',
          address: 'Lago Margarita',
          isMain: true};
        // Objeto administrador
        let newAdmin = {
          username: 'admin',
          email: 'enrique.sotelo@madmedia.com.mx',
          password: 'A6h3s1V3',
          type: 'admin',
          name: 'Enrique',
          lastName: 'Sotelo Ponce',
          accountStatus: 'active',
          isAdmin: true};
        // Objeto WarehouseACL
        let WACL = {
          idUser: null,
          idWarehouse: null};
        // Objetos roles
        let newRoles = [
          {name: 'admin'},
          {name: 'warehouse-boss'},
          {name: 'storer'},
          {name: 'support'},
          {name: 'seller'},
          {name: 'accountant'},
          {name: 'manager'},
          {name: 'ceo'}];
        // Crear el almacén principal
        Warehouse.create(newWarehouse, (err, iWarehouse) => {
          if (err) return console.log(err);
          WACL.idWarehouse = iWarehouse.id;
          // Crear al usuario administrador
          SysUser.create(newAdmin, (err, iUser) => {
            if (err) return console.log(err);
            WACL.idUser = iUser.id;
            // Crear la relación entre almacén principal y admin
            WarehouseACL.create(WACL, (err, iWACL) => {
              if (err) return console.log(err);
              // Crear los roles
              Role.create(newRoles, (err, roles) => {
                if (err) return console.log(err);
                // Objeto roleMapping
                let roleMapping = {
                  principalType: RoleMapping.USER,
                  principalId: iUser.id};
                // Crear relación entre el Administrador y RoleMapping
                roles[0].principals.create(roleMapping, (err, principal) => {
                  if (err) return console.log(err);
                  console.log('*NEW DATABASE* Admin user created!');
                });// End RoleMapping.create
              });// End Role.create
            });// End WarehouseACL.create
          });// End SysUser.create
        });// End Warehouse.create
      }
    });// End SysUser.find
  });// End app.dataSources.mysql.autoupdate
  // Crear la relación entre SysUser y Accesstoken
  AccessToken.belongsTo(SysUser, {foreignKey: 'userId', as: 'user'});
  /**
   * @name newError
   * @description Genera un mensaje de error para ser devuelto en una petición HTTP.
   * @param {number} status Código de error de HTTP.
   * @param {string} message Mensaje de error devuelto por el servidor.
   * @param {string} extras Mensaje adicional sobre el error.
   */
  app.newError = function(status, message, extras) {
    let error = new Error(message);
    error.status = status;
    error.details = extras;
    return error;
  };
  /**
   * @name commonCallback
   * @description Devuelve una función de callback para los metodos de async.
   * @param {function} next Función de callback.
   */
  app.commonCallback = function(next) {
    return function(err) {
      if (err) return next(err);
      next();
    };
  };
  /**
   * @name excelFormat
   * @description Prepara un objeto con formato para Excel
   * @param {number} size Tamaño de la fuente.
   * @param {string} format Patron para determinar la alineación [clrg], negritas[b], cursivas[i], y bordes [TBLR].
   * @param {string} fillColor Cadena de texto con formato hexadecimal para el color del relleno.
   * @param {string} fontColor Cadena de texto con formato hexadecimal para el color de la fuente.
   */
  app.excelFormat = function(size, format, fillColor, fontColor) {
    let border = {
      style: 'thin',
      color: '#000000'};
    let result = {
      border: {},
      font: {
        size: size}};
    if (format !== '' && typeof(format) === 'string') {
      if (format.indexOf('c') !== -1) {
        result.alignment = {horizontal: 'center'};
      }
      if (format.indexOf('r') !== -1) {
        result.alignment = {horizontal: 'right'};
      }
      if (format.indexOf('l') !== -1) {
        result.alignment = {horizontal: 'left'};
      }
      if (format.indexOf('g') !== -1) {
        result.alignment = {horizontal: 'general'};
      }
      if (format.indexOf('b') !== -1) {
        result.font.bold = true;
      }
      if (format.indexOf('i') !== -1) {
        result.alignment.italics = true;
      }
      if (format.indexOf('T') !== -1) {
        result.border.top = border;
      }
      if (format.indexOf('B') !== -1) {
        result.border.bottom = border;
      }
      if (format.indexOf('R') !== -1) {
        result.border.right = border;
      }
      if (format.indexOf('L') !== -1) {
        result.border.left = border;
      }
      if (format.indexOf('C') !== -1) {
        result.numberFormat = ' $* #,##0.00 ; ( $* #,##0.00) ; -';
      }
      if (format.indexOf('F') !== -1) {
        result.numberFormat = '[$-es-MX]dd/mm/yyyy';
      }
    }
    if (fillColor !== '' && typeof(fillColor) === 'string') {
      result.fill = {
        type: 'pattern',
        patternType: 'solid',
        bgColor: fillColor,
        fgColor: fillColor};
    }
    if (fontColor !== '' && typeof(fontColor) === 'string') {
      result.font.color = fontColor;
    }
    return result;
  };
  /**
   * @name convertToSlug
   * @description Prepara una cadena de texto en formato friendlyUrl.
   * @param {string} string Texto para dar formato.
   */
  app.convertToSlug = function(string) {
    const findThis = ['á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú', 'ñ',
      'Ñ', 'ü', 'Ü'];
    const replaceWithThis = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U',
      'n', 'N', 'u', 'U'];
    let result = string.toLowerCase();
    // Remplazar vocales acentuadas
    _.each(findThis, function(f, i) {
      result = result.replace(new RegExp(f, 'g'), replaceWithThis[i]);
    });
    // Quitar caracteres especiales y remplaza espacios por guión medio
    return result.replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };
  /**
   * @name replaceTemplateVars
   * @description Función para remplazar valores en una cadena de texto.
   * @param {object} replaceables Objeto con valores para reeemplazar.
   * @param {string} string Archivo comom texto donde se reemplazarán las variables.
   */
  app.replaceTemplateVars = function(replaceables, string) {
    if (typeof(replaceables) === 'object') {
      _.each(replaceables, function(value, key) {
        let re = new RegExp('{{' + key + '}}', 'g');
        string = string.replace(re, value);
      });
    }
    return string;
  };
  /**
   * @name genericEmailTemplate
   * @description Carga una plantilla para el envio de correos electrónicos.
   * @param {string} title Título del correo electrónico.
   * @param {string} body Cuerpo del correo electrónico.
   * @param {string} email Destinatario.
   */
  app.genericEmailTemplate = function(title, body, email) {
    let html = fs.readFileSync('./server/templates/generic.html', 'utf8');
    return app.replaceTemplateVars({
      title: title,
      body: body,
      email: email,
      logoData: fs.readFileSync('./server/templates/logo.png')
        .toString('base64')},
      html);
  };
  /**
   * @name loadEmailBody
   * @description Carga una plantilla para el envío de correos electrónicos.
   * @param {sring} fileName Nombre del archivo.
   * @param {objeto} info Objeto con información para el correo electrónico.
   */
  app.loadEmailBody = (fileName, info) => {
    // TODO: revisar que exista el archivo
    let html = fs.readFileSync(`./server/templates/${fileName}.html`, 'utf-8');
    return app.replaceTemplateVars(info, html);
  };// End loadEmailBody
  /**
   * @name sendEmail
   * @description Función para envíar un correo electrónico.
   * @param {string} subject Título del correo electrónico.
   * @param {string} body Cuerpo del correo electrónico.
   * @param {files} files Archivos adjuntos al correo electrónico.
   * @param {function} done Función de callback.
   */
  app.sendEmail = (to, subject, message, files, done) => {
    let senderAddress = 'contacto@multiplicame.com';
    let Email = app.models.Email;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(to)) {
      // ...no es un correo electrónico
      return done(app.newError(400, 'Email invalido.'));
    }
    // Datos del correo
    let mailData = {
      to: to,
      from: senderAddress,
      subject: subject,
      text: message.replace(/<.*?/g, ''),
      html: message};
    // Archivos adjuntos
    if (files) {
      _.map(files, file => {
        return path.resolve(file);
      });
      mailData.attachments = files;
    }
    // Mandar correo electrónico
    Email.send(mailData, (err, mail) => {
      if (err) return done(err);
      done();
    });
  };// End sendEmail
  /**
   * @name sendNotification
   * @description Envia un mensaje de notificación a un dispositivo vía Expo.
   * @param {object} message Objeto con los datos del remitente.
   * @param {function} done Función de callback.
   */
  app.sendNotification = (message, done) => {
    console.log('app.sendNotification');
    let url = 'https://exp.host/--/api/v2/push/send';
    let postData = {
      to: message.to,
      title: message.title,
      body: message.body,
      data: JSON.stringify(message.data),
      priority: 'high',
      badge: '0'};
    https.post(url, postData, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        return done(null, {data: chunk});
      });
    });// End https.post
  };
  /**
   *
   */
  let job = schedule.scheduleJob('0 12 * * *', function(fireDate) {
    console.log(fireDate, ': Cancelando abonos pendientes.');
    app.models.Payment.cancelAll((err, response) => {
      if (err) {
        return console.log('Error en cancelación de abonos: ', err);
      }
      console.log(`Se actualizaron ${response.count}. abonos.`);
    });
  });

  // Trabajo 2 (Marcar vendidos como venta a mostrador cada hora)
  let salestock = schedule.scheduleJob('1 * * * *', function(fireDate) {
    console.log(fireDate, 'Debo poner como venta mostrador todos los vendidos');
    let wf = [];
    let Stock = app.models.Stock;
    let SysUser = app.models.SysUser;
    let filter = {
      where: {
        and: [
          {status: 'sold'},
          {idClient: null}]}};
    let count = 0;
    Stock.find(filter, (err, stocks) => {
      if (err) return console.log(err);
      _.each(stocks, stock => {
        wf.push(next => {
          let filter = {
            where: {
              idWarehouse: stock.idWarehouse}};
          SysUser.find(filter, (err, users) => {
            if (err) return next(err);
            let upd = {
              confirmSale: true,
              idClient: 'f79e3d40-58ad-11e9-8743-fd373b7998c4', // id de venta a mostrador
              saleDate: new Date(),
              salesPrice: stock.publicPrice};
            if (users.length > 0) {
              upd.idUser = users[0].id;
            }
            stock.updateAttributes(upd, (err, iStock) => {
              if (err) return next(err);
              count++;
              next();
            });
          });// End SysUser.findOne
        });// End wf.push
      });// End _.each
      async.waterfall(wf, err => {
        if (err) return console.log(err);
        console.log(`Se actualizaron ${count} stocks.`);
      });
    });
  });
};
/******************************************************************************/