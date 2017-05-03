(function() {
	'use strict';
	angular
		.module('RedGround.UI.components')
		.controller('SelectController', SelectController);

	
	/** @ngInject */
	function SelectController(DatosAfip, GenericService, SelectMapping) {
		var vm = this;
		vm.entidades = [];

		vm.entidad = SelectMapping.getEntidadMapping(vm.tipoEntidad);
		vm.cargarDatos = cargarDatos;
		vm.cargarCampos = cargarCampos;
		vm.onSelect = onSelect;

		function cargarCampos(select) {
			var text = "";
			
			if (select.selected != undefined) {
				for (var index in vm.entidad.campos) {
					text += select.selected[vm.entidad.campos[index]] ;
					if(index < vm.entidad.campos.length){ text += " - "};
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
			if (vm.entidad.api == undefined || vm.entidad.api == false) {
				DatosAfip.getDatos(vm.entidad.url).then(function(data) {
					vm.entidades = data;
					//vm.entidadSeleccionada = (vm.ultimaEntidad != undefined)? vm.ultimaEntidad:vm.entidades[0];
					vm.ultimaEntidad = (vm.ultimaEntidad != undefined)? vm.ultimaEntidad:vm.entidades[0];

				});
			} else {
				GenericService.obtenerDatos(vm.entidad.url).then(function(data) {
					vm.entidades = data._embeddedItems;
					//vm.entidadSeleccionada = (vm.ultimaEntidad != undefined)? vm.ultimaEntidad:vm.entidades[0];
					vm.ultimaEntidad = (vm.ultimaEntidad != undefined)? vm.ultimaEntidad:vm.entidades[0];

				});
			};
		}
	}
})();
