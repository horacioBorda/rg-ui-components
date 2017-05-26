(function(angular) {
    'use strict';
    angular
        .module('uiComponents.components')
        .controller('SelectController', SelectController);


    /** @ngInject */
    function SelectController() {
        var vm = this;

        vm.byString = byString;
        vm.cargarDatos = cargarDatos;
        vm.cargarCampos = cargarCampos;
        vm.onSelect = onSelect;
        vm.getSearchEnabled = getSearchEnabled;
        vm.getSearch = getSearch;

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
