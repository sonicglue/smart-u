'use strict';
// Modulos de NodeJs
let _ = require('underscore');

module.exports = function(Warehouse) {
  /**
   * @name inStock
   * @description Recupera los productos asignados al almacén.
   * @param {string} idWarehouse Identificador del almacén.
   * @param {function} done Función de callback.
   */
  Warehouse.inStock = function(idWarehouse, done) {
    console.log('Warehouse call inStock');
    let conn = Warehouse.dataSource.connector;
    let params = [idWarehouse];
    let sql = 'SELECT Stock.idProduct, Product.typeName, Product.brandName, P' +
      'roduct.modelName, Product.colorName, Product.variantOption, COUNT(Stoc' +
      'k.idProduct) as stockSize FROM Stock INNER JOIN (SELECT Product.id, Pr' +
      'oductType.name AS typeName, Brand.name AS brandName, ProductModel.name' +
      ' AS modelName, Color.name AS colorName, ProductVariantOption.value AS ' +
      'variantOption FROM Product INNER JOIN ProductType ON Product.idProduct' +
      'Type = ProductType.id INNER JOIN Brand ON Product.idBrand = Brand.id I' +
      'NNER JOIN ProductModel ON Product.idProductModel = ProductModel.id INN' +
      'ER JOIN Color ON Product.idColor = Color.id INNER JOIN ProductVariantO' +
      'ption ON Product.idVariantOption = ProductVariantOption.id) AS Product' +
      ' ON Stock.idProduct = Product.id WHERE Stock.idWarehouse = ? AND (Stoc' +
      'k.status = \'active\' OR Stock.status = \'assigned\') GROUP BY Stock.i' +
      'dProduct, Product.typeName, Product.brandName, Product.modelName, Prod' +
      'uct.colorName, Product.variantOption ORDER BY Product.typeName, Produc' +
      't.brandName, Product.modelName, Product.colorName, Product.variantOpti' +
      'on;';
    return conn.query(sql, params, (err, products) => {
      if (err) return done(err);
      // console.log(products);
      done(null, products);
    });
  };// End inStock
  /**
   * @name addUser
   * @description Función para agregar un usuario al control de acceso del almacén.
   * @param {string} idUser Idenfiticador de usuario.
   * @param {function} done Función de callback.
   */
  Warehouse.prototype.addUser = function(idUser, done) {
    console.log('Warehouse call addUser');
    let WarehouseACL = Warehouse.app.models.WarehouseACL;
    let filter = {where: {idUser: idUser}, order: 'index DESC'};
    let newWACL = {
      idUser: idUser,
      idWarehouse: this.id,
      index: 0};
    WarehouseACL.find(filter, (err, iWACL) => {
      if (err) return done(err);
      newWACL.index = iWACL[0].index + 1;

      let findWACL = _.find(iWACL, walc => {
        return walc.idWarehouse === this.id;
      });

      if (findWACL) {
        // ...si ya tiene acceso
        return done(Warehouse.app.newError(422,
          'El usuario ya tiene acceso a este almacén.'));
      } else {
        // ...no tiene acceso
        WarehouseACL.create(newWACL, (err, wacl) => {
          if (err) return done(err);
          done(null, true);
        });
      }
    });
  };// End addUser
  /**
   * @name delUser
   */
  Warehouse.prototype.delUser = function(idUser, done) {
    console.log('Warehouse call delUser');
    let WarehouseACL = Warehouse.app.models.WarehouseACL;
    WarehouseACL.find({where: {idUser: idUser}}, (err, iWACL) => {
      if (err) return done(err);

      if (iWACL.length === 0) {
        // ...si el idUser está incorrecto
        return done(Warehouse.app.newError(422,
          'El usuario no esta en la lista de acceso.'));
      } else if (iWACL.length === 1) {
        // ...si solo tiene acceso a ese almacén
        return done(Warehouse.app.newError(422,
          'No se puede dejar a este usuario sin almacén.'));
      } else {
        // Recuperar la relación entre usuario y almacén
        let findWACL = _.find(iWACL, walc => {
          return walc.idWarehouse === this.id;
        });
        if (findWACL) {
          WarehouseACL.destroyById(findWACL.id, err => {
            if (err) return done(err);
            done(null, true);
          });
        } else {
          done();
        }
      }
    });
  };// End delUser
};
