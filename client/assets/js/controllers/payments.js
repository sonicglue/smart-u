angular.module('systemax')
  .controller('PaymentBlank', [
    '$scope',
    function($scope) {
    
    }
  ])
  /**
   * @description Controlador en blanco para los abonos.
   */
  .controller('CheckPaymentBlank', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      // Control del ménu
      $rootScope.menu = 'check-payment';
    }
  ])
  /**
   * @description Controlador para mostrar los abonos pendientes.
   */
  .controller('CheckPaymentList', [
    '$rootScope',
    '$scope',
    '$filter',
    '$interval',
    'Payment',
    function($rootScope, $scope, $filter, $interval, Payment) {
      // Variables generales
      var paymentFilter = {
        include: ['client', 'order', 'seller'],
        where: {
          and: [
            {status: 'all'},
            {type: {neq: 'credit'}}]},
        order: ['date DESC', 'type']};
      var timer = null;
      var activePayment = '';
      // Funciones generales
      /**
       * @name getPayments
       * @description Recupera los datos de los abonos registrados.
       */
      function getPayments() {
        Payment.find({filter: paymentFilter})
          .$promise
          .then(
            function(payments) {
              if (activePayment === '') {
                // ...no esta activa la caja de edición
                $scope.payments = payments;
                _.each($scope.payments, function(p) {
                  p.disable = true;
                  if (p.id === activePayment) {
                    // ...evitar desactiva la caja
                    p.disable = false;
                  }
                });
              }
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getPayments
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de abonos.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = paymentFilter.where;
        Payment.count({where: paymentFilter.where || {}})
          .$promise
          .then(function (count) {
            if (paymentFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      /**
       * @name updatePayment
       * @description Actualiza la orden de compra.
       */
      function updatePayment() {
        $scope.busy = true;
        Payment.prototype$patchAttributes({id: $scope.payment.id}, $scope.payment)
          .$promise
          .then(
            function(payment) {
              $scope.busy = false;
              $scope.notify('Registro actualizado satisfactoriamente.',
                'success');
              $scope.payment = {};
              recalculateCountAndReload();
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End updatePayment
      /**
       * @name updateTransaction
       * @description
       * @param {object} payment 
       */
      function updateTransaction(payment) {
        var update = {
          transactionId: payment.transactionId};
        Payment.prototype$patchAttributes({id: payment.id}, update,
          function(result) {
            $scope.notify('Actualización de la referencia exitosa', 'success');
          },
          function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End updateTransaction
      // Variables del $scope
      $scope.payment = {};
      // Objeto de abonos
      $scope.payments = {};
      // Objeto estado del abono
      $scope.paymentStatus = [
        {tag: 'paid', label: 'Pagados'},
        {tag: 'pending', label: 'Pendientes'},
        {tag: 'canceled', label: 'Cancelados'}];
      // Objeto de filtro
      $scope.formFilters = {
        status: 'pending'};
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        paymentFilter = _.extend(paymentFilter, $scope.pagination.filter);
        getPayments();
      };// End reloadData
      /**
       * @name acceptPayment
       * @description
       * @param {object} payment Objeto de abono.
       */
      $scope.acceptPayment = function(payment) {
        if (payment.status !== 'pending') return;
        $scope.payment.id = payment.id;
        $scope.payment.status = 'paid';
        updatePayment();
      };// End acceptPayment
      /**
       * @name back
       * @description Limpia el formulario de conciliación.
       */
      $scope.back = function() {
        $scope.payment = {};
      };// End back
      /**
       * @name getPaymentStatus
       * @description Devuelve el estado del pago.
       * @param {string} status Estado del pago.
       */
      $scope.getPaymentStatus = function(status) {
        switch (status) {
          case 'paid': return 'Pagado';
          case 'pending': return 'Pendiente';
          case 'canceled': return 'Cancelado';
          default: return '-';
        };
      };// End getPaymentStatus
      /**
       * @name getPaymentType
       * @description Devuelve el tipo de pago.
       */
      $scope.getPaymentType = function(type) {
        switch (type) {
          case 'cash': return 'Efectivo';
          case 'deposit': return 'Deposito';
          case 'check': return 'Cheque';
          case 'credit': return 'Crédito';
        }
      };// End getPaymentType
      /**
       * @name checkPayment
       * @description Carga los datos del pago para su actualización.
       * @param {object} payment Objeto con datos del pago.
       */
      $scope.checkPayment = function(payment) {
        $scope.payment = payment;
      };// End checkPayment
      /**
       * @name cancelPayment
       */
      $scope.cancelPayment = function(payment) {
        if (payment.status !== 'pending') return;
        $scope.payment.id = payment.id;
        $scope.payment.status = 'canceled';
        $scope.showModal('fa-warning',
          'Cancelar abono en el sistema',
          '<p>¿Desea cancelar el abono de <b>' + $filter('currency')(payment.amount) +
          '</b> del cliente <b>' + payment.client.name + '</b>?</p>' +
          '<p>Esta operación actualiza su deuda y no puede deshacerse.</p>',
          {},
          function() {
            updatePayment();
          });
      };// End cancelPayment
      /**
       * @name save
       * @description Valida el formulario antes de actualizar el pago.
       * @deprecated
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        if ($scope.payment.deposit > 0) {
          if (!$scope.payment.depositStatus) {
            $scope.notify('Debe seleccionar si el depósito procede.');
            return;
          } else if ($scope.payment.depositStatus === 'valid' &&
            !$scope.payment.transactionId) {
            $scope.notify('Debe escribir el número de referencia del deposito' +
              '/transferencia');
            return;
          }
        }
        if ($scope.payment.check > 0 && !$scope.payment.checkStatus) {
          $scope.notify('Seleccione de la lista el estado del cheque');
          return;
        }
        updatePayment();
      };// End save
      /**
       * @name toggleInput
       * @description Habilita o desabilita del campo de transaction id.
       * @param {object} payment Objeto de abono.
       */
      $scope.toggleInput = function(payment) {
        if (timer === null) {
          // ...activar el intervalo
          timer = $interval(recalculateCountAndReload, 3000);
        } else {
          // ...cancelar el intervalo
          $interval.cancel(timer);
          timer = null;
        }
        if (payment.status !== 'pending') return;
        if (!payment.disable) {
          // ...la caja esta deshabilitada
          payment.disable = true;
          if (payment.transactionId) {
            // ...la caja no esta vacía
            activePayment = '';
            updateTransaction(payment);
          }
        } else {
          // ...la caja esta habilitada
          payment.disable = false;
          activePayment = payment.id;
        }
        _.each($scope.payments, function(p) {
          if (p.id !== payment.id) {
            // ...deshabilitar todas excepto una
            p.disable = true;
          }
        });
      };// End toggleInput
      // Watchers
      $scope.$watch('formFilters.status', function(status) {
        if (!status) return;
        paymentFilter.where.and[0] = {status: status};
        recalculateCountAndReload();
      });
      // Watcher dedicado para cuando se destruye $scope
      $scope.$on('$destroy', function() {
        if (timer) {
          $interval.cancel(timer);
        }
      });// End $on $destroy
      // Código principal
    }
  ]);
/******************************************************************************/