angular.module('systemax')
  /**
   * @description Controller assigments get users and clients
   */
  .controller('AssigmentsSee', [
    '$scope',
    '$rootScope',
    'Billing',
    'SysUser',
    'SellerHasClient',
    function($scope, $rootScope, Billing, SysUser,SellerHasClient) {
      // Variables generales
      // Funciones generales

      $scope.cutSellerr = function(){
         console.log('gerente seleccionado', $scope.manager.id);
        getmySellers($scope.manager.id);
      }
      /**
       * @name getClients
       * @description Recupera los datos de clientes
       */
      function getClients() {
        var pFilter = {
          where: {
            class: 'client',
            accountStatus:'assigned'
          },
          order: ['name']
        };
        Billing.find({filter: pFilter})
          .$promise
          .then(
            function(billings) {
              // console.log('mis clientes',billings);
              _.each(billings, function(billing) {
                let itemBilling = {
                  id: billing.id,
                  name: billing.name,
                  status:billing.accountStatus};
                $scope.billings.push(itemBilling);
              });
            // console.log("Mi arreglo de clientes formateado", $scope.billings);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getClients
      /**
       * @name getmanager
       * @description Recupera los datos del gerente
       */
      function getManager() {
        var pFilter = {where: {type: 'manager'}};
        SysUser.find({filter: pFilter})
          .$promise
          .then(
            function(manager) {
              $scope.manager = manager;
              $scope.manager.push({
                name: "-- ELIGE UN GERENTE --"
              });
              console.log('mis gerentes', manager);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getManager
      /**
       * @name getmySellers
       * @description Recupera los datos de vendedores en base a la entrada de ID del gerente
       */
      function getmySellers(manager) {
        $scope.managerSeller = manager;
        // console.log('mi gerente',$scope.managerSeller);
        SysUser.find({filter:{where:{and:[{type:'seller', idParent:$scope.managerSeller }]}}})
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
      }// End getmyseller
      /**
       * @name getmySellerss
       * @description Recupera los datos de vendedores general
       */
      function getmySellerss(managerr) {
        $scope.managerSellerr = managerr;
         console.log('mi gerente select456',$scope.managerSellerr);
        SysUser.find({filter:{where:{and:[{type:'seller', idParent:$scope.managerSellerr }]}}})
          .$promise
          .then(
            function(mysellers) {
              $rootScope.mysellers = mysellers;
               console.log('tengoooo estooo8468464',$rootScope.mysellers)
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getmySellerss*/
      /**
       * @name getSellersHasClient
       * @description Recupera los datos de las asignaciones cliente vendedor
       * @var  _sell
       */
      function getSellersHasClient(_sell) {
        // console.log('prueba',_sell)
        if (!_sell) {
          return;
        } else {
          var shcFilter = {
            where: {idSeller:_sell},
            include: ['client', 'seller']};
          SellerHasClient.find({filter: shcFilter})
            .$promise
            .then(
              function(assignment) {
                $scope.assignment =assignment;
                console.log('sellerhasclient',$scope.assignment);
              },
              function(err) {
                console.log(err);
                $scope.notify(err.data.error.message);
            });
        }
      }// End getSellershasclient
      /**
       * @name getSellersHasClient
       * @description Recupera los datos de las asignaciones cliente
       *  vendedor en base al ID del vendedor
       * @var  _sell
       */
      function getSellersHasClientt() {
        var shcFilter = {
          where: {idSeller: $scope.seller},
          include: ['client', 'seller']};
        SellerHasClient.find({filter: shcFilter})
          .$promise
          .then(
            function(assignment) {
              $scope.assignment = assignment;
              // console.log('sellerhasclientt',$scope.assignment);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getSellershasclient
      /**
       * @name setSeller
       * @description funcion para quitar la asignacion
       */
      function setSeller(idParent, idSeller) {
        // console.log('current', idParent,idSeller)
        SysUser.prototype$patchAttributes({id: idSeller},{idParent: idParent})
         .$promise
         .then(
            function(response) {
              if (response.error) {
                 $scope.notify('Fallo la asignación', 'alert', 'danger',
                 3000);
              } else {
                $scope.notify('Asignacion eliminada correctamente!!!',
                'info', 'success');
                }
                getmySellerss($scope.managerSeller)
            },
            function(err){
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      };// End asign
      // Variables del $scope
      $scope.billings = [];
      $scope.users = {};
      // Objetos para la vista
      $scope.clientesasig= [];
      $scope.asigment = [];
      $scope.clientes = [];
      $scope.selection = [];
      $scope.cliente = [];
      var lookup  = {};
      // Funciones del $scope
      /**
       * @name change
       * @description cambia el status de los clientes para activarlos
       */
      $scope.changeStatus2 = function(idclient) {
        $scope.cliente= idclient.idClient
        console.log('cambio de estatus', $scope.cliente);
        Billing.prototype$patchAttributes({id: $scope.cliente}, {accountStatus:'active'})
          .$promise
          .then(
            function(asig) {
              $rootScope.asignation = asig;
              console.log('estatus cambiado', asig);
              $scope.deleteAssignment(idclient);
            },
            function(err){
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      };// End changeStatus2
      // Objetos para almacenar el cliente para eliminar la asignacion
      $scope.check = function(billing){
        $scope.billing = billing;
        // console.log('cliente a des asignar',$scope.billing);
        $scope.changeStatus2($scope.billing);
      }
      /**
       * @name This executes when entity in table is checked
       */
      $scope.selectSeller = function (entity) {
        $scope.seller = entity.id
        // console.log("check seller", $scope.seller);
        getSellersHasClient($scope.seller);
      };
      /* objeto que guarda el gerente seleccionado */
      //$scope.user.id =[];

      /**
       * @name deleteAssignment eliminar asignacion
       */
      $scope.deleteAssignment = function(idassigned) {
        $scope.id = idassigned.id;
        // console.log('delete assignment', idassigned);
        SellerHasClient.deleteById({id:$scope.id})
          .$promise
          .then(
            function(response) {
              if (response.error) {
                $scope.notify('Fallo la eliminacion', 'alert', 'danger',
                3000);
              } else {
                $scope.notify('Se elimino la asignacion correctamente!!!',
                'info', 'success');
              }
              getSellersHasClientt();
            },
            function(err){
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      };// End change status
      /**
       * @name selectedSell almacena el ID del vendedor a des-asignar
       */
      $scope.selectSell = function (seller) {
        $scope.seller = seller.id
        // console.log("mi vendedor a des asignar",$scope.seller);
        if (seller.idParent) {
          setSeller(null, seller.id)
        }
      };
      // Watchers
      // Código principal
      // Se esta llamando la funcion para obtener los clientes
      getManager();
      getClients();
    }
  ])
