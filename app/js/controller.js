'use strict';

//TODO - remove response variable and console logs.

var musicWidgetControllers = angular.module('musicWidgetControllers', []);

  musicWidgetControllers.controller('ArtistList',['$scope', 'ArtistCollection','Collection', function($scope, ArtistCollection, Collection) {
    var gridItemsLength = 5,
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
        leftIndex       = 0,
        rightIndex      = 4,
        response;

    console.log(Collection);
    console.log('displayed: ' + gridItemsLength);

    $scope.gridLeft  = gridStylesLeft[leftIndex]['path'];
    $scope.gridRight = gridStylesRight[rightIndex]['path'];
    
    function setArtists(artistInfo,init){
      var artistArrayLeft  = artistInfo.slice(0,gridStylesLeft[leftIndex]['val']),
          artistArrayRight = artistInfo.slice(gridStylesLeft[leftIndex]['val']);

      $scope.artistsLeft  = artistArrayLeft;
      $scope.artistsRight = artistArrayRight;

      if (typeof init === 'number') {
        offset += init;
      }
        
    }

    setArtists(Collection,gridItemsLength)


    function getArtistInfo(){
      response = ArtistCollection.query({displayed:gridItemsLength, offset:offset}, setArtists);
      console.log('response: ' + JSON.stringify(response) + ' offset: '+offset+' displayed: '+gridItemsLength); 
    }

    $scope.next = function() {
      console.log('here')
      leftIndex  = Math.floor(Math.random() * 5),
      rightIndex = Math.floor(Math.random() * 5);

      while(leftIndex === rightIndex) {
        leftIndex = Math.floor(Math.random() * 5);
      }

      $scope.gridLeft  = gridStylesLeft[leftIndex]['path'];
      $scope.gridRight = gridStylesRight[rightIndex]['path'];

      gridItemsLength = gridStylesLeft[leftIndex]['val'] + gridStylesRight[rightIndex]['val'];

      getArtistInfo();

      offset += gridItemsLength;
    };

    $scope.prev = function() {
      leftIndex  = Math.floor(Math.random() * 5),
      rightIndex = Math.floor(Math.random() * 5);

      while(leftIndex === rightIndex) {
        leftIndex = Math.floor(Math.random() * 5);
      }

      gridItemsLength = gridStylesLeft[leftIndex]['val'] + gridStylesRight[rightIndex]['val'];

      offset -= gridItemsLength;

      $scope.gridLeft  = gridStylesLeft[leftIndex]['path'];
      $scope.gridRight = gridStylesRight[rightIndex]['path'];

      getArtistInfo();
      
    };  
  }]);