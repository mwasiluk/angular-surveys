
angular.module('mwFormViewer').factory("FormQuestionId", function(){
    var id = 0;
        return {
            next: function(){
                return ++id;
            }
        }
    })

    .directive('mwFormQuestion', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormViewer',
        scope: {
            question: '=',
            questionResponse: '=',
            readOnly: '=?',
            options: '=?',
            onResponseChanged: '&?'
        },
        templateUrl: 'mw-form-question.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($timeout,FormQuestionId){
            var ctrl = this;
            ctrl.id = FormQuestionId.next();

            if(ctrl.question.type=='radio'){
                if(!ctrl.questionResponse.selectedAnswer){
                    ctrl.questionResponse.selectedAnswer=null;
                }
                if(ctrl.questionResponse.other){
                    ctrl.isOtherAnswer=true;
                }

            }else if(ctrl.question.type=='checkbox'){
                if(ctrl.questionResponse.selectedAnswers && ctrl.questionResponse.selectedAnswers.length){
                    ctrl.selectedAnswer=true;
                }else{
                    ctrl.questionResponse.selectedAnswers=[];
                }
                if(ctrl.questionResponse.other){
                    ctrl.isOtherAnswer=true;
                }


            }else if(ctrl.question.type=='grid'){
                if(!ctrl.question.grid.cellInputType){
                    ctrl.question.grid.cellInputType = "radio";
                }
                //if(ctrl.questionResponse.selectedAnswers){
                //
                //}else{
                //    ctrl.questionResponse.selectedAnswers={};
                //}
            }else if(ctrl.question.type=='division'){

                    ctrl.computeDivisionSum = function(){
                        ctrl.divisionSum=0;
                        ctrl.question.divisionList.forEach(function(item){

                            if(ctrl.questionResponse[item.id]!=0 && !ctrl.questionResponse[item.id]){
                                ctrl.questionResponse[item.id]=null;
                                ctrl.divisionSum+=0;
                            }else{
                                ctrl.divisionSum+=ctrl.questionResponse[item.id];
                            }
                        });
                    };

                ctrl.computeDivisionSum();


            }



            ctrl.isAnswerSelected=false;

            ctrl.selectedAnswerChanged=function(){
                delete ctrl.questionResponse.other;
                ctrl.isOtherAnswer=false;
                ctrl.answerChanged();

            };
            ctrl.otherAnswerRadioChanged= function(){
                console.log('otherAnswerRadioChanged');
                if(ctrl.isOtherAnswer){
                    ctrl.questionResponse.selectedAnswer=null;
                }
                ctrl.answerChanged();
            };

            ctrl.otherAnswerCheckboxChanged= function(){
                if(!ctrl.isOtherAnswer){
                    delete ctrl.questionResponse.other;
                }
                ctrl.selectedAnswer = ctrl.questionResponse.selectedAnswers.length||ctrl.isOtherAnswer ? true:null ;
                ctrl.answerChanged();
            };


            ctrl.toggleSelectedAnswer= function(answer){
                if (ctrl.questionResponse.selectedAnswers.indexOf(answer.id) === -1) {
                    ctrl.questionResponse.selectedAnswers.push(answer.id);
                } else {
                    ctrl.questionResponse.selectedAnswers.splice(ctrl.questionResponse.selectedAnswers.indexOf(answer.id), 1);
                }
                ctrl.selectedAnswer = ctrl.questionResponse.selectedAnswers.length||ctrl.isOtherAnswer ? true:null ;

                ctrl.answerChanged();
            };

            ctrl.answerChanged = function(){
                if(ctrl.onResponseChanged){
                    ctrl.onResponseChanged();
                }
            }

        },
        link: function (scope, ele, attrs, mwFormViewer){
            var ctrl = scope.ctrl;
            ctrl.print =  mwFormViewer.print;
        }
    };
});
