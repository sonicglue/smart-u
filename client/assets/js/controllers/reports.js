angular.module('systemax')
  /**
  * @type controller
  * @name GuaranteeBlank
  * @enum {(type | Array)} Lista de dependencias y servicios
  * @description Este controlador sirve para cambiar el encabezado a la página de la sección de garantías
  */
  .controller('ReportBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      // TODO:
    }
  ])
  /**
   * @description Controlador del reporte de rutas.
   */
  .controller('ReportRoutes', [
    '$rootScope',
    '$scope',
    '$http',
    '$window',
    '$timeout',
    'SysUser',
    function($rootScope, $scope, $http, $window, $timeout, SysUser) {
      // Variables generales
      var userFilter = {
        where: {
          and: [
            {type: 'seller'},
            {accountStatus: {
              neq: 'all'}}]},
        order: ['date DESC']};
      // Funciones generales
      /**
       * @name getSellers
       * @description Función para obtener todos los usuarios tipo vendededores.
       */
      function getSellers() {
        SysUser.find({filter: userFilter})
          .$promise
          .then(
            function(users) {
              _.each(users, function(item){
                let newSeller = {
                  id: item.id,
                  name: item.name + ' ' + item.lastName,
                  check: false,
                  nameWarehouse: item.warehouse.name,
                  typeWarehouse: item.warehouse.type}
                $scope.sellers.push(newSeller);
              });
              $scope.sellers = _.sortBy($scope.sellers, 'name');
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getSellers
      // Variables del $scope
      $scope.busy = false;
      $rootScope.header = 'Reporte de series masivas';
      $rootScope.menu = 'routes';
      $scope.IsAllChecked = false; // Objeto que indica si todos los checkbox están seleccionados
      $scope.selectedSellers = [];
      $scope.sellers = []; // Array para almacenar todos los vendedores
      // Funciones del $scope
      /**
       * @name generateReport
       * @description Función para generar el reporte de rutas
       * @param {object} entity Objeto del ejecutivo
       */
      $scope.generateReport = function () {
        var errorMessage = null;
        //...Recorrer la lista de ejecutivos y agregarlo a otro array
        _.each($scope.sellers, function(item) {
          if (item.check === true) {
            $scope.selectedSellers.push(item.id);
          }
        });

        if ($scope.selectedSellers.length === 0) {
          errorMessage = 'Por favor selecciona los vendedores para generar el reporte.'
        }
        if (errorMessage) {
          $scope.notify(errorMessage, 'error')
          return;
        }
        var data = {sellers: $scope.selectedSellers};
        $scope.busy = true;
        var http = {
          url: '/routes-report',
          method: 'POST',
          data: data};
        return $http(http).then(
          function(response) {
            if (response.data.code >= 400) {
              // ...ocurrio un error
              $scope.notify(response.data.msg, 'error');
              $scope.busy = false;
            } else {
              // ...se genero el reporte
              $scope.showModal('fa-info',
                'El reporte se generó correctamente',
                'Haga clic en Aceptar para descargar el archivo.',
                {hideCancel: true},
              function() {
                var host = $window.location.host;
                var landingUrl = '/download/reporte-de-rutas';
                $window.location.href = landingUrl;
                $timeout(function() {
                  location.reload();
                }, 3000);
              });
            }
          });
      };//End generateReport
      /**
       * @name selectAllSeller
       * @description Función para seleccionar todos los vendedores
       */
      $scope.selectAllSeller = function () {
        if (!$scope.IsAllChecked) { $scope.IsAllChecked = true; }
        else { $scope.IsAllChecked = false; }
        _.each($scope.sellers, function(item) {
          item.check = $scope.IsAllChecked;
        });
      };// End selectAllSeller
      /**
       * @name selectEntitySeller
       * @description Función para seleccionar un vendedor
       * @param {object} entity Objeto del ejecutivo
       */
      $scope.selectEntitySeller = function (entity) {
        _.each($scope.sellers, function(item) {
          if (!item.check) {
            $scope.IsAllChecked = false;
            return;
          }
          item.check = true;
        });
      };// End selectEntitySeller
      // Watchers
      // Código principal
      // Se esta llamando la funcion para obtener los vendedores
      getSellers();
    }
  ])
  /**
   * @description Controlador del reporte de series masivas.
   */
  .controller('ReportSeries', [
    '$rootScope',
    '$scope',
    '$http',
    '$window',
    '$timeout',
    function($rootScope, $scope, $http, $window, $timeout) {
      // Variables generales
      // Funciones generales
      // Variables del $scope
      $scope.busy = false;
      $scope.input = {};
      $rootScope.header = 'Reporte de rutas';
      $rootScope.menu = 'series';
      // Funciones del $scope
      /**
       * @name searchImei
       * @description Función para generar el reporte de rutas
       */
      $scope.searchImei = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        // Validación del formulario
        if (!$scope.input.serie) {
          errorCount++;
        }
        // Formulario con error
        if (errorCount) {
          return $scope.notify('Para continuar debe ingresar el IMEI.');
        }
        // De texto a array
        if ($scope.input.serie) {
          var array = $scope.input.serie.replace(/[ ,\n]+/g,',').split(',');
        }
        var data = {imeis: array};
        $scope.input.serie = null;
        $('#series').val('').focus();
        $scope.busy = true;
        // return console.log(data);
        var http = {
          url: '/series-report',
          method: 'POST',
          data: data};
        return $http(http).then(
          function (response) {
            if (response.data.code >= 400) {
              // ...ocurrio un error
              $scope.notify(response.data.msg, 'error');
              $scope.busy = false;
            } else {
              // ...se genero el reporte
              $scope.showModal('fa-info',
                'El reporte se generó correctamente',
                'Haga clic en Aceptar para descargar el archivo.',
                {hideCancel: true},
              function() {
                var host = $window.location.host;
                var landingUrl = '/download/reporte-de-series';
                $window.location.href = landingUrl;
                $timeout(function() {
                  location.reload();
                }, 3000);
              });
            }
          });
      };// End searchImei
      // Watchers
      // Código principal
    }
  ])
  /**
   * @description Controlador del reporte de ventas.
   */
  .controller('ReportSales', [
    '$rootScope',
    '$scope',
    '$http',
    '$window',
    '$timeout',
    'Brand',
    'SysUser',
    function($rootScope, $scope, $http, $window, $timeout, Brand, SysUser) {
      // Variables generales
      // Funciones generales
      /**
       * @name getBrands
       * @description Recupera los datos de las marcas y sus modelos.
       */
      function getBrands() {
        var brandFilter = {
          include: 'models',
          order: ['name']};
        Brand.find({filter: brandFilter})
          .$promise
          .then(
            function(brands) {
              $scope.allBrands = brands;
              // $scope.search.idBrand = $scope.allBrands.id;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getBrands
      /**
       * @name getSellers
       * @description Recupera los datos de los vendedores y sus clientes.
       */
      function getSellers() {
        var sellersFilters = {
          include: 'clients',
          where: {
            type: 'seller'}};
        SysUser.find({filter: sellersFilters})
          .$promise
          .then(
            function(sellers) {
              $scope.allSellers = sellers;
              // $scope.search.idSeller = $scope.allSellers.id;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getSellers
      /**
       * @name setDate
       * @param {object} start Objeto de fecha de inicio.
       * @param {object} end Objeto de fecha de termino.
       */
      function setDate(start, end) {
        $scope.search.date = start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD');
      }// End setDate
      // Variables del $scope
      $rootScope.header = 'Reporte de ventas';
      $rootScope.menu = 'sales';
      $scope.allBrands = [];
      $scope.allClients = [];
      $scope.allModels = [];
      $scope.allSellers = [];
      $scope.search = {};
      // Funciones del $scope
      /**
       * @name searchSale
       * @description Función para generar el reporte de rutas
       */
      $scope.searchSales = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        var msj = '';
        // Validación del formulario
        if (!$scope.search.date ) {
          errorCount++;
          msj = 'Para continuar seleccione la fecha.';
        }
        if (errorCount) {
          return $scope.notify(msj);
        }
        var data = $scope.search;
        $('#series').val('').focus();
        $scope.busy = true;
        var http = {
          url: '/sales-report',
          method: 'POST',
          data: data};
        return $http(http).then(
          function (response) {
            if (response.data.code >= 400) {
              // ...ocurrio un error
              $scope.notify(response.data.msg, 'error');
              $scope.busy = false;
            } else {
              // ...se genero el reporte
              $scope.showModal('fa-info',
                'El reporte se generó correctamente',
                'Haga clic en Aceptar para descargar el archivo.',
                {hideCancel: true},
              function() {
                var host = $window.location.host;
                var landingUrl = '/download/reporte-de-ventas';
                $window.location.href = landingUrl;
                $timeout(function() {
                  location.reload();
                }, 3000);
              });
            }
          });
      };// End searchSales
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getSellers();
        getBrands();
      });// End $watch.currentUser
      // $watch.search.idSeller
      $scope.$watch('search.idSeller', function(seller) {
        $scope.allClients = [];
        if (seller) {
          var find = _.find($scope.allSellers, function(s) {
            return s.id === seller
          });
          if (find) {
            $scope.allClients = find.clients;
          }
        }
      });// End $watch.search.idSeller
      //
      $scope.$watch('search.idBrand', function(brand) {
        $scope.allModels = [];
        if (brand) {
          var find = _.find($scope.allBrands, function(b) {
            return b.id === brand;
          });
          if (find) {
            $scope.allModels = find.models;
          }
        }
      });
      // Código principal
      $(function() {
        $('input[name="daterange"]').daterangepicker({
          opens: 'left'
        }, function(start, end, label) {
          setDate(start, end);
        });
      });
    }
  ])
  /**
   * @description Controlador del reporte de garantías.
   */
  .controller('ReportGuarantees', [
    '$rootScope',
    '$scope',
    '$http',
    '$window',
    '$timeout',
    'Billing',
    'SysUser',
    function($rootScope, $scope, $http, $window, $timeout, Billing, SysUser) {
      // Funciones generales
      /**
       * @name getProviders
       * @description Recupera los datos de los proveedores.
       */
      function getProviders() {
        var providerFilter = {
          where: {class: 'provider'}};
        Billing.find({filter: providerFilter})
          .$promise
          .then(
            function(providers) {
              $scope.allProviders = providers;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.message.error);
            });
      }// End getProviders
      /**
       * @name getSellers
       * @description Recupera los datos de los vendedores y sus clientes.
       */
      function getSellers() {
        var sellersFilters = {
          include: 'clients',
          where: {
            type: 'seller'}};
        SysUser.find({filter: sellersFilters})
          .$promise
          .then(
            function(sellers) {
              $scope.allSellers = sellers;
              // $scope.search.idSeller = $scope.allSellers.id;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getSellers
      /**
       * @name setDate
       * @param {object} start Objeto de fecha de inicio.
       * @param {object} end Objeto de fecha de termino.
       */
      function setDate(start, end) {
        console.log('call setDate', start, end);
        $scope.search.date = start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD');
      }// End setDate
      // Variables del $scope
      $rootScope.header = 'Reporte de garantías';
      $rootScope.menu = 'guarantees';
      $scope.allProviders = [];
      $scope.allClients = [];
      $scope.allSellers = [];
      $scope.search = {};
      $scope.events = [
        {id: 'canceled', label: 'Cancelada'},
        {id: 'check-in', label: 'Recepción de la garntía'},
        {id: 'entry', label: 'Ingreso de la garantía'},
        {id: 'departure', label: 'Salida con el proveedor'},
        {id: 're-entry', label: 'Reingreso de garantía '},
        {id: 're-assignment', label: 'Reasignación de la garantía'},
        {id: 'return', label: 'Devolucion'}];
      // Funciones del $scope
      /**
       * @name searchSale
       * @description Función para generar el reporte de rutas
       */
      $scope.searchGuarantees = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        var msj = '';
        // Validación del formulario
        if (!$scope.search.date ) {
          errorCount++;
          msj = 'Para continuar seleccione la fecha.';
        }
        if (errorCount) {
          return $scope.notify(msj);
        }
        var data = $scope.search;
        $scope.busy = true;
        var http = {
          url: '/guarantee-report',
          method: 'POST',
          data: data};
        return $http(http).then(
          function (response) {
            if (response.data.code >= 400) {
              // ...ocurrio un error
              $scope.notify(response.data.msg, 'error');
              $scope.busy = false;
            } else {
              // ...se genero el reporte
              $scope.showModal('fa-info',
                'El reporte se generó correctamente',
                'Haga clic en Aceptar para descargar el archivo.',
                {hideCancel: true},
              function() {
                var host = $window.location.host;
                var landingUrl = '/download/reporte-de-garantias';
                $window.location.href = landingUrl;
                $timeout(function() {
                  location.reload();
                }, 3000);
              });
            }
          });
      };// End searchSales
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getSellers();
        getProviders();
      });// End $watch.currentUser
      // $watch.search.idSeller
      $scope.$watch('search.idSeller', function(seller) {
        $scope.allClients = [];
        if (seller) {
          var find = _.find($scope.allSellers, function(s) {
            return s.id === seller
          });
          if (find) {
            $scope.allClients = find.clients;
          }
        }
      });// End $watch.search.idSeller
      // Código principal
      $(function() {
        $('input[name="daterange"]').daterangepicker({
          opens: 'left'
        }, function(start, end, label) {
          setDate(start, end);
        });
      });
    }
  ]);
