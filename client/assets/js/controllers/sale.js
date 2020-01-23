angular.module('systemax')

  .controller('SaleBlankController', ['$rootScope', '$scope', 'Warehouse', function($rootScope, $scope, Warehouse) {
      $rootScope.menu = 'sale';
    }
  ])

  /**
   * @description Controlador para buscar un vendedor.
   */
   .controller('SaleSellerController', ['$scope', '$state', 'SysUser', 'Stock', '$stateParams', 'SellerHasClient', function($scope, $state,  SysUser, Stock, $stateParams, SellerHasClient) {

     $scope.itemSeller = {}; //Objeto para obtener el vendedor seleccionado

     //Obtener todos los ejecutivos de venta
     SysUser.find({filter: {where: {type: 'seller'}}}).$promise.then(
       function(sellers) {
         $scope.allSellers = sellers;
         $scope.allSellers.push({
           id: "-new-",
           name: "-- ELIGE UN ASESOR DE VENTA --"
         });
         $scope.itemSeller.idSeller = $scope.allSellers[$scope.allSellers.length-1].id;
         //console.log("Lista de todos los vendedores", $scope.allSellers);
       },
       function(err) {
         console.log(err);
         $scope.notify(err.data.error.message);
       });


     /*----------------------------------------------------------------*
      * Función para seleccionar un vendedor y mandarlo a otra vista   *
      *----------------------------------------------------------------*/
     $scope.saleSeller = function(){
       console.log('vendedor seleccionado', $scope.itemSeller.idSeller);
       var errorMessage = null

       if ($scope.itemSeller.idSeller === -1 || $scope.itemSeller.idSeller === "-new-") {
         errorMessage = 'No haz seleccionando ningún asesor de venta'
       }
       if (errorMessage) {
         $scope.notify(errorMessage, 'info-sign', 'warning')
         return
       }
       $state.go('admin.sale.form', { idSeller : $scope.itemSeller.idSeller});
     }

 }])


  /**
   * @description Controlador para registrar una venta.
   */
  .controller('SaleFormController', ['$scope', '$rootScope', '$state', 'SysUser', 'Stock', '$stateParams', 'SellerHasClient', function($scope, $rootScope, $state,  SysUser, Stock, $stateParams, SellerHasClient) {
    $scope.totalEquipment = 0 //Objeto para el total de equipos asignados al vendedor
    $scope.selectedEquipment = 0;
    $scope.itemSeller = { }; //Objeto para el vendedor
    var today =  moment(); //Obtener la fecha actual
    $scope.itemSeller.date = stringDate(today, '/');
    // Objeto stocks
    $scope.stocks = { }; //Hoja de cambaceo del vendedor

    $scope.myClients = []; //Lista de clientes que tiene asigando el vendedor/almacén
    $scope.selectAllClient = {
      items: []
    }
    $scope.selectedClient = {}; //Objeto para el cliente seleccionado en la asignación múltiple
    $scope.IsAllChecked = false; //Objeto que indica si todos los checkbox están seleccionados
    $scope.isActivedImei = false; //modelo para cuando el imei ya ha sido activado previamente

    $scope.totalPayment = 0; //Monto total de la nota de remisión
    $scope.sendSale = { //Objeto que tiene todos los datos de la venta
      items: []
    }



    //Obtener los datos del vendedor
    SysUser.find({filter: {where:{id:$state.params.idSeller, type: 'seller'}}}).$promise
    .then(
      function(seller) {
        $scope.seller = seller[0].name+' ' +seller[0].lastName;
      },
      function(err) {
        console.log(err);
        $scope.notify(err.data.error.message);
      });



    /*=========================================================================
    * Mantener un escuchador en el objeto date por si hay cambio de fecha
    *=========================================================================*/
    $scope.$watch('itemSeller.date', function(date) {
      if (!date) return;
      var tmp = date.split('/');
      if (tmp.length === 3) {
        $scope.itemSeller.date = tmp[2] + '-' + tmp[1] + '-' + tmp[0];
      }
      //searchSeller();
    });// End watch formFilters.date


      /**
       * @name stringDate
       * @description Devuelve una fecha con formato según el carcter separador.
       * @param {object} objDate Objeto de fecha tipo moment().
       * @param {string} char Caracter de separación de la fecha.
       */
      function stringDate(objDate, char) {
        var tmp = '';
        if (char === '/') {
          tmp = ('0' + objDate.date()).substr(-2) + char +
            ('0' + (objDate.month() + 1)).substr(-2) + char +
            objDate.year();
        } else {
          char = '-';
          tmp = objDate.year() + char +
            ('0' + (objDate.month() + 1)).substr(-2) + char +
            ('0' + objDate.date()).substr(-2);
        }
        return tmp;
      }// End stringDate


    /*---------------------------------------------------------------*
     * Función para seleccionar un vendedor y mandarlo a otra vista  *
     *---------------------------------------------------------------*/
    $scope.searchSeller = function(){
      console.log('Información a validar ID vendedor', $state.params.idSeller);
      console.log('Información a validar Fecha', $scope.itemSeller.date);

      let lastId = '';
      let idx = -1;

      //console.log("Fecha formateada 1", moment($scope.itemSeller.date).hour(0).toDate());
      //console.log("Fecha formateada 2", moment($scope.itemSeller.date).hour(23).minute(59).second(59).millisecond(999).toDate());


      //{saleDate:  { gt: moment($scope.itemSeller.date).hour(0).toDate(), lt: moment($scope.itemSeller.date).hour(23).minute(59).second(59).millisecond(999).toDate() }}

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
                  where: {and: [
                    {status: 'sold'},
                    { validate: true},
                    {saleDate:  { gt: moment($scope.itemSeller.date).hour(0).toDate(), lt: moment($scope.itemSeller.date).hour(23).minute(59).second(59).millisecond(999).toDate() }}
                  ]},
                  include: [ 'product', { relation: 'logs', scope: { where: { event: 'assigned'}} }],
                  order: 'idProduct'}}}},
                                  limit: 1,
                                  order: 'index'}}};

      SysUser.findById({id: $state.params.idSeller, filter: sellerFilter})
        .$promise
          .then(
            function(seller) {
              $scope.cambaceo = seller.warehouseACL[0].warehouse.stocks.length;
              console.log("Hoja de cambaceo del vendedor", $scope.cambaceo);

              let response = {
                items: []
              };

              let totalEquipment = 0; //Total de equipos vendidos

              if (seller.warehouseACL[0].warehouse.stocks.length) {

                _.each(seller.warehouseACL[0].warehouse.stocks, function(stock) {
                  if (lastId !== stock.idProduct) {

                     //Item de la hoja de cambaceo
                     let newItem = {
                       id: stock.idProduct,
                       brand: stock.product.name,
                       model: stock.product.name,
                       total: 0,
                       stock: []
                     }
                     response.items.push(newItem);
                     lastId = stock.idProduct;
                     idx++;
                   }

                   let newStock = {
                     id: stock.id,
                     imei: stock.IMEI,
                     status: stock.status,
                     isRefurb: stock.isRefurb,
                     idClient: stock.idClient,
                     selected: false,
                     confirmSale: stock.confirmSale,
                     publicPrice: stock.publicPrice,
                     salesPrice: stock.salesPrice
                   };

                   response.items[idx].stock.push(newStock);
                   response.items[idx].total++;
                   totalEquipment++;
                 });

                 $scope.stocks = response;
                 $scope.totalEquipment = totalEquipment;
              }else {
                $scope.stocks = seller.warehouseACL[0].warehouse.stocks;
                $scope.totalEquipment = 0;
                console.log("No encontró equipos vendidos por parte del vendedor", $scope.stocks);
              }
              console.log("Array Stock de la hoja de cambaceo", $scope.stocks);
            },
            function(err) {
              console.log("Error al obtener los equipos vendidos del vendedor", err);
              $scope.stocks = [];
              console.log("Datos vacios del stock del vendedor", $scope.stocks);
            });

    }

    function getmyClients(idSeller) {

      var filter = {
        where: { idSeller:$state.params.idSeller },
        include: [{ relation: "client", scope: { fields: [ "id", "name" ] } }]
      };

       SellerHasClient.find({filter: filter }).$promise .then(
         function(myClients) {
           console.log("Respuesta de consulta", myClients.length);
           let listClients = [];

           if (myClients.length) {
             _.each(myClients, function(client) {
               listClients.push({ id: client.client.id, tag: client.client.name })
             });
             listClients.push({ id: "-new-", tag: "-- ELIGE UN CLIENTE --" });
             $scope.myClients = listClients;
             $scope.sendSale.idClient = $scope.myClients[$scope.myClients.length-1].id;
           }else {
             listClients.push({ id: "-new-", tag: "-- ELIGE UN CLIENTE --" });
             $scope.myClients = listClients;
             $scope.sendSale.idClient = $scope.myClients[$scope.myClients.length-1].id;
           }
           console.log('El vendedor tiene asignado los siguientes clientes:',$scope.myClients)
        },
        function(err) {
          console.log(err);
          $scope.notify(err.data.error.message);
        });
    }

    getmyClients();


       // This executes when checkbox in table header is checked
     $scope.selectAll = function () {
         console.log("selectAll", $scope.IsAllChecked);
         //$scope.selectAllClient.idClient = 'Josue'
         //console.log("selected", $scope.stocks.items);
         $scope.stocks.items.forEach(function(item){
           item.stock.forEach(function(stock, index) {
             if (item.stock[index].confirmSale === false)  {
               item.stock[index].selected = $scope.IsAllChecked;
             }
           });
         });
        console.log("selectAllClient", $scope.selectAllClient);
        console.log("Hoja de cambaceo cambio su valor", $scope.stocks);
     };



     // This executes when entity in table is checked
      $scope.selectEntity = function (entity) {
        console.log("check selected", entity);
        $scope.stocks.items.forEach(function(item){
          item.stock.forEach(function(stock, index) {
            if (!item.stock[index].selected) {
                $scope.IsAllChecked = false;
                $scope.selectedEquipment = 0;
                return;
            }
            if (stock.confirmSale === false) {
              item.stock[index].selected = true;
            }

          });
        });
        console.log("Hoja de cambaceo cambio su valor", $scope.stocks);
      };

      //$scope.selectEntity(); //Mandar a llamar la función cuando se selecciona un checkbox de forma individual


      // Función para activar el input y cambiarle el precio del equipo
       $scope.activeEditInput = function (active) {
         console.log("Active input salesPrice", active);
         $scope.note.items.forEach(function(item, index){
             if (item.id === active) {
               if (item.changePrice === true) {
                 item.changePrice = false;
               }else {
                 item.changePrice = true;
               }
             }
         });
         console.log("Hoja de cambaceo cambio su valor", $scope.note);
       };


       // Función para cambiar el precio de un equipo
        $scope.changeSalePrice = function (idProduct, newPrice) {
          let totalPayment = 0;

          console.log("Id del producto", idProduct);
          console.log("Nuevo precio del producto", newPrice);
          $scope.note.items.forEach(function(item, index){
              if (item.id === idProduct) {
                item.salesPrice = newPrice;
              }
              item.subTotal = item.salesPrice * item.quantity;
          });

          $scope.note.items.forEach(function(item, index){
            console.log("item subTotal", item.subTotal);
            totalPayment += item.subTotal;
         });

         $scope.totalPayment = totalPayment;

          console.log("Hoja de cambaceo despues de modificar el precio del equipo", $scope.note);
        };


      $scope.generateNote = function (){
        console.log("Realizar la venta !!!", $scope.stocks);

        $scope.note = { //Objeto para nota de remisión
          items: []
        }

        let totalPayment = 0;
        let lastId = '';
        let idx = -1;

        //Recorrer el arreglo que tiene el stock todos los que esten en estatus "selected=true"
          $scope.stocks.items.forEach(function(item){
            item.stock.forEach(function(stock, index) {

              if (item.stock[index].selected === true) {
              if (lastId !== item.id) {

                //Item de la hoja de cambaceo
                let newItem = {
                  id: item.id,
                  quantity: 0,
                  model: item.model,
                  salesPrice: stock.publicPrice,
                  subTotal: stock.publicPrice,
                  changePrice: true,
                  stock: []
                }
                $scope.note.items.push(newItem);
                lastId = item.id;
                idx++;
              }


             let newStock = {
               id: stock.id,
               imei: stock.imei,
               isRefurb: stock.isRefurb,
               idClient: stock.idClient,
               confirmSale: stock.confirmSale,
               publicPrice: stock.publicPrice
             };
             $scope.note.items[idx].stock.push(newStock);
             $scope.note.items[idx].quantity++;
             $scope.note.items[idx].subTotal = $scope.note.items[idx].salesPrice * $scope.note.items[idx].quantity;
           }

         });

         //totalPayment = $scope.note.items[idx].subTotal; //Se oculta por el momento

         });

         //$scope.totalPayment = totalPayment;

        $('#registerSaleModal').modal('show');
         console.log("Datos a mandar para la venta", $scope.note);
      }


      //Función para registrar la venta
      $scope.registerSale = function (){
        var errorMessage = null;
        let totalPayment = 0;
        let totalItems = 0;
        let lastId = '';
        let idx = -1;

        console.log("Registrando venta....");
        console.log("Cliente seleccionado para registrar su venta", $scope.sendSale.idClient);
        console.log("Ejecutivo seleccionado quien realizó la venta", $state.params.idSeller);
        console.log("Método de pago seleccionado para registrar la venta", $scope.sendSale.paymentMethod);

        if ($scope.sendSale.idClient === -1 || $scope.sendSale.idClient === "-new-") {
          errorMessage = 'Debes seleccionar un cliente'
        }else if (!$scope.sendSale.paymentMethod) {
          errorMessage = 'Seleccione un método de pago.'
        }

        if (errorMessage) {
          $scope.notify(errorMessage, 'info-sign', 'warning')
          return
        }

        //Recorrer el arreglo que tiene el stock
          $scope.note.items.forEach(function(product){
            product.stock.forEach(function(stock, index) {
              if (lastId !== product.id) {
                //Item de la hoja de cambaceo
                let newItem = {
                  idProduct: product.id,
                  totalItems: 0,
                  subTotal: product.salesPrice,
                  total: product.salesPrice,
                  salesPrice: product.salesPrice,
                  model: product.model,
                  stock: []
                }
                $scope.sendSale.items.push(newItem);
                lastId = product.id;
                idx++;
              }

             let newStock = {
               idStock: stock.id,
               imei: stock.imei,
               isRefurb: stock.isRefurb,
               salesPrice: product.salesPrice
             };
             $scope.sendSale.items[idx].stock.push(newStock);
             $scope.sendSale.items[idx].totalItems++;
             $scope.sendSale.items[idx].subTotal = $scope.sendSale.items[idx].salesPrice * $scope.sendSale.items[idx].totalItems;
             $scope.sendSale.items[idx].total = $scope.sendSale.items[idx].salesPrice * $scope.sendSale.items[idx].totalItems;
         });

         totalPayment += $scope.sendSale.items[idx].subTotal;
         totalItems += $scope.sendSale.items[idx].totalItems;
         });

        console.log("Datos del objeto sendSale", $scope.sendSale);

        var newSale = null;
        newSale = _.clone($scope.sendSale);
        newSale.idSeller = $state.params.idSeller;
        newSale.totalItems = totalItems;
        newSale.subTotal = totalPayment;
        newSale.total = totalPayment;
        $scope.loading = true; //Mostrar mensaje de que se esta cargando la app


        console.log("Objeto depurado para registrar la venta", newSale);

        Stock.registerSale({data: newSale}).$promise
          .then( function(response) {
            console.log("La venta se registro correctamente !!!", response);
            $scope.loading = false;
            $scope.notify("La venta se registro correctamente !!!.", "ok", "success", 5000);

            //Buscar el imei y eliminarlo del array
            $scope.sendSale.items.forEach(function(item, index1){
              item.stock.forEach(function(stockItem, index2) {
                getmyImei(stockItem.imei, $scope.sendSale.idClient);
              });
            });

            $('#registerSaleModal').modal('hide');

          }, function(err) {
            console.log("Error devuelto por el servidor", JSON.stringify(err));
            $scope.loading = false;
            var message = err.data.error.message;
            if (!message) {
              message = "No se pudo registrar la venta, intente más tarde por favor."
            }
            $scope.notify(message,"alert","danger")
          })


      }

      //Función para búscar el imei y cambiarle el estatus a confirmSale = true
      function getmyImei(imei, idClient) {
        console.log("IMEI a validar", imei);
        $scope.stocks.items.forEach(function(item, index1){
          item.stock.forEach(function(stockItem, index2) {
            if(stockItem.imei === imei) {
              item.stock[index2].confirmSale = true;
              item.stock[index2].selected = false;
              item.stock[index2].idClient = idClient;
            }
          });
        });
      }









}])
