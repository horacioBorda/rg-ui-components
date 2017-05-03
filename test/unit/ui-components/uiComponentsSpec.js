'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

  // Get module
  module = angular.module('uiComponents');
  dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('uiComponents.config')).to.be.ok;
  });

  
  it('should load filters module', function() {
    expect(hasModule('uiComponents.filters')).to.be.ok;
  });
  

  
  it('should load directives module', function() {
    expect(hasModule('uiComponents.directives')).to.be.ok;
  });
  

  

});