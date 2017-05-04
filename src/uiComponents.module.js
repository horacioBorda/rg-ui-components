(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('uiComponents.config', [])
      .value('uiComponents.config', {
          debug: true
      });
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
