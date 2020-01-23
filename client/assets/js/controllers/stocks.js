angular.module('systemax')
  .controller('StockBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      $rootScope.menu = 'stock';
    }
  ])
  /**
   * @description Controlador para la lista de vendedores.
   */
  .controller('StockList', [
    '$scope',
    '$state',
    'Warehouse',
    function($scope, $state, Warehouse) {
      // Variables generales
      // Funciones generales
      /**
       * @name getSellers
       * @description Recupera los almacenes de tipo ruta y sus vendedores.
       */
      function getSellers() {
        var warehouseFilter = {
          include: {
            relation: 'users', scope: {
              where: {type: 'seller'}}},
          where: {
            and: [
              {type: 'seller'},
              {idParent: $scope.currentUser.idWarehouse}]}};
        Warehouse.find({filter: warehouseFilter})
          .$promise
          .then(
            function(warehouses) {
              _.each(warehouses, function(w) {
                _.each(w.users, function(u) {
                  var find = _.find($scope.sellers, function(s) {
                    return s.id === u.id;
                  });
                  if (!find) {
                    $scope.sellers.push(u);
                  }
                });
              });
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getSellers
      // Variables del $scope
      $scope.sellers = [];
      // Funciones del $scope
      /**
       * @name search
       * @description Valida el formulario de vendedores.
       */
      $scope.search = function() {
        $state.go('admin.stock.form', {sellerId: $scope.seller.id});
      };// End search
      // Código principal
      getSellers();
    }
  ])
  /**
   * @description Controlador para el formulario de validación de Stock.
   */
  .controller('StockForm', [
    '$scope',
    '$state',
    '$interval',
    'Stock',
    'SysUser',
    'Warehouse',
    function($scope, $state, $interval, Stock, SysUser, Warehouse) {
      // Variables generales
      var timer = null;
      // Funciones generales
      /**
       * @name getSeller
       * @description Recupera los datos del vendedor.
       * @param {string} idSeller Identificador del vendedor.
       */
      function getSeller(idSeller) {
        var sellerFilter = {
          include: ['clients']
        };
        SysUser.findById({id: idSeller, filter: sellerFilter})
          .$promise
          .then(
            function(seller) {
              $scope.seller = seller;
              $scope.busy = false;
              getStocks(seller.idWarehouse);
              // console.log(seller);
              timer =  $interval(getStocks, 3000, 0, true, seller.idWarehouse);
            },
            function(err) {
              console.log(err);
              $scope.notify('El ejecutivo de venta no es correcto.');
              $state.go('admin.stock.list');
            });
      }// End getSeller
      /**
       * @name getStocks
       * @description Recupera el stock del vendedor.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getStocks(warehouseId) {
        var warehouseFilter = {
          include: {
            relation: 'stocks', scope: {
              include: [
                {relation: 'logs', scope: {
                  where: {event: 'assigned'},
                  limit: 1,
                  order: 'date DESC'}},
                {relation: 'product', scope: {
                  include: {
                    relation: 'model', scope: {
                      include: 'brand'}}}}],
              where: {
                or: [
                  {validate: false},
                  {status: 'guarantee'}]}}}};
        Warehouse.findById({id: warehouseId, filter: warehouseFilter})
          .$promise
          .then(
            function(warehouse) {
              // console.log('almacen:', warehouse);
              processStocks(warehouse.stocks);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getStocks
      /**
       * @name processStocks
       * @description Procesa los stocks para generar la hoja de asignación.
       * @param {object} stocks Arreglo de objetos
       */
      function processStocks(stocks) {
        $scope.products = [];
        $scope.stocks.total = 0;
        $scope.stocks.scanned = 0;
        _.each(stocks, function(stock) {
          $scope.stocks.total++;
          if (stock.scanByAvailable) {
            $scope.stocks.scanned++;
          }
          var findP = _.find($scope.products, function(p) {
            return p.idProductModel === stock.product.idProductModel;
          });
          // Productos para venta
          if (!findP) {
            var tmp = stock.product.name.split(',');
            var newProduct = {
              idProductModel: stock.product.idProductModel,
              name: tmp[0],
              brandName: stock.product.model.brand.name,
              modelName: stock.product.model.name,
              scanned: 0,
              sold: 1,
              total: 1,
              stocks: [],
              guarantees: []};
            if (stock.status !== 'guarantee') {
              newProduct.stocks.push(stock);
            } else {
              newProduct.guarantees.push(stock);
            }
            $scope.products.push(newProduct);
          } else {
            findP.sold++;
            findP.total++;
            if (stock.status !== 'guarantee') {
              findP.stocks.push(stock);
            } else {
              findP.guarantees.push(stock);
            }
          }
        });
        // console.log('productos', $scope.products);
        $scope.products = _.sortBy($scope.products, 'name');
        $scope.busy = false;
      }// End processStocks
      /**
       * @name updStock
       * @description
       * @param {string} stockId Identificador de 
       * @param {object} data 
       */
      function updStock(stockId, data, cb) {
        Stock.prototype$patchAttributes({id: stockId}, data)
          .$promise
          .then(
            function(stock) {
              cb(null, stock);
            },
            function(err) {
              cb(err);
            });
      }// End updStock
      // Variables del $scope
      $scope.busy = true;
      $scope.guarantees = [];
      $scope.input = {};
      $scope.products = [];
      $scope.scanedStock = 0;
      $scope.stocks = {
        total: 0,
        scanned: 0};
      // Extensión del objeto Math
      $scope.Math = window.Math;
      // Funciones del $scope
      /**
       * @name setClient
       * @description 
       * @param {object} stock Objecto con los datos del producto.
       */
      $scope.setClient = function(stock) {
        var objData = {
          idClient: stock.idClient};
        updStock(stock.id, objData, function(err, stock) {
          if (err || !stock) {
            console.log(err);
            $scope.notify(err.data.error.message);
          } else {
            $scope.notify('Cliente asignado.', 'success');
          }
        });
      }// End setClient
      /**
       * @description Función para cambiar el color de los días que tiene un
       * equipo en cambaceo
       * @param {string} date Fecha de asignación.
       */
      $scope.statusDays = function(date) {
        var time = $scope.getDateFormat(date, 'x');
        var today = $scope.getDateFormat(moment(), 'x');
        var day = 86400000;
        var days = (today - time) / day;
        if (days <= 2) return 'daysGreen';
        else if (days <= 5) return 'daysOrange';
        else return 'daysRed';
      }// End statusDays
/******************************************************************************/
      // Watchers
      // Watcher dedicado para cuando se destruye $scope
      $scope.$on('$destroy', function() {
        if (timer) {
          $interval.cancel(timer);
        }
      });// End $on $destroy
      // $watch.busy
      $scope.$watch('busy', function(busy) {
        if (!busy) {
          // ...mover el focus al input
          $('#imei').val('').prop('disabled', false).focus();
        }
      });// End $watch.busy
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getSeller($state.params.sellerId);
      });// End $watch.currentUser
      // Código principal
    }
  ])
  /**
   * @description Controlador para el menú bonificaciones.
   */
  .controller('RefundBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      $rootScope.menu = 'refund';
    }
  ])
  /**
   * @description 
   */
  .controller('RefundList', [
    '$scope',
    'SysUser',
    function($scope, SysUser) {
      // Funciones generales
      function getSellers() {
        var sellerFilter = {
          include: {
            relation: 'stocks', scope: {
              include: ['product', 'client'],
              where: {
                and: [
                  {forRefund: true},
                  {refunded: false}]}}},
          where: {
            and: [
              {idParent: $scope.currentUser.id},
              {type: 'seller'}]}};
        SysUser.find({filter: sellerFilter})
          .$promise
          .then(
            function(sellers) {
              $scope.busy = false;
              processRefunds(sellers);
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getSellers
      /**
       * 
       */
      function processRefunds(sellers) {
        // Recorrer los vendedores
        _.each(sellers, function(seller) {
          if (seller.stocks.length) {
            // Recorrer los stock
            _.each(seller.stocks, function(stock) {
              // ...si tiene stock
              var tmp = {
                id: seller.id,
                name: seller.name,
                lastName: seller.lastName,
                disable: true,
                client: {},
                product: {}};
              var find = _.find($scope.refunds, function(s) {
                return s.product.idProduct === stock.idProduct;
              });
              if (find) {
                // ...incluido en el arreglo
                find.product.totalItems++;
                find.product.total += stock.refundPrice;
              } else {
                // ...no ha sido incluido en la lista
                tmp.client.idClient = stock.idClient;
                tmp.client.name = stock.client.name;
                tmp.client.debt = stock.client.debt;
                tmp.product.idProduct = stock.idProduct;
                tmp.product.name = stock.product.name;
                tmp.product.refundPrice = stock.refundPrice;
                tmp.product.totalItems = 1;
                tmp.product.total = stock.refundPrice;
                $scope.refunds.push(tmp);
              }
            });
          }
        });
      }// End processRefunds
      // Variables del $scope
      $scope.busy = true;
      $scope.sellers = [];
      $scope.refunds = [];
      // Funciones del $scope
      $scope.toggleInput = function(seller) {
        var id = '#' + model.id;
        model.disable = !model.disable;
        if (typeof model.price === 'string') {
          model.price = parseFloat(model.price.replace(/[$,]/g, ''));
        }
        _.each($scope.models, function(m) {
          if (m.id !== model.id) {
            // ...todos menos el que ya está activo
            m.disable = true;
          }
        });
        if (model.disable) {
          $(id).prop({type: 'text', format: 'currency'});
          /*
          updatePrice(model, function(err, result) {
            if (err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            } else if (result) {
              console.log(result);
              $scope.notify('Actualización exitosa', 'success');
            }
          });*/
          //$(id).val(model.price);
        } else {
          var value = parseFloat($(id).val().replace(/[$,]/g, ''));
          $(id).prop({type: 'number', format: 'number', step: 0.01, min: 0});
          $(id).val(value).select();
        }
      };
      // Watchers
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getSellers();
      });
      // Código principal
    }
  ])
  .controller('StockFindBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      $rootScope.menu = 'findStock';
    }
  ])
  .controller('StockFindForm', [
    '$scope',
    'Stock',
    function($scope, Stock) {
      /**
       * @name findByImei
       * @description Búsca un producto por su número de serie/IMEI.
       * @param {string} imei Número de serie para buscar.
       * @param {function} cb Función de callback.
       */
      function findByImei(imei, cb) {
        Stock.findByImei({imei: imei})
          .$promise
          .then(
            function(stock) {
              return cb(null, stock);
            },
            function(err) {
              console.log(err);
              return cb(err);
            });
      }// End findByImei
      // Variables del $scope
      $scope.busy = true;
      $scope.input = {
        IMEI: ''};
      $scope.stock = {};
      // Funciones del $scope
      /**
       * @name initForm
       * @description Vacía la búsqueda y su resultado.
       */
      $scope.initForm = function() {
        $scope.input.IMEI = '';
        $scope.stock = {};
      };// End initForm
      /**
       * @name search
       * @description Valida el formulario de búsqueda.
       */
      $scope.search = function() {
        if ($scope.input.IMEI.length) {
          $scope.busy = true;
          // ...el campo no está vacío
          findByImei($scope.input.IMEI, function(err, stock) {
            $scope.busy = false;
            $scope.input.IMEI = '';
            if (err || !stock) {
              // ...tiene error o esta vacío
              $scope.notify(err.data.error.message);
            } else {
              // ...pasar datos a la vista
              $scope.stock = stock;
            }
          });
        }
      };// End search
      /**
       * @name stockStatus
       * @description Devuelve el estado de un producto.
       * @param {string} status Nombre del status en inglés.
       */
      $scope.stockStatus = function(status) {
        switch (status) {
          case 'create': return 'registro';
          case 'active': return 'en almacén';
          case 'assigned': return 'en ruta';
          case 'sold': return 'vendido';
          case 'in-transit': return 'en traspaso'
          case 'in-guarantee': return 'en garatía';
          case 'canceled': return 'garantía cancelada';
          default: return 'desconocido';
        }
      };// End stockStatus
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        $scope.busy = false;
      });// End $watch.currentUser
      // Código principal
    }
  ]);
/******************************************************************************/