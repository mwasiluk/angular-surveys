
angular.module('mwFormBuilder').factory("FormImageBuilderId", function(){
    var id = 0;
        return {
            next: function(){
                return ++id;
            }
        }
    })

    .directive('mwFormImageBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormPageElementBuilder',
        scope: {
            image: '=',
            formObject: '=',
            onReady: '&',
            isPreview: '=?',
            readOnly: '=?',
            onImageSelection: '&'
        },
        templateUrl: 'mw-form-image-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($timeout,FormImageBuilderId, mwFormUuid){
            var ctrl = this;
            ctrl.id = FormImageBuilderId.next();
            ctrl.formSubmitted=false;

            ctrl.save=function(){
                ctrl.formSubmitted=true;
                if(ctrl.form.$valid){
                    ctrl.onReady();
                }
            };

            ctrl.selectImageButtonClicked = function(){
                var resultPromise = ctrl.onImageSelection();
                resultPromise.then(function(imageSrc){
                   ctrl.image.src = imageSrc;

                }).catch(function(){

                });
            };

            ctrl.setAlign = function(align){
                ctrl.image.align = align;
            }


        },
        link: function (scope, ele, attrs, formPageElementBuilder){
            var ctrl = scope.ctrl;
        }
    };
});
