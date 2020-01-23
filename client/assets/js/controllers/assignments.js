angular.module('systemax')
  .controller('AssignmentBlank', [
    '$rootScope',
    '$scope',
    'Warehouse',
    function($rootScope, $scope, Warehouse) {
      /**
       * @name getWarehouse
       * @description Recupera los datos del almacén actual.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getWarehouse(warehouseId) {
        Warehouse.findById({id: warehouseId})
          .$promise
          .then(
            function(warehouse) {
              $scope.warehouse = warehouse;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }
      // Variables del $scope
      $scope.warehouse;
      // Watchers
      // $watch.currentUSer
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getWarehouse($scope.currentUser.idWarehouse);
      });
      // Código principal
      $rootScope.menu = 'assignment';
    }
  ])
  /**
   * @description Controlador para mostrar los almacenes.
   */
  .controller('AssignmentList', [
    '$rootScope',
    '$scope',
    '$state',
    'Assignment',
    'Warehouse',
    function($rootScope, $scope, $state, Assignment, Warehouse) {
      // Variables generales
      // Objeto de filtro
      var assignmentFilter = {
        include: ['destiny', 'origin', 'receiver', 'sender'],
        where: {
          and: [{
            or: [
              {status: 'received'},
              {status: 'canceled'}]}, {
            or: [
              {idOrigin: ''},
              {idDestiny: ''}]}]},
        order: 'created DESC'};
      // Funciones generales
      /**
       * @name createAssignment
       * @description Crea un nuevo registro de Assignment.
       */
      function createAssignment() {
        $scope.busy = true;
        Assignment.create($scope.assignment)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            //$scope.notify('Registro creado satisfactoriamente.','success');
            $state.go('admin.assignment.edit', {assignmentId: response.id});
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End createAssignment
      /**
       * @name getAssignmentHistory
       * @description Recupera el historial de asignaciones de este almacén.
       */
      function getAssignmentHistory() {
        Assignment.find({filter: assignmentFilter})
          .$promise
          .then(
            function(history) {
              $scope.history = history;
              // console.log("$scope.history", $scope.history);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getAssignmentHistory
      /**
       * @name getDestinyWarehouses
       * @description Recupera los datos de los almacenes padre, hermanos e
       * hijos.
       * @param {string} warehouseId Identificador del almacén
       * @param {string} parentId Identificador del almacén padre.
       */
      function getDestinyWarehouses(warehouseId, parentId) {
        var warehousesFilter = {
          where: {
            or: [
              {isMain: true},
              {idParent: warehouseId},
              {and: [
                {idParent: parentId}]}]},
          order: ['isMain DESC', 'type', 'name']
        };
        Warehouse.find({filter: warehousesFilter})
          .$promise
          .then(
            function(warehouses) {
              $scope.warehouses = warehouses;
              getToReceiveAssigment(warehouseId);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getDestinyWarehouses
      /**
       * @name getOpenAssignment
       * @description Recupera las asignaciones abieras o en transito.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getOpenAssignment(warehouseId) {
        var openFilter = {
          include: ['destiny', 'origin', 'sender'],
          where: {
            and: [
              {idOrigin: warehouseId},
              {or: [
                {status: 'open'},
                {status: 'in-transit'}]}]},
          order: 'created DESC'};
        if ($scope.currentUser.type !== 'admin') {
          openFilter.where.and.push({idSender: $scope.currentUser.id});
        }
        Assignment.find({filter: openFilter})
          .$promise
          .then(
            function(assignments) {
              $scope.toSend = assignments;
              $scope.busy = false;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getOpenAssignment
      /**
       * @name getOriginWarehouse
       * @description Recupera los datos del almacén de origen.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getOriginWarehouse(warehouseId) {
        Warehouse.findById({id: warehouseId})
          .$promise
          .then(
            function(warehouse) {
              $scope.warehouse = warehouse;
              getDestinyWarehouses(warehouse.id, warehouse.idParent);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getOriginWarehouse
      /**
       * @name getToReceiveAssigment
       * @description Recupera las asignaciones enviadas a este almacén.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getToReceiveAssigment(warehouseId) {
        var receiveFilter = {
          include: ['destiny', 'origin', 'sender'],
          where: {
            and: [
              {idDestiny: warehouseId},
              {status: 'in-transit'}]},
          order: 'created DESC'};
        Assignment.find({filter: receiveFilter})
          .$promise
          .then(
            function(assignments) {
              $scope.toReceive = assignments;
              getOpenAssignment(warehouseId);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getToReceiveAssigment
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de colores.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = assignmentFilter.where;
        Assignment.count({where: assignmentFilter.where || {}})
          .$promise
          .then(function (count) {
            if (assignmentFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      // Variables del $scope
      // Objeto assignment
      $scope.assignment = {
        idOrigin: '',
        idSender: '',
        status: 'open',
        idDestiny: null};
      $scope.busy = true;
      // Objeto historico
      $scope.history;
      // Objeto de asignaciones por recibir
      $scope.toReceive;
      // Objeto de asignaciones por enviar
      $scope.toSend;
      // Objeto warehouse
      $scope.warehouse;
      // Objeto almacenes de destino
      $scope.warehouses;
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        assignmentFilter = _.extend(assignmentFilter, $scope.pagination.filter);
        getAssignmentHistory();
      };// End reloadData
      /**
       * @name checkStatus
       * @description Revisa que el almacén de origen es diferente al de destino.
       */
      $scope.checkStatus = function() {
        if ($scope.assignment.idDestiny &&
        $scope.assignment.idOrigin !== $scope.assignment.idDestiny) {
          return false;
        } else {
          return true;
        }
      };// End checkStatus
      /**
       * @name save
       * @description Función para validar y guardar los datos del form.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        if (!$scope.assignment.idDestiny) {
          errorCount++;
        }
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        createAssignment();
      };// End save
      /**
       * @name validateDate
       * @description
       * @param {date} date
       */
      $scope.validateDate = function(date) {
        if (!date) return true;
        var today = moment().tz('Europe/London').locale('es-mx').format('x');
        var lastday =
          moment(date).tz('Europe/London').locale('es-mx').format('x');
        // 24 horas en milisegundos = 86400000
        if ((today - lastday) >= 86400000) {
          return true;
        } else {
          return false;
        }
      };// End validateDate
      // Watchers
      // $watch.currentUSer
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        assignmentFilter.where.and[1].or[0].idOrigin =
          $scope.currentUser.idWarehouse;
        assignmentFilter.where.and[1].or[1].idDestiny =
          $scope.currentUser.idWarehouse;
        $scope.assignment.idOrigin = $scope.currentUser.idWarehouse;
        $scope.assignment.idSender = $scope.currentUser.id;
        getOriginWarehouse($scope.currentUser.idWarehouse);
        recalculateCountAndReload();
      });// End $watch.currentUSer
      // Código principal
    }
  ])
  /**
   * @description Controlador para asignar productos a los almacenes.
   */
  .controller('AssignmentForm', [
    '$scope',
    '$state',
    'Stock',
    'Warehouse',
    'Assignment',
    function($scope, $state, Stock, Warehouse, Assignment) {
      // Variables generales
      var negative = document.getElementById('negative');
      var positive = document.getElementById('positive');
      // Funciones generales
      /**
       *
       * @param {*} assignmentId
       * @param {*} receiverId
       */
      function acceptAssignment(assignmentId, receiverId, flag) {
        Assignment.prototype$receive({id: assignmentId, idReceiver: receiverId})
          .$promise
          .then(
            function(result) {
              $scope.busy = false;
              //$scope.notify('Taspaso concluido satisfactoriamente.','success');
              var tmp = $state.current.name.split('.');
              if (tmp[1] === 'assignment') {
                if (flag) {
                  $state.go('admin.assignment.sheet',
                    {assignmentId: assignmentId});
                } else {
                  $state.go('admin.assignment.list');
                }
              } else {
                  $state.go('admin.cut.print', {idSeller : $scope.seller.id});
              }
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      };// End acceptAssigment
      /**
       *
       * @param {string} assignmentId
       * @param {string} stockId
       */
      function addStock(assignmentId, stock) {
        var ins = {
          id: assignmentId,
          idStock: stock.id,
          index: $scope.assignment.stockValidate.length + $scope.stockSize};
        Assignment.prototype$addStock(ins)
          .$promise
          .then(
            function(sv) {
              // $scope.temp.push({id: sv.stock.id, IMEI: sv.stock.IMEI});
              //$scope.notify('Registro creado satisfactoriamente.','success');
              $scope.assignment.stockValidate.push(sv);
              $scope.brands = [];
              $scope.models = [];
              $scope.temp.push({id: stock.id, IMEI: stock.IMEI});
              processData($scope.assignment.stockValidate);
            },
            function(err) {
              console.log(err);
              negative.play();
              $scope.showModal('fa-info',
                'No se encontró el número de serie',
                '<p>' + err.data.error.message + '</p>' +
                '<p>Retire el producto de la asignación.</p>',
                {hideCancel: true},
                function() {
                  //
                });
            });
      }// End addStock
      /**
       * @name cancelAssignment
       * @description Cancela un traspaso.
       * @param {string} assignmentId Identificador del taspaso.
       * @param {string} receiverId Identificador del usuario que cancela.
       */
      function cancelAssignment(assignmentId, receiverId) {
        Assignment.prototype$cancel({id: assignmentId, idReceiver: receiverId})
        .$promise
        .then(
          function(result) {
            $scope.busy = false;
            //$scope.notify('Taspaso cancelado satisfactoriamente.','success');
            var tmp = $state.current.name.split('.');
            if (tmp[1] === 'assignment') {
              $state.go('admin.assignment.list');
            } else {
              $state.go('admin.cut.print', {idSeller : $scope.seller.id});
            }
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End cancel Assignment
      /**
       * @name closeAssignment
       * @description Establece el traspaso en transito.
       * @param {string} assignmentId Identificador del traspaso.
       */
      function closeAssignment(assignmentId) {
        var values = {status: 'in-transit'};
        Assignment.prototype$patchAttributes({id: assignmentId}, values)
          .$promise
          .then(
            function(respose) {
              //$scope.notify('Registro creado satisfactoriamente.','success');
              var tmp = $state.current.name.split('.');
              if (tmp[1] === 'assignment') {
                $state.go('admin.assignment.list');
              } else {
                $state.go('admin.cut.print', {idSeller : $scope.seller.id});
              }
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.date.error.message);
            });
      }// End closeAssignment
      /**
       * @name deleteStock
       * @description Valida el stock para eliminarlo.
       * @param {string} IMEI Número de serie/IMEI del stock.
       * @param {object} warehouse Objeto del almacén origen.
       */
      function deleteStock(IMEI, warehouse) {
        getStock(IMEI, warehouse, function(err, stock) {
          if (err) {
            // ...error en la búsqueda
            console.log(err);
            negative.play();
            $scope.showModal('fa-info',
              'No se encontró el número de serie',
              '<p>El equipo búscado no se encuentra en el <b>' +
              warehouse.name + '</b></p>' +
              '<p>Vuelva a escanear el código de barras.</p>',
              {hideCancel: true},
              function() {
                //
              });
          } else if (stock) {
            // ...equipo encontrado
            $scope.temp = removeFromArray($scope.temp, {id: stock.id});
            delStock($scope.assignment.id, stock.id);
          }
        });
      }
      /**
       * @name delStock
       * @description Elimina de la asignación el equipo buscado.
       * @param {string} assignmentId Identificador de la asignación.
       * @param {string} stockId Identificador del stock.
       */
      function delStock(assignmentId, stockId) {
        Assignment.prototype$delStock({id: assignmentId, idStock: stockId})
        .$promise
        .then(
          function (response) {
            $scope.notify('Registro eliminado satisfactoriamente.','success');
            removeData(stockId);
          },
          function (err) {
            console.log(err);
            negative.play();
            $scope.showModal('fa-info',
              'No se encontró el número de serie',
              '<p>' + err.data.error.message + '</p>' +
              '<p>Retire el producto de la asignación.</p>',
              {hideCancel: true},
              function() {
                //
              });
          }
        );
      }// End delStock
      /**
       * @name getAssignment
       * @description Recupera la asignación por su Identificador.
       * @param {string} assignmentId Identificador de la asignación.
       * @param {function} cb Función de callback.
       */
      function getAssignment(assignmentId, cb) {
        var assignmentFilter = {
          include: [
            {relation: 'destiny', scope: {
              include: [
                'users',
                {relation: 'stocks', scope: {
                  where: {status: 'assigned'}
                }}]}},
            'origin',
            'sender',
            'receiver',
            {relation: 'stockValidate', scope: {
              include: {
                relation: 'stock', scope: {
                  include: {
                    relation: 'product', scope: {
                      include: {
                        relation: 'model', scope: {
                          include: 'brand'}}}}}}}}]};
        Assignment.findById({id: assignmentId, filter: assignmentFilter})
          .$promise
          .then(
            function(assignment) {
              return cb(null, assignment);
            },
            function(err) {
              $scope.busy = false;
              return cb(err);
            });
      }// End getAssignment
      /**
       * @name getStock
       * @description Busca en el almacén el número de serie para su
       * asignación.
       * @param {string} IMEI Número de serie del producto asignado.
       * @param {object} warehouse Objeto con los datos del alamcén origien.
       */
      function getStock(IMEI, warehouse, cb) {
        var filter = {
          where: {
            and:[
              {IMEI: IMEI},
              {idWarehouse: warehouse.id}]}};
        Stock.findOne({filter: filter})
          .$promise
          .then(
            function(stock) {
              cb(null, stock);
            },
            function(err) {
              cb(err);
            });
      }// End getStock
      /**
       * @name insertStock
       * @description
       * @param {string} IMEI
       * @param {object} warehouse
       */
      function insertStock(IMEI, warehouse) {
        getStock(IMEI, warehouse, function(err, stock) {
          if (err) {
            $('#imei').prop('disabled', true).focus();
            console.log(err);
            $scope.showModal('fa-info',
              'No se encontró el número de serie',
              '<p>El equipo búscado no se encuentra en el <b>' +
              warehouse.name + '</b></p>' +
              '<p>Vuelva a escanear el código de barras.</p>',
              {hideCancel: true},
              function() {
                //
              });
            negative.play();
          } else if (stock) {
            if ($scope.assignment.status === 'open') {
              addStock($scope.assignment.id, stock);
            } else {
              valStock($scope.assignment.id, stock.id);
            }
          }
        });
      }// End insertStock
      /**
       * @name processData
       * @description Recorre el arreglo de stock y da formato a la información
       * para presentarla en el view.
       * @param {array} stocks Arreglo con los datos del stock.
       */
      function processData(stockValidate) {
        $scope.assignment.validates = 0;
        if (stockValidate.length) {
          _.each(stockValidate, function(sv) {
            if (sv.validate) {
              $scope.assignment.validates++;
            }
            var findBrand = _.find($scope.brands, function(b) {
              return b.id === sv.stock.product.idBrand;
            });
            if (!findBrand) {
              var newBrand = {
                id: sv.stock.product.idBrand,
                name: sv.stock.product.model.brand.name,
                count: 1};
              $scope.brands.push(newBrand);
            } else {
              findBrand.count++;
            }
            var findModel = _.find($scope.models, function(m) {
              return m.id === sv.stock.product.idProductModel;
            });
            if (!findModel) {
              var newModel = {
                id: sv.stock.product.idProductModel,
                name: sv.stock.product.model.name,
                count: 1,
                brand: sv.stock.product.model.brand};
              $scope.models.push(newModel);
            } else {
              findModel.count++;
            }
          });
          $scope.brands = _.sortBy($scope.brands, 'name');
          $scope.models = _.sortBy((_.sortBy($scope.models, 'brand.name')),
            'name');
        }
      }// End proceesData

      function removeData(stockId) {
        var find = _.find($scope.assignment.stockValidate, function(vs) {
          return vs.idStock === stockId;
        });
        if (!find) return;
        var bIdx;
        var mIdx;
        var findBrand = _.find($scope.brands, function(b, index) {
          bIdx = index;
          return b.id === find.stock.product.idBrand;
        });
        if (findBrand) {
          findBrand.count--;
          if (!findBrand.count) {
            $scope.brands.splice(bIdx, 1);
          }
        }
        var findModel = _.find($scope.models, function(m, index) {
          mIdx = index;
          return m.id === find.stock.product.idProductModel;
        });
        if (findModel) {
          findModel.count--;
          if (!findModel.count) {
            $scope.models.splice(mIdx, 1);
          }
        }
        $scope.assignment.stockValidate =
          removeFromArray($scope.assignment.stockValidate, {idStock: stockId});
      }// End removeData

      /**
       * @name removeFromArray
       * @description Elimina un objeto del arrelgo dado en base al filtro de
       * búsqueda.
       * @param {object} array Arreglo de objetos.
       * @param {object} filter Filtro de búsqueda.
       */
      function removeFromArray(array, filter) {
        return _.without(array, _.findWhere(array, filter));
      }// End removeFromArray
      /**
       * @name valStock
       * @description
       * @param {string} assignmentId
       * @param {string} stockId
       */
      function valStock(assignmentId, stockId) {
        Assignment.prototype$valStock({id: assignmentId, idStock: stockId})
          .$promise
          .then(
            function(result) {
              positive.play();
              $scope.assignment.validates++;
              var find = _.find($scope.assignment.stockValidate, function(sv) {
                return sv.id === result.id;
              });
              if (find) {
                find.validate = true;
              }
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End valStock
      // Variables del $scope
      $scope.assignment;
      $scope.brands = [];
      $scope.busy = true;
      $scope.input = {
        serie: '',
        lastSerie: '',
        toggleSave: false};
      $scope.models = [];
      $scope.temp = [];
      $scope.seller = {};
      $scope.stockSize = 0;
      // Funciones del $scope
      /**
       * @name cancel
       * @description Valida si el usuario desea cancelar el traspaso.
       */
      $scope.cancel = function() {
        var origin = $scope.assignment.origin;
        var destiny = $scope.assignment.destiny;
        $scope.showModal('fa-warning',
          'Cancelar traspaso en el sistema',
          '<p>¿Desea cancelar el traspaso entre <b>' + origin.name +
          '</b> y <b>' + destiny.name + '</b>?</p>' +
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            $scope.busy = true;
            cancelAssignment($scope.assignment.id, $scope.currentUser.id);
          });
      };// End cancel
      /**
       * @name close
       * @description Prepara los datos para cerrar el traspaso.
       */
      $scope.close = function() {
        $scope.busy = true;
        if ($scope.assignment.destiny.type === 'seller' || $scope.assignment.origin.type === 'seller') {
          // Implementar codigo para mostrar mensaje de aceptación sin validación
          acceptAssignment($scope.assignment.id, $scope.currentUser.id, true);
        } else {
          closeAssignment($scope.assignment.id);
        }
      };// End close
      /**
       * @name receive
       * @description Valida que el usuario haya escaneado los imeis del traspaso.
       */
      $scope.receive = function() {
        var message =
          '<p>Se reciben ' + $scope.assignment.stockValidate.length +
          ' equipos en ' + $scope.assignment.destiny.name + '.</p>';
        if ($scope.assignment.validates !==
        $scope.assignment.stockValidate.length) {
          message = '<p>Solo ha validado ' + $scope.assignment.validates +
          ' equivalente al ' + Math.floor(($scope.assignment.validates /
          $scope.assignment.stockValidate.length) * 100) +
          '% de traspaso recibido</p><p>¿Desea continuar de todas formas?</p>';
        }
        $scope.showModal('fa-warning', 'Aceptar traspaso en el sistema',
          message, {}, function() {
            $scope.busy = true;
            acceptAssignment($scope.assignment.id, $scope.currentUser.id, false);
          });
      };// End receive
      /**
       * @name save
       * @description Prepara los datos para la asignación del stock.
       */
      $scope.save = function() {
        $('#imei').prop('disabled', true);
        var imei = $scope.input.serie;
        if ($scope.input.serie) {
          if ($scope.input.toggleSave) {
            // ...debe eliminar
            deleteStock(imei, $scope.assignment.origin);
          } else {
            // ...debe registrar
            insertStock(imei, $scope.assignment.origin);
          }
        } else {
          // ...no se agrega
          $('#imei').prop('disabled', true);
          // ...ya fue registrado en la base de datos
          $scope.showModal('fa-warning',
            'Error de captura',
            '<p><b>El tamaño del IMEI no es el adecuado</b></p>',
            {hideCancel: true},
            function() {
              //
            });
          // $scope.temp = removeFromArray($scope.temp, {IMEI: _imei});
          negative.play();
        }
        $scope.input.lastSerie = imei;
        $scope.input.serie = '';
        $('#imei').val('').prop('disabled', false).focus();
      };// End save
      /**
       * @name validate
       * @description Valida los datos de la asignación contra el usuario actual.
       */
      $scope.validate = function(label) {
        if (!$scope.assignment) return;
        var key = '';
        // Orden abierta
        if ($scope.assignment.status === 'open') {
          // ...orden abierta
          key = 'a';
        } else if ($scope.assignment.status === 'in-transit' &&
        $scope.assignment.idDestiny === $scope.currentUser.idWarehouse) {
          // ...
          key = 'b';
        } else if ($scope.assignment.status === 'in-transit' &&
        $scope.assignment.idSender === $scope.currentUser.id &&
        $scope.assignment.idOrigin === $scope.currentUser.idWarehouse) {
          // ...remitente puede cancelar
          key = 'c';
        } else {
          key = 'x';
        }
        if (label.indexOf(key) != -1) {
          return true;
        }
        return false;
      };// End validate
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getAssignment($state.params.assignmentId, function(err, assignment) {
          $scope.busy = false;
          $('#imei').val('').prop('disabled', false).focus();
          if (err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          } else if (assignment) {
            if (assignment.idDestiny !== $scope.currentUser.idWarehouse &&
            assignment.idOrigin !== $scope.currentUser.idWarehouse) {
              // ...prevenir presentar datos si no corresponde al almacén
              $state.go('admin.assignment.list');
            }
            $scope.assignment = assignment;
            if (assignment.destiny.stocks) {
              $scope.stockSize = parseInt(assignment.destiny.stocks.length);
            }
            if (assignment.destiny.users) {
              $scope.seller = assignment.destiny.users[0];
            }
            _.each(assignment.stockValidate, function(sv, idx) {
              $scope.assignment.stockValidate[idx].index = sv.stock.index;
              $scope.assignment.stockValidate[idx].date = sv.stock.date;
              $scope.temp.push({id: sv.stock.id, IMEI: sv.stock.IMEI});
            });
            $scope.assignment.stockValidate =
              _.sortBy($scope.assignment.stockValidate, 'index');
            processData(assignment.stockValidate);
          }
        });
      });// End $watch.currentUser
      // Código principal
      // Dissmiss Modal
      $('#genericModal').on('hidden.bs.modal', function(e) {
        $('#imei').val('').prop('disabled', false).focus();
      });
    }
  ])
  /**
   * @description Controlador para la hoja de asignación.
   */
  .controller('AssignmentStock', [
    '$scope',
    '$state',
    'Assignment',
    function($scope, $state, Assignment) {
      // Variables generales
      // Funciones generales
      /**
       * @name getAssignment
       * @description Recupera los datos de una transferencia con su stock.
       * @param {string} assignmentId Identificador de la asignación.
       */
      function getAssignment(assignmentId) {
        var assignmentFilter = {
          include: [
            'destiny',
            {relation: 'stocks', scope: {
              include: 'product',
              order: ['index']}}]};
        Assignment.findById({id: assignmentId, filter: assignmentFilter})
          .$promise
          .then(
            function(assignment) {
              $scope.assignment = assignment;
              processStocks(assignment.stocks);
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getAssignment
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
      $scope.assignment = {};
      $scope.busy = true;
      $scope.products = [];
      // Extensión del objeto Math
      $scope.Math = window.Math;
      // Funciones del $scope
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        if ($state.params.assignmentId) {
          getAssignment($state.params.assignmentId);
        }
      });// End $watch.currentUser
    }
  ]);
