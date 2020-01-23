angular.module('systemax')
  /**
  * @type controller
  * @name GuaranteeList
  * @enum   {(type | Array)} Lista de dependencias y servicios
  * @description Este controlador sirve para listar todas las garantías registradas
  */
  .controller('GuaranteeListRefund', ['$rootScope', '$scope', '$state', 'Guarantee', 'Stock', 'Warehouse', function($rootScope, $scope, $state, Guarantee, Stock, Warehouse) {
      var ctx = document.getElementById('myChart').getContext('2d');
      var days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves',
        'viernes', 'sábado']
      var labels = ['Registro', 'Recepción', 'Ingreso', 'Con el proveedor',
        'Re ingreso', 'Re asignación', 'Devolución'];
      var colors = ['rgb(245, 85, 85, 0.75)', 'rgb(115, 115, 225, 0.75)',
        'rgb(85, 200, 85, 0.75)', 'rgb(240, 225, 55, 0.75)',
        'rgb(255, 85, 210, 0.75)', 'rgb(99, 210, 255, 0.75)',
        'rgb(245, 185, 85, 0.75)'];
      var barCharData = {
            labels: [],
            datasets: []
          };
      // Objeto ChartJs
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: barCharData,
        // Configuration options go here
        options: {
          elements: {
            line: {
              tension: 0.2
            }
          },
          responsive: true,
          legend: {
            position: 'right'
          },
          title: {
            display: true,
            text: 'Semana del'
          },
          scales: {}
        },
        plugins: [{
          beforeInit: function (chart) {
            chart.data.labels.forEach(function (e, i, a) {
              if (/\n/.test(e)) {
                a[i] = e.split(/\n/)
              }
            })
          }
        }]
      });


      var guaranteeFilter = {
        include: [
           {relation: 'logs', scope:{order: 'date ASC'} }, 'warehouse',
          {relation: 'stock', scope: {
            include:[ 'product', 'client' , 'user']
          }}
        ],

     };


      /**
       * @name findGuarantee
       * @description Función para buscar un IMEI si esta en garantía
       * @param {string} serie Número de serie o IMEI para realizar la búsqueda.
       */
      function findGuaranteeRefund(serie) {
        console.log('mi imei es', serie);
        var stockFilter = {
          include: {relation: 'guaranties', scope: {
            limit: 1,
            order: 'created DESC'}},
          where: {IMEI: serie}};
        Stock.findOne({filter: stockFilter})
          .$promise
          .then(
            function(stock) {

                $scope.res=stock.id;
                console.log('hfyfnedy', $scope.res);
                getGuarantiesSearch($scope.res);

              if (!stock.guaranties.length) {
                $scope.showModal('fa-warning',
                  'El equipo no está en garantía',
                  '<p>El equipo con IMEI: <b>\''+ serie +
                  '\'</b> no ha sido registrado en garantías.</p>',
                  {hideCancel: true},
                  function() {
                    $scope.formFilters.input = '';
                  });
              } else {
                $state.go('admin.guarantee.list', {guaranteeId: stock.guaranties[0].id});
              }
            },
            function(err) {
              console.log(err);
              $scope.showModal('fa-warning',
              'Equipo no encontrado',
              '<p>El equipo con IMEI: <b>\''+ serie +
              '\'</b> no está registrado en el sistema.</p>',
              {hideCancel: true},
              function() {
                $scope.formFilters.input = '';
              });
            });
      }// End findGuarantee




      /**
       * @name getGuaranties
       * @description Recupera los datos de los colores registrados.
       */
      function getGuaranties() {
          // ... es del almacén principal
          var guaranteeFilter = {
            include: [
               {relation: 'logs', scope:{
                 order: 'date ASC'} }, 'warehouse',
              {relation: 'stock', scope: {
                include:[ 'product', 'client' , 'user']
              }}
            ],

         };
          Guarantee.find({filter: guaranteeFilter })
          .$promise
          .then(
            function(guarantee) {

              $scope.guaranties = guarantee;
              console.log('garantias0', $scope.guaranties);

            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
        }// End getGuaranties


        /**
         * @name getGuarantiesSearch
         * @description Recupera los datos de los colores registrados.
         */
        $scope.guarantee=[];
        $scope.guaranties =[];
        function getGuarantiesSearch(stock) {
          console.log('search', stock)
          // Variables generales**************************************************bjvjhbxcjhbxcjhvb
          var guaranteeFilter = {
            include: [
               {relation: 'logs', scope:{
                 order: 'date ASC'} }, 'warehouse',
              {relation: 'stock', scope: {
                include:[ 'product', 'client' , 'user']
              }}
            ],
            where:{idStock:stock},

         };
          Guarantee.find({filter: guaranteeFilter })
          .$promise
          .then(
            function(guarantee) {

              $scope.guaranties = guarantee;
              console.log('garantias0', $scope.guaranties);

            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
        }// End getGuaranties

      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de colores.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = guaranteeFilter.where;
        Guarantee.count({where: guaranteeFilter.where || {}})
          .$promise
          .then(function (count) {
            if (guaranteeFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload



      /**
       * @name initValues
       * @description Inicializa los datos del gráfico a cero.
       */
      function initValues() {
        for (var x = 0; x < 7; x++) {
          barCharData.datasets[x] = {
            fill: false,
            label: labels[x],
            backgroundColor: colors[x],
            borderColor: colors[x],
            data: []};
          for (var y = 0; y < 7; y++) {
            barCharData.datasets[x].data[y] = 0;
          }
        }
      }// End initValues


      /**
       * @name getDataChart
       * @description Recupera los datos de garantías para dibujar el gráfico.
       * @param {string} date Cadena de texto con formato YYYY-MM-DD.
       */
      function getDataChart(date) {
        var newDate = moment(date);
        Guarantee.tracing({warehouseId: $scope.currentUser.idWarehouse,
          isMain: $scope.currentUser.isMain, date: date})
          .$promise
          .then(
            function(data) {
              initValues();
              var tmp = (newDate.day() * -1);
              for (var x = 0; x < 7; x++) {
                newDate.add(tmp, 'days');
                var actualDay = stringDate(newDate, '-');
                var labelDay = stringDate(newDate, '/');
                var idx = 0;
                if (x === 0) {
                  chart.options.title.text = 'Semana del ' + labelDay;
                }
                _.each(data, function(row) {
                  if (row.eventDate === actualDay) {
                    switch (row.event) {
                      case 'create': idx = 0; break;
                      case 'check-in': idx = 1; break;
                      case 'entry': idx = 2; break;
                      case 'departure': idx = 3; break;
                      case 're-entry': idx = 4; break;
                      case 're-assignment': idx = 5; break;
                      case 'refund': idx = 6; break;
                    }
                    barCharData.datasets[idx].data[x] = row.total;
                  }
                });
                barCharData.labels[x] = days[x] + '\n' + labelDay;
                tmp = 1;
              }
              chart.options.title.text += ' al ' + labelDay;
              if ($scope.class === 'guarantee-pre-entry') {
                barCharData.datasets.splice(2, 7);
              } else if ($scope.class === 'guarantee-entry') {
                barCharData.datasets.splice(3, 7);
                barCharData.datasets.splice(0, 1);
              } else if ($scope.class === 'guarantee-tracking') {
                barCharData.datasets.splice(5, 7);
                barCharData.datasets.splice(0, 2);
              } else if ($scope.class === 'guarantee-re-assignment') {
                barCharData.datasets.splice(0, 4);
              }
              chart.update();
              // processLabels(newDate);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.date.error.message);
            });
      }// End getDataChart


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


      // Variables del $scope
      // Objeto del formulario
      $scope.formFilters = {};
      // Objeto de colores
      $scope.guaranties = {};
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        guaranteeFilter = _.extend(guaranteeFilter, $scope.pagination.filter);
        getGuaranties();
      };// End reloadData


      /**
       * @name getTitle
       * @description
       */
      $scope.getTitle = function() {
        switch ($scope.class) {
          case 'guarantee-pre-entry': return 'Registro';
          case 'guarantee-entry': return 'Recepción';
          case 'guarantee-tracking': return 'Actualización';
          case 'guarantee-re-assignment': return 'Reingreso';
        }
      };// End getTitle


      /**
       * @name edit
       * @description
       * @param {object} guarantee
       */
      $scope.edit = function(guarantee) {
        var state = 'admin.' + $scope.class + '.edit';
        $state.go(state, {guaranteeId: guarantee.id});
      };// End edit



      /**
       * @name validateTimeStatus
       * @description
       */
      $scope.validateTimeStatus = function(date1, date2) {
        console.log('mis fechas a comparar son', date1, date2);

        var dateA = moment(date1,"YYYY/MM/DD");
        var dateB= moment(date2,"YYYY/MM/DD");
        var time = 86400000;
        // Revisa el estado de la garantía para obtener los días
        switch (status) {
          case 'check-in': time *= 1; break;
          case 'entry': time *= 2; break;
          case 'departure': time *= 7; break;
          case 're-entry': time *= 1; break;
          case 're-assignment': time *= 1; break;
          case 'refund': time *= 1; break;
          default: time *= -1;
        }
        $scope.time = dateA - dateB;
        console.log(((dateA - dateB) > time));
        if ((dateA - dateB) > time) {
          return true;
        } else {
          return false;
        }
      }// End validateDate



      /**
       * @name validateDeparture
       * @description
       */
      $scope.validateDeparture = function(dateA, dateB) {
        var date1 = moment(date1,"YYYY/MM/DD");
        var date2= moment(date2,"YYYY/MM/DD");
        var time = 604800000;
        // Revisa el estado de la garantía para obtener los días
       /* switch (status) {
          case 'check-in': time *= 1; break;
          case 'entry': time *= 1; break;
          case 'departure': time *= 1; break;
          case 're-entry': time *= 1; break;
          case 're-assignment': time *= 1; break;
          case 'rfund': time *= 1; break;
          default: time *= -1;
        }*/
        $scope.time = dateA - dateB;
       // console.log(((dateA - dateB) > time));
        if ((dateA - dateB) > time) {
          return true;
        } else {
          return false;
        }
      }// End validateDate


      /**
       * @name validateDate
       * @description
       */
      $scope.validateDate = function(date, status) {
        console.log('',date, status);
        var today = $scope.getDateFormat(new Date(), 'x')
        var lastDay = $scope.getDateFormat(date, 'x');
        var time = 86400000;
        // Revisa el estado de la garantía para obtener los días
        switch (status) {
          case 'sale': time *= 60; break;
          case 'open': time *= 1; break;
          case 'check-in': time *= 1; break;
          case 'entry': time *= 2; break;
          case 'departure': time *= 7; break;
          case 're-entry': time *= 1; break;
          case 're-assignment': time *= 1; break;
          default: time *= -1;
        }
        // console.log(guarantee.status + 'vs' + guarantee.updated);
        if ((today - lastDay) > time) {
          return true;
        } else {
          return false;
        }
      }// End validateDate

      $scope.$watch('formFilters.input', function(imei) {
        if (imei) {
          findGuaranteeRefund(imei);

        } else {
          getGuaranties();
        }

      });// End watch formFilters.date

      // Watchers
      $scope.$watch('formFilters.date', function(date) {
        if (!date) return;
        var tmp = date.split('/');
        if (tmp.length === 3) {
          getDataChart(tmp[2] + '-' + tmp[1] + '-' + tmp[0]);
        }
      });// End watch formFilters.date
      // Código principal
      var today =  moment();
      $scope.formFilters.date = stringDate(today, '/');
      if ($scope.class === 'guarantee-entry') {
        guaranteeFilter.where = {status: 'check-in'}
      } else if ($scope.class === 'guarantee-tracking') {
        guaranteeFilter.where = {status: 'entry'}
      }
      recalculateCountAndReload();
    }
  ])




  /**
  * @type controller
  * @name GuaranteeForm
  * @enum   {(type | Array)} Lista de dependencias y servicios
  * @description Este controlador sirve para registrar una garantía
  */
  .controller('GuaranteeFormRefund', ['$scope','$rootScope', '$state', 'Billing', 'Guarantee', 'Stock', 'Product', 'Failure', function($scope,$rootScope,  $state, Billing, Guarantee, Stock, Product, Failure) {
      // Variables generales
      var redirect = false;


      /**
       * @name createGuarantee
       * @description
       */
      function createGuarantee() {
        $scope.guarantee.idStock = $scope.stock.id;
        $scope.guarantee.idProduct = $scope.stock.idProduct;
        $scope.guarantee.idSeller = $scope.stock.idUser;
        $scope.guarantee.idWarehouse = $scope.stock.idWarehouse;
        $scope.guarantee.idClient = $scope.stock.idClient;
        $scope.guarantee.status = 'open';
        Guarantee.create($scope.guarantee )
          .$promise
          .then(
            function(guarantee) {
              $scope.notify('Garantía registrada satisfactoriamente. Ticket' +
              guarantee.guideNumber, 'success');
              if ($scope.currentUser) {
                $state.go('admin.guarantee-pre-entry.list');
              } else {
                $state.go('client.guarantee-success', {guaranteeId: guarantee.id});
              }
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End createGuarantee


      /**
       * @name getClientByEmail
       * @description Recupera los datos de un cliente a través de su mail.
       * @param {string} email Correo electrónico del cliente buscado.
       */
      function getClientByEmail(email) {
        $scope.busy = true;
        var clientFilter = {
          where: {email: email}};
        Billing.findOne({filter: clientFilter})
          .$promise
          .then(
            function(client) {
              $scope.busy = false;
              $scope.client = client;
              $('#imei').focus();
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.showModal('fa-warning',
                'Correo electrónico invalido',
                '<p>El correo electrónico: <b>\''+ $scope.client.email +
                '\'</b> no es valido, revise el dato proporcionado.</p>',
                {hideCancel: true},
                function() {
                  // Nada
                });
            });
      }// End getClientByEmail






        /**
       * @name getGuarantee
       * @description Recupera los datos de una garantía por su Id.
       * @param {string} guaranteeId Identificador de la garantía.
       */
      function getGuarantee(guaranteeId) {
        var guaranteeFilter = {
          include: ['client', 'seller',
            {relation: 'failures', scope: {
              include: ['failure',{relation:'product',scope: {
                include: ['accessories', 'color',
                  {relation: 'model', scope: {
                    include: 'brand'}},
                  {relation: 'type', scope: {
                    include: 'failures'}}]} } ]
            }},

            {relation: 'accessories', scope: {
              include: 'accessory'
            }},
            {relation: 'logs', scope: {
              order: 'date DESC'
            }},
            {relation: 'stock', scope: {
              include: [
                'warehouse',
                'client',
                'user',
                {relation: 'guaranties', scope: {
                  order: 'created DESC'
                }},
                {relation: 'product', scope: {
                  include: ['accessories', 'color',
                    {relation: 'model', scope: {
                      include: 'brand'}},
                    {relation: 'type', scope: {
                      include: 'failures'}}]}}]}}
          ]
        };
        Guarantee.findById({id: guaranteeId, filter: guaranteeFilter})
          .$promise
          .then(
            function(guarantee) {
              $scope.guarantees = guarantee;

                processGuarantee(guarantee);

            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getGuarantee

      /**
       * @name getStockByImei
       * @description Recupera los datos de un stock a través de su número de
       * serie.
       * @param {string} IMEI Número de serie/IMEI buscado.
       * @param {string} clientId Valor opcional, identificador único del
       * cliente
       */
      function getStockByImei(IMEI, clientId) {
        $scope.busy = true;
        var stockFilter = {
          include: [
            'warehouse',
            'client',
            'user',
            {relation: 'product', scope: {
              include: ['color',
                {relation: 'accessories', scope: {
                  order: 'name'}},
                {relation: 'model', scope: {
                  include: 'brand'}},
                {relation: 'type', scope: {
                  include: 'failures'
                }}]}},
            {relation: 'guaranties', scope: {
              order: 'created DESC'
            }}],
          where: {
            and: [
              {IMEI: IMEI}]}};
        if (clientId) {
          stockFilter.where.and.push({idClient: clientId});
        }
        Stock.findOne({filter: stockFilter})
          .$promise
          .then(
            function(stock) {
              $scope.busy = false;
              validateStock(stock, true);
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.showModal('fa-warning',
                'Número de serie/IMEI invalido',
                '<p>El número de serie/IMEI: <b>\''+ $scope.stock.IMEI +
                '\'</b> no es valido, revise el dato proporcionado.</p>' +
                '<p>Si el equipo tiene dos IMEIs pruebe registrando el segundo.</p>',
                {hideCancel: true},
                function() {
                  // Nada
                });
            });
      }// End getStockByImei


      /**
       * @name makeGuideNumber
       * @description Genera el número de la garantía.
       */
      function makeGuideNumber() {
        var today = moment().format('YYYYMMDD');
        var guaranteeFilter = {
          limit: 1,
          where: {guideNumber: {like: today + '%'}},
          order: ['guideNumber DESC']};
        Guarantee.find({filter: guaranteeFilter})
          .$promise
          .then(
            function(iGuarantee) {
              var num = 1;
              var tmp = '00';
              if (iGuarantee.length) {
                num = iGuarantee[0].guideNumber.substr(-3);
                num = parseInt(num) + 1;
              }
              tmp += num;
              $scope.guarantee.guideNumber = today + tmp.substr(-3);
              // Guardar el registro
              createGuarantee();
            });
      }// End makeGuideNumber



      /**
       * @name processGuarantee
       * @description Procesa los datos obtenidos del objeto guarantee.
       * @param {object} guarantee
       */
      function processGuarantee(guarantee) {
        if (guarantee && guarantee.length > 1) {
          $scope.inputs.history = 'Equipo con ingresos a garantía previos';
        }
        validateStock(guarantee.stock, false);
        delete guarantee.stock;
        // Actualizar a mano para evitar error al actualizar
        $scope.guarantee.id = guarantee.id;
        $scope.guarantee.status = guarantee.status;
        $scope.guarantee.idStock = guarantee.idStock;
        $scope.guarantee.idProduct = guarantee.idProduct;
        $scope.guarantee.hasCost = guarantee.hasCost;
        $scope.guarantee.forRefund = guarantee.forRefund;
        $scope.guarantee.isRefurb = guarantee.isRefurb;
        $scope.guarantee.cost = guarantee.cost;
        $scope.guarantee.guideNumber = guarantee.guideNumber;
        $scope.guarantee.created = guarantee.created;
        if (guarantee.logs) {
          $scope.guarantee.logs = guarantee.logs;
          var checkin = _.find(guarantee.logs, function(g) {
            return g.event === 'check-in';
          });
          if (checkin) {
            $scope.stock.dateCheckIn = checkin.date;
          }
        }
        // Activar casillas de los accesorios
        var tmp = '';
        _.each(guarantee.accessories, function(a) {

          $scope.addAccessory({id: a.idAccessory, value: true});
          var findAccesory = _.find($scope.stock.product.accessories, function(iA) {
            return a.idAccessory === iA.id;
          });
          findAccesory.value = true;
          if (tmp !== '') {
            tmp += ', ';
          }
          tmp += a.accessory.name;
        });
        $scope.inputs.accessories = tmp;
        // Activar casillas de las fallas
        var tmp = '';
        _.each(guarantee.failures, function(f) {
          $scope.fallas=f;
          $scope.addFailure({id: f.idFailure, value: true});

         /* var findFailure = _.find($scope.stock.product.type.failures, function(iF) {
            return f.idFailure === iF.id;
          });
          findFailure.value = true;*/

          if (tmp !== '') {
            tmp += ', ';
          }
          tmp += f.failure.name;
        });
        $scope.inputs.failures = tmp;

      }// End processGuarante



  //Objeto donde se almacena el almacenista que actualizara el imei
  $scope.select = function(boos){
    $scope.booss = boos;
}

  //Objeto donde se almacena el almacenista que actualizara el imei
  $scope.$watch('formFilters', function(imei) {
    $scope.newIm = imei;
  });// End watch formFilters.date


    /**
       * @name updateGuaranteee
       * @description Actualiza un registro de Guarantee.
       * @param {string} guaranteeId Idenfificador de la garantía.
       */
      function updateGuaranteee(guaranteeId) {
        // $scope.guarantee.status = 'check-in';

        $scope.guarantee.idProduct = $scope.stock.idProduct ? $scope.stock.idProduct : $scope.guarantee.failures[0].idProduct;
        Guarantee.prototype$patchAttributes({id: guaranteeId}, $scope.guarantee)
          .$promise
          .then(
            function(guarantee) {
              $scope.notify($scope.message + ' satisfactoriamente.',
              'success');
              var tmp = 'admin.' + $scope.class + '.list'
              $state.go(tmp);
              if(guarantee.status === 'canceled'){
              $state.go('admin.guarantee.status-sheet', {guaranteeId: guarantee.id});
              }
              _.each($scope.guarantee, function(stock){
                $scope.stock= stock.idStock;

              })


            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End updateGuarantee

      /**
       * @name updateRefund
       * @description Actualiza un registro de Guarantee.
       * @param {string} guaranteeId Idenfificador de la garantía.
       */
      function updateRefund(guaranteeId) {

        var guaranteeFilter = {
          include: [
             {relation: 'logs', scope:{order: 'date ASC'} }, 'warehouse',
            {relation: 'stock', scope: {
              include:[ 'product', 'client' , 'user']
            }}
          ],
          where: {
            id: guaranteeId},
          order: ['created DESC']
       };

        // $scope.guarantee.status = 'check-in';
        $scope.guarantee.idProduct = $scope.stock.idProduct ? $scope.stock.idProduct : $scope.fallas.idProduct ;
        Guarantee.find({filter: guaranteeFilter})
          .$promise
          .then(
            function(guarantee) {

              console.log('el id del stock',guarantee[0].idStock);
              console.log('el precio del producto',guarantee[0].stock.salesPrice);

              updateStock(guarantee[0].idStock, guarantee[0].stock.salesPrice);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End updateGuarantee


       /**
       * @name updateStock
       * @description Actualiza un registro de Guarantee.
       * @param {string}  idstock Idenfificador de la garantía.
       */
     function updateStock(idstock, salesPrice) {
        var forRefundd = $scope.forRefund;
        console.log(' updateStock ---> idStock', idstock );
        console.log(' updateStock ---> Precio', salesPrice );
        // $scope.guarantee.status = 'check-in';
       Stock.prototype$patchAttributes({id: idstock},{forRefund:forRefundd, args:{ data: { description:"Garantia para bonificar por" + ' ' + salesPrice, status:'sold' }}} )
          .$promise
          .then(
            function(guarantee) {
              $scope.notify($scope.message + ' satisfactoriamente.',
              'success');
              var tmp = 'admin.' + $scope.class + '.list'
              $state.go(tmp);
            },
            function(err) {
              console.log(err);

      //$scope.notify(err.data.error.message);
            });

      }// End updateGuarantee*/



      /**
       * @name validateDate
       * @description Valida la fecha para indicar si está dentro del rango.
       * @param {date} date Fecha de comparación.
       * @param {string} status Estado de la garantía.
       */
      $scope.validateDate = function(date, status) {
        let dateSale= new Date(date).getTime();

        let dateCurrent = new Date().getTime();

        let diff = dateCurrent - dateSale;
        let timeElapsed = diff / (1000*60*60*24);


        // console.log(guarantee.status + 'vs' + guarantee.updated);
        if (timeElapsed < 60) {

          return true;
        } else {
          return false;
        }
      }// End validateDate



      /**
       * @name validateStock
       * @description Valida los datos obtenidos del objeto stock.
       * @param {object} stock Objeto con los datos del stock.
       * @param {boolean} flag Bandera para validar guarantias pendientes.
       */
      function validateStock(stock, flag) {
        if(stock != null){
        var today = $scope.getDateFormat(new Date(), 'x')
        var saleDay = $scope.getDateFormat(stock.saleDate, 'x');
        var year = 31536000000;
        $scope.stock = stock;
        $scope.stock.inTime = true;
        $scope.isRefurb=true;
        $scope.forRefund=true;
        $scope.validateTime = $scope.validateDate(stock.saleDate , 'sale');
        if ($scope.validateTime === true ) {
          $("#accessories").hide();
        }


        // $scope.stock.saleDate =
        // $scope.getDateFormat($scope.stock.saleDate, 'L');
        // Producto fuera de garantía
        if ((today - saleDay) > year) {
          $scope.guarantee.hasCost = true;
          $scope.stock.inTime = false;
        }
        // Obtener datos del vendedor
        if (stock.user.type === 'seller') {
          $scope.stock.seller = {
            name: stock.user.name + ' ' + stock.user.lastName};
        }
        // Validar que no tenga un registro abierto
        if (stock.guaranties && flag) {
          _.each(stock.guaranties, function(g) {
            if (g.status !== 'refund' && g.status !== 'canceled') {
              redirect = true;
              return $scope.showModal('fa-warning',
              'Equipo con un registro previo',
              '<p>El equipo con IMEI: <b>\''+ $scope.stock.IMEI +
              '\'</b> ya cuenta con el reporte de garantía <b>\'' +
              g.guideNumber + '\'</b>. No se requiere volver a registrar el formato.</p>',
              {hideCancel: true},
              function() {

              });
            }
          });
        }
      }
      }// End validateStock



      // Variables del $scope
      $scope.client = {};
      // Objeto de inputs
      $scope.inputs = {
        history: 'No se ha ingresado a garantías anteriormente'};
      // Arreglo de objeto de eventos
      $scope.events = [
        // check-in
        {id: 'canceled', label: 'No procede. Cancelar la garantía'},
        {id: 'entry', label: 'Procede, Ingresar la garantía.'},
        {id: 'departure', label: 'Salida de almacén con el proveedor'},
        {id: 're-entry', label: 'Reingreso de garantía '},
        {id: 're-assignment', label: 'Reasignación de la garantía.'},
        {id: 'return', label: 'Devolucion '}
      ];
      // Objeto de stock
      $scope.stock = {};
      // Objeto de garantía
      $scope.guarantee = {
        accessories: [],
        failures: [],
        hasCost: false
      };
      // Funciones del $scope
      /**
       * @name addAccessory
       * @param {object} accessory Objeto con los datos del accesorio.
       */
      $scope.addAccessory = function(accessory) {
        var find = _.find($scope.guarantee.accessories, function(a) {
          return a.id === accessory.id;
        });
        if (!find) {
          $scope.guarantee.accessories.push(accessory);
        } else {
          $scope.guarantee.accessories =
            _.without($scope.guarantee.accessories,
              _.findWhere($scope.guarantee.accessories, {id: accessory.id}));
        }
      };// End addAccessory


      /**
       * @name addFailure
       * @param {object} failure Objeto con los datos de la falla.
       */
      $scope.addFailure = function(failure) {
        var find = _.find($scope.guarantee.failures, function(f) {
          return f.idFailure === failure.id;
        });
        if (!find) {
          $scope.guarantee.failures.push(failure);
        } else {
          $scope.guarantee.failures =
            _.without($scope.guarantee.failures,
              _.findWhere($scope.guarantee.failures, {id: failure.id}));
        }
      };// End addFailure


      /**
       * @name guaranteeStatus
       * @description Devuelve el nombre del estado de la garantía en español.
       * @param {string} status Estado de la garantía en inglés.
       */
      $scope.guaranteeStatus = function(status) {
        switch (status) {
          case 'create': return 'Registro';
          case 'check-in': return 'Recepción';
          case 'entry': return 'Ingreso';
          case 'departure': return 'Con el proveedor';
          case 're-entry': return 'Re ingreso';
          case 're-assignment': return 'Re asignación';
          case 'refund': return 'Devolución';
          default: return '';
        }
      };// End guaranteeStatus


      /**
       * @name goTo
       * @description Redirecciona la vista según el tipo de usuario
       */
      $scope.goTo = function() {
        if ($scope.currentUser) {
          $state.go('admin.' + $scope.class + '.list');
        } else {
          $state.go('client');
        }
      }// End goTo


      /**
       * @name save
       * @description Valida el formulario de registro de garantía.
       */
      $scope.save = function() {
        console.log('entro a save');
        $('form.needs-validation').addClass('was-validated');
        var msg = '';
        // Validación del formulario
        if (!$scope.guarantee.failures.length) {
          msg = 'No ha declarado las fallas del equipo, para continuar debe ' +
            'incluirlos';
        }
        if($scope.validateTime ==='false' ){
        if (!$scope.guarantee.accessories.length) {
          msg = 'No ha declarado los accesorios que acompañan al equipo, ' +
            'para continuar debe incluirlos';
        }}

          if ($scope.guarantee.hasCost ==='false') {
            msg = 'No ha declarado los accesorios que acompañan al equipo, ' +
              'para continuar debe incluirlos';
          }


        // Formulario con error
        if (msg !== '') {
          $scope.notify(msg);
          return;
        }
        if ($state.params.guaranteeId) {
          // ... si es una actualización
          updateStock($state.params.guaranteeId);
        } else {
          // ... es un registro nuevo, primero generar el numero de orden
          makeGuideNumber();
        }
        if ($state.params.guaranteeId) {
          // ... si es una actualización
          updateGuarantee($state.params.guaranteeId);
        } else {
          // ... es un registro nuevo, primero generar el numero de orden
          makeGuideNumber();
        }
      };// End save


      /**
       * @name save
       * @description Valida el formulario de registro de garantía.
       */
      $scope.save3 = function() {
        console.log('entro a save');
        $('form.needs-validation').addClass('was-validated');
        var msg = '';
        // Validación del formulario
        if (!$scope.guarantee.failures.length) {
          msg = 'No ha declarado las fallas del equipo, para continuar debe ' +
            'incluirlos';
        }
        if($scope.validateTime ==='false' ){
        if (!$scope.guarantee.accessories.length) {
          msg = 'No ha declarado los accesorios que acompañan al equipo, ' +
            'para continuar debe incluirlos';
        }}

          if ($scope.guarantee.hasCost ==='false') {
            msg = 'No ha declarado los accesorios que acompañan al equipo, ' +
              'para continuar debe incluirlos';
          }

        // Formulario con error
        if (msg !== '') {
          $scope.notify(msg);
          return;
        }
       /* if ($state.params.guaranteeId) {
          // ... si es una actualización
          updateStock($state.params.guaranteeId);
        } else {
          // ... es un registro nuevo, primero generar el numero de orden
          makeGuideNumber();
        }*/
        if ($state.params.guaranteeId) {
          // ... si es una actualización
          updateGuaranteee($state.params.guaranteeId);
        } else {
          // ... es un registro nuevo, primero generar el numero de orden
          makeGuideNumber();
        }
      };// End save



      /**
       * @name searchClient
       * @description Valida el formulario de búsqueda de clientes.
       */
      $scope.searchClient = function() {
        getClientByEmail($scope.client.email);
      };// End searchClient


      /**
       * @name searchProduct
       * @description Valida el formulario de búsqueda de productos.
       */
      $scope.searchProduct = function() {
        if ($scope.client.id) {
          getStockByImei($scope.stock.IMEI, $scope.client.id);
        } else {
          getStockByImei($scope.stock.IMEI);
        }
      };// End searchProduct


      /**
       * @name stockStatus
       * @description Devuelve el valor de estado del stock.
       * @param {string} status Estado actual del stock.
       */
      $scope.stockStatus = function(status) {
        switch (status) {
          case 'active': return 'Activo';
          case 'assigned': return 'Asignado';
          case 'sold': return 'Vendido';
          default: return 'Desconocido';
        }
      };// End stockStatus


      /**
       * @name update
       * @description Valida el formulario de actualización de garantía.
       */
      $scope.update = function() {
        $('form.needs-validation').addClass('was-validated');
        var msg = '';
        // Validación del formulario
        if(!$scope.guarantee.forRefund){
          msg = 'Seleccionar Bonificar Garantía';
        }
        // Formulario con error
        if (msg !== '') {
          $scope.notify(msg);
          return;
        }
        $scope.guarantee.status = $scope.inputs.status;

        //delete $scope.guarantee.accessories;
        //delete $scope.guarantee.failures;
        updateRefund($state.params.guaranteeId);
      };// End update


      // Watchers
      // Código principal
      if ($state.params.guaranteeId) {
        getGuarantee($state.params.guaranteeId);
      }
      // Dissmiss Modal
      $('#genericModal').on('hidden.bs.modal', function(e) {
        if (redirect === true) {
          $scope.goTo();
        }
        $('input.search').val('').prop('disabled', false).focus();
      });


      //getProduct ()
    }
  ]);
