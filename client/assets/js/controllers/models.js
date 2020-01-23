angular.module('systemax')
  .controller('ModelBlank', [
    '$rootScope',
    '$scope',
    '$state',
    function($rootScope, $scope, $state) {
      // Código principal
      $rootScope.menu = 'model';
      // Validar almacén central
      if (!$scope.currentUser.isMain) {
        $state.go('admin');
      }
    }
  ])
  /**
   * @description Controlador para la lista de modelos.
   */
  .controller('ModelList', [
    '$rootScope',
    '$scope',
    'Brand',
    'ProductModel',
    function($rootScope, $scope, Brand, ProductModel) {
      // Variables generales
      var brandFilter = {
        include: [{relation: 'models', scope: {include: 'products', order: 'name'}}],
        order: 'name'};
      // Funciones generales
      /**
       * @name deleteModel
       * @description Elimina un modelo por su Id.
       * @param {string} modelId Identificador del modelo.
       */
      function deleteModel(modelId) {
        ProductModel.deleteById({id: modelId})
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
      }// End deleteModel
      /**
       * @name getModels
       * @description Recupera los datos de los modelos registrados.
       */
      function getModels() {
        Brand.find({filter: brandFilter})
          .$promise
          .then(
            function(brands) {
              $scope.models.length = 0;
              _.each(brands, function(brand) {
                _.each(brand.models, function(model) {
                  var newRow = {
                    brandName: brand.name,
                    id: model.id,
                    name: model.name,
                    products: model.products};
                  $scope.models.push(newRow);
                });
              });
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getModels
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de colores
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = brandFilter.where;
        Brand.count({where: brandFilter.where || {}})
          .$promise
          .then(function (count) {
            if (brandFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      // Variables del $scope
      // Objeto de modelos
      $scope.models = [];
      // Bandera para el formulario del modelo
      $scope.return.modelFlag = $scope.return.from;
      $scope.return.paramsModelFlag = $scope.return.paramsFrom;
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        brandFilter = _.extend(brandFilter, $scope.pagination.filter);
        getModels();
      };// End reloadData
      /**
       * @name delete
       * @description Presenta un aviso de eliminación de un modelo.
       * @param {object} model Objeto de orden de compra.
       */
      $scope.delete = function(model) {
        $scope.showModal('fa-warning',
          'Eliminar modelo del sistema',
          '<p>¿Desea eliminar el modelo <b>' + model.name + '</b>?</p>' +
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            deleteModel(model.id);
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
   * @description Controlador para registro/actualización de los modelos.
   */
  .controller('ModelForm', [
    '$scope',
    '$state',
    'Brand',
    'ProductModel',
    'ProductType',
    function($scope, $state, Brand, ProductModel, ProductType) {
      // Variables generales
      // Funciones generales
      /**
       * @name createModel
       * @description Crea un nuevo registro de ProductModel.
       */
      function createModel() {
        $scope.busy = true;
        ProductModel.create($scope.model)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            $scope.notify('Registro creado satisfactoriamente.',
              'success');
            $scope.return.data.idProductModel = response.id;
            $scope.return.data.idProductType = response.idProductType;
            $state.go($scope.return.modelFlag, $scope.return.paramsModelFlag);
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End createModel
      /**
       * @name getProductTypes
       * @description Recuperar los tipos de productos.
       */
      function getProductTypes() {
        ProductType.find({filter: {order: 'name'}})
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
       * @name getBrands
       * @description Recuperar todas las marcas registradas.
       */
      function getBrands() {
        Brand.find({filter: {order: 'name'}})
          .$promise
          .then(
            function(brands) {
              $scope.brands = brands;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getBrands
      // Variables del $scope
      $scope.productTypes = {};
      $scope.brands = undefined;
      $scope.model = {};
      // Funciones del $scope
      /**
       * @name save
       * @description Función para validar y guardar los datos del form.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        if (!$scope.model.idProductType) {
          errorCount++;
        }
        if (!$scope.model.idBrand) {
          errorCount++;
        }
        if (!$scope.model.name) {
          errorCount++;
        }
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        createModel();
      };// End save
      // Watchers
      // Código principal
      getBrands();
      getProductTypes();
      if ($scope.return.data.idProductType) {
        $scope.model.idProductType = $scope.return.data.idProductType;
      }
      if ($scope.return.data.idBrand) {
        $scope.model.idBrand = $scope.return.data.idBrand;
      }
    }
  ])
  /**
   *
   */
  .controller('PriceBlank', [
    '$scope',
    function($scope) {

    }
  ])
  /**
   *
   */
  .controller('PriceList', [
    '$rootScope',
    '$scope',
    'ProductModel',
    function($rootScope, $scope, ProductModel) {
      // Variables generales
      var modelFilter = {
        include: [
          'brand',
          {relation: 'products', scope: {
            include: {
              relation: 'stocks', scope: {
                where: {
                  or: [
                    {status: 'active'},
                    {status: 'assigned'}]}}}}}],
        order: ['name']
      };
      // Funciones generales
      /**
       * @name getModelsWithPrice
       * @description *
       */
      function getModelsWithPrice() {
        ProductModel.find({filter: modelFilter})
          .$promise
          .then(
            function(models) {
              $scope.busy = false;
              $scope.models = models;
              _.each($scope.models, function(model) {
                model.disable = true;
                model.stocks = [];
                _.each(model.products, function(product) {
                  model.stocks = model.stocks.concat(product.stocks);
                });
              });
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getModelWithPrice
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de colores
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = modelFilter.where;
        ProductModel.count({where: modelFilter.where || {}})
          .$promise
          .then(function (count) {
            if (modelFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      /**
       * @name updatePrice
       * @description *
       */
      function updatePrice(model, cb) {
        console.log('actualizando a ', model);
        ProductModel.prototype$updatePrices({id: model.id, newPrice: model.price})
          .$promise
          .then(
            function(result) {
              cb(null, result);
            },
            function(err) {
              cb(err);
            });
      }// End updatePrice
      // Variables del $scope
      $scope.busy = true;
      $scope.models = [];
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        modelFilter = _.extend(modelFilter, $scope.pagination.filter);
        getModelsWithPrice();
      };// End reloadData

      $scope.toggleInput = function(model) {
        var id = '#' + model.id;
        model.disable = !model.disable;
        if (typeof model.price === 'string') {
          model.price = parseFloat(model.price.replace(/[$,]/g, ''));
        }
        _.each($scope.models, function(m) {
          if (m.id !== model.id) {
            // ...todos menos el que ya está activo
            m.disable = true;
          }
        });
        if (model.disable) {
          $(id).prop({type: 'text', format: 'currency'});
          updatePrice(model, function(err, result) {
            if (err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            } else if (result) {
              console.log(result);
              $scope.notify('Actualización exitosa', 'success');
            }
          });
          //$(id).val(model.price);
        } else {
          var value = parseFloat($(id).val().replace(/[$,]/g, ''));
          $(id).prop({type: 'number', format: 'number', step: 0.01, min: 0});
          $(id).val(value).select();
        }
      };
      // Watchers
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        recalculateCountAndReload();
      });
    }
  ]);
