'use strict';

/* App Module */

var musicWidgetApp = angular.module('musicWidgetApp', [
  'ngResource',
  'ngRoute',
  'musicWidgetControllers',
  'artistListService'
]);

musicWidgetApp.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
  $routeProvider.when('/lastfm.html',{
    controller: 'ArtistList',
    templateUrl: 'partials/container.html',
    resolve:{
      Collection:['ArtistCollection',function(ArtistCollection) {
        return ArtistCollection.query({displayed:5, offset:0}).$promise;
      }]
    }
    // - have a service where you have a resolve.
  });

   $locationProvider.html5Mode(true);
}]);