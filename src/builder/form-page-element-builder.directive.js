
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
            readOnly: '=?'
        },
        templateUrl: 'mw-form-page-element-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function(mwFormUuid){
            var ctrl = this;
            ctrl.callback = function($event,element){
                $event.preventDefault();
                $event.stopPropagation();
                if (element.callback && typeof element.callback === "function") {
                    element.callback(ctrl.pageElement);
                }
            };
            ctrl.filter = function(button){
                if(!button.showInOpen && ctrl.isActive){
                    return false;
                }
                if(!button.showInPreview && !ctrl.isActive){
                    return false;
                }

                if (button.filter && typeof button.filter === "function") {
                    return button.filter(ctrl.pageElement);
                }
                return true;
            };
            if(ctrl.pageElement.type=='question'){
                if(!ctrl.pageElement.question){
                    ctrl.pageElement.question={
                        id: mwFormUuid.get(),
                        text: null,
                        type:null,
                        required:true
                    };
                }
            }else if(ctrl.pageElement.type=='image'){
                if(!ctrl.pageElement.image){
                    ctrl.pageElement.image={
                        id: mwFormUuid.get(),
                        align: 'left'
                    };
                }

            }else if(ctrl.pageElement.type=='paragraph'){
                if(!ctrl.pageElement.paragraph){
                    ctrl.pageElement.paragraph={
                        id: mwFormUuid.get(),
                        html: ''
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

            ctrl.cloneElement=function($event){
                $event.preventDefault();
                $event.stopPropagation();
                pageBuilderCtrl.cloneElement(ctrl.pageElement);
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

            ctrl.options = pageBuilderCtrl.options;
            ctrl.onImageSelection = pageBuilderCtrl.onImageSelection;
        }
    };
});
