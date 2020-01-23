angular.module('systemax')
  /**
  * @type controller
  * @name GuaranteeList
  * @enum   {(type | Array)} Lista de dependencias y servicios
  * @description Este controlador sirve para listar todas las garantías registradas
  */
  .controller('GuaranteeListReport', [
    '$rootScope',
    '$scope',
    '$state',
    'Guarantee',
    'Stock',
    'Warehouse',
    'DTOptionsBuilder',
    'DTColumnBuilder',
    'DTColumnDefBuilder',
    function($rootScope, $scope, $state, Guarantee, Stock, Warehouse, DTOptionsBuilder,
      DTColumnBuilder,
      DTColumnDefBuilder) {
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

      //  $('#datepicker').focus(); //Focus input IMEI

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
          'logs',
          'warehouse',
          {relation: 'stock', scope: {
            include: 'product'
          }}
        ],
        where: {
          status: 'create'},
        order: ['created DESC']};
        $scope.languageDataTables = {

          "sZeroRecords":     "Cargando...",
          "sSearch":         "Buscar:",
          "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",

        }


        $scope.vm1 = {};
        $scope.vm1.dtInstance = {};
        $scope.vm1.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(5).notSortable()];
        $scope.vm1.dtOptions = DTOptionsBuilder.newOptions()
         .withDisplayLength(50)
         .withOption('paging', true)
         /*.withOption('scrollY', '50vh')*/
         .withOption('scrollX', true)
         /*.withOption('fixedHeader', true)*/
         /*.withOption("autoWidth", true)*/
         /*.withOption('scrollCollapse', true)*/
         /*.withOption("bDestroy", true)*/
         .withOption('visible', true)
         .withOption('fixedHeader', true)
         .withOption("processing", true)
         .withOption('searching', true)
         .withOption('info', true)
         .withOption('dom', 'Bfrtip')
         .withOption('select', true)
         .withOption('responsive', true)
         .withLanguage($scope.languageDataTables)
         .withButtons([
           {
             extend:    'copy',
             text:      '<i class="fa fa-files-o"></i> Copiar',
             titleAttr: 'Copiar',
             footer: true
           },
           {
             extend:    'print',
             text:      '<i class="fa fa-print" aria-hidden="true"></i> Imprimir',
             titleAttr: 'Imprimir',
             footer: true
           },
           {
             extend:    'excel',
             text:      '<i class="fas fa-file-alt"></i> Excel',
             titleAttr: 'Excel',
             footer: true,
             exportOptions: { columns: "thead th:not(.noExport)" }
           },
           {
             extend:    'pdf',
             text:      '<i class="fas fa-file-pdf"></i> PDF',
             titleAttr: 'Pdf',
             footer: true
           }

         ]);


      /**
       * @name findGuarantee
       * @description Función para buscar un IMEI si esta en garantía
       * @param {string} serie Número de serie o IMEI para realizar la búsqueda.
       */
      function findGuaranteeReport(serie) {
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

              //console.log('mi resultado de busqueda', stock);
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
                $state.go('admin.guarantee-report.list', {guaranteeId: stock.guaranties[0].id});
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

      /* Función que suma o resta días a una fecha, si el parámetro
         días es negativo restará los días*/
      function sumarDias(){
        $scope.d = new Date();
        $scope.date = moment($scope.d).format('YYYY-MM-DD');
        console.log('mi fecha hoy', $scope.date);

        $scope.res= moment($scope.date).subtract(30, 'days').calendar();
        $scope.date1=moment($scope.res).format('YYYY-MM-DD');
        console.log('mi fecha es', $scope.date1);
        getGuaranties();
      }


     /**
       * @name getGuaranties
       * @description Recupera los datos de los colores registrados.
       */
      $scope.event=[]; //Areglo para almacenar los logs de cada garantía
      $scope.guarantee=[];
      $scope.logs=[];
      $scope.eventos=[];
      //$scope.date = moment().format('L');

      function getGuaranties() {

        var guaranteeFilterr = {
          include: ['client', 'stock', 'warehouse',
            {relation: 'failures', scope: {
              include: {relation:'product', scope: {fields: ['name']}}
            }},
            {relation: 'logs', scope: {
              order: ['date DESC']
            }}],
            where:{and:[{created: {lte: $scope.date +' 00:00:00'}},
            {created: {gte:  $scope.res + ' 00:00:00'}}]
            }
          };

          // ... es del almacén principal
          Guarantee.find({filter: guaranteeFilterr, })
          .$promise
          .then(
            function(guarantee) {
              console.log("Respuesta de la consulta de garantíassss", guarantee);
               _.each(guarantee, function(events){
                 let newLog = {
                   checkIn: '',
                   entry: '',
                   departure: '',
                   reEntry: '',
                   reAssignment: '',
                   refund: '',
                 }

                _.each(events.logs, function(log, index){
                  //console.log('log', log);
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

                newLog.imei = events.idStock ? events.stock.IMEI : 'No tiene';
                newLog.ticket = events.guideNumber;
                  newLog.warehouse = events.warehouse.name ;
                //newLog.client = events.client.name;
                newLog.updated = events.updated;
                $scope.event.push(newLog)
                //console.log("Respuesta ", $scope.event);

              });
              $scope.event=  _.sortBy($scope.event, 'ticket').reverse();


              //(console.log('mis logs',$scope.event)
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
         $scope.event1=[]; //Areglo para almacenar los logs de cada garantía
         $scope.guarantee=[];
         $scope.logs=[];
         $scope.eventos=[];
         //$scope.date = moment().format('L');

         function getGuarantiesSearch(stock) {
           var guaranteeFilterS = {
             include: ['client', 'stock', 'warehouse',
               {relation: 'failures', scope: {
                 include: {relation:'product', scope: {fields: ['name']}}
               }},
               {relation: 'logs', scope: {
                 order: ['date DESC']
               }}],
               where:{idStock:stock,
               }
             };

             // ... es del almacén principal
             Guarantee.find({filter: guaranteeFilterS, })
             .$promise
             .then(
               function(guarantee) {
                  _.each(guarantee, function(events){
                    console.log("Respuesta de la consulta de garantía", events);

                    let newLog = {
                      checkIn: '',
                      entry: '',
                      departure: '',
                      reEntry: '',
                      reAssignment: '',
                      refund: '',
                    }

                   _.each(events.logs, function(log, index){
                     //console.log('log', log);
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

                   newLog.imei = events.idStock ? events.stock.IMEI : 'No tiene';
                   newLog.ticket = events.guideNumber;
                     newLog.warehouse = events.warehouse.name ;
                   //newLog.client = events.client.name;
                   newLog.updated = events.updated;
                   $scope.event1.push(newLog)
                   console.log("Respuesta ", $scope.event1);


                 });
                 $scope.event=  _.sortBy($scope.event1, 'ticket').reverse();


                 //console.log('mis logs',$scope.event);
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
       * @name getDataChart0
       * @description Recupe0ra los datos de garantías para dibujar el gráfico.
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
        //getGuaranties();
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
       * @name searchGuarantee
       * @description
       */
       $scope.$watch('formFilters.input', function(imei) {
         if (imei) {
           findGuaranteeReport(imei);

         } else {
           if (!imei) {
             sumarDias();
              //getGuaranties();

           }

         }

       });// End watch formFilters.date
     /* $scope.searchGuarantee = function() {
        findGuarantee($scope.formFilters.input);
        console.log('mi imei es', $scope.formFilters.input )
      }// End searchGuarantee
      /**
       * @name validateTimeStatus
       * @description
       */
      $scope.validateTimeStatus = function(date1, date2) {
        //console.log('mis fechas a comparar son', date1, date2);

        var dateA = moment(date1);
        //console.log('fecha1', dateA);

        var dateB= moment(date2);
        //console.log('fecha2', dateB);

         $scope.diff = dateB.locale('es-mx').from(dateA, true);
        //console.log('diferencia', $scope.diff);


        let dateSale= new Date(date1).getTime();
        //console.log('fecha de venta', dateSale);

        let dateCurrent = new Date(date2).getTime();
        //console.log('fecha actual', dateCurrent );

        let diff = dateCurrent - dateSale;
        $scope.timeElapsed = diff / (1000*60*60*24);
        if($scope.timeElapsed > 1){
          return true
        }else{
          return false
        }
       /* let timeElapsed = diff / (1000*60*60*24);*/

        /*console.log('tiempo transcurrido diferencia', diff);
        console.log('tiempo transcurrido ', timeElapsed);*/
      }// End validateDate





      /**
       * @name validateDate
       * @description
       */
      $scope.validateDate = function(date, status) {
        //console.log('ENTRO CON:',date, status);
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
        if ((today - lastDay) > time ) {
          return true;
        } else {
          return false;
        }
      }// End validateDate



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
  .controller('GuaranteeFormReport', [
    '$scope',
    '$state',
    'Brand',
    'Color',
    'Guarantee',
    'Product',
    'ProductType',
    'Stock',
    'SysUser',
    function($scope, $state, Brand, Color, Guarantee, Product, ProductType, Stock, SysUser) {
      // Variables generales
      // Funciones generales
      /**
       * @name createGuarantee
       * @description Agrega un registro de Guarantee.
       */
      function createGuarantee(guarantee, cb) {
        guarantee.status = 'check-in';
        Guarantee.create(guarantee)
          .$promise
          .then(
            function(guarantee) {
              cb(null, guarantee);
            },
            function(err) {
              cb(err);
            });
      }// End createGuarantee
      /**
       * @name getBrands
       * @description Recupera las marcas con sus respectivos modelos.
       */
      function getBrands() {
        var bFilter = {
          include: {
            relation: 'models', scope: {
              order: ['name']}
          },
          order: ['name']
        };
        Brand.find({filter: bFilter})
          .$promise
          .then(
            function(brands) {
              $scope.brands = brands;
              getProductTypes();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getBrands
      /**
       * @name getColors
       * @description Recupera la lista de colores.
       */
      function getColors() {
        Color.find({filter: {order: ['index']}})
          .$promise
          .then(
            function(colors) {
              $scope.colors = colors;
              getBrands();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getColors
      /**
       * @name getGuarantee
       * @description Recupera los datos de una garantía por su Id.
       * @param {string} guaranteeId Identificador de la garantía.
       * @param {function} cb Función de callback.
       */
      function getGuarantee(guaranteeId, cb) {
        var guaranteeFilter = {
          include: [
            {relation: 'failures', scope: {
              include: 'failure'
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
              cb(null, guarantee)
            },
            function(err) {
              cb(err)
            });
      }// End getGuarantee
      /**
       * @name getProductTypes
       * @description Recupera los tipos de productos con sus respectivas variantes.
       */
      function getProductTypes() {
        var ptFilter = {
          include: [
            'failures',
            {relation: 'variant', scope: {
              include: {
                relation: 'options', scope: {
                  order:['index']}}}}]};
        ProductType.find({filter: ptFilter})
          .$promise
          .then(
            function(productTypes) {
              $scope.productTypes = productTypes;
              getSellers();
            },
            function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End getProductTypes
      /**
       * @name getStockFromImei
       * @description Recupera un objeto stock desde su IMEI.
       * @param {string} imei Número de serie/IMEI del stock.
       * @param {function} cb Función de callback.
       */
      function getStockFromImei(imei, cb) {
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
          where: {IMEI: imei}};
        Stock.findOne({filter: stockFilter})
          .$promise
          .then(
            function(response) {
              return cb(null, response);
            },
            function(err) {
              console.log(err);
              return cb(err);
            });
      }// End getStockFromImei
      /**
       * @name getSellers
       * @description Recupera los datos de los vendedores y sus clientes.
       */
      function getSellers() {
        var sellerFilter = {
          include: 'clients',
          where: {type: 'seller'}};
        SysUser.find({filter: sellerFilter})
          .$promise
          .then(
            function(sellers) {
              $scope.sellers = sellers;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getSellers
      /**
       * @name findProduct
       * @description Recupera los datos de un producto en base a:
       * tipo de producto, marca, modelo y color
       */
      function findProduct() {
        if (!$scope.product.idProductType ||
        !$scope.product.idBrand ||
        !$scope.product.idProductModel ||
        !$scope.product.idColor) {
          // ...no puede hacer la consulta
          return;
        }
        $scope.guarantee.idProduct = null;
        var productFilter = {
          where: {
            and: [
              {idProductType: $scope.product.idProductType},
              {idBrand: $scope.product.idBrand},
              {idProductModel: $scope.product.idProductModel},
              {idColor: $scope.product.idColor}]}};
        Product.findOne({filter: productFilter})
          .$promise
          .then(
            function(product) {
              $scope.guarantee.idProduct = product.id;
            },
            function(err) {
              console.log(err);
              $scope.notify('El color solicitado no está en la base de datos.');
            });
      }// End searchProduct
      /**
       * @name processGuarantee
       * @description Procesa los datos obtenidos del objeto guarantee.
       * @param {object} guarantee Objeto con los datos de la garantía.
       */
      function processGuarantee(guarantee) {
        if (guarantee.stock.guaranties && guarantee.stock.guaranties.length > 1) {
          $scope.inputs.history = 'Equipo con ingresos a garantía previos';
        }
        validateStock(guarantee.stock, false);
        delete guarantee.stock;
        // Actualizar a mano para evitar error al actualizar
        $scope.guarantee.id = guarantee.id;
        $scope.guarantee.status = guarantee.status;
        $scope.guarantee.hasCost = guarantee.hasCost;
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
        var tmp = '';
        // Activar casillas de los accesorios
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
        tmp = '';
        // Activar casillas de las fallas
        _.each(guarantee.failures, function(f) {
          $scope.addFailure({id: f.idFailure, value: true});
          var findFailure = _.find($scope.stock.product.type.failures, function(iF) {
            return f.idFailure === iF.id;
          });

          findFailure.value = true;
          if (tmp !== '') {
            tmp += ', ';
          }
          tmp += f.failure.name;
        });
        $scope.inputs.failures = tmp;
      }// End processGuarantee
      /**
       * @name updateGuarantee
       * @description Actualiza un registro de Guarantee.
       * @param {string} guaranteeId Idenfificador de la garantía.
       */
      function updateGuarantee(guaranteeId, guarantee, cb) {
        Guarantee.prototype$patchAttributes({id: guaranteeId}, guarantee)
          .$promise
          .then(
            function(guarantee) {
              cb(null, guarantee);
            },
            function(err) {
              cb(err);
            });
      }// End updateGuarantee
      /**
       * @name validateStock
       * @description Valida los datos del stock.
       * @param {object} stock Objeto con los datos del stock.
       * @param {boolean} flag Bandera para validar las garantías prevías.
       */
      function validateStock(stock, flag) {
        if (!$scope.stock.saleDate) {
          // ...no se ha vendido
          $scope.stock.saleDate = new Date();
        }
        var today = $scope.getDateFormat(new Date(), 'x')
        var saleDay = $scope.getDateFormat(stock.saleDate, 'x');
        var year = 31536000000;
        $scope.stock = stock;
        $scope.stock.inTime = true;
        if ((today - saleDay) > year) {
          // ...producto fuera de garantía
          $scope.guarantee.hasCost = true;
          $scope.stock.inTime = false;
        }
        $scope.guarantee.idSeller = $scope.currentUser.id;
        $scope.guarantee.idWarehouse = stock.idWarehouse;
        $scope.guarantee.idProduct = stock.idProduct;
        $scope.guarantee.idStock = stock.id;
        if (stock.idClient) {
          // ...obtener datos del cliente
          $scope.guarantee.idClient = stock.idClient;
        }
        if (stock.user.type === 'seller') {
          // ...obtener datos del vendedor
          $scope.stock.seller = {
            name: stock.user.name + ' ' + stock.user.lastName};
          $scope.guarantee.idSeller = stock.user.id;
        }
        // Validar que no tenga un registro abierto
        if (stock.guaranties && flag) {
          _.each(stock.guaranties, function(g) {
            if (g.status !== 'refund' && g.status !== 'canceled') {
              return $scope.showModal('fa-warning',
              'Equipo con un registro previo',
              '<p>El equipo con IMEI: <b>\''+ $scope.stock.IMEI +
              '\'</b> ya cuenta con el reporte de garantía <b>\'' +
              g.guideNumber + '\'</b>. No se requiere volver a registrar el formato.</p>',
              {hideCancel: true},
              function() {
                $scope.goTo();
              });
            }
          });
        }
      }// End validateStock
      // Variables del $scope
      $scope.brands = {};
      $scope.busy = true;
      $scope.clients = [];
      $scope.colors = {};
      $scope.guarantee = {
        accessories: [],
        failures: []
      };
      $scope.input = {
        IMEI: '',
        toggleSave: false};
      // Objeto de inputs
      $scope.inputs = {
        history: 'No se ha ingresado a garantías anteriormente'};
      $scope.product = {};
      $scope.productTypes = {};
      $scope.stock = {};
      // Objeto de las variantes.
      $scope.variant = {
        name: 'Variante',
        id: undefined,
        options: []};
      $scope.sellers = [];
      // Funciones del $scope
      /**
       * @name addAccessory
       * @description Agrega o activa en la matríz de accesorios el accesorio
       * seleccionado.
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
       * @description Agrega o activa en la matríz de fallas la falla
       * seleccionada.
       * @param {object} failure Objeto con los datos de la falla.
       */
      $scope.addFailure = function(failure) {
        var find = _.find($scope.guarantee.failures, function(f) {
          return f.id === failure.id;
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
          case 'canceled': return 'Candelada';
          default: return '';
        }
      };// End guaranteeStatus
      /**
       * @name save
       * @description Valilda los datos del formulario de garantía.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        var msj = '';
        // Validación del formulario
        if ($scope.input.toggleSave && !$scope.guarantee.idProduct) {
          errorCount++;
          msj = 'El producto seleccionado no está registrado en la base de datos.';
        } else if (!$scope.guarantee.hasCost && !$scope.guarantee.accessories.length) {
          errorCount++;
          msj = 'No ha seleccionado los accesorios del equipo.';
        } else if (!$scope.guarantee.failures.length) {
          errorCount++;
          msj = 'No ha seleccionado la falla del equipo.';
        } else if ($scope.guarantee.id && $scope.guarantee.status === 'open') {
          errorCount++;
          msj = 'Debe elegir si la garantía procede.';
        }
        // Formulario con error
        if (errorCount) {
          $scope.notify(msj);
          return;
        }
        $scope.busy = true;
        if ($state.params.guaranteeId) {
          // ... si es una actualización
          updateGuarantee($state.params.guaranteeId, $scope.guarantee,
            function(err, guarantee) {
              if (err) {
                console.log(err);
                $scope.notify(err.data.error.message);
              } else if (guarantee) {
                $scope.notify('Garantía registrada satisfactoriamente. Ticket' +
                guarantee.guideNumber, 'success');
                $state.go('admin.guarantee-pre-entry.list');
              }
          });
        } else {
          // ... es un registro nuevo, primero generar el numero de orden
          createGuarantee($scope.guarantee, function(err, guarantee) {
            $scope.busy = false;
            if (err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            } else if(guarantee) {
              $scope.notify('Garantía registrada satisfactoriamente. Ticket' +
                guarantee.guideNumber, 'success');
              $state.go('admin.guarantee-pre-entry.list');
            }
          });
        }
      };// End save
      /**
       * @name searchProduct
       * @description Valida el formulario de búsqueda de productos.
       */
      $scope.searchProduct = function() {
        if ($scope.input.IMEI === '') return;
        getStockFromImei($scope.input.IMEI, function(err, stock) {
          $scope.busy = false;
          if (err) {
            $scope.showModal('fa-warning',
              'Número de serie/IMEI invalido',
              '<p>El número de serie/IMEI: <b>\''+ $scope.input.IMEI +
              '\'</b> no es valido, revise el dato proporcionado.</p>' +
              '<p>Si el equipo tiene dos IMEIs pruebe registrando el segundo.</p>',
              {hideCancel: true},
              function() {
                // Nada
              });
          } else if (stock) {
            validateStock(stock, true);
          }
        });
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
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getColors();
        $scope.busy = false;
        if ($state.params.guaranteeId) {
          $scope.busy = true;
          // ...recuperar la garantía
          getGuarantee($state.params.guaranteeId, function(err, guarantee) {
            $scope.busy = false;
            if (err) {
              console.log(err);
              $scope.notify(err.data.error.message);
              $state.go('admin.guarantee-pre-entry.list');
            } else if (guarantee) {
              processGuarantee(guarantee);
            }
          });
        }
      });// End $watch.currentUser
      // $watch.guarantee.idSeller
      $scope.$watch('guarantee.idSeller', function(idSeller) {
        if (!idSeller || !$scope.sellers.length) {
          $scope.clients = [];
          return;
        }
        $scope.guarantee.idWarehouse = null;
        var find = _.find($scope.sellers, function(s) {
          return s.id === idSeller;
        });
        if (find) {
          $scope.clients = find.clients;
          $scope.guarantee.idWarehouse = find.idWarehouse;
        }
      });// End $watch.guarantee.idSeller
      // $watch.input.toggleSave
      $scope.$watch('input.toggleSave', function(t) {
        if (t) {
          // ...activar el costo de la garantía
          $scope.guarantee.hasCost = true;
          $('select').prop('required', true);
        } else {
          // ...dejarla desactivada
          $scope.guarantee.hasCost = false;
          $('select').prop('required', false);
          $('input.search').val('').prop('disabled', false).focus();
        }
      });// End $watch.input.toggleSave
      // $watch.product.idBrand
      $scope.$watch('product.idBrand', function(brand) {
        if (!brand) {
          return $scope.models = [];
        }
        _.each($scope.brands, function(b) {
          if (b.id === brand) {
            $scope.models = b.models;
          }
        });
        findProduct();
      });// End $watch.product.idBrand
      // $watch.product.idColor
      $scope.$watch('product.idColor', function(color) {
        if (!color) return;
        findProduct();
      });// End $watch.product.idColor
      // $watch.product.idProductModel
      $scope.$watch('product.idProductModel', function(model) {
        if (!model) return;
        findProduct();
      });// End $watch.product.idProductModel
      // $watch.product.idProductType
      $scope.$watch('product.idProductType', function(productType) {
        if (!productType) {
          $scope.stock = {};
          return;
        }
        var find = _.find($scope.productTypes, function(t) {
          return t.id === productType;
        });
        if (find) {
          $scope.stock.product = {type: find};
        }
        findProduct();
      });// End $watch.product.idProductType
      // Código principal
      $('input.search').val('').prop('disabled', false).focus();
      // Dissmiss Modal
      $('#genericModal').on('hidden.bs.modal', function(e) {
        if (redirect === true) {
          $state.go('admin.' + $scope.class + '.list');
        }
        $('input.search').val('').prop('disabled', false).focus();
      });

      /**
       * @name update
       * @description Valida el formulario de actualización de garantía.
       */
      $scope.update = function() {
        $('form.needs-validation').addClass('was-validated');
        var msg = '';
        // Validación del formulario
        if (!$scope.inputs.status) {
          msg = 'Debe seleccionar el estado de la garantía de la lista';
        }
        // Formulario con error
        if (msg !== '') {
          $scope.notify(msg);
          return;
        }
        $scope.guarantee.status = $scope.inputs.status;
        //delete $scope.guarantee.accessories;
        //delete $scope.guarantee.failures;
        updateGuarantee($state.params.guaranteeId);
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
    }
  ])
/******************************************************************************/
