
angular.module('mwFormBuilder').directive('mwFormPageBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormBuilder',
        scope: {
            formPage: '=',
            formObject: '=',
            isFirst: '=',
            isLast: '=',
            readOnly: '=?'
        },
        templateUrl: 'mw-form-page-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($timeout, mwFormUuid, mwFormClone, mwFormBuilderOptions){
            var ctrl = this;
            ctrl.hoverEdit = false;
            ctrl.formPage.namedPage = !!ctrl.formPage.name;
            ctrl.isFolded = false;

            ctrl.unfold = function(){
                ctrl.isFolded = false;
            };
            ctrl.fold = function(){
                ctrl.isFolded = true;
            };

            sortElementsByOrderNo();
            function updateElementsOrderNo() {
                for(var i=0; i<ctrl.formPage.elements.length; i++){
                    ctrl.formPage.elements[i].orderNo = i+1;
                }
            }


            function sortElementsByOrderNo() {
                ctrl.formPage.elements.sort(function(a,b){
                    return a.orderNo - b.orderNo;
                });
            }

            ctrl.sortableConfig = {
                disabled: ctrl.readOnly,
                ghostClass: "beingDragged",
                group: "survey",
                handle: ".inactive",
                //cancel: ".not-draggable",
                chosenClass: ".page-element-list",
                onEnd: function(e, ui) {
                    updateElementsOrderNo();
                }
            };

            ctrl.activeElement = null;

            ctrl.addElement = function(type){
                if(!type){

                    type=mwFormBuilderOptions.elementTypes[0];
                }
                var element = createEmptyElement(type, ctrl.formPage.elements.length + 1);
                ctrl.activeElement=element;
                ctrl.formPage.elements.push(element);
            };

            ctrl.cloneElement = function(pageElement, setActive){
                var index = ctrl.formPage.elements.indexOf(pageElement);
                var element = mwFormClone.cloneElement(pageElement);
                if(setActive){
                    ctrl.activeElement=element;
                }
                ctrl.formPage.elements.splice(index,0, element);

            };

            ctrl.removeElement = function(pageElement){
                var index = ctrl.formPage.elements.indexOf(pageElement);
                ctrl.formPage.elements.splice(index,1);
            };

            ctrl.moveDownElement= function(pageElement){
                var fromIndex = ctrl.formPage.elements.indexOf(pageElement);
                var toIndex=fromIndex+1;
                if(toIndex<ctrl.formPage.elements.length){
                    arrayMove(ctrl.formPage.elements, fromIndex, toIndex);
                }
                updateElementsOrderNo();
            };

            ctrl.moveUpElement= function(pageElement){
                var fromIndex = ctrl.formPage.elements.indexOf(pageElement);
                var toIndex=fromIndex-1;
                if(toIndex>=0){
                    arrayMove(ctrl.formPage.elements, fromIndex, toIndex);
                }
                updateElementsOrderNo();
            };

            ctrl.isElementTypeEnabled = function(elementType){
                return mwFormBuilderOptions.elementTypes.indexOf(elementType) !== -1;
            };

            ctrl.addQuestion = function(){
                ctrl.addElement('question');
            };

            ctrl.addImage = function(){
                ctrl.addElement('image');
            };

            ctrl.addParagraph= function(){
                ctrl.addElement('paragraph');
            };

            ctrl.isElementActive= function(element){
                return ctrl.activeElement==element;
            };

            ctrl.selectElement = function(element){
                ctrl.activeElement=element;
            };

            ctrl.onElementReady = function(){
                $timeout(function(){
                    ctrl.activeElement=null;
                });
            };

            function createEmptyElement(type,orderNo){
                return {
                    id: mwFormUuid.get(),
                    orderNo: orderNo,
                    type: type
                };
            }

            function arrayMove(arr, fromIndex, toIndex) {
                var element = arr[fromIndex];
                arr.splice(fromIndex, 1);
                arr.splice(toIndex, 0, element);
            }

            ctrl.hoverIn = function(){
                ctrl.hoverEdit = true;
            };

            ctrl.hoverOut = function(){
                ctrl.hoverEdit = false;
            };


            ctrl.updateElementsOrderNo = updateElementsOrderNo;

        },
        link: function (scope, ele, attrs, formBuilderCtrl){
            var ctrl = scope.ctrl;
            ctrl.possiblePageFlow = formBuilderCtrl.possiblePageFlow;
            ctrl.moveDown= function(){

                formBuilderCtrl.moveDownPage(ctrl.formPage);
            };

            ctrl.moveUp= function(){
                formBuilderCtrl.moveUpPage(ctrl.formPage);
            };

            ctrl.removePage=function(){
                formBuilderCtrl.removePage(ctrl.formPage);
            };

            ctrl.addPage=function(){
                formBuilderCtrl.addPageAfter(ctrl.formPage);
            };

            scope.$watch('ctrl.formPage.elements.length', function(newValue, oldValue){
                if(newValue!=oldValue){
                    ctrl.updateElementsOrderNo();
                }
            });
            ctrl.options = formBuilderCtrl.options;
            ctrl.onImageSelection = formBuilderCtrl.onImageSelection;
        }
    };
});
