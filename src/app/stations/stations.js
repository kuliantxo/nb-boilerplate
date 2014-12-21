angular.module( 'ngBoilerplate.stations', [
    'ui.router',
    'placeholders',
    'ui.bootstrap'
])

.config(function config( $stateProvider ) {
    $stateProvider.state( 'stations', {
        url: '/stations',
        controller: 'StationsCtrl',
        templateUrl: 'stations/stations.tpl.html',
        resolve:{
            getStations:  function(stationsFctr){
                return stationsFctr.getStations();
            }
        },
        data:{ pageTitle: 'Stations' }
    });
})

.controller( 'StationsCtrl', function StationsCtrl($scope, getStations) {
    $scope.stations = getStations.data.contents.LIVE365_STATION;
})

.factory('stationsFctr', function ($http) {
    var url = 'http://www.live365.com/cgi-bin/directory.cgi?site=xml&access=PUBLIC&rows=100&only=P';

    return {
        getStations: function() {
            return $http.get('/proxy.php?url='+encodeURIComponent(url));
        },
        getGenreStations: function(genre) {
            var params = '&genre='+encodeURIComponent(genre);
            return $http.get('/proxy.php?url='+encodeURIComponent(url+params));
        },
        getSearchStations: function(query) {
            var params = '&searchdesc='+encodeURIComponent(query);
            return $http.get('/proxy.php?url='+encodeURIComponent(url+params));
        }
    };
})

.directive('stations', function() {
    /*jshint multistr: true */
    return {
        restrict: 'E',
        template: '\
            <ul class="media-list">\
                <li class="media" ng-repeat="station in stations" logic-option></li>\
            </ul>\
        '
    };  
})

.directive('logicOption', function() {
    /*jshint multistr: true */
    return {
        replace: false,
        template: '\
            <a class="pull-left" href ng-click="setStation(station, true)">\
                <i class="fa fa-play"></i>\
            </a>\
            <div class="media-body">\
                <a class="bc_url pull-right" href="{{ station.STATION_BROADCASTER_URL }}" title="{{ station.STATION_BROADCASTER_URL }}" target="_blank"><i class="fa fa-home"></i></a>\
                <h3 class="media-heading"><a href ng-click="setStation(station, true)">{{ station.STATION_TITLE }}</a></h3>\
                <div>{{ station.STATION_DESCRIPTION }}</div>\
                <div class="station_loc"><em>{{ station.STATION_LOCATION }}</em></div>\
                <div><em>{{ station.STATION_GENRE }}</em></div>\
            </div>\
        '
    };  
})

;
