
(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config

  angular.module('uiComponents.config', [])
      .value('uiComponents.config', {
          debug: true
      })
      .config(generalConfig);

  function generalConfig($provide){
     // PARA AGREGAR EL LENGUAGE DE TODOS LOS UI-GRID EN ESPAÑOL
    $provide.decorator('GridOptions',['$delegate', 'i18nService', function($delegate, i18nService){
        var gridOptions;
        gridOptions = angular.copy($delegate);
        gridOptions.initialize = function(options) {
            var initOptions;
            initOptions = $delegate.initialize(options);
            return initOptions;
        };
        //es is the language prefix you want
        i18nService.setCurrentLang('es');
        return gridOptions;
    }]);
  }    
  angular.module('uiComponents.filters',[]);
  angular.module('uiComponents.components',[
    'ui.grid',
    'ui.grid.exporter',
    'ui.grid.selection',
    'ui.grid.pagination',
    'ui.grid.pinning',
    'ui.grid.moveColumns',
    'ui.grid.edit', 
    'ui.grid.rowEdit'
    ]);
  angular.module('uiComponents',
      [
          'uiComponents.config',
          'uiComponents.components',
          'uiComponents.filters'
      ]);

})(angular);
