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
}]).controller('QuestionDetailsCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('/questions/'+ $state.params.id +'.json').success(function(data) {
    $scope.question = data.question;
    console.log($scope.question);
  });
}]).controller('NewQuestionCtrl', ['$scope', '$http', '$state', 'toaster', function($scope, $http, $state, toaster) {
  // validate current user
  if (!$scope.currentUser) {
    $state.go('app.questions');
    toaster.pop('info', '', 'Треба спочатку увійти до системи :)');
  };

  $scope.credentials = {
  question: {
    title: '',
    body: '' },
  authenticity_token: $scope.authenticity_token
  };
  $scope.createQuestion = function(credentials) {
    $http.post('/questions', credentials).
      success(function(data) {
//        $state.go('/:id', {id: data.question._id});
        $state.go('app.questions.details', {id: data.question._id});
      }).error(function(data) {
        // form errors
        $('.has-error').remove();
        $.each(data.errors, function(index, value) {
          $('#'+index+'-label').append('<div class="has-error"><label class="control-label" for="inputError">'+value+'</label></div>');
        });
      });
  };
}]);