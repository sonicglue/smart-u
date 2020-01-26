'use strict';
// Modulos de NodeJs

module.exports = function(Warehouse) {
  /**
   * @name inStock
   * @description Recupera los productos asignados al almacén.
   * @param {string} idWarehouse Identificador del almacén.
   * @param {function} done Función de callback.
   */
  Warehouse.prototype.inStock = function(ctx, done) {
    console.log('Warehouse call inStock');
    let conn = Warehouse.dataSource.connector;
    let params = [ctx.instance.id];
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
};
