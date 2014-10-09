'use strict';

/* Controllers */

angular.module('app.controllers', ['ngCookies'])
  .controller('AppCtrl', ['$scope', '$window', '$http',
    function( $scope, $window, $http ) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      $http.get('/session.json').success(function(data) {
        $scope.currentUser = data.currentUser;
        $scope.authenticity_token = data.authenticity_token;
      });

      // config
      $scope.app = {
        name: 'Stack',
        version: '0.0.1',
        settings: {
          hello: true
        }
      };


      $scope.authNetwork = function authNetwork(network) {
        $('.authNetwork').replaceWith('<a href="#" >Знов чекаємо на GitHub ;( <i class="fa fa-cog fa-spin"></i></a>');
        var openUrl = '/auth/' + network;
        window.$windowScope = $scope;
        window.open(openUrl, "_self", "Authenticate Account", "width=500, height=500");
      };

      $scope.logout = function logout() {
        $http.get('/logout').
          success(function(data) {
            $scope.currentUser = null;
          });
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }
  }]);