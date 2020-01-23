angular.module('systemax')
/**
* @type controller
* @name GuaranteeBlank
* @enum   {(type | Array)} Lista de dependencias y servicios
* @description Este controlador sirve para cambiar el encabezado a la página de la sección de garantías
*/
  .controller('GuaranteeBlank', [
    '$rootScope',
    '$scope',
    '$state',
    function($rootScope, $scope, $state) {
      var tmp = $state.current.name.split('.');
      switch (tmp[1]) {
        case 'guarantee':
          $scope.header = 'Acuse de garantías';
          $scope.message = 'Acuse de la garantía';
          $scope.class = 'status-sheet';
          break;
        case 'guarantee-canceled':
          $scope.header = 'Garantías rechazadas';
          $scope.message = 'Garantías rechazadas';
          $scope.class = 'guarantee-canceled';
          break;
        case 'guarantee-pre-entry':
          $scope.header = 'Recepción de garantías';
          $scope.message = 'La recepción de la garantía';
          $scope.class = 'guarantee-pre-entry';
          break;
        case 'guarantee-entry':
          $scope.header = 'Ingreso de garantías';
          $scope.message = 'El ingreso de la garantía';
          $scope.class = 'guarantee-entry';
          break;
          case 'guarantee-departure':
          $scope.header = 'Ingreso de garantías';
          $scope.message = 'El ingreso con el proveedor';
          $scope.class = 'guarantee-departure';
          break;
        case 'guarantee-tracking':
          $scope.header = 'Seguimiento a garantías';
          $scope.message = 'proveedor';
          $scope.class = 'guarantee-tracking';
          break;
        case 'guarantee-re-entry':
          $scope.header = 're-ingreso de garantias';
          $scope.message = 'proveedor';
          $scope.class = 'guarantee-re-entry';
          break;
        case 'guarantee-re-assignment':
          $scope.header = 'Asignación de garantías';
          $scope.message = 'Reasignación de la garantía';
          $scope.class = 'guarantee-re-assignment';
          break;
        case 'guarantee-refund':
          $scope.header = 'Garantías a bonificar';
          $scope.message = 'Garantías a bonificar';
          $scope.class = 'guarantee-refund';
          break;
        case 'guarantee-refurb':
          $scope.header = 'Garantías reacondicionadas';
          $scope.message = 'Garantías reacondicionadas';
          $scope.class = 'guarantee-refurb';
          break;
        default:
          $scope.header = 'Reporte de garantías';
          $scope.message = 'cliente';
          $scope.class = 'guarantee-report';
          break;
      }
      $rootScope.menu = $scope.class;
    }
  ])
  /**
  * @type controller
  * @name GuaranteeList
  * @enum   {(type | Array)} Lista de dependencias y servicios
  * @description Este controlador sirve para listar todas las garantías registradas
  */
  .controller('GuaranteeList', [
    '$rootScope',
    '$scope',
    '$state',
    'Guarantee',
    'Stock',
    'Warehouse',
    function($rootScope, $scope, $state, Guarantee, Stock, Warehouse) {
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

      //Filtro para extraer las garantias que estan en proceso
      var guaranteeFilter = {
        include: [
          'logs',
          'warehouse',
          {relation: 'stock', scope: {
            include: 'product'
          }}
        ],
        where: {
          status: 'open'},
        order: ['created DESC']};

      /**
       * @name findGuarantee
       * @description Función para buscar un IMEI si esta en garantía
       * @param {string} serie Número de serie o IMEI para realizar la búsqueda.
       */
      function findGuarantee(serie) {
        var stockFilter = {
          include: {relation: 'guaranties', scope: {
            limit: 1,
            order: 'created DESC'}},
          where: {IMEI: serie}};
        Stock.findOne({filter: stockFilter})
          .$promise
          .then(
            function(stock) {
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
                $state.go('admin.guarantee.tracking', {guaranteeId: stock.guaranties[0].id});
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
      $scope.guarantee=[];
      $scope.guaranties =[];
      function getGuaranties() {
        if ($scope.currentUser.isMain) {
          Guarantee.find({filter: guaranteeFilter})
          .$promise
          .then(
            function(guaranties) {
              $scope.guaranties = guaranties;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
        } else {
           var warehouseFilter = {
            include: {
              relation: 'guaranties', scope: guaranteeFilter},
            where: {
              idParent: $scope.currentUser.idWarehouse}};
          Warehouse.find({filter: warehouseFilter})
            .$promise
            .then(
              function(warehouses) {
                var tmp = [];
                _.each(warehouses, function(warehouse) {
                  _.each(warehouse.guaranties, function(guarantee) {
                    tmp.push(guarantee);

                  });
                });
                _.sortBy(tmp, 'created');
                $scope.guaranties = tmp;
              },
              function(err) {
                console.log(err);
                $scope.notify(err.data.error.message);
              });
        }
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
       * @name searchGuarantee
       * @description
       */
      $scope.searchGuarantee = function() {
        findGuarantee($scope.formFilters.input);
      }// End searchGuarantee
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
       * @name validateDate
       * @description
       */
      $scope.validateDate = function(date, status) {
        console.log('ENTRO CON:',date, status);
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
  .controller('GuaranteeForm', [
    '$scope',
    '$state',
    'Brand',
    'Color',
    'Guarantee',
    'Product',
    'ProductType',
    'Stock',
    'SysUser',
    'Warehouse',
    function($scope, $state, Brand, Color, Guarantee, Product, ProductType, Stock, SysUser, Warehouse) {
      // Variables generales
      var redirect = true;
      // Funciones generales
      /**
       * @name getWarehouse
       * @description Recupera los datos del almacén de origen.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getWarehouse() {
        var warehouseFilter = {
          where: {type: 'seller'}};
        Warehouse.find({filter: warehouseFilter})
          .$promise
          .then(
            function(warehouse) {
              $scope.warehouse = warehouse;
              console.log('mis almacenes son', $scope.warehouse);
                     },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getOriginWarehouse
      /**
       * @name createGuarantee
       * @description Agrega un registro de Guarantee.
       */
      function createGuarantee(guarantee, cb) {
        console.log('lo que envio',guarantee);
        guarantee.status = 'check-in';
        Guarantee.create(guarantee)
          .$promise
          .then(
            function(guarantee) {
              console.log('el id del stock',guarantee.idStock);
              updateStock(guarantee.idStock);

              cb(null, guarantee);
            },
            function(err) {
              cb(err);
            });
      }// End createGuarantee


      /**
      * @name updateStock
      * @description Actualiza un registro de Guarantee.
      * @param {string}  idstock Idenfificador de la garantía.
      */
    function updateStock(idstock) {
      console.log('entro a updateStock', idstock);
       var newWarehouse = $scope.guarantee.idWarehouse;
       console.log(' updateStock ---> warehouse', newWarehouse );
       // $scope.guarantee.status = 'check-in';
      Stock.prototype$patchAttributes({id: idstock},{idWarehouse:newWarehouse} )
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
              include: ['accessories',
                {relation: 'color', scope: {
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
              console.log('bfygsdfygysgfysdgfysdfysdfytsd', response);
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
        console.log('busco vendedores');
        var sellerFilter = {
          include:'clients',
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
        //console.log('lo que tengo en guarantee', guarantee);
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
            console.log('mis datos', $scope.guarantee);
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
        getWarehouse();
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
        //$scope.guarantee.idWarehouse = null;
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

 /**
   * @controller
   */
  .controller('GuaranteeSendProvider', [
    '$scope',
    '$state',
    'Guarantee',
    'Stock',
    function($scope, $state, Guarantee, Stock) {
      // Funciones generales

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
       * @name validateDate
       * @description Valida la fecha para indicar si está dentro del rango.
       * @param {date} date Fecha de comparación.
       * @param {string} status Estado de la garantía.
       */
      $scope.validateDate = function(date, status) {
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
          /**
       * @name searchGuarantee
       * @description
       */
      $scope.searchGuarantee1 = function() {
        findGuarantee1($scope.formFilters.input);
      }// End searchGuarantee

       /**
       * @name findGuarantee
       * @description Busqueda de garantía a través del IMEI
       * @param {string} serie Número de serie o IMEI para realizar la búsqueda.
       */
      function findGuarantee1(serie) {
        var stockFilter = {
          include: {relation: 'guaranties', scope: {
            limit: 1,
            order: 'created DESC'}},
          where: {IMEI: serie}};
        Stock.findOne({filter: stockFilter})
          .$promise
          .then(
            function(stock) {
              if (!stock.guaranties.length) {
                $scope.showModal('fa-warning',
                  'El equipo no está en garantía',
                  '<p>El equipo con IMEI: <b>\''+ serie +
                  '\'</b> no ha sido registrado en garantías.</p>',
                  {hideCancel: true},
                  function() {
                    $scope.formFilters.input = '';
                  });
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

      $scope.$watch('formFilters.date', function(date) {
        if (!date) return;
        var tmp = date.split('/');
        if (tmp.length === 3) {
          getDataChart(tmp[2] + '-' + tmp[1] + '-' + tmp[0]);
        }
      });// End watch formFilters.date
      /**
       * @name findGuarantee
       * @description funcion para rescatar los datos de las garntias en check-in
       *
       */
      function findGuarantee() {
        var guaranteeFilter = {
          where: {status: 'entry'},
            include: [
              {relation: 'failures', scope: {
                include: 'failure'
              }},
              {relation: 'accessories', scope: {
                include: 'accessory'
              }},
              {relation: 'logs', scope: {
                order: 'date'
              }},
              {relation: 'stock', scope: {
                include: [
                  'client',
                  'user',
                  {relation: 'product', scope: {
                    include: ['color',
                      {relation: 'model', scope: {
                        include: 'brand'}}]}}]}}]};
        Guarantee.find({filter: guaranteeFilter})
          .$promise
          .then(
            function(guarantee) {
            $scope.guarantee= guarantee;
            console.log('mi garantia a enviar es', guarantee);

            },
            function(err) {
              console.log(err);

            });
      }// End findGuarantee
  /**
       * @name edit
       * @description
       * @param {object} guarantee
       */

      $scope.edit = function(guarantee) {
        console.log('mis garantias', guarantee);
        var state = 'admin.' + $scope.class + '.edit';
        console.log('mi estado es', state);
        $state.go(state , {guaranteeId: guarantee.id});

      };// End edit


      findGuarantee();
    }
  ])





  /**
   * @description Controlador para la impresión de acuses de garantías.
   */
  .controller('GuaranteeSuccess', [
    '$scope',
    '$state',
    'Guarantee',
    'Stock',
    function($scope, $state, Guarantee, Stock) {
      // Funciones generales
      /**
       * @name findGuarantee
       * @description Recupera los datos de una garantía a través de su número
       * de guía.
       * @param {string} guideNumber Número de guía.
       */
      function findGuarantee(guideNumber) {
        var guaranteeFilter = {
          where: {guideNumber: guideNumber}};
        Guarantee.findOne({filter: guaranteeFilter})
          .$promise
          .then(
            function(guarantee) {
              getGuarantee(guarantee.id);
            },
            function(err) {
              console.log(err);
              $scope.showModal('fa-warning',
                'Número de garantía invalido',
                '<p>El número de garantía: <b>\''+ $scope.input.serie +
                '\'</b> no es valido, revise el dato proporcionado.</p>',
                {hideCancel: true},
                function() {
                  // Nada
                });
            });
      }// End findGuarantee
      /**
       * @name findStock
       * @description Recupera los datos de un producto a través de su número de
       * serie/IMEI.
       * @param {string} IMEI Número de serie/IMEI.
       */
      function findStock(IMEI) {
        var stockFilter = {
          include: {
            relation: 'guaranties', scope: {
              where: {
                status: {neq: 'closed'}},
              order: 'created'}},
          where: {IMEI: IMEI}};
        Stock.findOne({filter: stockFilter})
          .$promise
          .then(
            function(stock) {
              getGuarantee(stock.guaranties[0].id);
            },
            function(err) {
              console.log(err);
              $scope.showModal('fa-warning',
                'Número de serie/IMEI invalido',
                '<p>El número de serie/IMEI: <b>\''+ $scope.input.serie +
                '\'</b> no es valido, revise el dato proporcionado.</p>',
                {hideCancel: true},
                function() {
                  // Nada
                });
            });
      }// End findStock
      /**
       * @name getGuarantee
       * @description Recuperar los datos de la garantía.
       * @param {string} guaranteeId Identificador de la garantía.
       */
      function getGuarantee(guaranteeId) {
        var guaranteeFilter = {
          include: ['client', 'seller', 'warehouse',
            {relation: 'failures', scope: {
              include: ['failure', 'product']}},
            {relation: 'accessories', scope: {
              include: 'accessory'}},
            {relation: 'logs', scope: {
              order: 'date'}},
            {relation: 'stock', scope: {
              include: 'product'}}]};
        Guarantee.findById({id: guaranteeId, filter: guaranteeFilter})
          .$promise
          .then(
            function(guarantee) {
              $scope.guarantee = guarantee;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getGuarantee
      // Variables del $scope
      $scope.guarantee = {};
      // Objeto formulario
      $scope.input = {
        type: 'imei'};
      // Funciones del $scope
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
          case 'canceled': return 'Cancelada';
          default: return '';
        }
      };// End guaranteeStatus
      /**
       * @name search
       * @description Valida el formulario de busqueda
       */
      $scope.search = function() {
        // Formulario con error
        if (!$scope.input.serie) {
          $scope.notify(
            'Debe escribir el número de serie/IMEI o de garantía buscado.');
          return;
        }
        if ($scope.input.type === 'imei') {
          findStock($scope.input.serie);
        } else {
          findGuarantee($scope.input.serie);
        }
      };// End search
      // Código principal
      if ($state.params.guaranteeId) {
        getGuarantee($state.params.guaranteeId);
      }
    }
  ])
  /******************************************************************************/

  /**
  * @type controller
  * @name GuaranteeForm
  * @enum   {(type | Array)} Lista de dependencias y servicios
  * @description Este controlador sirve para registrar una garantía
  */
 .controller('GuaranteeForm2', [
  '$scope',
  '$state',
  'Brand',
  'Color',
  'Guarantee',
  'Product',
  'ProductType',
  'Stock',
  'SysUser',
  'Warehouse',
  function($scope, $state, Brand, Color, Guarantee, Product, ProductType, Stock, SysUser, Warehouse) {
    // Variables generales
    var redirect = false;
    // Funciones generales
    /**
     * @name createGuarantee
     * @description Agrega un registro de Guarantee.
     * @param {object} guarantee Objeto con los datos de la garantía.
     */
    function createGuarantee(guarantee) {
      guarantee.status = 'check-in';
      Guarantee.create(guarantee)
        .$promise
        .then(
          function(guarantee) {
            if (guarantee.idStock) {
              updateStock(guarantee.idStock, guarantee.guideNumber);
            } else {
              changeView(guarantee.guideNumber);
            }
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    }// End createGuarantee
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
    }// End findProduct
    /**
     * @name changeView
     * @description Regresa a la vista del listado de garantías.
     * @param {string} guideNumber Número de orden de la garantía.
     */
    function changeView(guideNumber) {
      $scope.notify('Garantía registrada satisfactoriamente. Ticket' +
        guideNumber, 'success');
      $state.go('admin.guarantee-pre-entry.list');
    }// End changeView
    /**
     * @name getBrands
     * @description Recupera las marcas con sus respectivos modelos.
     */
    function getBrands() {
      var bFilter = {
        include: {
          relation: 'models', scope: {
            order: ['name']}},
        order: ['name']};
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
            include: 'failure'}},
          {relation: 'accessories', scope: {
            include: 'accessory'}},
          {relation: 'logs', scope: {
            order: 'date DESC'}},
          {relation: 'stock', scope: {
            include: [
              'warehouse',
              'client',
              'user',
              {relation: 'guaranties', scope: {
                order: 'created DESC'}},
              {relation: 'product', scope: {
                include: ['accessories', 'color',
                  {relation: 'model', scope: {
                    include: 'brand'}},
                  {relation: 'type', scope: {
                    include: 'failures'}}]}}]}}]};
      Guarantee.findById({id: guaranteeId, filter: guaranteeFilter})
        .$promise
        .then(
          function(guarantee) {
            cb(null, guarantee)
          },
          function(err) {
            console.log(err);
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
     * @name getSellers
     * @description Recupera los datos de los vendedores y sus clientes.
     */
    function getSellers() {
      var sellerFilter = {
        include:'clients',
        where: {type: 'seller'},
        order: ['name', 'lastName']};
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
            include: [
              'accessories',
              {relation: 'color', scope: {
                order: 'name'}},
              {relation: 'model', scope: {
                include: 'brand'}},
              {relation: 'type', scope: {
                include: 'failures'}}]}},
          {relation: 'guaranties', scope: {
            order: 'created DESC'}}],
        where: {IMEI: imei}};
      Stock.findOne({filter: stockFilter})
        .$promise
        .then(
          function(response) {
            cb(null, response);
          },
          function(err) {
            console.log(err);
            cb(err);
          });
    }// End getStockFromImei
    /**
     * @name getWarehouses
     * @description Recupera los datos de los almacén de origen.
     */
    function getWarehouses() {
      var warehouseFilter = {};
      // where: {type: 'seller'}};
      Warehouse.find({filter: warehouseFilter})
        .$promise
        .then(
          function(warehouses) {
            $scope.warehouses = warehouses;
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    }// End getWarehouses
    /**
     * @name processGuarantee
     * @description Procesa los datos obtenidos del objeto guarantee.
     * @param {object} guarantee Objeto con los datos de la garantía.
     */
    function processGuarantee(guarantee) {
      if (guarantee.stock && guarantee.stock.guaranties && guarantee.stock.guaranties.length > 1) {
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
    function updateGuarantee(guaranteeId, guarantee) {
      Guarantee.prototype$patchAttributes({id: guaranteeId}, guarantee)
        .$promise
        .then(
          function(guarantee) {
            if (guarantee.idStock) {
              updateStock(guarantee.idStock, guarantee.guideNumber);
            } else {
              changeView(guarantee.guideNumber);
            }
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    }// End updateGuarantee
    /**
     * @name updateStock
     * @description Actualiza un registro de Guarantee.
     * @param {string} idStock Idenfificador de la garantía.
     * @param {string} guideNumber Número de orden de la garantía.
     */
    function updateStock(idStock, guideNumber) {
      var updStock = {
        idWarehouse: $scope.guarantee.idWarehouse,
        status: 'in-guarantee',
        log: {
          event: 'in-guarantee',
          description: 'Ingresa al sistema con Ticket ' + guideNumber}};
      Stock.prototype$patchAttributes({id: idStock}, updStock)
        .$promise
        .then(
          function(stock) {
            changeView(guideNumber);
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    }// End updateStock
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
          if (g.status !== 'refund' && g.status !== 'canceled' && g.status !== 'refurb') {
            redirect = true;
            return $scope.showModal('fa-warning',
            'Equipo con un registro previo',
            '<p>El equipo con IMEI: <b>\'' + $scope.stock.IMEI +
            '\'</b> ya cuenta con el reporte de garantía <b>\'' +
            g.guideNumber + '\'</b>. No se requiere volver a registrar el formato.</p>',
            {hideCancel: true},
            function() {
              $state.go('admin.guarantee-pre-entry.list');
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
      failures: []};
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
     * @name goTo
     * @description Redirecciona la vista según el tipo de usuario
     */
    $scope.goTo = function() {
      $state.go($scope.return.to, $scope.return.paramsTo);
    };// End goTo
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
        case 'refurb': return 'Re acondicionado';
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
        updateGuarantee($state.params.guaranteeId, $scope.guarantee);
      } else {
        // ... es un registro nuevo, primero generar el numero de orden
        createGuarantee($scope.guarantee);
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
      getWarehouses();
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
        case 'loss': return 'Perdida';
        case 'in-guarantee': return 'En garantía';
        case 'guarantee': return 'Es garantía';
        default: return 'Desconocido';
      }
    };// End stockStatus
    // Watchers
    // $watch.busy
    $scope.$watch('busy', function(b) {
      if (b === false) {
        $('#imei').val('').prop('disabled', false).focus();
      }
    });// End $watch.busy
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
      //$scope.guarantee.idWarehouse = null;
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
    $('#genericModal').on('hidden.bs.modal', function(e) {
      if (redirect) {
        $scope.goTo();
      }
      $('input.search').val('').prop('disabled', false).focus();
    });
  }
])
/**
   * @description 
   */
  .controller('myCalendar', [
    '$scope',
    'uiCalendarConfig',
    function($scope, uiCalendarConfig) {
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();
      $scope.eventSources = [{title: 'All Day Event',start: new Date(y, m, 1)}];
      $scope.uiConfig = {
        calendar:{
          height: 450,
          editable: true,
          header: {
            left: 'month basicWeek basicDay agendaWeek agendaDay',
            center: 'title',
            right: 'today prev,next'
          },
          lang: 'es-mx',
          dayClick: $scope.alertEventOnClick,
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.alertOnResize
        }
      };
      /* alert on eventClick */
      $scope.alertEventOnClick = function(date, jsEvent, view) {
        console.log(date.title + ' was clicked');
      };
      $scope.uiConfig.calendar.locale = 'es'
    }
  ])
  .controller('GuaranteeBlank2', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      // TODO: implementar codigo
      $rootScope.header = 'Acuse de garantía';
      $rootScope.menu = 'status-sheet';
      $scope.hola = function() {
        return 'hola mundo';
      };
    }
  ])
  /**
   * @description
   */
  .controller('GuaranteeGraph', [
    '$rootScope',
    '$scope',
    '$state',
    'Guarantee',
    function($rootScope, $scope, $state, Guarantee) {
      // Variables generales
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
      // Funciones generales
      /**
       * @name getDataChart0
       * @description Recupe0ra los datos de garantías para dibujar el gráfico.
       * @param {string} date Cadena de texto con formato YYYY-MM-DD.
       */
      function getDataChart(date) {
        var newDate = moment(date);
        console.log('you callme master!!', date);
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
              if ($state.params.status === 'check-in') {
                barCharData.datasets.splice(2, 7);
              } else if ($state.params.status === 'entry') {
                barCharData.datasets.splice(3, 7);
                barCharData.datasets.splice(0, 1);
              } else if ($state.params.status === 'departure') {
                barCharData.datasets.splice(4, 7);
                barCharData.datasets.splice(0, 2);
              } else if ($state.params.status === 're-entry') {
                barCharData.datasets.splice(5, 7);
                barCharData.datasets.splice(0, 3);
              } else if ($state.params.status === 're-assignment') {
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
       * 
       * @param {*} guaranteeStatus 
       * @param {*} cb 
       */
      function getGuarantees(guaranteeStatus, cb) {
        console.log('guaranteeStatus', guaranteeStatus);
        var guaranteeFilter = {
          include: [
            'warehouse',
            {relation: 'failures', scope: {
              include: 'product'}},
            {relation: 'logs', scope: {
              where: {event: guaranteeStatus},
              order: 'date ASC'}},
            {relation: 'stock', scope: {
              include: ['product', 'client' , 'user'],
              where: {}}}],
          where: {status: guaranteeStatus},
          order: ['created DESC']};
        if ($state.params.status === 'for-refund') {
          // ... solo garantías con stock
          guaranteeFilter.where = {idStock: {neq: null}};
        }
        // Control de consulta
        Guarantee.find({filter: guaranteeFilter})
          .$promise
          .then(
            function(guarantees) {
              if ($state.params.status === 'for-refund') {
                tmp = []
                _.each(guarantees, function(g) {
                  if (g.stock.refunded === false && g.stock.idClient && !($scope.validateDate(g.stock.saleDate, 'sale'))) {
                    tmp.push(g);
                  }
                });
                cb(null, tmp);
              } else {
                cb(null, guarantees);
              }
            },
            function(err) {
              console.log(err);
              cb(err);
            });
      }// End getGuarantees
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
      /**
       * @name validateStatus
       * @description Valida el status pasado por url.
       * @param {string} status Estado de la garantía para consulta.
       */
      function validateStatus(status) {
        var flg = true;
        switch (status) {
          case 'check-in':
            $rootScope.header = 'Recepción de garantías';
            $scope.viewData = {
              filter: 'create',
              title: 'Registro'};
            break;
          case 'entry':
            $rootScope.header = 'Ingreso de garantías';
            $scope.viewData = {
              filter: 'check-in',
              title: 'Recepción'};
            break;
          case 'departure':
            $rootScope.header = 'Garantías a proveedor';
            $scope.viewData = {
              filter: 'entry',
              title: 'Ingreso'};
            break;
          case 're-entry':
            $rootScope.header = 'Re-ingreso de garantías';
            $scope.viewData = {
              filter: 'departure',
              title: 'Salida'};
            break;
          case 're-assignment':
            $rootScope.header = 'Re-asignación de garantías';
            $scope.viewData = {
              filter: 're-entry',
              title: 'Reingreso'};
            break;
          case 'for-refund':
            $rootScope.header = 'Garantías a bonificar';
            $scope.graphFlag = true;
            $scope.viewData = {
              filter: 'check-in',
              title: 'Recepción'};
            break;
          case 'canceled':
            $rootScope.header = 'Garantías rechazadas';
            $scope.graphFlag = true;
            $scope.viewData = {
              filter: 'canceled',
              title: 'Cancelación'};
            break;
          default: return false;
        }
        return flg;
      }// End validateStatus
      // Variables del $scope
      $scope.busy = true;
      $scope.buttonFlag = false;
      $scope.graphFlag = false;
      $scope.formFilters = {};
      $scope.guarantee = {};
      $scope.viewData = {};
      // Funciones del $scope
      /**
       * @name next
       * @description Cambia el estado actual de la vista de acuerdo al
       * parametro status de la url
       */
      $scope.next = function(guarantee) {
        var tmp = 'admin.guarantee';
        $scope.busy = true;
        switch ($state.params.status) {
          case 'check-in': break;
          case 're-entry': tmp += '.re-entry'; break;
          case 'for-refund': tmp += '.for-refund'; break;
        }
        $state.go(tmp, {guaranteeId: guarantee.id});
      };// End next
      /**
       * @name validateDate
       * @description Valida una fecha dada contra la fecha actual.
       * @param {date} date Objeto de fecha.
       * @param {string} status Estado de la garantía para validar el tiempo.
       */
      $scope.validateDate = function(date, status) {
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
        if ((today - lastDay) > time) {
          return true;
        } else {
          return false;
        }
      }// End validateDate
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        if (validateStatus($state.params.status)) {
          // ...status valido
          $rootScope.menu = $state.params.status;
          if ($state.params.status === 'check-in' || $state.params.status === 'entry') {
            $scope.buttonFlag = true;
          }
          getGuarantees($scope.viewData.filter, function(err, guarantees) {
            $scope.busy = false;
            if (err || !guarantees) {
              $scope.notify('No se encontraron datos de garantías.');
            } else {
              $scope.guarantees = guarantees;
            }
          });
        } else {
          // ...status invalido
          $state.go('admin');
        }
      });// End $watch.currentUser
      // $watch.formFilters.date
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
    }
  ])
  /**
   * @description 
   */
  .controller('GuaranteeForRefund', [
    '$scope',
    '$state',
    'Guarantee',
    'Order',
    'Stock',
    'SysUser',
    function($scope, $state, Guarantee, Order, Stock, SysUser) {
      // Variables generales
      var guarantee = {};
      var stock = {};
      var redirect = false;
      // Funciones generales
      /**
       * @name getGuarantee
       * @description Recupera los datos de una garantía por su ID.
       * @param {string} guaranteeId Identificador de la garantía.
       * @param {function} cb Función de callback.
       */
      function getGuarantee(guaranteeId, cb) {
        var guaranteeFilter = {
          include: [
            'client',
            'warehouse',
            {relation: 'accessories', scope: {
              include: 'accessory'}},
            {relation: 'failures', scope: {
              include: [
                'failure',
                {relation:'product',scope: {
                  include: [
                    'color',
                    {relation: 'model', scope: {
                      include: 'brand'}}]}}]}},
            {relation: 'logs', scope: {
              order: ['date DESC']}},
            {relation: 'seller', scope: {
              include: 'clients'}},
            {relation: 'stock', scope: {
              include: [
                'client',
                'user',
                'warehouse',
                {relation: 'guaranties', scope: {
                  order: 'created DESC'}}]}}]};
        Guarantee.findById({id: guaranteeId, filter: guaranteeFilter})
          .$promise
          .then(
            function(guarantee) {
              cb(null, guarantee);
            },
            function(err) {
              console.log(err.data.error.message);
              cb(err);
            });
      }// End getGuarantee
      /**
       * @name getSellers
       * @description Recupera los datos de los vendedores y sus clientes.
       */
      function getSellers() {
        var sellerFilter = {
          include: {
            relation: 'clients', scope: {
              order: ['name']}},
          where: {type: 'seller'},
          order: ['name', 'lastName']};
        SysUser.find({filter: sellerFilter})
          .$promise
          .then(
            function(sellers) {
              $scope.sellers = sellers;
              $scope.inputs.idSeller = $scope.guarantee.idSeller;
              $scope.inputs.idClient = $scope.guarantee.idClient;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getSellers
      /**
       * @name processGuarantee
       * @description Procesa los datos obtenidos del objeto guarantee.
       * @param {object} guarantee Objeto con los datos de la garantía.
       */
      function processGuarantee(guarantee) {
        if (guarantee.stock && guarantee.stock.guaranties.length > 1) {
          $scope.inputs.history = 'Equipo con ingresos a garantía previos';
        }
        $scope.product = guarantee.failures[0].product;
        validateStock(guarantee.stock, false);
        $scope.guarantee = _.pick(guarantee, 'id', 'idStock', 'idSeller',
          'idWarehouse', 'idClient', 'guideNumber', 'status', 'created',
          'updated', 'hasCost', 'cost');
        if (guarantee.logs) {
          // ...obtener la fecha de ingreso al sistema
          $scope.guarantee.logs = guarantee.logs;
          var checkin = _.find(guarantee.logs, function(g) {
            return g.event === 'check-in';
          });
          if (checkin) {
            $scope.guarantee.dateCheckIn = checkin.date;
          }
        }
        // Activar casillas de los accesorios
        var tmp = '';
        _.each(guarantee.accessories, function(a) {
          /*
          No se ocupa en este formulario
          $scope.addAccessory({id: a.idAccessory, value: true});
          var findAccesory = _.find($scope.stock.product.accessories, function(iA) {
            return a.idAccessory === iA.id;
          });
          findAccesory.value = true;
          */
          if (tmp !== '') {
            tmp += ', ';
          }
          tmp += a.accessory.name;
        });
        $scope.inputs.accessories = tmp;
        // Activar casillas de las fallas
        var tmp = '';
        _.each(guarantee.failures, function(f) {
          /*
          No se ocupa en este formulario
          $scope.addFailure({id: f.idFailure, value: true});
          var findFailure = _.find($scope.stock.product.type.failures, function(iF) {
            return f.idFailure === iF.id;
          });
          findFailure.value = true;
          */
          if (tmp !== '') {
            tmp += ', ';
          }
          tmp += f.failure.name;
        });
        $scope.inputs.failures = tmp;
      }// End processGuarante
      /**
       * @name setRefund
       * @description Registra una nota de bonificación.
       */
      function setRefund() {
        $scope.busy = true;
        var refund = {
          idClient: stock.idClient,
          idSeller: stock.idUser,
          stocks: [
            {id: $scope.stock.id}]};
        Order.refund({data: refund})
          .$promise
          .then(
            function(guarantee) {
              $scope.goTo();
            },
            function(err) {
              console.log(err);
              $scope.busy = false;
              $scope.notify(err.data.error.message);
            });
      }// End setGuarantee
      /**
       * @name updateGuarantee
       * @description Actualizar el estado de la garantía
       * @param {string} guaranteeId Identificador de la garantía.
       * @param {boolean} flg Bandera para incluir la operación de bonificación.
       */
      function updateGuarantee(guaranteeId, flg) {
        $scope.busy = true;
        Guarantee.prototype$patchAttributes({id: guaranteeId}, guarantee)
          .$promise
          .then(
            function(guarantee) {
              if (Object.keys(stock).length) {
                updateStock($scope.stock.id, flg);
              } else {
                $scope.goTo();
              }
            },
            function(err) {
              console.log(err);
              $scope.busy = false;
              $scope.notify(err.data.error.message);
            });
      }// End updateGuarantee
      /**
       * @name updateStock
       * @description Actualiza los datos del producto de acuerdo su
       * identificador.
       * @param {string} stockId Identificador del stock.
       * @param {boolean} flg Bandera para incluir la operación de bonificación.
       */
      function updateStock(stockId, flg) {
        $scope.busy = true;
        Stock.prototype$patchAttributes({id: stockId}, stock)
          .$promise
          .then(
            function(stock) {
              if (flg) {
                setRefund();
              } else {
                $scope.goTo();
              }
            },
            function(err) {
              console.log(err);
              $scope.busy = false;
              $scope.notify(err.data.error.message);
            });
      }// End updateStock
      /**
       * @name validateForRefund
       * @description Valida el formulario de para bonificar.
       */
      function validateForRefund() {
        var count = 0;
        // Vendedor
        if (!$scope.inputs.idSeller) {
          count++;
        } else {
          guarantee.idSeller = $scope.inputs.idSeller;
          stock.idUser = $scope.inputs.idSeller;
        }
        // Cliente
        if (!$scope.inputs.idClient) {
          count++;
        } else {
          guarantee.idClient = $scope.inputs.idClient;
          stock.idClient = $scope.inputs.idClient;
        }
        // Precio de venta
        if (!$scope.inputs.salesPrice) {
          count++;
        } else {
          stock.salesPrice = $scope.inputs.salesPrice;
        }
        // Marcar la casilla
        if (!$scope.inputs.forRefund) {
          count++;
        }
        // Descripcion de la operación
        if (!$scope.inputs.description) {
            count++;
        } else {
          guarantee.status = $scope.guarantee.status;
          guarantee.description = 'Garantía bonificada. ' + $scope.inputs.description;
          stock.forRefund = true;
          stock.refundPrice = stock.salesPrice;
          stock.refundNote = 'Bonificación por garantía';
        }
        return count;
      }// End validateForRefund
      /**
       * @name validateStock
       * @description Valida los datos obtenidos del objeto stock.
       * @param {object} stock Objeto con los datos del stock.
       * @param {boolean} flag Bandera para validar guarantias pendientes.
       */
      function validateStock(stock, flag) {
        if (stock != null) {
          var today = $scope.getDateFormat(new Date(), 'x')
          var saleDay = $scope.getDateFormat(stock.saleDate, 'x');
          var year = 31536000000;
          $scope.stock = stock;
          $scope.inputs.salesPrice = stock.salesPrice;
          $scope.stock.inTime = true;
          if ((today - saleDay) > year) {
            // ...producto fuera de garantía
            $scope.guarantee.hasCost = true;
            $scope.stock.inTime = false;
          }
          if (stock.user.type === 'seller') {
            // ...obtener datos del vendedor
            $scope.stock.seller = {
              name: stock.user.name + ' ' + stock.user.lastName};
          }
          if (stock.guaranties && flag) {
            // ...validar que no tenga un registro abierto
            _.each(stock.guaranties, function(g) {
              if (g.status !== 'refund' && g.status !== 'canceled' && g.status !== 'refurb') {
                redirect = true;
                return $scope.showModal('fa-warning',
                'Equipo con un registro previo',
                '<p>El equipo con IMEI: <b>\'' +  $scope.stock.IMEI +
                '\'</b> ya cuenta con el reporte de garantía <b>\'' +
                g.guideNumber + '\'</b>. No se requiere volver a registrar el formato.</p>',
                {hideCancel: true},
                function() {
                  $scope.goTo();
                });
              }
            });
          }
        }
      }// End validateStock
      // Variables del $scope
      $scope.busy = true;
      $scope.clients = [];
      $scope.guarantee = {};
      // Objeto de inputs
      $scope.inputs = {
        history: 'No se ha ingresado a garantías anteriormente'};
      $scope.product = {};
      $scope.sellers = [];
      $scope.stock = {};
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
       * @name goTo
       * @description Redirecciona la vista según el tipo de usuario
       */
      $scope.goTo = function() {
        $state.go($scope.return.to, $scope.return.paramsTo);
      };// End goTo
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
          case 'refurb': return 'Re acondicionado';
          case 'refund': return 'Devolución';
          case 'canceled': return 'Cancelada';
          default: return '';
        }
      };// End guaranteeStatus
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
          case 'loss': return 'Perdida';
          case 'in-guarantee': return 'En garantía';
          case 'guarantee': return 'Es garantía';
          default: return 'Desconocido';
        }
      };// End stockStatus
      /**
       * @name update
       * @description Valida el formulario de actualización de garantía.
       */
      $scope.update = function() {
        $('form.needs-validation').addClass('was-validated');
        var count = 0;
        var flg = false;
        var tmp = $state.current.name.split('.');
        // Validación del formulario
        switch (tmp[2]) {
          case 'for-refund':
            count = validateForRefund();
            flg = true;
            break;
          default: count++;
        }
        // Formulario con error
        if (count) {
          $scope.notify('El formulrio tiene uno o varios errores.');
          return;
        }
        updateGuarantee($scope.guarantee.id, flg);
      };// End update
      // Watchers
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getGuarantee($state.params.guaranteeId, function(err, guarantee) {
          $scope.busy = false;
          if (err || !guarantee) {
            $state.go('admin.guarantee.graph', {status: 'for-refund'});
          } else {
            processGuarantee(guarantee);
            getSellers();
          }
        });
      });// End $watch.currentUser
      // $watch.inputs.idSeller
      $scope.$watch('inputs.idSeller', function(s) {
        if (!s) return;
        $scope.clients = [];
        var find = _.find($scope.sellers, function(seller) {
          return seller.id === s;
        });
        if (find) {
          $scope.clients = find.clients;
        }
      });// End $watch.inputs.idSeller
      // Código principal
      // Dissmiss Modal
      $('#genericModal').on('hidden.bs.modal', function(e) {
        if (redirect) {
          $scope.goTo();
        }
        $('input.search').val('').prop('disabled', false).focus();
      });
    }
  ]);
  /******************************************************************************/
