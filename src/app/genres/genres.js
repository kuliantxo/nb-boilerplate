angular.module( 'ngBoilerplate.genres', [
    'ui.router',
    'placeholders',
    'ui.bootstrap'
])

.config(function config( $stateProvider ) {
    $stateProvider
        .state( 'genres', {
            url: '/genres',
            views: {
                "main": {
                    controller: 'GenresCtrl',
                    templateUrl: 'genres/genres.tpl.html'
                }
            },
            data:{ pageTitle: 'Genres' }
        })
        .state( 'genres.stations', {
            url: '/:genre',
            views: {
                "stations": {
                    controller: 'StationsCtrl',
                    templateUrl: 'stations/stations.tpl.html'
                }
            },
            data:{ pageTitle: 'Genres Stn' }
        })
    ;
})

.controller( 'GenresCtrl', function GenresCtrl( $scope, genresFctr ) {
    var params = null;

    $scope.genres = [];

    var loadGenres = function () {
        $scope.genres = genresFctr.getGenres(params);
    };

    loadGenres();
})

.factory('genresFctr', function ($http) {
    var url = 'http://www.live365.com/cgi-bin/directory.cgi?site=xml&access=PUBLIC&rows=100&only=P';
    var genres = [
        {int: 'alternative', ext: 'Alternative'},
        {int: 'blues', ext: 'Blues'},
        {int: 'classical', ext: 'Classical'},
        {int: 'country', ext: 'Country'},
        {int: 'easy', ext: 'Easy Listening'},
        {int: 'electronic', ext: 'Electronic/Dance'},
        {int: 'folk', ext: 'Folk'},
        {int: 'freeform', ext: 'Freeform'},
        {int: 'hiphop', ext: 'Hip-Hop/Rap'},
        {int: 'inspirational', ext: 'Inspirational'},
        {int: 'international', ext: 'International'},
        {int: 'jazz', ext: 'Jazz'},
        {int: 'latin', ext: 'Latin'},
        {int: 'metal', ext: 'Metal'},
        {int: 'new_age', ext: 'New Age'},
        {int: 'oldies', ext: 'Oldies'},
        {int: 'pop', ext: 'Pop'},
        {int: 'rb', ext: 'R&B/Urban'},
        {int: 'reggae', ext: 'Reggae'},
        {int: 'rock', ext: 'Rock'},
        {int: 'holiday', ext: 'Seasonal/Holiday'},
        {int: 'soundtracks', ext: 'Soundtracks'},
        {int: 'talk', ext: 'Talk'}
    ];

    return {
        getGenres: function(params) {
            return genres;
        }
    };
})

;
