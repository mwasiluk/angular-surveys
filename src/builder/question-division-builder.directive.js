angular.module('mwFormBuilder').directive('mwQuestionDivisionBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormQuestionBuilder',
        scope: {
            question: '=',
            readOnly: '=?',
            options: '=?'
        },
        templateUrl: 'mw-question-division-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: ["mwFormUuid", function(mwFormUuid){
            var ctrl = this;
            // Put initialization logic inside `$onInit()`
            // to make sure bindings have been initialized.
            ctrl.$onInit = function() {
                ctrl.isNewItem = {};
                if(!ctrl.question.divisionList){
                    ctrl.question.divisionList = [];
                    ctrl.addNewItem();
                }
                sortByOrderNo(ctrl.question.divisionList);

                ctrl.itemsSortableConfig = {
                    disabled: ctrl.readOnly,
                    ghostClass: "beingDragged",
                    handle: ".drag-handle",
                    onEnd: function(e, ui) {
                        updateOrderNo(ctrl.question.divisionList);
                    }
                };
            };


            ctrl.addNewItem=function(noFocus){

                var item = {
                    id: mwFormUuid.get(),
                    orderNo: ctrl.question.divisionList.length + 1,
                    value: null
                };
                if(!noFocus){
                    ctrl.isNewItem[item.id]=true;
                }

                ctrl.question.divisionList.push(item);
            };


            function updateOrderNo(array) {
                if(array){
                    for(var i=0; i<array.length; i++){
                        var item = array[i];
                        item.orderNo = i+1;
                    }
                }

            }

            function sortByOrderNo(array) {
                array.sort(function (a, b) {
                   return a.orderNo - b.orderNo;
               });
            }

            ctrl.removeItem=function(item){
                var index =  ctrl.question.divisionList.indexOf(item);
                if(index!=-1){
                    ctrl.question.divisionList.splice(index,1);
                }
            };

            ctrl.keyPressedOnInput= function(keyEvent, item){
                delete ctrl.isNewItem[item.id];
                if (keyEvent.which === 13){
                    keyEvent.preventDefault();
                    ctrl.addNewItem();
                }
            };

            // Prior to v1.5, we need to call `$onInit()` manually.
            // (Bindings will always be pre-assigned in these versions.)
            if (angular.version.major === 1 && angular.version.minor < 5) {
                ctrl.$onInit();
            }
        }],
        link: function (scope, ele, attrs, formQuestionBuilderCtrl){
            var ctrl = scope.ctrl;
        }
    };
});
