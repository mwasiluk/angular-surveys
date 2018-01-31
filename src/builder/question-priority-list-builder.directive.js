angular.module('mwFormBuilder').directive('mwQuestionPriorityListBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormQuestionBuilder',
        scope: {
            question: '=',
            readOnly: '=?',
            options: '=?'
        },
        templateUrl: 'mw-question-priority-list-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: ["mwFormUuid", function(mwFormUuid){
            var ctrl = this;
            ctrl.isNewItem = {};

            // Put initialization logic inside `$onInit()`
            // to make sure bindings have been initialized.
            this.$onInit = function() {
                if(!ctrl.question.priorityList){
                    ctrl.question.priorityList = [];
                    ctrl.addNewItem();
                }

                sortByOrderNo(ctrl.question.priorityList);

                ctrl.itemsSortableConfig = {
                    disabled: ctrl.readOnly,
                    ghostClass: "beingDragged",
                    handle: ".drag-handle",
                    onEnd: function(e, ui) {
                        updateOrderNo(ctrl.question.priorityList);
                    }
                };
            };

            ctrl.addNewItem=function(noFocus){

                var item = {
                    id: mwFormUuid.get(),
                    orderNo: ctrl.question.priorityList.length + 1,
                    value: null
                };
                if(!noFocus){
                    ctrl.isNewItem[item.id]=true;
                }

                ctrl.question.priorityList.push(item);
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
                var index =  ctrl.question.priorityList.indexOf(item);
                if(index!=-1){
                    ctrl.question.priorityList.splice(index,1);
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
                this.$onInit();
            }
        }],
        link: function (scope, ele, attrs, formQuestionBuilderCtrl){
            var ctrl = scope.ctrl;
        }
    };
});
