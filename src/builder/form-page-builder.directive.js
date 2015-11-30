
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
            readOnly: '=?',
            options: '=?'
        },
        templateUrl: 'mw-form-page-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($timeout, uuid){
            var ctrl = this;
            ctrl.hoverEdit = false;
            ctrl.formPage.namedPage = !!ctrl.formPage.name;

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
                placeholder: "beingDragged",
                handle: ".inactive",
                //cancel: ".not-draggable",
                connectWith: ".page-element-list",
                stop: function(e, ui) {
                    updateElementsOrderNo();
                }
            };

            ctrl.activeElement = null;

            ctrl.addElement = function(type){
                if(!type){
                    type='question';
                }
                var element = createEmptyElement(type, ctrl.formPage.elements.length + 1);
                ctrl.activeElement=element;
                ctrl.formPage.elements.push(element);
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

            ctrl.addQuestion = function(){
                ctrl.addElement('question');
            };

            ctrl.addImage = function(){
                ctrl.addElement('image');
            };

            ctrl.isElementActive= function(element){
                return ctrl.activeElement==element;
            }

            ctrl.selectElement = function(element){
                ctrl.activeElement=element;
            }

            ctrl.onElementReady = function(){


                $timeout(function(){
                    ctrl.activeElement=null;
                });
            }



            function createEmptyElement(type,orderNo){
                return {
                    id: uuid.get(),
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

            ctrl.onImageSelection = formBuilderCtrl.onImageSelection;
        }
    };
});
