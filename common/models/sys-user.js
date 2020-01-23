'use strict';
// Módulos adicionales de NodeJS
let _ = require('underscore');
let path = require('path');
let async = require('async');
let rands = require('randomstring');
let moment = require('moment');
let xl = require('excel4node');
moment.locale();
let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = function(SysUser) {
  // Funciones globales
  /**
   * @name afterCreate
   * @description Función posterior al registro de un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterCreate(ctx, instance, done) {
    console.log('SysUser call afterCreate');
    let data = {
      password: ctx.args.data.password,
      title: 'Registro de usuario en Smart-U.'};
    let Role = SysUser.app.models.Role;
    let RoleMapping = SysUser.app.models.RoleMapping;
    let WarehouseACL = SysUser.app.models.WarehouseACL;
    // let WarehouseACL = SysUser.app.models.WarehouseACL;
    Role.findOne({where: {name: instance.type}}, (err, iRole) => {
      if (err) return done(err);
      if (!iRole) {
        // ...destruir la instancia si no existe el rol
        return instance.destroy(err => {
          return done(SysUser.app.newError(422,
            'Tipo de usuario inválido.'));
        });
      }
      let newRM = {
        principalType: RoleMapping.USER,
        principalId: instance.id};
      iRole.principals.create(newRM, (err, principal) => {
        if (err) {
          // ...destruir la instancia si hubo error
          console.log(err);
          return instance.destroy(err => {
            return done(SysUser.app.newError(422,
              'No se pudo crear el rol de usuario.'));
          });
        } else {
          let newACL = {
            idUser: instance.id,
            idWarehouse: ctx.args.idWarehouse};
          WarehouseACL.create(newACL, (err, iWACL) => {
            if (err) return done(err);
            done();
            // createMail(instance.id, 'new-user-mail', data, done);
          });
        }
      });
    });
  }// End afterCreate
  /**
   * @name afterLogin
   * @description Función posterior actualización de un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterLogin(ctx, instance, done) {
    console.log('SysUser call afterLogin');
    let AccessToken = SysUser.app.models.AccessToken;
    let iUser = instance.toObject().user;
    if (iUser.accountStatus !== 'active' &&
    iUser.accountStatus !== 'pre-active') {
      AccessToken.deleteById(instance.id, err => {
        if (err) return done(err);
        return done(SysUser.app.newError(401,
          'Acceso negado. Credenciales inválidas.'));
      });
    } else {
      done();
    }
  }// End afterLogin
  /**
   * @name afterUpdate
   * @description Función posterior al registro de un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function afterUpdate(ctx, instance, done) {
    console.log('SysUser call afterUpdate');
    let Role = SysUser.app.models.Role;
    let RoleMapping = SysUser.app.models.RoleMapping;
    Role.findOne({where: {name: instance.type}}, (err, iRole) => {
      if (err) return done(err);
      if (!iRole) {
        // ...destruir la instancia si no existe el rol
        return done(SysUser.app.newError(422,
          'Tipo de usuario inválido.'));
      }
      let roleFilter = {
        where: {
          principalId: instance.id}};
      RoleMapping.findOne(roleFilter, (err, iRoleMap) => {
        if (err) return done(SysUser.app.newError(422,
          'Tipo de usuario inválido.'));
        iRoleMap.updateAttributes({roleId: iRole.id}, (err, ins) => {
          if (err) return done(SysUser.app.newError(422,
            'No se actualizo el role mapping.'));
          // done();
          if (ctx.args.idWarehouse) {
            afterUpdateWarehouses(ctx.args.idWarehouse, instance.id, done);
          } else {
            done();
          }
        });
      });
    });
  }// End afterUpdate

  function afterUpdateWarehouses(idWarehouse, idUser, done) {
    console.log('SysUser call afterUpdateWarehouses');
    let WarehouseACL = SysUser.app.models.WarehouseACL;
    let wf = [];
    let cc = WarehouseACL.app.commonCallback;
    let filter = {where: {idUser: idUser}, order: 'index'};
    WarehouseACL.find(filter, (err, iWACL) => {
      if (err) return done(err);
      let findWACL = _.find(iWACL, wacl => {
        return wacl.idWarehouse === idWarehouse;
      });
      if (findWACL) {
        // ...si existe un registro previo.
        wf.push(next => {
          findWACL.updateAttributes({index: 0}, cc(next));
        });
      } else {
        // ...si no existe.
        let newACL = {
          idUser: idUser,
          idWarehouse: idWarehouse,
          index: 0};
        wf.push(next => {
          WarehouseACL.create(newACL, cc(next));
        });
      }
      let count = 1;
      _.each(iWACL, wacl => {
        if (wacl.idWarehouse !== idWarehouse) {
          wf.push(next => {
            wacl.updateAttributes({index: count++}, cc(next));
          });
        }
      });
      async.waterfall(wf, done);
    });
  };
  /**
   * @name beforeCreate
   * @description Función para prevenir registrar un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeCreate(ctx, instance, done) {
    console.log('SysUser call beforeCreate');
    ctx.args.idWarehouse = ctx.args.data.idWarehouse;
    // delete ctx.args.data.idWarehouse;
    //
    if (!emailRegex.test(ctx.args.data.email) && ctx.args.data.email) {
      // ...si el correo electrónico tiene un formato invalido
      return done(SysUser.app.newError(422,
        'El correo electrónico tiene un formato invalido.',
        {field: 'email'}));
    }
    if (!ctx.args.data.password) {
      // ...si no tiene contraseña crear una nueva
      ctx.args.data.password =
        rands.generate({charset: 'alphanumeric', length: 12});
    }
    let where = {where: {email: ctx.args.data.email}};
    SysUser.findOne(where, (err, iUser) => {
      if (err) return done(err);
      if (iUser) {
        // ...si existe ya ese correo.
        return done(SysUser.app.newError(422,
          'Ese correo electrónico ya fue registrado previamente.',
          {field: 'email'}));
      } else {
        // ...todo correcto
        let Role = SysUser.app.models.Role;
        Role.findOne({where: {name: ctx.args.data.type}}, (err, iRole) => {
          if (err) return done(err);
          if (!iRole) {
            // ...si no existe el rol de usuario
            return done(SysUser.app.newError(422,
              'No existe rol para el usuario.',
              {field: 'type'}));
          }
          done();
        });
      }
    });
  }// End beforeCreate
  /**
   * @name beforeLogin
   * @description Función para prevenir el incio de sesión.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeLogin(ctx, instance, done) {
    console.log('SysUser call beforeLogin');
    ctx.args.include = ['user'];
    done();
  }// End beforeLogin
  /**
   * @name beforeUpdate
   * @description Función para prevenir el incio de sesión.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Objeto de respuesta (response).
   * @param {function} done Función de callback.
   */
  function beforeUpdate(ctx, instance, done) {
    console.log('SysUser call beforeUpdate');
    ctx.args.idWarehouse = ctx.args.data.idWarehouse;
    // delete ctx.args.data.idWarehouse;
    if (!emailRegex.test(ctx.args.data.email) && ctx.args.data.email) {
      // ...si el correo electrónico tiene un formato invalido
      return done(SysUser.app.newError(422,
        'El correo electrónico tiene un formato invalido.',
        {field: 'email'}));
    }
    let where = {
      where: {
        and: [{
          email: ctx.args.data.email},
        {
          id: {
            neq: ctx.args.data.id}}]}};
    SysUser.findOne(where, (err, iUser) => {
      if (err) return done(err);
      if (iUser) {
        // ...si existe ya ese correo.
        return done(SysUser.app.newError(422,
          'Ese correo electrónico ya fue registrado previamente.',
          {field: 'email'}));
      } else {
        // ...todo correcto
        let Role = SysUser.app.models.Role;
        Role.findOne({where: {name: ctx.args.data.type}}, (err, iRole) => {
          if (err) return done(err);
          if (!iRole) {
            // ...si no existe el rol de usuario
            return done(SysUser.app.newError(422,
              'No existe rol para el usuario.',
              {field: 'type'}));
          }
          done();
        });
      }
    });
  }// End beforeUpdate
  /**
   * @name createMail
   * @description Función para crear un correo desde una plantilla.
   * @param {string} userId Identificador del SysUser
   * @param {string} file Nombre del archivo de plantilla.
   * @param {object} data Objeto con los valores del correo electrónico.
   * @param {function} done Función de callback.
   */
  function createMail(userId, file, data, done) {
    console.log('SysUser call createMail');
    data.url = SysUser.app.get('url');
    SysUser.findById(userId, (err, iUser) => {
      if (err) return done(err);
      if (!iUser) {
        // ...no enviar el correo si el usuario no existe
        return done(SysUser.app.newError(422,
          'El usuario buscado no existe.'));
      }
      data.name = iUser.name;
      data.email = iUser.email;
      let body = SysUser.app.loadEmailBody(file, data);
      data.body = body;
      let mail = SysUser.app.loadEmailBody('generic', data);
      iUser.sendEmail(data.title, mail, null, done);
    });
  }// End createMail
  /**
   * @name observeLoaded
   * @description
   */
  function observeLoaded(ctx, done) {
    let Warehouse = SysUser.app.models.Warehouse;
    return Warehouse.findById(ctx.data.idWarehouse, (err, iWarehouse) => {
      if (err) return done();
      if (iWarehouse) {
        ctx.data.warehouse = iWarehouse;
      }
      done();
    });
  }// End observeLoaded
  // Middlewares
  // Before
  SysUser.beforeRemote('create', beforeCreate);
  SysUser.beforeRemote('login', beforeLogin);
  SysUser.beforeRemote('prototype.patchAttributes', beforeUpdate);
  // After
  SysUser.afterRemote('create', afterCreate);
  SysUser.afterRemote('login', afterLogin);
  SysUser.afterRemote('prototype.patchAttributes', afterUpdate);
  // Observe
  SysUser.observe('loaded', observeLoaded);
  // Metodos remotos
  /**
   * @description Middleware on resetPasswordRequest
   */
  SysUser.on('resetPasswordRequest', function(info) {
    let data = {};
    SysUser.findOne({where: {email: info.email}}, (err, iUser) => {
      if (err) console.log('Password reset request error: ', err);
      if (!iUser) {
        return console.log('Password reset request email not found: ',
          info.email);
      }
      data.url = SysUser.app.get('url');
      data.accessToken = info.accessToken.id;
      data.name = iUser.name + ' ' + iUser.lastName;
      data.email = iUser.email;
      data.title = 'Reestablecer contraseña';
      let body = SysUser.app.loadEmailBody('reset-password', data);
      data.body = body;
      let mail = SysUser.app.loadEmailBody('generic', data);
      iUser.sendEmail(data.title, mail, null, err => {
        if (err) console.log('Password reset request email send error: ', err);
        console.log('Password reset sent to: ', info.email);
      });
    });
  });// End on resetPasswordRequest
  // Métodos Remotos
  /**
   * @name findStock
   * @description Recupera los datos de un equipo por su IMEI.
   * @param {string} imei Número de serie del equipo.
   * @param {function} done Función de callback.
   */
  SysUser.findStock = function(imei, done) {
    console.log('SysUser call findStock');
    let Stock = SysUser.app.models.Stock;
    let filter = {
      include: 'product',
      where: {
        and: [
          {IMEI: imei},
          {status: 'sold'}]}};
    Stock.findOne(filter, done);
  };// End findStock
  /**
   * @name getAccessToken
   * @description Recupera los datos de un usuario a partir de un accessToken Id.
   * @param {string} tokenId Identificador del AccessToken.
   * @param {function} done Función de callback.
   */
  SysUser.getAccessToken = function(tokenId, done) {
    let AccessToken = SysUser.app.models.AccessToken;
    let filter = {include: 'user'};
    AccessToken.findById(tokenId, filter, done);
  };// End getAccessToken
  /**
   * @name getSellers
   * @description Recupera los datos de los usuarios sellers.
   * @param {function} done Función de callback.
   */
  SysUser.getSellers = function(done) {
    let filter = {
      where: {
        and: [
          {accountStatus: 'active'},
          {type: 'seller'}]}};
    SysUser.find(filter, (err, users) => {
      if (err) return done(err);
      done(null, users);
    });
  };// End getSellers

  /**
   * @name setClient
   * @description Asigna a un vendedor un grupo de clientes.
   * @param {object} data Objeto con los datos de asignación.
   * @param {function} done Función de callback.
   */
  SysUser.setClient = function(data, done) {
    console.log('SysUser call setClient', data);
    let cc = SysUser.app.commonCallback;
    let Billing = SysUser.app.models.Billing;
    let SellerHasClient = SysUser.app.models.SellerHasClient;
    let wf = [];
    if (typeof data !== 'object') {
      return done(SysUser.app.newError(422,
        'Tipo de dato invalido, se esperaba un objeto.'));
    }
    if (!data.clients || data.clients.length <= 0) {
      return done(SysUser.app.newError(422,
        'Arreglo vacío, sin datos de los clientes.'));
    }
    SysUser.findById(data.idSeller, (err, iUser) => {
      if (err) return done(SysUser.app.newError(422,
          'Identificador de vendedor inválido.'));
      _.each(data.clients, client => {
        wf.push(next => {
          Billing.exists(client.idClient, (err, flag) => {
            if (err) return next(SysUser.app.newError(422,
              'Identificador de cliente inválido.'));
            if (flag) {
              let newAssignament = {
                idSeller: data.idSeller,
                idClient: client.idClient};
              SellerHasClient.create(newAssignament, cc(next));

            } else {
              next();
            }
          });
        });
      });
      async.waterfall(wf, done);
    });
  };// End setClient
  /**
   * @description Devuelve el equipo asignado al usuario.
   * @param {string} userId Id del usuario del que se requiere el almacén.
   * @param {function} done Función de callback.
   * @returns {object} Objeto con los datos del inventario del usuario.
   */
  SysUser.prototype.getStock = function(done) {
    console.log('SysUser calls getStock');
    // Filtro de búsqueda
    let filter = {
      include: {
        relation: 'warehouseACL',
        scope: {
          include: {
            relation: 'warehouse',
            scope: {
              include: {
                relation: 'stocks',
                scope: {
                  where: {
                    and: [
                      {
                        or: [
                          {
                            status: 'assigned'},
                          {
                            status: 'sold'}]},
                      {
                        validate: false}]},
                  include: ['product',
                    {
                      relation: 'logs',
                      scope: {
                        where: {
                          event: 'assigned'}}}, 'client'],
                  order: 'idProduct'}}}},
          limit: 1,
          order: 'index'}}};
    SysUser.findById(this.id, filter, (err, iUser) => {
      if (err) return done(err);
      let user = iUser.toObject();
      let warehouse = user.warehouseACL[0].warehouse;

      // Objeto de respuesta
      let response = {
        id: user.id,
        seller: `${user.name} ${user.lastName}`,
        route: warehouse.name,
        date: moment().locale('es-mx').format('L'),
        attend: 'SystemAx',
        total: 0,
        items: []};
      let lastId = '';
      let idx = -1;
      // Recorrer los productos para obtener los IMEIs
      _.each(warehouse.stocks, stock => {
        if (lastId !== stock.idProduct) {
          let newProduct = {
            id: stock.idProduct,
            model: stock.product.name,
            price: parseFloat(stock.publicPrice), //Add by Josué
            pieces: 0,
            stock: []};
          response.items.push(newProduct);
          lastId = stock.idProduct;
          idx++;
        }

        var nowDate = moment(); // Obtener la fecha actual
        if (stock.logs.length > 0) {
          var logDate = moment(stock.logs[0].date).format('L'); // Darle formato a la fecha de stockLogs
        }

        let newStock = {
          id: stock.id,
          imei: stock.IMEI,
          price: stock.publicPrice,
          status: stock.status,
          isRefurb: stock.isRefurb,
          check: false, // Agregado recientemente (Josué)
          nameClient: (stock.idClient === null) ? null : stock.idClient,
          days: stock.logs.length > 0 ? nowDate.diff(logDate, 'days') : 0
        };
        response.items[idx].stock.push(newStock);
        response.items[idx].pieces++;
        response.total++;
      });
      done(null, response);
    });
  };// End prototype.getStock
  /**
   * @name setSale
   * @description Registra una venta de un equipo.
   * @param {string} idClient Identificador de Billing de tipo client.
   * @param {string} idStock Identificador del equipo.
   * @param {number} salesPrice Precio de venta del equipo.
   * @param {function} done Función de callback.
   */
  SysUser.prototype.setSale = function(idClient, idStock, salesPrice, done) {
    console.log('SysUser calls setSale');
    let Billing = SysUser.app.models.Billing;
    let Stock = SysUser.app.models.Stock;
    let StockLog = SysUser.app.models.StockLog;
    Billing.findById(idClient, (err, iClient) => {
      if (err) return done(SysUser.app.newError(422,
        'Identificador de cliente inválido.'));
      Stock.findById(idStock, (err, iStock) => {
        if (err) return done(SysUser.app.newError(422,
          'Identificador de stock inválido.'));
        if (iStock.status !== 'assigned') return done(SysUser.app.newError(422,
            'El equipo ya no está disponible en su inventario.'));
        let newAttributes = {
          status: 'sold',
          salesPrice: salesPrice,
          saleDate: moment().format(),
          idClient: iClient.id};
        iStock.updateAttributes(newAttributes, (err, iS) => {
          if (err) return done(SysUser.app.newError(422,
            'No se pudo marcar el equipo como vendido.'));
          let newLog = {
            idStock: iStock.id,
            event: 'sold',
            description: `${iClient.name} adquirió el equipo a ${this.name} ${this.lastName}`};
          StockLog.create(newLog, (err, iLog) => {
            if (err) return done(SysUser.app.newError(422,
                'No se pudo registrar la venta en el historial.'));
            done(null, true);
          });
        });
      });
    });
  };// End prototype.setSale
  /**
   * @name sendEmail
   * @description Función para envíar un correo electrónico desde un objeto SysUser.
   * @param {string} subject Título del correo electrónico.
   * @param {string} body Cuerpo del correo electrónico.
   * @param {files} files Archivos adjuntos al correo electrónico.
   * @param {function} done Función de callback.
   */
  SysUser.prototype.sendEmail = function(subject, body, files, done) {
    let senderAddress = 'contacto@multiplicame.com';
    let Email = SysUser.app.models.Email;
    if (!this.email) {
      return done(new Error(
        'Usuario sin correo electrónico, no se puede enviar correo. usuario: ',
          this.username));
    }
    if (this.accountStatus === 'test') {
      console.log(`Test account ${this.email}, ignoring email sending.`);
      return done();
    }
    // Datos del correo
    let mailData = {
      to: this.email,
      from: senderAddress,
      subject: subject,
      text: body.replace(/<.*?>/g, ''),
      html: body};
    // Archivos adjuntos
    if (files) {
      _.map(files, file => {
        return path.resolve(file);
      });
      mailData.attachments = files;
    }
    // Mandar correo electrónico
    Email.send(mailData, function(err, mail) {
      if (err) return done(err);
      done();
    });
  };// End prototype.sendEmail

  /**
   * @name loginCustomize
   * @description Validar los datos de acceso.
   * @param {object} credentials Objeto con las credenciales de acceso.
   * @return {callback} callback
   */
  SysUser.loginCustomize = function(credentials, callback) {
    //console.log("datos de las credenciales", credentials);
		SysUser.login(credentials, function (loginErr, loginToken) {
			if (loginErr)
        return callback(new Error(
          'El correo o la contraseña son invalidos'));
			  SysUser.findById(loginToken.userId, function (findErr, userData) {
				if (findErr)
          return callback(new Error(
            `El usuario con el correo ${credentials.email} no existe.`));
				return callback(null, userData);
			});
		});
  }
  /**
   * @name prototype.removeStocks
   */
  SysUser.prototype.removeStocks = function(data, done) {
    let cc = SysUser.app.commonCallback;
    let newError = SysUser.app.newError;
    let Stock = SysUser.app.models.Stock;
    let StockLog = SysUser.app.models.StockLog;
    let Warehouse = SysUser.app.models.Warehouse;
    let wf = [];
    let wf2 = [];
    let result = {count: 0};
    let self = this;
    /**
     * @name remove
     * @description Quita del almacén origen un producto.
     * @param {string} idWarehouse Identificador del almacén destino.
     * @param {object} stock Instancia del stock a quitar.
     * @param {function} cb Función de callback.
     */
    function remove(warehouse, stock, cb) {
      wf2.push(next => {
        Warehouse.findById(self.idWarehouse, (err, iWarehouse) => {
          if (err) return next(err);
          let updStock = {
            idWarehouse: warehouse.id,
            scanByAvailable: false};
          stock.updateAttributes(updStock, (err, s) => {
            if (err) return next(err);
            let newLog = {
              idStock: stock.id,
              event: 'assigned',
              description: 'Traspaso de ' + warehouse.name + ' a ' +
                iWarehouse.name + '.'};
            result.count++;
            StockLog.create(newLog, cc(next));
          });
        });
      });
      cb();
    }// End remove
    // Revisar que se indique a que almacén se envían los productos
    if (!data.idWarehouse) {
      // ...no se incluyo el almacén destino
      return done(newError(404, 'No se ha indicado el almacén destino.'));
    }
    if (!data.stocks || data.stocks.length < 1) {
      // ...no se incluyo datos del stock
      return done(newError(404, 'No se incluyeron datos del stock.'));
    }
    Warehouse.findById(data.idWarehouse, (err, iWarehouse) => {
      if (err) return done(err);
      if (!iWarehouse) {
        // ...no es un almacén valido
        return done(newError(404, 'No se encontró el almacén destino.'));
      }
      _.each(data.stocks, stock => {
        wf.push(next => {
          if (!stock.id) {
            return next(newError(400,
              'No se incluyo identificador del stock.'));
          }
          Stock.findById(stock.id, (err, iStock) => {
            if (err) return next(err);
            if (!iStock) {
              return next(newError(400, 'No se encontró el stock buscado.'));
            } else if (iStock.idWarehouse !== self.idWarehouse) {
              return next(newError(400,
                `El IMEI ${iStock.IMEI} no está registrado a este almacén.`));
            } else if (iStock.status !== 'assigned') {
              return next(newError(404,
                `El IMEI ${iStock.IMEI} no está disponible para baja.`));
            } else {
              remove(iWarehouse, iStock, next);
            }
          });
        });
      });// End _.each
      // Revisar que los productos enviados le pertenezcan al vendedor
      async.waterfall(wf, err => {
        if (err) return done(err);
        async.waterfall(wf2, err => {
          if (err) return done(err);
          done(null, result);
        });
      });
    });
  };
  /**
   * @name setSaleReport
   * @description Asigna a un vendedor un grupo de clientes.
   * @param {object} data Arreglo con los ID's de los ejecutivos.
   * @param {function} cb Función de callback.
   */
  SysUser.setSaleReport = function(data, cb, res) {
    //console.log('SysUser call setSaleReport', data);
    let wf = [];
    let newError = SysUser.app.newError;
    let cc = SysUser.app.commonCallback;

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
     * @name processStocks
     * @description Procesa los datos del stock del vendedor.
     * @param {object} seller Datos del vendedor y su stock.
     * @param {fuction} cb Función de callback.
     */
    function processStocks(seller, cb) {
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
      return cb(newError(400,
        'No se incluyó identificadores para los vendedores'));
    }
    // Recorrer los id de los vendedores
    _.each(data.sellers, sellerId => {
      wf.push(next => {
        SysUser.findById(sellerId, sellerFilter, (err, iSeller) => {
          if (err) return next(err);
          if (!iSeller) {
            // ...no existe el vendedor
            return next(newError(404, 'No se encontró el vendedor.'));
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
      result.sellers = _.sortBy(result.sellers, 'name');
      result.models = _.sortBy(result.models, 'name');
      if (result.models.length === 0) {
        return cb(newError(400,
          'No hay equipos para generar el reporte de cambaceo'));
      }else {
        createExcel(result, cb);
      }

    });
  };
  /**
   * @name createExcel
   * @description Función para crear el reporte de rutas.
   * @param {object} data Objeto con los datos de las ordenes de compra.
   * @param {object} res Objeto de respuesta (res).
   */
  function createExcel(data, cb) {
    //console.log("Datos recibidos desde la función--->createExcel", data);
    let style = SysUser.app;
    let wb = new xl.Workbook({
      defaultFont: {
        size: 11,
        name: 'Calibri'}});
    let ws = wb.addWorksheet('Formato_Rutas');
    let titles = ['No', 'Modelo'];
    _.each(data.sellers, seller => {
      titles.push(seller.name +' '+ seller.lastName);
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
    //console.log('Generando archivo de Excel: Reporte');
    var fileLocation = path.join('./report','reporte-de-rutas.xlsx');
    wb.write(fileLocation, cb);
  };// End createExcel



  /**
   * @name setReportSeries
   * @description Método para generar el reporte de series masivas.
   * @param {object} data Arreglo con los números de series de los equipos.
   * @param {function} cb Función de callback.
   */
  SysUser.setReportSeries = function(data, cb) {
    console.log("Arreglo de número de series", data);
    let wf = [];
    let newError = SysUser.app.newError;
    let cc = SysUser.app.commonCallback;
    let Stock = SysUser.app.models.Stock;
    //{"data": { "items": ["355000012626918"] } }

    /**
     * @name processStocks
     * @description Procesa los datos del stock del vendedor.
     * @param {object} stock Datos del vendedor y su stock.
     * @param {fuction} cb Función de callback.
     */
    function processStocks(stock, cb) {
      console.log("Información del stock a procesar", stock);
      cb();
    }// End processStocks

    if (!data.items || data.items.length < 1) {
      // ...no se incluyo los IMEI`s de los equipos
      return cb(newError(400,
        'No se incluyó IMEIS de los equipos.'));
    }

    // Recorrer los id de los vendedores
    _.each(data.items, item => {

      let filter = {
        include: 'product',scope: {
          include: ['color',
            {relation: 'model', scope: {
              include: 'brand'}}]},
        where: {IMEI: item}};

      wf.push(next => {
        Stock.findOne(filter, (err, iStock) => {
          if (err) return next(err);
          if (!iStock) {
            // ...no existe el vendedor
            return next(newError(404, 'No se encontró el vendedor.'));
          }
          console.log("Vendedor encontrado", iStock);
          processStocks(iStock, cc(next));
        });
      });
    });

    async.waterfall(wf, err => {
      if (err) return cb(err);
      cb();
    });

  }//...End SysUser.setReportSeries
  /**
   * @name createExcel
   * @description Función para crear el reporte de rutas.
   * @param {object} data Objeto con los datos de las ordenes de compra.
   * @param {object} res Objeto de respuesta (res).
   * @deprecated
   *
  function createExcel(data, cb) {
    //console.log("Datos recibidos desde la función--->createExcel", data);
    let style = SysUser.app;
    let wb = new xl.Workbook({
      defaultFont: {
        size: 11,
        name: 'Calibri'}});
    let ws = wb.addWorksheet('Formato_Series');
    let titles = ['No', 'Serie_Original', 'Es_Sim_Card', 'Inventario_ID', 'Status_ID', 'Codigo_Celular_Activacion_ID', 'Codigo_Celular_ID', 'Codigo_SAP', 'Marca', 'Modelo', 'Color', 'PDF', 'Abreviatura', 'Fecha_Hora_Compra', 'Almacen', 'Status_Nombre', 'Usuario_Compra', 'Precio', 'IMEI'];

    titles.push('ICCID', 'Usuario_Activacion_ID', 'Numero', 'Fecha_Hora_Activacion','Fecha_Primer_Llamada', 'Usuario_Preactivacion', 'Usuario_Primer_Llamada', 'Usuario_Recarga', 'Fecha_Recarga', 'Folio_Recarga', 'Fecha_Venta', 'Razon_Social', 'Nombre_Cliente', 'Cliente_ID', 'Nombre_Vendedor', 'ID');

    let row = 1;
    let col = 1;
    ws.cell(row++, col)
      .string('Reporte SeriesM')
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
    //console.log('Generando archivo de Excel: Reporte');
    var fileLocation = path.join('./report','reporte-de-series.xlsx');
    wb.write(fileLocation, cb);
  };// End createExcel
  */
};
