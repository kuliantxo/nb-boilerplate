angular.module( 'ngBoilerplate', [
    'templates-app',
    'templates-common',
    'ngBoilerplate.home',
    'ngBoilerplate.stations',
    'ngBoilerplate.genres',
    'ngBoilerplate.played',
    'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
    $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if ( angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
        }
    });
})

.controller( 'PlayerCtrl', function PlayerCtrl ( $scope, $location ) {
    var station = 'wava2',
        defaultVolume = 0.8,
        timer = 0,
        simplePlayer = document.getElementById('audio');

    $scope.player = {
        status: 'paused'        // paused, buffering, playing, error
    };

    $scope.clickPlay = function() {
        if (simplePlayer.paused) {
//          simplePlayer.load();
            simplePlayer.src = 'http://www.live365.com/play/'+nowPlayingFactory.getStationBroadcaster();
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
        debugFactory.setPlayerEventsAndBroadcast('on'+e.type);
    }

    bindEvent(simplePlayer, 'error', function(e) {
        logPlayerEvents(e);
        logPlayerEvents(simplePlayer.error);
        $scope.$apply(function () {
            $scope.player.status = 'error';
        });
        nowPlayingFactory.setStatusAndBroadcast('error');

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
            $scope.player.status = 'paused';
        });
        nowPlayingFactory.setStatusAndBroadcast('paused');
    });

    bindEvent(simplePlayer, 'play', function(e) {
        logPlayerEvents(e);
        $scope.$apply(function () {
            $scope.player.status = 'buffering';
        });
        nowPlayingFactory.setStatusAndBroadcast('buffering');
    });

    bindEvent(simplePlayer, 'playing', function(e) {
        logPlayerEvents(e);
        $scope.$apply(function () {
            $scope.player.status = 'playing';
        });
        nowPlayingFactory.setStatusAndBroadcast('playing');
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
        if (nowPlayingFactory.getStationStatus() == 'paused') {
            simplePlayer.src = 'http://www.live365.com/play/'+nowPlayingFactory.getStationBroadcaster();
            simplePlayer.play();
        } else {
            simplePlayer.pause();
        }
    });
})

.controller( 'PlayingCtrl', function PlayingCtrl ( $scope, $location, playingFctr ) {
    var pGress,
        pTosh,
        previous,
        url = 'http://www.live365.com/cgi-bin/directory.cgi?site=xml&access=PUBLIC&rows=1&only=P';

    $scope.nowPlaying = {
        stationName: 'Wava2',
        artist: 'Artist',
        title: 'Title',
        time: 321,
        progress: 0,
        album: 'Album',
        image: '/images/missing.png'
    };

    $http.get('/proxy.php?url='+encodeURIComponent(url)).success(function(data) {
        nowPlayingFactory.prepForBroadcast(data.contents.LIVE365_STATION);
    });

    $scope.formatTrackTime = function (seconds) {
/*
        var s = '';
        if (isNaN(seconds))
            seconds = 0;
        if (seconds >= 60)
            s = parseInt(seconds/60);
        seconds = seconds % 60;
        s += (seconds > 9) ? ":" : ":0";
        s += seconds;
        return s;
*/
    };

    function handlePLSData(station, title) {
        if (pTosh) {
            clearTimeout(pTosh);
        }
        var url = 'http://www.live365.com/pls/front?handler=playlist&cmd=view&viewType=xml&handle='+station+'&maxEntries=1&tm=1348157450841';
        $http.get('/proxy.php?url='+encodeURIComponent(url)).success(function(data) {
            if ((data.contents.PlaylistEntry.Artist != previous) || (data.contents.PlaylistEntry.Artist === '')) {
                if($scope.nowPlaying.artist != 'Artist') {
                    playedService.addPlayed($scope.nowPlaying);
                }
                previous = data.contents.PlaylistEntry.Artist;
                wikiService.setData(data.contents.PlaylistEntry.Artist);

                var image = '/images/missing.png';

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

                // problems updating the image from the model
                document.getElementById('cover').src = image;

                if (pGress) {
                    clearInterval(pGress);
                }
                var playedSoFar = Math.max(data.contents.PlaylistEntry.Seconds - data.contents.Refresh, 0);
                pGress = setInterval(function() {
                    var pVal = Math.round((playedSoFar++ * 100) / data.contents.PlaylistEntry.Seconds);
                    if (pVal > 100) {
                        clearInterval(pGress);
                    } else {
                        document.getElementById('progress').style.width = pVal+'%';
                    }
                },1000);
            } else {
                refresh = 5;
            }

            pTosh = setTimeout(function() {
                handlePLSData(station, title);
            }, (data.contents.Refresh*1000));
        });
    }

    $scope.$on('handleBroadcast', function() {
        handlePLSData(nowPlayingFactory.getStationBroadcaster(), nowPlayingFactory.getStationTitle());
    });
})

.factory('playingFctr', function ($http) {
//    var url = 'http://www.live365.com/cgi-bin/directory.cgi?site=xml&access=PUBLIC&rows=100&only=P';
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

.controller( 'NavCtrl', function NavCtrl ( $scope, $location ) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if ( angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
        }
    });
})

;

