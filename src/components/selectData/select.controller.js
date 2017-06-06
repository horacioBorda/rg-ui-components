(function(angular) {
  'use strict';
  angular
    .module('uiComponents.components')
    .controller('SelectController', SelectController);


  /** @ngInject */
  function SelectController($uibModal) {
    var vm = this;

    var lastSearch;

    vm.byString = byString;
    vm.cargarDatos = cargarDatos;
    vm.cargarCampos = cargarCampos;
    vm.onSelect = onSelect;
    vm.getSearchEnabled = getSearchEnabled;
    vm.getSearch = getSearch;
    vm.clickButton = clickButton;
    vm.getClass = getClass;

    function getClass() {
      if(!vm.entidadesFiltradas) return 'ion-ios-search-strong';
      if(vm.entidadesFiltradas.length ===0 && vm.configuracion.agregarItem) return'ion-plus-round';
      return 'ion-ios-search-strong';
    }
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
      lastSearch = $select.search;
      return toSearch;
    }

    function getSearchEnabled() {
      return vm.searchEnabled || true;
    }

    function clickButton(select) {
      if(vm.entidadesFiltradas.length === 0 && vm.configuracion.agregarItem){

        var nuevoProducto = new Producto(lastSearch);
        nuevoProducto.nuevo = true;
        vm.entidades.unshift(nuevoProducto);
        vm.ultimaEntidad = nuevoProducto;
        onSelect(vm.ultimaEntidad);

      } else {
        var modalInstanceProg = $uibModal.open({
          animation: true,
          template: '<!-- HEADER -->                ' +
          '<div class="modal-header">                    <h3 class="modal-title" id="modal-title">{{bac.getTitle()}}</h3>                ' +
          '</div>                <!-- BODY -->                <div class="modal-body" id="modal-body"> ' +
          '<listado-entidad grid-options="bec.configuracionTabla" entidades-seleccionadas="bec.entidadesSeleccionadas" click-item="bec.clickEntidad($entidad)" entidades="bec.entidades" ></listado-entidad>               ' +
          '              </div><!-- FOOTER --><div class="modal-footer">           ' +
          '     <button class="btn btn-primary" type="button" ng-click="bec.aceptar()" ng-disabled="!bec.entitdadSeleccionada">Aceptar</button>      ' +
          '          <button class="btn btn-warning" type="button" ng-click="bec.cancelar()">Cancelar</button>                </div>',
          controller:"BuscarEntidadController",
          controllerAs: 'bec',
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

    }
    function checkDatos() {
      if (vm.entidades === undefined || vm.entidades.length === 0) {
        cargarDatos();
      } else {
        vm.ultimaEntidad = (vm.ultimaEntidad !== undefined) ? vm.ultimaEntidad : vm.entidades[0];
      }
      if(vm.configuracion.fixMarginTop){
        vm.customStyle = {'margin-top': '0px'};
      }else{
        vm.customStyle = {'margin-top': '34px'};
      };
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

    /**
     *
     * @param item item que se selecciono
     * @param type tipo, si es nuevo type=1, sino type=0
     */
    function onSelect(item) {
      if(!vm.clickItem)return;
      vm.clickItem({
        $event: item, $nuevo: item.nuevo||false
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
