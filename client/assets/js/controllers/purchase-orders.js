angular.module('systemax')
  .controller('PurchaseOrderBlank', [
    '$rootScope',
    '$scope',
    '$state',
    function($rootScope, $scope, $state) {
      // Funciones del $scope
      /**
       * @name setPaymentMethod
       * @description Devuelve el método de pago para la orden de compra.
       * @param {string} method Método de pago.
       */
      $scope.setPaymentMethod = function(method) {
        switch (method) {
          case 'unknown':
            return 'Desconocido';
          case 'credit':
            return 'Crédito';
          case 'cash': 
            return 'Efectivo';
        }
      };// End setPaymentMethod
      /**
       * @name setPaymentRule
       * @description Devuelve la regla de pago para la orden de compra.
       * @param {string} rule 
       */
      $scope.setPaymentRule = function(rule) {
        switch (rule) {
          case 'A': return 'Pago inmediato';
          case 'B': return 'Pagadero a 7 días';
          case 'C': return 'Pagadero a 15 días';
          case 'D': return 'Pagadero a 21 días';
          case 'E': return 'Pagadero a 30 días';
          case 'F': return 'Pagadero a 45 días';
          case 'G': return 'Pagadero a 60 días';
          case 'H': return 'Pagadero a 90 días';
          default: return 'Por definir';
        }
      };// End setPaymentRule
      $rootScope.menu = 'purchase-order';
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        // Validar almacén central
        if (!$scope.currentUser.isMain) {
          $state.go('admin');
        }
      });// End $watch.currentUser
    }
  ])
  /**
   * @description Controlador para la lista de ordenes de compra.
   */
  .controller('PurchaseOrdersList', [
    '$rootScope',
    '$scope',
    'PurchaseOrder',
    function($rootScope, $scope, PurchaseOrder) {
      // Variables generales
      // Objeto de filtro para mostrar los datos
      var poFilter = {
        include: [
          'provider',
          {relation: 'batches', scope: {
            include: 'product'}}],
        order: ['purchaseDate DESC', 'number DESC'],
        where: {}};
      // Funciones generales
      /**
       * @name deletePurchaseOrder
       * @description Elimina una orden de compra por su Id.
       * @param {string} purchaseOrderId Identificador de la orden de compra.
       */
      function deletePurchaseOrder(purchaseOrderId) {
        PurchaseOrder.deleteById({id: purchaseOrderId})
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
      }// End deletePurchaseOrder
      /**
       * @name getPurchaseOrders
       * @description Recupera las ordenes de compra de acuerdo a los valores
       * del filtro
       */
      function getPurchaseOrders() {
        PurchaseOrder.find({filter: poFilter})
          .$promise
          .then(
            function(purchaseOrders) {
              $scope.busy = false;
              $scope.purchaseOrders = purchaseOrders;
              _.each($scope.purchaseOrders, function(po) {
                var total = 0;
                var inserts = 0;
                _.each(po.batches, function(b) {
                  total += b.stockSize;
                  inserts += b.stockCount;
                });
                po.inserts = inserts;
                if (inserts > 0 && total > 0) {
                  po.progress = parseFloat(((inserts * 100) / total).toFixed(2));
                } else {
                  po.progress = 0;
                }
              });
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getPurchaseOrders
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de ordenes
       * de compra
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = poFilter.where;
        PurchaseOrder.count({where: poFilter.where || {}})
          .$promise
          .then(function (count) {
            if (poFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      };// End Recalculate Count And Reload
      /**
       * @name redefineWhereFilter
       * @description Actualiza el filtro para mostrar las ordenes de compra.
       */
      function redefineWhereFilter() {
        poFilter.where = {};
        if ($scope.formFilters.status && $scope.formFilters.purchaseDate) {
          poFilter.where.and = [];
        }
        if ($scope.formFilters.status) {
          var tmp = undefined;
          // Definir valor del status
          if ($scope.formFilters.status === 'all') {
            tmp = {status: {neq: 'all'}};
          } else {
            tmp = {status: $scope.formFilters.status};
          }
          if (poFilter.where.and) {
            poFilter.where.and.push(tmp);
          } else {
            poFilter.where = tmp;
          }
        }
        if ($scope.formFilters.purchaseDate) {
          var date = $scope.formFilters.purchaseDate.split('/');
          var fullDate = date[2] + '-' + date[1] + '-' + date[0];
          var tmp = {purchaseDate: {gte: fullDate}};
          if (poFilter.where.and) {
            poFilter.where.and.push(tmp);
          } else {
            poFilter.where = tmp;
          }
        }
        recalculateCountAndReload();
      }// End redefineWhereFilter
      // Variables del $scope
      // Objeto de ordenes de compra
      $scope.purchaseOrders = {};
      // Objeto para etiquetas
      $scope.estado = {
        open: 'abierta',
        closed: 'cerrada'
      };
      // Objeto estatus de la orden de compra
      $scope.purchaseStatus = [
        {label: 'Todas', tag: 'all'},
        {label: 'Abiertas', tag: 'open'},
        {label: 'Cerradas', tag: 'closed'}];
      // Valores inciales de los filtros
      $scope.formFilters = {
        status: 'open'};
      //
      $scope.busy = true;
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        poFilter = _.extend(poFilter, $scope.pagination.filter);
        getPurchaseOrders();
      };// End reloadData
      /**
       * @name delete
       * @description Presenta un aviso de eliminación de una orden de compra.
       * @param {object} purchaseOrder Objeto de orden de compra.
       */
      $scope.delete = function(purchaseOrder) {
        $scope.showModal('fa-warning',
          'Eliminar orden de compra',
          '<p>¿Desea eliminar la Orden de compra <b>' + purchaseOrder.number + '</b>?</p>' + 
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            deletePurchaseOrder(purchaseOrder.id);
          });
      }; //End delete
      /**
       * @name toggleStatus
       * @description Cambia el valor del estatus de la orden, de abierta a
       * cerrada y viceversa
       * @param {object} purchaseOrder Instancia de la orden de compra
       */
      $scope.toggleStatus = function(purchaseOrder) {
        var status = 'open';
        if (purchaseOrder.status === 'open') {
          status = 'closed';
        }
        PurchaseOrder.prototype$patchAttributes({
          id: purchaseOrder.id},
          {status: status})
          .$promise
          .then(
            function(response) {
              purchaseOrder.status = status;
              recalculateCountAndReload();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      };// End toggleStatus
      // Watch select de status
      $scope.$watch('formFilters.status', function(status) {
        if (!status) return;
        $scope.busy = true;
        redefineWhereFilter();
      });// End $watch formFilters.status
      // Watch datePicker
      $scope.$watch('formFilters.purchaseDate', function(purchaseDate) {
        if (!purchaseDate) return;
        $scope.busy = true;
        redefineWhereFilter();
      });// End $watch formFilters.purchaseDate
      // Código principal
      recalculateCountAndReload();
      if ($scope.return.data) {
        $scope.return.data = {};
      }
    }
  ])// End PurchaseOrdersList
  /**
   * @description Controlador para registro/actualización de las ordenes de compra
   */
  .controller('PurchaseOrderForm', [
    '$scope',
    '$state',
    'FileUploader',
    'Billing',
    'PurchaseOrder',
    function($scope, $state, FileUploader, Billing, PurchaseOrder) {
      // Variables generales
      var dlrs = 18.85;
      // Objeto de filtro para mostrar los datos
      var poFilter = {where: {class: ''}, order: ['name']};
      // Objeto File-uploader
      var uploader = $scope.uploader = new FileUploader({
        scope: $scope,
        removeAfterUpload: true,
        headers: {Authorization: ''},
        formData: []
      });
      // Filtro para el File-uploader
      uploader.filters.push({
        name: 'syncFilter',
        fn: function(item, options) {
          return item.type === 'application/pdf';
        }
      });
      // Handlers para el File-uploader
      uploader.onAfterAddingFile = function(item) {
        console.info('After adding a file', item);
      };
      // --------------------
      uploader.onAfterAddingAll = function(items) {
        console.info('After adding all files', items);
      };
      // --------------------
      uploader.onWhenAddingFileFailed = function(item, filter, options) {
        console.info('When adding a file failed', item);
        $scope.notify('Tipo de archivo invalido, no es un archivo PDF.');
        uploader.queue.length = 0;
        $('#archiv').val(null);
        $('#archiv').addClass('is-invalid');
      };
      // --------------------
      uploader.onBeforeUploadItem = function(item) {
        console.info('Before upload', item);
      };
      // --------------------
      uploader.onProgressItem = function(item, progress) {
        console.info('Progress: ' + progress, item);
      };
      // --------------------
      uploader.onProgressAll = function(progress) {
        console.info('Total progress: ' + progress);
      };
      // --------------------
      uploader.onSuccessItem = function(item, response, status, headers) {
        console.info('Success', response, status, headers);
        $scope.$broadcast('uploadCompleted', item);
      };
      // --------------------
      uploader.onErrorItem = function(item, response, status, headers) {
        console.info('Error', response, status, headers);
        $scope.notify('Error: No fue posible adjuntar el archivo');
      };
      // --------------------
      uploader.onCancelItem = function(item, response, status, headers) {
        console.info('Cancel', response, status);
      };
      // --------------------
      uploader.onCompleteItem = function(item, response, status, headers) {
        console.info('Complete', response, status, headers);
      };
      // --------------------
      uploader.onCompleteAll = function() {
        console.info('Complete all');
      };
      // Funciones generales
      /**
       * @name createPurchase
       * @description Crea un nuevo registro de Purchase Order.
       */
      function createPurchase() {
        $scope.busy = true;
        PurchaseOrder.create($scope.purchaseOrder)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            uploadFile(response.id);
            $scope.notify('Registro creado satisfactoriamente.',
              'success');
            $scope.return.data = {};
            $state.go('admin.purchase-order.batch', {purchaseId: response.id});
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End createPurchase
      /**
       * @name getCompanies
       * @description Recupera las compañias registradas.
       */
      function getCompanies() {
        poFilter.where.class = 'company';
        Billing.find({filter: poFilter})
          .$promise
          .then(
            function(companies) {
              $scope.companies = companies
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getCompanies
      /**
       * @name getProviders
       * @description Recupera los proveedores registrados.
       */
      function getProviders() {
        poFilter.where.class = 'provider';
        Billing.find({filter: poFilter})
          .$promise
          .then(
            function(providers) {
              $scope.providers = providers;
              getCompanies();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getProviders
      /**
       * @name getPurchaseOrder
       * @description Recupera los datos de una orden de compra.
       * @param {string} purchaseId Identificador de la orden de compra.
       */
      function getPurchaseOrder(purchaseId) {
        PurchaseOrder.findById({id: purchaseId})
          .$promise
          .then(
            function (purchaseOrder) {
              $scope.purchaseOrder = purchaseOrder;
              if (purchaseOrder.currency !== 'pesos') {
                dlrs = purchaseOrder.currencyExchange;
              }
              $scope.purchaseOrder.purchaseDate =
                $scope.getDateFormat(purchaseOrder.purchaseDate.substr(0, 10), 'DD/MM/YYYY');
              // Prevenir que se edite una orden cerrada
              if (purchaseOrder.finishedDate) {
                $state.go('admin.purchase-order.batch', {purchaseId: $state.params.purchaseId});
              }
              // Actualizar empresa o proveedor
              if ($scope.return.data.idProvider) {
                $scope.purchaseOrder.idProvider = $scope.return.data.idProvider;
              }
              if ($scope.return.data.idCompany) {
                $scope.purchaseOrder.idCompany = $scope.return.data.idCompany;
              }
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getPurchaseOrder
      /**
       * @name makeOrderNumber
       * @description Genera el número de la orden de compra.
       */
      function makeOrderNumber() {
        var today = moment().format('YYYYMMDD');
        var orderFilter = {
          limit: 1,
          where: {number: {like: today + '%'}},
          order: ['number DESC']};
        PurchaseOrder.find({filter: orderFilter})
          .$promise
          .then(
            function(iOrder) {
              var num = 1;
              var tmp = '00';
              if (iOrder.length) {
                num = iOrder[0].number.substr(-3);
                num = parseInt(num) + 1;
              }
              tmp += num;
              $scope.purchaseOrder.number = today + tmp.substr(-3);
            });
      }// End makeOrderNumber
      /**
       * @name setPayDay
       * @description Devuelve la fecha de pago según la condición del mismo.
       * @param {date} payDay Fecha de inicial del pago.
       * @param {string} addRule Regla de pago.
       */
      function setPayDay(payDay, addRule) {
        var addDays = 0;
        switch (addRule) {
          case 'B': addDays = 7; break;
          case 'C': addDays = 15; break;
          case 'D': addDays = 21; break;
          case 'E': addDays = 30; break;
          case 'F': addDays = 45; break;
          case 'G': addDays = 60; break;
          case 'H': addDays = 90; break;
        }
        return moment(payDay).add(addDays, 'days');
      }// End setPayDay
      /**
       * @name updatePurchase
       * @description Actualiza un registro de PurchaseOrder.
       */
      function updatePurchase() {
        $scope.busy = true;
        PurchaseOrder.prototype$patchAttributes({
            id: $scope.purchaseOrder.id},
            $scope.purchaseOrder)
          .$promise
          .then(
            function(response) {
              $scope.busy = false;
              uploadFile(response.id);
              $scope.notify('Registro actualizado satisfactoriamente.',
                'success');
              $scope.return.data = {};
              $state.go('admin.purchase-order.batch', {purchaseId: response.id});
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End updatePurchase
      /**
       * @name uploadFile
       * @description Adjunta un archivo a los datos de la orden de compra.
       * @param {string} orderId Identificador de la orden de compra.
       */
      function uploadFile(orderId) {
        if (uploader.queue.length && orderId) {
          uploader.queue[0].url = '/api/PurchaseOrders/' + orderId + '/addFile';
          uploader.queue[0].formData = [{idPurchaseOrder: orderId}];
          uploader.uploadAll();
        }
      }// End uploadFile
      // Variables del $scope
      // Objeto purchase order
      $scope.purchaseOrder = {
        currency: 'pesos',
        currencyExchange: 1.00,
        number: makeOrderNumber(),
        status: 'open',
        subtotal: 0};
      // Arrelgo de objetos de condiciones de pago
      $scope.paymentRules = [];
      // Arreglo de objetos de metodos de pagos
      $scope.paymentMethods = [
        {tag: 'unknown', name: 'Desconocido', rules: [
          {tag: 'Z', name: 'Por definir'}]},
        {tag: 'cash', name: 'En efectivo', rules: [
          {tag: 'A', name: 'Pago inmediato'}]},
        {tag: 'credit', name: 'A crédito', rules: [
          {tag: 'B', name: 'Pagadero a 7 días'},
          {tag: 'C', name: 'Pagadero a 15 días'},
          {tag: 'D', name: 'Pagadero a 21 días'},
          {tag: 'E', name: 'Pagadero a 30 días'},
          {tag: 'F', name: 'Pagadero a 45 días'},
          {tag: 'G', name: 'Pagadero a 60 días'},
          {tag: 'H', name: 'Pagadero a 90 días'}]}];
      //
      $scope.busy = true;
      // Funciones del $scope
      /**
       * @name save
       * @description Valida y envía el formulario para su procesamiento.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        // Validación del formulario
        if (!$scope.purchaseOrder.idProvider) {
          errorCount++;
        }
        if (!$scope.purchaseOrder.paymentMethod) {
          errorCount++;
        }
        if (!$scope.purchaseOrder.paymentRule) {
          errorCount++;
        }
        if (!$scope.purchaseOrder.purchaseDate) {
          errorCount++;
        }
        if (!$scope.purchaseOrder.idCompany) {
          errorCount++;
        }
        // Formulario con error
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        var tmp = $scope.purchaseOrder.purchaseDate.split('/');
        $scope.purchaseOrder.purchaseDate = tmp[2] + '-' + tmp[1] + '-' + tmp[0];
        $scope.purchaseOrder.paymentDate =
          setPayDay($scope.purchaseOrder.purchaseDate, $scope.purchaseOrder.paymentRule);
        if ($scope.purchaseOrder.id) {
          updatePurchase();
        } else {
          $scope.purchaseOrder.idUser = $scope.currentUser.id;
          $scope.purchaseOrder.idWarehouse = $scope.currentUser.idWarehouse;
          createPurchase();
        }
      };// End save
      /**
       * @name unsetFile
       * @description Función que elimina un archivo de un input[type=file].
       */
      $scope.unsetFile = function() {
        uploader.queue.length = 0;
        $('#archiv').val(null);
        $('#archiv').removeClass('is-invalid');
        if ($scope.purchaseOrder.file) {
          $scope.purchaseOrder.file = null;
        }
      }// End unsetFile
      // Watchers del $scope
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        $scope.busy = false;
        uploader.headers.Authorization = $scope.currentUser.tokenId;
      });// End $watch.currentUser
      //
      $scope.$watch('purchaseOrder.currency', function(currency) {
        if (!currency) return;
        
        if (currency === 'pesos') {
          $scope.purchaseOrder.currencyExchange = 1.00;
        }
        else {
          $scope.purchaseOrder.currencyExchange = dlrs;
        }
      });// End $watch
      //
      $scope.$watch('purchaseOrder.paymentMethod', function(method) {
        if (!method) return;
        $scope.paymentRules.length = 0;
        var m = _.find($scope.paymentMethods, function(pM) {
          return pM.tag === method;
        });
        $scope.paymentRules = m.rules;
      });// End $watch
      // Código principal
      getProviders();
      if ($state.params.purchaseId) {
        getPurchaseOrder($state.params.purchaseId);
      }
      if ($scope.return.data.idProvider) {
        $scope.purchaseOrder.idProvider = $scope.return.data.idProvider;
      }
      if ($scope.return.data.idCompany) {
        $scope.purchaseOrder.idCompany = $scope.return.data.idCompany;
      }
    }
  ])
  /**
   * @description Controlador para registro/actualización de lotes.
   */
  .controller('PurchaseOrderBatchs', [
    '$scope',
    '$state',
    '$interval',
    'FileUploader',
    'Batch',
    'Brand',
    'Color',
    'ProductType',
    'PurchaseOrder',
    'Stock',
    function($scope, $state, $interval, FileUploader, Batch, Brand, Color, ProductType, PurchaseOrder, Stock) {
      // Variables generales
      var timer = $interval(getPurchaseOrder, 3000, 0, true, $state.params.purchaseId);
      // Objeto File-uploader
      var uploader = $scope.uploader = new FileUploader({
        scope: $scope,
        removeAfterUpload: true,
        headers: {Authorization: ''},
        formData: []
      });
      // Filtro para el File-uploader
      uploader.filters.push({
        name: 'syncFilter',
        fn: function(item, options) {
          return item.type === 'text/csv' || item.type === 'application/vnd.ms-excel' || item.type === 'text/txt';
        }
      });
      // Handlers para el File-uploader
      uploader.onAfterAddingFile = function(item) {
        console.info('After adding a file', item);
      };
      // --------------------
      uploader.onAfterAddingAll = function(items) {
        console.info('After adding all files', items);
      };
      // --------------------
      uploader.onWhenAddingFileFailed = function(item, filter, options) {
        console.info('When adding a file failed', item);
        $scope.notify('Tipo de archivo invalido, no es un archivo CSV.');
        uploader.queue.length = 0;
        $('#archiv').val(null);
        $('#archiv').addClass('is-invalid');
      };
      // --------------------
      uploader.onBeforeUploadItem = function(item) {
        console.info('Before upload', item);
      };
      // --------------------
      uploader.onProgressItem = function(item, progress) {
        console.info('Progress: ' + progress, item);
      };
      // --------------------
      uploader.onProgressAll = function(progress) {
        console.info('Total progress: ' + progress);
      };
      // --------------------
      uploader.onSuccessItem = function(item, response, status, headers) {
        console.info('Success', response, status, headers);
        $scope.$broadcast('uploadCompleted', item);
      };
      // --------------------
      uploader.onErrorItem = function(item, response, status, headers) {
        console.info('Error', response, status, headers);
        $scope.notify('Error: No fue posible adjuntar el archivo');
        $scope.busy = false;
      };
      // --------------------
      uploader.onCancelItem = function(item, response, status, headers) {
        console.info('Cancel', response, status);
      };
      // --------------------
      uploader.onCompleteItem = function(item, response, status, headers) {
        console.info('Complete', response, status, headers);
        if (status === 404 || response.error) {
          $scope.notify('Error: ' + response.error.message);
          $scope.busy = false;
          uploader.queue = [];
          return;
        }
        uploader.queue = [];
        _.each(response, function(res) {
          if (res.isError) {
            $scope.errors.push(res);
          } else {
            $scope.currentStock.stocks.push(res);
          }
        });
        $scope.notify('Archivo integrado.', 'success');
      };
      // --------------------
      uploader.onCompleteAll = function() {
        console.info('Complete all');
        $scope.busy = false;
      };
      // Funciones generales
      /**
       * @name createBatch
       * @description Crea un nuevo registro de Batch.
       */
      function createBatch() {
        $scope.busy = true;
        Batch.create($scope.currentBatch)
          .$promise
          .then(
            function(response) {
              $scope.busy = false;
              $scope.notify('Registro creado satisfactoriamente.',
                'success');
              setEmptyForm();
              getPurchaseOrder($state.params.purchaseId);
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End createBatch
      /**
       * @name deleteBatch
       * @description Elimina un lote de la orden de compra por su id.
       * @param {string} batchId Identificador del lote (Batch).
       */
      function deleteBatch(batchId) {
        Batch.deleteById({id: batchId})
          .$promise
          .then(
            function(response) {
              $scope.notify('Registro eliminado satisfactoriamente.',
                'success');
              getPurchaseOrder($state.params.purchaseId);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End deleteBatch
      /**
       * @name deleteStock
       * @description Elimina un stock de la orden de compra por su id.
       * @param {string} stockId Identificador del stock.
       */
      function deleteStock(stockId) {
        Stock.deleteById({id: stockId})
          .$promise
          .then(function(response) {
            $scope.notify('Registro eliminado satisfactoriamente.',
              'success');
            var idx = 0;
            _.each($scope.currentStock.stocks, function(stock, index) {
              if (stock.id === stockId) {
                idx = index;
              }
            });
            $scope.currentStock.stocks.splice(idx, 1);
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End deleteStock
      /**
       * @name getBrands
       * @description Recupera las marcas con sus respectivos modelos.
       */
      function getBrands() {
        var bFilter = {
          include: {
            relation: 'models', scope: {
              order: ['name']}
          },
          order: ['name']
        };
        Brand.find({filter: bFilter})
          .$promise
          .then(
            function(brands) {
              $scope.brands = brands;
              if ($scope.return.data.idBrand) {
                $scope.currentBatch.product.idBrand = $scope.return.data.idBrand;
              }
              if ($scope.return.data.idProductModel) {
                $scope.currentBatch.product.idProductModel = $scope.return.data.idProductModel;
              }
              getProductTypes();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getBrands
      /**
       * @name getColors
       * @description Recupera la lista de colores.
       */
      function getColors() {
        Color.find({filter: {order: ['index']}})
          .$promise
          .then(
            function(colors) {
              $scope.colors = colors;
              if ($scope.return.data.idColor) {
                $scope.currentBatch.product.idColor = $scope.return.data.idColor;
              }
              getBrands();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getColors
      /**
       * @name getProductTypes
       * @description Recupera los tipos de productos con sus respectivas variantes.
       */
      function getProductTypes() {
        var ptFilter = {
          include: {
            relation: 'variant', scope: {
              include: {
                relation: 'options', scope: {
                  order:['index']}}}}};
        ProductType.find({filter: ptFilter})
          .$promise
          .then(
            function(productTypes) {
              $scope.productTypes = productTypes;
              if ($scope.return.data.idProductType) {
                $scope.currentBatch.product.idProductType = $scope.return.data.idProductType;
              }
              if ($scope.return.data.idVariantOption) {
                $scope.currentBatch.product.idVariantOption = $scope.return.data.idVariantOption;
              }
            },
            function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End getProductTypes
      /**
       * @name getPurchaseOrder
       * @description Recupera los datos de la orden de compra incluido los productos y su stock.
       * @param {string} purchaseId Identificador de la orden de compra.
       */
      function getPurchaseOrder(purchaseId) {
        var poFilter = {
          include: ['provider', 'company' , {relation: 'batches', scope: {
            include: ['product', {relation: 'stocks', scope: {
              order: ['date DESC']}}],
            order: ['date DESC']}}]};
        PurchaseOrder.findById({id: purchaseId, filter: poFilter})
          .$promise
          .then(
            function(purchaseOrder) {
              $scope.purchaseOrder = purchaseOrder;
              $scope.purchaseOrder.stockCount = 0;
              $scope.purchaseOrder.stockSize = 0;
              _.each(purchaseOrder.batches, function(batch) {
                $scope.purchaseOrder.stockCount += batch.stockCount;
                $scope.purchaseOrder.stockSize += batch.stockSize;
              });
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getPurchaseOrder
      /**
       * @name setEmptyForm
       * @description Vacia el formulario reiniciando el objeto currentBatch
       */
      function setEmptyForm() {
        $scope.currentBatch = {
          product: {}};
        $scope.formFlg = true;
        $('form.needs-validation').removeClass('was-validated');
      }// End setEmptyForm
      /**
       * @name updateBatch
       * @description Actualiza un registro de Batch.
       */
      function updateBatch() {
        $scope.busy = true;
        Batch.prototype$patchAttributes({
          id: $scope.currentBatch.id},
          $scope.currentBatch)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            $scope.notify('Registro actualizado satisfactoriamente.',
              'success');
            setEmptyForm();
            getPurchaseOrder($state.params.purchaseId);
          },
          function(err) {
            $scope.busy = false;
            setEmptyForm();
            console.log(err);
            $scope.notify(err.data.error.message + 
              ' El producto no fue actualizado.');
          });
      }// End updateBatch
      /**
       * @name updateCost
       * @description Actualiza el valor del lote en el formulario.
       */
      function updateCost() {
        var discount = 0;
        $scope.currentBatch.providerSupport =
          parseFloat(($scope.currentBatch.cost *
            ($scope.purchaseOrder.provider.discount / 100)).toFixed(2));
        $scope.currentBatch.costWithTax = 
          parseFloat((($scope.currentBatch.cost -
            $scope.currentBatch.providerSupport) * 1.16).toFixed(2));
        if ($scope.currentBatch.brandSupport) {
          discount += $scope.currentBatch.brandSupport;
        }
        if ($scope.currentBatch.additionalSupport) {
          discount += $scope.currentBatch.additionalSupport;
        }
        $scope.currentBatch.modifiedCost =
          parseFloat(($scope.currentBatch.stockSize *
            ($scope.currentBatch.costWithTax - discount)).toFixed(2));
      }// End updateCost
      /**
       * @name uploadFile
       * @description Adjunta un archivo a los datos de la orden de compra.
       */
      function uploadFile(batchId) {
        if (uploader.queue.length && batchId) {
          $scope.errors.length = 0;
          uploader.queue[0].url = '/api/Batches/' + batchId + '/importFile';
          uploader.queue[0].formData = [
            {idBatch: batchId},
            {idUser: $scope.currentUser.id},
            {idWarehouse: $scope.currentUser.idWarehouse}];
          uploader.uploadAll();
        }
      }// End uploadFile
      // Variables del $scope
      // Flags
      $scope.busy = true;
      $scope.stockView = false;
      $scope.formFlg = true;
      if ($scope.return.data.idProductModel)
        $scope.formFlg = false;
      $scope.errors = [];
      // Objeto de las variantes.
      $scope.variant = {
        name: 'Variante',
        id: undefined,
        options: []};
      // Objeto de los modelos.
      $scope.models = [];
      // Objeto para los campos del formulario.
      $scope.currentBatch = {
        product: {}};
      // Objeto para mostrar los IMEIs
      $scope.currentStock = {};
      // Bandera para el formulario del modelo
      $scope.return.productFlag = $scope.return.from;
      $scope.return.paramsProductFlag = $scope.return.paramsFrom;
      // Funciones del $scope
      /**
       * @name clean
       * @description Reinicia el objeto currentBatch.
       */
      $scope.clean = function() {
        setEmptyForm();
      };// End clean
      /**
       * @name delete
       * @description Presenta un aviso de eliminación de un producto en la orden de compra.
       * @param {object} batch Objeto de lote.
       */
      $scope.delete = function(batch) {
        $scope.showModal('fa-warning',
          'Eliminar producto de la orden de compra',
          '<p>¿Desea eliminar el producto <b>' + batch.product.name + 
          '</b> de la Orden de compra?</p>' + 
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            deleteBatch(batch.id)
          });
      };// End delete
      /**
       * @name drop
       * @description Presenta un aviso de eliminación de un equipo en la orden de compra.
       * @param {object} stock Equipo de la orden de compra.
       */
      $scope.drop = function(stock) {
        $scope.showModal('fa-warning',
        'Eliminar equipo de la orden de compra',
        '<p>¿Desea quitar el equipo <b>' + stock.IMEI + 
        '</b> de la Orden de compra?</p>' + 
        '<p>Esta acción no puede deshacerse.</p>',
        {},
        function() {
          deleteStock(stock.id)
        });
      };// End drop 
      /**
       * @name finish
       * @description Declara la orden de compra como terminada.
       * @param {object} purchaseOrder Objeto de la orden de compra.
       */
      $scope.finish = function(purchaseOrder) {
        var finishedDate = moment().utc().format();
        $scope.busy = true;
        PurchaseOrder.prototype$patchAttributes({
          id: purchaseOrder.id},
          {finishedDate: finishedDate, status: 'closed'})
          .$promise
          .then(
            function(response) {
              getPurchaseOrder($state.params.purchaseId);
              $scope.busy = false;
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      };// End finish
      /**
       * @name load
       * @description Carga los datos de un lote al formulario de captura.
       * @param {object} batch Objeto del lote.
       */
      $scope.load = function(batch) {
        $scope.formFlg = false;
        // Lote
        $scope.currentBatch.id = batch.id;
        $scope.currentBatch.stockSize = batch.stockSize;
        $scope.currentBatch.cost = batch.cost;
        $scope.currentBatch.providerSupport = batch.providerSupport;
        $scope.currentBatch.brandSupport = batch.brandSupport;
        $scope.currentBatch.additionalSupport = batch.additionalSupport;
        $scope.currentBatch.isPrepaid = batch.isPrepaid;
        // Producto
        $scope.currentBatch.product.idBrand = batch.product.idBrand;
        $scope.currentBatch.product.idProductModel = batch.product.idProductModel;
        $scope.currentBatch.product.idColor = batch.product.idColor;
        $scope.currentBatch.product.idProductType = batch.product.idProductType;
        $scope.currentBatch.product.idProductVariant = batch.product.idProductVariant;
        $scope.currentBatch.product.idVariantOption = batch.product.idVariantOption;
      };// End load
      /**
       * @name save
       * @description Valida y envía le formulario para su procesamiento.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        // Validación del formulario
        if (!$scope.currentBatch.product.idProductType) {
          errorCount++;
        }
        if (!$scope.currentBatch.product.idBrand) {
          errorCount++;
        }
        if (!$scope.currentBatch.product.idProductModel) {
          errorCount++;
        }
        if (!$scope.currentBatch.product.idColor) {
          errorCount++;
        }
        if (!$scope.currentBatch.product.idVariantOption) {
          errorCount++;
        }
        if (!$scope.currentBatch.stockSize) {
          errorCount++;
        }
        if (!$scope.currentBatch.cost) {
          errorCount++;
        }
        // Formulario con error
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        $scope.currentBatch.idPurchaseOrder = $scope.purchaseOrder.id;
        $scope.currentBatch.product.idProductVariant = $scope.variant.id;
        delete $scope.currentBatch.costWithTax;
        delete $scope.currentBatch.modifiedCost;
        if ($scope.currentBatch.id) {
          updateBatch();
        } else {
          createBatch();
        }
      };// End save
      /**
       * @name toggleView
       * @description Cambia entre la vista del formulario y la de los números de serie del stock.
       */
      $scope.toggleView = function(batch) {
        if (typeof batch === 'object') {
          $scope.currentStock = batch;
          $scope.stockView = true;
        } else {
          $scope.currentStock = {};
          $scope.stockView = false;
          getPurchaseOrder($state.params.purchaseId);
        }
      };// End toggleView
      /**
       * @name uploadFile
       * @description Adjunta un archivo al lote de producto.
       */
      $scope.uploadFile = function() {
        $scope.busy = true;
        uploadFile($scope.currentStock.id);
      }; //End uploadFile
      /**
       * @name unsetFile
       * @description Función que elimina un archivo de un input[type=file].
       */
      $scope.unsetFile = function() {
        uploader.queue.length = 0;
        $('#archiv').val(null);
        $('#archiv').removeClass('is-invalid');
      };// End unsetFile
      // Watchers del $scope
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        $scope.busy = false;
        uploader.headers.Authorization = $scope.currentUser.tokenId;
      });// End $watch.currentUser
      // Watch brand select
      $scope.$watch('currentBatch.product.idBrand', function(brand) {
        if (!brand) {
          return $scope.models = [];
        }
        _.each($scope.brands, function(b) {
          if (b.id === brand) {
            $scope.models = b.models;
          }
        });
      });// End $watch brand select
      // Watch productType select
      $scope.$watch('currentBatch.product.idProductType', function(productType) {
        if (!productType) {
          $scope.variant.name = 'Variante';
          $scope.variant.id = undefined;
          $scope.variant.options = [];
          return;
        }
        _.each($scope.productTypes, function(pt) {
          if (pt.id === productType) {
            $scope.variant.name = pt.variant.name;
            $scope.variant.id = pt.variant.id;
            $scope.variant.options = pt.variant.options;
          }
        });
      });// End $watch productType select
      // Watch costo unitario input
      $scope.$watch('currentBatch.stockSize', function(size) {
        if (!size) return;
        updateCost();
      });
      // Watch costo unitario input
      $scope.$watch('currentBatch.cost', function(cost) {
        if (!cost) return;
        updateCost();
      });
      // Watch costo unitario input
      $scope.$watch('currentBatch.brandSupport', function(support) {
        if (support === undefined) return;
        updateCost();
      });
      // Watch costo unitario input
      $scope.$watch('currentBatch.additionalSupport', function(support) {
        if (support === undefined) return;
        updateCost();
      });
      // Watcher dedicado para cuando se destruye $scope
      $scope.$on('$destroy', function() {
        if (timer) {
          $interval.cancel(timer);
        }
      });// End $on $destroy
      // Código principal
      getColors();
      if ($state.params.purchaseId) {
        getPurchaseOrder($state.params.purchaseId);
      }
    }
  ])
  /**
   * 
   */
  .controller('PurchaseOrdersStatus', [
    '$rootScope',
    '$scope',
    'PurchaseOrder',
    function($rootScope, $scope, PurchaseOrder) {
      // Filtro para mostrar datos
      var poFilter = {
        include: ['provider', {relation: 'batches', scope: {
          include: 'product'}}],
        order: ['purchaseDate DESC'],
        where: {}};
/**************************** Funciones  generales ****************************/
      /**
       * @name getPurchaseOrders
       * @description Recupera las ordenes de compra registradas en el sistema
       */
      function getPurchaseOrders() {
        PurchaseOrder.find({filter: poFilter})
          .$promise
          .then(
            function(purchaseOrders) {
              $scope.total = 0;
              $scope.purchaseOrders = purchaseOrders;
              _.each($scope.purchaseOrders, function(po) {
                var millisecondsPerDay = 1000 * 60 * 60 * 24;
                var one = new Date().getTime();
                var two = new Date(po.paymentDate).getTime();
                var days = (two - one) / millisecondsPerDay;
                po.days = Math.floor(days);
                $scope.total += po.total;
              });
            },
            function(err) {
              console.log(err);
              $.notify(err.data.error.message, {
                hideDuration: 1000,
                showDuration: 200,
                position: 'right bottom'});
            });
      }// End getPurchaseOrders
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de ordenes
       * de compra
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = poFilter.where;
        PurchaseOrder.count({where: poFilter.where || {}})
          .$promise
          .then(function (count) {
            if (poFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      };// End Recalculate Count And Reload
/******************************************************************************/
      // Objeto de ordenes de compra
      $scope.purchaseOrders = {};
      // Objeto estatus de la orden de compra
      $scope.paymentStatus = [
        {label: 'Todas', tag: 'all'},
        {label: 'Pagadas', tag: 'true'},
        {label: 'Por pagar', tag: 'false'}];
      //
      $scope.paymentRules = [
        {label: 'Todos', tag: 'all'},
        {label: 'Pago inmediato', tag: 'A'},
        {label: 'Pagadero a 7 días', tag: 'B'},
        {label: 'Pagadero a 15 días', tag: 'C'},
        {label: 'Pagadero a 21 días', tag: 'D'},
        {label: 'Pagadero a 30 días', tag: 'E'},
        {label: 'Pagadero a 45 días', tag: 'F'},
        {label: 'Pagadero a 60 días', tag: 'G'},
        {label: 'Pagadero a 90 días', tag: 'H'},
        {label: 'Por definir', tag: 'Z'}];
      // Valores inciales de los filtros
      $scope.formFilters = {
        status: $scope.paymentStatus[2],
        rule: $scope.paymentRules[0]
      };
      //
      $scope.total = 0;
/**************************** Funciones del $scope ****************************/
      /**
       * @name reloadData
       * @description Cargar todos los usuarios registrados
       */
      $rootScope.reloadData = function() {
        poFilter = _.extend(poFilter, $scope.pagination.filter);
        getPurchaseOrders();
      };// End reloadData
      /**
       * @name toggleStatus
       * @description Cambia el valor del estatus de la orden, de abierta a
       * cerrada y viceversa
       * @param {object} purchaseOrder Instancia de la orden de compra
       */
      $scope.toggleStatus = function(purchaseOrder) {
        var status = true;
        if (purchaseOrder.paymentStatus === true) {
          status = false;
        }
        PurchaseOrder.prototype$patchAttributes({
          id: purchaseOrder.id},
          {paymentStatus: status})
          .$promise
          .then(
            function(response) {
              purchaseOrder.paymentStatus = status;
              recalculateCountAndReload();
            },
            function(err) {
              console.log(err);
              $.notify(err.data.error.message, {
                hideDuration: 1000,
                showDuration: 200,
                position: 'right bottom'});
            });
      };// End toggleStatus
      // Watch select de status
      $scope.$watch('formFilters.status.tag', function(status) {
        if (!status) return;
        var tmp = undefined;
        // Definir valor del status
        if (status === 'all') {
          tmp = {neq: null};
        } else if (status === 'true') {
          tmp = true;
        } else {
          tmp = false;
        }
        // Crear condición where
        if (poFilter.where.and) {
          poFilter.where.and[0].paymentStatus = tmp;
        } else {
          poFilter.where = {
            and: [{paymentStatus: tmp}]};
        }
        recalculateCountAndReload();
      });// End $watch
      // Watch select de status
      $scope.$watch('formFilters.rule.tag', function(rule) {
        if (!rule) return;
        var tmp = undefined;
        // Definir valor del status
        if (rule === 'all') {
          tmp = {neq: 'all'};
        } else {
          tmp = rule;
        }
        // Crear condición where
        if (poFilter.where.and[1]) {
          poFilter.where.and[1].paymentRule = tmp;
        } else {
          poFilter.where.and.push({paymentRule: tmp});
        }
        recalculateCountAndReload();
      });// End $watch
      // Watch select de status
      $scope.$watch('formFilters.paymentDate', function(paymentDate) {
        if (!paymentDate) return;

        var date =  paymentDate.split('/');
        var fullDate = date[2] + '-' + date[1] + '-' + date[0];
        var tmp = {gt: fullDate};
        if (date.length === 3) {
          if (poFilter.where.and[2]) {
            poFilter.where.and[2].paymentDate = tmp
          } else {
            poFilter.where.and.push({paymentDate: tmp});
          }
        }
        recalculateCountAndReload();
      });// End $watch
      // getPurchaseOrders();
      // Código principal
      recalculateCountAndReload();
    }
  ]);