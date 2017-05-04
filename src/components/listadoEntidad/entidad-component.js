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
 