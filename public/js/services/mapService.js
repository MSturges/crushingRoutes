(function() {
  'use strict';

  angular.module('crushingRoutes')
  .service('MapService', MapService)

  MapService.$inject = [
    '$log',
    '$q',
    '$http',
    'PermissionService',
    '$window'
  ];

  function MapService ($log, $q, $http, PermissionService, $window) {

    this.getMarkers = function() {
      var deferred = $q.defer();
      $http.get('/allmarkers')
      .then(function(markers){
        deferred.resolve(markers.data);
      })
      .catch(function(err){
        deferred.reject(err);
      })
      return deferred.promise;
    },

    this.addMarker = function(markerObj){
      var deferred = $q.defer();
      PermissionService.checkTokenValidity()
      .then(function(result){
        if (result) {
          $http.post('/addMarker', {
            markerObj: markerObj,
            user_id: JSON.parse($window.localStorage.getItem('user')).id
          })
          .then(function(success){
            deferred.resolve(success)
          })
        } else {
          deferred.reject(result);
        }
      })
      .catch(function(err) {
        console.log('ERR', err);
        deferred.reject(err);
      })

      return deferred.promise;
    }

    this.gettingShitDone = function() {
      var deferred = $q.defer();
      $http.get('/listClimbing')
      .then(function(success){
        deferred.resolve(success)
      })
      .catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }


    this.grabRoutes = function(area) {
      var deferred = $q.defer();
      $http.post('/grabRoutes', { climbing_area: area } )
      .then(function(success){
        deferred.resolve(success)
      })
      .catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    this.grabRouteReviews = function(route) {
      var deferred = $q.defer();
      $http.post('/grabRouteReviews', { route: route } )
      .then(function(success){
        deferred.resolve(success)
      })
      .catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    this.submitReview = function(formData, routeId) {
      console.log('ROUTE ID', routeId, 'formDATA', formData);
      var deferred = $q.defer();
      PermissionService.checkTokenValidity()
      .then(function(result){
        console.log('result in permission submitReview', result);
        if (result) {
          $http.post('/submitReview', {
            formData: formData,
            routeId: routeId,
            user_id: JSON.parse($window.localStorage.getItem('user')).id
          })
          .then(function (response){
            if (response.data.error) {
              console.log('in reject', response);
              deferred.reject(response.data.error);
            } else {
              deferred.resolve(response);
            }
          })
        }
      })
      .catch(function(err) {
        alert('You must be logged in to submit a review!')
        deferred.reject(err);
      })
      return deferred.promise;
    }

  }
}())
