(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('uiComponents.config', [])
      .value('uiComponents.config', {
          debug: true
      });
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
            templateUrl: 'src/listadoEntidad/entidad-template.html',
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

        vm.selected = {};
        vm.deselectedAll = false; // EXPONER
        i18nService.setCurrentLang('es');
        vm.gridApi = null;
        vm.optionsEntidades = angular.copy(vm.gridOptions);

        vm.metodosInternos = vm.metodos || {}; // por si no envian ningun metodo, inicio el objeto
        vm.metodosInternos.actualizarDatos = actualizarDatos;

        if (vm.entidades === undefined || vm.entidades.length === 0) {
            cargarDatos(vm.path, 100,undefined,vm.config.links);
        } else {
            conDatos = true;
            vm.optionsEntidades.data = vm.entidades;

        }
        setRowListeners();

        function actualizarDatos(){
            cargarDatos(vm.path, 100,undefined,vm.config.links);
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
                        vm.servicio.obtenerDatosSubgrilla(row.entity._links[vm.config.subGrilla].href).then(function(subEntity) {

                            row.entity.subGridOptions.data = subEntity;

                        });

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

// COMPONENTE PENSADO PARA QUE FUNCIONE PARA TODO TIPO DE DATOS, NO SOLO AFIP, ES CUESTION DE 
// ADAPTARLO POR AHORA LO DEJO CON AFIP. , la solucion es en controlador hacer un condicional y pasar el parametro
// por el DOM, por defecto si no se pasa nada toma como si fuese un dato de afip y usa ese servicio, si queremos 
// que sea general hay que definir un servicio generico que consulte un url y la parsee a un json.
(function(angular) {
    'use strict';
     var selectData = {
        restrict: 'E',
        templateUrl: 'src/selectData/select-template.html',
        controller: 'SelectController as sc',
        bindings: {
            url: '<?',
            campos: '<?',
            subcampos:'<?',
            title: '@',
            placeholder: '@',
            servicio: '<?',  
            entidades: '<?',    
            ultimaEntidad: '=?',
            clickItem: '&?'
        }
    };
    angular
        .module('uiComponents.components')
        .component('selectData',selectData);
        
   
})(angular);
(function(angular) {
	'use strict';
	angular
		.module('uiComponents.components')
		.controller('SelectController', SelectController);

	
	/** @ngInject */
	function SelectController() {
		var vm = this;
		
		vm.cargarDatos = cargarDatos;
		vm.cargarCampos = cargarCampos;
		vm.onSelect = onSelect;


		function checkDatos(){
			if(vm.entidades === undefined || vm.entidades.length === 0){
				cargarDatos();
			} else {
				vm.ultimaEntidad = (vm.ultimaEntidad !== undefined)? vm.ultimaEntidad:vm.entidades[0];
			}
		}
		function cargarCampos(select) {
			var text = '';
			
			if (select.selected !== undefined) {
				for (var index in vm.entidad.campos) {
					text += select.selected[vm.entidad.campos[index]] ;
					if(index < vm.entidad.campos.length){ text += ' - ';}
				}

			}
			return text;
		}
		function onSelect(item) {
			vm.clickItem({
				$event: item
			});
		}
		function cargarDatos(select) {
			
				vm.servicio.obtenerDatos(vm.url).then(function(data) {
					vm.entidades = data;
					//vm.entidadSeleccionada = (vm.ultimaEntidad != undefined)? vm.ultimaEntidad:vm.entidades[0];
					vm.ultimaEntidad = (vm.ultimaEntidad !== undefined)? vm.ultimaEntidad:vm.entidades[0];

				});
			
		}
	}
})(angular);
