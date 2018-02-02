
angular.module('mwFormBuilder').factory("FormQuestionBuilderId", function(){
    var id = 0;
        return {
            next: function(){
                return ++id;
            }
        }
    })

    .directive('mwFormQuestionBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormPageElementBuilder',
        scope: {
            question: '=',
            formObject: '=',
            onReady: '&',
            isPreview: '=?',
            readOnly: '=?'
        },
        templateUrl: 'mw-form-question-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($timeout,FormQuestionBuilderId, mwFormBuilderOptions){
            var ctrl = this;


            // Put initialization logic inside `$onInit()`
            // to make sure bindings have been initialized.
            ctrl.$onInit = function() {
                ctrl.id = FormQuestionBuilderId.next();
                ctrl.questionTypes = mwFormBuilderOptions.questionTypes;
                ctrl.formSubmitted=false;

                sortAnswersByOrderNo();

                ctrl.offeredAnswersSortableConfig = {
                    disabled: ctrl.readOnly,
                    ghostClass: "beingDragged",
                    handle: ".drag-handle",
                    onEnd: function(e, ui) {
                        updateAnswersOrderNo();
                    }
                };
            };


            function updateAnswersOrderNo() {
                if(ctrl.question.offeredAnswers){
                    for(var i=0; i<ctrl.question.offeredAnswers.length; i++){
                        ctrl.question.offeredAnswers[i].orderNo = i+1;
                    }
                }

            }

            function sortAnswersByOrderNo() {
                if(ctrl.question.offeredAnswers) {
                    ctrl.question.offeredAnswers.sort(function (a, b) {
                        return a.orderNo - b.orderNo;
                    });
                }
            }

            ctrl.save=function(){
                ctrl.formSubmitted=true;
                if(ctrl.form.$valid){
                    ctrl.onReady();
                }

            };



            var questionTypesWithOfferedAnswers = ['radio', 'checkbox', 'select'];

            ctrl.questionTypeChanged = function(){
                if( questionTypesWithOfferedAnswers.indexOf(ctrl.question.type) !== -1){
                    if(!ctrl.question.offeredAnswers){
                        ctrl.question.offeredAnswers=[];
                    }

                }
                if(ctrl.question.type != 'radio'){
                    clearCustomPageFlow();
                    $timeout(function(){
                        ctrl.question.pageFlowModifier=false;
                    });

                }
                if( questionTypesWithOfferedAnswers.indexOf(ctrl.question.type) === -1){
                    delete ctrl.question.offeredAnswers;
                }
                if(ctrl.question.type != 'grid'){
                    delete ctrl.question.grid;
                }

                if(ctrl.question.type != 'priority'){
                    delete ctrl.question.priorityList;
                }


            };

            function clearCustomPageFlow() {

                if(!ctrl.question.offeredAnswers){
                    return;
                }

                ctrl.question.offeredAnswers.forEach(function (answer) {
                    if(ctrl.question.pageFlowModifier){
                        answer.pageFlow = ctrl.possiblePageFlow[0];
                    }else{
                        delete answer.pageFlow;
                    }

                });
            }

            ctrl.pageFlowModifierChanged = function(){
                clearCustomPageFlow();
            };

            // Prior to v1.5, we need to call `$onInit()` manually.
            // (Bindings will always be pre-assigned in these versions.)
            if (angular.version.major === 1 && angular.version.minor < 5) {
                ctrl.$onInit();
            }

        },
        link: function (scope, ele, attrs, formPageElementBuilder){
            var ctrl = scope.ctrl;
            ctrl.possiblePageFlow = formPageElementBuilder.possiblePageFlow;
            ctrl.options = formPageElementBuilder.options;
        }
    };
});
