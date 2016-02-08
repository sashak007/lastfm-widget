'use strict';

//TODO - remove console logs.

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
      numberLoaded    = 0,
      nextBtn         = document.getElementById('nextBtn'),
      prevBtn         = document.getElementById('prevBtn'),
      artistsRemaining,
      prevArtists,
      artistsCount;

  $scope.nextEmpty = false;
  $scope.gridLeft  = gridStylesLeft[leftIndex]['path'];
  $scope.gridRight = gridStylesRight[rightIndex]['path'];
  
  setArtists(Collection,gridItemsLength);

  function setArtists(artistInfo,init){
    var artists           = Object.keys(artistInfo[0]).map(function(objItem) { return artistInfo[0][objItem] }),
        artistArrayLeft   = artists.slice(0,gridStylesLeft[leftIndex]['val']),
        artistArrayRight  = artists.slice(gridStylesLeft[leftIndex]['val']);
    
    artistsCount     = parseInt(artistInfo[1]['COUNT(*)'],10);
    artistsRemaining = artistsCount;
    prevArtists      = artistsCount;

    $scope.artistsLeft  = artistArrayLeft;
    $scope.artistsRight = artistArrayRight;

    if (typeof init === 'number') {
      offset += init;
      prevBtn.setAttribute("disabled", "disabled");
    }
console.log(artistInfo);
  }

  function getArtistInfo(){
    ArtistCollection.query({displayed:gridItemsLength, offset:offset}, setArtists);
  }

  $scope.next = function() {
    artistsRemaining -= offset;

    if (prevBtn.hasAttribute('disabled')){
      prevBtn.removeAttribute('disabled');
    }
    
    leftIndex  = Math.floor(Math.random() * 5);
    rightIndex = Math.floor(Math.random() * 5);

    while(leftIndex === rightIndex) {
      leftIndex = Math.floor(Math.random() * 5);
    }

    gridItemsLength = gridStylesLeft[leftIndex]['val'] + gridStylesRight[rightIndex]['val'];
   
    if (artistsRemaining < gridItemsLength) {
      if (artistsRemaining === 1 || artistsRemaining === 2) {
        $scope.gridLeft  = gridStylesLeft[0]['path'];
        $scope.gridRight = gridStylesRight[0]['path'];

        gridItemsLength = 2;
     
      } else if(artistsRemaining === 3) {
        $scope.gridLeft  = gridStylesLeft[1]['path'];
        $scope.gridRight = gridStylesRight[0]['path'];

        gridItemsLength = 3;
      
      } else {
        $scope.gridLeft  = gridStylesLeft[0]['path'];
        $scope.gridRight = gridStylesRight[2]['path'];

        gridItemsLength = 4;
      }
    } else {
      $scope.gridLeft  = gridStylesLeft[leftIndex]['path'];
      $scope.gridRight = gridStylesRight[rightIndex]['path'];
    }
    
    getArtistInfo();

    offset += gridItemsLength;

    if (artistsRemaining - 4 <= 0) {
      $('div#fin').show();
      nextBtn.setAttribute('disabled', 'disabled');
    } 
  };

  $scope.prev = function() {
    leftIndex  = Math.floor(Math.random() * 5);
    rightIndex = Math.floor(Math.random() * 5);

    while(leftIndex === rightIndex) {
      leftIndex = Math.floor(Math.random() * 5);
    }

    gridItemsLength = gridStylesLeft[leftIndex]['val'] + gridStylesRight[rightIndex]['val'];
    
    if (nextBtn.hasAttribute('disabled')){
      nextBtn.removeAttribute('disabled');
    }

    if (offset <= 4) {
      if (offset === 1 || offset === 2) {
        $scope.gridLeft  = gridStylesLeft[0]['path'];
        $scope.gridRight = gridStylesRight[0]['path'];

        gridItemsLength = 2;
      
      } else if(offset === 3) {
        $scope.gridLeft  = gridStylesLeft[1]['path'];
        $scope.gridRight = gridStylesRight[0]['path'];

        gridItemsLength = 3;
      
      } else {
        $scope.gridLeft  = gridStylesLeft[0]['path'];
        $scope.gridRight = gridStylesRight[2]['path'];

        gridItemsLength = 4;
      }
    } else {
      $scope.gridLeft  = gridStylesLeft[leftIndex]['path'];
      $scope.gridRight = gridStylesRight[rightIndex]['path'];
    }

    if (offset === 0 || offset - gridItemsLength === 0) {
      prevBtn.setAttribute("disabled", "disabled");
    }

    offset -= gridItemsLength;

    getArtistInfo();
  
  }; 

}]);

musicWidgetControllers.directive('elemReady', function($parse) {
  return {
    restrict: 'A',
    link: function( $scope, elem, attrs ) {    
      $(elem).load(function(){
        var width = $(elem).innerWidth(),
            height = $(elem).innerHeight();
        if (width < height) {
          $(elem).addClass('maxWidth');

        } else if (height < width) {
          $(elem).addClass('maxHeight');

        } else {
          $(elem).addClass('maxWidth');
        }
      })
    }
  }
});