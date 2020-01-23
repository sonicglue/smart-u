// CommonJS package manager support
if (typeof module !== 'undefined' && typeof exports !== 'undefined' &&
  module.exports === exports) {
  // Export the *name* of this Angular module
  // Sample usage:
  //
  //   import lbServices from './lb-services';
  //   angular.module('app', [lbServices]);
  //
  module.exports = "lbServices";
}

(function(window, angular, undefined) {
  'use strict';

  var urlBase = "/api";
  var authHeader = 'authorization';

  function getHost(url) {
    var m = url.match(/^(?:https?:)?\/\/([^\/]+)/);
    return m ? m[1] : null;
  }
  // need to use the urlBase as the base to handle multiple
  // loopback servers behind a proxy/gateway where the host
  // would be the same.
  var urlBaseHost = getHost(urlBase) ? urlBase : location.host;

/**
 * @ngdoc overview
 * @name lbServices
 * @module
 * @description
 *
 * The `lbServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
  var module = angular.module("lbServices", ['ngResource']);

/**
 * @ngdoc object
 * @name lbServices.Email
 * @header lbServices.Email
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Email` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Email",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Emails/:id",
          { 'id': '@id' },
          {
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.Email#modelName
        * @propertyOf lbServices.Email
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Email`.
        */
        R.modelName = "Email";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Container
 * @header lbServices.Container
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Container` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Container",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Containers/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Container#download
             * @methodOf lbServices.Container
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `container` – `{string}` -
             *
             *  - `file` – `{string}` -
             *
             *  - `req` – `{object=}` -
             *
             *  - `res` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            "download": {
              url: urlBase + "/Containers/:container/download/:file",
              method: "GET",
            },
          }
        );




        /**
        * @ngdoc property
        * @name lbServices.Container#modelName
        * @propertyOf lbServices.Container
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Container`.
        */
        R.modelName = "Container";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Accessory
 * @header lbServices.Accessory
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Accessory` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Accessory",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Accessories/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Accessory#create
             * @methodOf lbServices.Accessory
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Accessories",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Accessory#createMany
             * @methodOf lbServices.Accessory
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Accessories",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Accessory#findById
             * @methodOf lbServices.Accessory
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Accessories/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Accessory#find
             * @methodOf lbServices.Accessory
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Accessories",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Accessory#prototype$patchAttributes
             * @methodOf lbServices.Accessory
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Accessories/:id",
              method: "PATCH",
            },

            // INTERNAL. Use Product.accessories.findById() instead.
            "::findById::Product::accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/:fk",
              method: "GET",
            },

            // INTERNAL. Use Product.accessories.destroyById() instead.
            "::destroyById::Product::accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Product.accessories.updateById() instead.
            "::updateById::Product::accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Product.accessories.link() instead.
            "::link::Product::accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/rel/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Product.accessories.unlink() instead.
            "::unlink::Product::accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/rel/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Product.accessories.exists() instead.
            "::exists::Product::accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/rel/:fk",
              method: "HEAD",
            },

            // INTERNAL. Use Product.accessories() instead.
            "::get::Product::accessories": {
              isArray: true,
              url: urlBase + "/Products/:id/accessories",
              method: "GET",
            },

            // INTERNAL. Use Product.accessories.create() instead.
            "::create::Product::accessories": {
              url: urlBase + "/Products/:id/accessories",
              method: "POST",
            },

            // INTERNAL. Use Product.accessories.createMany() instead.
            "::createMany::Product::accessories": {
              isArray: true,
              url: urlBase + "/Products/:id/accessories",
              method: "POST",
            },

            // INTERNAL. Use Product.accessories.destroyAll() instead.
            "::delete::Product::accessories": {
              url: urlBase + "/Products/:id/accessories",
              method: "DELETE",
            },

            // INTERNAL. Use Product.accessories.count() instead.
            "::count::Product::accessories": {
              url: urlBase + "/Products/:id/accessories/count",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Accessory#prototype$updateAttributes
             * @methodOf lbServices.Accessory
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Accessory#modelName
        * @propertyOf lbServices.Accessory
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Accessory`.
        */
        R.modelName = "Accessory";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.AppUser
 * @header lbServices.AppUser
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `AppUser` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "AppUser",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/AppUsers/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.AppUser#findById
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AppUser` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/AppUsers/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#login
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * Login a user with username/email and password.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
             *   Default value: `user`.
             *
             *  - `rememberMe` - `boolean` - Whether the authentication credentials
             *     should be remembered in localStorage across app/browser restarts.
             *     Default: `true`.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * El cuerpo de respuesta contiene propiedades de la AccessToken creada durante el inicio de la sesión.
             * Dependiendo del valor del parámetro `include`, el cuerpo puede contener propiedades adicionales:
             *   - `user` - `U+007BUserU+007D` - Datos del usuario conectado actualmente. (`include=user`)
             *
             */
            "login": {
              params: {
                include: 'user',
              },
              interceptor: {
                response: function(response) {
                  var accessToken = response.data;
                  LoopBackAuth.setUser(
                    accessToken.id, accessToken.userId, accessToken.user);
                  LoopBackAuth.rememberMe =
                    response.config.params.rememberMe !== false;
                  LoopBackAuth.save();
                  return response.resource;
                },
              },
              url: urlBase + "/AppUsers/login",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#logout
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * Logout a user with access token.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `access_token` – `{string=}` - Do not supply this argument, it is automatically extracted from request headers.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            "logout": {
              interceptor: {
                response: function(response) {
                  LoopBackAuth.clearUser();
                  LoopBackAuth.clearStorage();
                  return response.resource;
                },
                responseError: function(responseError) {
                  LoopBackAuth.clearUser();
                  LoopBackAuth.clearStorage();
                  return responseError.resource;
                },
              },
              url: urlBase + "/AppUsers/logout",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#prototype$verify
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * Trigger user's identity verification with configured verifyOptions
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - AppUser id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `verifyOptions` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            "prototype$verify": {
              url: urlBase + "/AppUsers/:id/verify",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#addGuaranties
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * Registra una lista de equipos a garantías.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` -
             *
             *  - `client` – `{object}` -
             *
             *  - `ctx` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AppUser` object.)
             * </em>
             */
            "addGuaranties": {
              url: urlBase + "/AppUsers/addGuaranties",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#getAssignedClients
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{string}` -
             *
             *  - `ctx` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AppUser` object.)
             * </em>
             */
            "getAssignedClients": {
              url: urlBase + "/AppUsers/getAssignedClients",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#getGuaranties
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{string}` -
             *
             *  - `ctx` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AppUser` object.)
             * </em>
             */
            "getGuaranties": {
              url: urlBase + "/AppUsers/getGuaranties",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#setGuaranteeRefund
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` -
             *
             *  - `client` – `{object}` -
             *
             *  - `ctx` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AppUser` object.)
             * </em>
             */
            "setGuaranteeRefund": {
              url: urlBase + "/AppUsers/setGuaranteeRefund",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#searchStock
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * Consulta la tabla stock para buscar una garantía
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{string}` -
             *
             *  - `idClient` – `{string}` -
             *
             *  - `imei` – `{string}` -
             *
             *  - `ctx` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AppUser` object.)
             * </em>
             */
            "searchStock": {
              url: urlBase + "/AppUsers/searchStock",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#sawpStock
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * Realiza intercambio de productos
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `id` – `{string}` -
             *
             *  - `data` – `{object}` -
             *
             *  - `ctx` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AppUser` object.)
             * </em>
             */
            "sawpStock": {
              url: urlBase + "/AppUsers/sawpStock",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#getStockForRefund
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{string}` -
             *
             *  - `idClient` – `{string}` -
             *
             *  - `ctx` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `AppUser` object.)
             * </em>
             */
            "getStockForRefund": {
              url: urlBase + "/AppUsers/getStockForRefund",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.AppUser#getCurrent
             * @methodOf lbServices.AppUser
             *
             * @description
             *
             * Get data of the currently logged user. Fail with HTTP result 401
             * when there is no user logged in.
             *
             * @param {function(Object,Object)=} successCb
             *    Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *    `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             */
            'getCurrent': {
              url: urlBase + "/AppUsers" + '/:id',
              method: 'GET',
              params: {
                id: function() {
                  var id = LoopBackAuth.currentUserId;
                  if (id == null) id = '__anonymous__';
                  return id;
                },
              },
              interceptor: {
                response: function(response) {
                  LoopBackAuth.currentUserData = response.data;
                  return response.resource;
                },
                responseError: function(responseError) {
                  LoopBackAuth.clearUser();
                  LoopBackAuth.clearStorage();
                  return $q.reject(responseError);
                },
              },
              __isGetCurrentUser__: true,
            },
          }
        );



        /**
         * @ngdoc method
         * @name lbServices.AppUser#getCachedCurrent
         * @methodOf lbServices.AppUser
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link lbServices.AppUser#login} or
         * {@link lbServices.AppUser#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A AppUser instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name lbServices.AppUser#isAuthenticated
         * @methodOf lbServices.AppUser
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name lbServices.AppUser#getCurrentId
         * @methodOf lbServices.AppUser
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

        /**
        * @ngdoc property
        * @name lbServices.AppUser#modelName
        * @propertyOf lbServices.AppUser
        * @description
        * The name of the model represented by this $resource,
        * i.e. `AppUser`.
        */
        R.modelName = "AppUser";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Assignment
 * @header lbServices.Assignment
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Assignment` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Assignment",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Assignments/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Assignment#create
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Assignments",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#createMany
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Assignments",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#findById
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Assignments/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#find
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Assignments",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#deleteById
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Assignments/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#count
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/Assignments/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#prototype$patchAttributes
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Assignment id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Assignments/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#prototype$addStock
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Agrega un equipo al traspaso.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Assignment id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `idStock` – `{string}` - Identificador del equipo.
             *
             *  - `index` – `{number=}` - Indice de asignación.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "prototype$addStock": {
              url: urlBase + "/Assignments/:id/addStock",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#prototype$cancel
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Cancela el traspaso recibido.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Assignment id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `idReceiver` – `{string}` - Identificador del usuario que recibe el traspaso.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "prototype$cancel": {
              url: urlBase + "/Assignments/:id/cancel",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#prototype$delStock
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Retira un equipo al traspaso.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Assignment id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `idStock` – `{string}` - Identificador del equipo.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "prototype$delStock": {
              url: urlBase + "/Assignments/:id/delStock",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#prototype$receive
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Acepta el traspaso recibido.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Assignment id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `idReceiver` – `{string}` - Identificador del usuario que recibe el traspaso.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "prototype$receive": {
              url: urlBase + "/Assignments/:id/receive",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Assignment#prototype$valStock
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * .
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `idStock` – `{string}` - Identificador del equipo.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
            "prototype$valStock": {
              url: urlBase + "/Assignments/:id/valStock",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Assignment#destroyById
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Assignment#removeById
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Assignment#prototype$updateAttributes
             * @methodOf lbServices.Assignment
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Assignment id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Assignment` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Assignment#modelName
        * @propertyOf lbServices.Assignment
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Assignment`.
        */
        R.modelName = "Assignment";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Batch
 * @header lbServices.Batch
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Batch` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Batch",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Batches/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Batch#create
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Batches",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Batch#createMany
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Batches",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Batch#findById
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Batches/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Batch#find
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Batches",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Batch#deleteById
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Batches/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Batch#prototype$patchAttributes
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Batch id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Batches/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Batch#prototype$importFile
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Carga un archivo csv para registrar números de serie en lote.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `ctx` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
            "prototype$importFile": {
              url: urlBase + "/Batches/:id/importFile",
              method: "POST",
            },

            // INTERNAL. Use Product.batches.findById() instead.
            "::findById::Product::batches": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/batches/:fk",
              method: "GET",
            },

            // INTERNAL. Use Product.batches.destroyById() instead.
            "::destroyById::Product::batches": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/batches/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Product.batches.updateById() instead.
            "::updateById::Product::batches": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/batches/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Product.batches() instead.
            "::get::Product::batches": {
              isArray: true,
              url: urlBase + "/Products/:id/batches",
              method: "GET",
            },

            // INTERNAL. Use Product.batches.create() instead.
            "::create::Product::batches": {
              url: urlBase + "/Products/:id/batches",
              method: "POST",
            },

            // INTERNAL. Use Product.batches.createMany() instead.
            "::createMany::Product::batches": {
              isArray: true,
              url: urlBase + "/Products/:id/batches",
              method: "POST",
            },

            // INTERNAL. Use Product.batches.destroyAll() instead.
            "::delete::Product::batches": {
              url: urlBase + "/Products/:id/batches",
              method: "DELETE",
            },

            // INTERNAL. Use Product.batches.count() instead.
            "::count::Product::batches": {
              url: urlBase + "/Products/:id/batches/count",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Batch#destroyById
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Batch#removeById
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Batch#prototype$updateAttributes
             * @methodOf lbServices.Batch
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Batch id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Batch#modelName
        * @propertyOf lbServices.Batch
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Batch`.
        */
        R.modelName = "Batch";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Billing
 * @header lbServices.Billing
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Billing` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Billing",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Billings/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Billing#create
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Billings",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Billing#createMany
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Billings",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Billing#findById
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Billings/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Billing#find
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Billings",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Billing#findOne
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Find first instance of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
            "findOne": {
              url: urlBase + "/Billings/findOne",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Billing#deleteById
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Billings/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Billing#prototype$patchAttributes
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Billing id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Billings/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Billing#getClients
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Devuelve la lista de usuarios clientes activos.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
            "getClients": {
              url: urlBase + "/Billings/getClients",
              method: "GET",
            },

            // INTERNAL. Use Order.client() instead.
            "::get::Order::client": {
              url: urlBase + "/Orders/:id/client",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Billing#destroyById
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Billing#removeById
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Billing#prototype$updateAttributes
             * @methodOf lbServices.Billing
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Billing id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Billing#modelName
        * @propertyOf lbServices.Billing
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Billing`.
        */
        R.modelName = "Billing";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Brand
 * @header lbServices.Brand
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Brand` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Brand",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Brands/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Brand#create
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Brands",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Brand#createMany
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Brands",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Brand#findById
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Brands/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Brand#find
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Brands",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Brand#findOne
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Find first instance of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
            "findOne": {
              url: urlBase + "/Brands/findOne",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Brand#deleteById
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Brands/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Brand#count
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/Brands/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Brand#prototype$patchAttributes
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Brands/:id",
              method: "PATCH",
            },

            // INTERNAL. Use Product.brand() instead.
            "::get::Product::brand": {
              url: urlBase + "/Products/:id/brand",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Brand#destroyById
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Brand#removeById
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Brand#prototype$updateAttributes
             * @methodOf lbServices.Brand
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Brand#modelName
        * @propertyOf lbServices.Brand
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Brand`.
        */
        R.modelName = "Brand";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Color
 * @header lbServices.Color
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Color` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Color",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Colors/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Color#create
             * @methodOf lbServices.Color
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Color` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Colors",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Color#createMany
             * @methodOf lbServices.Color
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Color` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Colors",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Color#find
             * @methodOf lbServices.Color
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Color` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Colors",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Color#deleteById
             * @methodOf lbServices.Color
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Color` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Colors/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Color#count
             * @methodOf lbServices.Color
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/Colors/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Color#prototype$patchAttributes
             * @methodOf lbServices.Color
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Color` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Colors/:id",
              method: "PATCH",
            },

            // INTERNAL. Use Product.color() instead.
            "::get::Product::color": {
              url: urlBase + "/Products/:id/color",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Color#destroyById
             * @methodOf lbServices.Color
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Color` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Color#removeById
             * @methodOf lbServices.Color
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Color` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Color#prototype$updateAttributes
             * @methodOf lbServices.Color
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Color` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Color#modelName
        * @propertyOf lbServices.Color
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Color`.
        */
        R.modelName = "Color";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Failure
 * @header lbServices.Failure
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Failure` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Failure",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Failures/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Failure#create
             * @methodOf lbServices.Failure
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Failure` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Failures",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Failure#createMany
             * @methodOf lbServices.Failure
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Failure` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Failures",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Failure#findById
             * @methodOf lbServices.Failure
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Failure` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Failures/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Failure#find
             * @methodOf lbServices.Failure
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Failure` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Failures",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Failure#prototype$patchAttributes
             * @methodOf lbServices.Failure
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Failure` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Failures/:id",
              method: "PATCH",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Failure#prototype$updateAttributes
             * @methodOf lbServices.Failure
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Failure` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Failure#modelName
        * @propertyOf lbServices.Failure
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Failure`.
        */
        R.modelName = "Failure";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Guarantee
 * @header lbServices.Guarantee
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Guarantee` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Guarantee",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Guaranties/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Guarantee#create
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Guarantee` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Guaranties",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Guarantee#createMany
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Guarantee` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Guaranties",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Guarantee#findById
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Guarantee` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Guaranties/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Guarantee#find
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Guarantee` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Guaranties",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Guarantee#findOne
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * Find first instance of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Guarantee` object.)
             * </em>
             */
            "findOne": {
              url: urlBase + "/Guaranties/findOne",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Guarantee#count
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/Guaranties/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Guarantee#prototype$patchAttributes
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Guarantee id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Guarantee` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Guaranties/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Guarantee#tracing
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * Recupera los datos para generar la gráfica de garantías.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `warehouseId` – `{string=}` - Identificador del almacén actual.
             *
             *  - `isMain` – `{boolean=}` - Bandera para identificar al almacén principal.
             *
             *  - `date` – `{date=}` - Fecha de búsqueda.
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Guarantee` object.)
             * </em>
             */
            "tracing": {
              isArray: true,
              url: urlBase + "/Guaranties/tracing",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Guarantee#guaranteeList
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` -
             *
             *  - `req` – `{object=}` -
             *
             *  - `res` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Guarantee` object.)
             * </em>
             */
            "guaranteeList": {
              url: urlBase + "/Guaranties/guaranteeList",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Guarantee#prototype$updateAttributes
             * @methodOf lbServices.Guarantee
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Guarantee id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Guarantee` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Guarantee#modelName
        * @propertyOf lbServices.Guarantee
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Guarantee`.
        */
        R.modelName = "Guarantee";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Invoice
 * @header lbServices.Invoice
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Invoice` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Invoice",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Invoices/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Invoice#find
             * @methodOf lbServices.Invoice
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Invoice` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Invoices",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Invoice#prototype$patchAttributes
             * @methodOf lbServices.Invoice
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Invoice id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Invoice` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Invoices/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Invoice#generateLetter
             * @methodOf lbServices.Invoice
             *
             * @description
             *
             * Generar carta porte.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Invoice` object.)
             * </em>
             */
            "generateLetter": {
              url: urlBase + "/Invoices/generateLetter",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Invoice#prototype$updateAttributes
             * @methodOf lbServices.Invoice
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Invoice id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Invoice` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Invoice#modelName
        * @propertyOf lbServices.Invoice
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Invoice`.
        */
        R.modelName = "Invoice";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Order
 * @header lbServices.Order
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Order` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Order",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Orders/:id",
          { 'id': '@id' },
          {

            // INTERNAL. Use Order.client() instead.
            "prototype$__get__client": {
              url: urlBase + "/Orders/:id/client",
              method: "GET",
            },

            // INTERNAL. Use Order.orderhasproduct.findById() instead.
            "prototype$__findById__orderhasproduct": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/orderhasproduct/:fk",
              method: "GET",
            },

            // INTERNAL. Use Order.orderhasproduct.destroyById() instead.
            "prototype$__destroyById__orderhasproduct": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/orderhasproduct/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Order.orderhasproduct.updateById() instead.
            "prototype$__updateById__orderhasproduct": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/orderhasproduct/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Order.products.findById() instead.
            "prototype$__findById__products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/:fk",
              method: "GET",
            },

            // INTERNAL. Use Order.products.destroyById() instead.
            "prototype$__destroyById__products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Order.products.updateById() instead.
            "prototype$__updateById__products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Order.products.link() instead.
            "prototype$__link__products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/rel/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Order.products.unlink() instead.
            "prototype$__unlink__products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/rel/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Order.products.exists() instead.
            "prototype$__exists__products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/rel/:fk",
              method: "HEAD",
            },

            // INTERNAL. Use Order.seller() instead.
            "prototype$__get__seller": {
              url: urlBase + "/Orders/:id/seller",
              method: "GET",
            },

            // INTERNAL. Use Order.orderhasproduct() instead.
            "prototype$__get__orderhasproduct": {
              isArray: true,
              url: urlBase + "/Orders/:id/orderhasproduct",
              method: "GET",
            },

            // INTERNAL. Use Order.orderhasproduct.create() instead.
            "prototype$__create__orderhasproduct": {
              url: urlBase + "/Orders/:id/orderhasproduct",
              method: "POST",
            },

            // INTERNAL. Use Order.orderhasproduct.destroyAll() instead.
            "prototype$__delete__orderhasproduct": {
              url: urlBase + "/Orders/:id/orderhasproduct",
              method: "DELETE",
            },

            // INTERNAL. Use Order.orderhasproduct.count() instead.
            "prototype$__count__orderhasproduct": {
              url: urlBase + "/Orders/:id/orderhasproduct/count",
              method: "GET",
            },

            // INTERNAL. Use Order.products() instead.
            "prototype$__get__products": {
              isArray: true,
              url: urlBase + "/Orders/:id/products",
              method: "GET",
            },

            // INTERNAL. Use Order.products.create() instead.
            "prototype$__create__products": {
              url: urlBase + "/Orders/:id/products",
              method: "POST",
            },

            // INTERNAL. Use Order.products.destroyAll() instead.
            "prototype$__delete__products": {
              url: urlBase + "/Orders/:id/products",
              method: "DELETE",
            },

            // INTERNAL. Use Order.products.count() instead.
            "prototype$__count__products": {
              url: urlBase + "/Orders/:id/products/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#create
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Orders",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#createMany
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Orders",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#patchOrCreate
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "patchOrCreate": {
              url: urlBase + "/Orders",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#replaceOrCreate
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Replace an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "replaceOrCreate": {
              url: urlBase + "/Orders/replaceOrCreate",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#upsertWithWhere
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source based on the where criteria.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "upsertWithWhere": {
              url: urlBase + "/Orders/upsertWithWhere",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#exists
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Check whether a model instance exists in the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `exists` – `{boolean=}` -
             */
            "exists": {
              url: urlBase + "/Orders/:id/exists",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#findById
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Orders/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#replaceById
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Replace attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "replaceById": {
              url: urlBase + "/Orders/:id/replace",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#find
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Orders",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#findOne
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Find first instance of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "findOne": {
              url: urlBase + "/Orders/findOne",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#updateAll
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
            "updateAll": {
              url: urlBase + "/Orders/update",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#deleteById
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Orders/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#count
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/Orders/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#prototype$patchAttributes
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Orders/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#createChangeStream
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Create a change stream.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `changes` – `{ReadableStream=}` -
             */
            "createChangeStream": {
              url: urlBase + "/Orders/change-stream",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Order#refund
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Generar una orden de bonificación.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object}` - Objeto con los datos de la bonificación.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            "refund": {
              url: urlBase + "/Orders/refund",
              method: "POST",
            },

            // INTERNAL. Use OrderHasProduct.order() instead.
            "::get::OrderHasProduct::order": {
              url: urlBase + "/OrderHasProducts/:id/order",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Order#upsert
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
        R["upsert"] = R["patchOrCreate"];

            /**
             * @ngdoc method
             * @name lbServices.Order#updateOrCreate
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
        R["updateOrCreate"] = R["patchOrCreate"];

            /**
             * @ngdoc method
             * @name lbServices.Order#patchOrCreateWithWhere
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source based on the where criteria.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
        R["patchOrCreateWithWhere"] = R["upsertWithWhere"];

            /**
             * @ngdoc method
             * @name lbServices.Order#update
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
        R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.Order#destroyById
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Order#removeById
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Order#prototype$updateAttributes
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Order#modelName
        * @propertyOf lbServices.Order
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Order`.
        */
        R.modelName = "Order";


            /**
             * @ngdoc method
             * @name lbServices.Order#client
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Capta la relación belongsTo client.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Billing` object.)
             * </em>
             */
        R.client = function() {
          var TargetResource = $injector.get("Billing");
          var action = TargetResource["::get::Order::client"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Order.orderhasproduct
     * @header lbServices.Order.orderhasproduct
     * @object
     * @description
     *
     * The object `Order.orderhasproduct` groups methods
     * manipulating `OrderHasProduct` instances related to `Order`.
     *
     * Call {@link lbServices.Order#orderhasproduct Order.orderhasproduct()}
     * to query all related instances.
     */


            /**
             * @ngdoc method
             * @name lbServices.Order#orderhasproduct
             * @methodOf lbServices.Order
             *
             * @description
             *
             * orderhasproduct consultas de Order.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `filter` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R.orderhasproduct = function() {
          var TargetResource = $injector.get("OrderHasProduct");
          var action = TargetResource["::get::Order::orderhasproduct"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.orderhasproduct#count
             * @methodOf lbServices.Order.orderhasproduct
             *
             * @description
             *
             * Recuentos orderhasproduct de Order.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
        R.orderhasproduct.count = function() {
          var TargetResource = $injector.get("OrderHasProduct");
          var action = TargetResource["::count::Order::orderhasproduct"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.orderhasproduct#create
             * @methodOf lbServices.Order.orderhasproduct
             *
             * @description
             *
             * Crea una nueva instancia en orderhasproduct de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R.orderhasproduct.create = function() {
          var TargetResource = $injector.get("OrderHasProduct");
          var action = TargetResource["::create::Order::orderhasproduct"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.orderhasproduct#createMany
             * @methodOf lbServices.Order.orderhasproduct
             *
             * @description
             *
             * Crea una nueva instancia en orderhasproduct de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R.orderhasproduct.createMany = function() {
          var TargetResource = $injector.get("OrderHasProduct");
          var action = TargetResource["::createMany::Order::orderhasproduct"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.orderhasproduct#destroyAll
             * @methodOf lbServices.Order.orderhasproduct
             *
             * @description
             *
             * Suprime todos los orderhasproduct de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.orderhasproduct.destroyAll = function() {
          var TargetResource = $injector.get("OrderHasProduct");
          var action = TargetResource["::delete::Order::orderhasproduct"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.orderhasproduct#destroyById
             * @methodOf lbServices.Order.orderhasproduct
             *
             * @description
             *
             * Suprimir un elemento relacionado por id para orderhasproduct.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para orderhasproduct
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.orderhasproduct.destroyById = function() {
          var TargetResource = $injector.get("OrderHasProduct");
          var action = TargetResource["::destroyById::Order::orderhasproduct"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.orderhasproduct#findById
             * @methodOf lbServices.Order.orderhasproduct
             *
             * @description
             *
             * Buscar un elemento relacionado por id para orderhasproduct.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para orderhasproduct
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R.orderhasproduct.findById = function() {
          var TargetResource = $injector.get("OrderHasProduct");
          var action = TargetResource["::findById::Order::orderhasproduct"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.orderhasproduct#updateById
             * @methodOf lbServices.Order.orderhasproduct
             *
             * @description
             *
             * Actualizar un elemento relacionado por id para orderhasproduct.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `fk` – `{*}` - Clave foránea para orderhasproduct
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R.orderhasproduct.updateById = function() {
          var TargetResource = $injector.get("OrderHasProduct");
          var action = TargetResource["::updateById::Order::orderhasproduct"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Order.products
     * @header lbServices.Order.products
     * @object
     * @description
     *
     * The object `Order.products` groups methods
     * manipulating `Product` instances related to `Order`.
     *
     * Call {@link lbServices.Order#products Order.products()}
     * to query all related instances.
     */


            /**
             * @ngdoc method
             * @name lbServices.Order#products
             * @methodOf lbServices.Order
             *
             * @description
             *
             * products consultas de Order.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `filter` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R.products = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::get::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#count
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Recuentos products de Order.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
        R.products.count = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::count::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#create
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Crea una nueva instancia en products de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R.products.create = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::create::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#createMany
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Crea una nueva instancia en products de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R.products.createMany = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::createMany::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#destroyAll
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Suprime todos los products de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.products.destroyAll = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::delete::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#destroyById
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Suprimir un elemento relacionado por id para products.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para products
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.products.destroyById = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::destroyById::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#exists
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Comprobar la existencia de la relación products con un elemento por id.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para products
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R.products.exists = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::exists::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#findById
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Buscar un elemento relacionado por id para products.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para products
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R.products.findById = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::findById::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#link
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Añadir un elemento relacionado por id para products.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `fk` – `{*}` - Clave foránea para products
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R.products.link = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::link::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#unlink
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Eliminar la relación products con un elemento por id.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para products
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.products.unlink = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::unlink::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order.products#updateById
             * @methodOf lbServices.Order.products
             *
             * @description
             *
             * Actualizar un elemento relacionado por id para products.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `fk` – `{*}` - Clave foránea para products
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R.products.updateById = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::updateById::Order::products"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Order#seller
             * @methodOf lbServices.Order
             *
             * @description
             *
             * Capta la relación belongsTo seller.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Order id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
        R.seller = function() {
          var TargetResource = $injector.get("SysUser");
          var action = TargetResource["::get::Order::seller"];
          return action.apply(R, arguments);
        };


        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.OrderHasProduct
 * @header lbServices.OrderHasProduct
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `OrderHasProduct` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "OrderHasProduct",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/OrderHasProducts/:id",
          { 'id': '@id' },
          {

            // INTERNAL. Use OrderHasProduct.order() instead.
            "prototype$__get__order": {
              url: urlBase + "/OrderHasProducts/:id/order",
              method: "GET",
            },

            // INTERNAL. Use OrderHasProduct.product() instead.
            "prototype$__get__product": {
              url: urlBase + "/OrderHasProducts/:id/product",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#create
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/OrderHasProducts",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#createMany
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/OrderHasProducts",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#patchOrCreate
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "patchOrCreate": {
              url: urlBase + "/OrderHasProducts",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#replaceOrCreate
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Replace an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "replaceOrCreate": {
              url: urlBase + "/OrderHasProducts/replaceOrCreate",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#upsertWithWhere
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source based on the where criteria.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "upsertWithWhere": {
              url: urlBase + "/OrderHasProducts/upsertWithWhere",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#exists
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Check whether a model instance exists in the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `exists` – `{boolean=}` -
             */
            "exists": {
              url: urlBase + "/OrderHasProducts/:id/exists",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#findById
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/OrderHasProducts/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#replaceById
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Replace attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "replaceById": {
              url: urlBase + "/OrderHasProducts/:id/replace",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#find
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/OrderHasProducts",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#findOne
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Find first instance of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "findOne": {
              url: urlBase + "/OrderHasProducts/findOne",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#updateAll
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
            "updateAll": {
              url: urlBase + "/OrderHasProducts/update",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#deleteById
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/OrderHasProducts/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#count
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/OrderHasProducts/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#prototype$patchAttributes
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - OrderHasProduct id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/OrderHasProducts/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#createChangeStream
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Create a change stream.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `changes` – `{ReadableStream=}` -
             */
            "createChangeStream": {
              url: urlBase + "/OrderHasProducts/change-stream",
              method: "POST",
            },

            // INTERNAL. Use Order.orderhasproduct.findById() instead.
            "::findById::Order::orderhasproduct": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/orderhasproduct/:fk",
              method: "GET",
            },

            // INTERNAL. Use Order.orderhasproduct.destroyById() instead.
            "::destroyById::Order::orderhasproduct": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/orderhasproduct/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Order.orderhasproduct.updateById() instead.
            "::updateById::Order::orderhasproduct": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/orderhasproduct/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Order.orderhasproduct() instead.
            "::get::Order::orderhasproduct": {
              isArray: true,
              url: urlBase + "/Orders/:id/orderhasproduct",
              method: "GET",
            },

            // INTERNAL. Use Order.orderhasproduct.create() instead.
            "::create::Order::orderhasproduct": {
              url: urlBase + "/Orders/:id/orderhasproduct",
              method: "POST",
            },

            // INTERNAL. Use Order.orderhasproduct.createMany() instead.
            "::createMany::Order::orderhasproduct": {
              isArray: true,
              url: urlBase + "/Orders/:id/orderhasproduct",
              method: "POST",
            },

            // INTERNAL. Use Order.orderhasproduct.destroyAll() instead.
            "::delete::Order::orderhasproduct": {
              url: urlBase + "/Orders/:id/orderhasproduct",
              method: "DELETE",
            },

            // INTERNAL. Use Order.orderhasproduct.count() instead.
            "::count::Order::orderhasproduct": {
              url: urlBase + "/Orders/:id/orderhasproduct/count",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#upsert
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R["upsert"] = R["patchOrCreate"];

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#updateOrCreate
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R["updateOrCreate"] = R["patchOrCreate"];

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#patchOrCreateWithWhere
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source based on the where criteria.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R["patchOrCreateWithWhere"] = R["upsertWithWhere"];

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#update
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
        R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#destroyById
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#removeById
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#prototype$updateAttributes
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - OrderHasProduct id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `OrderHasProduct` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.OrderHasProduct#modelName
        * @propertyOf lbServices.OrderHasProduct
        * @description
        * The name of the model represented by this $resource,
        * i.e. `OrderHasProduct`.
        */
        R.modelName = "OrderHasProduct";


            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#order
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Capta la relación belongsTo order.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - OrderHasProduct id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Order` object.)
             * </em>
             */
        R.order = function() {
          var TargetResource = $injector.get("Order");
          var action = TargetResource["::get::OrderHasProduct::order"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.OrderHasProduct#product
             * @methodOf lbServices.OrderHasProduct
             *
             * @description
             *
             * Capta la relación belongsTo product.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - OrderHasProduct id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R.product = function() {
          var TargetResource = $injector.get("Product");
          var action = TargetResource["::get::OrderHasProduct::product"];
          return action.apply(R, arguments);
        };


        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Payment
 * @header lbServices.Payment
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Payment` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Payment",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Payments/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Payment#find
             * @methodOf lbServices.Payment
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Payment` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Payments",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Payment#count
             * @methodOf lbServices.Payment
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/Payments/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Payment#prototype$patchAttributes
             * @methodOf lbServices.Payment
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Payment id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Payment` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Payments/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Payment#getDebt
             * @methodOf lbServices.Payment
             *
             * @description
             *
             * GET all debts of clients.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Objeto con los identificadores del los clientes.
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Payment` object.)
             * </em>
             */
            "getDebt": {
              isArray: true,
              url: urlBase + "/Payments/getDebt",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Payment#getSold
             * @methodOf lbServices.Payment
             *
             * @description
             *
             * GET all sold of sellers.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Objeto con los identificadores del los ejecutivos.
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Payment` object.)
             * </em>
             */
            "getSold": {
              isArray: true,
              url: urlBase + "/Payments/getSold",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Payment#getSalesHistory
             * @methodOf lbServices.Payment
             *
             * @description
             *
             * GET all sold of sellers.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Objeto con los identificadores de los ejecutivos.
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Payment` object.)
             * </em>
             */
            "getSalesHistory": {
              isArray: true,
              url: urlBase + "/Payments/getSalesHistory",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Payment#prototype$updateAttributes
             * @methodOf lbServices.Payment
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Payment id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Payment` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Payment#modelName
        * @propertyOf lbServices.Payment
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Payment`.
        */
        R.modelName = "Payment";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Product
 * @header lbServices.Product
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Product` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Product",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Products/:id",
          { 'id': '@id' },
          {

            // INTERNAL. Use Product.batches.findById() instead.
            "prototype$__findById__batches": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/batches/:fk",
              method: "GET",
            },

            // INTERNAL. Use Product.batches.destroyById() instead.
            "prototype$__destroyById__batches": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/batches/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Product.batches.updateById() instead.
            "prototype$__updateById__batches": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/batches/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Product.brand() instead.
            "prototype$__get__brand": {
              url: urlBase + "/Products/:id/brand",
              method: "GET",
            },

            // INTERNAL. Use Product.color() instead.
            "prototype$__get__color": {
              url: urlBase + "/Products/:id/color",
              method: "GET",
            },

            // INTERNAL. Use Product.accessories.findById() instead.
            "prototype$__findById__accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/:fk",
              method: "GET",
            },

            // INTERNAL. Use Product.accessories.destroyById() instead.
            "prototype$__destroyById__accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Product.accessories.updateById() instead.
            "prototype$__updateById__accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Product.accessories.link() instead.
            "prototype$__link__accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/rel/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Product.accessories.unlink() instead.
            "prototype$__unlink__accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/rel/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Product.accessories.exists() instead.
            "prototype$__exists__accessories": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/accessories/rel/:fk",
              method: "HEAD",
            },

            // INTERNAL. Use Product.model() instead.
            "prototype$__get__model": {
              url: urlBase + "/Products/:id/model",
              method: "GET",
            },

            // INTERNAL. Use Product.type() instead.
            "prototype$__get__type": {
              url: urlBase + "/Products/:id/type",
              method: "GET",
            },

            // INTERNAL. Use Product.variant() instead.
            "prototype$__get__variant": {
              url: urlBase + "/Products/:id/variant",
              method: "GET",
            },

            // INTERNAL. Use Product.option() instead.
            "prototype$__get__option": {
              url: urlBase + "/Products/:id/option",
              method: "GET",
            },

            // INTERNAL. Use Product.stocks.findById() instead.
            "prototype$__findById__stocks": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/stocks/:fk",
              method: "GET",
            },

            // INTERNAL. Use Product.stocks.destroyById() instead.
            "prototype$__destroyById__stocks": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/stocks/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Product.stocks.updateById() instead.
            "prototype$__updateById__stocks": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/stocks/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Product.batches() instead.
            "prototype$__get__batches": {
              isArray: true,
              url: urlBase + "/Products/:id/batches",
              method: "GET",
            },

            // INTERNAL. Use Product.batches.create() instead.
            "prototype$__create__batches": {
              url: urlBase + "/Products/:id/batches",
              method: "POST",
            },

            // INTERNAL. Use Product.batches.destroyAll() instead.
            "prototype$__delete__batches": {
              url: urlBase + "/Products/:id/batches",
              method: "DELETE",
            },

            // INTERNAL. Use Product.batches.count() instead.
            "prototype$__count__batches": {
              url: urlBase + "/Products/:id/batches/count",
              method: "GET",
            },

            // INTERNAL. Use Product.accessories() instead.
            "prototype$__get__accessories": {
              isArray: true,
              url: urlBase + "/Products/:id/accessories",
              method: "GET",
            },

            // INTERNAL. Use Product.accessories.create() instead.
            "prototype$__create__accessories": {
              url: urlBase + "/Products/:id/accessories",
              method: "POST",
            },

            // INTERNAL. Use Product.accessories.destroyAll() instead.
            "prototype$__delete__accessories": {
              url: urlBase + "/Products/:id/accessories",
              method: "DELETE",
            },

            // INTERNAL. Use Product.accessories.count() instead.
            "prototype$__count__accessories": {
              url: urlBase + "/Products/:id/accessories/count",
              method: "GET",
            },

            // INTERNAL. Use Product.stocks() instead.
            "prototype$__get__stocks": {
              isArray: true,
              url: urlBase + "/Products/:id/stocks",
              method: "GET",
            },

            // INTERNAL. Use Product.stocks.create() instead.
            "prototype$__create__stocks": {
              url: urlBase + "/Products/:id/stocks",
              method: "POST",
            },

            // INTERNAL. Use Product.stocks.destroyAll() instead.
            "prototype$__delete__stocks": {
              url: urlBase + "/Products/:id/stocks",
              method: "DELETE",
            },

            // INTERNAL. Use Product.stocks.count() instead.
            "prototype$__count__stocks": {
              url: urlBase + "/Products/:id/stocks/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#create
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Products",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#createMany
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Products",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#patchOrCreate
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "patchOrCreate": {
              url: urlBase + "/Products",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#replaceOrCreate
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Replace an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "replaceOrCreate": {
              url: urlBase + "/Products/replaceOrCreate",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#upsertWithWhere
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source based on the where criteria.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "upsertWithWhere": {
              url: urlBase + "/Products/upsertWithWhere",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#exists
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Check whether a model instance exists in the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `exists` – `{boolean=}` -
             */
            "exists": {
              url: urlBase + "/Products/:id/exists",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#findById
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Products/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#replaceById
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Replace attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "replaceById": {
              url: urlBase + "/Products/:id/replace",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#find
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Products",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#findOne
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Find first instance of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "findOne": {
              url: urlBase + "/Products/findOne",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#updateAll
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
            "updateAll": {
              url: urlBase + "/Products/update",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#deleteById
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Products/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#count
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/Products/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#prototype$patchAttributes
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Products/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#createChangeStream
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Create a change stream.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `changes` – `{ReadableStream=}` -
             */
            "createChangeStream": {
              url: urlBase + "/Products/change-stream",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Product#setAccessories
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Indica los accesorios que se incluyen en el producto.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object}` - Objeto con los datos de los accesorios.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            "setAccessories": {
              url: urlBase + "/Products/setAccessories",
              method: "POST",
            },

            // INTERNAL. Use Order.products.findById() instead.
            "::findById::Order::products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/:fk",
              method: "GET",
            },

            // INTERNAL. Use Order.products.destroyById() instead.
            "::destroyById::Order::products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Order.products.updateById() instead.
            "::updateById::Order::products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Order.products.link() instead.
            "::link::Order::products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/rel/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Order.products.unlink() instead.
            "::unlink::Order::products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/rel/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Order.products.exists() instead.
            "::exists::Order::products": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Orders/:id/products/rel/:fk",
              method: "HEAD",
            },

            // INTERNAL. Use Order.products() instead.
            "::get::Order::products": {
              isArray: true,
              url: urlBase + "/Orders/:id/products",
              method: "GET",
            },

            // INTERNAL. Use Order.products.create() instead.
            "::create::Order::products": {
              url: urlBase + "/Orders/:id/products",
              method: "POST",
            },

            // INTERNAL. Use Order.products.createMany() instead.
            "::createMany::Order::products": {
              isArray: true,
              url: urlBase + "/Orders/:id/products",
              method: "POST",
            },

            // INTERNAL. Use Order.products.destroyAll() instead.
            "::delete::Order::products": {
              url: urlBase + "/Orders/:id/products",
              method: "DELETE",
            },

            // INTERNAL. Use Order.products.count() instead.
            "::count::Order::products": {
              url: urlBase + "/Orders/:id/products/count",
              method: "GET",
            },

            // INTERNAL. Use OrderHasProduct.product() instead.
            "::get::OrderHasProduct::product": {
              url: urlBase + "/OrderHasProducts/:id/product",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Product#upsert
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R["upsert"] = R["patchOrCreate"];

            /**
             * @ngdoc method
             * @name lbServices.Product#updateOrCreate
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Patch an existing model instance or insert a new one into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R["updateOrCreate"] = R["patchOrCreate"];

            /**
             * @ngdoc method
             * @name lbServices.Product#patchOrCreateWithWhere
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source based on the where criteria.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R["patchOrCreateWithWhere"] = R["upsertWithWhere"];

            /**
             * @ngdoc method
             * @name lbServices.Product#update
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
        R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.Product#destroyById
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Product#removeById
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Product#prototype$updateAttributes
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Product` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Product#modelName
        * @propertyOf lbServices.Product
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Product`.
        */
        R.modelName = "Product";

    /**
     * @ngdoc object
     * @name lbServices.Product.batches
     * @header lbServices.Product.batches
     * @object
     * @description
     *
     * The object `Product.batches` groups methods
     * manipulating `Batch` instances related to `Product`.
     *
     * Call {@link lbServices.Product#batches Product.batches()}
     * to query all related instances.
     */


            /**
             * @ngdoc method
             * @name lbServices.Product#batches
             * @methodOf lbServices.Product
             *
             * @description
             *
             * batches consultas de Product.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `filter` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
        R.batches = function() {
          var TargetResource = $injector.get("Batch");
          var action = TargetResource["::get::Product::batches"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.batches#count
             * @methodOf lbServices.Product.batches
             *
             * @description
             *
             * Recuentos batches de Product.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
        R.batches.count = function() {
          var TargetResource = $injector.get("Batch");
          var action = TargetResource["::count::Product::batches"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.batches#create
             * @methodOf lbServices.Product.batches
             *
             * @description
             *
             * Crea una nueva instancia en batches de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
        R.batches.create = function() {
          var TargetResource = $injector.get("Batch");
          var action = TargetResource["::create::Product::batches"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.batches#createMany
             * @methodOf lbServices.Product.batches
             *
             * @description
             *
             * Crea una nueva instancia en batches de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
        R.batches.createMany = function() {
          var TargetResource = $injector.get("Batch");
          var action = TargetResource["::createMany::Product::batches"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.batches#destroyAll
             * @methodOf lbServices.Product.batches
             *
             * @description
             *
             * Suprime todos los batches de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.batches.destroyAll = function() {
          var TargetResource = $injector.get("Batch");
          var action = TargetResource["::delete::Product::batches"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.batches#destroyById
             * @methodOf lbServices.Product.batches
             *
             * @description
             *
             * Suprimir un elemento relacionado por id para batches.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para batches
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.batches.destroyById = function() {
          var TargetResource = $injector.get("Batch");
          var action = TargetResource["::destroyById::Product::batches"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.batches#findById
             * @methodOf lbServices.Product.batches
             *
             * @description
             *
             * Buscar un elemento relacionado por id para batches.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para batches
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
        R.batches.findById = function() {
          var TargetResource = $injector.get("Batch");
          var action = TargetResource["::findById::Product::batches"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.batches#updateById
             * @methodOf lbServices.Product.batches
             *
             * @description
             *
             * Actualizar un elemento relacionado por id para batches.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `fk` – `{*}` - Clave foránea para batches
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Batch` object.)
             * </em>
             */
        R.batches.updateById = function() {
          var TargetResource = $injector.get("Batch");
          var action = TargetResource["::updateById::Product::batches"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product#brand
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Capta la relación belongsTo brand.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Brand` object.)
             * </em>
             */
        R.brand = function() {
          var TargetResource = $injector.get("Brand");
          var action = TargetResource["::get::Product::brand"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product#color
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Capta la relación belongsTo color.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Color` object.)
             * </em>
             */
        R.color = function() {
          var TargetResource = $injector.get("Color");
          var action = TargetResource["::get::Product::color"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Product.accessories
     * @header lbServices.Product.accessories
     * @object
     * @description
     *
     * The object `Product.accessories` groups methods
     * manipulating `Accessory` instances related to `Product`.
     *
     * Call {@link lbServices.Product#accessories Product.accessories()}
     * to query all related instances.
     */


            /**
             * @ngdoc method
             * @name lbServices.Product#accessories
             * @methodOf lbServices.Product
             *
             * @description
             *
             * accessories consultas de Product.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `filter` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
        R.accessories = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::get::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#count
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Recuentos accessories de Product.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
        R.accessories.count = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::count::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#create
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Crea una nueva instancia en accessories de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
        R.accessories.create = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::create::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#createMany
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Crea una nueva instancia en accessories de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
        R.accessories.createMany = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::createMany::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#destroyAll
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Suprime todos los accessories de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.accessories.destroyAll = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::delete::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#destroyById
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Suprimir un elemento relacionado por id para accessories.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para accessories
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.accessories.destroyById = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::destroyById::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#exists
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Comprobar la existencia de la relación accessories con un elemento por id.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para accessories
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
        R.accessories.exists = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::exists::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#findById
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Buscar un elemento relacionado por id para accessories.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para accessories
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
        R.accessories.findById = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::findById::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#link
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Añadir un elemento relacionado por id para accessories.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `fk` – `{*}` - Clave foránea para accessories
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
        R.accessories.link = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::link::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#unlink
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Eliminar la relación accessories con un elemento por id.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para accessories
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.accessories.unlink = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::unlink::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.accessories#updateById
             * @methodOf lbServices.Product.accessories
             *
             * @description
             *
             * Actualizar un elemento relacionado por id para accessories.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `fk` – `{*}` - Clave foránea para accessories
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Accessory` object.)
             * </em>
             */
        R.accessories.updateById = function() {
          var TargetResource = $injector.get("Accessory");
          var action = TargetResource["::updateById::Product::accessories"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product#model
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Capta la relación belongsTo model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
        R.model = function() {
          var TargetResource = $injector.get("ProductModel");
          var action = TargetResource["::get::Product::model"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product#type
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Capta la relación belongsTo type.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductType` object.)
             * </em>
             */
        R.type = function() {
          var TargetResource = $injector.get("ProductType");
          var action = TargetResource["::get::Product::type"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product#variant
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Capta la relación belongsTo variant.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariant` object.)
             * </em>
             */
        R.variant = function() {
          var TargetResource = $injector.get("ProductVariant");
          var action = TargetResource["::get::Product::variant"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product#option
             * @methodOf lbServices.Product
             *
             * @description
             *
             * Capta la relación belongsTo option.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `refresh` – `{boolean=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariantOption` object.)
             * </em>
             */
        R.option = function() {
          var TargetResource = $injector.get("ProductVariantOption");
          var action = TargetResource["::get::Product::option"];
          return action.apply(R, arguments);
        };
    /**
     * @ngdoc object
     * @name lbServices.Product.stocks
     * @header lbServices.Product.stocks
     * @object
     * @description
     *
     * The object `Product.stocks` groups methods
     * manipulating `Stock` instances related to `Product`.
     *
     * Call {@link lbServices.Product#stocks Product.stocks()}
     * to query all related instances.
     */


            /**
             * @ngdoc method
             * @name lbServices.Product#stocks
             * @methodOf lbServices.Product
             *
             * @description
             *
             * stocks consultas de Product.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `filter` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
        R.stocks = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::get::Product::stocks"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.stocks#count
             * @methodOf lbServices.Product.stocks
             *
             * @description
             *
             * Recuentos stocks de Product.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
        R.stocks.count = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::count::Product::stocks"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.stocks#create
             * @methodOf lbServices.Product.stocks
             *
             * @description
             *
             * Crea una nueva instancia en stocks de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
        R.stocks.create = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::create::Product::stocks"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.stocks#createMany
             * @methodOf lbServices.Product.stocks
             *
             * @description
             *
             * Crea una nueva instancia en stocks de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
        R.stocks.createMany = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::createMany::Product::stocks"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.stocks#destroyAll
             * @methodOf lbServices.Product.stocks
             *
             * @description
             *
             * Suprime todos los stocks de este modelo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `where` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.stocks.destroyAll = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::delete::Product::stocks"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.stocks#destroyById
             * @methodOf lbServices.Product.stocks
             *
             * @description
             *
             * Suprimir un elemento relacionado por id para stocks.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para stocks
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
        R.stocks.destroyById = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::destroyById::Product::stocks"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.stocks#findById
             * @methodOf lbServices.Product.stocks
             *
             * @description
             *
             * Buscar un elemento relacionado por id para stocks.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `options` – `{object=}` -
             *
             *  - `fk` – `{*}` - Clave foránea para stocks
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
        R.stocks.findById = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::findById::Product::stocks"];
          return action.apply(R, arguments);
        };

            /**
             * @ngdoc method
             * @name lbServices.Product.stocks#updateById
             * @methodOf lbServices.Product.stocks
             *
             * @description
             *
             * Actualizar un elemento relacionado por id para stocks.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Product id
             *
             *  - `fk` – `{*}` - Clave foránea para stocks
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
        R.stocks.updateById = function() {
          var TargetResource = $injector.get("Stock");
          var action = TargetResource["::updateById::Product::stocks"];
          return action.apply(R, arguments);
        };


        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.ProductModel
 * @header lbServices.ProductModel
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ProductModel` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "ProductModel",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/ProductModels/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#create
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/ProductModels",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#createMany
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/ProductModels",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#findById
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/ProductModels/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#find
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/ProductModels",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#deleteById
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/ProductModels/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#count
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/ProductModels/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#prototype$patchAttributes
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ProductModel id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/ProductModels/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#prototype$updatePrices
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Actualiza los precios de un modelo de un producto.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ProductModel id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `newPrice` – `{number}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
            "prototype$updatePrices": {
              url: urlBase + "/ProductModels/:id/updatePrices",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#sendNotification
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Envía una notificación sobre el cambio de precio de un producto.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method does not accept any data. Supply an empty object.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
            "sendNotification": {
              url: urlBase + "/ProductModels/sendNotification",
              method: "POST",
            },

            // INTERNAL. Use Product.model() instead.
            "::get::Product::model": {
              url: urlBase + "/Products/:id/model",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.ProductModel#destroyById
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#removeById
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.ProductModel#prototype$updateAttributes
             * @methodOf lbServices.ProductModel
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - ProductModel id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductModel` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.ProductModel#modelName
        * @propertyOf lbServices.ProductModel
        * @description
        * The name of the model represented by this $resource,
        * i.e. `ProductModel`.
        */
        R.modelName = "ProductModel";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.ProductType
 * @header lbServices.ProductType
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ProductType` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "ProductType",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/ProductTypes/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.ProductType#create
             * @methodOf lbServices.ProductType
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductType` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/ProductTypes",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductType#createMany
             * @methodOf lbServices.ProductType
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductType` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/ProductTypes",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductType#find
             * @methodOf lbServices.ProductType
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductType` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/ProductTypes",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductType#prototype$patchAttributes
             * @methodOf lbServices.ProductType
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductType` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/ProductTypes/:id",
              method: "PATCH",
            },

            // INTERNAL. Use Product.type() instead.
            "::get::Product::type": {
              url: urlBase + "/Products/:id/type",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.ProductType#prototype$updateAttributes
             * @methodOf lbServices.ProductType
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductType` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.ProductType#modelName
        * @propertyOf lbServices.ProductType
        * @description
        * The name of the model represented by this $resource,
        * i.e. `ProductType`.
        */
        R.modelName = "ProductType";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.ProductVariant
 * @header lbServices.ProductVariant
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ProductVariant` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "ProductVariant",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/ProductVariants/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.ProductVariant#create
             * @methodOf lbServices.ProductVariant
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariant` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/ProductVariants",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductVariant#createMany
             * @methodOf lbServices.ProductVariant
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariant` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/ProductVariants",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductVariant#find
             * @methodOf lbServices.ProductVariant
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariant` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/ProductVariants",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductVariant#prototype$patchAttributes
             * @methodOf lbServices.ProductVariant
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariant` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/ProductVariants/:id",
              method: "PATCH",
            },

            // INTERNAL. Use Product.variant() instead.
            "::get::Product::variant": {
              url: urlBase + "/Products/:id/variant",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.ProductVariant#prototype$updateAttributes
             * @methodOf lbServices.ProductVariant
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariant` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.ProductVariant#modelName
        * @propertyOf lbServices.ProductVariant
        * @description
        * The name of the model represented by this $resource,
        * i.e. `ProductVariant`.
        */
        R.modelName = "ProductVariant";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.ProductVariantOption
 * @header lbServices.ProductVariantOption
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ProductVariantOption` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "ProductVariantOption",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/ProductVariantOptions/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.ProductVariantOption#create
             * @methodOf lbServices.ProductVariantOption
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariantOption` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/ProductVariantOptions",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductVariantOption#createMany
             * @methodOf lbServices.ProductVariantOption
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariantOption` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/ProductVariantOptions",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductVariantOption#find
             * @methodOf lbServices.ProductVariantOption
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariantOption` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/ProductVariantOptions",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.ProductVariantOption#prototype$patchAttributes
             * @methodOf lbServices.ProductVariantOption
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariantOption` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/ProductVariantOptions/:id",
              method: "PATCH",
            },

            // INTERNAL. Use Product.option() instead.
            "::get::Product::option": {
              url: urlBase + "/Products/:id/option",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.ProductVariantOption#prototype$updateAttributes
             * @methodOf lbServices.ProductVariantOption
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `ProductVariantOption` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.ProductVariantOption#modelName
        * @propertyOf lbServices.ProductVariantOption
        * @description
        * The name of the model represented by this $resource,
        * i.e. `ProductVariantOption`.
        */
        R.modelName = "ProductVariantOption";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.PurchaseOrder
 * @header lbServices.PurchaseOrder
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `PurchaseOrder` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "PurchaseOrder",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/PurchaseOrders/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#create
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/PurchaseOrders",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#createMany
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/PurchaseOrders",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#findById
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/PurchaseOrders/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#find
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/PurchaseOrders",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#findOne
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Find first instance of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
            "findOne": {
              url: urlBase + "/PurchaseOrders/findOne",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#deleteById
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/PurchaseOrders/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#count
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/PurchaseOrders/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#prototype$patchAttributes
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PurchaseOrder id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/PurchaseOrders/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#excelReport
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` -
             *
             *  - `req` – `{object=}` -
             *
             *  - `res` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
            "excelReport": {
              url: urlBase + "/PurchaseOrders/excelReport",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#prototype$addFile
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Carga un archivo pdf para asignarla a la orden de compra.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `ctx` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
            "prototype$addFile": {
              url: urlBase + "/PurchaseOrders/:id/addFile",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#destroyById
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#removeById
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.PurchaseOrder#prototype$updateAttributes
             * @methodOf lbServices.PurchaseOrder
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PurchaseOrder id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `PurchaseOrder` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.PurchaseOrder#modelName
        * @propertyOf lbServices.PurchaseOrder
        * @description
        * The name of the model represented by this $resource,
        * i.e. `PurchaseOrder`.
        */
        R.modelName = "PurchaseOrder";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.SellerHasClient
 * @header lbServices.SellerHasClient
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `SellerHasClient` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "SellerHasClient",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/SellerHasClients/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#create
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/SellerHasClients",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#createMany
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/SellerHasClients",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#findById
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/SellerHasClients/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#find
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/SellerHasClients",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#deleteById
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/SellerHasClients/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#prototype$patchAttributes
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - SellerHasClient id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/SellerHasClients/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#prototype$getAssignedClients
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Devuelve la lista de clientes que tiene asignado el vendedor.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
            "prototype$getAssignedClients": {
              url: urlBase + "/SellerHasClients/:id/getAssignedClients",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#destroyById
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#removeById
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.SellerHasClient#prototype$updateAttributes
             * @methodOf lbServices.SellerHasClient
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - SellerHasClient id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SellerHasClient` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.SellerHasClient#modelName
        * @propertyOf lbServices.SellerHasClient
        * @description
        * The name of the model represented by this $resource,
        * i.e. `SellerHasClient`.
        */
        R.modelName = "SellerHasClient";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Stock
 * @header lbServices.Stock
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Stock` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Stock",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Stocks/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Stock#create
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Stocks",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#createMany
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Stocks",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#find
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Stocks",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#findOne
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Find first instance of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "findOne": {
              url: urlBase + "/Stocks/findOne",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#updateAll
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
            "updateAll": {
              url: urlBase + "/Stocks/update",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#deleteById
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Stocks/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#count
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/Stocks/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#prototype$patchAttributes
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Stock id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Stocks/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#findByImei
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Recupera los datos de un producto por su número de serie/IMEI.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `imei` – `{string}` - Número de serie del producto.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "findByImei": {
              url: urlBase + "/Stocks/findByImei",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#getAssignment
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `warehouseId` – `{string}` - Identificador del almacén.
             *
             *  - `date` – `{date}` - Fecha de asignación del stock.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "getAssignment": {
              url: urlBase + "/Stocks/getAssignment",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#multipleAssignmentClient
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Asigna un cliente a varios stocks.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Objeto con identificador del cliente e identificadores de los stocks.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "multipleAssignmentClient": {
              url: urlBase + "/Stocks/multipleAssignmentClient",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#setMultipleSale
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Registra las ventas realizadas por un vendedor.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Objeto con los identificadores de los stocks que se van a registrar como vendidos
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "setMultipleSale": {
              url: urlBase + "/Stocks/setMultipleSale",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#registerSale
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Registra las ventas realizadas por un vendedor.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Objeto con los identificadores de los stocks que se van a registrar como vendidos
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "registerSale": {
              url: urlBase + "/Stocks/registerSale",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#setReportSale
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Generar el reporte de series masivas.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object}` - Array con todos los datos a buscar.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "setReportSale": {
              url: urlBase + "/Stocks/setReportSale",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#pay
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Add a payment for the given imei.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` -
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "pay": {
              url: urlBase + "/Stocks/pay",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Stock#setScanByImei
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Marca un producto como scaneado.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object}` - Objeto con los datos del producto y del almacén.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
            "setScanByImei": {
              url: urlBase + "/Stocks/setScanByImei",
              method: "POST",
            },

            // INTERNAL. Use Product.stocks.findById() instead.
            "::findById::Product::stocks": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/stocks/:fk",
              method: "GET",
            },

            // INTERNAL. Use Product.stocks.destroyById() instead.
            "::destroyById::Product::stocks": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/stocks/:fk",
              method: "DELETE",
            },

            // INTERNAL. Use Product.stocks.updateById() instead.
            "::updateById::Product::stocks": {
              params: {
                'fk': '@fk',
              },
              url: urlBase + "/Products/:id/stocks/:fk",
              method: "PUT",
            },

            // INTERNAL. Use Product.stocks() instead.
            "::get::Product::stocks": {
              isArray: true,
              url: urlBase + "/Products/:id/stocks",
              method: "GET",
            },

            // INTERNAL. Use Product.stocks.create() instead.
            "::create::Product::stocks": {
              url: urlBase + "/Products/:id/stocks",
              method: "POST",
            },

            // INTERNAL. Use Product.stocks.createMany() instead.
            "::createMany::Product::stocks": {
              isArray: true,
              url: urlBase + "/Products/:id/stocks",
              method: "POST",
            },

            // INTERNAL. Use Product.stocks.destroyAll() instead.
            "::delete::Product::stocks": {
              url: urlBase + "/Products/:id/stocks",
              method: "DELETE",
            },

            // INTERNAL. Use Product.stocks.count() instead.
            "::count::Product::stocks": {
              url: urlBase + "/Products/:id/stocks/count",
              method: "GET",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Stock#update
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Update instances of the model matched by {{where}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Information related to the outcome of the operation
             */
        R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.Stock#destroyById
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Stock#removeById
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Stock#prototype$updateAttributes
             * @methodOf lbServices.Stock
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Stock id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Stock` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Stock#modelName
        * @propertyOf lbServices.Stock
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Stock`.
        */
        R.modelName = "Stock";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.SysUser
 * @header lbServices.SysUser
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `SysUser` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "SysUser",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/SysUsers/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.SysUser#create
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/SysUsers",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#createMany
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/SysUsers",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#findById
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/SysUsers/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#find
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/SysUsers",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#count
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/SysUsers/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#prototype$patchAttributes
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - SysUser id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/SysUsers/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#login
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Login a user with username/email and password.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
             *   Default value: `user`.
             *
             *  - `rememberMe` - `boolean` - Whether the authentication credentials
             *     should be remembered in localStorage across app/browser restarts.
             *     Default: `true`.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * El cuerpo de respuesta contiene propiedades de la AccessToken creada durante el inicio de la sesión.
             * Dependiendo del valor del parámetro `include`, el cuerpo puede contener propiedades adicionales:
             *   - `user` - `U+007BUserU+007D` - Datos del usuario conectado actualmente. (`include=user`)
             *
             */
            "login": {
              params: {
                include: 'user',
              },
              interceptor: {
                response: function(response) {
                  var accessToken = response.data;
                  LoopBackAuth.setUser(
                    accessToken.id, accessToken.userId, accessToken.user);
                  LoopBackAuth.rememberMe =
                    response.config.params.rememberMe !== false;
                  LoopBackAuth.save();
                  return response.resource;
                },
              },
              url: urlBase + "/SysUsers/login",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#logout
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Logout a user with access token.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `access_token` – `{string=}` - Do not supply this argument, it is automatically extracted from request headers.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            "logout": {
              interceptor: {
                response: function(response) {
                  LoopBackAuth.clearUser();
                  LoopBackAuth.clearStorage();
                  return response.resource;
                },
                responseError: function(responseError) {
                  LoopBackAuth.clearUser();
                  LoopBackAuth.clearStorage();
                  return responseError.resource;
                },
              },
              url: urlBase + "/SysUsers/logout",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#prototype$getStock
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Devuelve el usuario con el equipo asignado a su cuenta.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - SysUser id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "prototype$getStock": {
              url: urlBase + "/SysUsers/:id/getStock",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#findStock
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * <em>
             * (The remote method definition does not provide any description.)
             * </em>
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `imei` – `{string}` - IMEI del producto.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "findStock": {
              url: urlBase + "/SysUsers/findStock",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#getAccessToken
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Devuelve el token de acceso con el identificador dado, incluyendo el usuario al que le pertenece.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `tokenId` – `{string}` - Identificador del token de acceso.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "getAccessToken": {
              url: urlBase + "/SysUsers/getAccessToken/:tokenId",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#setClient
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Asigna varios clientes a un solo vendedor.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Objeto con identificador de vendedor e identificadores de los clientes.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "setClient": {
              url: urlBase + "/SysUsers/set-client",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#setSaleReport
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Generar el reporte de rutas.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object}` - Array con los IDS de los ejecutivos.
             *
             *  - `res` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "setSaleReport": {
              url: urlBase + "/SysUsers/setSaleReport",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#setReportSeries
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Generar el reporte de series masivas.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `data` – `{object}` - Array con todos los series.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "setReportSeries": {
              url: urlBase + "/SysUsers/setReportSeries",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#prototype$setSale
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Registra una compra
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - SysUser id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `idClient` – `{string}` - Indentificador UUID del cliente.
             *
             *  - `idStock` – `{string}` - Indentificador UUID del stock.
             *
             *  - `salesPrice` – `{number}` - Precio en el que se vendio el stock.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `success` – `{boolean=}` -
             */
            "prototype$setSale": {
              url: urlBase + "/SysUsers/:id/setSale",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#loginCustomize
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Devuelve la lista de usuarios sellers activos.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "loginCustomize": {
              url: urlBase + "/SysUsers/loginCustomize",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#prototype$removeStocks
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Remueve del almacén del vendedor productos.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object}` - Objeto con los datos del almacén destino e ids de los stocks.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
            "prototype$removeStocks": {
              url: urlBase + "/SysUsers/:id/removeStocks",
              method: "POST",
            },

            // INTERNAL. Use Order.seller() instead.
            "::get::Order::seller": {
              url: urlBase + "/Orders/:id/seller",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.SysUser#getCurrent
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Get data of the currently logged user. Fail with HTTP result 401
             * when there is no user logged in.
             *
             * @param {function(Object,Object)=} successCb
             *    Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *    `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             */
            'getCurrent': {
              url: urlBase + "/SysUsers" + '/:id',
              method: 'GET',
              params: {
                id: function() {
                  var id = LoopBackAuth.currentUserId;
                  if (id == null) id = '__anonymous__';
                  return id;
                },
              },
              interceptor: {
                response: function(response) {
                  LoopBackAuth.currentUserData = response.data;
                  return response.resource;
                },
                responseError: function(responseError) {
                  LoopBackAuth.clearUser();
                  LoopBackAuth.clearStorage();
                  return $q.reject(responseError);
                },
              },
              __isGetCurrentUser__: true,
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.SysUser#prototype$updateAttributes
             * @methodOf lbServices.SysUser
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - SysUser id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `SysUser` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];

        /**
         * @ngdoc method
         * @name lbServices.SysUser#getCachedCurrent
         * @methodOf lbServices.SysUser
         *
         * @description
         *
         * Get data of the currently logged user that was returned by the last
         * call to {@link lbServices.SysUser#login} or
         * {@link lbServices.SysUser#getCurrent}. Return null when there
         * is no user logged in or the data of the current user were not fetched
         * yet.
         *
         * @returns {Object} A SysUser instance.
         */
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

        /**
         * @ngdoc method
         * @name lbServices.SysUser#isAuthenticated
         * @methodOf lbServices.SysUser
         *
         * @returns {boolean} True if the current user is authenticated (logged in).
         */
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

        /**
         * @ngdoc method
         * @name lbServices.SysUser#getCurrentId
         * @methodOf lbServices.SysUser
         *
         * @returns {Object} Id of the currently logged-in user or null.
         */
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

        /**
        * @ngdoc property
        * @name lbServices.SysUser#modelName
        * @propertyOf lbServices.SysUser
        * @description
        * The name of the model represented by this $resource,
        * i.e. `SysUser`.
        */
        R.modelName = "SysUser";



        return R;
      }]);

/**
 * @ngdoc object
 * @name lbServices.Warehouse
 * @header lbServices.Warehouse
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Warehouse` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
  module.factory(
    "Warehouse",
    [
      'LoopBackResource', 'LoopBackAuth', '$injector', '$q',
      function(LoopBackResource, LoopBackAuth, $injector, $q) {
        var R = LoopBackResource(
        urlBase + "/Warehouses/:id",
          { 'id': '@id' },
          {

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#create
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
            "create": {
              url: urlBase + "/Warehouses",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#createMany
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Create a new instance of the model and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `data` – `{object=}` - Model instance data
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
            "createMany": {
              isArray: true,
              url: urlBase + "/Warehouses",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#findById
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Find a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `filter` – `{object=}` - Filter defining fields and include - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
            "findById": {
              url: urlBase + "/Warehouses/:id",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#find
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Find all instances of the model matched by filter from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit - must be a JSON-encoded string ({"something":"value"})
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
            "find": {
              isArray: true,
              url: urlBase + "/Warehouses",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#deleteById
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
            "deleteById": {
              url: urlBase + "/Warehouses/:id",
              method: "DELETE",
            },

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#count
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Count instances of the model matched by where from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            "count": {
              url: urlBase + "/Warehouses/count",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#prototype$patchAttributes
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Warehouse id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
            "prototype$patchAttributes": {
              url: urlBase + "/Warehouses/:id",
              method: "PATCH",
            },

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#inStock
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Ejemplo.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{string}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
            "inStock": {
              isArray: true,
              url: urlBase + "/Warehouses/inStock",
              method: "GET",
            },

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#prototype$addUser
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Agrega al usuario al acceso del almacén.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Warehouse id
             *
             * @param {Object} postData Request data.
             *
             *  - `options` – `{object=}` -
             *
             *  - `idUser` – `{string}` - User id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
            "prototype$addUser": {
              url: urlBase + "/Warehouses/:id/addUser",
              method: "POST",
            },

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#prototype$delUser
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Elimina el acceso del usuario al almacén.
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             *  - `idUser` – `{string}` - User id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
            "prototype$delUser": {
              url: urlBase + "/Warehouses/:id/delUser",
              method: "POST",
            },
          }
        );



            /**
             * @ngdoc method
             * @name lbServices.Warehouse#destroyById
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
        R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#removeById
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Delete a model instance by {{id}} from the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
        R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Warehouse#prototype$updateAttributes
             * @methodOf lbServices.Warehouse
             *
             * @description
             *
             * Patch attributes for a model instance and persist it into the data source.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Warehouse id
             *
             *  - `options` – `{object=}` -
             *
             *  - `data` – `{object=}` - An object of model property name/value pairs
             *
             *  - `options` – `{object=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Warehouse` object.)
             * </em>
             */
        R["prototype$updateAttributes"] = R["prototype$patchAttributes"];


        /**
        * @ngdoc property
        * @name lbServices.Warehouse#modelName
        * @propertyOf lbServices.Warehouse
        * @description
        * The name of the model represented by this $resource,
        * i.e. `Warehouse`.
        */
        R.modelName = "Warehouse";



        return R;
      }]);


  module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId', 'rememberMe'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    };

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    };

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      try {
        var key = propsPrefix + name;
        if (value == null) value = '';
        storage[key] = value;
      } catch (err) {
        console.log('Cannot access local/session storage:', err);
      }
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', ['$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {
          // filter out external requests
          var host = getHost(config.url);
          if (host && config.url.indexOf(urlBaseHost) === -1) {
            return config;
          }

          if (LoopBackAuth.accessTokenId) {
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 }},
              status: 401,
              config: config,
              headers: function() { return undefined; },
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        },
      };
    }])

  /**
   * @ngdoc object
   * @name lbServices.LoopBackResourceProvider
   * @header lbServices.LoopBackResourceProvider
   * @description
   * Use `LoopBackResourceProvider` to change the global configuration
   * settings used by all models. Note that the provider is available
   * to Configuration Blocks only, see
   * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
   * for more details.
   *
   * ## Example
   *
   * ```js
   * angular.module('app')
   *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
   * ```
   */
  .provider('LoopBackResource', function LoopBackResourceProvider() {
    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setAuthHeader
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} header The header name to use, e.g. `X-Access-Token`
     * @description
     * Configure the REST transport to use a different header for sending
     * the authentication token. It is sent in the `Authorization` header
     * by default.
     */
    this.setAuthHeader = function(header) {
      authHeader = header;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#getAuthHeader
     * @methodOf lbServices.LoopBackResourceProvider
     * @description
     * Get the header name that is used for sending the authentication token.
     */
    this.getAuthHeader = function() {
      return authHeader;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#setUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
     * @description
     * Change the URL of the REST API server. By default, the URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.setUrlBase = function(url) {
      urlBase = url;
      urlBaseHost = getHost(urlBase) || location.host;
    };

    /**
     * @ngdoc method
     * @name lbServices.LoopBackResourceProvider#getUrlBase
     * @methodOf lbServices.LoopBackResourceProvider
     * @description
     * Get the URL of the REST API server. The URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.getUrlBase = function() {
      return urlBase;
    };

    this.$get = ['$resource', function($resource) {
      var LoopBackResource = function(url, params, actions) {
        var resource = $resource(url, params, actions);

        // Angular always calls POST on $save()
        // This hack is based on
        // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
        resource.prototype.$save = function(success, error) {
          // Fortunately, LoopBack provides a convenient `upsert` method
          // that exactly fits our needs.
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };

      LoopBackResource.getUrlBase = function() {
        return urlBase;
      };

      LoopBackResource.getAuthHeader = function() {
        return authHeader;
      };

      return LoopBackResource;
    }];
  });
})(window, window.angular);
