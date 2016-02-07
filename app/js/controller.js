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
                          {'val':4, 'path':'partials/rightGrid/2x2-grid.html'},
                          {'val':null, 'path':'partials/end.html'}],
        leftIndex       = 0,
        rightIndex      = 4,
        numberLoaded    = 0,
        nextBtn         = document.getElementById('nextBtn'),
        prevBtn         = document.getElementById('nextBtn'),
        artistsRemaining,
        response;

    // console.log(Collection);
    // console.log('displayed: ' + gridItemsLength);

    $scope.nextEmpty = false;

    $scope.gridLeft  = gridStylesLeft[leftIndex]['path'];
    $scope.gridRight = gridStylesRight[rightIndex]['path'];
    
    function setArtists(artistInfo,init){
      var artists           = Object.keys(artistInfo[0]).map(function(objItem) { return artistInfo[0][objItem] }),
          artistArrayLeft   = artists.slice(0,gridStylesLeft[leftIndex]['val']),
          artistArrayRight  = artists.slice(gridStylesLeft[leftIndex]['val']);
      
      artistsRemaining  = parseInt(artistInfo[1]['COUNT(*)'],10);

      $scope.artistsLeft  = artistArrayLeft;
      $scope.artistsRight = artistArrayRight;

      if (typeof init === 'number') {
        offset += init;
      } 
      
      artistsRemaining -= offset;
    }

    setArtists(Collection,gridItemsLength);

    function getArtistInfo(){
      response = ArtistCollection.query({displayed:gridItemsLength, offset:offset}, setArtists);
      console.log('response: ' + JSON.stringify(response) + ' offset: '+offset+' displayed: '+gridItemsLength); 
    }

    $scope.next = function() {
      if (prevBtn.hasAttribute('disabled')){
        prevBtn.removeAttribute('disabled');
      }
      
      console.log('ON NEXT - offset type: '+ typeof offset +' offset value '+offset);
      
      leftIndex  = Math.floor(Math.random() * 5);
      rightIndex = Math.floor(Math.random() * 5);

      while(leftIndex === rightIndex) {
        leftIndex = Math.floor(Math.random() * 5);
      }

      gridItemsLength = gridStylesLeft[leftIndex]['val'] + gridStylesRight[rightIndex]['val'];

      console.log('artistsRemaining : '+artistsRemaining+' vs. gridItemsLength: '+ gridItemsLength+'. offset : '+offset);
     
      if (artistsRemaining < gridItemsLength) {
        if (artistsRemaining === 1) {
          $scope.gridLeft  = gridStylesLeft[0]['path'];
          $scope.gridRight = gridStylesRight[5]['path'];

          gridItemsLength = 1;
        
        } else if(artistsRemaining === 2) {
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

      if (artistsRemaining-4 <= 0) {
        $('div#fin').show();
        nextBtn.setAttribute('disabled', 'disabled');
      } else{
        $('div#fin').hide();
      }
    };

    $scope.prev = function() {
      if (nextBtn.hasAttribute('disabled')){
        nextBtn.removeAttribute('disabled');
      }
      leftIndex  = Math.floor(Math.random() * 5);
      rightIndex = Math.floor(Math.random() * 5);

      while(leftIndex === rightIndex) {
        leftIndex = Math.floor(Math.random() * 5);
      }

      gridItemsLength = gridStylesLeft[leftIndex]['val'] + gridStylesRight[rightIndex]['val'];

      offset -= gridItemsLength;

      console.log('artistsRemaining : '+artistsRemaining+' vs. gridItemsLength: '+ gridItemsLength+'. offset : '+offset);
     
      if (offset === 0) {
        prevBtn = document.getElementById('prevBtn');
        prevBtn.setAttribute("disabled", "disabled");

      } else {
        $scope.gridLeft  = gridStylesLeft[leftIndex]['path'];
        $scope.gridRight = gridStylesRight[rightIndex]['path'];
      }

      $scope.gridLeft  = gridStylesLeft[leftIndex]['path'];
      $scope.gridRight = gridStylesRight[rightIndex]['path'];

      getArtistInfo();   
    };  
  }]);