(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('uiComponents.config', [])
      .value('uiComponents.config', {
          debug: true
      });

  // Modules
  angular.module('uiComponents.directives', []);
  angular.module('uiComponents.filters', []);
  angular.module('uiComponents',
      [
          'uiComponents.config',
          'uiComponents.directives',
          'uiComponents.filters'
      ]);

})(angular);
