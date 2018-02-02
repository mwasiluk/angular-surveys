
angular.module('mwFormBuilder').directive('mwQuestionOfferedAnswerListBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormQuestionBuilder',
        scope: {
            question: '=',
            formObject: '=',
            readOnly: '=?',
            options: '=?',
            disableOtherAnswer: '=?'
        },
        templateUrl: 'mw-question-offered-answer-list-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function(FormQuestionBuilderId, mwFormUuid){
            var ctrl = this;

            // Put initialization logic inside `$onInit()`
            // to make sure bindings have been initialized.
            this.$onInit = function() {
                ctrl.config={
                    radio:{},
                    checkbox:{}
                };

                ctrl.isNewAnswer = {};

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

                        var offeredAnswer = ctrl.question.offeredAnswers[i];

                        offeredAnswer.orderNo = i+1;
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

            ctrl.addNewOfferedAnswer=function(){

                var defaultPageFlow = ctrl.possiblePageFlow[0];

                var answer = {
                    id: mwFormUuid.get(),
                    orderNo: ctrl.question.offeredAnswers.length + 1,
                    value: null,
                    pageFlow:defaultPageFlow
                };
                ctrl.isNewAnswer[answer.id]=true;
                ctrl.question.offeredAnswers.push(answer);
            };

            ctrl.removeOfferedAnswer=function(answer){
                var index = ctrl.question.offeredAnswers.indexOf(answer);
                if(index!=-1){
                    ctrl.question.offeredAnswers.splice(index,1);
                }
            };

            ctrl.addCustomAnswer=function(){
                ctrl.question.otherAnswer=true;
            };
            ctrl.removeCustomAnswer=function(){
                ctrl.question.otherAnswer=false;
            };

            ctrl.keyPressedOnInput= function(keyEvent, answer){
                delete ctrl.isNewAnswer[answer.id];
                if (keyEvent.which === 13){
                    keyEvent.preventDefault()
                    ctrl.addNewOfferedAnswer();
                }


            };

            // Prior to v1.5, we need to call `$onInit()` manually.
            // (Bindings will always be pre-assigned in these versions.)
            if (angular.version.major === 1 && angular.version.minor < 5) {
                this.$onInit();
            }
        },
        link: function (scope, ele, attrs, formQuestionBuilderCtrl){
            var ctrl = scope.ctrl;
            ctrl.possiblePageFlow = formQuestionBuilderCtrl.possiblePageFlow;
        }
    };
});
