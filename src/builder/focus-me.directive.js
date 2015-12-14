angular.module('mwFormBuilder')
    .directive('wdFocusMe', function($timeout, $parse) {
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
                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    })
    .factory('focus', function($timeout, $window) {
        return function(id) {
            $timeout(function() {
                var element = $window.document.getElementById(id);
                if(element)
                    element.focus();
            });
        };
    });
