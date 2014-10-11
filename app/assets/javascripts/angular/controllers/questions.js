'use strict';

/* Controllers */


app.controller('QuestionsCtrl', ['$scope', '$http', function($scope, $http) {
//  index
  $scope.fetchQuestions = function() {
    $http.get('/questions.json').success(function(data) {
      $scope.questions = data.questions;
      // create created_at_from_now for each question and push it back to object
      angular.forEach($scope.questions, function(obj) {
        obj['created_at_from_now'] = moment(obj.created_at).fromNow();
      });
    });
  };
  $scope.fetchQuestions();
}]).controller('QuestionDetailsCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('/questions/'+ $state.params.id +'.json').success(function(data) {
    $scope.question = data.question;
    $scope.question.created_at_from_now = moment($scope.question.created_at).fromNow();
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
        $scope.fetchQuestions();
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