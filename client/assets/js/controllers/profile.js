angular.module('systemax')
  .controller('ProfileBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      // Actualizar objeto profile
      $rootScope.menu = 'profile';
    }
  ])
  /**
   * @description Controlador para mostrar los datos del usuario.
   */
  .controller('ProfileData', [
    '$scope',
    'SysUser',
    function($scope, SysUser) {
      // Variables generales
      // Funciones generales
      /**
       * @name getUser
       * @description Recupera los datos del usuario según su sesión.
       */
      function getUser() {
        SysUser.findById({id: $scope.currentUser.id})
          .$promise
          .then(
            function(user) {
              $scope.user = user;
              $scope.user.birthDate = user.birthDate !== null ? 
                $scope.getDateFormat(user.birthDate.substr(0, 10), 'LL') :
                null;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getUser
      // Variables del $scope
      // Objeto user
      $scope.user = {};
      // Funciones del $scope
      // Watchers
      // Código principal
      getUser();
    }
  ])
  /**
   * @description Controlador para actualizar la contraseña del usuario.
   */
  .controller('ProfileReset', [
    '$scope',
    '$state',
    'AuthService',
    'SysUser',
    function($scope, $state, AuthService, SysUser) {
      // Variables generales
      // Funciones generales
      /**
       * @name changePassword
       * @description Actualiza la contraseña del usuario.
       * @param {string} userId Identificador del usuario.
       * @param {string} oldPass Contraseña que se desea cambiar.
       * @param {string} newPass Nueva contraseña para el usuario.
       */
      function changePassword(userId, oldPass, newPass) {
        var objPass = {
          id: userId,
          oldPassword: oldPass,
          newPassword: newPass};
        SysUser.changePassword(objPass)
          .$promise
          .then(
            function(response) {
              // Actualizar el status
              updateUserStatus(userId);
            },
            function(err) {
              console.log(err);
              $('form.needs-validation').removeClass('was-validated');
              if (err.data.error.code === 'INVALID_PASSWORD') {
                $('#oldPass').addClass('is-invalid');
              }
              $scope.notify(err.data.error.message);
            });
      }// End changePassword
      /**
       * @name updateUserStatus
       * @description Actualiza la cuenta del usuario.
       * @param {string} userId Identificador del usuario.
       */
      function updateUserStatus(userId) {
        var newStatus = {accountStatus: 'active'};
        SysUser.prototype$patchAttributes({id: userId}, newStatus)
        .$promise
        .then(
          function() {
            AuthService.logout().then(function() {
              $state.go('login');
            });
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End updateUserStatus
      // Variables del $scope
      // Objeto user
      $scope.user = {};
      // Funciones del $scope
      /**
       * @name save
       * @description Valida y envía el formulario para su procesamiento.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        $('form.needs-validation input').removeClass('is-invalid');
        var errorCount = 0;
        if (!$scope.user.oldPass) {
          errorCount++;
        }
        if (!$scope.user.newPass1) {
          errorCount++;
        }
        if (!$scope.user.newPass2) {
          errorCount++;
        }
        if ($scope.user.newPass1 !== $scope.user.newPass2) {
          $('form.needs-validation').removeClass('was-validated');
          $('#newPass2').addClass('is-invalid');
          errorCount++;
        }
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        changePassword($scope.currentUser.id, $scope.user.oldPass,
          $scope.user.newPass1);
      }// End $scope.save
      // Watchers
      // Código principal
    }
  ])
  /**
   * @description Controlador para actualizar los datos del usuario.
   */
  .controller('ProfileForm', [
    '$scope',
    '$state',
    'AuthService',
    'SysUser',
    function($scope, $state, AuthService, SysUser) {
      // Variables generales
      // Funciones generales
      /**
       * @name getUser
       * @description Recupera los datos del usuario según su sesión.
       */
      function getUser() {
        SysUser.findById({id: $scope.currentUser.id})
          .$promise
          .then(
            function(user) {
              $scope.user.name = user.name;
              $scope.user.lastName = user.lastName;
              $scope.user.alias = user.alias;
              $scope.user.birthDate = user.birthDate !== null ? 
                $scope.getDateFormat(user.birthDate.substr(0, 10), 'L') :
                null;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getUser
      /**
       * @name updateUser
       * @description Actualiza los datos del usuario.
       */
      function updateUser() {
        $scope.busy = true;
        if ($scope.user.birthDate !== null) {
          console.log('birthDate vale: ', $scope.user.birthDate);
          var tmp = $scope.user.birthDate.split('/');
          $scope.user.birthDate = tmp[2] + '-' + tmp[1] + '-' + tmp[0];
        }
        SysUser.prototype$patchAttributes({
          id: $scope.currentUser.id},
          $scope.user)
        .$promise
        .then(
          function(response) {
            $scope.busy = false;
            $scope.notify('Registro actualizado satisfactoriamente.',
              'success');
            $scope.return.data = {};
            AuthService.refresh($scope.currentUser.tokenId);
            $state.go('admin.profile.data');
          },
          function(err) {
            console.log(err);
            $scope.busy = false;
            $scope.notify(err.data.error.message);
          });
      }// End updateUser
      // Variables del $scope
      // Objeto user
      $scope.user = {};
      // Funciones del $scope
      /**
       * @name save
       * @description Valida y envía el formulario para su procesamiento.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        if (!$scope.user.name) {
          errorCount++;
        }
        if (!$scope.user.lastName) {
          errorCount++;
        }
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        updateUser();
      };// End $scope.save
      // Watchers
      // Código principal
      getUser();
    }
  ]);