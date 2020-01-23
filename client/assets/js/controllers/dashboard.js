angular.module('systemax')
  .controller('DashboardBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      // TODO
      // $scope.header = 'a';
    }
  ])
  /**
   * @description
   */
  .controller('DashboardPrices', [
    '$rootScope',
    '$scope',
    'PurchaseOrder',
    'Stock',
    function($rootScope, $scope, PurchaseOrder, Stock) {
      // Variables generales
      // Control de gráficos en el view
      var ctx = document.getElementById('myChart').getContext('2d');
      var barCharData = {
        labels: ['Utilidad esperada', 'Utilidad real'],
        datasets: [{
          // Set 1
          label: 'Costo del lote',
          backgroundColor: 'rgb(255, 99, 132, 0.8)',
          data: [0, 0]}, {
          // Set 2
          label: 'Utilidad',
          backgroundColor: [
            'rgb(132, 255, 99, 0.8)',
            'rgb(99, 132, 255, 0.8)'],
          data: [0, 0]}]};
      //
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        // The data for our dataset
        data: barCharData,
        // Configuration options go here
        options: {
          responsive: true,
          title: {
            display: true,
            text: ''
          },
          scales: {
            xAxes: [{stacked: true}],
            yAxes: [{
              stacked: true,
              ticks: {
                callback: function(value, index, values) {
                  return '$ ' + value
                }}}]}}});
      //
      var orderFilter = {
        include: [{
          relation: 'batches', scope: {
            include: {
              relation: 'stocks', scope: {
                include: 'product',
                limit: 1}}}}],
          order: 'purchaseDate DESC'};
      //{"include": [{"relation": "batches", "scope": {"include": {"relation": "stocks", "scope": {"limit": 1}}}}],"order": "purchaseDate DESC"}
      /**
       * @name getPurchaseOrders
       */
      function getPurchaseOrders() {
        PurchaseOrder.getStock()
          .$promise
          .then(
            function(orders) {
              $scope.orders = orders;
              console.log(orders);
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getPurchaseOrders

      function updateChart() {
        chart.options.title.text = $scope.currentStock.name;
        barCharData.datasets[0].data = [
          $scope.currentStock.minimumProfit,
          $scope.currentStock.minimumProfit];
        barCharData.datasets[1].data = [
          ($scope.currentStock.expectedProfit - $scope.currentStock.minimumProfit),
          ($scope.currentStock.profit - $scope.currentStock.minimumProfit)];
        chart.update();
      };

      function updatePrices() {
        var updateWhere = {
            idPurchaseOrder: $scope.currentStock.idPurchaseOrder,
            idBatch: $scope.currentStock.idBatch,
            idProduct: $scope.currentStock.idProduct};
        var updateData = {publicPrice: $scope.currentStock.publicPrice};
        Stock.updateAll({where: updateWhere}, updateData)
          .$promise
          .then(
            function(stocks) {
              getPurchaseOrders();
              recalculateValues();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End updatePrices

      function recalculateValues() {
        $scope.currentStock.expectedProfit = $scope.currentStock.publicPrice * $scope.currentStock.realStockSize;
        updateChart();
      }
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de colores.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = orderFilter.where;
        PurchaseOrder.count({where: orderFilter.where || {}})
          .$promise
          .then(function (count) {
            if (orderFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      // Variables del $scope
      $rootScope.menu = 'prices';
      $rootScope.header = 'Lista de precios';
      // Bandera de control de la vista
      $scope.toggleView = false;
      $scope.togglePrice = false;
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        orderFilter = _.extend(orderFilter, $scope.pagination.filter);
        getPurchaseOrders();
      };// End reloadData

      $scope.details = function(order) {
        $scope.toggleView = true;
        $scope.togglePrice = false;
        $scope.currentStock = order;
        // console.log(order);
        updateChart();
      };// End details
      /**
       * @name updatePrice
       */
      $scope.updatePrice = function() {
        $scope.togglePrice = false;
        updatePrices();
      };// End updatePrice
      // Código principal
      // recalculateCountAndReload();
      getPurchaseOrders();


      //
      
    }
  ])/**
  * @description
  */
 .controller('DashboardProfit', [
   '$rootScope',
   '$scope',
   function($rootScope, $scope) {
     $rootScope.menu = 'profit';
     $rootScope.header = 'Utilidad por lote';
   }
 ]);