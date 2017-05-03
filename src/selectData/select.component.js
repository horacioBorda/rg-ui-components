// COMPONENTE PENSADO PARA QUE FUNCIONE PARA TODO TIPO DE DATOS, NO SOLO AFIP, ES CUESTION DE 
// ADAPTARLO POR AHORA LO DEJO CON AFIP. , la solucion es en controlador hacer un condicional y pasar el parametro
// por el DOM, por defecto si no se pasa nada toma como si fuese un dato de afip y usa ese servicio, si queremos 
// que sea general hay que definir un servicio generico que consulte un url y la parsee a un json.
(function() {
    'use strict';
     var selectData = {
        restrict: 'E',
        templateUrl: 'app/components/selectData/select-template.html',
        controller: 'SelectController as sc',
        bindings: {
            url: '<?',
            campos: '<?',
            subcampos:'<?',
            title: '@',
            placeholder: '@',
            api: '<?', //SI NO LE PASO NADA VA POR DATOS DEL AFIP
            ultimaEntidad: '=?',
            tipoEntidad: '<?',

            clickItem: '&?'
        }
    };
    angular
        .module('RedGround.UI.components')
        .component('selectData',selectData)
        .constant('TIPO_ENTIDAD', {
            'CLIENTE':1,
            'ARTICULO':2,
            'EMPRESA':3,
            'TIPO_RESPONSABLE':4
        });
   
})();