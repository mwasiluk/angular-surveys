
angular.module('mwFormBuilder').directive('mwFormPageElementBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormPageBuilder',
        scope: {
            pageElement: '=',
            formObject: '=',
            isActive: '=',
            isFirst: '=',
            isLast: '=',
            onReady: '&',
            readOnly: '=?',
            options: '=?'
        },
        templateUrl: 'mw-form-page-element-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function(uuid){
            var ctrl = this;

            if(ctrl.pageElement.type=='question'){
                if(!ctrl.pageElement.question){
                    ctrl.pageElement.question={
                        id: uuid.get(),
                        text: null,
                        type:null,
                        required:true
                    };
                }
            }else if(ctrl.pageElement.type=='image'){
                if(!ctrl.pageElement.image){
                    ctrl.pageElement.image={
                        id: uuid.get(),
                        align: 'left'
                    };
                }

            }




        },
        link: function (scope, ele, attrs, pageBuilderCtrl){
            var ctrl = scope.ctrl;
            ctrl.possiblePageFlow = pageBuilderCtrl.possiblePageFlow;

            ctrl.hoverIn = function(){
                ctrl.isHovered = true;
            };

            ctrl.hoverOut = function(){
                ctrl.isHovered = false;
            };

            ctrl.editElement=function(){
                pageBuilderCtrl.selectElement(ctrl.pageElement);
            };

            ctrl.removeElement=function(){
                pageBuilderCtrl.removeElement(ctrl.pageElement);
            };

            ctrl.moveDown= function(){
                pageBuilderCtrl.moveDownElement(ctrl.pageElement);
            };
            ctrl.moveUp= function(){
                pageBuilderCtrl.moveUpElement(ctrl.pageElement);
            };


            ctrl.onImageSelection = pageBuilderCtrl.onImageSelection;
        }
    };
});
