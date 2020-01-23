angular.module('systemax')
  .controller('UserBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      // Objeto con los tipos de usuario para el tipo actual.
      $scope.userTypesObject = {
        'admin': [
          {tag: 'accountant', label: 'Contabilidad'},
          {tag: 'ceo', label: 'Director general'},
          {tag: 'manager', label: 'Gerente'},
          {tag: 'warehouse-boss', label: 'Jefe de almacén'},
          {tag: 'seller', label: 'Vendedor'},
          {tag: 'storer', label: 'Almacenista'},
          {tag: 'support', label: 'Apoyo'}],
        'manager': [{tag: 'seller', label: 'Vendedor'}],
        'warehouse-boss': [
          {tag: 'storer', label: 'Almacenista'},
          {tag: 'support', label: 'Apoyo'}]};
      // Actualizar objeto menú
      $rootScope.menu = 'user';
    }
  ])
  /**
   * @description Controlador para mostrar los usuarios registrados en el
   * sistema.
   */
  .controller('UserList', [
    '$rootScope',
    '$scope',
    'SysUser',
    function($rootScope, $scope, SysUser) {
      // Variables generales
      var userFilter = {
        where: {
          and: [
            {type: {neq: 'admin'}},
            {accountStatus: {neq: 'all'}}]},
        order: ['date DESC']};
      // Funciones generales
      /**
       * @name deleteUser
       * @description Elimina un usuario por su id.
       * @param {string} userId Identificador del usuario.
       */
      function deleteUser(userId) {
        // TODO: Método eliminar usuarios no está considerado en el desarrollo.
      }// End deleteUser
      /**
       * @name getUsers
       * @description Recupera a los usuarios de acuerdo a los valores del
       * filtro.
       */
      function getUsers() {
        SysUser.find({filter: userFilter})
        .$promise
        .then(
          function(users) {
            $scope.busy = false;
            $scope.users = users;
          },
          function(err) {
            $scope.busy = true;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End getUsers
      /**
       * @name recalculateCountAndReload
       * @description Actualiza la paginación con base al número de usuarios.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        if ($scope.currentUser.type === 'manager') {
          userFilter.where.and[2] = {type: 'seller'};
        } else if ($scope.currentUser.type === 'warehouse-boss') {
          userFilter.where.and[2] = {
            or: [{type: 'support'},
              {type: 'storer'}]};
        }
        var lastWhere = userFilter.where;
        SysUser.count({where: userFilter.where || {}})
          .$promise
          .then(function (count) {
            if (userFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      /**
       * @name redefineWhereFilter
       * @description Actualiza el filtro para mostrar los usuarios.
       */
      function redefineWhereFilter() {
        var filter = { neq: 'all'};
        if ($scope.formFilters.status !== 'all') {
          filter = $scope.formFilters.status;
        }
        userFilter.where.and[1].accountStatus = filter;
        recalculateCountAndReload();
      }// End redefineWhereFilter
      /**
       * @name toggleStatus
       * @description Actualiza el estatus del usuario de activo a inactivo.
       * @param {string} status Valor actual del estatus a cambiar.
       * @param {string} userId Identificador del usuario.
       */
      function toggleStatus(status, userId) {
        if (status === 'active') {
          status = 'disabled';
        } else {
          status = 'active';
        }
        SysUser.prototype$patchAttributes({id: userId}, {accountStatus: status})
        .$promise
        .then(
          function(response) {
            recalculateCountAndReload();
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End toggleStatus
      // Variables del $scope
      $scope.busy = true;
      $scope.header.icon = 'fa-puzzle-piece';
      $scope.header.title = 'Usuarios';
      $scope.users = [];
      // Objeto para etiquetas
      $scope.statusLabel = {
        'active': 'activa',
        'pre-active': 'inactiva',
        'disabled': 'suspendida'
      };
      $scope.typeLabel = {
        'accountant': 'Contabilidad',
        'ceo': 'Director general',
        'manager': 'Gerente',
        'warehouse-boss': 'Jefe de almacén',
        'seller': 'Vendedor',
        'storer': 'Almacenista',
        'support': 'Apoyo'};
      // Objeto estatus de la orden de compra
      $scope.usersStatus = [
        {label: 'Todas', tag: 'all'},
        {label: 'Activas', tag: 'active'},
        {label: 'Suspendidas', tag: 'disabled'}];
      $scope.formFilters = {};
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        userFilter = _.extend(userFilter, $scope.pagination.filter);
        getUsers();
      };// End reloadData
      /**
       * @name delete
       * @description Función para validar eliminar un usuario.
       * @param {object} user Objeto con los datos del usuario a eliminar.
       */
      $scope.delete = function(user) {
        $scope.showModal('fa-warning',
          'Eliminar usuario del sistema',
          '<p>¿Desea eliminar el usuario <b>' + user.name +
          user.lastName + '</b>?</p>' +
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            // deleteUser(user.id);
          });
      }// End delete
      /**
       * @name toggle
       * @description Función para actualizar el status de un usuario.
       * @param {object} user Objeto con los datos del usuario.
       */
      $scope.toggle = function(user) {
        toggleStatus(user.accountStatus, user.id);
      };// End toggle
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        $scope.formFilters.status = 'active';
      });// End $watch.currentUser
      // $watch.formFilters.status
      $scope.$watch('formFilters.status', function(status) {
        if (!status) return;
        $scope.busy = true;
        redefineWhereFilter();
      });// End $watch.formFilters.status
      // Código principal
    }
  ])
  /**
   * @description Controlador para registro/actualización de lotes.
   */
  .controller('UserForm', [
    '$scope',
    '$state',
    'SysUser',
    'Warehouse',
    function($scope, $state, SysUser, Warehouse) {
      // Variables generales
      // Funciones generales
      /**
       * @name createUser
       * @description Crea un nuevo registro de SysUser.
       */
      function createUser() {
        $scope.busy = true;
        $scope.user.idParent = $scope.currentUser.id;
        SysUser.create($scope.user)
          .$promise
          .then(
            function(response) {
              $scope.busy = false;
              $scope.notify('Registro creado satisfactoriamente.', 'success');
              $state.go('admin.user.list');
            },
            function(err) {
              $scope.busy = false;
              $('form.needs-validation').removeClass('was-validated');
              console.log(err);
              if (err.data.error.details.field &&
                err.data.error.details.field === 'email') {
                  $('#email').addClass('is-invalid');
              }
              $scope.notify(err.data.error.message);
            });
      }// End createUser
      /**
       * @name getUser
       * @description Recupera los datos de un usuario por su Id
       * @param {string} userId Identificador del usuario.
       */
      function getUser(userId) {
        var userFilter = {
          include: {
            relation: 'warehouseACL', scope: {
              limit: 1,
              order: 'index'}}};
        SysUser.findById({id: userId, filter: userFilter})
          .$promise
          .then(
            function(user) {
              $scope.user = user;
              $scope.user.idWarehouse = user.warehouseACL[0].idWarehouse;
            },
            function(err) {
              console.log(err);
              $.notify(err.data.error.message, {
                hideDuration: 1000,
                showDuration: 200,
                position: 'right bottom'});
            });
      }// End getUSer
      /**
       * @name getWarehouses
       * @description Recupera los datos de los almacenes registrados.
       */
      function getWarehouses() {
        var myType = undefined;
        var myWarehouse = $scope.currentUser.idWarehouse;
        var warehouseFilter = {where: {}, order: ['name']};

        if ($scope.currentUser.type === 'warehouse-boss') {
          myType = 'place';
        } else if ($scope.currentUser.type === 'manager') {
          myType = 'seller';
        }
        if ($scope.currentUser.type !== 'admin') {
          warehouseFilter.where = {
            and:[
              {or:[
                {id: myWarehouse},
                {idParent: myWarehouse}]},
              {type: myType}]
          };
        }
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
       * @name updateUser
       * @description Actualiza un registro de SysUser.
       */
      function updateUser() {
        $scope.busy = true;
        SysUser.prototype$patchAttributes({
          id: $scope.user.id},
          $scope.user)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            $scope.notify('Registro actualizado satisfactoriamente.',
              'success');
            $state.go('admin.user.list');
          },
          function(err) {
            $scope.busy = false;
            $('form.needs-validation').removeClass('was-validated');
            console.log(err);
            if (err.data.error.details.field &&
              err.data.error.details.field === 'email') {
                $('#email').addClass('is-invalid');
            }
            $scope.notify(err.data.error.message +
              ' El usuario no fue actualizado.');
          });
      }// End updateUser
      // Variables del $scope
      $scope.user = {
        accountStatus: 'active'};
      // Cargar select
      $scope.userTypes = $scope.userTypesObject[$scope.currentUser.type];
      // Funciones del $scope
      /**
       * @name save
       * @description Valida el formulario de captura del usuario.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        // Validación del formulario
        if (!$scope.user.type) {
          errorCount++;
        }
        if (!$scope.user.id && !$scope.user.idWarehouse) {
          errorCount++;
        }
        if (!$scope.user.email) {
          errorCount++;
        }
        if (!$scope.user.name) {
          errorCount++;
        }
        if (!$scope.user.lastName) {
          errorCount++;
        }
        if (!$scope.user.id && !$scope.user.password) {
          errorCount++;
        }
        // Formulario con error
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        if ($scope.user.id) {
          updateUser();
        } else {
          createUser();
        }
      };// End save
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getWarehouses();
        if ($state.params.userId) {
          getUser($state.params.userId);
        }
        /*
        if (!$scope.user.id) {
        $('#warehouse').prop('required', true);
        $('#password').prop('required', true);
        }
        */
      });// End $watch.currentUser
      // Código principal
      
    }
  ]);
