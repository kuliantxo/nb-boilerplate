angular.module( 'ngBoilerplate', [
    'templates-app',
    'templates-common',
    'ngBoilerplate.home',
    'ngBoilerplate.stations',
    'ngBoilerplate.genres',
    'ngBoilerplate.played',
    'ngBoilerplate.search',
    'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
    $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $state ) {
    $scope.search = function(query) {
        $state.go('search', {'query': query});
    };

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if ( angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
        }
    });
})

.controller( 'PlayerCtrl', function PlayerCtrl ( $scope, $location, nowPlayingFctr ) {
    var station = {"STREAM_ID":"113719","STATION_ID":"124080","STATION_ADDR":{},"STATION_ADDRESS":"http:\/\/www.live365.com\/play\/wava2","STATION_BROADCASTER":"wava2","STATION_BROADCASTER_URL":"http:\/\/www.HotHitsAtlanta.net","STATION_TITLE":"Hot Hits Atlanta - WAVA","STATION_DESCRIPTION":"Picking You Up!  Making You Feel Good!  We Play Today's Hottest Top 40 Hits 24\/7! Welcome Home!!      \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0 E-Mail me Anytime! amos@hothitsatlanta.net","STATION_KEYWORDS":"Top 40 Pop Chris Brown Justin Rihanna Fergie Gwen Stefani Pink  3OH3! Timbaland T-Pain wava Hit Music","STATION_GENRE":"pop, hip-hop\/rap, top 40","STATION_CONNECTION":"128","STATION_CODEC":"mp3","STATION_QUALITY_LEVEL":"265","STATION_SOURCE":"live365","STATION_RATING":"9.00","STATION_LISTENERS_ACTIVE_REG":"501","STATION_LISTENERS_ACTIVE_PM":"23","STATION_LISTENERS_ACTIVE":"524","STATION_LISTENERS_MAX":"1800","STATION_TLH_30_DAYS":"418330","LIVE365_ATTRIBUTES":{"STATION_ATTR":"[Professional]"},"LIVE365_ATTRIBUTES_CODES":"PRXA","LISTENER_ACCESS":"PUBLIC","STATION_STATUS":"OK","STATION_SERVER_MODE":"OR","STATION_SEARCH_SCORE":"1.0","STATION_LOCATION":"Atlanta, GA"},
        defaultVolume = 0.8,
        timer = 0,
        simplePlayer = document.getElementById('audio');

    $scope.player = {
        status: 'paused',        // paused, buffering, playing, error
        btn: 'fa-play'
    };

    $scope.clickPlay = function() {
        if (simplePlayer.paused) {
            simplePlayer.src = 'http://www.live365.com/play/'+nowPlayingFctr.getStationBroadcaster();
            simplePlayer.play();
        } else {
            simplePlayer.pause();
        }
    };

    function bindEvent(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on'+type, handler);
        }
    }

    function logPlayerEvents(e) {
        console.log('on'+e.type);
//        debugFactory.setPlayerEventsAndBroadcast('on'+e.type);
    }

    bindEvent(simplePlayer, 'error', function(e) {
        logPlayerEvents(e);
        logPlayerEvents(simplePlayer.error);
        $scope.$apply(function () {
            $scope.player = {
                status: 'error',
                btn: 'fa-times'
            };
        });
        nowPlayingFctr.setStatusAndBroadcast('error');

        setTimeout(function(){
            if (!simplePlayer.paused) {
                simplePlayer.load();
                simplePlayer.play();
            } else {
                simplePlayer.pause();
            }
        }, 3000);
    });

    bindEvent(simplePlayer, 'pause', function(e) {
        logPlayerEvents(e);
        $scope.$apply(function () {
            $scope.player = {
                status: 'paused',
                btn: 'fa-play'
            };
        });
        nowPlayingFctr.setStatusAndBroadcast('paused');
    });

    bindEvent(simplePlayer, 'play', function(e) {
        logPlayerEvents(e);
        $scope.$apply(function () {
            $scope.player = {
                status: 'buffering',
                btn: 'fa-refresh'
            };
        });
        nowPlayingFctr.setStatusAndBroadcast('buffering');
    });

    bindEvent(simplePlayer, 'playing', function(e) {
        logPlayerEvents(e);
        $scope.$apply(function () {
            $scope.player = {
                status: 'playing',
                btn: 'fa-pause'
            };
        });
        nowPlayingFctr.setStatusAndBroadcast('playing');
    });

    var myVar = setInterval(function(){
        var buffered = 0;

        if (simplePlayer.buffered != null && simplePlayer.buffered.length) {
            buffered = simplePlayer.buffered.end(simplePlayer.buffered.length -1);
        }

        timer += 1;
    },1000);

    simplePlayer.volume = defaultVolume;

    $scope.$on('handlePlayBroadcast', function() {
        if (nowPlayingFctr.getStationStatus() == 'paused') {
            simplePlayer.src = 'http://www.live365.com/play/'+nowPlayingFctr.getStationBroadcaster();
            simplePlayer.play();
        } else {
            simplePlayer.pause();
        }
    });
})

.controller( 'NowPlayingCtrl', function PlayingCtrl ( $scope, $location, $timeout, $interval, nowPlayingFctr ) {
    var pGress,
        pTosh,
        previous;

    $scope.nowPlaying = {
        stationName: 'Station Name',
        artist: 'Artist',
        title: 'Title',
        time: 321,
        progress: 0,
        album: 'Album',
        image: 'assets/missing.png'
    };

    var loadNowPlaying = function (station, title) {
        $timeout.cancel(pTosh);
        $interval.cancel(pGress);

        nowPlayingFctr.getNowPlaying(station, function(data) {
            if ((data.contents.PlaylistEntry.Artist != previous) || (data.contents.PlaylistEntry.Artist === '')) {
//                if($scope.nowPlaying.artist != 'Artist') {
//                    playedService.addPlayed($scope.nowPlaying);
//                }
                previous = data.contents.PlaylistEntry.Artist;

                var image = 'assets/missing.png';

                if(data.contents.PlaylistEntry.visualURL) {
                    var visualURL = data.contents.PlaylistEntry.visualURL.split('|');
                    var visualURLEle = [];
                    var visualURLData = {};

                    for(var i = 0; i < visualURL.length; i++) {
                        visualURLEle = visualURL[i].split('=');
                        visualURLData[visualURLEle[0]] = visualURLEle[1];
                    }
                    
                    image = unescape(visualURLData.img);
                    
                    if (image && image !== 'undefined' && image.indexOf('noimage') == -1) {
                        image = image.replace(/SL1[36]0/, 'SL320');
                    }
                }

                $scope.nowPlaying = {
                    stationName: title,
                    artist: data.contents.PlaylistEntry.Artist,
                    title: data.contents.PlaylistEntry.Title,
                    time: data.contents.PlaylistEntry.Seconds,
                    album: data.contents.PlaylistEntry.Album,
                    image: image
                };

                var playedSoFar = Math.max(data.contents.PlaylistEntry.Seconds - data.contents.Refresh, 0);
                pGress = $interval(function() {
                    var pVal = Math.round((playedSoFar++ * 100) / data.contents.PlaylistEntry.Seconds);
                    if (pVal > 100) {
                        $interval.cancel(pGress);
                    } else {
                        $scope.nowPlaying.progress = pVal;
                    }
                },1000);
            } else {
                refresh = 5;
            }

            pTosh = $timeout(function() {
                loadNowPlaying(station, title);
            }, (data.contents.Refresh*1000));
        });
    };

    loadNowPlaying('wava2', 'Wava');
})

.factory('nowPlayingFctr', function ($http, $rootScope) {
    var station = {"STREAM_ID":"113719","STATION_ID":"124080","STATION_ADDR":{},"STATION_ADDRESS":"http:\/\/www.live365.com\/play\/wava2","STATION_BROADCASTER":"wava2","STATION_BROADCASTER_URL":"http:\/\/www.HotHitsAtlanta.net","STATION_TITLE":"Hot Hits Atlanta - WAVA","STATION_DESCRIPTION":"Picking You Up!  Making You Feel Good!  We Play Today's Hottest Top 40 Hits 24\/7! Welcome Home!!      \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0  \u00a0 E-Mail me Anytime! amos@hothitsatlanta.net","STATION_KEYWORDS":"Top 40 Pop Chris Brown Justin Rihanna Fergie Gwen Stefani Pink  3OH3! Timbaland T-Pain wava Hit Music","STATION_GENRE":"pop, hip-hop\/rap, top 40","STATION_CONNECTION":"128","STATION_CODEC":"mp3","STATION_QUALITY_LEVEL":"265","STATION_SOURCE":"live365","STATION_RATING":"9.00","STATION_LISTENERS_ACTIVE_REG":"501","STATION_LISTENERS_ACTIVE_PM":"23","STATION_LISTENERS_ACTIVE":"524","STATION_LISTENERS_MAX":"1800","STATION_TLH_30_DAYS":"418330","LIVE365_ATTRIBUTES":{"STATION_ATTR":"[Professional]"},"LIVE365_ATTRIBUTES_CODES":"PRXA","LISTENER_ACCESS":"PUBLIC","STATION_STATUS":"OK","STATION_SERVER_MODE":"OR","STATION_SEARCH_SCORE":"1.0","STATION_LOCATION":"Atlanta, GA"};
//    var station = {};

    broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    broadcastPlay = function() {
        $rootScope.$broadcast('handlePlayBroadcast');
    };

    broadcastStatus = function() {
        $rootScope.$broadcast('handleStatusBroadcast');
    };

    return {
        getNowPlaying: function(station, callback) {
            var url = 'http://www.live365.com/pls/front?handler=playlist&cmd=view&viewType=xml&handle='+station+'&maxEntries=1';
            $http.get('/proxy.php?url='+encodeURIComponent(url)).success(callback);
        },
        prepForBroadcast: function(stn, play) {
            if ((station.STATION_BROADCASTER == stn.STATION_BROADCASTER) && (play === true)) {
                broadcastPlay();
            } else {
                station = stn;
                station.status = 'paused';
                broadcastItem();
                if (play === true) {
                    broadcastPlay();
                }
            }
        },
        setStatusAndBroadcast: function(status) {
            station.status = status;
            broadcastStatus();
        },
        getStationBroadcaster: function () {
            return station.STATION_BROADCASTER;
        },
        getStationStatus: function () {
            return station.status;
        },
        getStationTitle: function () {
            return station.STATION_TITLE;
        }
    };
})

;

