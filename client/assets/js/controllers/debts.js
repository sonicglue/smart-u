angular.module('systemax')
  /**
   * @description Controlador para listar los proveedores/empresas/clientes.
   */
  .controller('debtsBillings', [
    '$rootScope',
    '$scope',
    '$interval',
    'Payment',
    'SysUser',
    'Billing',
    function($rootScope, $scope, $interval, Payment, SysUser, Billing) {
      // Variables generales
      var today = moment();
      var timer = null;
      var sellerFilter = {
        include: {
          relation: 'clients', scope: {
            include: {
              relation: 'payments', scope: {
                where: {
                  and: [
                    {status: {neq: 'canceled'}},
                    {date: {gte: '2019-01-01 00:00:00'}},
                    {date: {lte: '2019-01-01 23:59:59'}}]}}}}},
        where: {
          and: [
            {idParent: null},
            {type: 'seller'}]}};
      // Funciones generales
      function getDebts(sellers) {
        Payment.getDebt({data: sellers})
          .$promise
          .then(
            function(response) {
              $scope.debts = response;
              _.each($scope.debts, function(total) {
                $scope.granTotal += total.total;
              });
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getDebts
      /**
       * @name getClientSellers
       * @description
       */
      function getClientSellers() {
        if (!timer) {
          // ...definir el intervalo para el refresh
          timer = $interval(recalculateCountAndReload, 3000);
        }
        SysUser.find({filter: sellerFilter})
        .$promise
        .then(
          function(sellers) {
            $scope.busy = false;
            $scope.sellers = [];
            $scope.total = 0;
            eachSeller(sellers);
        },
        function(err) {
          $scope.busy = false;
          console.log(err);
          $scope.notify('El gerente no tiene asignado vendedores');
        });
      }// End getClientSellers
      /**
       * @name eachSeller
       * @description Procesa los datos de los abonos y adeudos.
       */
      function eachSeller(sellers) {
        _.each(sellers, function(seller) {
          if (seller.clients.length) {
            _.each(seller.clients, function(client) {
              if (client.payments.length) {
                processPayments(seller, client, client.payments);
              }
            });
          }
        });
      }// End eachSeller
      function processPayments(seller, client, payments) {
        payments = _.sortBy(payments, 'date', 'idOrder', 'index');
        var tmp = _.pick(seller, 'id', 'name', 'lastName');
        tmp.client = _.pick(client, 'id', 'name');
        tmp.client.payment = 0;
        tmp.client.credit = 0;
        tmp.client.refund = 0;
        tmp.client.previousDebt = payments[0].previousDebt;
        tmp.client.currentDebt = payments[payments.length - 1].currentDebt;
        $scope.total += payments[payments.length - 1].currentDebt;
        // console.log('before', tmp);
        _.each(payments, function(payment) {
          if (payment.type === 'credit') {
            tmp.client.credit += payment.amount;
          } else if (payment.type === 'refund' && payment.status !== 'canceled') {
            tmp.client.refund += payment.amount;
          } else if (payment.status !== 'canceled') {
            tmp.client.payment += payment.amount;
          }
        });
        // console.log('after', tmp);
        $scope.sellers.push(tmp);
      }
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de abonos.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = sellerFilter.where;
        SysUser.count({where: sellerFilter.where || {}})
          .$promise
          .then(function (count) {
            if (sellerFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      /**
       * @name redefineWhereFilter
       * @description Actualiza el filtro para mostrar los abonos.
       */
      function redefineWhereFilter() {
        sellerFilter.where.and[0].idParent = $scope.currentUser.id;
        if ($scope.all) {
          sellerFilter.where.and[0].idParent = {neq: ''};
        }
        var tmp = $scope.formFilters.date.split('/');
        var start = tmp[2] + '-' + tmp[1] + '-' + tmp[0] + ' 00:00:00';
        var end = tmp[2] + '-' + tmp[1] + '-' + tmp[0] + ' 23:59:59';
        sellerFilter.include.scope.include.scope.where.and[1] = {date: {gte: start}};
        sellerFilter.include.scope.include.scope.where.and[2] = {date: {lte: end}};
        recalculateCountAndReload();
      }// End redefineWhereFilter
      // Variables del $scope
      $scope.all = false;
      $scope.busy = true;
      $scope.formFilters = {};
      $scope.sellers = [];
      $scope.total = 0;
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        sellerFilter = _.extend(sellerFilter, $scope.pagination.filter);
        getClientSellers();
      };// End reloadData
      /**
       * @name toggleData
       * @description Cambia el alcance de los abonos del gerente.
       */
      $scope.toggleData = function() {
        $scope.all = !$scope.all;
        $scope.busy = true;
        redefineWhereFilter();
      };// End toggleData
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        $scope.formFilters.date = $scope.stringDate(today, '/');
      });// End $watch.currentUser
      //
      $scope.$watch('formFilters.date', function(date) {
        if (!date) return;
        $scope.busy = true;
        var tmp = date.split('/');
        if (tmp.length === 3) {
          redefineWhereFilter();
        }
      });// End watch formFilters.date
      // Watcher dedicado para cuando se destruye $scope
      $scope.$on('$destroy', function() {
        if (timer) {
          $interval.cancel(timer);
        }
      });// End $on $destroy
      // Código principal
    }
  ])
    /**
   * @description Controlador para obtener los datos de los adeudos por fecha de los clientes
   */
  .controller('debtsDateBillings', [
    '$scope',
    '$state',
    'Payment',
    '$stateParams',


    function($scope, $rootScope, Payment,$stateParams) {
        var pFilter =  {
            where: {idClient:$stateParams.idClient,status:'active' },limit:1,
            include: [  "client", "seller"]
          }

          getDate();

          function getDate(){

            $(function() {
              $("#datepicker1").datepicker({
                dateFormat: 'yy-mm-dd'  ,
                onSelect: function (date) {
                 var date1=date +'T00:00:00.000Z';
                  console.log('mi fecha1 seleccionada es',date1);
                  ayment(date1);

          }
              })
             /* $("#datepicker").datepicker({
                dateFormat: 'yy-dd-mm ',
                onSelect: function (date2) {
                  var date2= date2 +'T00:00:00.000Z';
                  console.log('mi fecha 2 seleccionada es',date2);
          }
              });*/

            });

          }
          function ayment(dateOne){

            var pyFilter =  {
              where: {idClient:$stateParams.idClient,status:'active',date:dateOne},
              include: [  "client", "seller"]
            }
            Payment.find({filter:pyFilter})
                .$promise
                .then(function(date) {
                    console.log('mi informacionnnnn',date)
                    $scope.date = date;
                  }
                )}
            /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de ordenes
       * de compra
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = pFilter.where;
        Payment.count({where: pFilter.where || {}})
          .$promise
          .then(function (count) {
            if (pFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);

            }
          });
      };// End Recalculate Count And Reload
           // Watch datePicker
      $scope.$watch('formFilters.purchaseDate', function(purchaseDate) {
        console.log('fecha obtenida',purchaseDate);
        if (!purchaseDate) return;
        redefineWhereFilter();
      });// End $watch formFilters.purchaseDate
   /**
       * @name redefineWhereFilter
       * @description Actualiza el filtro para mostrar las ordenes de compra.
       */
      function redefineWhereFilter() {
        pFilter.where = {};
        if ( $scope.formFilters.purchaseDate) {
          pFilter.where.and = [];
          console.log('aqui ando', pFilter.where.and);

        }

        if ($scope.formFilters.purchaseDate) {
          var date = $scope.formFilters.purchaseDate.split('/');
          var fullDate = date[2] + '-' + date[1] + '-' + date[0];
          var tmp = {purchaseDate: {gte: fullDate}};
          if (pFilter.where.and) {
            pFilter.where.and.push(tmp);
          } else {
            pFilter.where = tmp;
          }
        }
        recalculateCountAndReload();
      }// End redefineWhereFilter

//funcion para traer solo los totales
$rootScope.totalesBien = $rootScope.total;
$scope.granTotal=0;
console.log($rootScope.totalesBien)
      // Funciones generales



      /**
       * @name ayment
       * @description Recupera los datos de los pagos por las ordenes de compra
       */
        Payment.find({filter: pFilter})
          .$promise
          .then(function(debts) {
              console.log('tengo esto54654654',debts)
              $scope.debts = debts;

        //funcion para traer solo los totales
        /*$scope.totales = _.each($scope.debts, function(total){
          $scope.granTotal =  $scope.granTotal + total.currentDebt;
        });
        console.log('total', $scope.granTotal);
        $scope.datos = _.each($scope.debts, function(fecha){
          $scope.fechas = fecha.date;
          console.log('fechas',$scope.fechas);
        });*/


            },


            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });



      // Código principal
      ayment();

    }

  ])

    /**
   * @description Controlador para la vista de jesus
   */
  .controller('debtsManager', [
    '$scope',
    '$state',
    'Payment',
    'Billing',
    '$stateParams',


    function($scope, $rootScope, Payment, Billing, $stateParams) {

      var pFilter =  {
        where: {idClient:$stateParams.idClient,status:'active', },
        include: [  "client", "seller"]
      }
        /**
   * @name recalculateCountAndReload
   * @description Actualizar paginación con base a la cantidad de ordenes
   * de compra
   */
  function recalculateCountAndReload() {
    $scope.pagination.current = 0;
    // Recuperar el ultimo filtro utilizado
    var lastWhere = pFilter.where;
    Payment.count({where: pFilter.where || {}})
      .$promise
      .then(function (count) {
        if (pFilter.where === lastWhere) {
          $scope.setPaginationCount(count.count);

        }
      });
  };// End Recalculate Count And Reload
  //watch para almacenar lo introducido en el input
  $scope.$watch('nav.searchTerms', function(u) {
    console.log('nombre del cliente',u)
    if (!u) return;
    if (u){
      $scope.clientt=u;
      searchProducts($scope.clientt);

    }
    });
       // Watch datePicker
  $scope.$watch('formFilters.purchaseDate', function(purchaseDate) {
    console.log('fecha obtenida',purchaseDate);
    if (!purchaseDate) return;
    redefineWhereFilter();
  });// End $watch formFilters.purchaseDate

         //Función para buscar los productos por término y filtros especificos
         function searchProducts(term) {
          console.log('mi cliente es',term);

          var cFilter={where:{and:[{ name:term}]}
          }
          Billing.find({filter: cFilter})
           .$promise
           .then(function(clients) {
             _.each(clients, function(client) {
               $scope.client=client.id;
               console.log('mi cliente encontrado:', $scope.client);

             });
             aymentt($scope.client)
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });

          }

//funcion para traer solo los totales
$rootScope.totalesBien = $rootScope.total;
$scope.granTotal=0;
console.log($rootScope.totalesBien)
  // Funciones generales


       //Función para buscar los productos por término y filtros especificos
       function searchProducts(term) {
        console.log('mi cliente es',term);

        var cFilter={where:{and:[{ name:term}]}
        }
        Billing.find({filter: cFilter})
         .$promise
         .then(function(clients) {
           _.each(clients, function(client) {
             $scope.client=client.id;
             console.log('mi cliente encontrado:', $scope.client);

           });
           aymentt($scope.client)
        },
        function(err) {
          console.log(err);
          $scope.notify(err.data.error.message);
        });

        }


                /**
       * @name ayment
       * @description Recupera los datos de los pagos por las ordenes de compra
       */
      function aymentt(client){
        console.log('search in payment',client)

        $scope.debts=[];
        var pFilter =  {
          where: {idClient:client,status:'active', },limit:1,
          include: [  "client", "seller"]
        }

          Payment.findOne({filter: pFilter})
          .$promise
          .then(function(debts) {
              $scope.debts .push(debts);

              console.log('tengo esto',$scope.debts)


        //funcion para traer solo los totales
        $scope.totales = _.each($scope.debts, function(total){
          $scope.granTotal= total.currentDebt;
          console.log('total', $scope.granTotal);

        });
            },


            function(err) {
              console.log(err);
             // $scope.notify(err.data.error.message);
            });

            $scope.result=$scope.debts ;
            console.log('mi resultado', $scope.result);


            }

  /**
   * @name ayment
   * @description Recupera los datos de los pagos por las ordenes de compra
   */
  $scope.names=[];
    Payment.find({filter: pFilter})
      .$promise
      .then(function(debts) {
          console.log('tengo esto',debts)
          $scope.debts = debts;
          $scope.totales = _.each($scope.debts, function(names){
          $scope.names.push(names.idClient);
          console.log('map', $scope.names);
              var sorted = $scope.names.sort();

              $scope.unique = sorted.filter(function (value, index) {
                  return value !== sorted[index + 1];
              });
              console.log('tengo estoooooo',$scope.unique);

          });





    $(function() {

      var start = moment().subtract(29, 'days');
      var end = moment();
  console.log('datepicker',start);
      function cb(start, end) {
          $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      }

      $('#reportrange span').daterangepicker({
          date: start,
          date: end,
          ranges: {
          }
      }, cb);



      cb(start, end);

  });
  ay($scope.unique);
        },


        function(err) {
          console.log(err);
          $scope.notify(err.data.error.message);
        });

        function ay(clients){
          $scope.debts=[];
          $scope.totales=[0];
          _.each(clients,function(search){
          var pFilter =  {
            where: {idClient:search,status:'active', },
            include: [  "client", "seller"]
          }
          Payment.findOne({filter: pFilter})
          .$promise
          .then(function(debts) {
              $scope.debts.push(debts);
              console.log('obtengooo',$scope.debts)
                  //funcion para traer solo los totales
                  $scope.totales.push(debts.currentDebt);
                  console.log('mis totales',$scope.totales)
                  console.log('tengo esto',$scope.debts)

                  $scope.granTotal=0;
            //funcion para traer solo los totales
            $scope.totales = _.each($scope.totales, function(total){
              $scope.granTotal+= total;
              console.log('total', $scope.granTotal);

            });


            //funcion para traer solo los totales
            $scope.totales = _.each($scope.totales, function(total){
              console.log('arreglo totales', total);
              $scope.granTotal= $scope.granTotal + total;
              console.log('totall', $scope.granTotal);

            });
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
        })
            }


                  /**
       * @name ayment
       * @description Recupera los datos de los pagos por las ordenes de compra
       */
      function aymentt(client){
        console.log('search in payment',client)

        $scope.debts=[];
        var pFilter =  {
          where: {idClient:client,status:'active', },
          include: [  "client", "seller"]
        }

          Payment.findOne({filter: pFilter})
          .$promise
          .then(function(debts) {
              $scope.debts .push(debts);

              console.log('tengo esto',$scope.debts)


        //funcion para traer solo los totales
        $scope.totales = _.each($scope.debts, function(total){
          $scope.granTotal= total.currentDebt;
          console.log('total', $scope.granTotal);

        });
            },


            function(err) {
              console.log(err);
             // $scope.notify(err.data.error.message);
            });

            $scope.result=$scope.debts ;
            console.log('mi resultado', $scope.result);


            }
          }//en funcion principal

  ])