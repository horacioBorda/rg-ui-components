(function() {
    'use strict';
    angular
        .module('RedGround.UI.components')
        .factory('SelectMapping', SelectMapping);

  
        /** @ngInject */
    function SelectMapping( EMPRESA_CONFIG, TIPO_ENTIDAD, DATOS_AFIP) {
        var factory = {
            getEntidadMapping : getEntidadMapping
        };

        function getEntidadMapping(tipoEntidad) {
            var entidadMapping = {};
            switch (tipoEntidad) {
                // case TIPO_ENTIDAD.CLIENTE: //CLIENTE
                //     entidadMapping = CLIENTE_CONFIG.BASE;

                //     entidadMapping.url = ClientesMapping.getClientes();

                //     break;

                case TIPO_ENTIDAD.EMPRESA:
                    entidadMapping = EMPRESA_CONFIG.BASE;

                    break;
                    
                case TIPO_ENTIDAD.TIPO_RESPONSABLE:
                	entidadMapping = DATOS_AFIP.TIPOS_RESPONSABLES;
                    break;
            }
            return entidadMapping;
        }
        return factory;

    }
})();