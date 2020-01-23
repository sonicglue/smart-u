angular.module('systemax')

  .controller('PointOfSaleBlankController', ['$rootScope', '$scope', 'Warehouse', function($rootScope, $scope, Warehouse) {
      $rootScope.menu = 'pointOfSale';
    }
  ])

/**
 * @description Controlador para registrar una venta.
 */
.controller('PointOfSaleFormController', [
  '$scope',
  '$rootScope',
  '$state',
  'SysUser',
  'Stock',
  '$stateParams',
  'SellerHasClient',
  'Warehouse',
  'Billing',
  'Order',
  'Payment',
  '$window',
  '$timeout',
  'DTOptionsBuilder',
  'DTColumnBuilder',
  'DTColumnDefBuilder',
  function($scope, $rootScope, $state,  SysUser, Stock, $stateParams, SellerHasClient, Warehouse, Billing, Order, Payment, $window, $timeout, DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder) {
    var negative = document.getElementById('negative');
    var positive = document.getElementById('positive');
    $('#imei').focus(); //Focus by default input IMEI
    $scope.input = {
      lastSerie: ''
    };
    $scope.order = { //...Objeto para almacenar la orden de venta
      totalItems: 0,
      total: 0,
      payment: {
        cash: 0,
        deposit: 0,
        check: 0,
        credit: 0,
        refund: 0},
      products: [],
      refunds: []
    };
    $scope.order.idSeller = $rootScope.currentUser.id; //ID del ejecutivo/vendedor
    $scope.myClients = []; //Lista de clientes que tiene asignado el gerente
    $scope.dateToday = moment().format('L'); //Fecha actual DD/MM/YYYY
    $scope.listSaleToday = []; //Array ventas del día
    $scope.totalSaleToday = 0; //Total ventas del día
    $scope.printView = false; //Mostrar la nota de remisión para el cliente
    $scope.printPaymentView = false; //Mostrar la nota de abono para el cliente
    $scope.saleView = false; //Mostrar todas las ventas
    $scope.stockView = false; //Vista del inventario del vendedor
    $scope.soldView = false; //Vista detalle de la venta
    $scope.payment = 0; //Total del abono
    $scope.newDebt = 0; //Nueva deuda del cliente
    $scope.note = [] //Arreglo de productos para la nota de remisión
    $scope.newDebt = 0; //Nueva deuda del cliente
    $scope.currentDebt = 0; //Deuda actual del cliente
    $scope.selectClient = '';
    $scope.listOrders = [];
    $scope.loading = false; //Indicador para cargar

    /**
     * @name getStockSeller
     * @description Devuelve el equipo asignado al usuario.
     * @param {string} userId Id del usuario del que se requiere el almacén.
     */
    function getStockSeller (userId){
      let filter = {
        include: {
          relation: 'warehouseACL',
          scope: { include: { relation: 'warehouse', scope: {
           include: {
            relation: 'stocks',
             scope: {
               where: { and: [{ or: [{status: 'active'}]},{validate: false}]},
               include: ['product', {
                 relation: 'logs', scope: {
                   where: { event: 'active'}}}],
                   order: 'idProduct'}}}},
                   limit: 1,
                   order: 'index'}}};

            SysUser.findById({id: userId, filter: filter})
              .$promise
              .then(
                function(warehouses) {
                  //console.log("Stock del almacén", warehouses);
                  processStockSeller(warehouses);
                },
                function(err) {
                  console.log(err);
                });
    }
    getStockSeller($rootScope.currentUser.id);

    function processStockSeller(stockSeller){
      let warehouse = stockSeller.warehouseACL[0].warehouse;
      let arrayStock = [] //Array del stock del vendedor
      let totalStockSeller = 0;

      //console.log("processStockSeller", warehouse);
      _.each(warehouse.stocks, stock => {
        var find = _.find(arrayStock, function(p) {
          return p.idProductModel === stock.product.idProductModel;
        });

        if (!find) {
          var newProduct = {
            idProductModel: stock.product.idProductModel,
            model: stock.product.name,
            price: stock.publicPrice,
            pieces: 1,
            //stock:[stock.IMEI]
          }
          arrayStock.push(newProduct)
        }else {
          //find.stock.push(stock.IMEI);
          find.pieces++;
        }
        totalStockSeller++;
      })
      $scope.arrayStock = arrayStock;
      $scope.arrayStock = _.sortBy($scope.arrayStock, 'model');
      $scope.totalStockSeller = totalStockSeller;
    }

    /**
     * @name searchOrder
     * @description Buscar una orden de venta.
     * @param {string} idOrder Número de orden a buscar.
     */
    $scope.searchOrder = function(idOrder){
      $scope.saleView = !$scope.saleView;
      $scope.soldView = !$scope.soldView;
        findOrder(idOrder, function(err, iOrder) {
          if (err) {
            console.log("No se encontró la orden de venta", err);
          }
          else {
            console.log("Se encontró la orden de venta", iOrder);
            $scope.sale = iOrder;
          }
        });
    }

    /**
     * @name findOrder
     * @description Busca orden de venta.
     * @param {string} idOrder Número de orden a buscar.
     * @callback {callback} cb callback
     */
     function findOrder(idOrder, cb) {
       var errorMessage;
       var saleFilter = {
         include: [
           {relation: 'client', scope: {
             include: {relation: 'payments', scope: {where: {idOrder: idOrder}}}
           }},
         {relation: 'orderhasproduct', scope: {
           include: {relation: 'product', scope: {
             include: {
               relation: 'stocks', scope: {where: {status: 'sold'}}
             }
           }}
         }},
         'seller']
       };
       Order.findById({id: idOrder, filter: saleFilter}).$promise.
        then(
         function(sale) {
           cb(null, sale);
         },
         function(err) {
           console.log(err);
           cb(null, err);
         });
     }

    /**
     * @name getRoutes
     * @description Recupera los datos de las rutas de venta.
     * @param {string} parentId Identificador del almacén padre.
     */
    function getRoutes(parentId) {
      var warehouseFilter = {
        include: [
          {relation: 'stocks', scope: {
            include: [{relation: 'product', scope: {include: 'model'}}],
            where: {
              and: [
                {status: 'active'},
                {validate: false}]},
            order: ['IMEI']
          }}],
        where: {
          and: [
            {type: 'place'},
            {id: parentId}]},
        order: ['name']
      };
      Warehouse.find({filter: warehouseFilter})
        .$promise
        .then(
          function(warehouses) {
            $scope.busy = false;
            $scope.foundWarehouse = warehouses[0];
            console.log("Almacén encontrada 23", $scope.foundWarehouse);
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    }// End getRoutes

    /**
     * @name getmyClients
     * @description Obtiene la lista de clientes que tiene asignado el vendedor.
     */
    function getmyClients() {
      var filter = {
        where: { idSeller:$rootScope.currentUser.id },
        include: [{ relation: "client", scope: { fields: [ "id", "name", "debt" ] } }]
      };

       SellerHasClient.find({filter: filter }).$promise .then(
         function(myClients) {
           //console.log("Mis clientes", myClients);
           _.each(myClients, function(client) {
             $scope.myClients.push({
               id: client.client.id,
               tag: client.client.name,
               debt: client.client.debt
             })
           });
           $scope.myClients.push({
             id: "-new-",
             tag: "-- SELECCIONAR CLIENTE --",
             debt: "0.00"
           });
           $scope.order.idClient = $scope.myClients[$scope.myClients.length-1].id;
           //console.log('El vendedor tiene asignado los siguientes clientes:',$scope.myClients)
        },
        function(err) {
          console.log(err);
          //$scope.notify(err.data.error.message);
        });
     }// End getmyClients*/

     /**
      * @name getClients
      * @description Recupera los datos de los clientes que pertenecen a la tienda.
      */
     function getClients() {
       var pFilter = {where: {class: 'client', customerStore: true}, order: ['name']};
       Billing.find({filter: pFilter})
         .$promise
         .then(function(billings) {
           _.each(billings, function(client) {
             $scope.myClients.push({
               id: client.id,
               tag: client.name,
               debt: client.debt
             })
           });
           $scope.myClients.push({
             id: "-new-",
             tag: "-- SELECCIONAR CLIENTE --",
             debt: "0.00"
           });
           $scope.order.idClient = $scope.myClients[$scope.myClients.length-1].id;
           $scope.order.tag = $scope.myClients[$scope.myClients.length-1].tag;
           console.log("Lista de clientes", $scope.myClients);
          },
          function(err) {
           console.log(err);
           $scope.notify(err.data.error.message);
          });
     }// End getClients

     $scope.itemClient = function(client) {
       console.log("Cliente seleccionado", client);
       $scope.order.tag = client.tag;
       $scope.order.idClient = client.id;
     }

     /**
      * @name allSaleToday
      * @description Obtiene todas las ventas del día.
      */
     function allSaleToday(){
       var paymentFilter = {
         where: {
           and: [
             {idSeller: $rootScope.currentUser.id},
             {date: {gte: $scope.dateToday + ' 00:00:00'}},
             {date: {lte: $scope.dateToday + ' 23:59:59'}}]},
             include: [{relation: 'client',
              scope: {fields: ['id', 'name', 'lastName', 'email', 'debt', 'reference']}},
             {relation: 'seller',
              scope: {fields: ['name', 'lastName']}},
              {relation: 'order', scope: {
                include: {relation: 'products', scope: {
                  include: ['color',
                    {relation: 'model', scope: {
                      include: 'brand'}}]}}
              }}
            ]
       }

       let saleFilter = {
         where: {
           and: [
             {idSeller: $rootScope.currentUser.id},
             {created: {gte: $scope.dateToday + ' 00:00:00'}},
             {created: {lte: $scope.dateToday + ' 23:59:59'}}]},
             include: [
               {relation: 'client', scope: {
                 include: {relation: 'payments'}
               }}
             ]
       };
       Payment.find({ filter: paymentFilter})
       //Order.find({filter: saleFilter})
        .$promise
         .then(
           function(sale) {
             console.log("Lista de todas las ventas", sale);
             if (sale.length > 0) {
               processOrder(sale);
             }
           },
           function(err) {
             console.log(err);
           });
         }


         /**
         * @name processOrder
         * @description Procesa todas las ventas.
         * @param {object} orders Objeto con todas las ventas.
         */
         function processOrder(orders){
           console.log("processOrder 1242", orders);
           let listOrders = [];
           let totalSaleToday = 0;
           _.each(orders, function(item) {
             var find = _.find(listOrders, function(p) {
               return p.id === item.order.id;
             });

             if (!find) {
               let newOrder = {
                 id: item.idOrder,
                 orderNumber: item.order.orderNumber,
                 client: item.client.name,
                 date: moment(item.order.created).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A'),
                 total: item.order.total,
                 type: item.order.type
               }
               listOrders.push(newOrder);
             }else { }

             if (item.index === 1 && item.status === 'paid') {
               totalSaleToday += item.amount; //Efectivo
             } else if (item.index === 2 && item.status === 'paid') {
               totalSaleToday += item.amount; //Cheque
             } else if (item.index === 3 && item.status === 'paid') {
               totalSaleToday += item.amount; //Deposito
             }
            })
            $scope.totalSaleToday = totalSaleToday;
            listOrders = _.sortBy(listOrders, function(o) { return new moment(o.date).format('YYYYMMDD'); }).reverse();
            $scope.listOrders = listOrders;
            console.log("Lista de ordenes de venta procesados", $scope.listOrders);
         }

    /**
     * @name setDebt
     * @description Devuelve el total de la deuda del cliente.
     */
    $scope.setDebt = function() {
      if (!$scope.order.idClient) return;
      var find = _.find($scope.myClients, function(client) {
        return client.id === $scope.order.idClient;
      });
      $scope.currentDebt = parseFloat(find.debt);
      $scope.selectClient = find.tag;
    };// End setDebt


    /*================Llamada de funciones===============*/
    getRoutes($state.params.idWarehouse);
    //getmyClients();
    getClients();
    allSaleToday();
    /*================ $scope.watch ==================*/
     $scope.$watch('order.idClient', function(c) {
       if (!c) return;
       $scope.setDebt(c);
       updateTotal();
     });//End watch order.idClient
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
     }); // End watch order.payment.check


    /**
     * @name getStock
     * @description Busca en el almacén el número de serie  que tiene asignado el vendedor
     * @param {string} imei Número de serie del producto asignado.
     * @param {object} warehouse Ojbeto con la información del almacén
     * @callback {object} stock Objeto con el stock
     */
     function getStock(imei, warehouse, cb) {
       //console.log("getStock(idWarehouse)--->", warehouse);
       var filter = {
         include: 'product',
         where: {
           and:[{IMEI: imei},
                {idWarehouse: warehouse},
                {status: "active", validate: false}
               ]}};
        Stock.findOne({filter: filter})
         .$promise
         .then(
           function(stock) {
             cb(null, stock);
           },
           function(err) {
             cb(err);
           });
     }// End getStock

     /**
      * @name insertStock
      * @description
      * @param {string} imei IMEI del equipo
      * @param {object} warehouse Objeto del almacén
      */
    function insertStock(imei, warehouse) {
      //console.log("insertStock(idWarehouse)--->", warehouse);
      getStock(imei, warehouse, function(err, stock) {
        if (err) {
          //$('#imei').prop('disabled', true);
          $('#imei').val('').prop('disabled', true).focus();
          $scope.showModal('fa-info',
            'No se encontró el número de serie',
            '<p>El equipo búscado no se encuentró en' + '<b>' +' '+  $scope.foundWarehouse.name + '</b></p>' +
            '<p>Vuelva a escanear el código de barras.</p>',
            {hideCancel: true},
            function() {
              //
            });
          negative.play();
        } else {
          //console.log("IMEI encontrado para agregarlo a la venta", stock);
          findImei(imei, stock, function(err, iFind) {
            //console.log("Respuesta exitosa-->findImei", iFind);
            if (iFind === "200") {
              $scope.showModal('fa-warning',
                'IMEI dúplicado',
                '<p>El IMEI:' +' '+ '<b>' + imei + ' '+ '</b>'+ 'ya ha sido capturado previamente</p>',
                {hideCancel: true},
                function() {
                  //
                });
              negative.play();
            }else {
              $scope.input.lastSerie = stock.IMEI;
              processStocks(stock);
            }
          });
        }
      });
    }// End insertStock


    /**
     * @name findImei
     * @description Busca el imei si coincide con alguno que ya se haya agregado previamente.
     * @param {string} imei Número de serie del producto asignado.
     * @param {object} stock Ojbeto con el stock
     * @callback {callback} cb callback
     */
     function findImei(imei, stock, cb) {
       var errorMessage;
       //console.log("findImei", stock);
       var find = _.find($scope.order.products, function(p) {
         return p.idProductModel === stock.product.idProductModel;
       });
       //console.log("find-->findImei", find);
       if (!find) {
         errorMessage = "404";
         cb(null, errorMessage); //Not found model equipment
       }
       else {
         var findStock = _.find(find.stocks, function(s) {
           return s.imei === imei;
         });
         if (!findStock) {
           errorMessage = "404"; //Not found IMEI
           cb(null, errorMessage);
         }else {
           errorMessage = "200"; //Found IMEI
           cb(null, errorMessage);
         }
       }
     }


    /**
     * @name processStocks
     * @description Procesa los stocks para generar la hoja de asignación.
     * @param {object} stocks Arreglo de objetos
     */
    function processStocks(stocks) {
      //console.log("processStocks", stocks);
      var find = _.find($scope.order.products, function(p) {
        return p.idProductModel === stocks.product.idProductModel;
      });

      if (!find) {
        var tmp = stocks.product.name.split(',');
        var newProduct = {
          idProductModel: stocks.product.idProductModel,
          idProduct:  stocks.idProduct,
          publicPrice: stocks.publicPrice,
          salesPrice: stocks.publicPrice,
          name: tmp[0],
          totalItems: 1,
          total: stocks.publicPrice,
          stocks: [{id: stocks.id, imei: stocks.IMEI}]};
          $scope.order.products.push(newProduct);
          $scope.order.total += parseFloat(stocks.publicPrice);
      } else {
        $scope.order.total += parseFloat(find.salesPrice);
        find.stocks.push({id: stocks.id, imei: stocks.IMEI});
        find.totalItems++;
        find.total = parseFloat((find.totalItems * find.salesPrice).toFixed(2));
      }
      $scope.order.totalItems++;
      //$scope.order.total += stocks.publicPrice;
      $scope.order.payment.credit = parseFloat($scope.order.total);
      $scope.order.products = _.sortBy($scope.order.products, 'name');
      //console.log("Orden de venta", $scope.order);
    }// End processStocks

    /**
     * @name deleteStock
     * @description Valida el stock para eliminarlo.
     * @param {string} IMEI Número de serie/IMEI del stock.
     * @param {object} warehouse Objeto del almacén origen.
     */
    function deleteStock(imei) {
      //console.log("IMEI a eliminar", imei);
      var aux = $scope.order.products;
      removeStock(imei, aux, function(err, iFind) {
        //console.log("Respuesta exitosa-->findImei", iFind);
        if (iFind === "200") {
          $scope.notify('El IMEI' +' '+ imei +' '+  ' ha sido eliminado correctamente.', 'success');
          $scope.input.toggleSave = false;
          updateNote(aux);
          updateTotal();
          return;
          //console.log("Después de eliminar un imei", $scope.order.products);
        }else {
          //$scope.notify('El IMEI' +' '+ imei +' '+  'no se pudo encontrar.');
          return;
        }
      });
    }


    function removeStock(imei, products, cb) {
      var errorMessage;
      //console.log("Array para procesarlo-->remove", products);
      _.each(products, function(product, index) {
        //console.log("Mis productos para eliminar", product.stocks);
        // get index of object with imei: imei
        removeIndex = product.stocks.map(function(item) { return item.imei; }).indexOf(imei);

        //Eliminar el imei
        if (removeIndex !== -1) {
          //console.log("removeIndex", removeIndex);
          product.stocks.splice(removeIndex, 1);
          //Si el producto ya no tiene stock, se debe eliminar de la lista
          if (product.stocks.length === 0) {
            products.splice(index, 1);
          }
          errorMessage = "200"; //Found IMEI
          cb(null, errorMessage);
        }else {
          errorMessage = "404"; //Not found IMEI
          cb(null, errorMessage);
        }
      });
    }

    function updateNote(products){
      _.each(products, function(product, index) {
         product.total = product.stocks.length * product.salesPrice;
         product.totalItems = product.stocks.length;
      })
      $scope.order.products = products;
    }

    /**
     * @name deleteModalProduct
     * @description Modal para confirmar la eliminación de un producto.
     * @param {object} product Información del producto a eliminar.
     * @param {integer} index Index del producto a eliminar.
     */
    $scope.deleteModalProduct = function(product, index) {
      //console.log("Información del producto a eliminar", product);
      $scope.showModal('g-user',
        'Eliminar producto.',
        '¿Desea eliminar el producto <b>' + product.name + '</b>?',
        {acceptLabel: 'Eliminar', acceptClass: 'btn-danger'},
        function() {
          deleteItemProduct(product, index);
        });
    };// End deleteUser

    /**
     * @name deleteItemProduct
     * @description Función para eliminar el producto.
     * @param {object} product Información del producto a eliminar.
     * @param {integer} index Index del producto a eliminar.
     */
    function deleteItemProduct(product, index) {
      $scope.order.products.splice(index, 1);
      updateTotal();
    }


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

    /**
     * @name updateTotal
     * @description Actualiza el total de la orden de compra.
     */
    function updateTotal() {
      var deposit = parseFloat($scope.order.payment.deposit);
      var cash = parseFloat($scope.order.payment.cash);
      var check = parseFloat($scope.order.payment.check);
      var refund = parseFloat($scope.order.payment.refund);
      var amountPayment, isPayment;

      // Sumar todos los items del carrito
      let total = 0 // El total se pone en 0 por sí había datos agregados previamente

      // Se recorre el carrito de compra
      _.each($scope.order.products, function(p) {
        total = total + (p.salesPrice * p.totalItems)
      });
      $scope.order.total = total;

      amountPayment = (parseFloat(deposit) + parseFloat(cash) + parseFloat(check))
      if (parseFloat(amountPayment) > parseFloat(total)) {
        isPayment = parseFloat(amountPayment) - parseFloat(total);
        $scope.payment = isPayment;
        $scope.newDebt = parseFloat($scope.currentDebt) - parseFloat(isPayment) //Nueva deuda del cliente
      }else {
        isPayment = 0;
        $scope.payment = isPayment;
        $scope.newDebt = parseFloat($scope.currentDebt) //Nueva deuda del cliente
      }

      $scope.order.payment.credit =
        parseFloat($scope.order.total) - (deposit + cash + check + refund);
      if ($scope.order.payment.credit < 0) {
        // ...evita pasar numeros negativos
        $scope.order.payment.credit = 0;
      }
    }// End updatetotal

     /**
      * @name save
      * @description Prepara los datos para la actualización.
      */
     $scope.search = function() {
       $('#imei').prop('disabled', true);
       var imei = $scope.input.serie;

       if ($scope.input.serie) {
         if ($scope.input.toggleSave) {
           // ...debe eliminar
           deleteStock(imei);
         } else {
           // ...debe registrar
           insertStock(imei, $scope.foundWarehouse.id);
         }
       } else {
         // ...no se agrega
         $('#imei').prop('disabled', true);
         // ...ya fue registrado en la base de datos
         $scope.showModal('fa-warning',
           'Error de captura',
           '<p><b>El tamaño del IMEI no es el adecuado</b></p>',
           {hideCancel: true},
           function() {
             //
           });
         negative.play();
       }
       //$scope.input.lastSerie = imei;
       $scope.input.serie = '';
       $('#imei').val('').prop('disabled', false).focus();
     };// End save



     /**
      * @name save
      * @description Valida el formulario antes de registrar una orden de compra.
      */
     $scope.save = function() {
       if (!$scope.order.idClient || $scope.order.idClient === "-new-") {
         $scope.notify('No ha seleccionado el cliente de la orden');
         return;
       }

       if ($scope.order.products.length > 0) {
         $scope.order.type = 'sale';
         if (isNaN($scope.order.payment.credit) ||
           parseFloat($scope.order.payment.credit) < 0) {
           $scope.notify('El total de pago no coincide con el total de la ' +
             'orden de compra.');
           return;
         }
       } else {
         $scope.order.type = 'payment';
       }
       //console.log("Datos de la orden de compra", $scope.order);
       createOrder();
     };// End save


     /**
      * @name createOrder
      * @description Regitra una orden de compra.
      */
     function createOrder() {
       Order.create($scope.order)
         .$promise
         .then(
           function(order) {
             //console.log("Respuesta del registro de venta", order);
             $scope.notify('Registro creado satisfactoriamente.',
               'success');
             if (order.type === 'sale') {
               $scope.printView = true;
               processNote();
             }else {
               $scope.printPaymentView = true;
             }
           },
           function(err) {
             $scope.loading = false;
             console.log("Mensaje de error", err);
             $scope.notify(err.data.error.message);
           });
     }// End createOrder


     function processNote(){
       _.each($scope.order.products, function(product) {
         var newProduct = {
           salesPrice: product.salesPrice,
           name: product.name,
           totalItems: product.totalItems,
           total: product.total,
           stocks:[]
         };
         _.each(product.stocks, function(stock) {
           newProduct.stocks.push(stock.imei);
         })
         $scope.note.push(newProduct);
       });
       //console.log("Productos para la nota de remisión", $scope.note);
     }

     /**
      * @name setEmpty
      * @description Restablece las variables
      */
       $scope.setEmpty = function() {
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
         $scope.printView = false;
         $scope.printPaymentView = false;
         $scope.payment = 0;
         $scope.newDebt = 0;
         $scope.note = [];
         $scope.newDebt = 0;
         $scope.currentDebt = 0;
         $scope.selectClient = '';
         $scope.input = {
           lastSerie: ''
         };
         $window.location.reload(); //Refresh browser
     }// End setEmpty

     $('#genericModal').on('hidden.bs.modal', function(e) {
       $('#imei').val('').prop('disabled', false).focus();
     });
}])


.controller('PointOfSaleDashboardController', [
  '$rootScope',
  '$scope',
  'Warehouse',
  'SysUser',
  'Payment',
  'Order',
  'DTOptionsBuilder',
  'DTColumnBuilder',
  'DTColumnDefBuilder',
  function($rootScope,
    $scope,
    Warehouse,
    SysUser,
    Payment,
    Order,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTColumnDefBuilder) {

    /*Declaración de variables $scope*/
    $scope.dateToday = moment().format('L');
    $scope.listOrders = [] //Lista de ordenes de venta
    $scope.listAllOrders = [] //Lista de todas las ordenes de venta
    $scope.stock = 0; //Total stock del almacén
    $scope.totalSaleToday = 0; //Total de las ventas del día
    $scope.soldView = false; //Vista para las ventas del día
    $scope.stockView = false //Vista para ver el stock del almacén
    $scope.boxCutView = false //Vista para el corte de caja
    $scope.pendingPaymentView = false //Vista para pagos pendientes
    $scope.soldProducts = [] //Equipos vendidos
    $scope.totalCash = 0; //Total efectivo
    $scope.totalCredit = 0; //Total crédito
    $scope.totalDeposit = 0; //Total deposito
    $scope.totalPendingDeposit = 0; //Monto pendiente del deposito
    $scope.totalCheck = 0; //Total cheque
    $scope.totalPendingCheck = 0; //Monto pendiente del cheque
    $scope.amountCutBox = 0; //Monto total del corte de caja
    $scope.listPendingPayment = [] //Array de pagos pendientes
    $scope.amountPendingPayment = 0 //Monto de pagos pendientes
    $scope.payments = [];
    $scope.seller = {}; //Almacenar el ejecutivo seleccionado
    $scope.products = undefined; //Lista de stock que tiene el almacén
    $scope.warehouse = undefined; //Objeto del almacén
    $scope.warehouses = [];
    $scope.store = {};

    /**
     * @name getManager
     * @description Recupera los datos de los gerentes
     */
    function getManager() {
      var pFilter = {where: {type: 'manager'}};
      SysUser.find({filter: pFilter})
        .$promise
        .then(
          function(manager) {
            $scope.manager = manager;
            //console.log('TODOS LOS GERENTES', manager);
            getmySellers(manager);
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    }// End getManager
    /**
     * @name getWarehouses
     * @description Recupera los datos de los almacenes registrados tipo "lugar".
     */
    function getWarehouses() {
      var warehouseFilter = {
        where: {type: 'place'},
        order: ['isMain DESC', 'name']};

      Warehouse.find({filter: warehouseFilter})
        .$promise
        .then(
          function(warehouses) {
            $scope.warehouses = warehouses;
            $scope.warehouses.push({
              id: "-new-",
              name: "-- SELECCIONAR ALMACEN --",
            });
            $scope.store.idWarehouse = $scope.warehouses[$scope.warehouses.length-1].id;
            $scope.warehouses = _.sortBy($scope.warehouses, 'name');
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    }// End getWarehouses
    /**
     * @name getProducts
     * @description Recupera los datos de los productos del almacén.
     * @param {string} warehouseId Identificador del almacén.
     */
    function getProducts(warehouseId) {
      Warehouse.inStock({id: warehouseId})
        .$promise
        .then(
          function (products) {
            let stockSize = 0;
            _.each(products, function(prod) {
              stockSize += prod.stockSize;
            })
            $scope.stock = stockSize;
            $scope.productsWarehouse = products;
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    }// End getProducts

    /**
    * @name getSellers
    * @description Recupera todos los vendedores que tiene asignado el gerente.
    * @param {string} id ID del gerente.
    */
     function getmySellers(id) {
       SysUser.find({filter:{where:{and:[{type:'seller', idParent:id}]}}}).$promise
        .then(
           function(mysellers) {
             //console.log('Gerente que tiene asignado los siguientes vendedores', mysellers)
             $scope.mysellers = mysellers;
             $scope.mysellers.push({
               id: "-new-",
               name: "-- VENTA GENERAL --"
             });
             $scope.seller.idSeller = $scope.mysellers[$scope.mysellers.length-1].id;
             var arraySeller = [];
             _.each(mysellers, function(seller) {
               arraySeller.push(seller.id);
             })
             getSoldToday(arraySeller); //Obtener ventas del día
             getAllSales(arraySeller); //Obtener todas las ventas
        },
       function(err) {
           console.log(err);
           $scope.notify(err.data.error.message);
       });
     }// End getUser*/

     /**
     * @name proccessSoldSeller
     * @description Procesa las ventas del ejecutivo seleccionado.
     * @param {string} seller ID del ejecutivo.
     */
     function proccessSoldSeller(seller){
       var data = {
         date: $scope.dateToday,
         sellers: [seller]
       }
       Payment.getSold({data: data}).$promise
         .then(
           function(response) {
             //console.log("Respuesta de las ventas-->", response);
             $scope.orders = response;
             $scope.orders = _.sortBy($scope.orders, 'orderNumber');
             processOrder($scope.orders);
             processBoxCut($scope.orders);
             processPendingPayment($scope.orders);
             processFormatConciliation($scope.orders);
           },
           function(err) {
             console.log(err);
             $scope.notify(err.data.error.message);
           });
     }
      /**
      * @name processOrder
      * @description Procesa todas las ventas.
      * @param {object} orders Objeto con todas las ventas.
      */
      function processOrder(orders){
        console.log("processOrder 1242", orders);
        let listOrders = [];
        let totalSaleToday = 0;
        _.each(orders, function(item) {
          var find = _.find(listOrders, function(p) {
            return p.id === item.order.id;
          });

          if (!find) {
            let newOrder = {
              id: item.idOrder,
              orderNumber: item.order.orderNumber,
              seller: item.seller.name +' '+ item.seller.lastName,
              client: item.client.name,
              date: moment(item.order.created).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A'),
              total: item.order.total,
              type: item.order.type
              //status: item.order.status
            }
            listOrders.push(newOrder);
          }else { }

          if (item.index === 1 && item.status === 'paid') {
            totalSaleToday += item.amount; //Efectivo
          } else if (item.index === 2 && item.status === 'paid') {
            totalSaleToday += item.amount; //Cheque
          } else if (item.index === 3 && item.status === 'paid') {
            totalSaleToday += item.amount; //Deposito
          }
         })
         $scope.totalSaleToday = totalSaleToday;
         listOrders = _.sortBy(listOrders, function(o) { return new moment(o.date).format('YYYYMMDD'); }).reverse();
         $scope.listOrders = listOrders;
         console.log("Lista de ordenes de venta procesados", $scope.listOrders);
      }

      /**
      * @name processBoxCut
      * @description Procesa el corte de caja.
      * @param {object} orders Objeto con todas las ventas.
      */
      function processBoxCut(orders){
        console.log("processBoxCut", orders);
        let totalCredit = 0, totalCash = 0, totalCheck = 0,
            totalDeposit = 0, amountCutBox = 0, totalPendingCheck = 0,
            totalPendingDeposit = 0, soldProducts = [];

        _.each(orders, function(order, index) {
          //if (order.index === 0) {
          if (order.order.credit > 0) {
            //totalCredit += order.amount; //Total crédito
            totalCredit += order.order.credit; //Total crédito
          } else if (order.index === 1) {
            totalCash += order.amount; //Total efectivo
            amountCutBox += order.amount;
          } else if (order.index === 2 && order.status === 'paid') {
            totalCheck += order.amount; //Total cheque
            amountCutBox += order.amount;
          } else if (order.index === 3 && order.status === 'paid') {
            totalDeposit += order.amount; //Total deposito
            amountCutBox += order.amount;
          }else if (order.index === 2 && order.status === 'pending') {
            totalPendingCheck += order.amount;
          }else if (order.index === 3 && order.status === 'pending') {
            totalPendingDeposit += order.amount;
          }

          if (order.order.orderhasproduct.length) {
            _.each(order.order.orderhasproduct, function(product) {
              var find = _.find(soldProducts, function(p) {
                return p.idProductModel === product.product.idProductModel;
              });

              if (!find) {
                var tmp = product.product.name.split(',');
                var newProduct = {
                  idProductModel: product.product.idProductModel,
                  brand: product.product.model.brand.name,
                  model: product.product.model.name,
                  color: product.product.color.name,
                  name: tmp[0],
                  totalSold: 1,
                };
                soldProducts.push(newProduct);
              } else {
                find.totalSold++;
              }
            })
          }
        })
        $scope.soldProducts = soldProducts;
        $scope.totalCreditCut = totalCredit;
        $scope.totalCashCut = totalCash;
        $scope.totalCheckCut = totalCheck;
        $scope.totalDepositCut = totalDeposit;
        $scope.amountCutBox = amountCutBox;
        $scope.totalPendingCheck = totalPendingCheck;
        $scope.totalPendingDeposit = totalPendingDeposit;
      }
      /**
      * @name processPendingPayment
      * @description Procesa los pagos pendientes.
      * @param {object} orders Objeto con todas las ventas.
      */
      function processPendingPayment(orders){
        //console.log("processPendingPayment", orders);
        let listPendingPayment = [], amountPendingPayment = 0;
        _.each(orders, function(order, index) {
          if (order.index === 2 && order.status === 'pending' || order.index === 3 && order.status === 'pending') {
            var newOrder = {
              id: order.order.id,
              orderNumber: order.order.orderNumber,
              client: order.client.name,
              date: moment(order.order.created).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A'),
              total: order.amount,
              type: order.order.type,
              typePayment: order.type,
              status: order.status
            };
            listPendingPayment.push(newOrder);
          }
          if (order.index === 2 && order.status === 'pending' || order.index === 3 && order.status === 'pending') {
            amountPendingPayment += order.amount;
          }
         })
         $scope.listPendingPayment = listPendingPayment;
         $scope.amountPendingPayment = amountPendingPayment;
      }
      /**
      * @name processFormatConciliation
      * @description Procesa el corte de venta.
      * @param {object} order Objeto de la orden
      */
      function processFormatConciliation(arrayOrder){
        console.log("processFormatConciliation", arrayOrder);
        var totalCredit = 0,
            totalCash = 0,
            totalCheck = 0,
            totalDeposit = 0,
            totalPayment = 0, amountPayment= 0, amountPending = 0,
            amountCutBox = 0, totalPendingCheck = 0,
            totalPendingDeposit = 0, formatConciliation = [];

            _.each(arrayOrder, function(payment, index) {
              //console.log("Pago", payment);

                //... Paso 1: Buscar el idCliente si existen en el arreglo.
                var findClient = _.find(formatConciliation, function(p) {
                  return p.idClient === payment.client.id;
                });

                //... Paso 2: El cliente no existe
                if (!findClient) {
                  //console.log("No se encontró el cliente", findClient);
                  var newClient = {
                    id: payment.order.id,
                    idClient: payment.client.id,
                    orderNumber: payment.order.orderNumber,
                    nameSeller: payment.seller.name +' '+ payment.seller.lastName,
                    nameClient: payment.client.name,
                    currentDebt: payment.client.debt,
                    previousDebt: payment.previousDebt,
                    credit: payment.order.credit, //payment.index === 0 && payment.status === 'paid' ? parseFloat(payment.amount) : 0,
                    cash: payment.index === 1 && payment.status === 'paid' ? parseFloat(payment.amount) : 0,
                    check: payment.index === 2 && payment.status === 'pending' ? payment.amount : 0,
                    deposit: payment.index === 3 && payment.status === 'pending' ? payment.amount : 0,
                    amountPaid: payment.index === 1 && payment.status === 'paid' ? payment.amount : 0,
                    amountPending: payment.index === 2 && payment.status === 'pending' || payment.index === 3 && payment.status === 'pending' ? payment.amount : 0,
                    date: moment(payment.date).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A'),
                    products: []
                  }
                  //... Paso 3: Validar que la orden tenga productos
                  if (payment.order.orderhasproduct.length > 0 ) {
                    _.each(payment.order.orderhasproduct, function(product) {

                      //... Paso 4: Buscar si el modelo ya existe en el arreglo
                      var findModel = _.find(newClient.products, function(p) {
                        return p.idProductModel === product.product.idProductModel;
                      });

                      //... Paso 5: El producto no ha sido agregado previamente
                      if (!findModel) {
                        var tmp = product.product.name.split(',');
                        let newItemProduct = {
                          orderNumber: payment.order.orderNumber,
                          idOrder: payment.order.id,
                          idProductModel: product.product.idProductModel,
                          model: tmp[0],
                          quantity: product.totalItems,
                          cost: product.subtotal,
                          total: product.total,
                        };
                        newClient.products.push(newItemProduct);
                      }else {
                        findModel.quantity += product.totalItems;
                        findModel.total += product.total;
                      }
                    })
                  }else {

                    //... Paso 4: Buscar si ya existe algún abono
                    var findPayment = _.find(newClient.products, function(p) {
                      return p.idProductModel === 'idPayment';
                    });

                    if (!findPayment) {
                      //Paso 6: Se agrega un nuevo producto tipo "abono"
                      let newItemProduct = {
                        orderNumber: payment.order.orderNumber,
                        idOrder: payment.order.id,
                        idProductModel: 'idPayment',
                        model: 'Abono',
                        quantity: '---',
                        cost: '---',
                        total: payment.amount,
                      };
                      newClient.products.push(newItemProduct);
                    }else {
                      //console.log("Abono encontrado", findPayment);
                      findPayment.total += payment.amount;
                    }
                  }
                  formatConciliation.push(newClient);
                }else {
                  if (payment.order.orderhasproduct.length > 0) {
                    _.each(payment.order.orderhasproduct, function(product) {

                      //Buscar si el modelo ya existe en el arreglo
                      var findModel = _.find(findClient.products, function(p) {
                        return p.idProductModel === product.product.idProductModel;
                      });

                      if (!findModel) {
                        var tmp = product.product.name.split(',');
                        let newItemProduct = {
                          orderNumber: payment.order.orderNumber,
                          idOrder: payment.order.id,
                          idProductModel: product.product.idProductModel,
                          model: tmp[0],
                          quantity: product.totalItems,
                          cost: product.subtotal,
                          total: product.total,
                        };
                        findClient.products.push(newItemProduct);
                      }else {
                        if (findClient.orderNumber !== payment.order.orderNumber) {
                          findModel.quantity += product.totalItems;
                          findModel.total += product.total;
                        }
                      }
                    })
                  }else {
                    //... Paso 4: Buscar si ya existe algún abono
                    var findPayment = _.find(findClient.products, function(p) {
                      return p.idProductModel === 'idPayment';
                    });

                    if (!findPayment) {
                      //Paso 6: Se agrega un nuevo producto tipo "abono"
                      let newItemProduct = {
                        orderNumber: payment.order.orderNumber,
                        idOrder: payment.order.id,
                        idProductModel: 'idPayment',
                        model: 'Abono',
                        quantity: '---',
                        cost: '---',
                        total: payment.amount,
                      };
                      findClient.products.push(newItemProduct);
                    }else {
                      //console.log("Abono encontrado", findPayment);
                      findPayment.total += payment.amount;
                    }
                  }
                  //console.log("Cliente encontrado", findClient);
                  //if (payment.index === 0 && payment.status === 'paid') {
                  if (payment.order.id !== findClient.id) {
                    //findClient.credit += payment.amount;
                    findClient.credit += payment.order.credit;
                  }
                  if (payment.index === 1 && payment.status === 'paid') {
                    findClient.cash += payment.amount;
                    findClient.amountPaid += payment.amount;
                  }
                  if (payment.index === 2) {
                    findClient.check += payment.amount;
                    findClient.amountPending += payment.amount;
                  }
                  if (payment.index === 3) {
                    findClient.deposit += payment.amount;
                    findClient.amountPending += payment.amount;
                  }
                }
                amountPayment += payment.index === 1 && payment.status === 'paid' || payment.index === 2 && payment.status === 'paid' || payment.index === 3 && payment.status === 'paid'? payment.amount : 0;
                amountPending += payment.index === 2 && payment.status === 'pending' || payment.index === 3 && payment.status === 'pending' ? payment.amount : 0;
                })
                $scope.amountPayment = amountPayment;
                $scope.amountPending = amountPending;
                $scope.formatConciliation = formatConciliation;
                //$scope.formatConciliation = _.sortBy($scope.formatConciliation, 'model');
                $scope.formatConciliation = _.sortBy($scope.formatConciliation, function(o) { return new moment(o.date).format('YYYYMMDD'); }).reverse();
                console.log("Formato de conciliación -->", $scope.formatConciliation);
                proccessTotal($scope.formatConciliation);
      }

      function proccessTotal(order){
        let totalCredit = 0,
            totalCash = 0,
            totalCheck = 0,
            totalDeposit = 0;
        _.each(order, function(item) {
          totalCredit += item.credit;
          totalCash += item.cash;
          totalCheck += item.check;
          totalDeposit += item.deposit;
        })
        $scope.totalCredit = totalCredit;
        $scope.totalCash = totalCash;
        $scope.totalCheck = totalCheck;
        $scope.totalDeposit = totalDeposit;
        console.log("Total crédito", totalCredit);
        console.log("Total efectivo", totalCash);
        console.log("Total deposito", totalDeposit);
        console.log("Total cheque", totalCheck);
      }


      /**
      * @name getSoldToday
      * @description Recupera todas las ventas de los ejecutivos.
      * @param {array} sellers Arreglo de ID de los ejecutivos.
      */
      function getSoldToday(sellers){
        var data = {
          date: $scope.dateToday,
          sellers: sellers
        }
        Payment.getSold({data: data})
          .$promise
          .then(
            function(response) {
              //console.log("Respuesta de las ventas", response);
              $scope.orders = response;
              $scope.orders = _.sortBy($scope.orders, 'orderNumber');
              processOrder($scope.orders);
              processBoxCut($scope.orders);
              processPendingPayment($scope.orders);
              processFormatConciliation($scope.orders);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }
      /**
      * @name getAllSales
      * @description Recupera todas las ventas.
      * @param {array} sellers Arreglo de ID de los ejecutivos.
      */
      function getAllSales(sellers){
        var data = {
          sellers: sellers
        }
        Payment.getSalesHistory({data: data})
          .$promise
          .then(
            function(response) {
              //console.log("Respuesta de todas las ventas", response);
              processAllOrder(response);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }
      /**
      * @name processAllOrder
      * @description Procesa todas las ventas.
      * @param {object} orders Objeto con todas las ventas.
      */
      function processAllOrder(orders){
        //console.log("processOrder", orders);
        _.each(orders, function(order, index) {
          var find = _.find($scope.listAllOrders, function(p) {
            return p.orderNumber === order.orderNumber;
          });

          if (!find) {
            var newOrder = {
              id: order.order.id,
              orderNumber: order.orderNumber,
              client: order.client.name,
              date: moment(order.order.created).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A'),
              total: order.amount,
              type: order.order.type,
              typePayment: order.type,
              status: order.status
            };
            $scope.listAllOrders.push(newOrder);
          } else {
            find.total = find.total + order.amount;
          }
         })
         $scope.listAllOrders = _.sortBy($scope.listAllOrders, function(o) { return new moment(o.date).format('YYYYMMDD'); }).reverse();
      }
      /**
       * @name searchOrder
       * @description Buscar una orden de venta.
       * @param {string} idOrder Número de orden a buscar.
       */
      $scope.searchOrder = function(idOrder){
        $scope.soldView = !$scope.soldView;
          findOrder(idOrder, function(err, iOrder) {
            if (err) {
              console.log("No se encontró la orden de venta", err);
            }
            else {
              console.log("Se encontró la orden de venta", iOrder);
              $scope.sale = iOrder;
            }
          });
      }


      /**
       * @name findOrder
       * @description Busca orden de venta.
       * @param {string} idOrder Número de orden a buscar.
       * @callback {callback} cb callback
       */
       function findOrder(idOrder, cb) {
         var errorMessage;
         var saleFilter = {
           include: [
             {relation: 'client', scope: {
               include: {relation: 'payments', scope: {where: {idOrder: idOrder}}}
             }},
           {relation: 'orderhasproduct', scope: {
             include: {relation: 'product', scope: {
               include: {
                 relation: 'stocks', scope: {where: {status: 'sold'}}
               }
             }}
           }},
           'seller']
         };
         Order.findById({id: idOrder, filter: saleFilter}).$promise.
          then(
           function(sale) {
             cb(null, sale);
           },
           function(err) {
             console.log(err);
             cb(null, err);
           });
       }

     /*Llamada de funciones*/
     getWarehouses();
     getmySellers($rootScope.currentUser.id);

     /*Funciones $watch*/
    $scope.$watch('store.idWarehouse', function(warehouse) {
      if (!warehouse) return;
      var find = _.find($scope.warehouses, function(findWarehouse) {
        return findWarehouse.id === warehouse;
      });
      $scope.store.name = find.name; //Obtener el nombre del almacén seleccionado
      if (warehouse !== '-new-') {
        getProducts(warehouse);
      }else {
        var findNameWarehouse = _.find($scope.warehouses, function(findWarehouse) {
          return findWarehouse.name === 'Tienda Lazaro'; //Poner por default el almacén de Tienda Lazaro
        });
        $scope.store.name = findNameWarehouse.name;
        getProducts(findNameWarehouse.id);
      }
    }); // End watch store.idWarehouse

    $scope.$watch('seller.idSeller', function(seller) {
      if (!seller) return;
      var findSeller = _.find($scope.mysellers, function(p) {
        return p.id === seller;
      });
      $scope.seller.name = findSeller.lastName? findSeller.name +' '+ findSeller.lastName : findSeller.name;
      if (seller !== '-new-') {
       proccessSoldSeller(seller); //Procesar las ventas del ejecutivo
     }else {
       getmySellers($rootScope.currentUser.id); //Procesar todas las ventas del día
     }
    }); // End watch seller.idSeller


    //Objeto para la búsqueda del historial del corte de venta
    $scope.searchHistory = {
    }

    $scope.$watch('searchHistory.dateStart', function(date1) {
      if (!date1) return;
      console.log("Fecha de inicio", date1);
    }); // End watch seller.idSeller
    $scope.$watch('searchHistory.dateEnd', function(date1) {
      if (!date1) return;
      console.log("Fecha de inicio", date1);
    }); // End watch seller.idSeller

    $scope.dtColumns = [
      DTColumnBuilder.newColumn("seller", "EJECUTIVO"),
      DTColumnBuilder.newColumn("client", "CUENTA"),
      DTColumnBuilder.newColumn("currentDebt", "DEUDA INICIAL"),
      DTColumnBuilder.newColumn("model", "MODELO"),
      DTColumnBuilder.newColumn("quantity", "CANT."),
      DTColumnBuilder.newColumn("price", "PRECIO"),
      DTColumnBuilder.newColumn("total", "TOTAL"),
      DTColumnBuilder.newColumn("cash", "EFECTIVO"),
      DTColumnBuilder.newColumn("credit", "CRÉDITO"),
      DTColumnBuilder.newColumn("deposit", "DEPOSITO"),
      DTColumnBuilder.newColumn("check", "CHEQUE")
    ]

  }
])
