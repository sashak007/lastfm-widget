'use strict';

var musicWidgetControllers = angular.module('musicWidgetControllers', []);

	musicWidgetControllers.controller('ArtistList',['$scope', function($scope) {

	}]);

	musicWidgetControllers.controller('ArtistGrid',['$scope', function($scope) {
		var gridStyles = ['partials/1-grid.html',
											'partials/1x1-grid.html',
											'partials/1x2-grid.html',
											'partials/2x1-grid.html',
											'partials/2x2-grid.html'
										 ],
				rand = Math.floor(Math.random() * 4),
				rand1 = Math.floor(Math.random() * 4);

				while(rand === rand1) {
					rand = Math.floor(Math.random() * 4);
				}


		$scope.gridLeft =  gridStyles[rand];
		$scope.gridRight = gridStyles[rand1];
	}]);