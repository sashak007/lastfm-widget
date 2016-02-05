'use strict';

var artistListService = angular.module('artistListService',[]);

artistListService.factory('ArtistCollection',['$resource', 
  function($resource) {
    return $resource('db-calls.php');
  }]);