angular.module('systemax')

  /**
   * @description Controlador para listar los proveedores/empresas/clientes.
   */
  .controller('dashboardV', [
    '$scope',
    '$state',
    'Payment',
   
    '$stateParams',
    
    function($scope, $rootScope,  Payment,$stateParams) {
        
        var pFilter =  {
            where: {idClient:$stateParams.idClient,status:'active',},
            include:[{
                relation: "order",
                scope: {include: [{
                  relation:"orderhasproduct",scope:{include:[{
                    relation:"product", scope:{
                      include:[{ relation:"brand"}, "model"]}}]}}]}},"seller", "client" ],
          }

          /**
     * @description Función para procesar la marca
     * @param  {string} _idBrand _lastName SKU ingresado
     *
     */
    $scope.processMCA = function(_idBrand) {
      let idbrand = _idBrand;
      console.log('aqui estoy', idbrand );

      //Buscar el idbrand ingresado
      Payment.find({
        filter:{ 
          where:{ 
            idBrand: idbrand  },
             include:[{
              relation: "order",
               scope: {
                include: [{
                 relation:"orderhasproduct",scope:{include:[{
                    relation:"product", scope:{
                      include:[{ relation:"brand"}, "model"]}}]}}]}},"seller", "client" ],
              }
            },
     function (brand) {
          console.log('tengo esta marca',brand)
          $scope.brands = brand;
          $scope.formFilters.brand = "";
        }, 
             
        function(err) {
          console.log(err);
          $scope.notify(err.data.error.message);
        });
      
    };
        // Watch select de status
        $scope.$watch("formFilters.brand", function(brand) {
          console.log('marca seleccionada',brand);

          if (!brand ) {
            return;
          }
    
          var errorMessage = "";
    
          var result = $scope.processMCA(brand);
          if (result) {
            if (errorMessage.length) {
              errorMessage += "<br/>";
            }
            errorMessage += result;
          }
    
          $scope.formFilters.brand = "";
    
          if (errorMessage) {
            showSkuError(errorMessage);
          }
    
        });

/**
     * @description Función para procesar el cliente
     * @param  {string} _idclient ingresado
     *
     */
    $scope.processCLT = function(_idclient) {
      
      console.log('aqui estoy', _idclient);
      //Buscar el idSeller ingresado
      Payment.find({
        filter:{ 
          where:{ 
            idClient: _idclient },
             include:[{
              relation: "order",
               scope: {
                include: [{
                 relation:"orderhasproduct",scope:{include:[{
                  relation:"product", scope:{
                    include:[{ relation:"brand"}, "model"]}}]}
                 }]}},"seller", "client" ]
              }
            },
     function (client) {
          console.log('tengo esto cliente',client)
          $scope.clients = client;
          $scope.formFilters.client = "";
        }, 
             
        function(err) {
          console.log(err);
          $scope.notify(err.data.error.message);
        });
      
    };
        // Watch select de status
        $scope.$watch("formFilters.client", function(client) {
          console.log('cliente seleccionado',client);

          if (!client ) {
            return;
          }
    
          var errorMessage = "";
    
          var result = $scope.processCLT(client);
          if (result) {
            if (errorMessage.length) {
              errorMessage += "<br/>";
            }
            errorMessage += result;
          }
    
          $scope.formFilters.client = "";
    
          if (errorMessage) {
            showSkuError(errorMessage);
          }
    
        });


/**
     * @description Función para procesar el SKU
     * @param  {string} _idseller _lastName SKU ingresado
     *
     */
    $scope.processSKU = function(_idseller) {
      let idSeller = _idseller
      console.log('aqui estoy', _idseller);
      //Buscar el idSeller ingresado
      Payment.find({
        filter:{ 
          where:{ 
            idSeller: idSeller },
             include:[{
              relation: "order",
               scope: {
                include: [{
                 relation:"orderhasproduct",scope:{include:[{
                  relation:"product", scope:{
                    include:[{ relation:"brand"}, "model"]}}]}
                 }]}},"seller", "client" ]
              }
            },
     function (seller) {
          console.log('tengo esto seller',seller)
          $scope.sellers = seller;
          $scope.formFilters.seller = "";
          
            //funcion para traer solo los totales
       /* $scope.totales = _.each($scope.sellers, function(total){
          $scope.granTotal =  total.order.total + $scope.granTotal ;
        });
        console.log('total',$scope.granTotal);

        $scope.totalesC = _.each($scope.sellers, function(credit){
          $scope.granTotalC =  credit.order.credit + $scope.granTotalC ;
        });
        console.log('totalCredit',$scope.granTotalC);

        $scope.totalesE = _.each($scope.sellers, function(cash){
          $scope.granTotalE =  cash.order.cash + $scope.granTotalE ;
        });
        console.log('totalCash',$scope.granTotalE);

        $scope.totalesI = _.each($scope.sellers, function(items){
          $scope.granTotalI =  items.order.totalItems + $scope.granTotalI ;
        });
        console.log('totalCash',$scope.granTotalE);*/
        }, 
             
        function(err) {
          console.log(err);
          $scope.notify(err.data.error.message);
        });
      
    };
        // Watch select de status
        $scope.$watch("formFilters.seller", function(seller) {
          console.log('cliente seleccionado',seller);

          if (!seller ) {
            return;
          }
    
          var errorMessage = "";
    
          var result = $scope.processSKU(seller);
          if (result) {
            if (errorMessage.length) {
              errorMessage += "<br/>";
            }
            errorMessage += result;
          }
    
          $scope.formFilters.seller = "";
    
          if (errorMessage) {
            showSkuError(errorMessage);
          }
    
        });
//funcion para traer solo los totales
$rootScope.totalesBien = $rootScope.total;
$scope.granTotal=0;
$scope.granTotalC=0;
$scope.granTotalE=0;
$scope.granTotalI=0;
$scope.formFilters={};
$scope.currentUser;
console.log($rootScope.totalesBien)
      // Funciones generales
      /**
       * @name getOrderHasProduct
       * @description Recupera los datos de los pagos por las ordenes de compra
       */
        function getPayment(_seller){
        Payment.find({filter: pFilter})
          .$promise
          .then(function(res) {
              console.log('tengo esto',res)
              $scope.res = res;

            },      
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
          }
          

          getPayment();
     
     
     
    }
    
  ])