angular.module('systemax')
  .controller('BillingBlank', [
    '$rootScope',
    '$scope',
    '$state',
    function($rootScope, $scope, $state) {
      var tmp = $state.current.name.split('.');
      switch (tmp[1]) {
        case 'company':
          $scope.header = 'Empresas';
          $scope.singular = 'empresa';
          $scope.class = 'company';
          break;
        case 'provider':
          $scope.header = 'Proveedores';
          $scope.singular = 'proveedor';
          $scope.class = 'provider';
          break;
        default:
          $scope.header = 'Clientes';
          $scope.singular = 'cliente';
          $scope.class = 'client';
          break;
      }
      $rootScope.menu = $scope.class;
      // Validar almacén central
      if ($scope.class !== 'client' && !$scope.currentUser.isMain) {
        $state.go('admin');
      }
    }
  ])
  /**
   * @description Controlador para listar los proveedores/empresas/clientes.
   */
  .controller('BillingsList', [
    '$scope',
    '$state',
    'Billing',
    function($scope, $state, Billing) {
      // Funciones generales
      /**
       * @name deleteBilling
       * @description Elimina un proveedor/empresa/cliente por su Id.
       * @param {string} billingId Identificador del proveedor/empresa/cliente.
       */
      function deleteBilling(billingId) {
        Billing.deleteById({id: billingId})
          .$promise
          .then(
            function(response) {
              $scope.notify('Registro eliminado satisfactoriamente.',
                'success');
              getBillings();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End deleteBilling
      /**
       * @name getBilling
       * @description Recupera los datos de proveedores/empresas/clientes.
       */
      function getBillings() {
        var pFilter = {where: {class: $scope.class}, order: ['name']};
        Billing.find({filter: pFilter})
          .$promise
          .then(function(billings) {
              $scope.billings = billings;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getBillings
      // Funciones del $scope
      /**
       * @name add
       * @description Cambia la vista por el formulario para agregar un registro.
       */
      $scope.add = function() {
        var tmp = $state.current.name.split('.');
        $state.go(tmp[0] + '.' + tmp[1] + '.add');
      };// End add
      /**
       * @name delete
       * @description Presenta un aviso de eliminación de un proveedor/empresa/cliente.
       * @param {object} billing Objeto de proveedor/empresa/cliente.
       */
      $scope.delete = function(billing) {
        $scope.showModal('fa-warning',
          'Eliminar ' + $scope.singular,
          '<p>¿Desea eliminar a <b>' + billing.name +
          '</b> del sistema?</p>' +
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            deleteBilling(billing.id)
          });
      };// End delete
      /**
       * @name edit
       * @description Cambia la vista por el formulario para editar el registro.
       * @param {object} billing Objeto de proveedor/empresa/cliente.
       */
      $scope.edit = function(billing) {
        console.log('mis clientes', billing);
        var tmp = $state.current.name.split('.');
        $state.go(tmp[0] + '.' + tmp[1] + '.edit', {billingId: billing.id});
      };// End edit
      // Código principal
      getBillings();
    }
  ])
  /**
   * @description Controlador para registro/actualización de billing.
   */
  .controller('BillingForm', [
    '$scope',
    '$state',
    'Billing',
    function($scope, $state, Billing) {
      // Funciones generales
      /**
       * @name createBilling
       * @description Crea un nuevo registro de Billing
       */
      function createBilling() {
        $scope.busy = true;
        Billing.create($scope.billing)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            $scope.notify('Registro creado satisfactoriamente.',
             'success');
            if (response.class === 'provider') {
              $scope.return.data.idProvider = response.id;
            } else if(response.class === 'company') {
              $scope.return.data.idCompany = response.id;
            } else {
              $scope.return.data.idClient = response.id;
            }
            $state.go($scope.return.to, $scope.return.paramsTo);
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End createBilling
      /**
       * @name getBilling Recupera los datos de un registro en Billing.
       * @param {string} billingId ID del registro de Billing.
       */
      function getBilling(billingId) {
        Billing.findById({id: billingId})
          .$promise
          .then(
            function(billing) {
              if (billing.class !== $scope.class) {
                $scope.notify('Edición invalida');
                $state.go('admin.' + $scope.class + '.list');
              }
              $scope.billing = billing;
              if (billing.rfc) {
                $scope.billingFlag = true;
              }
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getBilling
      /**
       * @name updateBilling
       * @description Actualiza un registro de Billing
       */
      function updateBilling() {
        $scope.busy = true;
        Billing.prototype$patchAttributes({
          id: $scope.billing.id},
          $scope.billing)
        .$promise
        .then(
          function(response) {
            console.log("Actualizado correctamente", response);
            $scope.busy = false;
            $scope.notify('Registro actualizado satisfactoriamente.',
              'success');
            $state.go($scope.return.to, $scope.return.paramsTo);
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $.notify(err.data.error.message);
          });
      };// End updateBilling
      // Variables del $scope
      // Objeto billing
      $scope.billing = {
        class: $scope.class,
        accountStatus: 'active'};
      // Bandera para los datos fiscales.
      $scope.billingFlag = false;
      // Funciones del $scope
      /**
       * @name toggleBilling
       * @description Función para visualizar/ocultar datos fiscales.
       */
      $scope.toggleBilling = function() {
        $scope.billingFlag = !$scope.billingFlag;
        $('#billingData input').prop('required', $scope.billingFlag);
        $('#billingData select').prop('required', $scope.billingFlag);
      };// End toggleBilling
      /**
       * @name save
       * @description Función para validar y guardar los datos del form.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        if (!$scope.billing.name) {
          errorCount++;
        }
        if ($scope.billingFlag) {
          // ...si tiene datos fiscales
          // TODO: incluir los campos de datos fiscales
        }
        // Formulario con error
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        if ($scope.billing.id) {
          updateBilling();
        } else {
          createBilling();
        }
      };// End save
      // Código principal
      if ($state.params.billingId) {
        getBilling($state.params.billingId);
      }
    }
  ]);
