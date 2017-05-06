(function(angular) { 
    'use strict';
    angular
        .module('uiComponents.components')
        .controller('SelectController', SelectController);


    /** @ngInject */
    function SelectController() {
        var vm = this;
        vm.$onInit = function() {
            vm.cargarDatos = cargarDatos;
            vm.cargarCampos = cargarCampos;
            vm.onSelect = onSelect;
            checkDatos();
        };



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
                    text += select.selected[vm.configuracion.campos[index]];
                    if (index < vm.configuracion.campos.length) { text += ' - '; }
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
            if (vm.url === undefined) {
                vm.servicio.obtenerDatos(vm.parametros).then(function(data) {
                    vm.entidades = data;
                    //vm.entidadSeleccionada = (vm.ultimaEntidad != undefined)? vm.ultimaEntidad:vm.entidades[0];
                    vm.ultimaEntidad = (vm.ultimaEntidad !== undefined) ? vm.ultimaEntidad : vm.entidades[0];

                });
            } else {
                vm.servicio.obtenerDatos(vm.url).then(function(data) {
                    vm.entidades = data;
                    //vm.entidadSeleccionada = (vm.ultimaEntidad != undefined)? vm.ultimaEntidad:vm.entidades[0];
                    vm.ultimaEntidad = (vm.ultimaEntidad !== undefined) ? vm.ultimaEntidad : vm.entidades[0];
                });
            }


        }
    }
})(angular);
