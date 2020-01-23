angular.module('systemax')
  /**
   * @description Controlador para inicio de sesión en el sistema.
   */
  .controller('Login', [
    '$scope',
    '$state',
    'AuthService',
    function($scope, $state, AuthService) {
      /**
       * @name login
       * @description Función para inicar sesión en el sistema.
       * @param {string} email Nombre de usuario para inicio de sesión.
       * @param {string} password Contraseña para inicio de sesión.
       */
      function login(email, password) {
        AuthService.login(email, password)
          .then(
            function(user) {
              $state.go('admin');
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message +
                ' El nombre de usuario o la contraseña son invalidos.', {
                hideDuration: 1000,
                showDuration: 200,
                position: 'right bottom'});
              $('form.needs-validation').removeClass('was-validated');
              $('#password').val('').focus();
              $scope.user.password = null;
            });
      }// End login
      /**
       * @name login
       * @description Función para inicar sesión en el sistema.
       */
      $scope.login = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        // Validación del formulario
        if (!$scope.user.email) {
          errorCount++;
        }
        if (!$scope.user.password) {
          errorCount++;
        }
        // Formulario con error
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe corregirlos.',
            {
              hideDuration: 1000,
              showDuration: 200,
              position: 'right bottom'});
          return;
        }
        login($scope.user.email, $scope.user.password);
      };// End login
      // Variables del $scope
      $scope.user = {};
      // Código principal
    }
  ])
  /**
   * @description Controlador para cerrar la sesión del sistema.
   */
  .controller('Logout', [
    '$scope',
    '$window',
    'AuthService',
    function($scope, $window, AuthService) {
      /**
       * Watcher del usuario.
       */
      $scope.$watch('currentUser', function(user) {
        if (!user) return;

        AuthService.logout()
          .then(
            function() {
              $window.location.href = 'login';
            });
      });
    }
  ])
  /**
   * @description Controlador para reestablecer una contraseña.
   */
  .controller('ForgotPassword', [
    '$scope',
    '$state',
    'SysUser',
    function($scope, $state, SysUser) {
      /**
       * @name passwordReset
       * @description Solicita reestablecer una cuenta de usuario.
       * @param {string} email Correo electrónico del usuario.
       */
      function passwordReset(email) {
        SysUser.resetPassword({}, {email: email})
          .$promise
          .then(function(response) {
              $scope.notify('Se te ha enviado un correo electrónico para reestablecer tu contraseña.', {
                className: 'success',
                hideDuration: 1000,
                showDuration: 200,
                position: 'right bottom'});
              $state.go('login');
            },
            function(err) {
              console.log(err);
              var message = 'No se pudo solicitar la recuperación de la contraseña, intentelo de nuevo.';
              if (err.status === 404) {
                message = 'No se encontró el correo electrónico, verifique que esté bien escrito.';
                $scope.user.email = '';
              }
              $scope.notify(message, {
                hideDuration: 1000,
                showDuration: 200,
                position: 'right bottom'});
            });
      }// End passwordReset
      // Variables del $scope
      $scope.user = {};
      // Funciones del $scope
      /**
       * @name reset
       * @description Solicita reestablecer una cuenta de usuario.
       */
      $scope.reset = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        // Validación del formulario
        if (!$scope.user.email) {
          errorCount++;
        }
        // Formulario con error
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe corregirlos.',
            {
              hideDuration: 1000,
              showDuration: 200,
              position: 'right bottom'});
          return;
        }
        passwordReset($scope.user.email);
      };// End reset
    }
  ])
  /**
   * @description Controlador para generar una nueva contraseña.
   */
  .controller('ResetPassword', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    'AuthService',
    'SysUser',
    function($rootScope, $scope, $state, $stateParams, AuthService, SysUser) {
      // Funciones generales
      /**
       * @name restorePassword
       * @description Actualiza el password del usuario.
       * @param {string} password Nueva contraseña del usuario.
       */
      function restorePassword(password) {
        SysUser.setPassword({id: $rootScope.currentUser.id, newPassword: password})
          .$promise
          .then(function(response) {
              $scope.notify('Contraseña reestablecida con éxito.', {
                className: 'success',
                hideDuration: 1000,
                showDuration: 200,
                position: 'right bottom'});
              AuthService.logout()
                .then(function() {
                  $state.go('login');
              });
            },
            function(err) {
              console.log(err);
              $scope.notify('No se pudo actualizar la contraseña, intente más tarde.',
                {
                  hideDuration: 1000,
                  showDuration: 200,
                  position: 'right bottom'});
              $scope.user = {
                password: '',
                password2: ''};
            });
      }// End restorePassword
      // Variables del $scope
      $scope.user = {}
      // Watchers
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        /**
         * @name restore
         * @description Función para validar el formulario para reestablecer la contraseña.
         */
        $scope.restore = function() {
          $('form.needs-validation').addClass('was-validated');
          var errorCount = 0;
          var message =
            'El formulario contiene uno o más errores, para continuar debe corregirlos.';
          // Validación del formulario
          if (!$scope.user.password1) {
            errorCount++;
          }
          if (!$scope.user.password2) {
            errorCount++;
          }
          if ($scope.user.password1 !== $scope.user.password2) {
            errorCount++;
            message = 'Las contraseñas no coinciden.';
          }
          // Formulario con error
          if (errorCount) {
            $scope.notify(
              message,
              {
                hideDuration: 1000,
                showDuration: 200,
                position: 'right bottom'});
            return;
          }
          restorePassword($scope.user.password1);
        };// End restore
      });
      // Código principal
      // Obtener usuario desde token
      AuthService.loginWithToken($stateParams.access_token)
        .then(function () {
          //
        });
    }
  ]);
