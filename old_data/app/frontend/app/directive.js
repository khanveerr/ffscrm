// angular.module('FilterHelper', []).filter('joinBy', function () {
//     return function (input,delimiter) {
//         return (input || []).join(delimiter || ',');
//     };
// });

angular.module('LoaderHelper', []).directive('loading', function () {
    return {
      restrict: 'E',
      replace:true,
      template: '<div class="loading"><img src="img/hourglass.gif" width="80" height="80" />LOADING...</div>',
      link: function (scope, element, attr) {
            scope.$watch('loading', function (val) {
                if (val)
                    $(element).show();
                else
                    $(element).hide();
            });
      }
    }
});

angular.module('StarRatingHelper',[]).directive('starRating', starRating);

angular.module('DynamicModelHelper',[]).directive('dynamicModel', ['$compile', '$parse', function ($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function (scope, elem) {
            var name = $parse(elem.attr('dynamic-model'))(scope);
            elem.removeAttr('dynamic-model');
            elem.attr('ng-model', name);
            $compile(elem)(scope);
        }
    };
}]);

angular.module("CompileDirective", []).directive('dynamicElement', ['$compile', function ($compile) {
    return { 
      restrict: 'E', 
      scope: {
          message: "="
      },
      replace: true,
      link: function(scope, element, attrs) {
          var template = $compile(scope.message)(scope);
          element.replaceWith(template);               
      },
      controller: ['$scope', function($scope) {
         $scope.clickMe = function(){
              alert("hi")
         };
      }]
    }
}]);

function starRating() {
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  }