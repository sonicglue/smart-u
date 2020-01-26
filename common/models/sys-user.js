'use strict';
// Módulos adicionales de NodeJS
let rands = require('randomstring');
let async = require('async');

module.exports = function(SysUser) {
  // Funciones globales
  /**
   * @name afterCreate
   * @description Función posterior al registro de un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Instancia del modelo SysUser.
   * @param {function} done Función de callback.
   */
  function afterCreate(ctx, instance, done) {
    console.log('SysUser call afterCreate');
    let Role = SysUser.app.models.Role;
    let RoleMapping = SysUser.app.models.RoleMapping;
    let Warehouse = SysUser.app.models.Warehouse;
    Role.findOne({where: {name: instance.type}}, (err, iRole) => {
      if (err) return done(err);
      let newRM = {
        principalType: RoleMapping.USER,
        principalId: instance.id};
      iRole.principals.create(newRM, (err, principal) => {
        if (err) {
          // ...destruir la instancia si hubo error
          console.log(err);
          return instance.destroy(err => {
            return done(SysUser.app.newError(422,
              'No se pudo crear el rol de usuario.',
              {field: 'type'}));
          });
        }
        if (instance.type === 'seller') {
          // ...es un vendedor
          let newWarehouse = {
            idParent: instance.idWarehouse,
            name: instance.name + ' ' + instance.lastName,
            type: 'seller'};
          Warehouse.create(newWarehouse, (err, iWarehouse) => {
            if (err) return done(err);
            instance.updateAttributes({idWarehouse: iWarehouse.id},
            (err, iI) => {
              if (err) return done(err);
              done();
            });
          });
        } else {
          done();
        }
      });
    });
  }// End afterCreate
  /**
   * @name afterLogin
   * @description Función posterior al inicio de sesión de un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Instancia del modelo SysUser.
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
   * @description Función posterior a la actualizacion de un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Instancia del modelo SysUser.
   * @param {function} done Función de callback.
   */
  function afterUpdate(ctx, instance, done) {
    console.log('SysUser call afterUpdate');
    let wf = [];
    let Role = SysUser.app.models.Role;
    let Warehouse = SysUser.app.models.Warehouse;
    let RoleMapping = SysUser.app.models.RoleMapping;
    if (ctx.attached.newType) {
      // ...cambio de tipo
      wf.push(next => {
        Role.findOne({where: {name: instance.type}}, (err, iRole) => {
          if (err) return next(err);
          let roleFilter = {
            where: {
              principalId: instance.id}};
          RoleMapping.findOne(roleFilter, (err, iRoleMap) => {
            if (err) return next(err);
            iRoleMap.updateAttributes({roleId: iRole.id}, (err, iRM) => {
              if (err) return next(err);
              next();
            });
          });
        });
      });
    }
    if (ctx.attached.isSeller && !ctx.attached.newType) {
      // ...es vendedor y no cambio de tipo
      wf.push(next => {
        let updName = instance.name + ' ' + instance.lastName;
        Warehouse.findById(instance.idWarehouse, (err, iWarehouse) => {
          if (err) return next(err);
          iWarehouse.updateAttributes({name: updName}, (err, iW) => {
            if (err) return next(err);
            next();
          });
        });
      });
    } else if (ctx.attached.isSeller && ctx.attached.newType) {
      // ...es vendedor y dejo de serlo
      wf.push(next => {
        Warehouse.findById(ctx.attached.idWarehouse, (err, iWarehouse) => {
          if (err) return next(err);
          iWarehouse.updateAttributes({active: false}, (err, iW) => {
            if (err) return next(err);
            // TODO: quitar el stock de este almacen con iWarehouse
            next();
          });
        });
      });
    } else if (!ctx.attached.isSeller && ctx.attached.newType) {
      // ...no era vendedor y ahora lo es
      wf.push(next => {
        let newName = instance.name + ' ' + instance.lastName;
        Warehouse.findOne({where: {name: newName}}, (err, iWarehouse) => {
          if (err) return next(err);
          if (!iWarehouse) {
            // ...no habia almacen se crea como nuevo
            let newWarehouse = {
              idParent: instance.idWarehouse,
              name: newName,
              type: 'seller'};
              Warehouse.create(newWarehouse, (err, iW) => {
                if (err) return next(err);
                instance.updateAttributes({idWarehouse: iW.id}, (err, I) => {
                  if (err) return next(err);
                  next();
                });
              });
          } else {
            // ...ya existia el almacén
            let updWarehouse = {idWarehouse: iWarehouse.id, active: true};
            iWarehouse.updateAttributes(updWarehouse, (err, iW) => {
              if (err) return next(err);
              instance.updateAttributes({idWarehouse: iW.id}, (err, I) => {
                if (err) return next(err);
                next();
              });
            });
          }
        });
      });
    }
    async.waterfall(wf, err => {
      if (err) return done(err);
      done();
    });
  }// End afterUpdate
  /**
   * @name beforeCreate
   * @description Función para validar antes de registrar un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Instancia del modelo SysUser.
   * @param {function} done Función de callback.
   */
  function beforeCreate(ctx, instance, done) {
    console.log('SysUser call beforeCreate');
    let Role = SysUser.app.models.Role;
    // Crear contraseña si no existe
    if (!ctx.args.data.password) {
      // ...si no tiene contraseña crear una nueva
      ctx.args.data.password =
        rands.generate({charset: 'alphanumeric', length: 12});
    }
    // Revisar el rol del usuario
    let roleFilter = {
      where: {
        and: [
          {name: ctx.args.data.type},
          {name: {neq: 'admin'}}]}};
    Role.findOne(roleFilter, (err, iRole) => {
      if (err) return done(err);
      if (!iRole) {
        // ...si no existe el rol de usuario
        return done(SysUser.app.newError(422,
          'No existe rol para el usuario.',
          {field: 'type'}));
      }
      done();
    });
  }// End beforeCreate
  /**
   * @name beforeLogin
   * @description Función para validar antes de el incio de sesión de un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Instancia del modelo SysUser.
   * @param {function} done Función de callback.
   */
  function beforeLogin(ctx, instance, done) {
    console.log('SysUser call beforeLogin');
    ctx.args.include = ['user'];
    done();
  }// End beforeLogin
  /**
   * @name beforeUpdate
   * @description Función para validar antes de actualizar un SysUser.
   * @param {object} ctx Objeto de solicitud (request).
   * @param {object} instance Instancia del modelo SysUser.
   * @param {function} done Función de callback.
   */
  function beforeUpdate(ctx, instance, done) {
    console.log('SysUser call beforeUpdate');
    let attached = {
      idWarehouse: ctx.instance.idWarehouse,
      isSeller: false,
      newType: false};
    if (ctx.args.data.type && ctx.args.data.type !== 'seller' &&
    !ctx.args.data.idWarehouse) {
      return done(SysUser.app.newError(422,
        'No incluyo el almacén para el usuario.',
        {field: 'idWarehouse'}));
    }
    if (ctx.instance.type === 'seller') {
      // ...antes era vendedor
      attached.isSeller = true;
    }
    if (ctx.args.data.type && ctx.args.data.type !== ctx.instance.type) {
      // ...y cambio de tipo de usuario
      attached.newType = true;
    }
    ctx.attached = attached;
    done();
  }// End beforeUpdate
  // Middlewares
  // Before
  SysUser.beforeRemote('prototype.patchAttributes', beforeUpdate);
  SysUser.beforeRemote('create', beforeCreate);
  SysUser.beforeRemote('login', beforeLogin);
  // After
  SysUser.afterRemote('create', afterCreate);
  SysUser.afterRemote('login', afterLogin);
  SysUser.afterRemote('prototype.patchAttributes', afterUpdate);
  // Metodos remotos
  /**
   * @name getAccessToken
   * @description Recupera los datos de un usuario a partir de un accessToken Id.
   * @param {string} tokenId Identificador del AccessToken.
   * @param {function} done Función de callback.
   */
  SysUser.getAccessToken = function(tokenId, done) {
    console.log('SysUser call getAccessToken');
    let AccessToken = SysUser.app.models.AccessToken;
    let filter = {include: 'user'};
    AccessToken.findById(tokenId, filter, done);
  };// End getAccessToken
};
