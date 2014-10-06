'use strict';

/* Directives */
// All the directives rely on jQuery.

angular.module('app.directives', ['ui.load'])
  .directive('uiShift', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, el, attr) {
        // get the $prev or $parent of this el
        var _el = $(el),
            _window = $(window),
            prev = _el.prev(),
            parent,
            width = _window.width()
            ;

        !prev.length && (parent = _el.parent());
        
        function sm(){
          $timeout(function () {
            var method = attr.uiShift;
            var target = attr.target;
            _el.hasClass('in') || _el[method](target).addClass('in');
          });
        }
        
        function md(){
          parent && parent['prepend'](el);
          !parent && _el['insertAfter'](prev);
          _el.removeClass('in');
        }

        (width < 768 && sm()) || md();

        _window.resize(function() {
          if(width !== _window.width()){
            $timeout(function(){
              (_window.width() < 768 && sm()) || md();
              width = _window.width();
            });
          }
        });
      }
    };
  }])
  .directive('uiToggleClass', ['$timeout', '$document', function($timeout, $document) {
    return {
      restrict: 'AC',
      replace: true,
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          e.preventDefault();
          var classes = attr.uiToggleClass.split(','),
              targets = (attr.target && attr.target.split(',')) || Array(el),
              key = 0;
          angular.forEach(classes, function( _class ) {
            var target = targets[(targets.length && key)];            
            ( _class.indexOf( '*' ) !== -1 ) && magic(_class, target);
            $( target ).toggleClass(_class);
            key ++;
          });
          $(el).toggleClass('active');

          function magic(_class, target){
            var patt = new RegExp( '\\s' + 
                _class.
                  replace( /\*/g, '[A-Za-z0-9-_]+' ).
                  split( ' ' ).
                  join( '\\s|\\s' ) + 
                '\\s', 'g' );
            var cn = ' ' + $(target)[0].className + ' ';
            while ( patt.test( cn ) ) {
              cn = cn.replace( patt, ' ' );
            }
            $(target)[0].className = $.trim( cn );
          }
        });
      }
    };
  }])
  .directive('uiNav', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        var _window = $(window), 
        _mb = 768, 
        wrap = $('.app-aside'), 
        next, 
        backdrop = '.dropdown-backdrop';
        // unfolded
        el.on('click', 'a', function(e) {
          next && next.trigger('mouseleave.nav');
          var _this = $(this);
          _this.parent().siblings( ".active" ).toggleClass('active');
          _this.next().is('ul') &&  _this.parent().toggleClass('active') &&  e.preventDefault();
          // mobile
          _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.app-aside').removeClass('show off-screen') );
        });

        // folded & fixed
        el.on('mouseenter', 'a', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
          if ( !$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb ) || $('.app-aside-dock').length) return;
          var _this = $(e.target)
          , top
          , w_h = $(window).height()
          , offset = 50
          , min = 150;

          !_this.is('a') && (_this = _this.closest('a'));
          if( _this.next().is('ul') ){
             next = _this.next();
          }else{
            return;
          }
         
          _this.parent().addClass('active');
          top = _this.parent().position().top + offset;
          next.css('top', top);
          if( top + next.height() > w_h ){
            next.css('bottom', 0);
          }
          if(top + min > w_h){
            next.css('bottom', w_h - top - offset).css('top', 'auto');
          }
          next.appendTo(wrap);

          next.on('mouseleave.nav', function(e){
            $(backdrop).remove();
            next.appendTo(_this.parent());
            next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
            _this.parent().removeClass('active');
          });

          $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next){
            next && next.trigger('mouseleave.nav');
          });

        });

        wrap.on('mouseleave', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
        });
      }
    };
  }])
  .directive('uiScroll', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return {
      restrict: 'AC',
      replace: true,
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          $location.hash(attr.uiScroll);
          $anchorScroll();
        });
      }
    };
  }])
  .directive('uiFullscreen', ['uiLoad', function(uiLoad) {
    return {
      restrict: 'AC',
      template:'<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
      link: function(scope, el, attr) {
        el.addClass('hide');
          if (screenfull.enabled) {
            el.removeClass('hide');
          }
          el.on('click', function(){
            var target;
            attr.target && ( target = $(attr.target)[0] );
            el.toggleClass('active');
            screenfull.toggle(target);
          });
      }
    };
  }])
  .directive('uiButterbar', ['$rootScope', '$location', '$anchorScroll', function($rootScope, $location, $anchorScroll) {
     return {
      restrict: 'AC',
      template:'<span class="bar"></span>',
      link: function(scope, el, attrs) {        
        el.addClass('butterbar hide');        
        scope.$on('$stateChangeStart', function(event) {
          $location.hash('app');
          $anchorScroll();
          el.removeClass('hide').addClass('active');
        });
        scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState ) {
          event.targetScope.$watch('$viewContentLoaded', function(){
            el.addClass('hide').removeClass('active');
          })          
        });
      }
     };
  }])

  .directive('editInPlace', function () {
    return {
      restrict: 'E',
      scope: {
        value: '='
      },
      templateUrl: function(element,attrs) {
        if (attrs.textArea == '') {
          return '../templates/blocks/editablearea.html'
        } else {
          return '../templates/blocks/editableinput.html'
        }
      },
      link: function ($scope, element, attrs) {
        var inputElement = angular.element(element.children()[1]);
        element.addClass('edit-in-place');
        $scope.editing = false;
        $scope.edit = function () {
          $scope.editing = true;
          element.addClass('active');
          inputElement[0].focus();
        };
        inputElement.on('blur', function () {
          $scope.editing = false;
          element.removeClass('active');
        });
        $scope.endEdit = function() {
          element.removeClass('active');
        };
      }
    };
  })

  .directive('focusOn', function() {
    return function(scope, elem, attr) {
      $(elem).children('input')[0].focus();
    };
  })

  .directive('datepickerLocaldate', ['$parse', function ($parse) {
    var directive = {
      restrict: 'A',
      require: ['ngModel'],
      link: link
    };
    return directive;

    function link(scope, element, attr, ctrls) {
      var ngModelController = ctrls[0];

      ngModelController.$parsers.push(function (viewValue) {
        if (viewValue) {
          viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
          return viewValue.toISOString().substring(0, 10);
        } else {
          return ''
        }

      });

      ngModelController.$formatters.push(function (modelValue) {
        if (!modelValue) {
          return undefined;
        }
        var dt = new Date(modelValue);
        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
        return dt;
      });
    }
  }])

  .directive('focus', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watch(attrs.focus, function (newValue) {
          if (newValue) {
            element[0].focus();
          }
        });
        element.bind("blur", function () {
          $timeout(function () {
            scope.$apply(attrs.focus + "=false");
          }, 0);
        });
        element.bind("focus", function () {
          $timeout(function () {
            scope.$apply(attrs.focus + "=true");
          }, 0);
        })
      }
    }
  }])
;