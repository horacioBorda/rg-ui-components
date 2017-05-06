// COMPONENTE PENSADO PARA QUE FUNCIONE PARA TODO TIPO DE DATOS, NO SOLO AFIP, ES CUESTION DE 
// ADAPTARLO POR AHORA LO DEJO CON AFIP. , la solucion es en controlador hacer un condicional y pasar el parametro
// por el DOM, por defecto si no se pasa nada toma como si fuese un dato de afip y usa ese servicio, si queremos 
// que sea general hay que definir un servicio generico que consulte un url y la parsee a un json.
(function(angular) {
    'use strict';
     var selectData = {
        restrict: 'E',
        template: '<form class="form-horizontal">'+
        '<small >{{sc.configuracion.nombre}}</small>'+
        '<div class="form-group">'+
        '<ui-select class="btn-group bootstrap-select form-control" ng-model="sc.ultimaEntidad" '+
        ' title="{{sc.configuracion.titulo}}" on-select="sc.onSelect($item)" append-to-body="true" >'+
        '<ui-select-match placeholder="{{sc.configuracion.placeholder}}" popover-popup-delay="750" uib-popover="{{sc.configuracion.toolTip}}" '+
        'popover-trigger="mouseenter" popover-placement="bottom">{{sc.cargarCampos($select)}}'+
        '</ui-select-match><ui-select-choices repeat="entidad in sc.entidades | propsFilter: {[sc.configuracion.campos[0]]: $select.search}">'+
        '<div ng-bind-html="entidad[sc.configuracion.campos[0]] | highlight: $select.search">'+
        '</div><small ng-repeat="subcampo in sc.configuracion.subcampos">'+
        '{{subcampo}}: <span ng-bind-html="\'\'+ entidad[subcampo] | highlight: $select.search">'+
        '</span><!--  email: {{person.email}}age: <span ng-bind-html="\'\'+person.age | highlight: $select.search">'+
        '</span> --></small></ui-select-choices> </ui-select></div></form>',
        controller: 'SelectController as sc',
        bindings: {
            url: '<?',//esta url no se utiliza por el momkento, pero esta pensado para que sea utilizado por el servicio 
            // campos: '<?',
            // subcampos:'<?',
            // title: '@',
            // placeholder: '@', ESTOS CAMPOS VAN A SER REEMPLAZADOS POR CONFIGURACION
            configuracion:'<?',
            //el objeto configuracion debe tener la siguiente forma:
            //configuracion:{
//                  titulo: STRING "titulo de la entidad" 
//                  campos: ARRAY STRING ,campos que se quiere mostrar, 
//                  subcampos: ARRAY STRING "Subcampos que se quiere mostrar"
//                  toolTip: STRING para mostrar un tooltip
//                  placholder: STRING 
                //}
            servicio: '<?',  // este servicio debe implementar obtenerDatos() y debe devolver un promise con los datos ya resueltos
            entidades: '<?',    // si se traen entidades, no se consulta a servicio
            ultimaEntidad: '=?', // entidad que se  va a mostrar como seleccionada
            clickItem: '&?' // evento que se dispara cuando se selecciona un item, $event es el item seleccionado
        }
    };
    angular
        .module('uiComponents.components')
        .component('selectData',selectData);
        
   
})(angular);