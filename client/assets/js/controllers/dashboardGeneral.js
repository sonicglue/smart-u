angular.module('systemax')

  .controller('DashboardGBlankController', ['$rootScope', '$scope', 'Warehouse', function($rootScope, $scope, Warehouse) {
      $rootScope.menu = 'dashboardG';
    }
  ])

  /**
   * @description Controlador para buscar un vendedor.
   */
   .controller('DashboardGListController', [
     '$rootScope',
     '$scope',
     'Warehouse',
     'SysUser',
     'Payment',
     'Order',
     'Guarantee',
     '$http',
     'DTOptionsBuilder',
     'DTColumnBuilder',
     'DTColumnDefBuilder',
     function($rootScope, $scope, Warehouse, SysUser, Payment, Order, Guarantee, $http, DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder) {

       /**
       * @name getAllSales
       * @description Obtener todas las ventas realizadas.
       */
       function getAllSales (){
         //Query filtrado de todo los pagos realizados
         var paymentFilter = {
           where: {
             and: [
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
         Payment.find({filter: paymentFilter}).$promise.
          then(
           function(sale) {
             console.log("Ventas realizadas del día de hoy", sale);
             processOrder(sale);
             //processBoxCut(sale);
             //processPendingPayment(sale);
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
         console.log("processOrder", orders);
         let listOrders = [], totalSaleToday = 0;
         _.each(orders, function(order, index) {
           var find = _.find(listOrders, function(p) {
             return p.id === order.order.id;
           });

           if (!find) {
             var newOrder = {
               id: order.order.id,
               orderNumber: order.order.orderNumber,
               seller: order.seller.name +' '+ order.seller.lastName,
               client: order.client.name,
               date: moment(order.order.created).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A'),
               total: order.order.total,
               type: order.order.type,
               typePayment: order.type,
               status: order.status
             };
             listOrders.push(newOrder);
           } else {
             //find.total = find.total + order.amount;
           }
           totalSaleToday += order.amount;
          })
          listOrders = _.sortBy(listOrders, 'orderNumber').reverse(); //_.sortBy(listOrders, function(o) { return new moment(o.date).format('YYYYMMDD'); }).reverse();
          $scope.listOrders = listOrders;
          $scope.totalSaleToday = totalSaleToday;
       }

       /**
       * @name processBoxCut
       * @description Procesa el corte de caja.
       * @param {object} orders Objeto con todas las ventas.
       */
       function processBoxCut(orders){
         //console.log("processBoxCut", orders);
         let totalCredit = 0, totalCash = 0, totalCheck = 0,
             totalDeposit = 0, amountCutBox = 0, totalPendingCheck = 0,
             totalPendingDeposit = 0, soldProducts = [];

         _.each(orders, function(order, index) {
           if (order.index === 0) {
             totalCredit += order.amount; //Total crédito
           } else if (order.index === 1) {
             totalCash += order.amount; //Total Efectivo
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
           _.each(order.products, function(product) {
             var find = _.find(soldProducts, function(p) {
               return p.idProductModel === product.idProductModel;
             });

             if (!find) {
               var tmp = product.name.split(',');
               var newProduct = {
                 idProductModel: product.idProductModel,
                 brand: product.model.brand.name,
                 model: product.model.name,
                 color: product.color.name,
                 name: tmp[0],
                 totalSold: 1,
               };
               soldProducts.push(newProduct);
             } else {
               find.totalSold++;
             }
           })
         })
         $scope.soldProducts = soldProducts;
         $scope.totalCredit = totalCredit;
         $scope.totalCash = totalCash;
         $scope.totalCheck = totalCheck;
         $scope.totalDeposit = totalDeposit;
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
         //console.log("processOrder", orders);
         let listPendingPayment = [], amountPendingPayment = 0;
         _.each(orders, function(order, index) {
           if (order.index === 2 || order.index === 3) {
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
       * @name getGuarantees
       * @description Procesa las garantías ingresadas.
       * @param {object} orders Objeto con todas las ventas.
       */
       function getGuarantees(){
         //Query filtrado de garantías
         var guaranteeFilterr = {
           where: {
             and: [
               {created: {gte: $scope.dateToday + ' 00:00:00'}},
               {created: {lte: $scope.dateToday + ' 23:59:59'}}]},
           include: [{relation: 'client', scope: {fields: ['id', 'name']}}, 'warehouse',
             {relation: 'failures', scope: {
               include: {relation:'product', scope: {fields: ['name']}}
             }},
             {relation: 'logs', scope: {
               order: ['date DESC']
             }}],
           };
         // ... es del almacén principal
         Guarantee.find({filter: guaranteeFilterr})
         .$promise
         .then(
           function(guarantee) {
             processGuarantee(guarantee);
           },
           function(err) {
             console.log(err);
             $scope.notify(err.data.error.message);
           });
       }// End getGuaranties


       /**
       * @name processGuarantee
       * @description Procesa todas las garantías.
       * @param {object} guarantee Objeto de la garantía.
       */
       function processGuarantee (guarantee){
         console.log("Lista de garantía a procesar", guarantee);
         _.each(guarantee, function(events){
           let newLog = {checkIn: '', entry: '', departure: '', reEntry: '', reAssignment: '', refund: '' }
          _.each(events.logs, function(log, index){
            //console.log(`Indice: ${index}, Evento: ${log.event}`);
            if (log.event === 'check-in') { newLog.checkIn = log.date; }
            else if (log.event === 'entry') { newLog.entry = log.date; }
            else if (log.event === 'departure') { newLog.departure = log.date; }
            else if (log.event === 're-entry') { newLog.reEntry= log.date; }
            else if (log.event === 're-assignment') { newLog.reAssignment = log.date; }
            else if (log.event === 'refound') { newLog.refund = log.date; }
          });
          _.each(events.failures, function(failure){
            newLog.model = failure.product.name;
          })
          newLog.ticket = events.guideNumber;
          newLog.seller = events.warehouse.name;
          //newLog.client = events.client.name;
          newLog.updated = events.updated;
          $scope.event.push(newLog)
        });
        $scope.event = _.sortBy($scope.event, 'ticket').reverse();
        console.log('mis logs',$scope.event);
       }


       /**
       * @name getSellers
       * @description Recupera todos los vendedores.
       * @param {string} id ID del gerente.
       */
        function getmySellers() {
             SysUser.find({filter:{where:{and:[{type:'seller'}]}}})
            .$promise
            .then(
              function(mysellers) {
                $scope.mysellers = mysellers;
                $scope.mysellers.push({
                  id: "-new-",
                  name: "-- SELECCIONAR EJECUTIVO --"
                });
                $scope.seller.idSeller = $scope.mysellers[$scope.mysellers.length-1].id;
                $scope.mysellers = _.sortBy($scope.mysellers, 'name');
           },
          function(err) {
              console.log("Error", err);
              $scope.notify(err.data.error.message);
          });
        }// End getUser*/


       $scope.$watch('seller.idSeller', function(seller) {
         if (!seller) return;
         if (seller !== '-new-') {
          getSoldSeller(seller);
        }else {
          processAllFormatConciliation();
        }
       }); // End watch seller.idSeller


       /**
       * @name getSoldSeller
       * @description Obtiene las ventas de un vendedor especifico
       * @param {string} idSeller ID del ejecutivo.
       */
       function getSoldSeller(idSeller){
        // console.log("ID SELLER SELECCIONADO", idSeller);
        var paymentFilter2 = {
          where: {
            and: [{idSeller: idSeller},
                  {date: {gte: $scope.dateToday + ' 00:00:00'}},
                  {date: {lte: $scope.dateToday + ' 23:59:59'}}]},
                  include: [{relation: 'client',
                  scope: {fields: ['id', 'name', 'lastName', 'email', 'debt', 'reference']}},
                  {relation: 'seller',
                  scope: {fields: ['name', 'lastName']}},
                  {relation: 'order', scope: {
                    include: {relation: 'orderhasproduct', scope: {
                    include: {relation: 'product', scope:{
                     include:['color', {relation: 'model', scope: {include: 'brand'}}]
                   }}
                 }
                 }
               }}]
             }
         Payment.find({filter: paymentFilter2}).$promise.
          then(
           function(response) {
             processFormatConciliation(response);
           },
           function(err) {
             console.log(err);
           });
       }


       /**
       * @name processAllFormatConciliation
       * @description Obtener todas las ventas para el formato de conciliación.
       */
       function processAllFormatConciliation(){
         var paymentFilter3 = {
           where: {
             and: [{date: {gte: $scope.dateToday + ' 00:00:00'}},
                   {date: {lte: $scope.dateToday + ' 23:59:59'}}]},
                   include: [{relation: 'client',
                   scope: {fields: ['id', 'name', 'lastName', 'email', 'debt', 'reference']}},
                   {relation: 'seller',
                   scope: {fields: ['name', 'lastName']}},
                   {relation: 'order', scope: {
                     include: {relation: 'orderhasproduct', scope: {
                     include: {relation: 'product', scope:{
                      include:['color', {relation: 'model', scope: {include: 'brand'}}]
                    }}
                  }
                  }
                }}]
              }

              Payment.find({filter: paymentFilter3}).$promise.
               then(
                function(response) {
                  processFormatConciliation(response);
                  processBalanceSheet(response);
                },
                function(err) {
                  console.log(err);
                });
       }


       /**
       * @name processFormatConciliation
       * @description Procesa el formato de conciliación.
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

                 var findClient = _.find(formatConciliation, function(p) {
                   return p.idClient === payment.client.id;
                 });

                 if (payment.order.orderhasproduct.length) {
                 _.each(payment.order.orderhasproduct, function(product) {
                   //console.log("Producto", product);
                   if (!findClient) {
                     console.log("No se encontró el cliente", findClient);
                     var newClient = {
                       idClient: payment.client.id,
                       nameSeller: payment.seller.name +' '+ payment.seller.lastName,
                       nameClient: payment.client.name,
                       currentDebt: payment.client.debt,
                       previousDebt: payment.previousDebt,
                       products: [{
                        orderNumber: payment.order.orderNumber,
                        idOrder: payment.order.id,
                        idProductModel: product.product.idProductModel,
                        model: product.product.model.name,
                        quantity: product.totalItems,
                        cost: product.subtotal,
                        total: product.total,
                        typePayment: {
                          credit: payment.index === 0 ? payment.amount : 0,
                          cash: payment.index === 1 ? payment.amount : 0,
                          deposit: payment.index === 3 ? payment.amount : 0,
                          check: payment.index === 2 ? payment.amount : 0
                        },
                        amountPaid: payment.index === 0 || payment.index === 1 ? payment.amount : 0,
                        amountPending: payment.index === 2 || payment.index === 3 ? payment.amount : 0,
                        date: moment(payment.date).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A'),
                      }]
                     }
                     formatConciliation.push(newClient);
                  }else {
                  //console.log("Nuevo cliente 2", findClient);
                  var findModel = _.find(findClient.products, function(p) {
                    return p.idProductModel === product.product.idProductModel;
                  });

                  console.log("Cliente encontrado", findClient);
                  //findClient.previousDebt += payment.previousDebt;

                  if (!findModel) {
                    console.log("El modelo no se encontró", findModel);
                    let newItemProduct = {
                      orderNumber: payment.order.orderNumber,
                      idOrder: payment.order.id,
                      idProductModel: product.product.idProductModel,
                      model: product.product.model.name,
                      quantity: product.totalItems,
                      cost: product.subtotal,
                      total: product.total,
                      typePayment: {
                        credit: payment.index === 0 ? payment.amount : 0,
                        cash: payment.index === 1 ? payment.amount : 0,
                        deposit: payment.index === 3 ? payment.amount : 0,
                        check: payment.index === 2 ? payment.amount : 0
                      },
                      amountPaid: payment.index === 0 || payment.index === 1 ? payment.amount : 0,
                      amountPending: payment.index === 2 || payment.index === 3 ? payment.amount : 0,
                      date: moment(payment.date).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A')
                    };
                    findClient.products.push(newItemProduct);
                  }else {
                    console.log("Modelo encontrado", findModel);
                    findModel.quantity += product.totalItems;

                    findModel.total += product.total;
                    findClient.previousDebt = payment.previousDebt;
                    if (payment.index === 2 && payment.status === 'pending' || payment.index === 3 && payment.status === 'pending') {
                      findModel.amountPending +=payment.amount
                    }
                    if (payment.index === 0 && payment.status === 'paid' || payment.index === 1 && payment.status === 'pending') {
                      findModel.amountPaid += payment.amount;
                    }
                  }
                }
              });//End _.each orderhasproduct

            }else {
                if (!findClient) {
                  var newClient = {
                    idClient: payment.client.id,
                    nameSeller: payment.seller.name +' '+ payment.seller.lastName,
                    nameClient: payment.client.name,
                    currentDebt: payment.client.debt,
                    previousDebt: payment.previousDebt,
                    products: [{
                      orderNumber: payment.order.orderNumber,
                      idOrder: payment.order.id,
                     idProductModel: '132',//product.product.idProductModel,
                     model: 'Abono',
                     quantity: '---',
                     cost: '---',
                     total: payment.amount,
                     typePayment: {
                       credit: payment.index === 0 ? payment.amount : 0,
                       cash: payment.index === 1 ? payment.amount : 0,
                       deposit: payment.index === 3 ? payment.amount : 0,
                       check: payment.index === 2 ? payment.amount : 0
                     },
                     amountPaid: payment.index === 0 || payment.index === 1 ? payment.amount : 0,
                     amountPending: payment.index === 2 || payment.index === 3 ? payment.amount : 0,
                     date: moment(payment.date).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A'),
                   }]
                  }
                  formatConciliation.push(newClient);
                }else {
                  let newItemProduct = {
                    orderNumber: payment.order.orderNumber,
                    idOrder: payment.order.id,
                    idProductModel: '132',//product.product.idProductModel,
                    model: 'Abono',
                    quantity: '---',
                    cost: '---',
                    total: payment.amount,
                    typePayment: {
                      credit: payment.index === 0 ? payment.amount : 0,
                      cash: payment.index === 1 ? payment.amount : 0,
                      deposit: payment.index === 3 ? payment.amount : 0,
                      check: payment.index === 2 ? payment.amount : 0
                    },
                    amountPaid: payment.index === 0 || payment.index === 1 ? payment.amount : 0,
                    amountPending: payment.index === 2 || payment.index === 3 ? payment.amount : 0,
                    date: moment(payment.date).tz('Etc/GMT').format('DD/MM/YYYY hh:mm A')
                  };
                  findClient.products.push(newItemProduct);
                }
            }//End if orderhasproduct.length

            amountPayment += payment.index === 0 || payment.index === 1 ? payment.amount : 0;
            amountPending += payment.index === 2 || payment.index === 3 ? payment.amount : 0;
            totalCredit += payment.index === 0 ? payment.amount : 0;
            totalCash += payment.index === 1 ? payment.amount : 0;
            totalCheck += payment.index === 2 ? payment.amount : 0;
            totalDeposit += payment.index === 3 ? payment.amount : 0;
           });//End -.each payment

         $scope.amountPayment = amountPayment;
         $scope.amountPending = amountPending;
         $scope.totalCredit = totalCredit;
         $scope.totalCash = totalCash;
         $scope.totalCheck = totalCheck;
         $scope.totalDeposit = totalDeposit;
         $scope.formatConciliation = formatConciliation;
         $scope.formatConciliation = _.sortBy($scope.formatConciliation, 'orderNumber').reverse();
         console.log("Formato de conciliación --> 1231", $scope.formatConciliation);
       }

       /**
       * @name processBalanceSheet
       * @description Procesa el balance general.
       * @param {object} order Objeto de la orden
       */
       function processBalanceSheet(order){
         console.log("processBalanceSheet", order);
         let processBalanceSheet = [], granTotal = 0;

         _.each(order, function(payment, index) {
           //...Buscar el ID del cliente
           var findSeller = _.find(processBalanceSheet, function(p) {
             return p.idSeller === payment.seller.id;
           });

           if (!findSeller) {
             var newPayment = {
               idSeller: payment.seller.id,
               nameSeller: payment.seller.name +' '+ payment.seller.lastName,
               totalEquipment:payment.order.orderhasproduct.length,
               cash: payment.index === 1 || payment.index === 2 || payment.index === 3 ? payment.amount : 0,
               total: payment.index === 1 || payment.index === 2 || payment.index === 3 ? payment.amount : 0,
             }
             processBalanceSheet.push(newPayment);
           }else {
            findSeller.totalEquipment +=  payment.order.orderhasproduct.length;
            findSeller.cash += payment.index === 1 || payment.index === 2 || payment.index === 3 ? payment.amount : 0;
            findSeller.total += payment.index === 1 || payment.index === 2 || payment.index === 3 ? payment.amount : 0;
           }
         })

         $scope.processBalanceSheet = processBalanceSheet;
         console.log("processBalanceSheet formateada", $scope.processBalanceSheet);
       }

       $scope.dateToday = moment().format('L');
       $scope.listOrders = [] //Lista de ordenes de venta
       $scope.listAllOrders = [] //Lista de todas las ordenes de venta
       $scope.stock = 0; //Total stock del almacén
       $scope.totalSaleToday = 0; //Total de las ventas del día
       $scope.soldView = false; //Vista para las ventas del día
       $scope.stockView = false //Vista para ver el stock del almacén
       $scope.boxCutView = false //Vista para el corte de caja
       $scope.pendingPaymentView = false //Vista para pagos pendientes

       //$scope.formatConciliation; //Array formato de conciliación
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
       $scope.event = []; //Eventos de las garantías

       getAllSales();
       getGuarantees();
       getmySellers();
       processAllFormatConciliation();



 }])


  /**
   * @description Controlador para registrar una venta.
   */
  .controller('SaleFormController', ['$scope', '$rootScope', '$state', 'SysUser', 'Stock', '$stateParams', 'SellerHasClient', function($scope, $rootScope, $state,  SysUser, Stock, $stateParams, SellerHasClient) {
    $scope.totalEquipment = 0 //Objeto para el total de equipos asignados al vendedor
    $scope.selectedEquipment = 0;
    $scope.itemSeller = { }; //Objeto para el vendedor
    var today =  moment(); //Obtener la fecha actual
    $scope.itemSeller.date = stringDate(today, '/');
    // Objeto stocks
    $scope.stocks = { }; //Hoja de cambaceo del vendedor

    $scope.myClients = []; //Lista de clientes que tiene asigando el vendedor/almacén
    $scope.selectAllClient = {
      items: []
    }
    $scope.selectedClient = {}; //Objeto para el cliente seleccionado en la asignación múltiple
    $scope.IsAllChecked = false; //Objeto que indica si todos los checkbox están seleccionados
    $scope.isActivedImei = false; //modelo para cuando el imei ya ha sido activado previamente

    $scope.totalPayment = 0; //Monto total de la nota de remisión
    $scope.sendSale = { //Objeto que tiene todos los datos de la venta
      items: []
    }



    //Obtener los datos del vendedor
    SysUser.find({filter: {where:{id:$state.params.idSeller, type: 'seller'}}}).$promise
    .then(
      function(seller) {
        $scope.seller = seller[0].name+' ' +seller[0].lastName;
      },
      function(err) {
        console.log(err);
        $scope.notify(err.data.error.message);
      });



    /*=========================================================================
    * Mantener un escuchador en el objeto date por si hay cambio de fecha
    *=========================================================================*/
    $scope.$watch('itemSeller.date', function(date) {
      if (!date) return;
      var tmp = date.split('/');
      if (tmp.length === 3) {
        $scope.itemSeller.date = tmp[2] + '-' + tmp[1] + '-' + tmp[0];
      }
      //searchSeller();
    });// End watch formFilters.date


      /**
       * @name stringDate
       * @description Devuelve una fecha con formato según el carcter separador.
       * @param {object} objDate Objeto de fecha tipo moment().
       * @param {string} char Caracter de separación de la fecha.
       */
      function stringDate(objDate, char) {
        var tmp = '';
        if (char === '/') {
          tmp = ('0' + objDate.date()).substr(-2) + char +
            ('0' + (objDate.month() + 1)).substr(-2) + char +
            objDate.year();
        } else {
          char = '-';
          tmp = objDate.year() + char +
            ('0' + (objDate.month() + 1)).substr(-2) + char +
            ('0' + objDate.date()).substr(-2);
        }
        return tmp;
      }// End stringDate


    /*---------------------------------------------------------------*
     * Función para seleccionar un vendedor y mandarlo a otra vista  *
     *---------------------------------------------------------------*/
    $scope.searchSeller = function(){
      console.log('Información a validar ID vendedor', $state.params.idSeller);
      console.log('Información a validar Fecha', $scope.itemSeller.date);

      let lastId = '';
      let idx = -1;

      //console.log("Fecha formateada 1", moment($scope.itemSeller.date).hour(0).toDate());
      //console.log("Fecha formateada 2", moment($scope.itemSeller.date).hour(23).minute(59).second(59).millisecond(999).toDate());


      //{saleDate:  { gt: moment($scope.itemSeller.date).hour(0).toDate(), lt: moment($scope.itemSeller.date).hour(23).minute(59).second(59).millisecond(999).toDate() }}

      /*============================================================
      * Query para obtener la hoja de cambaceo del vendedor
      *=============================================================*/
      let sellerFilter = {
        include: {
          relation: 'warehouseACL',
          scope: {
          include: {
            relation: 'warehouse',
            scope: {
              include: {
                relation: 'stocks',
                scope: {
                  where: {and: [
                    {status: 'sold'},
                    { validate: true},
                    {saleDate:  { gt: moment($scope.itemSeller.date).hour(0).toDate(), lt: moment($scope.itemSeller.date).hour(23).minute(59).second(59).millisecond(999).toDate() }}
                  ]},
                  include: [ 'product', { relation: 'logs', scope: { where: { event: 'assigned'}} }],
                  order: 'idProduct'}}}},
                                  limit: 1,
                                  order: 'index'}}};

      SysUser.findById({id: $state.params.idSeller, filter: sellerFilter})
        .$promise
          .then(
            function(seller) {
              $scope.cambaceo = seller.warehouseACL[0].warehouse.stocks.length;
              console.log("Hoja de cambaceo del vendedor", $scope.cambaceo);

              let response = {
                items: []
              };

              let totalEquipment = 0; //Total de equipos vendidos

              if (seller.warehouseACL[0].warehouse.stocks.length) {

                _.each(seller.warehouseACL[0].warehouse.stocks, function(stock) {
                  if (lastId !== stock.idProduct) {

                     //Item de la hoja de cambaceo
                     let newItem = {
                       id: stock.idProduct,
                       brand: stock.product.name,
                       model: stock.product.name,
                       total: 0,
                       stock: []
                     }
                     response.items.push(newItem);
                     lastId = stock.idProduct;
                     idx++;
                   }

                   let newStock = {
                     id: stock.id,
                     imei: stock.IMEI,
                     status: stock.status,
                     isRefurb: stock.isRefurb,
                     idClient: stock.idClient,
                     selected: false,
                     confirmSale: stock.confirmSale,
                     publicPrice: stock.publicPrice,
                     salesPrice: stock.salesPrice
                   };

                   response.items[idx].stock.push(newStock);
                   response.items[idx].total++;
                   totalEquipment++;
                 });

                 $scope.stocks = response;
                 $scope.totalEquipment = totalEquipment;
              }else {
                $scope.stocks = seller.warehouseACL[0].warehouse.stocks;
                $scope.totalEquipment = 0;
                console.log("No encontró equipos vendidos por parte del vendedor", $scope.stocks);
              }
              console.log("Array Stock de la hoja de cambaceo", $scope.stocks);
            },
            function(err) {
              console.log("Error al obtener los equipos vendidos del vendedor", err);
              $scope.stocks = [];
              console.log("Datos vacios del stock del vendedor", $scope.stocks);
            });

    }

    function getmyClients(idSeller) {

      var filter = {
        where: { idSeller:$state.params.idSeller },
        include: [{ relation: "client", scope: { fields: [ "id", "name" ] } }]
      };

       SellerHasClient.find({filter: filter }).$promise .then(
         function(myClients) {
           console.log("Respuesta de consulta", myClients.length);
           let listClients = [];

           if (myClients.length) {
             _.each(myClients, function(client) {
               listClients.push({ id: client.client.id, tag: client.client.name })
             });
             listClients.push({ id: "-new-", tag: "-- ELIGE UN CLIENTE --" });
             $scope.myClients = listClients;
             $scope.sendSale.idClient = $scope.myClients[$scope.myClients.length-1].id;
           }else {
             listClients.push({ id: "-new-", tag: "-- ELIGE UN CLIENTE --" });
             $scope.myClients = listClients;
             $scope.sendSale.idClient = $scope.myClients[$scope.myClients.length-1].id;
           }
           console.log('El vendedor tiene asignado los siguientes clientes:',$scope.myClients)
        },
        function(err) {
          console.log(err);
          $scope.notify(err.data.error.message);
        });
    }

    getmyClients();


       // This executes when checkbox in table header is checked
     $scope.selectAll = function () {
         console.log("selectAll", $scope.IsAllChecked);
         //$scope.selectAllClient.idClient = 'Josue'
         //console.log("selected", $scope.stocks.items);
         $scope.stocks.items.forEach(function(item){
           item.stock.forEach(function(stock, index) {
             if (item.stock[index].confirmSale === false)  {
               item.stock[index].selected = $scope.IsAllChecked;
             }
           });
         });
        console.log("selectAllClient", $scope.selectAllClient);
        console.log("Hoja de cambaceo cambio su valor", $scope.stocks);
     };



     // This executes when entity in table is checked
      $scope.selectEntity = function (entity) {
        console.log("check selected", entity);
        $scope.stocks.items.forEach(function(item){
          item.stock.forEach(function(stock, index) {
            if (!item.stock[index].selected) {
                $scope.IsAllChecked = false;
                $scope.selectedEquipment = 0;
                return;
            }
            if (stock.confirmSale === false) {
              item.stock[index].selected = true;
            }

          });
        });
        console.log("Hoja de cambaceo cambio su valor", $scope.stocks);
      };

      //$scope.selectEntity(); //Mandar a llamar la función cuando se selecciona un checkbox de forma individual


      // Función para activar el input y cambiarle el precio del equipo
       $scope.activeEditInput = function (active) {
         console.log("Active input salesPrice", active);
         $scope.note.items.forEach(function(item, index){
             if (item.id === active) {
               if (item.changePrice === true) {
                 item.changePrice = false;
               }else {
                 item.changePrice = true;
               }
             }
         });
         console.log("Hoja de cambaceo cambio su valor", $scope.note);
       };


       // Función para cambiar el precio de un equipo
        $scope.changeSalePrice = function (idProduct, newPrice) {
          let totalPayment = 0;

          console.log("Id del producto", idProduct);
          console.log("Nuevo precio del producto", newPrice);
          $scope.note.items.forEach(function(item, index){
              if (item.id === idProduct) {
                item.salesPrice = newPrice;
              }
              item.subTotal = item.salesPrice * item.quantity;
          });

          $scope.note.items.forEach(function(item, index){
            console.log("item subTotal", item.subTotal);
            totalPayment += item.subTotal;
         });

         $scope.totalPayment = totalPayment;

          console.log("Hoja de cambaceo despues de modificar el precio del equipo", $scope.note);
        };


      $scope.generateNote = function (){
        console.log("Realizar la venta !!!", $scope.stocks);

        $scope.note = { //Objeto para nota de remisión
          items: []
        }

        let totalPayment = 0;
        let lastId = '';
        let idx = -1;

        //Recorrer el arreglo que tiene el stock todos los que esten en estatus "selected=true"
          $scope.stocks.items.forEach(function(item){
            item.stock.forEach(function(stock, index) {

              if (item.stock[index].selected === true) {
              if (lastId !== item.id) {

                //Item de la hoja de cambaceo
                let newItem = {
                  id: item.id,
                  quantity: 0,
                  model: item.model,
                  salesPrice: stock.publicPrice,
                  subTotal: stock.publicPrice,
                  changePrice: true,
                  stock: []
                }
                $scope.note.items.push(newItem);
                lastId = item.id;
                idx++;
              }


             let newStock = {
               id: stock.id,
               imei: stock.imei,
               isRefurb: stock.isRefurb,
               idClient: stock.idClient,
               confirmSale: stock.confirmSale,
               publicPrice: stock.publicPrice
             };
             $scope.note.items[idx].stock.push(newStock);
             $scope.note.items[idx].quantity++;
             $scope.note.items[idx].subTotal = $scope.note.items[idx].salesPrice * $scope.note.items[idx].quantity;
           }

         });

         //totalPayment = $scope.note.items[idx].subTotal; //Se oculta por el momento

         });

         //$scope.totalPayment = totalPayment;

        $('#registerSaleModal').modal('show');
         console.log("Datos a mandar para la venta", $scope.note);
      }


      //Función para registrar la venta
      $scope.registerSale = function (){
        var errorMessage = null;
        let totalPayment = 0;
        let totalItems = 0;
        let lastId = '';
        let idx = -1;

        console.log("Registrando venta....");
        console.log("Cliente seleccionado para registrar su venta", $scope.sendSale.idClient);
        console.log("Ejecutivo seleccionado quien realizó la venta", $state.params.idSeller);
        console.log("Método de pago seleccionado para registrar la venta", $scope.sendSale.paymentMethod);

        if ($scope.sendSale.idClient === -1 || $scope.sendSale.idClient === "-new-") {
          errorMessage = 'Debes seleccionar un cliente'
        }else if (!$scope.sendSale.paymentMethod) {
          errorMessage = 'Seleccione un método de pago.'
        }

        if (errorMessage) {
          $scope.notify(errorMessage, 'info-sign', 'warning')
          return
        }

        //Recorrer el arreglo que tiene el stock
          $scope.note.items.forEach(function(product){
            product.stock.forEach(function(stock, index) {
              if (lastId !== product.id) {
                //Item de la hoja de cambaceo
                let newItem = {
                  idProduct: product.id,
                  totalItems: 0,
                  subTotal: product.salesPrice,
                  total: product.salesPrice,
                  salesPrice: product.salesPrice,
                  model: product.model,
                  stock: []
                }
                $scope.sendSale.items.push(newItem);
                lastId = product.id;
                idx++;
              }

             let newStock = {
               idStock: stock.id,
               imei: stock.imei,
               isRefurb: stock.isRefurb,
               salesPrice: product.salesPrice
             };
             $scope.sendSale.items[idx].stock.push(newStock);
             $scope.sendSale.items[idx].totalItems++;
             $scope.sendSale.items[idx].subTotal = $scope.sendSale.items[idx].salesPrice * $scope.sendSale.items[idx].totalItems;
             $scope.sendSale.items[idx].total = $scope.sendSale.items[idx].salesPrice * $scope.sendSale.items[idx].totalItems;
         });

         totalPayment += $scope.sendSale.items[idx].subTotal;
         totalItems += $scope.sendSale.items[idx].totalItems;
         });

        console.log("Datos del objeto sendSale", $scope.sendSale);

        var newSale = null;
        newSale = _.clone($scope.sendSale);
        newSale.idSeller = $state.params.idSeller;
        newSale.totalItems = totalItems;
        newSale.subTotal = totalPayment;
        newSale.total = totalPayment;

        console.log("Objeto depurado para registrar la venta", newSale);

        Stock.registerSale({data: newSale}).$promise
          .then( function(response) {
            console.log("La venta se registro correctamente !!!", response);
            $scope.busy = false;
            $scope.notify("La venta se registro correctamente !!!.", "ok", "success", 5000);
            //$state.go($state.current, {}, {reload: true}); //Reinicia el controlador

            //Buscar el imei y eliminarlo del array
            $scope.sendSale.items.forEach(function(item, index1){
              item.stock.forEach(function(stockItem, index2) {
                getmyImei(stockItem.imei, $scope.sendSale.idClient);
              });
            });

          }, function(err) {
            console.log("Error devuelto por el servidor", JSON.stringify(err));
            $scope.busy = false;
            var message = err.data.error.message;
            if (!message) {
              message = "No se pudo registrar la venta, intente más tarde por favor."
            }
            $scope.notify(message,"alert","danger")
          })


      }

      //Función para búscar el imei y cambiarle el estatus a confirmSale = true
      function getmyImei(imei, idClient) {
        console.log("IMEI a validar", imei);
        $scope.stocks.items.forEach(function(item, index1){
          item.stock.forEach(function(stockItem, index2) {
            if(stockItem.imei === imei) {
              item.stock[index2].confirmSale = true;
              item.stock[index2].selected = false;
              item.stock[index2].idClient = idClient;
            }
          });
        });
      }









}])
