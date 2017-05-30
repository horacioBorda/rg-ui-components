
(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config

  angular.module('uiComponents.config', [])
      .value('uiComponents.config', {
          debug: true
      })
      .config(generalConfig);

  function generalConfig($provide){
     // PARA AGREGAR EL LENGUAGE DE TODOS LOS UI-GRID EN ESPAÑOL
    $provide.decorator('GridOptions',['$delegate', 'i18nService', function($delegate, i18nService){
        var gridOptions;
        gridOptions = angular.copy($delegate);
        gridOptions.initialize = function(options) {
            var initOptions;
            initOptions = $delegate.initialize(options);
            return initOptions;
        };
        //es is the language prefix you want
        i18nService.setCurrentLang('es');
        return gridOptions;
    }]);
  }    
  angular.module('uiComponents.filters',[]);
  angular.module('uiComponents.components',[
    'ui.grid',
    'ui.grid.exporter',
    'ui.grid.selection',
    'ui.grid.pagination',
    'ui.grid.pinning',
    'ui.grid.moveColumns',
    'ui.grid.edit', 
    'ui.grid.rowEdit'
    ]);
  angular.module('uiComponents',
      [
          'uiComponents.config',
          'uiComponents.components',
          'uiComponents.filters'
      ]);

})(angular);


(function (angular) {
  'use strict';
  angular.module('uiComponents.filters')
  .filter('propsFilter',propsFilter);


function propsFilter(){
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);
        
      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
}
})(angular); 
(function (angular) {
	'use strict';
	angular.module('uiComponents.filters',[]);
})(angular); 
 (function (angular) {
     'use strict';

      var listadoEntidad = {
            restrict:'E',
            template: '<div class="myGrid" id="grid1" ui-grid="lrc.optionsEntidades" '+
            ' ui-grid-exporter  ui-grid-selection  ui-grid-expandable ui-grid-pagination ui-grid-edit  '+
            'ui-grid-row-edit ui-grid-move-columns ui-grid-pinning ui-grid-resize-columns  bs-loading-overlay></div>',
            controller: 'ListadoEntidadController as lrc',
            bindings:{
                selectAll:'=?',
                deselectedAll:'=?',
                entidades:'=?',
                entidadesSeleccionadas:'=?',
                servicio: '=?', // esto sirve para poder procesar los datos para pasarlo al componente, cada servicio debe implementar el metodo !!! obtenerDatos()  !!!!
                gridOptions: '<',
                config:'<?',
                path: '<?',
                clickItem: '&?',
                metodos: '=?' //aca van todos los metodos que quiero controlar dentro del componente, seria un objeto metodo con varias funciones
            }
    };
      angular
      .module('uiComponents.components')
      .component('listadoEntidad',listadoEntidad);

     
 })(angular); 
 
(function(angular) {
    'use strict';
    angular.module('uiComponents.components')
        .controller('ListadoEntidadController', ListadoEntidadController);

    /** @ngInject */
    function ListadoEntidadController($log, $scope, $timeout, uiGridConstants, TABLEMAPPING, GenericService, i18nService) {
        var conDatos = false;
        var vm = this;
        vm.$onInit = function() {
            vm.selected = {};
            vm.deselectedAll = false; // EXPONER
            i18nService.setCurrentLang('es');
            vm.gridApi = null;
            vm.optionsEntidades = angular.copy(vm.gridOptions);

            vm.metodosInternos = vm.metodos || {}; // por si no envian ningun metodo, inicio el objeto
            vm.metodosInternos.actualizarDatos = actualizarDatos;

            if (vm.entidades === undefined || vm.entidades.length === 0) {
                cargarDatos(vm.path, 100, undefined, vm.config.links);
            } else {
                conDatos = true;
                vm.optionsEntidades.data = vm.entidades;

            }
            setRowListeners();
        };



        function actualizarDatos() {
            cargarDatos(vm.path, 100, undefined, vm.config.links);
        }

        function cargarDatos(url, pageSize, numPage, links) {

            vm.servicio.obtenerDatos(url, links, pageSize, numPage).then(function(entidades) {

                vm.entidades = entidades;
                vm.optionsEntidades.data = entidades;
                vm.optionsEntidades.totalItems = vm.entidades.length;
                checkSelectAll();
                // SI HAY ALGUNA FILA SELECCIONADA VEO CUAL ES, ESTO PARA EL CASO DE QUE LA PAGINACION SEA EXTERNA, HAY
                // QUE RECORDAR CUALES FILAS FUERON SELECCIONADAS
                //if(numPage!==undefined)setSelected(numPage,pageSize);
            });


        }

        function checkSelectAll() {

            if (vm.selectAll) {
                vm.gridApi.grid.modifyRows(vm.optionsEntidades.data);
                vm.gridApi.selection.selectAllRows();
            }
        }

      function setRowListeners() {
        console.log(vm.optionsEntidades);
        vm.optionsEntidades.onRegisterApi = function(gridApi) {
          vm.gridApi = gridApi;

          gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {

            if (row.isExpanded) {

              row.entity.subGridOptions = angular.copy(vm.optionsEntidades.subGridColumnDefs);
              if(!vm.config.datosSubgrilla){
                vm.servicio.obtenerDatosSubgrilla(row.entity._links[vm.config.subGrilla].href).then(function(subEntity) {

                  row.entity.subGridOptions.data = subEntity;

                });
              } else {
                row.entity.subGridOptions.data = vm.servicio.agregarFuncionesSubgrilla(row.entity[vm.config.campoDatosSubgrilla])||[];
              }


            }
          });
          gridApi.pagination.on.paginationChanged($scope, function(numPage, pageSize) {
            //ESTA PARTE CONSULTA POR PAGINA Y POR EL TAMAÑO DE PAGINA, PARA DESPUES DEJO
            // vm.optionsEntidades.pageNumber = numPage;
            // console.log(vm.entidadesSeleccionadas);
            //  vm.optionsEntidades.pageSize = pageSize;
            //  cargarDatos(vm.path,pageSize,numPage-1);

            // getPage();
          });
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            vm.entidadesSeleccionadas = gridApi.selection.getSelectedRows();
            if (typeof vm.clickItem !== 'undefined') vm.clickItem({
              $entidad: vm.entidadesSeleccionadas,
              $entidadesSeleccionadas: vm.entidadesSeleccionadas
            });
          });
          gridApi.selection.on.rowSelectionChangedBatch($scope, function(row) {
            vm.entidadesSeleccionadas = gridApi.selection.getSelectedRows();
            if (typeof vm.clickItem !== 'undefined') vm.clickItem({
              $entidad: vm.entidadesSeleccionadas,
              $entidadesSeleccionadas: vm.entidadesSeleccionadas
            });
          });

          // en honor a Pablo Guidici
          if (conDatos) {
            $timeout(function() {
              checkSelectAll();
            }, 150);
          }

        };
      }

        function setSelected(numPage, pageSize) {
            var elementSelected = [];
            var size = (vm.optionsEntidades.data.length <= pageSize * (numPage + 1)) ? vm.optionsEntidades.data.length : pageSize * (numPage + 1);
            for (var index in vm.entidadesSeleccionadas) {
                for (var i = 0; i < size; i++) {
                    if (vm.optionsEntidades.data[i].codigoComprobante == vm.entidadesSeleccionadas[index].codigoComprobante) {
                        elementSelected.push(vm.optionsEntidades.data[i]);
                        vm.gridApi.grid.modifyRows(vm.optionsEntidades.data[i])
                        vm.gridApi.selection.unSelectRow(vm.optionsEntidades.data[i]);

                        // vm.gridApi.grid.modifyRows(vm.optionsEntidades.data);
                        // vm.gridApi.selection.selectRow(vm.optionsEntidades.data[i]);

                    }
                }
            }
        }

    }
})(angular);

(function(){
    'use strict';
    angular.module('uiComponents.components')
    .controller('BuscarEntidadController',BuscarEntidadController);

    /** @ngInject */
    function BuscarEntidadController ($uibModalInstance,configuracionTabla, entidades){
        var vm = this;
      vm.configuracionTabla=configuracionTabla;
      vm.entidades = entidades;

      vm.aceptar = aceptar;
      vm.cancelar = cancelar;
      vm.getTitle = getTitle;
      vm.clickEntidad = clickEntidad;
      function getTitle() {
        if(vm.configuracionTabla.title){
          return vm.configuracionTabla.title;

        }
        return "";

      }
      function clickEntidad(entitdad) {
        vm.entitdadSeleccionada = entitdad[0];
      }

      function aceptar() {
        $uibModalInstance.close(vm.entitdadSeleccionada);
      }

      function cancelar() {
        $uibModalInstance.dismiss();
      }
    }
})();

// COMPONENTE PENSADO PARA QUE FUNCIONE PARA TODOS LOS TIPO DE DATOS, NO SOLO AFIP, ES CUESTION DE
// ADAPTARLO POR AHORA LO DEJO CON AFIP. , la solucion es en controlador hacer un condicional y pasar el parametro
// por el DOM, por defecto si no se pasa nada toma como si fuese un dato de afip y usa ese servicio, si queremos
// que sea general hay que definir un servicio generico que consulte un url y la parsee a un json.
(function (angular) {
  'use strict';
  var selectData;
  selectData = {
    restrict: 'E',
    template:'<div class="input-group">   ' +
    '<ui-select class="bootstrap-select form-control" ng-model="sc.ultimaEntidad" on-select="sc.onSelect($item)">' +
    '<ui-select-match placeholder="{{sc.configuracion.placeholder}}">{{sc.cargarCampos($select)}}</ui-select-match>    ' +
    '<ui-select-choices style="margin-top: 34px" repeat="entidad in sc.entidades | propsFilter: sc.getSearch($select)">   ' +
    '     <span ng-bind-html="entidad[sc.configuracion.campos[0].field] | highlight: $select.search"></span> <small ng-repeat="subcampo in sc.configuracion.subcampos">' +
    '{{subcampo.title}}: <span ng-bind-html="\'\'+ sc.byString(entidad,subcampo.field) | highlight: $select.search"> </span></small>   ' +
    '  </ui-select-choices>        </ui-select> ' +
    '      <span class="input-group-btn" ng-if="sc.busquedaAvanzada">      ' +
    '<button type="button" ng-click="sc.showBuscar()" class="btn btn-default">      ' +
    '<span class="ion-ios-search-strong"></span>      </button>      </span></div>',
    // template: ' <ui-select theme="bootstrap" search-enabled="sc.searchEnabled" ng-model="sc.ultimaEntidad" ' +
    // 'on-select="sc.onSelect($item)" >' +
    // '<ui-select-match placeholder="{{sc.configuracion.placeholder}}" popover-popup-delay="750" uib-popover="{{sc.configuracion.toolTip}}" ' +
    // 'popover-trigger="mouseenter" popover-placement="bottom">{{sc.cargarCampos($select)}}' +
    // '</ui-select-match><ui-select-choices repeat="entidad in sc.entidades | propsFilter: sc.getSearch($select)">' +
    // '<div><span>{{sc.configuracion.campos[0].title}} </span> <span ng-bind-html="entidad[sc.configuracion.campos[0].field] | highlight: $select.search">' +
    // '</span></div><small ng-repeat="subcampo in sc.configuracion.subcampos">' +
    // '{{subcampo.title}}: <span ng-bind-html="\'\'+ sc.byString(entidad,subcampo.field) | highlight: $select.search">',


    controller: 'SelectController as sc',
    bindings: {
      url: '<?',//esta url no se utiliza por el momkento, pero esta pensado para que sea utilizado por el servicio
      // campos: '<?',
      // subcampos:'<?',
      // title: '@',
      // placeholder: '@', ESTOS CAMPOS VAN A SER REEMPLAZADOS POR CONFIGURACION
      configuracion: '<?',
      //el objeto configuracion debe tener la siguiente forma:
      //configuracion:{
//                  titulo: STRING "titulo de la entidad"
//                  campos: ARRAY STRING ,campos que se quiere mostrar,
//                  subcampos: ARRAY STRING "Subcampos que se quiere mostrar"
//                  toolTip: STRING para mostrar un tooltip
//                  placholder: STRING,
//                  fieldsToSearch: ARRAY, campos por los que se van a buscar, si no se pasa nada por defecto busca por todos los campos.
      //}
      searchEnabled: '<?',   //true|false, default: true
      servicio: '<?',  // este servicio debe implementar obtenerDatos() y debe devolver un promise con los datos ya resueltos
      parametros: '<?', // parametros del servicio obtenerDatos, si no se lo pasa va como undefined
      entidades: '<?',    // si se traen entidades, no se consulta a servicio
      ultimaEntidad: '=?', // entidad que se  va a mostrar como seleccionada, default: la primera de la lista
      busquedaAvanzada:'<?', // aca va la configuracion de la tabla para la busqueda avanzada
      clickItem: '&?', // evento que se dispara cuando se selecciona un item, $event es el item seleccionado
      onLoadData: '&?' // evento que se dispara cuando se termina de cargar los datos, $item es el item seleccionado
    }
  };
  angular
    .module('uiComponents.components')
    .component('selectData', selectData);


})(angular);

(function(angular) {
  'use strict';
  angular
    .module('uiComponents.components')
    .controller('SelectController', SelectController);


  /** @ngInject */
  function SelectController($uibModal) {
    var vm = this;

    vm.byString = byString;
    vm.cargarDatos = cargarDatos;
    vm.cargarCampos = cargarCampos;
    vm.onSelect = onSelect;
    vm.getSearchEnabled = getSearchEnabled;
    vm.getSearch = getSearch;
    vm.showBuscar = showBuscar;

    vm.$onInit = function() {
      checkDatos();
    };

    function getSearch($select) {
      var toSearch = {};
      if (vm.configuracion.fieldsToSearch === undefined) {
        vm.configuracion.campos.forEach(function(campo) {
          toSearch[campo.field] = $select.search;

        });
        vm.configuracion.subcampos.forEach(function(subcampo) {
          toSearch[subcampo.field] = $select.search;
        });
      } else {
        vm.configuracion.fieldsToSearch.forEach(function(campo) {
          toSearch[campo.field] = $select.search;
        });
      }

      return toSearch;
    }

    function getSearchEnabled() {
      return vm.searchEnabled || true;
    }

    function showBuscar() {
      var modalInstanceProg = $uibModal.open({
        animation: true,
        template: '<!-- HEADER -->                ' +
        '<div class="modal-header">                    <h3 class="modal-title" id="modal-title">{{bac.getTitle()}}</h3>                ' +
        '</div>                <!-- BODY -->                <div class="modal-body" id="modal-body"> ' +
        '<listado-entidad grid-options="bac.configuracionTabla" entidades-seleccionadas="bac.entidadesSeleccionadas" click-item="bac.clickEntidad($entidad)" entidades="bac.entidades" ></listado-entidad>               ' +
        '              </div><!-- FOOTER --><div class="modal-footer">           ' +
        '     <button class="btn btn-primary" type="button" ng-click="bac.aceptar()" ng-disabled="!bac.entitdadSeleccionada">Aceptar</button>      ' +
        '          <button class="btn btn-warning" type="button" ng-click="bac.cancelar()">Cancelar</button>                </div>',
        controller:"BusquedaAvanzadaCtrl",
        controllerAs: 'bac',
        size: "lg",
        resolve: {
          configuracionTabla: function () {
            return vm.busquedaAvanzada;
          },
          entidades: function () {
            return vm.entidades;
          }
        },
        appendTo: undefined

      });

      modalInstanceProg.result.then(function (entidadsSeleccionadas) {
        vm.ultimaEntidad = entidadsSeleccionadas;
        onSelect(entidadsSeleccionadas);
      }, function () {

      });
    }
    function checkDatos() {
      if (vm.entidades === undefined || vm.entidades.length === 0) {
        cargarDatos();
      } else {
        vm.ultimaEntidad = (vm.ultimaEntidad !== undefined) ? vm.ultimaEntidad : vm.entidades[0];
      }
    }

    function cargarCampos(select) {
      var text = '';

      if (select.selected !== undefined) {
        for (var index in vm.configuracion.campos) {
          text += byString(select.selected, vm.configuracion.campos[index].field);
          text += ' - ';
        }
        text = text.substr(0, text.length - 3);
      }
      return text;
    }

    function byString(o, s) {
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, ''); // strip a leading dot
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    }

    function onSelect(item) {
      if(!vm.clickItem)return;
      vm.clickItem({
        $event: item
      });
    }

    function cargarDatos(select) {
      if (vm.url !== undefined) {
        vm.servicio.obtenerDatos(vm.url).then(function (data) {
          vm.entidades = data;
          //vm.entidadSeleccionada = (vm.ultimaEntidad != undefined)? vm.ultimaEntidad:vm.entidades[0];
          vm.ultimaEntidad = (vm.ultimaEntidad !== undefined) ? vm.ultimaEntidad : vm.entidades[0];
          if(vm.onLoadData)vm.onLoadData({$item: vm.ultimaEntidad});
        });
      } else {
        vm.servicio.obtenerDatos(vm.parametros).then(function (data) {
          vm.entidades = data;
          //vm.entidadSeleccionada = (vm.ultimaEntidad != undefined)? vm.ultimaEntidad:vm.entidades[0];
          vm.ultimaEntidad = (vm.ultimaEntidad !== undefined) ? vm.ultimaEntidad : vm.entidades[0];
          if(vm.onLoadData)vm.onLoadData({$item: vm.ultimaEntidad});
        });
      }


    }
  }
})(angular);

