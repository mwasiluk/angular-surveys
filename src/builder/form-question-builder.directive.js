
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
            ctrl.id = FormQuestionBuilderId.next();
            ctrl.questionTypes = mwFormBuilderOptions.questionTypes;
            ctrl.formSubmitted=false;
            
            function getRadioQuestions(){
              var result = [];
              ctrl.formObject.pages.forEach(function (page){
                page.elements.filter(function (element){
                  return element.type === 'question' && element.question.type === 'radio';
                }).forEach(function (radioQuestion) {
                  result.push(radioQuestion.question);
                });
              });
              
              return result;
            }                                  
            
            ctrl.toggleVisibleIf = function(){
               ctrl.radioQuestions = getRadioQuestions();
            };

            sortAnswersByOrderNo();
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

            ctrl.offeredAnswersSortableConfig = {
                disabled: ctrl.readOnly,
                ghostClass: "beingDragged",
                handle: ".drag-handle",
                onEnd: function(e, ui) {
                    updateAnswersOrderNo();
                }
            };

            ctrl.questionTypeChanged = function(){
                if( ctrl.question.type == 'radio' || ctrl.question.type == 'checkbox'){
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
                if( ctrl.question.type != 'radio' && ctrl.question.type != 'checkbox'){
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

        },
        link: function (scope, ele, attrs, formPageElementBuilder){
            var ctrl = scope.ctrl;
            ctrl.possiblePageFlow = formPageElementBuilder.possiblePageFlow;
            ctrl.options = formPageElementBuilder.options;
        }
    };
});
