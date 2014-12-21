angular.module( 'ngBoilerplate.search', [
    'ui.router',
    'placeholders',
    'ui.bootstrap'
])

.config(function config( $stateProvider ) {
    $stateProvider
        .state( 'search', {
            url: '/search/:query',
            controller: 'StationsCtrl',
            templateUrl: 'stations/stations.tpl.html',
            resolve:{
                getStations:  function(stationsFctr, $stateParams) {
                    return stationsFctr.getSearchStations($stateParams.query);
                }
            },
            data:{ pageTitle: 'Search' }
        })        
    ;
})
;
