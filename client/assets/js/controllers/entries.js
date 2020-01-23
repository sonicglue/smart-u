// TODO: implementar el código del controller
angular.module('systemax')
  .controller('EntriesCtrlr', [
    '$scope',
    '$interval',
    '$sce',
    'Batch',
    function($scope, $interval, $sce, Batch) {
      // Declaración de variables
      var timer = $interval(getBatches, 5000);
      $scope.batches = [];
      $scope.fecha = new Date();
      // Declaración de funciones
      /**
       * @description Recupera los lotes de productos del día
       */
      function getBatches() {
        var today = moment().format('YYYY-MM-DD');
        var filter = {
          include: ['product', 'box'],
          where: {
            and:[
              { date: {gte: today + ' 00:00:00'}},
              { date: {lte: today + ' 23:59:59'}}]}};
        Batch.find({filter: filter})
          .$promise
          .then(function(batches) {
            $scope.batches = batches;
            $scope.batches.stockCount = 0;
            $scope.batches.boxCount = 0;
            _.each(batches, function(batch) {
              $scope.batches.stockCount += batch.stockCount;
              $scope.batches.boxCount +=
                Math.floor(batch.stockCount / batch.box.size);
            });
          },
          function(err) {
            // TODO: implementar mensajes de aviso
            console.log(err);
          });
      }
      /**
       * @description Da formato html al nombre del producto.
       * @param {string} name Nombre del producto en texto.
       * @return {html} Nombre del producto en html.
       */
      $scope.setProductName = function(name) {
        var reName = name.split(',');
        var html = reName[0] + '<br><span class="small">' + reName[1] +
          '</span>';
        return $sce.trustAsHtml(html);
      }
      /**
       * @description Calcula y da formato a la cuenta de cajas del lote.
       * @param {number} count Cantidad de código de barras capturados.
       * @param {number} size Cantidad de productos por caja.
       * @return {html} Calculo de cajas en html.
       */
      $scope.setBoxCount = function(count, size) {
        var boxes = Math.floor(count / size);
        var free = count % size;
        var html = 'cajas: <b>' + boxes + '</b> | piezas sueltas: <b>' + free +
          '</b>';
        return $sce.trustAsHtml(html);
      }
      // Watcher dedicado para cuando se destruye $scope
      $scope.$on('$destroy', function() {
        if (timer) {
          $interval.cancel(timer);
        }
      });
      // Watcher principal
      $scope.$watch('currentUser', function(user) {
        // TODO: implementar código para el usuario
        return;
      });
      // Código principal
      console.log('entries.js => EntriesCtrlr', $scope);
      getBatches();
    }
  ])
  .controller('EntriesNewCtrlr', [
    '$scope',
    function($scope) {
      console.log('entries.js => EntriesNewCtrlr', $scope);
    }
  ])
  .controller('EntriesModelCtrlr', [
    '$scope',
    function($scope) {
      console.log('entries.js => EntriesModelCtrlr', $scope);
    }
  ])
  .controller('EntriesImeiCtrlr', [
    '$scope',
    '$interval',
    function($scope, $interval) {
      var count = 1;
      var timer = $interval(getBatches, 5000);

      function getBatches() {
        console.log('IMEI: He sido llamada ' + count + ' veces');
        count++;
      }
      // window.setInterval(getBatches, 5000);
      // console.log(window.activeIntervals);
      $scope.$on('$destroy', function() {
        console.log('llamada a destroy');
        if (timer) {
          $interval.cancel(timer);
        }
      });
      console.log('entries.js => EntriesImeiCtrlr', $scope);
    }
  ]);