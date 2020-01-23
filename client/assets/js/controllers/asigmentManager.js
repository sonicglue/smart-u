angular.module('systemax')
  /**
   * @description Controller assigments get users and clients
   */
  .controller('checkManager', [
    '$rootScope',
    '$scope',
    'SysUser',
    'Billing',
    function($rootScope, $scope, SysUser) {
      /**
       * @name getClients
       * @description Recupera los datos de proveedores/empresas/clientes
       */
      function getManager() {
        var pFilter = {where: {type: 'manager'}};
        SysUser.find({filter: pFilter})
          .$promise
          .then(
            function(manager) {
              $scope.manager = manager;
              console.log('mis clientes',manager);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getManager
      /**
       * @name getSellers
       * @description Recupera los datos de los vendedores general
       */
      function getSellers() {
        SysUser.find({filter: {where: {type: 'seller'}}})
          .$promise
          .then(
        function(sellers) {
              $scope.sellers = sellers;
              console.log($scope.sellers);
        },
        function(err) {
                  console.log(err);
                  $scope.notify(err.data.error.message);
        });
      }// End getSellers

       /**
       * @name getSellers
       * @description Recupera los datos de los vendedores para buscar por un ID en especifico
       */
        function getmySellers(manager) {
             $scope.managerSeller=manager;
             console.log('mi gerente',$scope.managerSeller);
             SysUser.find({filter:{where:{and:[{type:'seller', idParent:$scope.manager }]}}})
            .$promise
            .then(
          function(mysellers) {
            $rootScope.mysellers = mysellers;
            console.log('tengoooo estooo',$rootScope.mysellers)
          },
          function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
          });
        }// End getUser*/

         /**
         * @name setSeller funcion para asignar el vendedor al gerente
         */
      function setSeller(idParent, idSeller) {
               console.log('current', idParent,idSeller)
            SysUser.prototype$patchAttributes({id: idSeller},{idParent:idParent})
                   .$promise
                   .then(     function(response) {
                   if (response.error) {
                      $scope.notify('Fallo la asignación', 'alert', 'danger',
                      3000);
                  } else {
                      $scope.notify('Asignacion creada correctamente!!!',
                     'info', 'success');
                    }
                        _.find($scope.asigmentClient.items, function(client){
                              $scope.cliente = client.idClient

                        })
                        getmySellers();
                    },
            function(err){
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      };// End asign

      //Objeto donde se almacena el gerente seleccionado
        $scope.checking = function(manager){
               $scope.manager = manager.id;
               getmySellers($scope.manager);
               console.log('manager',$scope.manager);
        }

        /**
         * @name check funcion para validar la seleccion de gerente y vendedor
         */
        $scope.check = function(seller) {
          console.log('aqui estoy', seller);
          if(seller.idParent){
                setSeller($scope.manager, seller.id)



          } else{
                setSeller(null,seller.id)

            }

        }

        //Se esta llamando la funcion para obtener los clientes
        getSellers();
        getmySellers();
        getManager();
    }
  ])
