(function() {
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
})();
