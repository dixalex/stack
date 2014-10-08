'use strict';

/* Controllers */


app.controller('QuestionsCtrl', ['$scope', '$http', function($scope, $http) {
//  index
  $scope.fetchQuestions = function() {
    $http.get('/questions.json').success(function(data) {
      $scope.questions = data.questions;
    });
  };
  $scope.fetchQuestions();
}]).controller('QuestionsDetailsCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('/questions/'+ $state.params.id +'.json').success(function(data) {
    $scope.question = data.question;
    console.log($scope.question);
  });
}]);