'use strict';

var musicWidgetControllers = angular.module('musicWidgetControllers', []);

	musicWidgetControllers.controller('ArtistList',['$scope', 'ArtistCollection', function($scope, ArtistCollection) {
		var gridItemsLength,
		    gridStyles = [{'val':1, 'path':'partials/1-grid.html'},
											{'val':2, 'path':'partials/1x1-grid.html'},
											{'val':3, 'path':'partials/1x2-grid.html'},
											{'val':3, 'path':'partials/2x1-grid.html'},
											{'val':4, 'path':'partials/2x2-grid.html'}],
				rand       = Math.floor(Math.random() * 4),
				rand1 		 = Math.floor(Math.random() * 4);

				while(rand === rand1) {
					rand = Math.floor(Math.random() * 4);
				}


		$scope.gridLeft  =  gridStyles[rand]['path'];
		$scope.gridRight = gridStyles[rand1]['path'];

		gridItemsLength = gridStyles[rand]['val'] + gridStyles[rand1]['val'];

		console.log('displayed: ' + gridItemsLength);
		var response = ArtistCollection.query({displayed:gridItemsLength}, function(artistInfo) {
			console.log('artistInfo: ' + JSON.stringify(artistInfo));
			for(var x = 0; x < gridItemsLength; x++){
				$scope.artist = artistInfo[x].artist;
				$scope.plays 	= artistInfo[x].playcount;
				$scope.img 		= artistInfo[x].image;
			}
		});
		console.log('response: ' + JSON.stringify(response));		
	}]);