angular.module( 'ngBoilerplate.genres', [
    'ui.router',
    'placeholders',
    'ui.bootstrap'
])

.config(function config( $stateProvider ) {
    $stateProvider
        .state( 'genres', {
            url: '/genres',
            controller: 'GenresCtrl',
            templateUrl: 'genres/genres.tpl.html',
            resolve:{
                getGenres:  function(genresFctr) {
                    return genresFctr.getGenres();
                }
            },
            data:{ pageTitle: 'Genres' }
        })
        .state( 'genres-stations', {
            url: '/genres/:genre',
            controller: 'StationsCtrl',
            templateUrl: 'stations/stations.tpl.html',
            resolve:{
                getStations:  function(stationsFctr, $stateParams){
                    return stationsFctr.getGenreStations($stateParams.genre);
                }
            },
            data:{ pageTitle: 'Genres Stn' }
        })
    ;
})

.controller( 'GenresCtrl', function GenresCtrl($scope, getGenres) {
    $scope.genres = getGenres;
})

.factory('genresFctr', function () {
    var genres = {
        'alternative': {name: 'Alternative'},
        'blues': {name: 'Blues'},
        'classical': {name: 'Classical'},
        'country': {name: 'Country'},
        'easy': {name: 'Easy Listening'},
        'electronic': {name: 'Electronic/Dance'},
        'folk': {name: 'Folk'},
        'freeform': {name: 'Freeform'},
        'hiphop': {name: 'Hip-Hop/Rap'},
        'inspirational': {name: 'Inspirational'},
        'international': {name: 'International'},
        'jazz': {name: 'Jazz'},
        'latin': {name: 'Latin'},
        'metal': {name: 'Metal'},
        'new_age': {name: 'New Age'},
        'oldies': {name: 'Oldies'},
        'pop': {name: 'Pop'},
        'rb': {name: 'R&B/Urban'},
        'reggae': {name: 'Reggae'},
        'rock': {name: 'Rock'},
        'holiday': {name: 'Seasonal/Holiday'},
        'soundtracks': {name: 'Soundtracks'},
        'talk': {name: 'Talk'}
    };

    return {
        getGenres: function() {
            return genres;
        }
    };
})

;
