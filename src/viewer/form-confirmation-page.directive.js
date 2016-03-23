
angular.module('mwFormViewer')
    .directive('mwFormConfirmationPage', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormViewer',
        scope: {
            submitStatus: '=',
            confirmationMessage: '=',
            readOnly: '=?'
        },
        templateUrl: 'mw-form-confirmation-page.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function(){
            var ctrl = this;


        },
        link: function (scope, ele, attrs, mwFormViewer){
            var ctrl = scope.ctrl;
            ctrl.print =  mwFormViewer.print;
        }
    };
});
