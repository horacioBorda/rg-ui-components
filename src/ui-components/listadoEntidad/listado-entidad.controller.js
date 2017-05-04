(function() {
    'use strict';
    angular.module('uiComponents.components')
        .controller('ListadoEntidadController', ListadoEntidadController);

    /** @ngInject */
    function ListadoEntidadController($log, $scope, $timeout, uiGridConstants, TABLEMAPPING, GenericService, i18nService) {
        var conDatos = false;
        var vm = this;

        vm.selected = {};
        vm.deselectedAll = false; // EXPONER
        i18nService.setCurrentLang('es');
        vm.gridApi = null;
        vm.optionsEntidades = angular.copy(vm.gridOptions);

        vm.metodosInternos = vm.metodos || {}; // por si no envian ningun metodo, inicio el objeto
        vm.metodosInternos.actualizarDatos = actualizarDatos;

        if (vm.entidades === undefined || vm.entidades.length === 0) {
            cargarDatos(vm.path, 100,undefined,vm.config.links);
        } else {
            conDatos = true;
            vm.optionsEntidades.data = vm.entidades;

        }
        setRowListeners();

        function actualizarDatos(){
            cargarDatos(vm.path, 100,undefined,vm.config.links);
        }

        function cargarDatos(url, pageSize, numPage, links) {
           
            vm.servicio.obtenerDatos(url, links, pageSize, numPage).then(function(entidades) {
                
                vm.entidades = entidades;
                vm.optionsEntidades.data = entidades;
                vm.optionsEntidades.totalItems = vm.entidades.length;
                checkSelectAll();
                // SI HAY ALGUNA FILA SELECCIONADA VEO CUAL ES, ESTO PARA EL CASO DE QUE LA PAGINACION SEA EXTERNA, HAY
                // QUE RECORDAR CUALES FILAS FUERON SELECCIONADAS 
                //if(numPage!==undefined)setSelected(numPage,pageSize);
            });


        }

        function checkSelectAll() {

            if (vm.selectAll) {
                vm.gridApi.grid.modifyRows(vm.optionsEntidades.data);
                vm.gridApi.selection.selectAllRows();
            }
        }

        function setRowListeners() {
            console.log(vm.optionsEntidades);
            vm.optionsEntidades.onRegisterApi = function(gridApi) {
                vm.gridApi = gridApi;

                gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {

                    if (row.isExpanded) {

                        row.entity.subGridOptions = angular.copy(vm.optionsEntidades.subGridColumnDefs);
                        vm.servicio.obtenerDatosSubgrilla(row.entity._links[vm.config.subGrilla].href).then(function(subEntity) {

                            row.entity.subGridOptions.data = subEntity;

                        });

                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function(numPage, pageSize) {
                    //ESTA PARTE CONSULTA POR PAGINA Y POR EL TAMAÑO DE PAGINA, PARA DESPUES DEJO
                    // vm.optionsEntidades.pageNumber = numPage;
                    // console.log(vm.entidadesSeleccionadas);
                    //  vm.optionsEntidades.pageSize = pageSize;
                    //  cargarDatos(vm.path,pageSize,numPage-1);

                    // getPage();
                });
                gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                    vm.entidadesSeleccionadas = gridApi.selection.getSelectedRows();
                    if (typeof vm.clickItem !== 'undefined') vm.clickItem({
                        $entidad: vm.entidadesSeleccionadas,
                        $entidadesSeleccionadas: vm.entidadesSeleccionadas
                    });
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function(row) {
                    vm.entidadesSeleccionadas = gridApi.selection.getSelectedRows();
                    if (typeof vm.clickItem !== 'undefined') vm.clickItem({
                        $entidad: vm.entidadesSeleccionadas,
                        $entidadesSeleccionadas: vm.entidadesSeleccionadas
                    });
                });

                // en honor a Pablo Guidici
                if (conDatos) {
                    $timeout(function() {
                        checkSelectAll();
                    }, 150);
                }

            };
        }

        function setSelected(numPage, pageSize) {
            var elementSelected = [];
            var size = (vm.optionsEntidades.data.length <= pageSize * (numPage + 1)) ? vm.optionsEntidades.data.length : pageSize * (numPage + 1);
            for (var index in vm.entidadesSeleccionadas) {
                for (var i = 0; i < size; i++) {
                    if (vm.optionsEntidades.data[i].codigoComprobante == vm.entidadesSeleccionadas[index].codigoComprobante) {
                        elementSelected.push(vm.optionsEntidades.data[i]);
                        vm.gridApi.grid.modifyRows(vm.optionsEntidades.data[i])
                        vm.gridApi.selection.unSelectRow(vm.optionsEntidades.data[i]);

                        // vm.gridApi.grid.modifyRows(vm.optionsEntidades.data);
                        // vm.gridApi.selection.selectRow(vm.optionsEntidades.data[i]);

                    }
                }
            }
        }

    }
})();
