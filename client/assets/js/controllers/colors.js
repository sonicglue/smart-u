angular.module('systemax')
  .controller('ColorBlank', [
    '$rootScope',
    '$scope',
    '$state',
    function($rootScope, $scope, $state) {
      // Código principal
      $rootScope.menu = 'color';
      // Validar almacén central
      if (!$scope.currentUser.isMain) {
        $state.go('admin');
      }
    }
  ])
  /**
   * @description Controlador para la lista de colores.
   */
  .controller('ColorList', [
    '$rootScope',
    '$scope',
    'Color',
    function($rootScope, $scope, Color) {
      // Variables generales
      var colorFilter = {
        include: ['products'],
        where: {},
        order: ['index']};
      // Funciones generales
      /**
       * @name deleteColor
       * @description Elimina un color por su Id.
       * @param {string} colorId Identificador del color.
       */
      function deleteColor(colorId) {
        Color.deleteById({id: colorId})
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
      }// End deleteColor
      /**
       * @name getColors
       * @description Recupera los datos de los colores registrados.
       */
      function getColors() {
        Color.find({filter: colorFilter})
          .$promise
          .then(
            function(colors) {
              $scope.colors = colors;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getColors
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de colores.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = colorFilter.where;
        Color.count({where: colorFilter.where || {}})
          .$promise
          .then(function (count) {
            if (colorFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      // Variables del $scope
      // Objeto de colores
      $scope.colors = {};
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        colorFilter = _.extend(colorFilter, $scope.pagination.filter);
        getColors();
      };// End reloadData
      /**
       * @name delete
       * @description Presenta un aviso de eliminación de un color.
       * @param {object} color Objeto de orden de compra.
       */
      $scope.delete = function(color) {
        $scope.showModal('fa-warning',
          'Eliminar color del sistema',
          '<p>¿Desea eliminar el color <b>' + color.name + '</b>?</p>' + 
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            deleteColor(color.id);
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
   * @description Controlador para registro/actualización de los colores.
   */
  .controller('ColorForm', [
    '$scope',
    '$state',
    'Color',
    function($scope, $state, Color) {
      // Variables generales
      // Funciones generales
      /**
       * @name createColor
       * @description Crea un nuevo registro de Color.
       */
      function createColor() {
        $scope.busy = true;
        Color.create($scope.color)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            $scope.notify('Registro creado satisfactoriamente.',
              'success');
            $scope.return.data.idColor = response.id;
            $state.go($scope.return.to, $scope.return.paramsTo);
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End createColor
      // Variables del $scope
      $scope.color = {};
      // Funciones del $scope
      /**
       * @name save
       * @description Función para validar y guardar los datos del form.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        if (!$scope.color.name) {
          errorCount++;
        }
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        createColor();
      };// End save
      // Watchers
      // Código principal
    }
  ]);