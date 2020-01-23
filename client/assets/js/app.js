/**
 * @author MadMedia Developers
 * @module systemax
 * @enum {array} Dependencias del módulo.
 */
angular.module('systemax', [
    'ui.router',
    'ngStorage',
    'lbServices',
    'angularFileUpload',
    'datatables',
    'datatables.buttons',
    'ngAnimate',
    'ui.calendar',
  ])
  /**
   *
   */
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('login', {
          url: '/login',
          controller: 'Login',
          templateUrl: 'views/common/login.html'
        })
        .state('logout', {
          url: '/logout',
          controller: 'Logout',
        })
        .state('forgot-password', {
          url: '/forgot-password',
          templateUrl: '/views/common/forgot-password.html',
          controller: 'ForgotPassword',
          authenticate: false
        })
        .state('reset-password', {
          url: '/reset-password?access_token',
          templateUrl: '/views/common/reset-password.html',
          controller: 'ResetPassword',
          authenticate: false
        })
        .state('forbidden', {
          url: '/forbidden',
          templateUrl: 'views/common/forbidden.html'
        })
        // Administrador
        .state('admin', {
          url: '/admin',
          templateUrl: 'views/admin/admin.html',
          authenticate: true
        })
        .state('admin.dashboard', {
          url: '/tablero-de-control',
          controller: 'DashboardBlank',
          templateUrl: 'views/admin/dashboard/d-blank.html',
          authenticate: true
        })
        .state('admin.dashboard.prices', {
          url: '/precios',
          controller: 'DashboardPrices',
          templateUrl: 'views/admin/dashboard/d-prices.html',
          authenticate: true
        })
        .state('admin.dashboard.profit', {
          url: '/utilidad',
          controller: 'DashboardProfit',
          templateUrl: 'views/admin/dashboard/d-profit.html',
          authenticate: true
        })
        /*
        .state('admin.blank', {
          url: '/',
          templateUrl: 'views/admin/blank.html',
          authenticate: true
        })
        */
        // Perfil del usuario
        .state('admin.profile', {
          url: '/mi-perfil',
          controller: 'ProfileBlank',
          templateUrl: 'views/admin/profile/pf-blank.html',
          authenticate: true
        })
        .state('admin.profile.data', {
          url: '/',
          controller: 'ProfileData',
          templateUrl: 'views/admin/profile/pf-data.html',
          authenticate: true
        })
        /**
         * Estado deshabilitado
         *  .state('admin.profile.reset', {
         *    url: '/cambiar-password',
         *    controller: 'ProfileReset',
         *    templateUrl: 'views/admin/profile/pf-reset.html',
         *    authenticate: true
         *  })
         */
        .state('admin.profile.edit', {
          url: '/editar',
          controller: 'ProfileForm',
          templateUrl: 'views/admin/profile/pf-form.html',
          authenticate: true
        })
        // Estados de Monzze
        .state('admin.debts', {
          controller: 'debtsBillings',
          url: '/adeudos',
          templateUrl: 'views/admin/creditsAndebits/a-blank.html'
        })
        /*.state('admin.discountDet.list', {
          url: '/{idClient}',
          controller: 'debtsBillings',
          templateUrl: 'views/admin/creditsAndebits/discountDet.html',
          authenticate: true
        })*/
        .state('admin.debts.list', {
          controller: 'debtsBillings',
          url: '/',
          templateUrl: 'views/admin/creditsAndebits/debts.html'
        })
        .state('admin.debts.historic', {
          controller: 'debtsDateBillings',
          url: '/{idClient}',
          templateUrl: 'views/admin/creditsAndebits/historic.html',
          authenticate: true
        })
        .state('admin.historical', {
          controller: 'debtsManager',
          url: '/historical',
          templateUrl: 'views/admin/creditsAndebits/historical.html'
        })
        /* .state('admin.historicc', {
           controller: 'debtsDateBillings' ,
           url: '/{idClient}',
           templateUrl: 'views/admin/creditsAndebits/historicc.html',
           authenticate: true
         })*/
        // Reportes
        .state('admin.report', {
          url: '/reportes',
          controller: 'ReportBlank',
          templateUrl: 'views/admin/reports/rp-blank.html',
          authenticate: true
        })
        .state('admin.report.routes', {
          url: '/rutas',
          controller: 'ReportRoutes',
          templateUrl: 'views/admin/reports/rp-routes.html',
          authenticate: true
        })
        .state('admin.report.series', {
          url: '/series-masivas',
          controller: 'ReportSeries',
          templateUrl: 'views/admin/reports/rp-series.html',
          authenticate: true
        })
        .state('admin.report.sales', {
          url: '/ventas',
          controller: 'ReportSales',
          templateUrl: 'views/admin/reports/rp-sales.html',
          authenticate: true
        })
        .state('admin.report.guarantees', {
          url: '/garantias',
          controller: 'ReportGuarantees',
          templateUrl: 'views/admin/reports/rp-guarantees.html',
          authenticate: true
        })
        /*  .state('admin.reports', {
          url: '/reportes',
          controller: 'ReportBlank',
          templateUrl: 'views/admin/reports/rp-blank.html',
          authenticate: true
        })
       .state('admin.reports.rp-list', {
         url: '/',
         controller: 'ReportList',
         templateUrl: 'views/admin/reports/rp-list.html',
         authenticate: true
       })
        //////////////////////////////////////////////
        .state('admin.reports.rp-listS', {
         url: '/',
         controller: 'ReportListSeries',
         templateUrl: 'views/admin/reports/reportS/rp-listS.html',
         authenticate: true
        })/*/
        .state('admin.dashboardV', {
          controller: 'dashboardV',
          url: '/dashboardV',
          templateUrl: 'views/admin/sale/dashboardV.html',
          authenticate: true
        })
        // Cut cambaceo
        .state('admin.cut', {
          url: '/corte',
          controller: 'CutSellerBlankController',
          templateUrl: 'views/admin/sale/cambaceoCut/c-blank.html',
          authenticate: true
        })
        .state('admin.cut.list', {
          url: '/',
          controller: 'CutSellerController',
          templateUrl: 'views/admin/sale/cambaceoCut/c-list.html',
          authenticate: true
        })
        .state('admin.cut.scan', {
          url: '/{idSeller}',
          controller: 'CutSellerScanController',
          templateUrl: 'views/admin/sale/cambaceoCut/c-scan.html',
          authenticate: true
        })
        .state('admin.cut.transfer', {
          url: '/traspaso/{assignmentId}',
          controller: 'AssignmentForm',
          templateUrl: 'views/admin/sale/cambaceoCut/c-traspaso.html',
          authenticate: true
        })
        .state('admin.cut.print', {
          url: '/imprimir/{idSeller}',
          controller: 'PrintAssignmentController',
          templateUrl: 'views/admin/sale/cambaceoCut/c-print.html',
          authenticate: true
        })
        //Escaneo por disponible
        .state('admin.scanByAvailable', {
          url: '/escaneo-por-disponible',
          controller: 'scanByAvailableBlankController',
          templateUrl: 'views/admin/scanByAvailable/s-blank.html',
          authenticate: true
        })
        .state('admin.scanByAvailable.form', {
          url: '/',
          controller: 'scanByAvailableController',
          templateUrl: 'views/admin/scanByAvailable/s-form.html',
          authenticate: true
        })
        // point of sale
        .state('admin.pointOfSale', {
          url: '/punto-de-venta',
          controller: 'PointOfSaleBlankController',
          templateUrl: 'views/admin/pointOfSale/p-blank.html',
          authenticate: true
        })
        .state('admin.pointOfSale.list', {
          url: '/{idWarehouse}',
          controller: 'PointOfSaleFormController',
          templateUrl: 'views/admin/pointOfSale/p-form.html',
          authenticate: true
        })
        .state('admin.pointOfSale.dashboard', {
          url: '/dashboard/',
          controller: 'PointOfSaleDashboardController',
          templateUrl: 'views/admin/pointOfSale/p-dashboard.html',
          authenticate: true
        })
        //Sale
        .state('admin.sale', {
          url: '/venta',
          controller: 'SaleBlankController',
          templateUrl: 'views/admin/sale/registerSale/s-blank.html',
          authenticate: true
        })
        .state('admin.sale.search', {
          url: '/',
          controller: 'SaleSellerController',
          templateUrl: 'views/admin/sale/registerSale/s-search-seller.html',
          authenticate: true
        })
        .state('admin.sale.form', {
          url: '/{idSeller}',
          controller: 'SaleFormController',
          templateUrl: 'views/admin/sale/registerSale/s-form.html',
          authenticate: true
        })
        //Dashboard general
        .state('admin.dashboardG', {
          controller: 'DashboardGBlankController',
          url: '/dashboard-general',
          templateUrl: 'views/admin/sale/dashboardGeneral/d-blank.html',
          authenticate: true
        })
        .state('admin.dashboardG.list', {
          controller: 'DashboardGListController',
          url: '/',
          templateUrl: 'views/admin/sale/dashboardGeneral/d-general.html',
          authenticate: true
        })
        .state('admin.assignmentsSaleClient', {
          controller: 'AssignmentSellerScanController',
          url: '/assignmentsSaleClient/{idSeller}',
          templateUrl: 'views/admin/sale/assignmentsSaleClient.html',
          authenticate: true
        })
        .state('admin.assignments', {
          controller: 'Assigments',
          url: '/assignments',
          templateUrl: 'views/admin/sale/assignments.html'
        })
        .state('admin.assignments-client', {
          controller: 'AssigmentsSee',
          url: '/assignments-client',
          templateUrl: 'views/admin/sale/assignments-client.html'
        })
        /*.state('admin.guarantee', {
          controller: 'UserList',
          url: '/guarantee',
          templateUrl: 'views/admin/guarantee.html'
        })
        .state('admin.guaranty', {
          url: '/guaranty',
          templateUrl: 'views/admin/guaranty.html'
        })*/
        .state('admin.guaranteeClient', {
          controller: 'BillingsList',
          url: '/guaranteeClient',
          templateUrl: 'views/admin/guaranteeClient.html'
        })
        .state('admin.guarantyReport', {
          controller: 'BillingsList',
          url: '/guarantyReport',
          templateUrl: 'views/admin/guarantyReport.html'
        })
        .state('admin.asigmentManager', {
          controller: 'checkManager',
          url: '/checkManager',
          templateUrl: 'views/admin/sale/asigmentManager.html',
          authenticate: true
        })
        // Usuarios
        .state('admin.user', {
          url: '/usuarios',
          controller: 'UserBlank',
          templateUrl: 'views/admin/users/u-blank.html',
          authenticate: true
        })
        .state('admin.user.list', {
          url: '/',
          controller: 'UserList',
          templateUrl: 'views/admin/users/u-list.html',
          authenticate: true
        })
        .state('admin.user.add', {
          url: '/nuevo',
          controller: 'UserForm',
          templateUrl: 'views/admin/users/u-form.html',
          authenticate: true
        })
        .state('admin.user.edit', {
          url: '/editar/{userId}',
          controller: 'UserForm',
          templateUrl: 'views/admin/users/u-form.html',
          authenticate: true
        })
        .state('admin.manager-seller', {
          url: '/gerentes',
          templateUrl: 'views/admin/user/u-manager-blank.html',
          authenticate: true
        })
        .state('admin.manager-seller.list', {
          url: '/',
          templateUrl: 'views/admin/user/u-manager-list.html',
          authenticate: true
        })
        .state('admin.manager-seller.form', {
          url: '/vendedores/{managerId}',
          templateUrl: 'views/admin/user/u-manager-form.html',
          authenticate: true
        })
        // Warehouses
        .state('admin.warehouse', {
          url: '/almacenes',
          controller: 'WarehouseBlank',
          templateUrl: 'views/admin/warehouses/wh-blank.html',
          authenticate: true
        })
        .state('admin.warehouse.list', {
          url: '/',
          controller: 'WarehouseList',
          templateUrl: 'views/admin/warehouses/wh-list.html',
          authenticate: true
        })
        .state('admin.warehouse.add', {
          url: '/nuevo',
          controller: 'WarehouseForm',
          templateUrl: 'views/admin/warehouses/wh-form.html',
          authenticate: true
        })
        .state('admin.warehouse.edit', {
          url: '/editar/{warehouseId}',
          controller: 'WarehouseForm',
          templateUrl: 'views/admin/warehouses/wh-form.html',
          authenticate: true
        })
        .state('admin.warehouse.manage', {
          url: '/administrar/{warehouseId}',
          controller: 'WarehouseManage',
          templateUrl: 'views/admin/warehouses/wh-manage.html',
          authenticate: true
        })
        // Billing (companies)
        .state('admin.company', {
          url: '/empresas',
          controller: 'BillingBlank',
          templateUrl: 'views/admin/billings/b-blank.html',
          authenticate: true
        })
        .state('admin.company.list', {
          url: '/',
          controller: 'BillingsList',
          templateUrl: 'views/admin/billings/b-list.html',
          authenticate: true
        })
        .state('admin.company.add', {
          url: '/nueva',
          controller: 'BillingForm',
          templateUrl: 'views/admin/billings/b-form.html',
          authenticate: true
        })
        .state('admin.company.edit', {
          url: '/editar/{billingId}',
          controller: 'BillingForm',
          templateUrl: 'views/admin/billings/b-form.html',
          authenticate: true
        })
        // Billing (clients)
        .state('admin.client', {
          url: '/clientes',
          controller: 'BillingBlank',
          templateUrl: 'views/admin/billings/b-blank.html',
          authenticate: true
        })
        .state('admin.client.list', {
          url: '/',
          controller: 'BillingsList',
          templateUrl: 'views/admin/billings/b-list.html',
          authenticate: true
        })
        .state('admin.client.add', {
          url: '/nuevo',
          controller: 'BillingForm',
          templateUrl: 'views/admin/billings/b-form.html',
          authenticate: true
        })
        .state('admin.client.edit', {
          url: '/editar/{billingId}',
          controller: 'BillingForm',
          templateUrl: 'views/admin/billings/b-form.html',
          authenticate: true
        })
        // Billing (providers)
        .state('admin.provider', {
          url: '/proveedores',
          controller: 'BillingBlank',
          templateUrl: 'views/admin/billings/b-blank.html',
          authenticate: true
        })
        .state('admin.provider.list', {
          url: '/',
          controller: 'BillingsList',
          templateUrl: 'views/admin/billings/b-list.html',
          authenticate: true
        })
        .state('admin.provider.add', {
          url: '/nuevo',
          controller: 'BillingForm',
          templateUrl: 'views/admin/billings/b-form.html',
          authenticate: true
        })
        .state('admin.provider.edit', {
          url: '/editar/{billingId}',
          controller: 'BillingForm',
          templateUrl: 'views/admin/billings/b-form.html',
          authenticate: true
        })
        // Color
        .state('admin.color', {
          url: '/colores',
          controller: 'ColorBlank',
          templateUrl: 'views/admin/colors/cl-blank.html',
          authenticate: true
        })
        .state('admin.color.list', {
          url: '/',
          controller: 'ColorList',
          templateUrl: 'views/admin/colors/cl-list.html',
          authenticate: true
        })
        .state('admin.color.add', {
          url: '/nuevo',
          controller: 'ColorForm',
          templateUrl: 'views/admin/colors/cl-form.html',
          authenticate: true
        })
        // Marcas
        .state('admin.brand', {
          url: '/marcas',
          controller: 'BrandBlank',
          templateUrl: 'views/admin/brands/bd-blank.html',
          authenticate: true
        })
        .state('admin.brand.list', {
          url: '/',
          controller: 'BrandList',
          templateUrl: 'views/admin/brands/bd-list.html',
          authenticate: true
        })
        .state('admin.brand.add', {
          url: '/nuevo',
          controller: 'BrandForm',
          templateUrl: 'views/admin/brands/bd-form.html',
          authenticate: true
        })
        // Modelos
        .state('admin.model', {
          url: '/modelos',
          controller: 'ModelBlank',
          templateUrl: 'views/admin/models/md-blank.html',
          authenticate: true
        })
        .state('admin.model.list', {
          url: '/',
          controller: 'ModelList',
          templateUrl: 'views/admin/models/md-list.html',
          authenticate: true
        })
        .state('admin.model.add', {
          url: '/nuevo',
          controller: 'ModelForm',
          templateUrl: 'views/admin/models/md-form.html',
          authenticate: true
        })
        // Productos
        .state('admin.product', {
          url: '/productos',
          controller: 'ProductBlank',
          templateUrl: 'views/admin/products/pd-blank.html',
          authenticate: true
        })
        .state('admin.product.list', {
          url: '/',
          controller: 'ProductListC',
          templateUrl: 'views/admin/products/pd-list.html',
          authenticate: true
        })
        .state('admin.product.add', {
          url: '/nuevo',
          controller: 'ProductFormC',
          templateUrl: 'views/admin/products/pd-form.html',
          authenticate: true
        })
        .state('admin.product.edit', {
          url: '/editar/{productId}',
          controller: 'AddAccessory',
          templateUrl: 'views/admin/products/pd-assignmentAccessory.html',
          authenticate: true
        })
        // Ordenes de compra
        .state('admin.purchase-order', {
          url: '/ordenes-de-compra',
          controller: 'PurchaseOrderBlank',
          templateUrl: 'views/admin/purchase-orders/po-blank.html',
          authenticate: true
        })
        .state('admin.purchase-order.list', {
          url: '/',
          controller: 'PurchaseOrdersList',
          templateUrl: 'views/admin/purchase-orders/po-list.html',
          authenticate: true
        })
        .state('admin.purchase-order.add', {
          url: '/nueva',
          controller: 'PurchaseOrderForm',
          templateUrl: 'views/admin/purchase-orders/po-form.html',
          authenticate: true
        })
        .state('admin.purchase-order.edit', {
          url: '/editar/{purchaseId}',
          controller: 'PurchaseOrderForm',
          templateUrl: 'views/admin/purchase-orders/po-form.html',
          authenticate: true
        })
        .state('admin.purchase-order.batch', {
          url: '/orden/{purchaseId}',
          controller: 'PurchaseOrderBatchs',
          templateUrl: 'views/admin/purchase-orders/po-batch-form.html',
          authenticate: true
        })
        // Registro de IMEIs
        .state('admin.batch', {
          url: '/lotes',
          controller: 'BatchBlank',
          templateUrl: 'views/admin/batches/bt-blank.html',
          authenticate: true
        })
        .state('admin.batch.list', {
          url: '/',
          controller: 'BatchList',
          templateUrl: 'views/admin/batches/bt-list.html',
          authenticate: true
        })
        .state('admin.batch.imei', {
          url: '/lote/{batchId}',
          controller: 'BatchImei',
          templateUrl: 'views/admin/batches/bt-imei.html',
          authenticate: true
        })
        .state('admin.batch.add', {
          url: '/nuevo/{purchaseOrderId}',
          controller: 'BatchForm',
          templateUrl: 'views/admin/batches/bt-form.html',
          authenticate: true
        })
        /**
         * EStado deshabilitado
         *  // Payment
         *  .state('admin.purchase-order.status-list', {
         *    url: '/pagos',
         *    controller: 'PurchaseOrdersStatus',
         *    templateUrl: 'views/admin/purchase-orders/po-status-list.html',
         *    authenticate: true
         *  })
         */
        // Inventory
        .state('admin.inventory', {
          url: '/inventario',
          templateUrl: 'views/admin/inventory/in-blank.html',
          authenticate: true
        })
        .state('admin.inventory.list', {
          url: '/',
          controller: 'WarehouseStock',
          templateUrl: 'views/admin/inventory/in-list.html',
          authenticate: true
        })
        // Stock
        .state('admin.stock', {
          url: '/series',
          controller: 'StockBlank',
          templateUrl: 'views/admin/stocks/st-blank.html',
          authenticate: true
        })
        .state('admin.stock.list', {
          url: '/',
          controller: 'StockList',
          templateUrl: 'views/admin/stocks/st-list.html',
          authenticate: true
        })
        .state('admin.stock.form', {
          url: '/corte/{sellerId}',
          controller: 'StockForm',
          templateUrl: 'views/admin/stocks/st-form.html',
          authenticate: true
        })
        // Consulta de series
        .state('admin.find', {
          url: '/buscar-producto',
          controller: 'StockFindBlank',
          templateUrl: 'views/admin/stocks/sf-blank.html',
          authenticate: true
        })
        .state('admin.find.form', {
          url: '/',
          controller: 'StockFindForm',
          templateUrl: 'views/admin/stocks/sf-form.html',
          authenticate: true
        })
        // Assignment
        .state('admin.assignment', {
          url: '/traspaso',
          controller: 'AssignmentBlank',
          templateUrl: 'views/admin/assignment/a-blank.html',
          authenticate: true
        })
        .state('admin.assignment.list', {
          url: '/',
          controller: 'AssignmentList',
          templateUrl: 'views/admin/assignment/a-list.html',
          authenticate: true
        })
        /**
         * Estado deshabilitado
         *  .state('admin.assignment.add', {
         *    url: '/nuevo/{origin}/{destiny}',
         *    controller: 'AssignmentForm',
         *    templateUrl: 'views/admin/assignment/a-form.html',
         *    authenticate: true
         *  })
         */
        .state('admin.assignment.edit', {
          url: '/editar/{assignmentId}',
          controller: 'AssignmentForm',
          templateUrl: 'views/admin/assignment/a-form.html',
          authenticate: true
        })
        .state('admin.assignment.sheet', {
          url: '/hoja-de-asignacion/{assignmentId}',
          controller: 'AssignmentStock',
          templateUrl: 'views/admin/assignment/a-sheet.html',
          authenticate: true
        })
        // Hojas de cambaceo
        .state('admin.route', {
          url: '/cambaceo',
          controller: 'WarehouseRouteBlank',
          templateUrl: 'views/admin/warehouses/ss-blank.html',
          authenticate: true
        })
        .state('admin.route.list', {
          url: '/',
          controller: 'WareohuseRouteList',
          templateUrl: 'views/admin/warehouses/ss-list.html',
          authenticate: true
        })
        // Ordenes de compra
        .state('admin.order', {
          url: '/ventas',
          controller: 'OrderBlank',
          templateUrl: 'views/admin/orders/or-blank.html',
          authenticate: true
        })
        .state('admin.order.list', {
          url: '/',
          controller: 'OrderList',
          templateUrl: 'views/admin/orders/or-list.html',
          authenticate: true
        })
        .state('admin.order.form', {
          url: '/ejecutivo/{sellerId}',
          controller: 'OrderForm',
          templateUrl: 'views/admin/orders/or-form.html',
          authenticate: true
        })
        // Conciliación de pagos
        .state('admin.check-payment', {
          url: '/conciliacion',
          controller: 'CheckPaymentBlank',
          templateUrl: 'views/admin/payments/py-check-blank.html',
          authenticate: true
        })
        .state('admin.check-payment.list', {
          url: '/',
          controller: 'CheckPaymentList',
          templateUrl: 'views/admin/payments/py-check-list.html',
          authenticate: true
        })
        // Garantías
        .state('admin.guarantee', {
          url: '/garantias',
          controller: 'GuaranteeBlank2',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee.status-sheet', {
          url: '/acuse/{guaranteeId}',
          controller: 'GuaranteeSuccess',
          templateUrl: 'views/admin/guaranties/gt-success.html',
          authenticate: true
        })
        // Listas de garantías
        .state('admin.guarantee.graph', {
          url: '/{status}',
          controller: 'GuaranteeGraph',
          templateUrl: 'views/admin/guaranties/gt-graph.html',
          authenticate: true
        })
        .state('admin.guarantee.for-refund', {
          url: '/bonificar/{guaranteeId}',
          controller: 'GuaranteeForRefund',
          templateUrl: 'views/admin/guaranties/gt-for-refund.html',
          authenticate: true
        })
        .state('admin.guarantee.re-entry', {
          url: '/re-ingresar/{guaranteeId}',
          controller: 'GuaranteeForRefund',
          templateUrl: 'views/admin/guaranties/gt-re-entry.html',
          authenticate: true
        })
        // Guaranties pre-entry
        .state('admin.guarantee-pre-entry', {
          url: '/recepcion-garantias',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-pre-entry.list', {
          url: '/',
          controller: 'GuaranteeList',
          templateUrl: 'views/admin/guaranties/gt-list.html',
          authenticate: true
        })
        .state('admin.guarantee-pre-entry.add', {
          url: '/registro',
          controller: 'GuaranteeForm2',
          templateUrl: 'views/admin/guaranties/gt-form.html',
          authenticate: true
        })
        .state('admin.guarantee-pre-entry.edit', {
          url: '/editar/{guaranteeId}',
          controller: 'GuaranteeForm2',
          templateUrl: 'views/admin/guaranties/gt-form.html',
          authenticate: true
        })
        // Ingreso de garantías
        .state('admin.guarantee-entry', {
          url: '/entrada-garantias',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-entry.list', {
          url: '/',
          controller: 'GuaranteeListEntry',
          templateUrl: 'views/admin/guaranties/gt-list.html',
          authenticate: true
        })
        .state('admin.guarantee-entry.edit', {
          url: '/garantia/{guaranteeId}',
          controller: 'GuaranteeFormEntry',
          templateUrl: 'views/admin/guaranties/gt-tracking.html',
          authenticate: true
        })
        // Salida de garantías al proveedor
        .state('admin.guarantee-departure', {
          url: '/envio-proveedor',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-departure.list', {
          url: '/',
          controller: 'GuaranteeListDeparture',
          templateUrl: 'views/admin/guaranties/gt-listE.html',
          authenticate: true
        })
        .state('admin.guarantee-departure.edit', {
          url: '/garantia/{guaranteeId}',
          controller: 'GuaranteeFormDeparture',
          templateUrl: 'views/admin/guaranties/gt-tracking.html',
          authenticate: true
        })
        // Reingreso de garantías
        .state('admin.guarantee-re-entry', {
          url: '/re-ingreso',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-re-entry.list', {
          url: '/',
          controller: 'GuaranteeListReEntry',
          templateUrl: 'views/admin/guaranties/gt-listR.html',
          authenticate: true
        })
        .state('admin.guarantee-re-entry.edit', {
          url: '/asignar/{guaranteeId}',
          controller: 'GuaranteeFormReEntry',
          templateUrl: 'views/admin/guaranties/gt-tracking1.html',
          authenticate: true
        })
        // Reasignación de garantías
        .state('admin.guarantee-re-assignment', {
          url: '/asignacion-garantias',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-re-assignment.list', {
          url: '/',
          controller: 'GuaranteeListReAssignment',
          templateUrl: 'views/admin/guaranties/gt-list.html',
          authenticate: true
        })
        .state('admin.guarantee-re-assignment.edit', {
          url: '/asignar/{guaranteeId}',
          controller: 'GuaranteeFormReAssignment',
          templateUrl: 'views/admin/guaranties/gt-tracking.html',
          authenticate: true
        })
        // Guarantías rechazadas
        .state('admin.guarantee-canceled', {
          url: '/garantias-canceladas',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-canceled.list', {
          url: '/',
          controller: 'GuaranteeListCanceled',
          templateUrl: 'views/admin/guaranties/gt-listC.html',
          authenticate: true
        })
        .state('admin.guarantee-canceled.edit', {
          url: '/new/{guaranteeId}',
          controller: 'GuarantieFormCanceled',
          templateUrl: 'views/admin/guaranties/gt-tracking.html',
          authenticate: true
        })
        // Garantías a bonificar
        .state('admin.guarantee-refund', {
          url: '/seguimiento-garantias',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-refund.list', {
          url: '/',
          controller: 'GuaranteeListRefund',
          templateUrl: 'views/admin/guaranties/gt-listRefund.html',
          authenticate: true
        })
        .state('admin.guarantee-refund.edit', {
          url: '/editar/{guaranteeId}',
          controller: 'GuaranteeFormRefund',
          templateUrl: 'views/admin/guaranties/gt-trackingRefund.html',
          authenticate: true
        })
        // Marcar garantía como reacondicionada
        .state('admin.guarantee-refurb', {
          url: '/cambio-imei',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-refurb.list', {
          url: '/',
          controller: 'GuaranteeListRefurb',
          templateUrl: 'views/admin/guaranties/gt-listN.html',
          authenticate: true
        })
        .state('admin.guarantee-refurb.edit', {
          url: '/new/{guaranteeId}',
          controller: 'GuaranteeFormRefurb',
          templateUrl: 'views/admin/guaranties/gt-tracking2.html',
          authenticate: true
        })
        // Semaforo de garantías
        .state('admin.guarantee-report', {
          url: '/reporte-garantias',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-report.list', {
          url: '/',
          controller: 'GuaranteeListReport',
          templateUrl: 'views/admin/guaranties/gt-list.html',
          authenticate: true
        })

        // Reingreso de garantías
        .state('admin.guarantee-refound', {
          url: '/entregadas',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-refound.list', {
          url: '/',
          controller: 'GuaranteeListRefound',
          templateUrl: 'views/admin/guaranties/gt-listRefound.html',
          authenticate: true
        })
      .state('admin.guarantee-refound.edit', {
          url: '/asignar/{guaranteeId}',
          controller: 'GuaranteeFormRefound',
          templateUrl: 'views/admin/guaranties/gt-trackingRefound.html',
          authenticate: true
        })
        /*
        .state('admin.guarantee-rePort', {
          url: '/rePorte-garantias',
          controller: 'GuaranteeBlank',
          templateUrl: 'views/admin/guaranties/gt-blank.html',
          authenticate: true
        })
        .state('admin.guarantee-rePort.list', {
          url: '/',
          controller: 'GuaranteeListReport2',
          templateUrl: 'views/admin/guaranties/gt-listReport.html',
          authenticate: true
        })
        .state('admin.guarantee-rePort.edit', {
          url: '/new/{guaranteeId}',
          controller: 'GuaranteeFormReport2',
          templateUrl: 'views/admin/guaranties/gt-tracking.html',
          authenticate: true
        })
        */
        /*
        .state('admin.guarantee.status-sheet', {
          url: '/acuse/{guaranteeId}',
          controller: 'GuaranteeSuccess',
          templateUrl: 'views/admin/guaranties/gt-success.html',
          authenticate: false
        })
        */


        // GuarantiesPointOfSale
        .state('admin.guaranteee', {
          url: '/garantias-punto-venta',
          controller: 'GuaranteePoinOfSaleBlank',
          templateUrl: 'views/admin/guarantiesPointOfSale/gtp-blank.html',
          authenticate: true
        })
        .state('admin.guaranteee-first-entry', {
          url: '/recepcion-entrada-garantias',
          controller: 'GuaranteePoinOfSaleBlank',
          templateUrl: 'views/admin/guarantiesPointOfSale/gtp-blank.html',
          authenticate: true
        })

        .state('admin.guaranteee-first-entry.list', {
          url: '/',
          controller: 'GuaranteePoinOfSaleList',
          templateUrl: 'views/admin/guarantiesPointOfSale/gtp-list.html',
          authenticate: true
        })
        .state('admin.guaranteee-first-entry.add', {
          url: '/registroPointOfSale',
          controller: 'GuaranteePointOfSaleForm',
          templateUrl: 'views/admin/guarantiesPointOfSale/gtp-form.html',
          authenticate: true
        })
        .state('admin.guaranteee-first-entry.edit', {
          url: '/editarPointOfSale/{guaranteeId}',
          controller: 'GuaranteePointOfSaleForm',
          templateUrl: 'views/admin/guarantiesPointOfSale/gt-trackingg.html',
          authenticate: true
        })
        // Reingreso de garantías
        .state('admin.guaranteee-two-entry', {
          url: '/re-ingreso-tienda',
          controller: 'GuaranteePoinOfSaleBlank',
          templateUrl: 'views/admin/guarantiesPointOfSale/gtp-blank.html',
          authenticate: true
        })
        .state('admin.guaranteee-two-entry.list', {
          url: '/',
          controller: 'GuaranteeLisstPointOfSale',
          templateUrl: 'views/admin/guarantiesPointOfSale/gtp-list.html',
          authenticate: true
        })
        .state('admin.guaranteee-two-entry.edit', {
          url: '/asignar-equipo/{guaranteeId}',
          controller: 'GuaranteePointOfSaleForm',
          templateUrl: 'views/admin/guarantiesPointOfSale/gt-trackingg.html',
          authenticate: true
        })
        //entrega de garantias
        .state('admin.guaranteee-four-refound', {
          url: '/entregadasPointOfSale',
          controller: 'GuaranteePoinOfSaleBlank',
          templateUrl: 'views/admin/guarantiesPointOfSale/gtp-blank.html',
          authenticate: true
        })
        .state('admin.guaranteee-four-refound.list', {
          url: '/',
          controller: 'GuaranteeListRefoundPointOfSale',
          templateUrl: 'views/admin/guarantiesPointOfSale/gtp-list.html',
          authenticate: true
        })
      .state('admin.guaranteee-four-refound.edit', {
          url: '/asignar/{guaranteeId}',
          controller: 'GuaranteePointOfSaleForm',
          templateUrl: 'views/admin/guarantiesPointOfSale/gt-trackingg.html',
          authenticate: true
        })

        // Generar cartas porte
        .state('admin.letterPorte', {
          url: '/carta-porte',
          controller: 'letterPorteBlankController',
          templateUrl: 'views/admin/letter-porte/lp-blank.html',
          authenticate: true
        })
        .state('admin.letterPorte.list', {
          url: '/',
          controller: 'letterPorteList',
          templateUrl: 'views/admin/letter-porte/lp-list.html',
          authenticate: true
        })
        .state('admin.letterPorte.complement', {
          url: '/complementos',
          controller: 'listComplementController',
          templateUrl: 'views/admin/letter-porte/lp-complement.html',
          authenticate: true
        })
        .state('admin.letterPorte.sheet', {
          url: '/complemento/{assignmentId}',
          controller: 'AssignmentSheet',
          templateUrl: 'views/admin/letter-porte/lp-sheet.html',
          authenticate: true
        })
        .state('admin.letterPorte.prices', {
          url: '/precios',
          controller: 'ProductList',
          templateUrl: 'views/admin/letter-porte/lp-prices.html',
          authenticate: true
        })
        .state('admin.letterPorte.form', {
          url: '/actualizar-precio/{productId}',
          controller: 'ProductForm',
          templateUrl: 'views/admin/letter-porte/lp-form-product.html',
          authenticate: true
        })
        // otros estados
        /*
        .state('admin.price', {
          url: '/precios',
          controller: 'ReportBlank',
          templateUrl: 'views/admin/prices/pr-blank.html',
          authenticate: true
        })
        .state('admin.price.list', {
          url: '/',
          controller: 'ReportList',
          templateUrl: 'views/admin/prices/pr-list.html',
          authenticate: true
        })
        */
        .state('admin.refund', {
          url: '/bonificaciones',
          controller: 'RefundBlank',
          templateUrl: 'views/admin/refunds/rf-blank.html',
          authenticate: true
        })
        .state('admin.refund.list', {
          url: '/',
          controller: 'RefundList',
          templateUrl: 'views/admin/refunds/rf-list.html',
          authenticate: true
        });
      $urlRouterProvider.otherwise('login');
    }
  ])
  /**
   *
   */
  .config([
    '$locationProvider',
    function($locationProvider) {
      $locationProvider.html5Mode(true);
    }
  ])
  /**
   * @description Filtro para agrupar números telefónicos.
   */
  .filter('mxPhone', function() {
    return function(number) {
      if (typeof number !== 'string') return;
      var newNumber = '';
      var group = 3;
      if (number.search(/55/) === 0) {
        group = 2;
      }
      newNumber = '(' + number.slice(0, group) + ') ' +
        number.slice(group, 6) + '-' +
        number.slice(6, 10);
      return newNumber;
    };
  })


  // <input type="text" ng-model="test" format="currency" />
  .directive('format', ['$filter', function($filter) {
    return {
      require: '?ngModel',
      link: function(scope, elem, attrs, ctrl) {
        if (!ctrl) return;
        ctrl.$formatters.unshift(function(a) {
          return $filter(attrs.format)(ctrl.$modelValue)
        });

        elem.bind('blur', function(event) {
          var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
          elem.val($filter(attrs.format)(plainNumber));
        });
      }
    };
  }])

  .directive('myTarget', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var href = element.href;
        if (true) { // replace with your condition
          element.attr("target", "_blank");
        }
      }
    };
  })
  .directive('loadingBtn', ['$timeout', function($timeout){
    return {
        link: function(scope, element, attrs){
            element.bind('click', function(){

              if(scope.loading == true || scope.done == 'done') {
                return;
              }

              scope.loading = true;
              element.addClass('loading');
              element.attr('disabled', true);
              $timeout(loadTheButtonAfterSomeTime, 2000);

              function loadTheButtonAfterSomeTime(){
                scope.loading = false;
                element.removeClass('loading');
                element.attr('disabled', null);
                scope.done = 'done';
              }
            });
        }
    };
}])

.directive('enter',function(){
		return function(scope,element,attrs){
			element.bind("keydown keypress",function(event){
				if(event.which===13){
					event.preventDefault();
					var fields=$(this).parents('form:eq(0),body').find('input, textarea, select');
					var index=fields.index(this);
					if(index> -1&&(index+1)<fields.length)
						fields.eq(index+1).focus();
				}
			});
		};
	})

  /**
   *
   */
  .run([
    '$rootScope',
    '$state',
    '$sce',
    '$filter',
    '$window',
    '$localStorage',
    'LoopBackAuth',
    'AuthService',
    'DTOptionsBuilder',
    'DTColumnBuilder',
    'DTColumnDefBuilder',
    function($rootScope, $state, $sce, $filter, $window, storage, LoopBackAuth, AuthService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
      // Objeto global del modal generico
      var _modal = $rootScope.genericModal = {
        query: '#genericModal',
        icon: 'warning', // fa fa-exclamation-triangle | fa fa-warning
        title: 'Modal',
        hideCancel: false,
        body: $sce.trustAsHtml('<strong>Body</strong>')
      };
      //
      $rootScope.header = '';
      /**
       *   $rootScope.header = {
       *     icon: '',
       *     title: ''};
       */
      $rootScope.busy = false;
      $rootScope.menu = undefined;
      $rootScope.$state = $state;
      $rootScope.$storage = storage;
      // Objeto return para controlar la navegación
      $rootScope.return = {
        from: 'admin',
        to: 'admin',
        paramsFrom: {},
        paramsTo: {},
        data: {}
      };
      // Objeto global para el manejo de la paginación
      $rootScope.pagination = {
        size: 20,
        current: 0,
        maxVisiblePages: 5
      };
      //
      $rootScope.$on('$locationChangeStart', function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
      //
      $rootScope.$on('$routeChangeSuccess', function(event, currentRoute, previousRoute) {
        window.scrollTo(0, 0);
      });
      // Configurar la variable $stateChangeStart para el cambio de $state
      $rootScope.$on('$stateChangeStart', function(event, next, params) {
        $rootScope.return.to = $rootScope.return.from;
        $rootScope.return.paramsTo = $rootScope.return.paramsFrom;
        $rootScope.return.from = next.name;
        $rootScope.return.paramsFrom = params;
        console.log('Estoy en (from) \'', $rootScope.return.from, $rootScope.return.paramsFrom, '\' si regreso voy a (to) \'', $rootScope.return.to, $rootScope.return.paramsTo, '\' y tengo estos datos :', $rootScope.return.data);
        // console.log(LoopBackAuth);
        // console.log(next);
        if (next.authenticate && !LoopBackAuth.accessTokenId) {
          event.preventDefault();
          $state.go('forbidden');
          return;
        }
        if (next.name === 'login' && LoopBackAuth.accessTokenId) {
          event.preventDefault();
          $state.go('admin');
          return;
        }
        /**
         * @deprecated
         * if (next.authenticate && next.name !== 'admin.profile.reset' && $rootScope.currentUser.status !== 'active') {
         *   event.preventDefault();
         *   $state.go('admin.profile.reset');
         *   return;
         * }
         */
      });
      /**
       * @description Convierte un date a un string con formato
       * @param {date} date Fecha en formato javascript.
       * @param {string} format Mascara con el formato requerido, por ejemplo 'DD/MM/AA'.
       * @returns {string} Devuelve una fecha en formato texto de acuerdo al formato indicado.
       */
      $rootScope.getDateFormat = function(date, format) {
        if (!date) return '-';
        return moment(date).tz('America/Mexico_City').locale('es-mx').format(format);
      };
      /**
       * @name getDaysFrom
       * @description Devuelve la cantidad de tiempo transcurrido entre dos fechas.
       * @param {date} date Fecha en formato javascript.
       */
      $rootScope.getDaysFrom = function(date) {
        if (!date) return '-';
        return moment(date).tz('America/Mexico_City').locale('es-mx').fromNow(true);
      }; // End getDaysFrom
      /**
       * @name getToday
       * @description Devuelve la fecha actual del sistema.
       */
      $rootScope.getToday = function() {
        return moment().tz('America/Mexico_City').locale('es-mx');
      }; // End getToday
      /**
       * @name getTime
       * @description Devuelve la hora.
       */
      $rootScope.getTime = function(date) {
        //return moment(date).tz('America/Mexico_City').locale('es-mx').format('LTS');
        return moment(date).format('LTS');
      }; // End getToday


      /**
      * Manejo de dataTables en angularjs
      */
      $rootScope.languageDataTables = {
        "sProcessing":     "Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sZeroRecords":    "No se encontraron resultados",
        "sEmptyTable":     "Ningún dato disponible en esta tabla",
        "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":    "",
        "sSearch":         "Buscar:",
        "sUrl":            "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Primero",
            "sLast":     "Último",
            "sNext":     "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        },
        "select": {
            "rows": {
                "_": "Seleccionado %d filas",
                "0": "Haga clic en una fila para seleccionarla.",
                "1": "Seleccionado una fila"
            }
        },
        "buttons": {
          "copySuccess": {
            "1": "Copiado una fila al portapapeles.",
            "_": "Copiado %d filas al portapapeles."
          },
            "copyTitle": 'Copiando datos',
            "copyKeys": 'Use your keyboard or menu to select the copy command'
        }
      }

      $rootScope.vm = {};
      $rootScope.vm.dtInstance = {};
      $rootScope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(5).notSortable()];
      $rootScope.vm.dtOptions = DTOptionsBuilder.newOptions()
       .withDisplayLength(10)
       .withOption('paging', true)
       /*.withOption('scrollY', '50vh')*/
       .withOption('scrollX', true)
       /*.withOption('fixedHeader', true)*/
       /*.withOption("autoWidth", true)*/
       /*.withOption('scrollCollapse', true)*/
       /*.withOption("bDestroy", true)*/
       .withOption('visible', true)
       .withOption('fixedHeader', true)
       .withOption("processing", true)
       .withOption('searching', true)
       .withOption('info', true)
       .withOption('dom', 'Bfrtip')
       .withOption('select', true)
       .withOption('responsive', false)
       .withLanguage($rootScope.languageDataTables)
       /*.withOption('fnDrawCallback', function (oSettings) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
            api.column(2, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="14">'+group+'</td></tr>'
                    );
                    last = group;
                }
            } );
          })*/
       .withButtons([
         {
           extend:    'copy',
           text:      '<i class="fa fa-files-o"></i> Copiar',
           titleAttr: 'Copiar',
           footer: true
         },
         {
           extend:    'print',
           text:      '<i class="fa fa-print" aria-hidden="true"></i> Imprimir',
           titleAttr: 'Imprimir',
           footer: true
         },
         {
           extend:    'excel',
           text:      '<i class="fas fa-file-alt"></i> Excel',
           titleAttr: 'Excel',
           footer: true
         },
         {
           extend:    'pdf',
           text:      '<i class="fas fa-file-pdf"></i> PDF',
           titleAttr: 'Pdf',
           footer: true
         }
       ]);


      /**
       * @name typeSale
       * @description Procesa el tipo de venta.
       * @param {string} type Tipo de venta.
       */
      $rootScope.typeSale = function(type) {
        switch (type) {
          case "sale":
            return "Venta";
          case "payment":
            return "Abono";
        }
      }
      /**
       * @name typePayment
       * @description Procesa el tipo de pago.
       * @param {string} typePayment Tipo de pago.
       */
      $rootScope.typePayment = function(type) {
        switch (type) {
          case "credit":
            return "Crédito";
          case "cash":
            return "Efectivo";
          case "check":
            return "Cheque";
          case "deposit":
            return "Deposito";
        }
      }
      /**
       * @name statusPayment
       * @description Procesa el estatus del pago.
       * @param {string} type Estatus del pago.
       */
      $rootScope.statusPayment = function(type) {
        switch (type) {
          case "paid":
            return "Pagado";
          case "pending":
            return "Pendiente";
        }
      }
      /**
       * @description Calcula y da formato a la cuenta de cajas del lote.
       * @param {number} count Cantidad de código de barras capturados.
       * @param {number} size Cantidad de productos por caja.
       * @return {html} Calculo de cajas en html.
       */
      $rootScope.setBoxCount = function(count, size) {
        var boxes = Math.floor(count / size);
        var free = count % size;
        var html = 'cajas: <b>' + boxes + '</b> | piezas sueltas: <b>' + free +
          '</b>';
        return $sce.trustAsHtml(html);
      }; // End setBoxCount
      /**
       * @name setProductName
       * @description Da formato HTML a una cadena de texto con la marca, modelo, color y variante de un producto.
       * @param {string} name Nombre del producto, debe llevar una coma para realizar la separación.
       */
      $rootScope.setProductName = function(name) {
        if (!name) return $sce.trustAsHtml('-');
        var html = name.replace(',', '<br><small>') + '</small>';
        return $sce.trustAsHtml(html);
      }; // End setProductName
      /**
       * @name makeAddress
       * @description Da formato HTML a una objeto que contiene datos de una dirección.
       * @param {object} billing Objeto con los datos de una dirección.
       */
      $rootScope.makeAddress = function(billing) {
        if (!billing || typeof billing !== 'object') return;
        var html = '<address>\n';
        html += billing.street ? billing.street : '';
        html += billing.extNumber ? ', <span>ext.</span> ' + billing.extNumber : '';
        html += billing.intNumber ? ', <span>int.</span> ' + billing.intNumber + '<br>\n' : '';
        html += billing.colony ? '<span>Col.</span> ' + billing.colony : '';
        html += billing.zipcode ? ', <span>C.P.</span> ' + billing.zipcode + '<br>\n' : '';
        html += billing.municipality ? '<span>Municipio</span> ' + billing.municipality + '<br>\n' : '';
        html += billing.state ? billing.state + ', ' : '';
        html += billing.country ? billing.country + '<br>\n' : '';
        html += billing.reference ? '<span>Referencia</span> ' + billing.reference : '';
        html += '\n</address>';
        return $sce.trustAsHtml(html);
      }; // End makeAddress
      /**
       * @name makeAmount
       * @description Devuelve un valor en formato de contabilidad.
       * @param {string} currency Tipo de moneda de la cantidad.
       * @param {number} amount Cantidad para dar formato.
       */
      $rootScope.makeAmount = function(currency, amount) {
        if (isNaN(amount)) return;
        if (amount === null) amount = 0;
        var label = 'MXN';
        if (currency === 'dolares') {
          label = 'USD';
        }
        var html = '<span class="currency">' + label + ' $ </span>' +
          '<span class="value">' + $filter('number')(amount, 2) + '</span>';
        return $sce.trustAsHtml(html);
      }; // End makeAmount
      /**
       * @name makeSerial
       * @description Da formato a un número de serie para resaltar los últimos 5 dígitos.
       * @param {string} imei Cadena de texto de un número de serie.
       */
      $rootScope.makeSerial = function(imei) {
        if (typeof imei !== 'string' || !imei.length) return '';
        var size = imei.length;
        var html = imei.substr(0, (size - 5)) +
          '<strong>' + imei.substr((size - 5), size) + '</strong>';
        return $sce.trustAsHtml(html);
      }; // End makeSerial
      /**
       * @name genericModalAccept
       * @description Función generica para el botón Aceptar de las ventanas modal
       */
      $rootScope.genericModalAccept = function() {
        $(_modal.query).modal('hide');
        if (typeof(_modal.callback) === 'function') {
          _modal.callback();
        }
      }; // End genericModalAccept
      /**
       * @name gotoPage
       * @description Cambia la paginación de la vista actual
       * @param {String} pageTag Etiqueta del salto de página
       */
      $rootScope.gotoPage = function(pageTag) {
        switch (pageTag) {
          case 'first':
            {
              if ($rootScope.pagination.current !== 0) {
                $rootScope.pagination.current = 0;
              } else {
                return;
              }
            }
            break;
          case 'previous':
            {
              if ($rootScope.pagination.current > 0) {
                $rootScope.pagination.current--;
              } else {
                return;
              }
            }
            break;
          case 'next':
            {
              if ($rootScope.pagination.current < $rootScope.pagination.total - 1) {
                $rootScope.pagination.current++;
              } else {
                return;
              }
            }
            break;
          case 'last':
            {
              if ($rootScope.pagination.current !== $rootScope.pagination.total - 1) {
                $rootScope.pagination.current = $rootScope.pagination.total - 1;
              } else {
                return;
              }
            }
            break;
          default:
            $rootScope.pagination.current = pageTag - 1;
            break;
        }
        $rootScope.updatePagination();
        $rootScope.reloadData();
      }; // End gotoPage
      /**
       * @name setPaginationCount
       * @description Calcula el número de paginas para la paginación a partir del total de elementos listados
       * @param {number} count Número total de elementos de la lista
       */
      $rootScope.setPaginationCount = function(count) {
        $rootScope.pagination.count = count;
        $rootScope.pagination.total = Math.ceil($rootScope.pagination.count / $rootScope.pagination.size);
        // Llama a updatePagination
        $rootScope.updatePagination();
      }; // End setPaginationCount
      /**
       * @name showModal
       * @description Función para llamar a una ventana de tipo modal para presentar avisos a los usuarios.
       * @param {string} icon Nombre del icono para incluirse en el titulo del modal.
       * @param {string} title Título del modal.
       * @param {string} body Contenido en HTML del modal.
       * @param {object} options Objeto con opciones adicionales para el modal.
       * @param {function} callback Función de callback.
       */
      $rootScope.showModal = function(icon, title, body, options, callback) {
        if (!options) {
          options = {
            fucus: false,
            keyboard: true
          };
        }
        //
        if (icon) {
          options.icon =
            icon.replace(/fa-/g, 'fa fa-').replace(/g-/g, 'glyphicon glyphicon-');
        }
        _modal.title = title;
        _modal.body = $sce.trustAsHtml(body);
        _.extend(_modal, options);
        _modal.callback = callback;
        console.log(_modal);
        $(_modal.query).modal('show');
      }; // End showModal
      /**
       * @name updatePagination
       * @description Actualiza la paginación de la vista actual
       */
      $rootScope.updatePagination = function() {
        $rootScope.pagination.filter = {
          skip: $rootScope.pagination.size * $rootScope.pagination.current,
          limit: $rootScope.pagination.size
        };
        //
        var startPage = 0;
        var lastPage = $rootScope.pagination.total;
        $rootScope.pagination.missingBackward = false;
        $rootScope.pagination.missingForward = false;
        //
        if ($rootScope.pagination.total > $rootScope.pagination.maxVisiblePages) {
          startPage = $rootScope.pagination.current - Math.floor($rootScope.pagination.maxVisiblePages / 2);
          if (startPage < 0) {
            startPage = 0;
          }
          lastPage = startPage + $rootScope.pagination.maxVisiblePages;
          //
          if (lastPage > $rootScope.pagination.total) {
            startPage -= lastPage - $rootScope.pagination.total;
            lastPage = $rootScope.pagination.total;
          }
          //
          $rootScope.pagination.missingBackward = startPage > 0;
          $rootScope.pagination.missingForward = lastPage < $rootScope.pagination.total;
        }

        //
        $rootScope.pagination.visiblePages = [];
        for (var i = startPage; i < lastPage; i++) {
          $rootScope.pagination.visiblePages.push({
            number: i + 1,
            active: i === $rootScope.pagination.current
          });
        }
      }; // End updatePagination
      /**
       * @name notify
       * @description Implementa la clase notify para presentar mensajes al usuario.
       * @param {string} message Cuerpo del mensaje al usuario.
       * @param {string} type Nombre de la clase, puede ser 'error', 'success', 'warn' o 'info'.
       */
      $rootScope.notify = function(message, type) {
        if (!type || typeof type !== 'string') {
          type = 'error'
        }
        $.notify(message, {
          className: type,
          hideDuration: 1000,
          showDuration: 200,
          position: 'right bottom'
        });
      }; // End notify
      /**
       * @name checkMenu
       * @description Devuelve el valor active cuando se valida la opción seleccionada del menú.
       * @param {string} option Nombre de la sección donde se encuentra el usuario.
       */
      $rootScope.checkMenu = function(option) {
        var className = '';
        if (typeof option === 'string' && option === $rootScope.menu) {
          className = 'active';
        }
        return className;
      }; // End checkMenu
      /**
       * @name checkAccess
       * @description Valida la sesión para mostrar/ocultar secciones del sistema.
       * @param {string} stringAccess Texto para comparar el acceso del usuario.
       */
      $rootScope.checkAccess = function(stringAccess) {
        var key = '';
        if ($rootScope.currentUser) {
          switch ($rootScope.currentUser.type) {
            case 'admin':
              key = 'ad';
              break;
            case 'ceo':
              key = 'ce';
              break;
            case 'warehouse-boss':
              key = 'wa';
              break;
            case 'storer':
              key = 'st';
              break;
            case 'support':
              key = 'su';
              break;
            case 'manager':
              key = 'ma';
              break;
            case 'seller':
              key = 'se';
              break;
            case 'accountant':
              key = 'ac';
              break;
            default:
              key = 'xx';
          }
          if (stringAccess.indexOf(key) != -1) {
            return true;
          }
        }
        return false;
      }; // End checkAccess
      /**
       * @name checkMail
       * @description Valida la sesión del usuario a través de su email.
       * @param {string} email Email para comparar el acceso del usuario.
       */
      $rootScope.checkMail = function(email) {
        if ($rootScope.currentUser && $rootScope.currentUser.email === email) {
          return true;
        }
        return false;
      }; // End checkMail
      /**
       * @name changeWarehouse
       * @description Función global para asignar el almacén actual.
       * @param {Object} warehouse Objeto con los datos del almacén
       */
      $rootScope.changeWarehouse = function(warehouse) {
        $rootScope.$storage.idWarehouse = warehouse.id;
        $rootScope.$storage.name = warehouse.name;
        $rootScope.$storage.isMain = warehouse.isMain;
        $rootScope.menu = '';
        $window.location.href = './admin';
      }; // End changeWarehouse
      /**
       * @name stringDate
       * @description Devuelve una fecha con formato según el carcter separador.
       * @param {object} objDate Objeto de fecha tipo moment().
       * @param {string} char Caracter de separación de la fecha.
       */
      $rootScope.stringDate = function(objDate, char) {
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
      }; // End stringDate

      // Código principal
      if (LoopBackAuth.accessTokenId && !$rootScope.currentUser) {
        AuthService.refresh(LoopBackAuth.accessTokenId);
      }
    }
  ]);
