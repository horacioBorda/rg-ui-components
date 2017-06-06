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
