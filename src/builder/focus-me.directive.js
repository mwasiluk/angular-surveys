angular.module('mwFormBuilder')
    .directive('wdFocusMe', ["$timeout", "$parse", function($timeout, $parse) {
        return {
            link: function(scope, element, attrs) {
                var model = $parse(attrs.wdFocusMe);
                scope.$watch(model, function(value) {
                    if(value === true) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
                element.bind('blur', function() {
                    $timeout(function() {
                        scope.$apply(model.assign(scope, false));
                    });

                });
            }
        };
    }])
    .factory('focus', ["$timeout", "$window", function($timeout, $window) {
        return function(id) {
            $timeout(function() {
                var element = $window.document.getElementById(id);
                if(element)
                    element.focus();
            });
        };
    }]);