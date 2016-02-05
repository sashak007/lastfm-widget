'use strict';

var musicWidgetControllers = angular.module('musicWidgetControllers', []);

  musicWidgetControllers.controller('ArtistList',['$scope', 'ArtistCollection', function($scope, ArtistCollection) {
    var gridItemsLength,
        offset          = 0,
        gridStylesLeft  = [{'val':1, 'path':'partials/leftGrid/1-grid.html'},
                          {'val':2, 'path':'partials/leftGrid/1x1-grid.html'},
                          {'val':3, 'path':'partials/leftGrid/1x2-grid.html'},
                          {'val':3, 'path':'partials/leftGrid/2x1-grid.html'},
                          {'val':4, 'path':'partials/leftGrid/2x2-grid.html'}],
        gridStylesRight = [{'val':1, 'path':'partials/rightGrid/1-grid.html'},
                          {'val':2, 'path':'partials/rightGrid/1x1-grid.html'},
                          {'val':3, 'path':'partials/rightGrid/1x2-grid.html'},
                          {'val':3, 'path':'partials/rightGrid/2x1-grid.html'},
                          {'val':4, 'path':'partials/rightGrid/2x2-grid.html'}],
        rand            = Math.floor(Math.random() * 5),
        rand1           = Math.floor(Math.random() * 5),
        response;

        while(rand === rand1) {
          rand = Math.floor(Math.random() * 5);
        }

    $scope.gridLeft  = gridStylesLeft[1]['path'];
    $scope.gridRight = gridStylesRight[4]['path'];


    gridItemsLength = gridStylesLeft[1]['val'] + gridStylesRight[4]['val'];

    console.log('displayed: ' + gridItemsLength);
    // function getArtistInfo(){
      response = ArtistCollection.query({displayed:gridItemsLength, offset:offset}, function(artistInfo) {
        console.log('artistInfo: ' + JSON.stringify(artistInfo));
        var artistArrayLeft  = artistInfo.slice(0,gridStylesLeft[1]['val']),
            artistArrayRight = artistInfo.slice(gridStylesLeft[1]['val']);

        $scope.artistsLeft  = artistArrayLeft;
        $scope.artistsRight = artistArrayRight;

        offset += gridItemsLength;

      });
      console.log('response: ' + JSON.stringify(response)); 
    // }

    $scope.next = function() {
      rand  = Math.floor(Math.random() * 5),
      rand1 = Math.floor(Math.random() * 5);

      while(rand === rand1) {
        rand = Math.floor(Math.random() * 5);
      }

      $scope.gridLeft  = gridStylesLeft[1]['path'];
      $scope.gridRight = gridStylesRight[4]['path'];

      gridItemsLength = gridStylesLeft[1]['val'] + gridStylesRight[4]['val'];

      var nextResponse = ArtistCollection.query({displayed:gridItemsLength, offset:offset}, function(artistInfo) {
        console.log('artistInfo: ' + JSON.stringify(artistInfo));
        var artistArrayLeft  = artistInfo.slice(0,gridStylesLeft[1]['val']),
            artistArrayRight = artistInfo.slice(gridStylesLeft[1]['val']);

        $scope.artistsLeft  = artistArrayLeft;
        $scope.artistsRight = artistArrayRight;

        offset += gridItemsLength;

      });

      console.log("next response : "+JSON.stringify(nextResponse));
    };

    $scope.prev = function() {
      rand    = Math.floor(Math.random() * 5),
      rand1   = Math.floor(Math.random() * 5);

      while(rand === rand1) {
        rand = Math.floor(Math.random() * 5);
      }

      gridItemsLength = gridStylesLeft[1]['val'] + gridStylesRight[4]['val'];

      offset -= gridItemsLength;

      $scope.gridLeft  = gridStylesLeft[1]['path'];
      $scope.gridRight = gridStylesRight[4]['path'];

      var prevResponse = ArtistCollection.query({displayed:gridItemsLength, offset:offset}, function(artistInfo) {
        console.log('artistInfo: ' + JSON.stringify(artistInfo));
        var artistArrayLeft  = artistInfo.slice(0,gridStylesLeft[1]['val']),
            artistArrayRight = artistInfo.slice(gridStylesLeft[1]['val']);

        $scope.artistsLeft  = artistArrayLeft;
        $scope.artistsRight = artistArrayRight;

      });

      console.log("next response : "+JSON.stringify(prevResponse));
      
    };  
  }]);