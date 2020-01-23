angular.module('systemax')
  .controller('WarehouseBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      // Código principal
      $rootScope.menu = 'warehouse';
    }
  ])
  /**
   * @description Controlador para listar los almacenes.
   */
  .controller('WarehouseList', [
    '$rootScope',
    '$scope',
    'Warehouse',
    function($rootScope, $scope, Warehouse) {
      // Variables generales
      var warehouseFilter = {
        include: ['products'],
        where: {and:[{type: {neq: 'all'}},{or:[
          {idParent: null},
          {idParent: $scope.currentUser.idWarehouse}]}]},
        /*where: {or:[
          {idParent: null},
          {idParent: $scope.currentUser.idWarehouse}]},*/
        order: ['date DESC']};
      // Funciones generales
      /**
       * @name deleteWarehouse
       * @description Elimina un almacén por su Id.
       * @param {string} warehouseId Identificador del almacén.
       */
      function deleteWarehouse(warehouseId) {
        Warehouse.deleteById({id: warehouseId})
          .$promise
          .then(
            function(response) {
              $scope.notify('Registro eliminado satisfactoriamente.',
                'success');
              recalculateCountAndReload();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
              });
      }// End deleteWarehouse
      /**
       * @name getWarehouses
       * @description Recupera los datos de los almacenes registrados.
       */
      function getWarehouses() {
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
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de almacenes.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Redefinir el filtro por usuario
        if ($scope.currentUser.type === 'warehouse-boss') {
          warehouseFilter.where.and[0] = {type: 'place'};
        } else if ($scope.currentUser.type === 'manager') {
          warehouseFilter.where.and[0] = {type: 'seller'};
        }
        // Recuperar el ultimo filtro utilizado
        var lastWhere = warehouseFilter.where;
        Warehouse.count({where: warehouseFilter.where || {}})
          .$promise
          .then(function (count) {
            if (warehouseFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      // Variables del $scope
      // Objeto de almacenes
      $scope.warehouses = {};
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        warehouseFilter = _.extend(warehouseFilter, $scope.pagination.filter);
        getWarehouses();
      };// End reloadData
      /**
       * @name delete
       * @description Presenta un aviso de eliminación de un almacén.
       * @param {object} Warehouse Objeto de orden de compra.
       */
      $scope.delete = function(warehouse) {
        $scope.showModal('fa-warning',
          'Eliminar almacén del sistema',
          '<p>¿Desea eliminar el almacén <b>' + warehouse.name + '</b>?</p>' + 
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            deleteWarehouse(warehouse.id);
          });
      }; //End delete
      // Watchers
      // Código principal
      recalculateCountAndReload();
      if ($scope.return.data) {
        $scope.return.data = {};
      }
    }
  ])
  /**
   * @description Controlador para registro/actualización de los almacenes.
   */
  .controller('WarehouseForm', [
    '$scope',
    '$state',
    'Warehouse',
    function($scope, $state, Warehouse) {
      // Variables generales
      // Funciones generales
      /**
       * @name createWarehouse
       * @description Crea un nuevo registro de Warehouse.
       */
      function createWarehouse() {
        $scope.busy = true;
        Warehouse.create($scope.warehouse)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            $scope.notify('Registro creado satisfactoriamente.',
              'success');
            $state.go($scope.return.to, $scope.return.paramsTo);
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End createWarehouse
      /**
       * @name getWarehouse
       * @description Recupera los datos de un almacén.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getWarehouse(warehouseId) {
        Warehouse.findById({id: warehouseId})
          .$promise
          .then(
            function (warehouse) {
              $scope.warehouse = warehouse;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getWarehouse
      /**
       * @name getWarehouses
       * @description Recupera los almacenes lugares.
       */
      function getWarehouses() {
        var warehouseFilter = {
          where: {type: 'place'},
          order: ['isMain DESC', 'name']};
        if ($state.params.warehouseId) {
          warehouseFilter.where = {
            and:[
              {id: {neq: $state.params.warehouseId}},
              {type: 'place'}]};
        }
        console.log(warehouseFilter);
        Warehouse.find({filter: warehouseFilter})
          .$promise
          .then(
            function(warehouses) {
              console.log('warehouses', warehouses);
              $scope.warehouses = warehouses;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getWarehouses

      /**
       * @name updateWarehouse
       * @description Actualiza un registro de WarehouseOrder.
       */
      function updateWarehouse() {
        $scope.busy = true;
        Warehouse.prototype$patchAttributes({
            id: $scope.warehouse.id},
            $scope.warehouse)
          .$promise
          .then(
            function(response) {
              $scope.busy = false;
              $scope.notify('Registro actualizado satisfactoriamente.',
                'success');
              $state.go($scope.return.to, $scope.return.paramsTo);
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End updateWarehouse
      // Variables del $scope
      $scope.warehouse = {};
      $scope.warehouses = [];
      // Funciones del $scope
      /**
       * @name save
       * @description Función para validar y guardar los datos del form.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        if (!$scope.warehouse.idParent) {
          errorCount++;
        }
        if (!$scope.warehouse.name) {
          errorCount++;
        }
        if (!$scope.warehouse.type) {
          errorCount++;
        }
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        if ($scope.warehouse.id) {
          updateWarehouse();
        } else {
          createWarehouse();
        }
      };// End save
      // Watchers
      // Código principal
      if ($state.params.warehouseId) {
        getWarehouse($state.params.warehouseId);
      }
      if ($scope.currentUser.type === 'warehouse-boss') {
        $scope.warehouse.type = 'place';
      } else if ($scope.currentUser.type === 'manager') {
        $scope.warehouse.type = 'seller';
      }
      getWarehouses();
    }
  ])
  /**
   * @description Controlador para obtener los productos en existencia.
   */
  .controller('WarehouseStock', [
    '$rootScope',
    '$scope',
    'Warehouse',
    function($rootScope, $scope, Warehouse) {
      // Variables generales
      // Funciones generales
      /**
       * @name getProducts
       * @description Recupera los datos de los productos del almacén.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getProducts(warehouseId) {
        Warehouse.inStock({id: warehouseId})
          .$promise
          .then(
            function (products) {
              $scope.products = products;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getProducts
      /**
       * @name getWarehouse
       * @description Recupera los datos del almacén.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getWarehouse(warehouseId) {
        Warehouse.findById({id: warehouseId})
          .$promise
          .then(
            function(warehouse) {
              $scope.warehouse = warehouse;
              getProducts($scope.warehouse.id);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getWarehouse
      // Variables del $scope
      $rootScope.menu = 'inventory';
      $scope.products = undefined;
      $scope.warehouse = undefined;
      // Funciones del $scope
      // Código principal
      getWarehouse($scope.currentUser.idWarehouse);
    }
  ])
  /**
   * @description Controlador para administrar acceso de usuarios a los almacenes.
   */
  .controller('WarehouseManage', [
    '$scope',
    '$state',
    'SysUser',
    'Warehouse',
    function($scope, $state, SysUser, Warehouse) {
      // Funciones generales
      /**
       * @name addUser
       * @description Agrega al usuario a la lista de acceso.
       * @param {string} warehouseId Identificador del almacén.
       * @param {string} userId Identificador del usuario.
       */
      function addUser(warehouseId, userId) {
        Warehouse.prototype$addUser({id: warehouseId, idUser: userId})
        .$promise
        .then(
          function(success) {
            getWarehouse(warehouseId);
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End addUser
      /**
       * @name delUser
       * @description Elimina de la lista de acceso al usuario.
       * @param {string} warehouseId Identificador del almacén.
       * @param {string} userId Identificador del usuario.
       */
      function delUser(warehouseId, userId) {
        Warehouse.prototype$delUser({id: warehouseId, idUser: userId})
          .$promise
          .then(
            function(success) {
              getWarehouse(warehouseId);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End delUser
      /**
       * @name getUsers
       * @description Recupera la lista de usuarios registrados.
       * @param {object} whereFilter Objeto con los filtros de búsqueda.
       */
      function getUsers(whereFilter) {
        SysUser.find({filter: whereFilter})
          .$promise
          .then(
            function(users) {
              $scope.users = users;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getUsers
      /**
       * @name getWarehouse
       * @description Recupera los datos del almacén actual además de los usuarios con acceso al mismo.
       * @param {string} warehouseId Identificador del almacén
       */
      function getWarehouse(warehouseId) {
        var warehouseFilter = {
          include: 'users'
        };
        Warehouse.findById({id: warehouseId, filter: warehouseFilter})
          .$promise
          .then(
            function(warehouse) {
              $scope.warehouse = warehouse;
              if (warehouse.type !== 'place') {
                $scope.notify('El almacén requerido es una ruta de venta.');
                $state.go('admin.warehouse.list');
              }
              var userWhere = {
                where: {
                  and: [{
                    or: [{
                      type: 'warehouse-boss'}, {
                      type: 'storer'}]}]}};
              _.each(warehouse.users, function(user) {
                userWhere.where.and.push({id: {neq: user.id}});
              });
              getUsers(userWhere);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getWarehouse
      // Objeto almacén
      $scope.warehouse;
      // Funciones del $scope
      /**
       * @name addUser
       * @description Valida los datos para agregar a la lista de acceso al usuario.
       * @param {object} user Objeto de usuario.
       */
      $scope.addUser = function(user) {
        addUser($scope.warehouse.id, user.id);
      };// End addUser
      /**
       * @name removeUser
       * @description Valida los datos para quitar de la lista de acceso al usuario.
       * @param {object} user Objeto de usuario.
       */
      $scope.removeUser = function(user) {
        delUser($scope.warehouse.id, user.id);
      };// End removeUser
      getWarehouse($state.params.warehouseId);
    }
  ])
  /**
   * @description
   */
  .controller('WarehouseRouteBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      $rootScope.menu = 'route';
    }
  ])
  /**
   * @description
   */
  .controller('WareohuseRouteList', [
    '$scope',
    'Warehouse',
    // Funciones generales
    function($scope, Warehouse) {
      /**
       * @name getRoutes
       * @description Recupera los datos de las rutas de venta.
       * @param {string} parentId Identificador del almacén padre.
       */
      function getRoutes(parentId) {
        var warehouseFilter = {
          include: [
            {relation: 'stocks', scope: {
              include: 'product',
              where: {
                and: [
                  {validate: false},
                  {or: [
                    {status: 'assigned'},
                    {status: 'guarantee'}]}]},
              order: ['index']
            }}],
          where: {
            and: [
              {type: 'seller'},
              {idParent: parentId}]},
          order: ['name']
        };
        Warehouse.find({filter: warehouseFilter})
          .$promise
          .then(
            function(warehouses) {
              $scope.busy = false;
              $scope.warehouses = warehouses;
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getRoutes

      /**
       * @name processStocks
       * @description Procesa los stocks para generar la hoja de asignación.
       * @param {object} stocks Arreglo de objetos 
       */
      function processStocks(stocks) {
        _.each(stocks, function(stock) {
          var find = _.find($scope.products, function(p) {
            return p.idProductModel === stock.product.idProductModel;
          });
          if (!find) {
            var tmp = stock.product.name.split(',');
            var newProduct = {
              idProductModel: stock.product.idProductModel,
              name: tmp[0],
              stocks: [{id: stock.id, IMEI: stock.IMEI, isRefurb: stock.isRefurb}]};
            $scope.products.push(newProduct);
          } else {
            find.stocks.push({id: stock.id, IMEI: stock.IMEI, isRefurb: stock.isRefurb});
          }
        });
        $scope.products = _.sortBy($scope.products, 'name');
        $scope.busy = false;
      }// End processStocks
      // Variables del $scope
      $scope.busy = true;
      // Extensión del objeto Math
      $scope.Math = window.Math;
      $scope.today = $scope.getToday();
      $scope.warehouses = [];
      // Funciones del $scope
      /**
       * @name search
       * @description Valida el formulario de búsqueda de rutas de ventas.
       */
      $scope.search = function() {
        $scope.products = [];
        if (!$scope.warehouse.id) {
          return $scope.notify('Debe elegir una ruta de venta de la lista.');
        }
        var find = _.find($scope.warehouses, function(w) {
          return w.id === $scope.warehouse.id
        });
        if (!find) {
          return $scope.notify('No se recuperaron los datos de la ruta.');
        } else {
          $scope.busy = true;
          $scope.warehouse.name = find.name;
          $scope.warehouse.stockSize = find.stocks.length;
          processStocks(find.stocks);
        }
      };// End search
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getRoutes(u.idWarehouse);
      });// End $watch.currentUser
      // $watch.warehouse.id
      $scope.$watch('warehouse.id', function(warehouseId) {
        if (!warehouseId) return $scope.products = [];
      });// End $watch.warehouse.id
    }
  ]);