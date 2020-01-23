angular.module('systemax')
  .controller('OrderBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      $rootScope.menu = 'order';
    }
  ])
  /**
   * @description
   */
  .controller('OrderList', [
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
        $state.go('admin.order.form', {sellerId: $scope.seller.id});
      };// End search
      // Código principal
      getSellers();
    }
  ])
  /**
   * @description Controlador para registrar una orden de compra (ventas)
   */
  .controller('OrderForm', [
    '$scope',
    '$state',
    'Order',
    'Stock',
    'SysUser',
    function($scope, $state, Order, Stock, SysUser) {
      // Funciones generales
      /**
       * @name createOrder
       * @description Regitra una orden de compra.
       */
      function createOrder() {
        $scope.busy = true;
        Order.create($scope.order)
          .$promise
          .then(
            function(order) {
              $scope.busy = false;
              $scope.notify('Registro creado satisfactoriamente.',
                'success');
              setEmpty();
              $scope.products = [];
              getSeller($scope.seller.id);
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End createOrder
      /**
       * @name getSeller
       * @description Recupera los datos de un vendedor por su Id.
       * @param {string} sellerId Identificador del vendedor.
       */
      function getSeller(sellerId) {
        // Separar fecha del control
        var tmp = $scope.formFilters.date.split('/');
        var date = tmp[2] + '-' + tmp[1] + '-' + tmp[0];
        var sellerFilter = {
          include: ['clients',
            {relation: 'stocks', scope: {
              include: ['client', 'product'],
              where: {
                and: [
                  {status: 'sold'},
                  {saleDate: {gte: date + ' 00:00:00'}},
                  {saleDate: {lte: date + ' 23:59:59'}}]},
              order: ['IMEI']}}]};
        console.log(sellerFilter);
        SysUser.findById({id: sellerId, filter: sellerFilter})
          .$promise
          .then(
            function(seller) {
              $scope.busy = false;
              $scope.seller = seller;
              $scope.order.idSeller = seller.id;
              getStokForRefund(sellerId);
              processStock(seller.stocks);
              console.log(seller);
            },
            function(err) {
              $scope.busy = false;
              $state.go('admin.order.list');
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getSeller
      // {"fields":["id", "idProduct", "refundPrice", "refundNote"],"include":{"relation": "product", "scope": {"fields":["id", "name"]}},"where":{"and":[{"idClient":"748fd0b0-2e34-11e9-ac3a-f332d32735ac"},{"forRefund":true},{"refunded":false}]},"order":["idProduct", "refundPrice"]}
      function getStokForRefund(clientId) {
        // Filtro de búsqueda
        var stockFilter = {
          fields: ['id', 'idProduct', 'refundPrice', 'refundNote'],
          include: {
            relation: 'product', scope: {
              fields: ['id', 'name']}},
            where: {
              and: [
                {idClient: clientId},
                {forRefund: true},
                {refunded: false}]},
            order: ['idProduct', 'refundPrice DESC']};
        Stock.find({filter: stockFilter})
          .$promise
          .then(
            function(stocks) {
              processRefunds(stocks);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getStockForRefund

      function processRefunds(stocks) {
        var total = 0;
        _.each(stocks, function(stock) {
          var find = _.find($scope.order.refunds, function(r) {
            return r.idProduct === stock.idProduct &&
              r.refundPrice === stock.refundPrice;
          });
          if (find) {
            find.totalItems++;
            find.stocks.push({id: stock.id});
          } else {
            var refund = {
              totalItems: 1,
              idProduct: stock.idProduct,
              name: stock.product.name,
              refundPrice: stock.refundPrice,
              refundNote: stock.refundNote,
              stocks: []};
            refund.stocks.push({id: stock.id});
            $scope.order.refunds.push(refund);
          }
          total += stock.refundPrice;
        });
        $scope.order.payment.refund = total;
      }// End processRefunds
      /**
       * @name processOrder
       * @description Procesa los datos para la orden de compra
       */
      function processOrder() {
        // Inicializar $scope.order
        $scope.order.totalItems = 0;
        $scope.order.total = 0;
        $scope.order.payment.cash = 0;
        $scope.order.payment.deposit = 0;
        $scope.order.payment.check = 0;
        $scope.order.payment.credit = 0;
        $scope.order.payment.refund = 0;
        $scope.order.products = [];
        _.each($scope.products, function(p) {
          // Recorrer cada producto en la lista
          _.each(p.stocks, function(s) {
            var newP = {
            publicPrice: 0,
            salesPrice: 0,
            totalItems: 1,
            total: 0,
            stocks: []};
            refund = s.rewardedPrice;
            // Recorrer cada stock de cada producto
            var newS = {id: s.id};
            if (s.idClient === null && s.confirmSale === true) {
              // ... si no ha sido confirmada la venta y no hay cliente
              var find = _.find($scope.order.products, function(sp) {
                return sp.idProduct === s.idProduct;
              });
              if (!find) {
                // ... no se ha incluido previamente el producto a la orden
                newP.idProduct = s.product.id,
                newP.name = s.product.name,
                newP.stocks.push(newS);
                newP.publicPrice = s.publicPrice;
                newP.salesPrice = s.publicPrice;
                newP.total = s.publicPrice;
                $scope.order.products.push(newP);
              } else {
                // ...ya existe ese producto en la orden
                find.totalItems++;
                find.total = parseFloat((find.totalItems * find.salesPrice).toFixed(2));
                find.stocks.push(newS);
              }
              $scope.order.totalItems++;
              $scope.order.total += s.publicPrice;
            }
          });
        });
        $scope.order.payment.credit = $scope.order.total;
        $scope.order.type = 'sale'
        _.sortBy($scope.order.products, 'name');
      }// End processOrder
      /**
       * @name processStock
       * @description Procesa los datos del inventario del vendedor.
       * @param {array} stocks
       */
      function processStock(stocks) {
        _.each(stocks, function(s) {
          var find = _.find($scope.products, function(p) {
            return s.product.idProductModel === p.idProductModel;
          });
          if (!find) {
            s.product.stocks = [s];
            var tmp = s.product.name.split(',');
            s.product.modelName = tmp[0]
            $scope.products.push(s.product);
          } else {
            find.stocks.push(s);
          }
        });
        $scope.products = _.sortBy($scope.products, 'modelName');
      }// End processStock
      /**
       * @name setEmpty
       * @description Restablece las variables
       */
      function setEmpty() {
        $('form.needs-validation').removeClass('was-validated');
        $scope.order.idClient = null;
        $scope.order.totalItems = 0;
        $scope.order.total = 0;
        $scope.order.payment.cash = 0;
        $scope.order.payment.deposit = 0;
        $scope.order.payment.check = 0;
        $scope.order.payment.credit = 0;
        $scope.order.payment.refund = 0;
        $scope.order.products = [];
        $scope.order.refunds = [];
        $scope.selectAll = false;
        $scope.stockView = false;
        $scope.addAll();
      }// End setEmpty
      /**
       * @name updateTotal
       * @description Actualiza el total de la orden de compra.
       */
      function updateTotal() {
        var deposit = parseFloat($scope.order.payment.deposit);
        var cash = parseFloat($scope.order.payment.cash);
        var check = parseFloat($scope.order.payment.check);
        var refund = parseFloat($scope.order.payment.refund);
        $scope.order.payment.credit =
          parseFloat($scope.order.total) - (deposit + cash + check + refund);
        if ($scope.order.payment.credit < 0) {
          // ...evita pasar numeros negativos
          $scope.order.payment.credit = 0;
        }
      }// End updatetotal
      // Variables del $scope
      $scope.busy = true;
      // Objeto del formulario
      $scope.formFilters = {};
      // Extensión del objeto Math
      $scope.Math = window.Math;
      // Objeto order
      $scope.order = {
        totalItems: 0,
        total: 0,
        payment: {
          cash: 0,
          deposit: 0,
          check: 0,
          credit: 0,
          refund: 0},
        products: [],
        refunds: []};
      // Objeto con el stock
      $scope.products = [];
      // Objeto
      $scope.selectAll = false;
      // Objeto con datos del vendedor
      $scope.seller = undefined;
      // Bandera del view
      $scope.stockView = false;
      // Funciones del $scope
      /**
       * @name addAll
       * @description Selecciona todos los elementos del stock.
       */
      $scope.addAll = function() {
        var tmp = $scope.selectAll;
        _.each($scope.products, function(p) {
          p.check = tmp;
          _.each(p.stocks, function(s) {
            if (!s.idClient) {
              s.confirmSale = tmp;
            }
          });
        });
        processOrder();
      };// End addAll
      /**
       * @name addCheck
       * @description Selecciona un stock.
       */
      $scope.addCheck = function() {
        processOrder();
      };// End addCheck
      /**
       * @name addProduct
       * @description Selecciona todo el stock de un producto.
       * @param {object} product Objeto de producto.
       */
      $scope.addProduct = function(product) {
        var tmp = product.check;
        _.each(product.stocks, function(s) {
          if (!s.idClient) {
            s.confirmSale = tmp;
          }
        });
        processOrder();
      };// End addProduct
      /**
       * @name setDebt
       * @description Devuelve el total de la deuda del cliente.
       */
      $scope.setDebt = function() {
        if (!$scope.order.idClient) return 0;
        var find = _.find($scope.seller.clients, function(client) {
          return client.id === $scope.order.idClient;
        });
        return find.debt;
      };// End setDebt
      /**
       * @name recalculate
       * @description Recalcula el total de los productos comprados.
       * @param {object} product Objeto con los datos del producto.
       */
      $scope.recalculate = function(product) {
        var salesPrice = parseFloat(product.salesPrice);
        if (isNaN(salesPrice)) return;
        if (salesPrice < 0) salesPrice = 0;
        product.total = parseFloat((product.totalItems * salesPrice).toFixed(2));
        var newTotal = 0;
        _.each($scope.order.products, function(p) {
          newTotal += p.total;
        });
        $scope.order.total = newTotal;
        updateTotal();
      };// End recalculate

      $scope.recalculateRefund = function(refund) {
        var total = 0;
        _.each($scope.order.refunds, function(refund) {
          total += refund.refundPrice * refund.totalItems;
        });
        $scope.order.payment.refund = total;
      };// End recalculateRefund
      /**
       * @name save
       * @description Valida el formulario antes de registrar una orden de compra.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        if (!$scope.order.idClient) {
          $scope.notify('No ha seleccionado el cliente de la orden');
          return;
        }
        if (isNaN($scope.order.payment.credit) ||
          parseFloat($scope.order.payment.credit) < 0) {
          $scope.notify('El total de pago no coincide con el total de la ' +
            'orden de compra.');
          return;
        }
       createOrder();
      };// End save
      /**
       * @name toggleView
       * @description Alterna entre la vista de la hoja de cambaceo y la orden
       * de compra.
       */
      $scope.toggleView = function() {
        $scope.stockView = !$scope.stockView;
        if (!$scope.stockView) {
         setEmpty();
        }
      };// End toggleView
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        var today =  moment();
        $scope.formFilters.date = $scope.stringDate(today, '/');
      });// End $watch.currentUser

      $scope.$watch('formFilters.date', function(date) {
        if (!date) return;
        var tmp = date.split('/');
        if (tmp.length === 3) {
          $scope.products = [];
          setEmpty();
          getSeller($state.params.sellerId);
        }
      });// End watch formFilters.date
      //
      $scope.$watch('order.payment.cash', function(cash) {
        if (!cash) return;
        updateTotal();
      });// End watch order.payment.cash
      //
      $scope.$watch('order.payment.deposit', function(deposit) {
        if (!deposit) return;
        updateTotal();
      });// End watch order.payment.cash
      //
      $scope.$watch('order.payment.check', function(check) {
        if (!check) return;
        updateTotal();
      });
      //
      /* $scope.$watch('order.payment.refund', function(refund) {
        if (!refund) return;
        updateTotal();
      }); */
      //
      $scope.$watch('order.idClient', function(client) {
        $scope.order.refunds = [];
        if (!client) return;
        getStokForRefund(client);
      });
      // Código principal
      if (!$state.params.sellerId) {
        $state.go('admin.order.list');
      }

    }
  ]);
/******************************************************************************/
