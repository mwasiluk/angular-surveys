'use strict';

angular.module('mwFormBuilder')
    .directive('mwConfirmClick', function($window){
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var msg = attr.wdConfirmClick || "Are you sure?";
                element.bind('click',function (event) {
                    if ( $window.confirm(msg) ) {
                        scope.$apply(attr.confirmedAction);
                    }
                });
            }
        }
    });
