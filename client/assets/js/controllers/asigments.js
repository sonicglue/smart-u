angular.module('systemax')
  /**
   *
   * Controller assigments get users and clients
   */
  .controller('Assigments', [
    '$scope',
    '$rootScope',
    'Billing',
    'SysUser',
    'SellerHasClient',
    function($scope, $rootScope, Billing, SysUser,SellerHasClient) {
      var userFilter = {
          where: {and: [
          {type: 'seller'},
          {accountStatus: { neq: 'all'}}]},
           order: ['date DESC']};
           $scope.billings = [];


           $('#checkbox-value').text($('#checkbox1').val());

           $("#checkbox1").on('change', function() {
             if ($(this).is(':checked')) {
              // $(this).attr('value', 'true');
               $scope.res=$(this).attr('value', 'true');
             } else {
               $(this).attr('value', 'false');
             }
             
             $('#checkbox-value').text($('#checkbox1').val());
          
           });


      /**
       * @name getSellers
       * @description Recupera los datos de usuarios
       */
      $scope.counterSale=[];
      $scope.sellers=[];
      function getSellers() {
        SysUser.find({filter: userFilter})
        .$promise
        .then(
      function(users) {
        //$scope.users = users;
        _.each(users, function(item){
          let newSeller = {
            id:item.id,
            name: item.name + item.lastName,
            check: false
           }
           $scope.sellers.push(newSeller);
       
        })
        console.log('mis vendedores', $scope.sellers);                 
;
    
      },
      function(err) {
               console.log(err);
               $scope.notify(err.data.error.message);
                    });
      }// End getSellers



      /**
       * @name setSellerAndClient
       * @description Recupera los datos de usuarios
       */
      function setSellerAndClient() {
        _.each($scope.sellers, function(sellers){
          $scope.counterSaleC= sellers.id
        var array ={
          idSeller:$scope.counterSaleC,
          clients:[{idClient: $scope.counterSaleClient}]
        }
        console.log('mi objeto es', array);
       SysUser.setClient({data:array})
        .$promise
        .then(
      function(users) {
        //$scope.users = users;
        _.each(users, function(item){
          let newSeller = {
            id:item.id,
            name: item.name + item.lastName,
            check: false
           }
           $scope.sellers.push(newSeller);
       
        })
        console.log('mis vendedores', $scope.sellers);                 
;
    
      },
      function(err) {
               console.log(err);
               $scope.notify(err.data.error.message);
                    });
                  });
      }// End getSellers

      $scope.selectAllSeller = {
        items: []
      }
      $scope.IsAllChecked = false; //Objeto que indica si todos los checkbox están seleccionados

      // This executes when checkbox in table header is checked
      $scope.selectAll = function () {
        console.log("selectAll", $scope.IsAllChecked);
        //$scope.selectAllClient.idClient = 'Josue'
        //console.log("selected", $scope.stocks.items);
        $scope.sellers.forEach(function(item){
            item.check = $scope.IsAllChecked;
        });
       console.log("selectAll", $scope.sellers );
       _.each( $scope.sellers, function(data){
         $scope.counterSale.push(data.id);
      })
      console.log('mis ids', $scope.counterSale);

     
    };
 
       //$scope.users = { };

          /** 
          * @name selectSeller funcion para almacenar el vendedor seleccionado
          */
         $scope.selectSeller = function (entity) {
          console.log("check seller", entity);

          $scope.seller = entity.id
          getSellersHasClient($scope.seller );
         };
        
      
      /**
       * @name getSellersHasClient
       * @description Recupera los datos de las asignaciones creadas cliente-vendedor
       * @var  _sell
       */
      function getSellersHasClient(_sell) {
              console.log('prueba',_sell)
              var shcFilter = {
                where: {idSeller:_sell},
                include: ['client', 'seller']
              };
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
      }// End getSellers

       /**
       * Funcion para guardar el usuario seleccionado
       */

      setTimeout(function () {
        $('input[value=7dfa5c00-e146-11e8-9f75-550683d03e81]').trigger('click');
      }, 2000);

      // Objetos para la vista
      $scope.clientesasig=[];
      $scope.asigment =[];
      $scope.clientes =[];
      $scope.selection =[];
      $scope.cliente = [];
      var lookup  = {};
      $scope.statusClient = {
        items:[]
      }
         // This executes when entity in table is checked
           $scope.selectEntity = function (billing) {
            $scope.billing=billing.id;
            console.log("check selected", $scope.billing);
                   if(billing.id){
              $scope.asign($scope.seller , $scope.billing)
          } 
          };
          

          // This executes when entity in table is checked
          $scope.selectSaleCounter = function (billing) {
            $scope.counterSaleClient=billing.id;
            console.log("check selected salecounter", $scope.counterSaleClient);

            setSellerAndClient();
          };
      
      /**
       * @name asign funcion para realizar la asignacion cliente-vendedor
       */
    $scope.asign = function(idseller,idclient) {
            console.log('tengo esto a crear',idseller,idclient);
      SellerHasClient.create({idSeller:idseller,idClient:idclient})
             .$promise
             .then(
      function(response) {
             if (response.error) {
                $scope.notify('Fallo la asignación', 'alert', 'danger',
                3000);
             } else {
              $scope.notify('Asignacion creada correctamente!!!',
                'info', 'success');
            }
              $scope.changeStatus ($scope.billing);
      });
    };// End asign


       /**
       * @name change cambio de etatus tabla Billing
       */
      $scope.changeStatus = function(idclient) {
          console.log('cambio de estatus', idclient);
        Billing.prototype$patchAttributes({id: idclient},{accountStatus:'assigned'})
          .$promise
          .then(function (asig) {
          $rootScope.asignation = asig;
          console.log('cambio de estatus', asig);
          getClients();
          },
        function(err){
            console.log(err);
            $scope.notify(err.data.error.message);
        });
      };// End change status

   /**
       * @name getClientss
       * @description Recupera los datos de clientes
       */
      function getClients() {
          var pFilter = {where: {class: 'client'}, order: ['name']};
        Billing.find({filter: pFilter})
          .$promise
          .then(function(billings) {
          $scope.billings=billings;
          console.log('mis clientes511',$scope.billings);
            },
        function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
        });
      }// End 
      


      /**
       * @name getClientSale
       * @description Recupera los datos de clientes
       */
      function getClientSale() {
        var pFilter = {where: { name:'Venta a Mostrador'}};
      Billing.find({filter: pFilter})
        .$promise
        .then(function(billingSale) {
        $scope.billingSale=billingSale;
        console.log('mis cliente venta es',$scope.billingSale);
          },
      function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
      });
    }// End getClients

      //Se esta llamando la funcion para obtener los clientes
      getClients();
      getSellers();
      getClientSale();
     // setSellerAndClient();
    }
  ]);
