angular.module('systemax')
  .factory('AuthService', [
    '$rootScope',
    'SysUser',
    'LoopBackAuth',
    function($rootScope, SysUser, LoopBackAuth) {
      /**
       * @name setupCurrentUser
       * @description Crea el objeto currentUser en el $rootScope.
       * @param {object} accessToken Información del usuario y su accessToken.
       */
      function setupCurrentUser(accessToken) {
        $rootScope.currentUser = {
          tokenId: accessToken.id,
          id: accessToken.user.id,
          idWarehouse: accessToken.user.idWarehouse,
          isMain: accessToken.user.warehouse.isMain,
          email: accessToken.user.email,
          name: accessToken.user.name,
          lastName: accessToken.user.lastName,
          alias: accessToken.user.alias,
          type: accessToken.user.type,
          status: accessToken.user.accountStatus,
          warehouseACL: accessToken.user.warehouseACL,
          isAdmin: accessToken.user.isAdmin};
          console.log("Datos del usuario", $rootScope.currentUser);
      }// End setupCurrentUser
      /**
       * @name login
       * @description Función para crear el inicio de sesión en el sistema.
       * @param {string} email Correo electrónico de usuario.
       * @param {string} password Contraseña del usuario.
       */
      function login(email, password) {
        return SysUser.login({email: email, password: password})
          .$promise
          .then(
            function(accessToken) {
              setupCurrentUser(accessToken);
            });
      }// End login
      /**
       * @name
       * @description
       * @param {string} accessTokenId Identificador del accessToken.
       */
      function loginWithToken(accessTokenId) {
        return SysUser.getAccessToken({tokenId: accessTokenId})
          .$promise
          .then(
            function(accessToken) {
              if (!accessToken.user || !accessToken.id) return;
              setupCurrentUser(accessToken);
              $rootScope.currentUser.temporaryToken = true;
              LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              LoopBackAuth.save();
        });
      }// End loginWithToken
      /**
       * @name logout
       * @description Función para cerrar la sesión en el sistema.
       */
      function logout() {
        return SysUser.logout()
          .$promise
          .then(
            function() {
              $rootScope.currentUser = null;
              $rootScope.$storage.idWarehouse = null;
            });
      }// End logout
      /**
       * @name refresh
       * @description Actualiza la sesión a partir de un AccessToken.
       * @param {string} accessTokenId Identificador del AccessToken.
       */
      function refresh(accessTokenId) {
        return SysUser.getCurrent(function(userResource) {
          SysUser.findById({id: userResource.id})
            .$promise
            .then(
              function(user) {
                setupCurrentUser({id: accessTokenId, user: userResource});
              });
        });
      }// End refresh
      // Objeto AuthService
      return {
        login: login,
        loginWithToken: loginWithToken,
        logout: logout,
        refresh: refresh
      };
    }
  ]);
