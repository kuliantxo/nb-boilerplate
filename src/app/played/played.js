angular.module( 'ngBoilerplate.played', [
    'ui.router',
    'placeholders',
    'ui.bootstrap'
])

.config(function config( $stateProvider ) {
    $stateProvider.state( 'played', {
        url: '/played',
        views: {
            "main": {
                controller: 'PlayedCtrl',
                templateUrl: 'played/played.tpl.html'
            }
        },
        data:{ pageTitle: 'Played' }
    });
})

.controller( 'PlayedCtrl', function PlayedCtrl( $scope ) {
    // This is simple a demo for UI Boostrap.
    $scope.dropdownDemoItems = [
        "The first choice!",
        "And another choice for you.",
        "but wait! A third!"
    ];
})

;
