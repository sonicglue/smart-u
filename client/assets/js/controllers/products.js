angular.module('systemax')
  .controller('ProductBlank', [
    '$rootScope',
    '$scope',
    '$state',
    function($rootScope, $scope, $state) {
      // Código principal
      $rootScope.menu = 'product';
      // Validar almacén central
    /*  if (!$scope.currentUser.isMain) {
        $state.go('admin');
      }*/
    }
  ])
  /**
   * @description Controlador para la lista de productos.
   */
  .controller('ProductListC', [
    '$rootScope',
    '$scope',
    'Product',
    '$state',
    function($rootScope, $scope, Product, $state) {
      // Variables generales
      var productFilter = {
        include: ['brand', 'model', 'color', 'option', 'stocks', 'batches','accessories'],
        where: {},
        order: ['name']};
      // Funciones generales
      /**
       * @name deleteProduct
       * @description Elimina un producto por su Id.
       * @param {string} productId Identificador del producto.
       */
      function deleteProduct(productId) {
        Product.deleteById({id: productId})
          .$promise
          .then(
            function(response) {
              $scope.notify('Registro eliminado satisfactoriamente.',
                'success');
              recalculateCountAndReload();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End deleteProduct
      /**
       * @name getProducts
       * @description Recupera los datos de los productos registrados.
       */
      function getProducts() {
        Product.find({filter: productFilter})
          .$promise
          .then(
            function(products) {
              $scope.products = products;
              console.log('mis productos', $scope.products);


                  },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getProducts
      /**
       * @name recalculateCountAndReload
       * @description Actualizar paginación con base a la cantidad de productos.
       */
      function recalculateCountAndReload() {
        $scope.pagination.current = 0;
        // Recuperar el ultimo filtro utilizado
        var lastWhere = productFilter.where;
        Product.count({where: productFilter.where || {}})
          .$promise
          .then(function (count) {
            if (productFilter.where === lastWhere) {
              $scope.setPaginationCount(count.count);
              $scope.reloadData();
            }
          });
      }// End recalculateCountAndReload
      // Variables del $scope
      // Objeto de productos
      $scope.products = {};
      // Bandera para el formulario del modelo
      $scope.return.productFlag = $scope.return.from;
      $scope.return.paramsProductFlag = $scope.return.paramsFrom;
      // Funciones del $scope
      /**
       * @name reloadData
       * @description Reconfigura la paginación de acuerdo al filtro.
       */
      $rootScope.reloadData = function() {
        productFilter = _.extend(productFilter, $scope.pagination.filter);
        getProducts();
      };// End reloadData

      /**
       * @name edit
       * @description Cambia la vista por el formulario para editar el registro.
       * @param {object} product Objeto de proveedor/empresa/cliente.
       */
      $scope.edit = function(product) {
        console.log('mi producto', product);
        var state = 'admin.' + $rootScope.menu + '.edit';
        $state.go(state, {productId: product.id});
      };// End edit
      /**
       * @name delete
       * @description Presenta un aviso de eliminación de un producto.
       * @param {object} product Objeto de orden de compra.
       */
      $scope.delete = function(product) {
        $scope.showModal('fa-warning',
          'Eliminar producto del sistema',
          '<p>¿Desea eliminar el producto <b>' + product.name + '</b>?</p>' +
          '<p>Esta acción no puede deshacerse.</p>',
          {},
          function() {
            deleteProduct(product.id);
          });
      }; //End delete
      // Watchers
      // Código principal
      recalculateCountAndReload();
      if ($scope.return.data) {
        $scope.return.data = {};
      }
    }
  ])
  /**
   * @description Controlador para registro/actualización de los productos.
   */
  .controller('ProductFormC', [
    '$scope',
    '$state',
    'Brand',
    'Color',
    'Product',
    'ProductType',
    function($scope, $state, Brand, Color, Product, ProductType) {
      // Funciones generales
      /**
       * @name createProduct
       * @description Crea un nuevo registro de Batch.
       */
      function createProduct() {
        $scope.busy = true;
        Product.create($scope.product)
          .$promise
          .then(
            function(response) {
              $scope.busy = false;
              $scope.notify('Registro creado satisfactoriamente.',
                'success');
              $scope.return.data.idBrand = response.idBrand;
              $scope.return.data.idProductModel = response.idProductModel;
              $scope.return.data.idColor = response.idColor;
              $scope.return.data.idProductType = response.idProductType;
              $scope.return.data.idProductVariant = response.idProductVariant;
              $scope.return.data.idVariantOption = response.idVariantOption;
              $state.go($scope.return.productFlag,
                $scope.return.paramsProductFlag);
            },
            function(err) {
              $scope.busy = false;
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End createProduct
      /**
       * @name getBrands
       * @description Recupera las marcas con sus respectivos modelos.
       */
      function getBrands() {
        var bFilter = {
          include: {
            relation: 'models', scope: {
              order: ['name']}
          },
          order: ['name']
        };
        Brand.find({filter: bFilter})
          .$promise
          .then(
            function(brands) {
              $scope.brands = brands;
              console.log($scope.brands);
              if ($scope.return.data.idBrand) {
                $scope.product.idBrand = $scope.return.data.idBrand;
              }
              if ($scope.return.data.idProductModel) {
                $scope.product.idProductModel =
                  $scope.return.data.idProductModel;
              }
              getColors();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getBrands
      /**
       * @name getColors
       * @description Recupera la lista de colores.
       */
      function getColors() {
        Color.find({filter: {order: ['index']}})
          .$promise
          .then(
            function(colors) {
              $scope.colors = colors;
              if ($scope.return.data.idColor) {
                $scope.product.idColor = $scope.return.data.idColor;
              }
              getProductTypes();
            },
            function(err) {
              console.log(err);
              $scope.notify(err.data.error.message);
            });
      }// End getColors
      /**
       * @name getProductTypes
       * @description Recupera los tipos de productos con sus respectivas variantes.
       */
      function getProductTypes() {
        var ptFilter = {
          include: {
            relation: 'variant', scope: {
              include: {
                relation: 'options', scope: {
                  order:['index']}}}}};
        ProductType.find({filter: ptFilter})
          .$promise
          .then(
            function(productTypes) {
              $scope.productTypes = productTypes;
              if ($scope.return.data.idProductType) {
                $scope.product.idProductType = $scope.return.data.idProductType;
              }
              if ($scope.return.data.idVariantOption) {
                $scope.product.idVariantOption =
                  $scope.return.data.idVariantOption;
              }
            },
            function(err) {
            console.log(err);
            $scope.notify(err.data.error.message);
          });
      }// End getProductTypes
      /**
       * @name makeName
       * @description Construye el nombre del producto a partir de los valores registrados.
       */
      function makeName() {
        $scope.product.name = $scope.productName.brand + ' ' +
          $scope.productName.model + ', ' + $scope.productName.color +
          ' ' + $scope.productName.variant;
      }// End makeName
      // Variables del $scope
      // Objeto de las variantes.
      $scope.variant = {
        name: 'Variante',
        id: undefined,
        options: []};
      // Objeto de los modelos.
      $scope.models = [];
      // Objeto para los campos del formulario.
      $scope.product = {
        name: '',
        serieLength: 15};
      // Nombre del producto
      $scope.productName = {
        brand: '',
        model: '',
        color: '',
        variant: '',
      };
      // Bandera para el formulario del modelo
      $scope.return.modelFlag = $scope.return.from;
      $scope.return.paramsModelFlag = $scope.return.paramsFrom;
      // Funciones del $scope
      /**
       * @name save
       * @description Valida y envía le formulario para su procesamiento.
       */
      $scope.save = function() {
        $('form.needs-validation').addClass('was-validated');
        var errorCount = 0;
        // Validación del formulario
        if (!$scope.product.idProductType) {
          errorCount++;
        }
        if (!$scope.product.idBrand) {
          errorCount++;
        }
        if (!$scope.product.idProductModel) {
          errorCount++;
        }
        if (!$scope.product.idColor) {
          errorCount++;
        }
        if (!$scope.product.idVariantOption) {
          errorCount++;
        }
        if (!$scope.product.serieLength) {
          errorCount++;
        }
        // Formulario con error
        if (errorCount) {
          $scope.notify(
            'El formulario contiene uno o más errores, para continuar debe ' +
            'corregirlos.');
          return;
        }
        createProduct();
      };// End save
      // Watchers
      // Watch brand select
      $scope.$watch('product.idBrand', function(brand) {
        if (!brand) {
          return $scope.models = [];
        }
        _.each($scope.brands, function(b) {
          if (b.id === brand) {
            $scope.productName.brand = b.name;
            $scope.models = b.models;
          }
        });
        $scope.return.data.idBrand = brand;
        makeName();
      });// End $watch brand select
      // Watch model select
      $scope.$watch('product.idColor', function(color) {
        if (!color) return;
        _.each($scope.colors, function(c) {
          if (c.id === color) {
            $scope.productName.color = c.name;
          }
        });
        $scope.return.data.idColor = color;
        makeName();
      });// End $watch model select
      // Watch model select
      $scope.$watch('product.idProductModel', function(model) {
        if (!model) return;
        _.each($scope.models, function(m) {
          if (m.id === model) {
            $scope.productName.model = m.name;
          }
        });
        $scope.return.data.idProductModel = model;
        makeName();
      });// End $watch model select
      // Watch productType select
      $scope.$watch('product.idProductType', function(productType) {
        if (!productType) {
          $scope.variant.name = 'Variante';
          $scope.variant.id = undefined;
          $scope.variant.options = [];
          delete $scope.product.idProductVariant;
          return;
        }
        _.each($scope.productTypes, function(pt) {
          if (pt.id === productType) {
            $scope.variant.name = pt.variant.name;
            $scope.variant.id = pt.variant.id;
            $scope.variant.options = pt.variant.options;
            $scope.product.idProductVariant = pt.variant.id;
          }
        });
        $scope.return.data.idProductType = productType;
      });// End $watch productType select
      // Watch variantOption select
      $scope.$watch('product.idVariantOption', function(option) {
        if (!option) return;
        _.each($scope.variant.options, function(o) {
          if (o.id === option) {
            $scope.productName.variant = o.value;
          }
        });
        $scope.return.data.idVariantOption = option;
        makeName();
      });// End $watch variantOption select
      // Código principal
      getBrands();
    },

  ])

  /**
  * @type controller
  * @name AddAccessory
  * @enum   {(type | Array)} Lista de dependencias y servicios
  * @description Este controlador sirve para agregar accesorios a los productos de garantias
  */
    .controller('AddAccessory', [
      '$rootScope',
      '$scope',
      '$state',
      'Product',
      'ProductType',



      function($rootScope, $scope, $state, Product, ProductType) {

        if($state.params.productId){
          getProducts($state.params.productId);
        }

        /**
         * @name getProducts
         * @description Recupera los datos de los productos registrados.
         */
        function getProducts(productId) {
          console.log('mi id de producto es', productId);
          var productFilter = {
            include: ['accessories', 'color',{relation: 'type', scope: {
                  include: 'accessories'
                }}, {relation: 'brand', scope: {
                      include: 'models'
                      }}] ,
            where: {id:productId},
            order: ['name']};
          Product.find({filter: productFilter})
            .$promise
            .then(
              function(products) {
                $scope.allAccessories = products;
                console.log('mi busqueda es', $scope.allAccessories);
                proccessAccessories($scope.allAccessories);
              },
              function(err) {
                console.log(err);
                $scope.notify(err.data.error.message);
              });
        }// End getProducts


        $scope.add={
          accesories:[]
        };
        $scope.allAccessories=[];
        $scope.allAccessory=[];
        $scope.accessori=[];
        $scope.IsAllChecked=false;
        $scope.selectAccessories=[];
        $scope.res =[];

        $scope.$watchCollection('[add.idProduct, add.idAccessory]', function(s){
          if(!s){
            return;
          }
        })

  function proccessAccessories(accesories) {
      var selectAccesory;
      //var modelProduct;

  _.each(accesories, function(item){
    console.log("Lista de accesorios seleccionados", item);
    selectAccesory = item.accessories;
    //console.log('proccessAccessories', modelProduct );

    var dataProduct={
      idProduct:item.id,
      name:item.name,
      marca:item.brand.name,
      color:item.color.name
    }

      var mod = _.find(item.brand.models, function(b) {
      return b.id === item.idProductModel;
        });
        $scope.modelo= mod.name;
        console.log('modelo encontrado', $scope.res);


    _.each(item.type.accessories, function(type){
      var find = _.find(selectAccesory, function(b) {
        return b.id === type.id;
        });

        if (!find) {
          let newAccesory = {
            id: type.id,
            name: type.name,
            select: false,
            idProduct:dataProduct.idProduct,
            nameProduct:dataProduct.name,
            marca:dataProduct.marca,
            color: dataProduct.color
          }
          $scope.nameP= newAccesory.nameProduct;
          $scope.brand=newAccesory.marca;
          $scope.color=newAccesory.color;

          selectAccesory.push(newAccesory);
        }else {
          find.select = true
        }
    });
      $scope.allAccessories = _.sortBy(selectAccesory, 'name') ;

  });
  console.log("Ac", $scope.allAccessories);
}
/**
      * @name selectAccessories
      */
/*  function selectAccessories(idProductt, idAccesirie) {
      console.log('current', idProductt, idAccesirie)
       ProductHasAccessory.prototype$patchAttributes({idProduct: idProductt},{idAccessory:idAccesirie})
         .$promise
         .then(function (asig) {
             getmySellers();
              console.log('tengo esto',asig)
         },
         function(err){
           console.log(err);
           $scope.notify(err.data.error.message);
         });

     };// End asign*/

        /**
         * @name selectEntity
         * @description Función para seleccionar un vendedor
         * @param {object} entity Objeto del ejecutivo
         */
         $scope.selectEntity = function (entity) {
           console.log("Item seleccionado", entity);

           if(entity){
               selectAccessories($state.params.productId, entity.id)



           } else{
               selectAccessories(null,null)
             }
           };


         }

    ]);
