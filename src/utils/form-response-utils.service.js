angular.module('mwFormUtils.responseUtils', [])
    .factory('mwFormResponseUtils', function  mwFormResponseMergerFactory() {

        var service = {};
        service.$getObjectByIdMap = function (objectList, mappingFn) {
            var objectById = {};
            objectList.forEach(function (obj) {
                var val = obj;
                if(mappingFn){
                    val = mappingFn(obj);
                }
                objectById[obj.id] = val;
            });
            return objectById;
        };
        service.$getOfferedAnswerByIdMap = function (question) {
            return service.$getObjectByIdMap(question.offeredAnswers, function(offeredAnswer){
                return {
                    id: offeredAnswer.id,
                    value: offeredAnswer.value
                };
            });
        };

        service.$extractResponseForRadioOrCheckboxQuestion= function(question, questionResponse) {
            var offeredAnswerById = service.$getOfferedAnswerByIdMap(question);
            var result ={};
            if (questionResponse.selectedAnswers) {
                result.selectedAnswers = [];
                questionResponse.selectedAnswers.forEach(function (answerId) {
                    result.selectedAnswers.push(offeredAnswerById[answerId]);
                })
            } else if (questionResponse.selectedAnswer) {
                result.selectedAnswer = offeredAnswerById[questionResponse.selectedAnswer];
            }
            if (questionResponse.other) {
                result.other = questionResponse.other;
            }
            return result;
        };

        service.$extractResponseForPriorityQuestion= function(question, questionResponse) {
            var result =[];
            var itemById = service.$getObjectByIdMap(question.priorityList);
            questionResponse.priorityList.forEach(function(i){
                var item = itemById[i.id];
                result.push({
                    id: item.id,
                    value: item.value
                });
            });
            return result;
        };

        service.$extractResponseForDivisionQuestion= function(question, questionResponse) {
            var result =[];
            var itemById = service.$getObjectByIdMap(question.divisionList);
            Object.getOwnPropertyNames(questionResponse).forEach(function(itemId){
                var value = questionResponse[itemId];
                var item = itemById[itemId];
                result.push({
                    id: item.id,
                    label: item.value,
                    value: value
                });
            });
            return result;
        };

        service.$extractResponseForGridQuestion= function(question, questionResponse) {
            var result =[];
            var colById = service.$getObjectByIdMap(question.grid.cols);
            question.grid.rows.forEach(function(row){
                var selectedColId = questionResponse[row.id];
                if(!selectedColId){
                    return;
                }
                var selectedCol = colById[selectedColId];
                var rowResponse= {
                    row:{
                        id: row.id,
                        label: row.label
                    },
                    col: {
                        id: selectedCol.id,
                        label: selectedCol.label
                    }
                };

                result.push(rowResponse);
            });
            return result;
        };

        service.extractResponse = function(question, questionResponse) {
            if(question.type=='text' || question.type=='textarea'){
                return  questionResponse.answer;
            }
            if(question.type=='radio' || question.type=='checkbox'){
                return service.$extractResponseForRadioOrCheckboxQuestion(question, questionResponse);
            }
            if(question.type=='grid'){
                return service.$extractResponseForGridQuestion(question, questionResponse);
            }
            if(question.type=='priority'){
                return service.$extractResponseForPriorityQuestion(question, questionResponse);
            }
            if(question.type=='division'){
                return service.$extractResponseForDivisionQuestion(question, questionResponse);
            }
            return null;
        };

        service.mergeFormWithResponse = function(formData, responseData){
            var result = {};
            angular.copy(formData, result);

            result.pages.forEach(function (page){
                page.elements.forEach(function (element){
                    var question = element.question;
                    if(!question){
                        return;
                    }

                    var questionResponse = responseData[question.id];
                    if(!questionResponse){
                        return;
                    }
                    question.response = service.extractResponse(question, questionResponse);
                });

            });

            return result;
        };

        service.getQuestionWithResponseList = function(formData, responseData){
            var result = [];
            formData.pages.forEach(function (page){
                page.elements.forEach(function (element){

                    if(!element.question){
                        return;
                    }
                    var question = {};
                    angular.copy(element.question, question);
                    result.push(question);
                    var questionResponse = responseData[question.id];
                    if(!questionResponse){
                        return;
                    }
                    question.response = service.extractResponse(question, questionResponse);

                });

            });
            return result;
        };

        return service;
    });
