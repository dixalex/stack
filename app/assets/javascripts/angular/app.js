'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
//    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
//    'ui.validate',
    'toaster',
//    'localytics.directives',
//    'pascalprecht.translate',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers'
  ])
    .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
    .config(
    [          '$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
      function ($stateProvider,   $urlRouterProvider,   $controllerProvider,   $compileProvider,   $filterProvider,   $provide) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;

        $urlRouterProvider
          .otherwise('/questions');
        $stateProvider
          .state('app', {
            abstract: true,
            url: '/app',
            templateUrl: '../templates/app.html'
          })
          .state('app.questions', {
            url: '^/questions',
            controller: 'QuestionsCtrl',
            templateUrl: '../templates/questions.html'
          }).state('app.questions.new', {
            controller: 'NewQuestionCtrl',
            url: '/new',
            templateUrl: '../templates/new_question.html',
            parent: 'app.questions'
          }).state('app.questions.details', {
            controller: 'QuestionDetailsCtrl',
            url: '/:id',
            templateUrl: '../templates/question_details.html',
            parent: 'app.questions'
          })
      }
    ]
  );