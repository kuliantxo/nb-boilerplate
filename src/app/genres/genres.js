angular.module( 'ngBoilerplate.genres', [
    'ui.router',
    'placeholders',
    'ui.bootstrap'
])

.config(function config( $stateProvider ) {
    $stateProvider.state( 'genres', {
        url: '/genres',
        views: {
            "main": {
                controller: 'GenresCtrl',
                templateUrl: 'genres/genres.tpl.html'
            }
        },
        data:{ pageTitle: 'Genres' }
    });
})

.controller( 'GenresCtrl', function GenresCtrl( $scope ) {
    // This is simple a demo for UI Boostrap.
    $scope.dropdownDemoItems = [
        "The first choice!",
        "And another choice for you.",
        "but wait! A third!"
    ];
})

;
