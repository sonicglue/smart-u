angular.module('systemax')
  /**
   *
   * Controller assigments get users and clients
   */
  .controller('ReportList', [
    '$scope',
    '$rootScope',
    'Billing',
    'SysUser',
    '$http',
    '$state',
    '$window',
    '$timeout',
    function($scope, $rootScope, Billing, SysUser, $http, $state, $window, $timeout) {
      var userFilter = {
          where: {and: [
          {type: 'seller'},
          {accountStatus: { neq: 'all'}}]},
           order: ['date DESC']};

       $scope.sellers=[]; //Array para almacenar todos los vendedores
       $scope.IsAllChecked = false; //Objeto que indica si todos los checkbox están seleccionados
       $scope.selectedSellers=[];

       //Se esta llamando la funcion para obtener los clientes
       getSellers();


      /**
       * @name getSellers
       * @description Función para obtener todos los usuarios tipo vendededores.
       */
      function getSellers() {
        SysUser.find({filter: userFilter})
        .$promise
        .then(function(users) {
          console.log("Lista de ejecutivos", users);
        _.each(users, function(item){
          let newSeller = {
            id:item.id,
            name: item.name +' '+ item.lastName,
            check: false,
            nameWarehouse: item.warehouse.name,
            typeWarehouse: item.warehouse.type
           }
           $scope.sellers.push(newSeller);
        })
        $scope.sellers = _.sortBy($scope.sellers, 'name');
        },
        function(err) {
         console.log(err);
         $scope.notify(err.data.error.message);
        });
      }// End getSellers

      /**
       * @name selectAllSeller
       * @description Función para seleccionar todos los vendedores
       */
      $scope.selectAllSeller = function () {
        if ($scope.IsAllChecked) { $scope.IsAllChecked = true;}
        else { $scope.IsAllChecked = false; }

        _.each($scope.sellers, function(item) {
          item.check = $scope.IsAllChecked;
        })
        console.log('Todos los ejecutivos seleccionados', $scope.sellers);
      };

      /**
       * @name selectEntitySeller
       * @description Función para seleccionar un vendedor
       * @param {object} entity Objeto del ejecutivo
       */
       $scope.selectEntitySeller = function (entity) {
         console.log("Item seleccionado", entity);
         _.each($scope.sellers, function(item) {
           if (!item.check) {
               $scope.IsAllChecked = false;
               return;
           }
          item.check = true;
         })
         console.log('Ejecutivo seleccionado', $scope.sellers);
       };

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
          })

          if ($scope.selectedSellers.length === 0) {
            errorMessage = 'Por favor selecciona los vendedores para generar el reporte!!!'
          }
          if (errorMessage) {
            $scope.notify(errorMessage, 'error')
            return
          }

          var data = {
            sellers:$scope.selectedSellers
          };

          return $http({
            url: '/generate-report',
            method: 'POST',
            data: data
          }).then(function (response) {
            console.log('response:', response);
            if (response.data.code === '500') {
              $scope.notify(response.data.msg, 'error');
            }else {
              $scope.showModal('fa-info',
             'El reporte de rutas se generó correctamente',
             '<b style="font-size: 16px; font-weight: bold;">¿Quieres descargar el archivo? </b><br>',
             { hideCancel: true },
            function(){
                var host = $window.location.host;
                var landingUrl = "/download-report";
                $window.location.href = landingUrl;
                $timeout( function(){
                  location.reload();
                }, 3000 );
             });
            }
          });
        };//End generateReport


        /**
         * @name generateReportSeries
         * @description Función para generar el reporte de series
         * @param {object} entity Objeto del ejecutivo
         */
         $scope.generateReportSeries = function () {
           _.each($scope.sellers, function(item) {
             if (item.check === true) {
               $scope.selectedSellers.push(item.id);
             }
           })

           var data = {
             items: ["355000014789995", "355000012626918"]
           };

           console.log("Información del reporte de series", data);

           SysUser.setReportSeries({data: data}).$promise .then(
             function(stocks) {
               console.log('Lista de stocks:', stocks)
            },
            function(err) {
              console.log("Error al generar el reporte de series",err);
            });
         }

    }
  ]);
