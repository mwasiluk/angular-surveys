
angular.module('mwFormBuilder').directive('mwResponseExpectedAnswerListBuilder', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormResponseBuilder',
        scope: {
            response: '=',
            formObject: '=',
            readOnly: '=?',
            options: '=?'
        },
        templateUrl: 'mw-response-expected-answer-list-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function(FormResponseBuilderId, mwFormUuid){
            var ctrl = this;
            ctrl.config={
                radio:{

                },
                checkbox:{

                }
            };

            ctrl.isNewAnswer = {};

            sortAnswersByOrderNo();
            function updateAnswersOrderNo() {
                if(ctrl.response.responseAnswers){
                    for(var i=0; i<ctrl.response.responseAnswers.length; i++){

                        var responseAnswer = ctrl.response.responseAnswers[i];

                        responseAnswer.orderNo = i+1;
                    }
                }

            }

            function sortAnswersByOrderNo() {
                if(ctrl.response.responseAnswers) {
                    ctrl.response.responseAnswers.sort(function (a, b) {
                        return a.orderNo - b.orderNo;
                    });
                }
            }

            ctrl.responseAnswersSortableConfig = {
                disabled: ctrl.readOnly,
                ghostClass: "beingDragged",
                handle: ".drag-handle",
                onEnd: function(e, ui) {
                    updateAnswersOrderNo();
                }
            };

            ctrl.expected = function (answer) {
              console.log(ctrl.response.responseAnswers);
              for(var i=0; i<ctrl.response.responseAnswers.length; i++){
                delete ctrl.response.responseAnswers[i].expected;
              }
              answer.expected = true;
            };

            ctrl.addNewResponseAnswer=function(){

                var defaultPageFlow = ctrl.possiblePageFlow[0];

                var answer = {
                    id: mwFormUuid.get(),
                    orderNo: ctrl.response.responseAnswers.length + 1,
                    value: null,
                    pageFlow:defaultPageFlow
                };
                ctrl.isNewAnswer[answer.id]=true;
                ctrl.response.responseAnswers.push(answer);
            };

            ctrl.removeResponseAnswer=function(answer){
                var index = ctrl.response.responseAnswers.indexOf(answer);
                if(index!=-1){
                    ctrl.response.responseAnswers.splice(index,1);
                }
            };

            ctrl.addCustomAnswer=function(){
                ctrl.response.otherAnswer=true;
            };
            ctrl.removeCustomAnswer=function(){
                ctrl.response.otherAnswer=false;
            };

            ctrl.keyPressedOnInput= function(keyEvent, answer){
                delete ctrl.isNewAnswer[answer.id];
                if (keyEvent.which === 13){
                    keyEvent.preventDefault();
                    ctrl.addNewResponseAnswer();
                }


            };
        },
        link: function (scope, ele, attrs, formResponseBuilderCtrl){
            var ctrl = scope.ctrl;
            ctrl.possiblePageFlow = formResponseBuilderCtrl.possiblePageFlow;
        }
    };
});
