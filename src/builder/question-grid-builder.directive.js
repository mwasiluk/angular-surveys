
angular.module('mwFormBuilder').directive('mwQuestionGridBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormQuestionBuilder',
        scope: {
            question: '=',
            formObject: '=',
            readOnly: '=?',
            options: '=?'
        },
        templateUrl: 'mw-question-grid-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function(mwFormUuid, MW_GRID_CELL_INPUT_TYPES){
            var ctrl = this;
            ctrl.cellInputTypes = MW_GRID_CELL_INPUT_TYPES;

            ctrl.isNewInput = {};
            ctrl.addNewRow=function(noFocus){

                var row = {
                    id: mwFormUuid.get(),
                    orderNo: ctrl.question.grid.rows.length + 1,
                    label: null
                };
                if(!noFocus){
                    ctrl.isNewInput[row.id]=true;
                }

                ctrl.question.grid.rows.push(row);
            };

            ctrl.addNewCol=function(noFocus){

                var col = {
                    id: mwFormUuid.get(),
                    orderNo: ctrl.question.grid.cols.length + 1,
                    label: null
                };
                if(!noFocus){
                    ctrl.isNewInput[col.id]=true;
                }

                ctrl.question.grid.cols.push(col);
            };


            if(!ctrl.question.grid){

                ctrl.question.grid = {
                    rows:[],
                    cols:[]
                };
                ctrl.addNewRow();
                ctrl.addNewCol(true);
            }

            if(!ctrl.question.grid.cellInputType){
                ctrl.question.grid.cellInputType = ctrl.cellInputTypes[0];
            }



            sortByOrderNo(ctrl.question.grid.rows);
            sortByOrderNo(ctrl.question.grid.cols);
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

            ctrl.rowsSortableConfig = {
                disabled: ctrl.readOnly,
                ghostClass: "beingDragged",
                handle: ".drag-handle",
                onEnd: function(e, ui) {
                    updateOrderNo(ctrl.question.grid.rows);
                }
            };
            ctrl.colsSortableConfig = {
                disabled: ctrl.readOnly,
                ghostClass: "beingDragged",
                handle: ".drag-handle",
                onEnd: function(e, ui) {
                    updateOrderNo(ctrl.question.grid.cols);
                }
            };



            ctrl.removeRow=function(row){
                var index =  ctrl.question.grid.rows.indexOf(row);
                if(index!=-1){
                    ctrl.question.grid.rows.splice(index,1);
                }
            };
            ctrl.removeCol=function(col){
                var index =  ctrl.question.grid.cols.indexOf(col);
                if(index!=-1){
                    ctrl.question.grid.cols.splice(index,1);
                }
            };

            ctrl.keyPressedOnInput= function(keyEvent, input, type){
                delete ctrl.isNewInput[input.id];
                if (keyEvent.which === 13){
                    keyEvent.preventDefault();
                    if(type=='row'){
                        ctrl.addNewRow();
                    }else{
                        ctrl.addNewCol();
                    }

                }


            };
        },
        link: function (scope, ele, attrs, formQuestionBuilderCtrl){
            var ctrl = scope.ctrl;
        }
    };
});
