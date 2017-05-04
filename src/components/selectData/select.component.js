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