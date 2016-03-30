
angular.module('mwFormViewer')
    .directive('mwPriorityList', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormQuestion',
        scope: {
            question: '=',
            questionResponse: '=',
            readOnly: '=?',
            options: '=?'
        },
        templateUrl: 'mw-priority-list.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function(){
            var ctrl = this;

            if(!ctrl.questionResponse.priorityList){
                ctrl.questionResponse.priorityList=[];
            }
            ctrl.idToItem = {};


            sortByPriority(ctrl.questionResponse.priorityList);

            ctrl.availableItems=[];
            ctrl.question.priorityList.forEach(function(item){
                ctrl.idToItem[item.id] = item;
                var ordered = ctrl.questionResponse.priorityList.some(function(ordered){
                    return item.id == ordered.id;
                });
                if(!ordered){
                    ctrl.availableItems.push({
                        priority: null,
                        id: item.id
                    });
                }
            });

            ctrl.allItemsOrdered=ctrl.availableItems.length==0 ? true : null;


            function updatePriority(array) {
                if(array){
                    for(var i=0; i<array.length; i++){
                        var item = array[i];
                        item.priority = i+1;
                    }
                }

            }

            function sortByPriority(array) {
                array.sort(function (a, b) {
                    return a.priority - b.priority;
                });
            }

            var baseConfig = {
                disabled: ctrl.readOnly,
                ghostClass: "beingDragged"
//                tolerance: 'pointer',
//                items: 'div',
//                revert: 100

            };

            ctrl.orderedConfig = angular.extend({}, baseConfig, {
                group:{
                    name: 'A',
                    pull: false,
                    put: ['B']
                },
                onEnd: function(e, ui) {
                    updatePriority(ctrl.questionResponse.priorityList);
                }
            });

            ctrl.availableConfig = angular.extend({}, baseConfig, {
                sort:false,
                 group:{
                    name: 'B',
                    pull: ['A'],
                    put: false
                },
                onEnd: function(e, ui) {
                    updatePriority(ctrl.questionResponse.priorityList);
                    ctrl.allItemsOrdered=ctrl.availableItems.length==0 ? true : null;
                }
            });

        },
        link: function (scope, ele, attrs, mwFormQuestion){
            var ctrl = scope.ctrl;
            ctrl.print =  mwFormQuestion.print;
        }
    };
});
