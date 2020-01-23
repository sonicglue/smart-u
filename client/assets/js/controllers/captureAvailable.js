angular.module('systemax')

  .controller('scanByAvailableBlankController', [
    '$rootScope',
    '$scope',
    'Warehouse', function($rootScope, $scope, Warehouse) {
      $rootScope.menu = 'scanByAvailable';
    }
  ])

  /**
   * @description Controlador para escanear un equipo por disponible
   */
   .controller('scanByAvailableController', [
     '$scope',
     '$state',
     'SysUser',
     'Stock',
     '$stateParams',
     'SellerHasClient',
     function($scope, $state,  SysUser, Stock, $stateParams, SellerHasClient, AuthService) {
       // Variables del $scope
       $scope.userAdmin = {};
       $scope.input = {};
       $('#imei').focus(); //Focus input IMEI

       /**
        * @name login
        * @description Función para indicar sesión en el sistema.
        * @param {string} email Nombre de usuario para inicio de sesión.
        * @param {string} password Contraseña para inicio de sesión.
        * @param {cb} callback Objeto de la respuesta
        */
       function loginWithEmail(email, password, cb) {
          SysUser.loginCustomize({email: email, password: password})
           .$promise
           .then(
             function(success) {
               cb(null, success);
             },
             function(err) {
               cb(err);
             });
       }// End login

       /**
        * @name login
        * @description Función para iniciar sesión en el sistema.
        */
       $scope.login = function() {
         $('form.needs-validation').addClass('was-validated');
         var errorCount = 0;
         // Validación del formulario
         if (!$scope.input.serie) {
           errorCount++;
         }
         if (!$scope.userAdmin.email) {
           errorCount++;
         }
         if (!$scope.userAdmin.password) {
           errorCount++;
         }
         // Formulario con error
         if (errorCount) {
           $.notify(
             'El formulario contiene uno o más errores, para continuar debe corregirlos.',
             {
               hideDuration: 1000,
               showDuration: 200,
               position: 'right bottom'});
           return;
         }

         loginWithEmail($scope.userAdmin.email, $scope.userAdmin.password, function(err, accessToken) {
           if (err) {
             //console.log("Respuesta de error", err);
             $.notify(err.data.error.message, {
               hideDuration: 1000,
               showDuration: 200,
               position: 'right bottom'});
             $('form.needs-validation').removeClass('was-validated');
             $('#password').val('').focus();
             $scope.user.password = null;
           } else {
             //console.log("Respuesta de la consulta",accessToken);
             if (accessToken.type === "warehouse-boss") {
               var splitIMEIs = $scope.input.serie.replace(/[ ,\n]+/g,',').split(',');
               var errorMessage = "";

               _.each(splitIMEIs, function(_imei) {
                 var result = findStock(_imei);
                 if (result) {
                   if (errorMessage.length) {
                     errorMessage += "<br/>";
                   }
                   errorMessage += result;
                 }
               });
               if (errorMessage) {
                  $scope.notify('Hubo un error al actualizar los equipos, intente más tarde.', 'error');
               }
             } else {
               $scope.notify('El usuario no tiene los permisos para realizar dicha accción!!!', 'error');
             }
           }
         });
       };// End login

       /**
        * @name findStock
        * @description Función para buscar un imei.
        * @param {string} imei Serie del equipo
        */
       function findStock(imei){
         //console.log("IMEI para actualizarlo", imei);
         var filter = {
               where: {
                 and:[{IMEI: imei}]}};

        Stock.findOne({filter: filter}).$promise
         .then(
           function(stock) {
            //console.log("Respuesta de la consulta del IMEI", stock);
            if (stock.status !== 'assigned') {
              updateStock(stock.id, stock.IMEI);
            }else {
              $scope.input.serie = '';
              $('#imei').val('').prop('disabled', false).focus();
              $scope.notify(`El equipo ${stock.IMEI} ya estaba asignado al ejecutivo.`, 'error');
            }
           },
           function(err) {
             $scope.input.serie = '';
             $('#imei').val('').prop('disabled', false).focus();
             $scope.notify(`El equipo ${imei} no se encontró en el sistema.`, 'error');
           });
       }

       /**
        * @name updateStock
        * @description Función para actualizar un imei en estado activo.
        * @param {string} imei Serie del equipo
        */
       function updateStock(stockId, imei){
         //console.log("IMEI a actualizar", stockId);
         Stock.prototype$patchAttributes({id: stockId},{salesPrice: null, status: "assigned", confirmSale: false, idClient: null, saleDate: null, validate: false, args:{ data: { description: "Equipo nuevamente reasignado al ejecutivo", status:'assigned' }}}).$promise
          .then(
            function(response) {
              console.log("Respuesta de la actualización", response);
              $('#imei').val('').prop('disabled', false).focus();
              $scope.notify(`El equipo ${imei} se actualizo correctamente.`, 'success');
             },
             function(err) {
               $scope.notify(`El equipo ${imei} no se pudo actualizar.`, 'error');
               $scope.input.serie = '';
             });
       }
 }])
