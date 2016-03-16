
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
        controller: function(mwFormUuid){
            var ctrl = this;
            ctrl.isNewItem = {};

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


            if(!ctrl.question.priorityList){
                ctrl.question.priorityList = [];
                ctrl.addNewItem();
            }


            sortByOrderNo(ctrl.question.priorityList);

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

            ctrl.itemsSortableConfig = {
                disabled: ctrl.readOnly,
                ghostClass: "beingDragged",
                handle: ".drag-handle",
                onEnd: function(e, ui) {
                    updateOrderNo(ctrl.question.priorityList);
                }
            };

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
        },
        link: function (scope, ele, attrs, formQuestionBuilderCtrl){
            var ctrl = scope.ctrl;
        }
    };
});
