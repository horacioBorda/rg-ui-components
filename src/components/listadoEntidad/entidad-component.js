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
 