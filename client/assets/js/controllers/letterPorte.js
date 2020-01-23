angular.module('systemax')

  /**
   * @description
   */
  .controller('letterPorteBlankController', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      $rootScope.menu = 'letterPorte';
    }
  ])
  /**
   * @description
   */
  .controller('letterPorteList', [
    '$scope',
    'Warehouse',
    'Invoice',
    // Funciones generales
    function($scope, Warehouse, Invoice) {
      /**
       * @name getRoutes
       * @description Recupera los datos de las rutas de venta.
       * @param {string} parentId Identificador del almacén padre.
       */
      function getRoutes(parentId) {
        var warehouseFilter = {
          include: [{
            relation: 'stocks',
            scope: {
              include: [{
                relation: 'product',
                scope: {
                  include: 'model'
                }
              }],
              where: {
                and: [{
                    status: 'assigned'
                  },
                  {
                    validate: false
                  }
                ]
              },
              order: ['IMEI']
            }
          }],
          where: {
            and: [{
                type: 'seller'
              },
              {
                idParent: parentId
              }
            ]
          },
          order: ['name']
        };

        Warehouse.find({
            filter: warehouseFilter
          })
          .$promise
          .then(
            function(warehouses) {
              $scope.busy = false;
              $scope.warehouses = warehouses;
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      } // End getRoutes

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
              publicPrice: stock.product.model.priceInvoice,
              name: tmp[0],
              stocks: [{
                id: stock.id,
                IMEI: stock.IMEI
              }]
            };
            $scope.products.push(newProduct);
          } else {
            find.stocks.push({
              id: stock.id,
              IMEI: stock.IMEI
            });
          }
        });
        $scope.products = _.sortBy($scope.products, 'name');
        $scope.busy = false;
      } // End processStocks
      // Variables del $scope
      $scope.busy = true;
      // Extensión del objeto Math
      $scope.Math = window.Math;
      $scope.today = $scope.getToday();
      $scope.warehouses = [];
      // Funciones del $scope
      /**
       * @name search
       * @description Valida el formulario de búsqueda de rutas de ventas.
       */
      $scope.search = function() {
        $scope.products = [];
        $scope.productsAll = [];
        if (!$scope.warehouse.id) {
          return $scope.notify('Debe elegir una ruta de venta de la lista.');
        }
        var find = _.find($scope.warehouses, function(w) {
          return w.id === $scope.warehouse.id
        });
        if (!find) {
          return $scope.notify('No se recuperaron los datos de la ruta.');
        } else {
          $scope.busy = true;
          $scope.warehouse.name = find.name;
          $scope.warehouse.stockSize = find.stocks.length;
          processStocks(find.stocks);
          processStocksAll(find.stocks);
        }
      }; // End search



      /**
       * @name processStocksAll
       * @description Procesa los stocks para generar la carta porte.
       * @param {object} stocks Arreglo de objetos
       */
      function processStocksAll(stocks) {
        let idx = 0;
        _.each(stocks, function(stock, index) {
          var find = _.find($scope.productsAll, function(p) {
            return p.idProductModel === stock.product.idProductModel;
          });

          var find1 = _.find($scope.productsAll, function(p) {
            return p.idx === idx;
          });

          //...¿Se encontró algún producto igual?
          if (!find) {
            var tmp = stock.product.name.split(',');
            var newProduct = {
              idProductModel: stock.product.idProductModel,
              publicPrice: stock.product.model.priceInvoice,
              name: tmp[0],
              stocks: [stock.IMEI]
            };
            $scope.productsAll.push(newProduct);
          } else {
            //...¿El limite del stock es menor a 50?
            if (find.stocks.length < 50) {
              find.stocks.push(stock.IMEI);
            } else {
              if (!find1 || find1.stocks.length > 50) {
                idx++;
                var newProduct1 = {
                  idProductModel: find.idProductModel,
                  publicPrice: find.publicPrice,
                  name: find.name,
                  stocks: [stock.IMEI],
                  idx: idx
                };
                $scope.productsAll.push(newProduct1);
              } else {
                find1.stocks.push(stock.IMEI);
              }
            }
          }
        });
        $scope.productsAll = _.sortBy($scope.productsAll, 'name');
      } // End processStocksAll

      /**
       * @name generateLetter
       * @description Función para generar la carta porte.
       */
      $scope.showGenerateLetter = false;
      $scope.generateLetter = function() {
        $scope.loading = true; //Mostrar mensaje de que se esta cargando la app
        var newLetter = {
          items: $scope.productsAll,
          seller: $scope.warehouse.name
        };

        Invoice.generateLetter(newLetter)
          .$promise
          .then(function(response) {
            console.log("La factura se ha generado correctamente!!", response);
            $scope.loading = false;
            $scope.showGenerateLetter = true;
            $scope.urlLetter = response.responsePdf.url;
          }, function(err) {
            $scope.loading = false;
            console.log("Error devuelto por el servidor", JSON.stringify(err));
          })
      }

      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        getRoutes(u.idWarehouse);
      }); // End $watch.currentUser
      // $watch.warehouse.id
      $scope.$watch('warehouse.id', function(warehouseId) {
        if (!warehouseId) return $scope.products = [];
      }); // End $watch.warehouse.id
    }
  ])


  /**
   * @description Controlador para mostrar los almacenes
   */
  .controller('listComplementController', [
    '$rootScope',
    '$scope',
    '$state',
    'Assignment',
    'Warehouse',
    // Funciones generales
    function($rootScope, $scope, $state, Assignment, Warehouse) {

      // Variables generales
      // Objeto de filtro
      var assignmentFilter = {
        include: ['destiny', 'origin', 'receiver', 'sender'],
        where: {
          and: [{
            or: [{
              status: 'received'
            }]
          }, {
            or: [{
                idOrigin: ''
              },
              {
                idDestiny: ''
              }
            ]
          }]
        },
        order: 'created DESC'
      };
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
              $scope.notify('Registro creado satisfactoriamente.',
                'success');
              $state.go('admin.assignment.edit', {
                assignmentId: response.id
              });
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      } // End createAssignment
      /**
       * @name getAssignmentHistory
       * @description Recupera el historial de asignaciones de este almacén.
       */
      function getAssignmentHistory() {
        Assignment.find({
            filter: assignmentFilter
          })
          .$promise
          .then(
            function(history) {
              $scope.dateToday = moment().format('L');
              _.each(history, function(item, index) {
                var format = moment(item.created).format('L');
                if (format === $scope.dateToday) {
                  //console.log(`Index: ${index + 1}, number: ${item.number}`);
                  $scope.arrayComplement.push(item);
                }
              })
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      } // End getAssignmentHistory
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
            or: [{
                isMain: true
              },
              {
                idParent: warehouseId
              },
              {
                and: [{
                    idParent: parentId
                  },
                  {
                    type: 'place'
                  }
                ]
              }
            ]
          },
          order: ['isMain DESC', 'type', 'name']
        };
        Warehouse.find({
            filter: warehousesFilter
          })
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
      } // End getDestinyWarehouses
      /**
       * @name getOpenAssignment
       * @description Recupera las asignaciones abieras o en transito.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getOpenAssignment(warehouseId) {
        var openFilter = {
          include: ['destiny', 'origin', 'sender'],
          where: {
            and: [{
                idOrigin: warehouseId
              },
              {
                or: [{
                    status: 'open'
                  },
                  {
                    status: 'in-transit'
                  }
                ]
              }
            ]
          },
          order: 'created DESC'
        };
        if ($scope.currentUser.type !== 'admin') {
          openFilter.where.and.push({
            idSender: $scope.currentUser.id
          });
        }
        Assignment.find({
            filter: openFilter
          })
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
      } // End getOpenAssignment
      /**
       * @name getOriginWarehouse
       * @description Recupera los datos del almacén de origen.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getOriginWarehouse(warehouseId) {
        Warehouse.findById({
            id: warehouseId
          })
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
      } // End getOriginWarehouse
      /**
       * @name getToReceiveAssigment
       * @description Recupera las asignaciones enviadas a este almacén.
       * @param {string} warehouseId Identificador del almacén.
       */
      function getToReceiveAssigment(warehouseId) {
        var receiveFilter = {
          include: ['destiny', 'origin', 'sender'],
          where: {
            and: [{
                idDestiny: warehouseId
              },
              {
                status: 'in-transit'
              }
            ]
          },
          order: 'created DESC'
        };
        Assignment.find({
            filter: receiveFilter
          })
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
      } // End getToReceiveAssigment
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de colores.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = assignmentFilter.where;
        Assignment.count({
            where: assignmentFilter.where || {}
          })
          .$promise
          .then(function(count) {
            if (assignmentFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      } // End recalculateCountAndReload
      // Variables del $scope
      // Objeto assignment
      $scope.assignment = {
        idOrigin: '',
        idSender: '',
        status: 'open',
        idDestiny: null
      };
      $scope.busy = true;
      // Objeto historico
      $scope.arrayComplement = []
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
      }; // End reloadData
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
      }; // End checkStatus

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
      }; // End validateDate
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
      }); // End $watch.currentUSer
      // Código principal

    }
  ])

  /**
   * @description Controlador para la hoja de asignación.
   */
  .controller('AssignmentSheet', [
    '$scope',
    '$state',
    'Assignment',
    'Invoice',
    function($scope, $state, Assignment, Invoice) {
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
            {
              relation: 'stocks',
              scope: {
                include: [{
                  relation: 'product',
                  scope: {
                    include: 'model'
                  }
                }],
                order: ['IMEI']
              }
            }
          ]
        };
        Assignment.findById({
            id: assignmentId,
            filter: assignmentFilter
          })
          .$promise
          .then(
            function(assignment) {
              $scope.assignment = assignment;
              processStocks(assignment.stocks);
              processStocksAll(assignment.stocks);
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      } // End getAssignment
      /**
       * @name processStocks
       * @description Procesa los stocks para generar la hoja de asignación.
       * @param {object} stocks Arreglo de objetos
       */
      function processStocks(stocks) {
        console.log("processStocks432423-->", stocks);
        _.each(stocks, function(stock) {
          var find = _.find($scope.products, function(p) {
            return p.idProductModel === stock.product.idProductModel;
          });
          if (!find) {
            var tmp = stock.product.name.split(',');
            var newProduct = {
              idProductModel: stock.product.idProductModel,
              name: tmp[0],
              publicPrice: stock.product.model.priceInvoice,
              stocks: [{
                id: stock.id,
                IMEI: stock.IMEI
              }]
            };
            $scope.products.push(newProduct);
          } else {
            find.stocks.push({
              id: stock.id,
              IMEI: stock.IMEI
            });
          }
        });
        $scope.products = _.sortBy($scope.products, 'name');
        //console.log("$scope.products", $scope.products);
        $scope.busy = false;
      } // End processStocks


      /**
       * @name processStocksAll
       * @description Procesa los stocks para generar la carta porte.
       * @param {object} stocks Arreglo de objetos
       */
      function processStocksAll(stocks) {
        let idx = 0;
        _.each(stocks, function(stock, index) {
          var find = _.find($scope.productsAll, function(p) {
            return p.idProductModel === stock.product.idProductModel;
          });

          var find1 = _.find($scope.productsAll, function(p) {
            return p.idx === idx;
          });

          //...¿Se encontró algún producto igual?
          if (!find) {
            var tmp = stock.product.name.split(',');
            var newProduct = {
              idProductModel: stock.product.idProductModel,
              publicPrice: stock.product.model.priceInvoice,
              name: tmp[0],
              stocks: [stock.IMEI]
            };
            $scope.productsAll.push(newProduct);
          } else {
            //...¿El limite del stock es menor a 50?
            if (find.stocks.length < 50) {
              find.stocks.push(stock.IMEI);
            } else {
              if (!find1 || find1.stocks.length > 50) {
                idx++;
                var newProduct1 = {
                  idProductModel: find.idProductModel,
                  publicPrice: find.publicPrice,
                  name: find.name,
                  stocks: [stock.IMEI],
                  idx: idx
                };
                $scope.productsAll.push(newProduct1);
              } else {
                find1.stocks.push(stock.IMEI);
              }
            }
          }
        });
        $scope.productsAll = _.sortBy($scope.productsAll, 'name');
      } // End processStocksAll


      /**
       * @name generateLetter
       * @description Valida el formulario de búsqueda de rutas de ventas.
       */
      $scope.showGenerateLetter = false;
      $scope.generateLetter = function() {
        $scope.loading = true; //Mostrar mensaje de que se esta cargando la app
        var newLetter = {
          items: $scope.productsAll,
          seller: $scope.assignment.destiny.name
        };

        Invoice.generateLetter(newLetter)
          .$promise
          .then(function(response) {
            console.log("La factura se ha generado correctamente!!", response);
            $scope.loading = false;
            $scope.showGenerateLetter = true;
            $scope.urlLetter = response.responsePdf.url;
          }, function(err) {
            $scope.loading = false;
            console.log("Error devuelto por el servidor", JSON.stringify(err));
          })
      }


      // Variables del $scope
      $scope.assignment = {};
      $scope.busy = true;
      $scope.products = [];
      $scope.productsAll = [];
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
      }); // End $watch.currentUser

    }
  ])


  /**
   * @description Controlador para la lista de productos.
   */
  .controller('ProductList', [
    '$rootScope',
    '$scope',
    'Product',
    'ProductModel',
    'Brand',
    function($rootScope, $scope, Product, ProductModel, Brand) {
      var brandFilter = {
        include: [{
          relation: 'models',
          scope: {
            include: 'products',
            order: 'name'
          }
        }],
        order: 'name'
      };


      /**
       * @name getModels
       * @description Recupera los datos de los modelos registrados.
       */
      function getModels() {
        Brand.find({
            filter: brandFilter
          })
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
                    priceInvoice: model.priceInvoice,
                    products: model.products
                  };
                  $scope.models.push(newRow);
                });
              });
              console.log("Mi lista de modelos", $scope.models);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      } // End getModels
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de colores
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = brandFilter.where;
        Brand.count({
            where: brandFilter.where || {}
          })
          .$promise
          .then(function(count) {
            if (brandFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      } // End recalculateCountAndReload

      // Objeto de modelos
      $scope.models = [];
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        brandFilter = _.extend(brandFilter, $scope.pagination.filter);
        getModels();
      }; // End reloadData

      // Código principal
      recalculateCountAndReload();

    }
  ])

  /**
   * @description Controlador para registro/actualización de los productos.
   */
  .controller('ProductForm', [
    '$scope',
    '$state',
    'Brand',
    'ProductModel',
    function($scope, $state, Brand, ProductModel) {
      // Éste controlador esta esperando el parámetro "productId" para buscar un producto
      // y así poder editar su información


      //...Buscar el modelo a editar
      ProductModel.findById({
          id: $state.params.productId
        })
        .$promise
        .then(function(brand) {
          console.log("Modelo a editar", brand);
          $scope.model = brand;
        }, function(err) {

          console.log("Error al editar el producto", err);
          $.notify({
            icon: 'glyphicon glyphicon-alert',
            message: 'No se pudo cargar la Marca'
          }, {
            type: 'danger'
          });
        });


      /**
       * @name updateProduct
       * @description Actualiza un registro de un producto.
       * @param {object} productObject Objeto con los datos del producto.
       */
      function updateProduct(productObject) {
        console.log("Datos del producto a actualizar", productObject.priceInvoice);
        ProductModel.prototype$patchAttributes({
            id: $scope.model.id
          }, {
            priceInvoice: productObject.priceInvoice
          })
          .$promise
          .then(
            function(response) {
              //console.log("El precio del equipo se actualizo correctamente!!!");
              $scope.notify('El equipo ' + $scope.model.name + ' ha sido actualizado correctamente.', 'success');
              $state.go('admin.letterPorte.prices');
            },
            function(reason) {
              var message;
              console.log(reason);
              if (!message) {
                message = 'No se pudo actualizar el producto, intente más tarde.';
              }
              $scope.notify(message, 'alert', 'danger');
            });
      } // End updateProduct



      /**
       * @description Función para actualizar la información del producto
       * @param  {object} productObject Información del producto
       * @return {promise}
       */
      $scope.save = function() {
        var errorMessage = null;
        if (!$scope.model.priceInvoice) {
          errorMessage = 'El precio del equipo es requerida.';
        } // End else

        if (errorMessage) {
          $scope.notify(errorMessage, 'info-sign', 'warning');
          return;
        }
        var productObject = _.clone($scope.model);
        //console.log('productObject', productObject);
        updateProduct(productObject);
      }; // End save

    }
  ]);
