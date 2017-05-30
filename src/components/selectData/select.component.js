// COMPONENTE PENSADO PARA QUE FUNCIONE PARA TODOS LOS TIPO DE DATOS, NO SOLO AFIP, ES CUESTION DE
// ADAPTARLO POR AHORA LO DEJO CON AFIP. , la solucion es en controlador hacer un condicional y pasar el parametro
// por el DOM, por defecto si no se pasa nada toma como si fuese un dato de afip y usa ese servicio, si queremos
// que sea general hay que definir un servicio generico que consulte un url y la parsee a un json.
(function (angular) {
  'use strict';
  var selectData;
  selectData = {
    restrict: 'E',
    template:'<div class="input-group">   ' +
    '<ui-select class="bootstrap-select form-control" ng-model="sc.ultimaEntidad" on-select="sc.onSelect($item)">' +
    '<ui-select-match placeholder="{{sc.configuracion.placeholder}}">{{sc.cargarCampos($select)}}</ui-select-match>    ' +
    '<ui-select-choices style="margin-top: 34px" repeat="entidad in sc.entidades | propsFilter: sc.getSearch($select)">   ' +
    '     <span ng-bind-html="entidad[sc.configuracion.campos[0].field] | highlight: $select.search"></span> <small ng-repeat="subcampo in sc.configuracion.subcampos">' +
    '{{subcampo.title}}: <span ng-bind-html="\'\'+ sc.byString(entidad,subcampo.field) | highlight: $select.search"> </span></small>   ' +
    '  </ui-select-choices>        </ui-select> ' +
    '      <span class="input-group-btn" ng-if="sc.busquedaAvanzada">      ' +
    '<button type="button" ng-click="sc.showBuscar()" class="btn btn-default">      ' +
    '<span class="ion-ios-search-strong"></span>      </button>      </span></div>',
    // template: ' <ui-select theme="bootstrap" search-enabled="sc.searchEnabled" ng-model="sc.ultimaEntidad" ' +
    // 'on-select="sc.onSelect($item)" >' +
    // '<ui-select-match placeholder="{{sc.configuracion.placeholder}}" popover-popup-delay="750" uib-popover="{{sc.configuracion.toolTip}}" ' +
    // 'popover-trigger="mouseenter" popover-placement="bottom">{{sc.cargarCampos($select)}}' +
    // '</ui-select-match><ui-select-choices repeat="entidad in sc.entidades | propsFilter: sc.getSearch($select)">' +
    // '<div><span>{{sc.configuracion.campos[0].title}} </span> <span ng-bind-html="entidad[sc.configuracion.campos[0].field] | highlight: $select.search">' +
    // '</span></div><small ng-repeat="subcampo in sc.configuracion.subcampos">' +
    // '{{subcampo.title}}: <span ng-bind-html="\'\'+ sc.byString(entidad,subcampo.field) | highlight: $select.search">',


    controller: 'SelectController as sc',
    bindings: {
      url: '<?',//esta url no se utiliza por el momkento, pero esta pensado para que sea utilizado por el servicio
      // campos: '<?',
      // subcampos:'<?',
      // title: '@',
      // placeholder: '@', ESTOS CAMPOS VAN A SER REEMPLAZADOS POR CONFIGURACION
      configuracion: '<?',
      //el objeto configuracion debe tener la siguiente forma:
      //configuracion:{
//                  titulo: STRING "titulo de la entidad"
//                  campos: ARRAY STRING ,campos que se quiere mostrar,
//                  subcampos: ARRAY STRING "Subcampos que se quiere mostrar"
//                  toolTip: STRING para mostrar un tooltip
//                  placholder: STRING,
//                  fieldsToSearch: ARRAY, campos por los que se van a buscar, si no se pasa nada por defecto busca por todos los campos.
      //}
      searchEnabled: '<?',   //true|false, default: true
      servicio: '<?',  // este servicio debe implementar obtenerDatos() y debe devolver un promise con los datos ya resueltos
      parametros: '<?', // parametros del servicio obtenerDatos, si no se lo pasa va como undefined
      entidades: '<?',    // si se traen entidades, no se consulta a servicio
      ultimaEntidad: '=?', // entidad que se  va a mostrar como seleccionada, default: la primera de la lista
      busquedaAvanzada:'<?', // aca va la configuracion de la tabla para la busqueda avanzada
      clickItem: '&?', // evento que se dispara cuando se selecciona un item, $event es el item seleccionado
      onLoadData: '&?' // evento que se dispara cuando se termina de cargar los datos, $item es el item seleccionado
    }
  };
  angular
    .module('uiComponents.components')
    .component('selectData', selectData);


})(angular);
