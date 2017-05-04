// COMPONENTE PENSADO PARA QUE FUNCIONE PARA TODO TIPO DE DATOS, NO SOLO AFIP, ES CUESTION DE 
// ADAPTARLO POR AHORA LO DEJO CON AFIP. , la solucion es en controlador hacer un condicional y pasar el parametro
// por el DOM, por defecto si no se pasa nada toma como si fuese un dato de afip y usa ese servicio, si queremos 
// que sea general hay que definir un servicio generico que consulte un url y la parsee a un json.
(function(angular) {
    'use strict';
     var selectData = {
        restrict: 'E',
        template: '<form class="form-horizontal">'+
        '<small >{{sc.entidad.nombre}}</small>'+
        '<div class="form-group" ng-init="sc.cargarDatos($select)">'+
        '<ui-select class="btn-group bootstrap-select form-control" ng-model="sc.ultimaEntidad" '+
        ' title="{{sc.entidad.title}}" on-select="sc.onSelect($item)" append-to-body="true" >'+
        '<ui-select-match placeholder="{{sc.entidad.placeholder}}" popover-popup-delay="750" uib-popover="{{sc.entidad.toolTip}}" '+
        'popover-trigger="mouseenter" popover-placement="bottom">{{sc.cargarCampos($select)}}'+
        '</ui-select-match><ui-select-choices repeat="entidad in sc.entidades | propsFilter: {[sc.entidad.campos[0]]: $select.search}">'+
        '<div ng-bind-html="entidad[sc.entidad.campos[0]] | highlight: $select.search">'+
        '</div><small ng-repeat="subcampo in sc.entidad.subcampos">'+
        '{{subcampo}}: <span ng-bind-html="\'\'+ entidad[subcampo] | highlight: $select.search">'+
        '</span><!--  email: {{person.email}}age: <span ng-bind-html="\'\'+person.age | highlight: $select.search">'+
        '</span> --></small></ui-select-choices> </ui-select></div></form>',
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