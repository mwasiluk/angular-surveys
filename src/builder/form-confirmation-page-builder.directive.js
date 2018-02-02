angular.module('mwFormBuilder').directive('mwFormConfirmationPageBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        scope: {
            formObject: '=',
            readOnly: '=?'
        },
        templateUrl: 'mw-form-confirmation-page-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($timeout){
            var ctrl = this;
            ctrl.hoverEdit = false;


            ctrl.hoverIn = function(){
                ctrl.hoverEdit = true;
            };

            ctrl.hoverOut = function(){
                ctrl.hoverEdit = false;
            };

        },
        link: function (scope, ele, attrs){

        }
    };
});
