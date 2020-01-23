angular.module('systemax')
  .controller('BatchBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      // Código principal
      $rootScope.menu = 'batch';
    }
  ])
  /**
   * @description Controlador para listar los lotes abiertos.
   */
  .controller('BatchList', [
    '$scope',
    '$interval',
    'Batch',
    'PurchaseOrder',
    function($scope, $interval, Batch, PurchaseOrder) {
      // Variables generales
      var timer = $interval(getPurchaseOrders, 3000);
      // Funciones generales
      /**
       * @name getPurchaseOrders
       * @description Recupera las ordenes de compra abiertas para la captura de
       * los stocks.
       */
      function getPurchaseOrders() {
        var orderFilter = {
          include: {
            relation: 'batches', scope: {
              include: {
                relation: 'product', scope: {
                  order: ['name']}}}},
          where: {status: 'open'},
          order: ['purchaseDate DESC']};
        PurchaseOrder.find({filter: orderFilter})
          .$promise
          .then(
            function(purchaseOrders) {
              $scope.orders = purchaseOrders;
              _.each($scope.orders, function(o, i) {
                _.each(o.batches, function(b) {
                  b.name = b.product.name;
                });
                $scope.orders[i].batches = _.sortBy(o.batches, 'name');
              });
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getPurchaseOrders
/******************************************************************************/
      /**
       * @name getBatches
       * @description Recupera los lotes abiertos para la captura del stock.
       */
      function getBatches() {
        var batchesFilter = {
          include: ['product', 'purchaseOrder'],
          order: ['date DESC']};
        Batch.find({filter: batchesFilter})
          .$promise
          .then(
            function(batches) {
              console.log(batches);
              $scope.batches = batches;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getBatches
      //
      $scope.styles = ['primary', 'secondary', 'success',
        'danger', 'warning', 'info', 'dark'];
      $scope.orders;
      $scope.batches;
      // Watcher dedicado para cuando se destruye $scope
      $scope.$on('$destroy', function() {
        if (timer) {
          $interval.cancel(timer);
        }
      });// End $on $destroy
      // Código principal
      // getBatches();
      getPurchaseOrders();
    }
  ])
  /**
   * @description Controlador para registrar un equipo.
   */
  .controller('BatchImei', [
    '$scope',
    '$state',
    'Batch',
    'Product',
    'Stock',
    function($scope, $state, Batch, Product, Stock) {
      // Variables generales
      var positive = document.getElementById('positive');
      var negative = document.getElementById('negative');
      // Funciones generales
      /**
       * @name addToBox
       * @description Agrega un objeto al arreglo de cajas.
       * @param {object} stock Objeto de tipo stock.
       */
      function addToBox(stock) {
        if (!$scope.boxes.length ||
        $scope.boxes[0].stocks.length % $scope.batch.boxSize === 0) {
          $scope.boxes.unshift({stocks: []});
        }
        $scope.boxes[0].stocks.unshift(stock);
        setProgress();
      }// End addToBox
      /**
       * @name createStock
       * @description Crea un nuevo registro de Stock.
       */
      function createStock(stock, cb) {
        var newStock = {
          idBatch: $scope.batch.id,
          idPurchaseOrder: $scope.batch.idPurchaseOrder,
          idProduct: $scope.batch.idProduct,
          idWarehouse: $scope.currentUser.idWarehouse,
          idUser: $scope.currentUser.id,
          IMEI: stock.IMEI,
          cost: 0,
          modifiedCost: 0,
          publicPrice: 0};
        if ($scope.batch.purchaseOrder) {
          newStock.cost = parseFloat(($scope.batch.costWithTax *
            $scope.batch.purchaseOrder.currencyExchange).toFixed(2));
          newStock.modifiedCost = parseFloat(($scope.batch.modifiedCost *
            $scope.batch.purchaseOrder.currencyExchange).toFixed(2));
          newStock.publicPrice = parseFloat(($scope.batch.costWithTax *
            $scope.batch.purchaseOrder.currencyExchange).toFixed(2));
        }
        Stock.create(newStock)
          .$promise
          .then(
            function(response) {
              return cb(null, response);
            },
            function(err) {
              return cb(err);
            });
      }// End createStock
      /**
       * @name deleteAllStock
       * @description Elimina todos los objetos stock registrados y pendientes.
       */
      function deleteAllStock() {
        var tmp = $scope.batch.stocks.slice();
        _.each(tmp, function(stock) {
          if (stock.id) {
            // ...borrar de la base de datos
            deleteStock(stock.id, stock.IMEI);
          } else {
            // ...solo quitarlo del arreglo de captura
            $scope.temp = removeFromArray($scope.temp, {IMEI: stock.IMEI});
            setProgress();
          }
        });
      };// End deleteAllStock
      /**
       * @name deleteImei
       * @description Valida un número de serie para su eliminación.
       * @param {string} imei Número de serie/IMEI para su eliminación.
       */
      function deleteImei(imei) {
        var find = _.find($scope.batch.stocks, function(s) {
          return s.IMEI === imei;
        });
        if (find) {
          deleteStock(find.id, find.IMEI);
        } else {
          $('#imei').prop('disabled', true).focus();
          // ...ya fue registrado en la base de datos
          $scope.showModal('fa-warning',
            'El número de serie/IMEI desconocido',
            '<p><b>El ' + imei + ' no está registrado en este lote</b></p>',
            {hideCancel: true},
            function() {
              //
            });
          negative.play();
        }
      }// End deleteImei
      /**
       * @name deleteStock
       * @description Eliminar un registro del Stock.
       * @param {string} stockId Id del stock.
       */
      function deleteStock(stockId, imei) {
        Stock.deleteById({id: stockId})
          .$promise
          .then(
            function(response) {
              $scope.notify('Registro eliminado satisfactoriamente.',
                'success');
              $scope.batch.stocks = removeFromArray($scope.batch.stocks, {id: stockId});
              $scope.temp = removeFromArray($scope.temp, {IMEI: imei});
              removeFromBox({IMEI: imei});
              setProgress();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End deleteStock
      /**
       * @name getBatch
       * @description Recupera los datos de un lote.
       * @param {string} idBatch Identificador del lote.
       * @param {function} cb Función de callback.
       */
      function getBatch(idBatch, cb) {
        var batchFilter = {
          include: [
            {relation: 'product', scope: {
              fields: ['id', 'name', 'serieLength']
            }}, 'purchaseOrder', {
            relation: 'stocks', scope: {
              order: ['date', 'id DESC'],
              where: {idUser: $scope.currentUser.id},
            }}]
        };
        Batch.findById({id: idBatch, filter: batchFilter},
          function(batch) {
            return cb(null, batch);
          },
          function(err) {
            console.log(err);
            return cb(err);
          });
      }// End getBatch
      /**
       * @name initBoxes
       * @description Organiza el stock del lote en cajas.
       * @param {object} stocks Arreglo con los objetos del stock.
       */
      function initBoxes(stocks) {
        _.each(stocks, function(stock) {
          if (!$scope.boxes.length ||
          $scope.boxes[0].stocks.length % $scope.batch.boxSize === 0) {
            $scope.boxes.unshift({stocks: []});
          }
          $scope.boxes[0].stocks.unshift(stock);
        });
        setProgress();
      }// End initBoxes
      /**
       * @name insertImei
       * @description Valida un número de serie para su registro.
       * @param {string} imei Número de serie/IMEI para su registro.
       */
      function insertImei(imei) {
        $scope.temp.push({IMEI: imei});
        createStock({IMEI: imei}, function(err, stock) {
        if (err) {
          $('#imei').prop('disabled', true).focus();
          // ...ya fue registrado en la base de datos
          $scope.showModal('fa-warning',
            'El número de serie/IMEI repetido',
            '<p><b>' + err.data.error.message + '</b></p>',
            {hideCancel: true},
            function() {
              //
            });
            $scope.temp = removeFromArray($scope.temp, {IMEI: imei});
            negative.play();
          } else {
            $scope.batch.stocks.unshift(stock);
            addToBox(stock);
          }
        });
      }// End insertImei
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
       * @name removeFromBox
       * @description Elimina del arreglo de cajas un stock.
       * @param {object} stock Objeto de tipo stock.
       */
      function removeFromBox(stock) {
        if (!$scope.boxes.length) return;
        var idx = undefined;
        _.each($scope.boxes, function(box, index) {
          box.stocks = removeFromArray(box.stocks, {IMEI: stock.IMEI});
          if (!box.stocks.length) {
            // ...marcar caja vacía
            idx = index;
          }
        });
        if (idx !== undefined) {
          // ...para eliminarla despúes
          $scope.boxes.splice(idx, 1);
        }
      }// End removeFromBox
      /**
       * @name setProgress
       * @description Calcula el progreso del registro del stock.
       */
      function setProgress() {
        if ($scope.batch.stocks.length && $scope.temp.length) {
          // ...si los arrelgos no estan vacíos
          $scope.progress =
            Math.floor(($scope.batch.stocks.length / $scope.temp.length) * 100);
        } else {
          // ...si lo están el progreso es 0
          $scope.progress = 0;
        }
      }// End setProgress
      /**
       * @name updateBatch
       * @description Actualiza el registro de Batch.
       */
      function updateBatch() {
        Batch.prototype$patchAttributes({
          id: $scope.batch.id},
          {boxSize: $scope.batch.boxSize})
          .$promise
          .then(
            function(response) {
              $scope.notify('Equipos por caja actualizado satisfactoriamente.',
                'success');
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End updateBatch
      /**
       * @name updateProduct
       * @description Actualiza el registro de Product.
       */
      function updateProduct() {
        Product.prototype$patchAttributes({
          id: $scope.batch.product.id},
          {serieLength: $scope.batch.product.serieLength})
          .$promise
          .then(
            function(response) {
              $scope.notify('Tamaño del IMEI actualizado satisfactoriamente.',
                'success');
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End updateProduct
      // Variables del $scope
      $scope.batch = {};
      $scope.boxes = [];
      $scope.boxFlg = true;
      // $scope.busy = true;
      $scope.input = {
        serie: '',
        lastSerie: '',
        toggleSave: false};
      $scope.progress = 0;
      $scope.serieFlg = true;
      $scope.temp = [];
      // Funciones del $scope
      /**
       * @name deleteAll
       * @description Elimina todos los elementos de una caja.
       */
      $scope.deleteAll = function() {
        if (!$scope.batch.stocks.length) return;
        // ...ya fue registrado en la base de datos
        $scope.showModal('fa-warning',
        'Eliminar números de serie / IMEI',
        '<p>¿Desea eliminar <b>' + $scope.batch.stocks.length + ' registros </b> ' +
        ' del lote?</p><p>Esta acción no puede deshacerse.</p>',
        {hideCancel: false},
        function() {
          deleteAllStock();
        });
      };// End deleteAll
      /**
       * @name save
       * @description Valida y envía le formulario para su procesamiento.
       */
      $scope.save = function() {
        $('#imei').prop('disabled', true).focus();
        var imei = $scope.input.serie;
        if ($scope.input.serie &&
        $scope.input.serie.length === $scope.batch.product.serieLength) {
          if ($scope.input.toggleSave) {
            // ...debe eliminar
            deleteImei(imei);
          } else {
            // ...debe registrar
            insertImei(imei);
          }
          $scope.input.lastSerie = imei;
          $scope.input.serie = '';
        } else {
          // ...no se agrega
          $('#imei').prop('disabled', true).focus();
          // ...ya fue registrado en la base de datos
          $scope.showModal('fa-warning',
            'Error de captura',
            '<p><b>El tamaño del IMEI no es el adecuado</b></p>',
            {hideCancel: true},
            function() {
              //
            });
          $scope.temp = removeFromArray($scope.temp, {IMEI: _imei});
          negative.play();
        }
        $('#imei').val('').prop('disabled', false).focus();
      };// End save
      /**
       * @name updateBox
       * @description Valida que pueda editarse el tamaño de la caja.
       */
      $scope.updateBox = function() {
        if (!$scope.boxFlg) {
          updateBatch();
        } else {
          $('#box').focus();
        }
        $scope.boxFlg = !$scope.boxFlg;
      };// End updateBox
      /**
       * @name updateSerie
       * @description Valida que pueda editarse la longitud del número de serie.
       */
      $scope.updateSerie = function() {
        if (!$scope.serieFlg) {
          updateProduct();
        } else {
          $('#serie').focus();
        }
        $scope.serieFlg = !$scope.serieFlg;
      };// End updateSerie
      // Watchers
      // Validar la sesión
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        if ($state.params.batchId) {
          // ...recuperar los datos del lote
          getBatch($state.params.batchId, function(err, batch) {
            $scope.busy = false;
            // $('#imei').prop('disabled', false).focus();
            if (err || !batch) {
              $scope.notify(err.data.error.message);
              $state.go('admin.batch.list');
            } else if (batch) {
              $scope.batch = batch;
              $scope.temp = batch.stocks.slice();
              initBoxes(batch.stocks);
              $('#imei').val('').prop('disabled', false).focus();
            }
          });
        }
      });// End $watch.currentUser
      // Código principal
      // Dissmiss Modal
      $('#genericModal').on('hidden.bs.modal', function(e) {
        $('#imei').val('').prop('disabled', false).focus();
      });
    }
  ])
  /**
   * @description Controlador para registrar un lote.
   */
  .controller('BatchForm', [
    '$scope',
    '$state',
    'Batch',
    'Brand',
    'Color',
    'ProductType',
    'PurchaseOrder',
    function($scope, $state, Batch, Brand, Color, ProductType, PurchaseOrder) {
      // Variables generales
      // Funciones generales
      /**
       * @name createBatch
       * @description Crea un nuevo registro de Batch.
       */
      function createBatch() {
        $scope.busy = true;
        Batch.create($scope.batch)
          .$promise
          .then(
            function(response) {
              $scope.busy = false;
              $scope.notify('Registro creado satisfactoriamente.',
                'success');
              $state.go('admin.batch.list');
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End createBatch
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
            },
            function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End getProductTypes
      /**
       * @name getPurchaseOrder
       * @description Recupera los datos de la orden de compra.
       * @param {string} purchaseOrderId Identificador de la orden de compra.
       */
      function getPurchaseOrder(purchaseOrderId) {
        PurchaseOrder.findById({id: purchaseOrderId})
          .$promise
          .then(
            function(purchaseOrder) {
              $scope.batch.idPurchaseOrder = purchaseOrder.id;
              getColors();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getPurchaseOrder
      // Variables del $scope
      // Objeto de las variantes.
      $scope.variant = {
        name: 'Variante',
        id: undefined,
        options: []};
      // Objeto de los modelos.
      $scope.models;
      // Objeto para los campos del formulario.
      $scope.batch = {
        idPurchaseOrder: null,
        stockSize: 1,
        cost: 1,
        boxSize: 10,
        product: {}};
      // Funciones del $scope
      /**
       * @name save
       * @description Valida y envía le formulario para su procesamiento.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        // Validación del formulario
        if (!$scope.batch.product.idProductType) {
          errorCount++;
        }
        if (!$scope.batch.product.idBrand) {
          errorCount++;
        }
        if (!$scope.batch.product.idProductModel) {
          errorCount++;
        }
        if (!$scope.batch.product.idColor) {
          errorCount++;
        }
        if (!$scope.batch.product.idVariantOption) {
          errorCount++;
        }
        // Formulario con error
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        $scope.batch.product.idProductVariant = $scope.variant.id;
        createBatch();
      };// End save
      // Watch brand select
      $scope.$watch('batch.product.idBrand', function(brand) {
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
      $scope.$watch('batch.product.idProductType', function(productType) {
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
      // Código principal
      // getColors();
      if (!$state.params.purchaseOrderId) {
        $state.go('admin.batch.list');
      } else {
        getPurchaseOrder($state.params.purchaseOrderId);
      }
    }
  ]);