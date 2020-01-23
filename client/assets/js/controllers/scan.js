angular.module('systemax')
  .controller('CutSellerBlankController', [
    '$rootScope',
    function($rootScope, $scope, Warehouse) {
      $rootScope.menu = 'cut';
    }
  ])
  /**
   * @description Controlador para registrar una venta.
   */
  .controller('CutSellerController', [
    '$scope',
    '$state',
    'SysUser',
    'Stock',
    '$stateParams',
    'SellerHasClient',
    function($scope, $state, SysUser, Stock, $stateParams, SellerHasClient) {

      var negative = document.getElementById('negative');
      var positive = document.getElementById('positive');
      $scope.itemSeller = {};
      $scope.myClients = []; //Lista de clientes que tiene asigando el vendedor/almacÃ©n
      $scope.selectAllClient = {
        items: []
      }

      SysUser.find({
        filter: {
          where: {
            type: 'seller'
          }
        }
      }).$promise.then(
        function(sellers) {
          $scope.allSellers = sellers;
          $scope.allSellers.push({
            id: "-new-",
            name: "-- ELIGE UN ASESOR DE VENTA --"
          });
          $scope.itemSeller.idSeller = $scope.allSellers[$scope.allSellers.length - 1].id;
          //console.log("Lista de todos los vendedores", $scope.allSellers);
        },
        function(err) {
          console.log(err);
          $scope.notify(err.data.error.message);
        });


      /*-----------------------------------------------------------------*
       * FunciÃ³n para seleccionar un vendedor y mandarlo a otra vista    *
       *-----------------------------------------------------------------*/
      $scope.cutSeller = function() {
        //console.log('vendedor seleccionado', $scope.itemSeller.idSeller);
        var errorMessage = null

        if ($scope.itemSeller.idSeller === -1 || $scope.itemSeller.idSeller === "-new-") {
          errorMessage = 'No haz seleccionando ningÃºn asesor de venta'
        }
        if (errorMessage) {
          $scope.notify(errorMessage, 'info-sign', 'warning')
          return
        }
        verifyAssignmentClient($scope.itemSeller.idSeller, function(err, stock) {
          if (err) {
            //console.log("Error en la lista de ventas", stock);
          } else {
            //console.log("Mis ventas", stock);
            if (stock.warehouseACL[0].warehouse.stocks.length > 0) {
              $scope.showModal('fa-info',
                'Falta asignarle clientes',
                '<p>Le falta ingresar los nombres de los cliente</p>', {
                  hideCancel: true
                },
                function() {
                  //
                });
              negative.play();
              //$scope.notify('Le falta ingresar los nombres de los clientes', 'error');
              //$state.go('admin.cut.scan', { idSeller : $scope.itemSeller.idSeller});
            } else {
              $state.go('admin.cut.scan', {
                idSeller: $scope.itemSeller.idSeller
              });
            }
          }
        });
      }


      /**
       * @name verifyAssignmentClient
       * @description Busca si alguna venta le falta por asignarle cliente
       * @param {string} idSeller ID del ejecutivo
       * @callback {object} sale Objeto con las ventas del ejecutivo
       */
      function verifyAssignmentClient(idSeller, cb) {
        let sellerFilter = {
          include: {
            relation: 'warehouseACL',
            scope: {
              include: {
                relation: 'warehouse',
                scope: {
                  include: {
                    relation: 'stocks',
                    scope: {
                      where: {
                        and: [{
                          or: [{
                            status: 'sold'
                          }]
                        }, {
                          validate: true
                        }, {
                          idClient: null
                        }]
                      },
                      include: [{
                          relation: 'logs',
                          scope: {
                            where: {
                              event: 'sold'
                            }
                          }
                        },
                        {
                          relation: 'product',
                          scope: {
                            include: {
                              relation: 'model',
                              scope: {
                                include: 'brand'
                              }
                            }
                          }
                        }
                      ],
                      order: 'idProduct'
                    }
                  }
                }
              },
              limit: 1,
              order: 'index'
            }
          }
        };

        SysUser.findById({
            id: idSeller,
            filter: sellerFilter
          })
          .$promise
          .then(
            function(stock) {
              //console.log("Respuesta de las ventas del ejecutivo", stock);
              cb(null, stock);
            },
            function(err) {
              cb(err);
            });
      } // End getStock


      $scope.changedValue = function(item) {
        console.log("Ejecutivo seleccionado", item);

        var filter = {
          where: {
            idSeller: item
          },
          include: [{
            relation: "client",
            scope: {
              fields: ["id", "name"]
            }
          }]
        };

        SellerHasClient.find({
          filter: filter
        }).$promise.then(
          function(myClients) {
            console.log("Respuesta de consulta", myClients);
            _.each(myClients, function(client) {
              $scope.myClients.push({
                id: client.client.id,
                tag: client.client.name
              })
            });
            $scope.myClients.push({
              id: "-new-",
              tag: "-- ELIGE UN CLIENTE --"
            });
            $scope.selectAllClient.idClient = $scope.myClients[$scope.myClients.length - 1].id;
            //console.log('El vendedor tiene asignado los siguientes clientes:',$scope.myClients)
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }

      /*============================================================
       * Lista de clientes que tiene asignado el vendedor/almacÃ©n
       *=============================================================*/
      function getmyClients() {
        var filter = {
          where: {
            idSeller: $scope.itemSeller.idSeller
          },
          include: [{
            relation: "client",
            scope: {
              fields: ["id", "name"]
            }
          }]
        };

        SellerHasClient.find({
          filter: filter
        }).$promise.then(
          function(myClients) {
            _.each(myClients, function(client) {
              $scope.myClients.push({
                id: client.client.id,
                tag: client.client.name
              })
            });
            $scope.myClients.push({
              id: "-new-",
              tag: "-- ELIGE UN CLIENTE --"
            });
            $scope.selectAllClient.idClient = $scope.myClients[$scope.myClients.length - 1].id;
            //console.log('El vendedor tiene asignado los siguientes clientes:',$scope.myClients)
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      } // End getmyClients*/

      getmyClients();

    }
  ])


  /**
   * @description Controlador para el corte de cambaceo.
   */
  .controller('CutSellerScanController', [
    '$rootScope',
    '$scope',
    '$sce',
    '$interval',
    '$timeout',
    '$state',
    '$window',
    'SysUser',
    'SellerHasClient',
    'Stock',
    '$stateParams',
    'Assignment',
    'CambaceoService',
    '$http',
    function($rootScope, $scope, $sce, $interval, $timeout, $state, $window, SysUser, SellerHasClient, Stock, $stateParams, Assignment, CambaceoService, $http) {

      //... Variables generales
      var negative = document.getElementById('negative');
      var positive = document.getElementById('positive');
      $('#imei').focus(); //Focus input IMEI
      var f = new Date();
      $scope.dateNow = (f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear());

      $scope.totalEquipment = 0 //Objeto para el total de equipos asignados al vendedor
      $scope.input = {
        lastSerie: ''
      };
      //...Objeto stocks
      $scope.stocks = {};


      $scope.brands = []; //Array marca de los equipos
      $scope.models = []; //Array modelo de los equipos
      $scope.myClients = []; //Lista de clientes que tiene asigando el vendedor/almacÃ©n
      $scope.clients = {};
      $scope.selectAllClient = {
        items: []
      }
      $scope.selectedClient = {}; //Objeto para el cliente seleccionado en la asignaciÃ³n mÃºltiple
      $scope.IsAllChecked = false; //Objeto que indica si todos los checkbox estÃ¡n seleccionados
      $scope.IsAllCheckedStock = false;
      $scope.isActivedImei = false; //modelo para cuando el imei ya ha sido activado previamente
      // Objeto assignment
      $scope.assignment = {}


      function processStocks(idWarehouse, stocks) {
        //console.log("processStocks-->", stocks);
        $scope.assignment.idDestiny = idWarehouse; //ID warehouse del vendedor
        $scope.assignment.idOrigin = $scope.currentUser.idWarehouse; //ID warehouse almacÃ©n central
        $scope.assignment.idSender = $scope.currentUser.id; //ID del usuario actual
        $scope.assignment.status = 'open'; //AsignaciÃ³n en estado abierto
        //...Objeto stocks
        $scope.stocksBack = [];

        let totalEquipment = 0
        _.each(stocks, function(stock, index) {
          var nowDate = moment(); //Obtener la fecha actual
          if (stock.logs.length > 0) {
            var logDate = moment(stock.logs[0].date).format('L'); //Darle formato a la fecha de stockLogs
          }

          var find = _.find($scope.stocksBack, function(p) {
            return p.idProductModel === stock.product.idProductModel;
          });
          if (!find) {
            var tmp = stock.product.name.split(',');
            var newProduct = {
              idProductModel: stock.product.idProductModel,
              brand: stock.product.model.brand.name,
              model: stock.product.model.name,
              name: tmp[0],
              scanned: stock.scanByAvailable === true ? 1 : 0,
              sold: stock.scanByAvailable === true ? 0 : 1,
              total: 1,
              stocks: [{
                id: stock.id,
                imei: stock.IMEI,
                status: stock.status,
                isRefurb: stock.isRefurb,
                idClient: stock.idClient,
                selected: false,
                index: stock.index,
                scanByAvailable: stock.scanByAvailable,
                days: stock.logs.length > 0 ? nowDate.diff(logDate, 'days') : 0
              }]
            };
            $scope.stocksBack.push(newProduct);
          } else {
            find.stocks.push({
              id: stock.id,
              imei: stock.IMEI,
              status: stock.status,
              isRefurb: stock.isRefurb,
              idClient: stock.idClient,
              selected: false,
              index: stock.index,
              scanByAvailable: stock.scanByAvailable,
              days: stock.logs.length > 0 ? nowDate.diff(logDate, 'days') : 0
            });
            find.total++;
            if (stock.scanByAvailable === true) {
              find.scanned++;
              find.sold = parseInt(find.total) - parseInt(find.scanned);
            } else {
              find.sold++;
            }
            find.stocks = _.sortBy(find.stocks, 'index');
          }
          totalEquipment++;
        });
        $scope.stocks = $scope.stocksBack;
        $scope.stocks = _.sortBy($scope.stocks, 'name');
        $scope.totalEquipment = totalEquipment;
        console.log("Array Stock de la hoja de cambaceo", $scope.stocks);
      }


      callAtInterval();
      $scope.$on('$destroy', function() {
        $interval.cancel(callAtInterval())
        $interval.cancel(callGetStockSold())
      });

      function callAtInterval() {
        return CambaceoService.getCambaceo($state.params.idSeller).then(function(seller) {
          //console.log("Servicio de cambaceo", seller);
          let stocks = seller.warehouseACL[0].warehouse.stocks;
          let idWarehouse = seller.warehouseACL[0].warehouse.id;
          processStocks(idWarehouse, stocks);
        }); // End CambaceoService.getCambaceo
      }

      $interval(function() {
        callAtInterval();
      }, 10000, false);
      $interval(function() {
        callGetStockSold();
      }, 10000, false);

      callGetStockSold();

      function callGetStockSold() {
        return CambaceoService.getStockSold($state.params.idSeller).then(function(stock) {
          //console.log("Servicio de stock", stock);
          $rootScope.saleHasRegistered = stock.length;
        }); // End CambaceoService.callGetStockSold
      }


      /*===========================================
       * FunciÃ³n para buscar el vendedor/almacÃ©n
       *============================================*/
      function getSeller() {
        SysUser.find({
            filter: {
              where: {
                id: $state.params.idSeller,
                type: 'seller'
              }
            }
          }).$promise
          .then(
            function(seller) {
              $scope.seller = seller[0].name + ' ' + seller[0].lastName;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      } // End getSellers

      /**
       * @description FunciÃ³n para cambiar el color de los dÃ­as
       *              que tiene un equipo en cambaceo
       * @param  {string} days DÃ­as
       * @return {string}
       */
      $scope.statusDays = function(days) {
        if (days <= 2) return "daysGreen";
        else if (days <= 5) return "daysOrange";
        else if (days > 6) return "daysRed";
      }

      /*============================================================
       * Lista de clientes que tiene asignado el vendedor/almacÃ©n
       *=============================================================*/
      function getmyClients() {
        var filter = {
          where: {
            idSeller: $state.params.idSeller
          },
          include: [{
            relation: "client",
            scope: {
              fields: ["id", "name"]
            }
          }]
        };

        SellerHasClient.find({
          filter: filter
        }).$promise.then(
          function(myClients) {
            _.each(myClients, function(client) {
              $scope.myClients.push({
                id: client.client.id,
                tag: client.client.name
              })
            });
            //console.log('El vendedor tiene asignado los siguientes clientes:',$scope.myClients)
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      } // End getmyClients*/

      getSeller(); //Llamada de la funciÃ³n getSeller()
      getmyClients(); //Llamada de la funciÃ³n getmyClients()


      /**
       * @name getStock
       * @description Busca en el almacÃ©n el nÃºmero de serie  que tiene asignado el vendedor
       * @param {string} imei NÃºmero de serie del producto asignado.
       * @param {object} warehouse Ojbeto con la informaciÃ³n del almacÃ©n
       * @callback {object} stock Objeto con el stock
       */
      function getStock(imei, warehouse, cb) {
        var filter = {
          include: 'product',
          where: {
            and: [{
                IMEI: imei
              },
              {
                idWarehouse: warehouse
              },
              {
                status: "assigned",
                validate: false
              }
            ]
          }
        };
        Stock.findOne({
            filter: filter
          })
          .$promise
          .then(
            function(stock) {
              cb(null, stock);
            },
            function(err) {
              cb(err);
            });
      } // End getStock


      /**
       * @name addStock
       * @description Actualiza el stock como escaneo por disponible
       * @param {string} stockId ID del stock que se va actualizar
       * @param {string} imei IMEI del equipo
       */
      function addStock(stockId, imei, productId) {
        //console.log("addStock -->", stockId);
        var find = _.find($scope.stocks, function(s) {
          return s.idProductModel === productId;
        });
        var index = 0;
        if (find) {
          index = find.scanned;
        }
        Stock.prototype$patchAttributes({
            id: stockId
          }, {
            idClient: null,
            scanByAvailable: true,
            index: index
          })
          .$promise
          .then(
            function(response) {
              $scope.notify('Equipo actualizado correctamente!!!', 'success');
              //console.log('Se actualizo correctamente!!',response);
              //Buscar el imei y eliminarlo del array
              $scope.stocks.forEach(function(item, index1) {
                item.stocks.forEach(function(stockItem, index2) {
                  if (stockItem.imei === imei) {
                    item.stocks[index2].scanByAvailable = true;
                    $scope.stocks[index1].scanned++;
                    $scope.stocks[index1].sold = $scope.stocks[index1].total - $scope.stocks[index1].scanned;
                  }
                });
              });
              //console.log("Lista de stock despuÃ©s de registrar una venta", $scope.stocks.items);
            },
            function(err) {
              //console.log("No se pudo actualizar", err);
            });
      } // End addStock


      /**
       * @name insertStock
       * @description
       * @param {string} imei IMEI del equipo
       * @param {object} warehouse Objeto del almacÃ©n
       */
      function insertStock(imei, warehouse) {
        getStock(imei, warehouse, function(err, stock) {
          if (err) {
            //$('#imei').prop('disabled', true);
            $('#imei').val('').prop('disabled', true).focus();
            //console.log(err);
            $scope.showModal('fa-info',
              'No se encontrÃ³ el nÃºmero de serie',
              '<p>El equipo bÃºscado no se encuentrÃ³ en el almacÃ©n de' + '<b>' + ' ' + $scope.seller + '</b></p>' +
              '<p>Vuelva a escanear el cÃ³digo de barras.</p>', {
                hideCancel: true
              },
              function() {
                //
              });
            negative.play();
          } else {
            if (stock.scanByAvailable !== true) {
              $scope.input.lastSerie = stock.IMEI;
              // console.log('stock', stock.product.idProductModel);
              addStock(stock.id, stock.IMEI, stock.product.idProductModel);
            } else {
              $scope.notify('El equipo ya estaba en estado Disponible!!!', 'error');
              //console.log("El imei ya ha sido escaneado previamente");
            }
          }
        });
      } // End insertStock



      /**
       * @name save
       * @description Prepara los datos para la actualizaciÃ³n.
       */
      $scope.save = function() {
        $('#imei').prop('disabled', true);
        var imei = $scope.input.serie;


        if ($rootScope.saleHasRegistered > 0) {
          $('#imei').prop('disabled', true);
          $scope.input.serie = '';
          return
        }

        if ($scope.input.serie) {
          insertStock(imei, $scope.assignment.idDestiny);
        } else {
          // ...no se agrega
          $('#imei').prop('disabled', true);
          // ...ya fue registrado en la base de datos
          $scope.showModal('fa-warning',
            'Error de captura',
            '<p><b>El tamaÃ±o del IMEI no es el adecuado</b></p>', {
              hideCancel: true
            },
            function() {
              //
            });
          negative.play();
        }
        //$scope.input.lastSerie = imei;
        $scope.input.serie = '';
        $('#imei').val('').prop('disabled', false).focus();
      }; // End save


      /**
       * @description FunciÃ³n para asignarle un IMEI a un cliente
       * @param {object} stock Objeto del stock
       */
      $scope.toggleAssignClient = function(stock) {
        console.log("Cliente a asignar", stock);
        var errorMessage = null;
        if (!stock.idClient || stock.idClient === null || stock.idClient === "-new-") {
          errorMessage = 'El cliente no existe';
        }

        if (errorMessage) {
          $scope.notify(errorMessage, 'error');
          return;
        }

        Stock.prototype$patchAttributes({
            id: stock.id
          }, {
            idClient: stock.idClient
          }).$promise
          .then(function(response) {
            if (response.error) {
              $scope.notify(response.error.message, 'alert', 'danger',
                3000);
            } else {
              $scope.notify('Cliente asignado correctamente!!!',
                'info', 'success');
            }
          }, function(err) {
            $scope.notify(err, 'alert', 'danger', 3000);
          });

      }; // End toggleAssignClient

      /**
       * @description FunciÃ³n para asignarle un IMEI a un cliente por medio del select
       * @param {object} stock Objeto del stock
       */
      $scope.changedValue = function(stock) {
        console.log("El valor seleccionado del select es", stock);

        var errorMessage = null;
        if (!stock.idClient || stock.idClient === null || stock.idClient === -1 || stock.idClient === "-new-") {
          errorMessage = 'El cliente no existe';
        }

        if (errorMessage) {
          $scope.notify(errorMessage, 'error');
          return;
        }

        Stock.prototype$patchAttributes({
            id: stock.id
          }, {
            idClient: stock.idClient
          }).$promise
          .then(function(response) {
            if (response.error) {
              $scope.notify(response.error.message, 'alert', 'danger', 3000);
            } else {
              $scope.notify('Cliente asignado correctamente!!!', 'success');
            }
          }, function(err) {
            $scope.notify(err, 'error');
          });
      }

      /**
       * @name selectAll
       * @description FunciÃ³n para seleccionar todo los equipos
       */
      $scope.selectAll = function() {
        //console.log("selectAll", $scope.IsAllChecked);
        if ($scope.IsAllChecked) {
          $scope.IsAllChecked = true;
        } else {
          $scope.IsAllChecked = false;
        }

        _.each($scope.stocks, function(product) {
          _.each(product.stocks, function(stock) {
            if (!stock.idClient && stock.scanByAvailable === false) {
              stock.selected = $scope.IsAllChecked;
            }
          })
        })
        //console.log("Hoja de cambaceo cambio su valor", $scope.stocks);
      };


      /**
       * @name selectAllStock
       * @description FunciÃ³n para seleccionar todo el stock de un equipo
       * @param {object} stock Objeto del stock
       */
      $scope.selectAllStock = function(stock) {
        var tmp = stock.selected;
        _.each(stock.stocks, function(s) {
          if (!s.idClient && s.scanByAvailable === false) {
            s.selected = tmp;
          }
        });
      }

      /**
       * @name selectEntity
       * @description FunciÃ³n para seleccionar un stock
       * @param {object} entity Objeto del stock
       */
      $scope.selectEntity = function(entity) {
        _.each($scope.stocks, function(product) {
          _.each(product.stocks, function(stock) {
            if (!stock.selected) {
              $scope.IsAllChecked = false;
              return;
            }

            if (!stock.idClient && stock.scanByAvailable === false) {
              stock.selected = true;
            }
          })
        })
      };

      $scope.selectEntity(); //Mandar a llamar la funciÃ³n cuando se selecciona un checkbox de forma individual

      /**
       * @name multipleAssignment
       * @description FunciÃ³n para una asignaciÃ³n mÃºltiple de clientes
       */
      $scope.multipleAssignment = function() {
        console.log('vendedor seleccionado para asignaciÃ³n mÃºltiple', $scope.selectAllClient.idClient);
        //Recorrer el arreglo que tiene el stock todos los que esten en estatus "selected=true"
        _.each($scope.stocks, function(product) {
          _.each(product.stocks, function(stock) {
            if (stock.selected === true) {
              var foundStock = _.find($scope.selectAllClient.items, function(p) {
                return p.id === stock.id
              });
              if (!foundStock) {
                let newItem = {
                  id: stock.id
                }
                $scope.selectAllClient.items.push(newItem);
              }
            }
          })
        })
        //console.log("Lista de imeis a asignarle clientes son los siguientes:", $scope.selectAllClient);

        var errorMessage = null;

        if ($scope.selectAllClient.idClient === -1 || $scope.selectAllClient.idClient === "-new-") {
          errorMessage = 'Debes seleccionar un cliente'
        } else if ($scope.selectAllClient.items.length === 0) {
          errorMessage = 'Debes seleccionar los equipos que les vas asignar cliente!!!'
        }
        if (errorMessage) {
          $scope.notify(errorMessage, 'error')
          return
        }

        Stock.multipleAssignmentClient({
            data: $scope.selectAllClient
          }).$promise
          .then(function(response) {
            $scope.busy = false;
            $scope.notify("Los equipos se les asignÃ³ correctamente el cliente!!!.", "ok", "success", 5000);
            $state.go($state.current, {}, {
              reload: true
            }); //Reinicia el controlador
          }, function(err) {
            $scope.busy = false;
            var message = err.data.error.message;
            if (!message) {
              message = "No se pudo asignarle el stock al cliente, intente mÃ¡s tarde por favor."
            }
            $scope.notify(message, "alert", "danger")
          })
      }


      /**
       * @name setMultipleSale
       * @description FunciÃ³n para registrar la venta del vendedor
       */
      $scope.setMultipleSale = function() {

        $scope.multipleSale = {
          idSeller: $state.params.idSeller,
          idUser: $rootScope.currentUser.id,
          items: []
        };

        let countNotClient = 0;

        //Recorrer el arreglo que tiene el stock
        $scope.stocks.forEach(function(item) {
          item.stocks.forEach(function(stock, index) {

            let newItem = {
              id: stock.id,
              idClient: stock.idClient ? stock.idClient : null,
              scanByAvailable: stock.scanByAvailable
            }
            $scope.multipleSale.items.push(newItem);
            if (stock.scanByAvailable === false) {
              if (stock.idClient === null || stock.idClient === '') {
                countNotClient++;
              }
            }

          });
        });

        if ($rootScope.saleHasRegistered > 0) {
          $scope.showModal('fa-info',
            'No se puede registrar el corte de cambaceo',
            'La hoja de cambaceo del ejecutivo <b style="font-size: 14px; font-weight: bold;">' + $scope.seller + '</b> ya ha sido registrado <br>', {
              hideCancel: true
            },
            function() {
              $state.go('admin.cut.list');
            });
          return
        }

        if (countNotClient > 0) {
          $scope.showModal('fa-warning',
            'Falta equipos por asignarle clientes',
            'Faltan <b style="font-size: 14px; font-weight: bold;">' + countNotClient + ' </b> equipos por asignarles Cliente <br>' +
            'Â¿AÃºn asÃ­ desea continuar con el registro y realizar la asignaciÃ³n de <br>' +
            'los Clientes en el MÃ³dulo de "Registrar venta"? <br>' +
            'El registro se asignarÃ¡ a la fecha: <p style="font-size: 30px; font-weight: bold;">' + moment().locale('es-mx').format('L') + '</p>', {},
            function() {
              sendDataMultipleSale($scope.multipleSale);
            });
        } else {
          $scope.showModal('fa-info',
            'ConfirmaciÃ³n',
            'Estas seguro de terminar con el Escaneo de Series? <br>' +
            '<p style="font-size: 30px; font-weight: bold;">' + moment().locale('es-mx').format('L') + '</p>', {},
            function() {
              sendDataMultipleSale($scope.multipleSale);
            });
        }
      }


      /**
       * @name sendDataMultipleSale
       * @description Registra las venta de equipos.
       * @param {object} object Objeto con los identificadores del stock.
       */
      function sendDataMultipleSale(object) {
        $scope.loading = true; //Mostrar mensaje de que se esta cargando la app
        Stock.setMultipleSale({
            data: object
          }).$promise
          .then(function(response) {
            console.log("La venta se registro correctamente !!!", response);
            $scope.loading = false;
            //$scope.notify("La venta se registro correctamente !!!.", "ok", "success", 5000);
            //$state.go('admin.sale');
            createAssignment(); //Abrir de forma automÃ¡tica el traspaso
          }, function(err) {
            console.log("Error devuelto por el servidor", JSON.stringify(err));
            $scope.loading = false;
            var message = err.data.error.message;
            if (!message) {
              message = "No se pudo realizar la venta, intente mÃ¡s tarde por favor."
            }
            $scope.notify(message, "alert", "danger")
          })
      } // End sendDataMultipleSale


      /**
       * @name createAssignment
       * @description Crea un nuevo registro de Assignment.
       */
      function createAssignment() {
        $scope.busy = true;

        //console.log("Datos a mandar para el traspaso de equipos", $scope.assignment);
        Assignment.create($scope.assignment)
          .$promise
          .then(
            function(response) {
              console.log("Respuesta de crear la asignaciÃ³n", response);
              $scope.busy = false;
              //$scope.notify('Registro creado satisfactoriamente.', 'success');
              $state.go('admin.cut.transfer', {
                assignmentId: response.id
              });
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      } // End createAssignment

      $('#genericModal').on('hidden.bs.modal', function(e) {
        $('#imei').val('').prop('disabled', false).focus();
      });

    }
  ])


  .controller('SellerAssignmentController', ['$scope', '$sce', '$timeout', '$state', '$window', 'SysUser', 'SellerHasClient', 'Stock', '$stateParams', 'Warehouse', 'Assignment', function($scope, $sce, $timeout, $state, $window, SysUser, SellerHasClient, Stock, $stateParams, Warehouse, Assignment) {

    // Objeto stock
    $scope.input = {
      lastSerie: ''
    };

    $scope.seller = {};
    // Objeto warehouses
    $scope.assignment;
    // Objeto stocks
    $scope.stocks = [];
    $scope.brands = [];
    $scope.models = [];

    /**
     *
     * @param {string} serie
     */
    function addStock(assignmentId, stockId) {
      Assignment.prototype$addStock({
          id: assignmentId,
          idStock: stockId
        })
        .$promise
        .then(
          function(stock) {
            $scope.input.lastSerie = stock.IMEI;
            $scope.notify('Registro creado satisfactoriamente.',
              'success');
            $scope.busy = false;
            var tmp = [];
            tmp.push(stock);
            processData(tmp);
          },
          function(err) {
            $scope.busy = false;
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      $('#imei').val('').prop('disabled', false).focus();
    } // End addStock

    /**
     * @name getAssignment
     * @description Recupera la asignaciÃ³n por su Identificador.
     * @param {string} assignmentId Identificador de la asignaciÃ³n.
     */
    function getAssignment(assignmentId) {
      //var date = moment().format('YYYY-MM-DD');
      var assignmentFilter = {
        include: [
          'destiny',
          'origin',
          'sender',
          'receiver',
          'stockValidate',
          {
            relation: 'stocks',
            scope: {
              include: {
                relation: 'product',
                scope: {
                  include: {
                    relation: 'model',
                    scope: {
                      include: 'brand'
                    }
                  }
                }
              }
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
            console.log("assignment", assignment);

            var warehouseFilter = {
              include: [{
                relation: "users",
                scope: {
                  fields: ["id", "name"]
                }
              }]
            };

            //Obtener el ID del vendedor en SysUser
            Warehouse.findById({
              id: assignment.idDestiny,
              filter: warehouseFilter
            }).$promise.then(
              function(sellers) {
                //console.log("ID del vendedor para mandar a imprimir su hoja de cambaceo", sellers);
                $scope.seller.idSeller = sellers.users[0].id;
              },
              function(err) {
                console.log(err);
              });


            if (assignment.idDestiny !== $scope.currentUser.idWarehouse &&
              assignment.idOrigin !== $scope.currentUser.idWarehouse) {
              // ...prevenir presentar datos si no corresponde al almacÃ©n
              $state.go('admin.cut.list');
            }
            $scope.assignment = assignment;
            processData(assignment.stocks);
            $scope.assignment.validates = 0;
            _.each($scope.assignment.stocks, function(stock) {
              if (stock.validate) {
                $scope.assignment.validates++;
              }
            });
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    } // End getAssignment

    /**
     * @name getStock
     * @description Busca en el almacÃ©n el nÃºmero de serie para su
     * asignaciÃ³n.
     * @param {string} IMEI NÃºmero de serie del producto asignado.
     * @param {object} warehouse Objeto con los datos del alamcÃ©n origien.
     */
    function getStock(IMEI, warehouse) {
      var filter = {
        where: {
          and: [{
              IMEI: IMEI
            },
            {
              idWarehouse: warehouse.id
            }
          ]
        }
      };
      Stock.findOne({
          filter: filter
        })
        .$promise
        .then(
          function(stock) {
            if ($scope.assignment.status === 'open') {
              addStock($scope.assignment.id, stock.id);
            } else if (!stock.validate) {
              valStock(stock.id);
            }
            $('#imei').val('').prop('disabled', false).focus();
          },
          function(err) {
            console.log(err);
            document.getElementById('negative').play();
            $scope.showModal('fa-info',
              'No se encontrÃ³ el nÃºmero de serie',
              '<p>El equipo bÃºscado no se encuentra en el <b>' +
              warehouse.name + '</b></p>' +
              '<p>Vuelva a escanear el cÃ³digo de barras.</p>', {
                hideCancel: true
              },
              function() {
                //
              });
          });
    } // End getStock


    /**
     * @name getWarehouses
     * @description Recupera los datos de los almacenes, origen y destino.
     * @param {string} originId Identificador del almacÃ©n de origen.
     * @param {string} destinyId Identificador del almacÃ©n destino.
     */
    function getWarehouses(originId, destinyId) {
      Warehouse.find()
        .$promise
        .then(
          function(warehouses) {
            $scope.warehouses.origin = _.find(warehouses, function(origin) {
              return origin.id === originId;
            });
            $scope.warehouses.destiny = _.find(warehouses, function(destiny) {
              return destiny.id === destinyId;
            });
            getAssignment($scope.warehouses.destiny.id);
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          }
        );
    } // End getWarehouses

    /**
     * @name processData
     * @description Recorre el arreglo de stock y da formato a la informaciÃ³n
     * para presentarla en el view.
     * @param {array} stocks Arreglo con los datos del stock.
     */
    function processData(stocks) {
      if (stocks.length !== 0 && typeof stocks === 'object') {
        _.each(stocks, function(stock) {
          var newStock = {
            IMEI: stock.IMEI,
            product: stock.product,
            validate: stock.validate
          };
          $scope.stocks.push(newStock);
          var model = _.where($scope.models, {
            id: stock.product.idProductModel
          });
          if (model.length) {
            model[0].count++;
          } else {
            stock.product.model.count = 1;
            $scope.models.push(stock.product.model);
          }
          var brand = _.where($scope.brands, {
            id: stock.product.idBrand
          });
          if (brand.length) {
            brand[0].count++;
          } else {
            stock.product.model.brand.count = 1;
            $scope.brands.push(stock.product.model.brand);
          }
        });
      }
    } // End proceesData


    /**
     * @name updateStock
     * @description Actualiza un item del stock.
     * @param {string} stockid Identificador del stock.
     * @param {object} attributes Objeto con la descripciÃ³n de la operaciÃ³n.
     * @param {array} data Arreglo con los datos del stock.
     */
    function updateStock(stockId, attributes, data) {
      Stock.prototype$patchAttributes({
          id: stockId
        }, attributes)
        .$promise
        .then(
          function(response) {
            $scope.stock.lastSerie = response.IMEI;
            //$scope.notify('Registro creado satisfactoriamente.','success');
            $scope.busy = false;
            $('#imei').val('').prop('disabled', false).focus();
            processData(data);
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    } // End updateStock


    /**
     *
     * @param {*} assignmentId
     * @param {*} receiverId
     */
    function acceptAssignment(assignmentId, receiverId) {
      Assignment.prototype$receive({
          id: assignmentId,
          idReceiver: receiverId
        })
        .$promise
        .then(
          function(result) {
            //$scope.notify('Taspaso concluido satisfactoriamente.', 'success');
            //$state.go('admin.cut.list');
            $state.go('admin.cut.print', {
              idSeller: $scope.seller.idSeller
            });
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    }; // End acceptAssigment


    /**
     * @name cancelAssignment
     * @description Cancela un traspaso.
     * @param {string} assignmentId Identificador del taspaso.
     * @param {string} receiverId Identificador del usuario que cancela.
     */
    function cancelAssignment(assignmentId, receiverId) {
      Assignment.prototype$cancel({
          id: assignmentId,
          idReceiver: receiverId
        })
        .$promise
        .then(
          function(result) {
            //$scope.notify('Taspaso cancelado satisfactoriamente.', 'success');
            $state.go('admin.cut.print', {
              idSeller: $scope.seller.idSeller
            });
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
    } // End cancel Assignment



    /**
     * @name closeAssignment
     * @description Establece el traspaso en transito.
     * @param {string} assignmentId Identificador del traspaso.
     */
    function closeAssignment(assignmentId) {
      var values = {
        status: 'in-transit'
      };
      Assignment.prototype$patchAttributes({
          id: assignmentId
        }, values)
        .$promise
        .then(
          function(respose) {
            //$scope.notify('Registro creado satisfactoriamente.', 'success');
            $state.go('admin.cut.print', {
              idSeller: $scope.seller.idSeller
            });
          },
          function(err) {
            console.log(err);
            $scope.notify(err.date.error.message);
          });
    } // End closeAssignment



    /**
     * @name valStock
     * @description
     * @param {string} assignmentId
     * @param {string} stockId
     */
    function valStock(stockId) {
      var values = {
        validate: true
      };
      Stock.prototype$patchAttributes({
          id: stockId
        }, values)
        .$promise
        .then(
          function(stock) {
            $scope.input.lastSerie = stock.IMEI;
            $scope.assignment.validates++;
            var s = _.find($scope.stocks, function(st) {
              return st.IMEI === stock.IMEI;
            });
            s.validate = true;
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      $scope.busy = false;
      $('#imei').val('').prop('disabled', false).focus();
    } // End valStock



    /**
     * @name receive
     * @description Valida que el usuario haya escaneado los imeis del traspaso.
     */
    $scope.receive = function() {
      var message = '<p>Se reciben ' + $scope.assignment.stocks.length +
        ' equipos en ' + $scope.assignment.destiny.name + '.</p>';
      if ($scope.assignment.validates !== $scope.assignment.stocks.length) {
        message = '<p>Solo ha validado ' + $scope.assignment.validates +
          ' equivalente al ' + Math.floor(($scope.assignment.validates / $scope.assignment.stocks.length) * 100) +
          '% de traspaso recibido</p><p>Â¿Desea continuar de todas formas?</p>';
      }
      $scope.showModal('fa-warning', 'Aceptar traspaso en el sistema',
        message, {},
        function() {
          acceptAssignment($scope.assignment.id, $scope.currentUser.id);
        });
    }; // End receive


    /**
     * @name cancel
     * @description Valida si el usuario desea cancelar el traspaso.
     */
    $scope.cancel = function() {
      var origin = $scope.assignment.origin;
      var destiny = $scope.assignment.destiny;
      $scope.showModal('fa-warning',
        'Cancelar traspaso en el sistema',
        '<p>Â¿Desea cancelar el traspaso entre <b>' + origin.name +
        '</b> y <b>' + destiny.name + '</b>?</p>' +
        '<p>Esta acciÃ³n no puede deshacerse.</p>', {},
        function() {
          cancelAssignment($scope.assignment.id, $scope.currentUser.id);

        });
    }; // End cancel

    /**
     * @name close
     * @description Prepara los datos para cerrar el traspaso.
     */
    $scope.close = function() {
      if ($scope.assignment.destiny.type === 'seller') {
        // Implementar codigo para mostrar mensaje de aceptaciÃ³n sin validaciÃ³n
        acceptAssignment($scope.assignment.id, $scope.currentUser.id);
      } else {
        closeAssignment($scope.assignment.id);
      }
    }; // End close


    /**
     * @name save
     * @description Prepara los datos para la asignaciÃ³n del stock.
     */
    $scope.save = function() {
      $('#imei').prop('disabled', true);
      $scope.busy = true;
      // if ($scope.assignment.status === 'open') {
      getStock($scope.input.serie, $scope.assignment.origin);
      // }
    }; // End save


    /**
     * @name validate
     * @description Valida los datos de la asignaciÃ³n contra el usuario actual.
     */
    $scope.validate = function(label) {
      if (!$scope.assignment) return;
      var key = '';
      if ($scope.assignment.status === 'open' &&
        $scope.assignment.idSender === $scope.currentUser.id &&
        $scope.assignment.idOrigin === $scope.currentUser.idWarehouse) {
        key = 'a';
      } else if ($scope.assignment.status === 'in-transit' &&
        $scope.assignment.idDestiny === $scope.currentUser.idWarehouse) {
        key = 'b';
      } else if ($scope.assignment.status === 'in-transit' &&
        $scope.assignment.idSender === $scope.currentUser.id &&
        $scope.assignment.idOrigin === $scope.currentUser.idWarehouse) {
        key = 'c';
      } else {
        key = 'x';
      }
      if (label.indexOf(key) != -1) {
        return true;
      }
      return false;
    }; // End validate


    getAssignment($state.params.assignmentId);
    // Dissmiss Modal
    $('#genericModal').on('hidden.bs.modal', function(e) {
      $scope.busy = false;
      $('#imei').val('').prop('disabled', false).focus();
    });

  }])


  /**
   * @description Controlador para el corte de cambaceo.
   */
  .controller('PrintAssignmentController', [
    '$scope',
    '$sce',
    '$timeout',
    '$state',
    '$window',
    'SysUser',
    'SellerHasClient',
    'Stock',
    '$stateParams',
    'Assignment',
    function($scope, $sce, $timeout, $state, $window, SysUser, SellerHasClient, Stock, $stateParams, Assignment) {

    $scope.totalEquipment = 0
    $scope.stocks = {};
    $scope.date = new Date(); //Obtener la fecha actual


    /*============================================================
     * Query para obtener la hoja de cambaceo del vendedor
     *=============================================================*/
    let sellerFilter = {
      include: {
        relation: 'warehouseACL',
        scope: {
          include: {
            relation: 'warehouse',
            scope: {
              include: {
                relation: 'stocks',
                scope: {
                  where: {
                    and: [{
                      or: [{
                        status: 'assigned'
                      }]
                    }, {
                      validate: false
                    }]
                  },
                  include: [{
                      relation: 'logs',
                      scope: {
                        where: {
                          event: 'assigned'
                        }
                      }
                    },
                    {
                      relation: 'product',
                      scope: {
                        include: {
                          relation: 'model',
                          scope: {
                            include: 'brand'
                          }
                        }
                      }
                    }
                  ],
                  order: 'idProduct'
                }
              }
            }
          },
          limit: 1,
          order: 'index'
        }
      }
    };

    SysUser.findById({
        id: $state.params.idSeller,
        filter: sellerFilter
      })
      .$promise
      .then(
        function(seller) {
          $scope.cambaceo = seller;
          console.log("Hoja de cambaceo del ejecutivo", seller);
          let objectStock = seller.warehouseACL[0].warehouse.stocks;
          processStocks(objectStock); //Enviar a procesar el stock
        },
        function(err) {
          console.log(err);
          $.notify(err.data.error.message, {
            hideDuration: 1000,
            showDuration: 200,
            position: 'right bottom'
          });
        });


    function processStocks(stocks) {
      let totalEquipment = 0
      $scope.stocksBack = [];

      _.each(stocks, function(stock, index) {
        var find = _.find($scope.stocksBack, function(p) {
          return p.idProductModel === stock.product.idProductModel;
        });
        if (!find) {
          var tmp = stock.product.name.split(',');
          var newProduct = {
            idProductModel: stock.product.idProductModel,
            model: stock.product.model.name,
            name: tmp[0],
            total: 1,
            stocks: [{
              id: stock.id,
              imei: stock.IMEI,
              index: stock.index,
              isRefurb: stock.isRefurb
            }]
          };
          $scope.stocksBack.push(newProduct);
        } else {
          find.stocks.push({
            id: stock.id,
            imei: stock.IMEI,
            index: stock.index,
            isRefurb: stock.isRefurb
          });
          find.total++;
          find.stocks = _.sortBy(find.stocks, 'index');
        }
        totalEquipment++;
      });
      $scope.stocks = $scope.stocksBack;
      $scope.stocks = _.sortBy($scope.stocks, 'name');
      $scope.totalEquipment = totalEquipment;
      console.log("Array Stock de la hoja de cambaceo", $scope.stocks);
    }


    /*===========================================
     * FunciÃ³n para buscar el vendedor/almacÃ©n
     *============================================*/
    SysUser.find({
        filter: {
          where: {
            id: $state.params.idSeller,
            type: 'seller'
          }
        }
      }).$promise
      .then(
        function(seller) {
          $scope.seller = seller[0].name + ' ' + seller[0].lastName;
        },
        function(err) {
          console.log(err);
          $scope.notify(err.data.error.message);
        });


  }])
  /**
   *
   */
  .controller('RemoveStockController', [
    '$scope',
    '$state',
    'SysUser',
    'Warehouse',
    function($scope, $state, SysUser, Warehouse) {
      // Funciones generales
      /**
       * @name getWarehouses
       * @description Recupera la lista de almacenes del usuario capturista.
       */
      function getWarehouses() {
        var warehouseFilter = {
          where: {
            or: [{
                id: $scope.currentUser.idWarehouse
              },
              {
                idParent: $scope.currentUser.idWarehouse
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
              $scope.warehouses = warehouses;
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      } // End getWarehouse
      /**
       * @name removeStocks
       * @description Transfiere los productos del vendedor al almacÃ©n destino.
       * @param {string} sellerId Identificador del vendedor.
       * @param {object} data Objeto con los datos de los productos.
       * @param {function} cb FunciÃ³n de callback.
       */
      function removeStocks(sellerId, data, cb) {
        SysUser.prototype$removeStocks({
            id: sellerId,
            data: data
          })
          .$promise
          .then(
            function(response) {
              return cb(null, response);
            },
            function(err) {
              console.log(err);
              return cb(err);
            });
      } // End removeStocks
      /**
       * @name validateStock
       * @description Valida la informaciÃ³n del stock para saber si pertenece al vendedor.
       * @param {string} imei NÃºmero de serie del producto.
       * @param {string} sellerId Identificador del vendedor.
       * @param {function} cb FunciÃ³n de callback.
       */
      function validateStock(imei, sellerId, cb) {
        var sellerFilter = {
          include: {
            relation: 'warehouses',
            scope: {
              include: {
                relation: 'stocks',
                scope: {
                  include: 'product'
                }
              }
            }
          }
        };
        SysUser.findById({
            id: sellerId,
            filter: sellerFilter
          })
          .$promise
          .then(
            function(seller) {
              var find = _.find(seller.warehouses[0].stocks, function(s) {
                return s.IMEI === imei;
              });
              if (find) {
                return cb(null, find);
              } else {
                return cb({
                  message: 'No pertenece a esta ruta.'
                });
              }
            },
            function(err) {
              return cb(err);
            });
      } // End validateStock
      // Variables del $scope
      $scope.busy = false;
      $scope.form = {
        serie: '',
        lastSerie: ''
      };
      $scope.remove = {
        stocks: []
      };
      $scope.warehouses = [];
      // Funciones del $scope
      /**
       * @name addStock
       * @description Agrega un stock a la lista de productos para quitar del cambaceo.
       */
      $scope.addStock = function() {
        $('#removeImei').prop('disabled', true);
        var find = _.find($scope.remove.stocks, function(rs) {
          return rs.IMEI === $scope.form.serie;
        });
        if (!find) {
          validateStock($scope.form.serie, $state.params.idSeller, function(err, stock) {
            $('#removeImei').val('').prop('disabled', false).focus();
            if (err) {
              console.log(err);
              $scope.notify('El IMEI ' + $scope.form.serie + ' no pertenece al vendedor.');
            } else if (stock) {
              $scope.remove.stocks.push(stock);
            }
          });
        } else {
          $('#removeImei').val('').prop('disabled', false).focus();
          $scope.notify('El producto ya estÃ¡ en la lista.');
        }
        $scope.form.lastSerie = $scope.form.serie;
        $scope.form.serie = '';
      }; // End addStock
      /**
       * @name delStock
       * @description Borra de la lista un IMEI que serÃ¡ retirado del cambaceo.
       * @param {object} stock Objeto con los datos del stock.
       */
      $scope.delStock = function(stock) {
        $scope.remove.stocks =
          _.without($scope.remove.stocks, _.findWhere($scope.remove.stocks, {
            id: stock.id
          }));
      } // End delStock
      /**
       * @name removeStocks
       * @description Elimina de la hoja de cambaceo los productos listados.
       */
      $scope.removeStocks = function() {
        $scope.busy = true;
        removeStocks($state.params.idSeller, $scope.remove, function(err, response) {
          $scope.busy = false;
          if (err || !response.count) {
            $scope.notify('No se quito ningÃºn producto del cambaceo');
            $('#removeModal').modal('hide');
            $scope.remove.stocks = [];
          } else {
            $scope.notify('Se quitaron ' + response.count + ' productos del cambaceo.',
              'success');
            $('#removeModal').modal('hide');
            $('#removeModal').on('hidden.bs.modal', function(e) {
              $state.reload();
            });
          }
        });
      }; // End removeStocks
      // Watchers
      // $watch.currentUser
      $scope.$watch('currentUser', function(u) {
        if (!u) return;
        $scope.remove.idWarehouse = $scope.currentUser.idWarehouse;
        getWarehouses();
      }); // End $watch.currentUser
    }
  ]);
