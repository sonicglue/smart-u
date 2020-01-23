angular.module('systemax')
  .controller('BrandBlank', [
    '$rootScope',
    '$scope',
    '$state',
    function($rootScope, $scope, $state) {
      // Código principal
      $rootScope.menu = 'brand';
      // Validar almacén central
      if (!$scope.currentUser.isMain) {
        $state.go('admin');
      }
    }
  ])
  /**
   * @description Controlador para listar las marcas.
   */
  .controller('BrandList', [
    '$rootScope',
    '$scope',
    'Brand',
    function($rootScope, $scope, Brand) {
      // Variables generales
      var brandFilter = {
        include: ['products', 'models'],
        where: {},
        order: ['name']};
      // Funciones generales
      /**
       * @name deleteBrand
       * @description Elimina una marca por su Id.
       * @param {string} brandId Identificador de la marca.
       */
      function deleteBrand(brandId) {
        Brand.deleteById({id: brandId})
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
      }// End deleteBrand
      /**
       * @name getBrands
       * @description Recupera los datos de las marcas.
       */
      function getBrands() {
        Brand.find({filter: brandFilter})
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
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de marcas.
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
      // Objeto de marecas
      $scope.brands = {};
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        brandFilter = _.extend(brandFilter, $scope.pagination.filter);
        getBrands();
      };// End reloadData
      /**
       * @name delete
       * @description Presenta un aviso de eliminación de una marca.
       * @param {object} brand Objeto de la marca.
       */
      $scope.delete = function(brand) {
        $scope.showModal('fa-warning',
          'Eliminar marca del sistema',
          '<p>¿Desea eliminar la marca <b>' + brand.name + '</b>?</p>' + 
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            deleteBrand(brand.id);
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
   * @description Controlador para registro/actualización de marcas.
   */
  .controller('BrandForm', [
    '$scope',
    '$state',
    'Brand',
    function($scope, $state, Brand) {
      // Variables generales
      // Funciones generales
      /**
       * @name createBrand
       * @description Crea un nuevo registro de Brand.
       */
      function createBrand() {
        $scope.busy = true;
        Brand.create($scope.brand)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            $scope.notify('Registro creado satisfactoriamente.',
              'success');
            $scope.return.data.idBrand = response.id;
            $state.go($scope.return.to, $scope.return.paramsTo);
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End createBrand
      // Variables del $scope
      $scope.brand = {};
      // Funciones del $scope
      /**
       * @name save
       * @description Función para validar y guardar los datos del form.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        if (!$scope.brand.name) {
          errorCount++;
        }
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        createBrand();
      };// End save
      // Watchers
      // Código principal 
    }
  ]);
