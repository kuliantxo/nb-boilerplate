angular.module( 'ngBoilerplate.stations', [
    'ui.router',
    'placeholders',
    'ui.bootstrap'
])

.config(function config( $stateProvider ) {
    $stateProvider.state( 'stations', {
        url: '/stations',
        views: {
            "main": {
                controller: 'StationsCtrl',
                templateUrl: 'stations/stations.tpl.html'
            }
        },
        data:{ pageTitle: 'Stations' }
    });
})

.controller( 'StationsCtrl', function StationsCtrl( $scope ) {
    // This is simple a demo for UI Boostrap.
    $scope.dropdownDemoItems = [
        "The first choice!",
        "And another choice for you.",
        "but wait! A third!"
    ];
})

;
