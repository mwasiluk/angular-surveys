angular.module('mwFormUtils.responseUtils', [])
    .factory('mwFormResponseUtils', function mwFormResponseMergerFactory() {

        var service = {};

        //Question types whose response can be extracted with the .answer property. 
        var questionTypesWithDefaultAnswer = [
            'text',
            'textarea',
            'number',
            'date',
            'time',
            'email',
            'range',
            'url'
        ];

        service.$getObjectByIdMap = function (objectList, mappingFn) {
            var objectById = {};
            if (!objectList) {
                return objectById;
            }
            objectList.forEach(function (obj) {
                var val = obj;
                if (mappingFn) {
                    val = mappingFn(obj);
                }
                objectById[obj.id] = val;
            });
            return objectById;
        };
        service.$getOfferedAnswerByIdMap = function (question) {
            return service.$getObjectByIdMap(question.offeredAnswers, function (offeredAnswer) {
                return {
                    id: offeredAnswer.id,
                    value: offeredAnswer.value
                };
            });
        };

        service.$extractResponseForQuestionWithOfferedAnswers = function (question, questionResponse) {
            var offeredAnswerById = service.$getOfferedAnswerByIdMap(question);
            var result = {};
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

        service.$extractResponseForPriorityQuestion = function (question, questionResponse) {
            var result = [];
            if (!questionResponse.priorityList) {
                return result;
            }
            var itemById = service.$getObjectByIdMap(question.priorityList);
            questionResponse.priorityList.forEach(function (i) {
                var item = itemById[i.id];
                result.push({
                    id: item.id,
                    value: item.value,
                    priority: i.priority
                });
            });
            return result;
        };

        service.$extractResponseForDivisionQuestion = function (question, questionResponse) {
            var result = [];
            var itemById = service.$getObjectByIdMap(question.divisionList);
            Object.getOwnPropertyNames(questionResponse).forEach(function (itemId) {
                var value = questionResponse[itemId];
                var item = itemById[itemId];
                if (!item) {
                    return;
                }
                result.push({
                    id: item.id,
                    label: item.value,
                    value: value
                });
            });
            return result;
        };

        service.$extractResponseForGridQuestion = function (question, questionResponse) {
            var result = [];
            if (!question.grid || !question.grid.rows) {
                return result;
            }
            var colById = service.$getObjectByIdMap(question.grid.cols);
            question.grid.rows.forEach(function (row) {
                var selectedColId = questionResponse[row.id];
                var selectedCol = null;
                if (selectedColId) {
                    selectedCol = colById[selectedColId];
                }

                var rowResponse = {
                    row: {
                        id: row.id,
                        label: row.label
                    },
                    col: null
                };

                if (selectedCol) {
                    rowResponse.col = {
                        id: selectedCol.id,
                        label: selectedCol.label
                    }
                }
                result.push(rowResponse);
            });
            return result;
        };

        //Return the response data for the provided question. 
        service.extractResponse = function (question, questionResponse) {
            if (questionTypesWithDefaultAnswer.indexOf(question.type) !== -1) {
                return questionResponse.answer;
            } else {
                if (question.type == 'radio' || question.type == 'checkbox' || question.type == 'select') {
                    return service.$extractResponseForQuestionWithOfferedAnswers(question, questionResponse);
                }
                if (question.type == 'grid') {
                    return service.$extractResponseForGridQuestion(question, questionResponse);
                }
                if (question.type == 'priority') {
                    return service.$extractResponseForPriorityQuestion(question, questionResponse);
                }
                if (question.type == 'division') {
                    return service.$extractResponseForDivisionQuestion(question, questionResponse);
                }
            }

            return null;
        };

        service.mergeFormWithResponse = function (formData, responseData) {
            var result = {};
            angular.copy(formData, result);

            result.pages.forEach(function (page) {
                page.elements.forEach(function (element) {
                    var question = element.question;
                    if (!question) {
                        return;
                    }

                    var questionResponse = responseData[question.id];
                    if (!questionResponse) {
                        return;
                    }
                    question.response = service.extractResponse(question, questionResponse);
                });

            });

            return result;
        };

        //Returns an array of all of the questions in the form. 
        service.getQuestionList = function (formData, copy) {
            var result = [];
            formData.pages.forEach(function (page) {
                page.elements.forEach(function (element) {

                    if (!element.question) {
                        return;
                    }
                    var question = element.question;
                    if (copy) {
                        question = {};
                        angular.copy(element.question, question);
                    }
                    result.push(question);
                });

            });
            return result;
        };

        //For each question, attempt to extract the response (if any), then return an array of question objects with that response appened. 
        service.getQuestionWithResponseList = function (formData, responseData) {
            var result = [];
            service.getQuestionList(formData, true).forEach(function (question) {
                var questionResponse = responseData[question.id];
                if (questionResponse) {
                    question.response = service.extractResponse(question, questionResponse);
                } else {
                    question.response = null;
                }
                result.push(question);
            });
            return result;
        };

        //Returns a formatted string with an optional question number and the text of the question. 
        service.$$getHeader = function (number, questionText, subQuestionNumber, subQuestionText, withQuestionNumber) {
            var result = '';

            if (withQuestionNumber) {
                if (number || number === 0) {
                    result += number + '.';
                }

                if (subQuestionNumber || subQuestionNumber === 0) {
                    result += subQuestionNumber + '.';
                }
                if (result.length) {
                    result += ' ';
                }
            }


            result += questionText;

            if (subQuestionText) {
                result += ' [' + subQuestionText + ']';
            }

            return result;
        };

        //Return an array which contains the text of each question. 
        service.getResponseSheetHeaders = function (formData, withQuestionNumbers) {

            //Questions which require additional processing (for example sub elements)
            var specialCaseQuestions = ['grid', 'priority', 'division'];

            var result = [];

            var questionNumber = 0;
            service.getQuestionList(formData).forEach(function (question) {

                questionNumber++;
                var subIndex = 1;

                if (specialCaseQuestions.indexOf(question.type) === -1) {
                    result.push(service.$$getHeader(questionNumber, question.text, null, null, withQuestionNumbers));
                } else {
                    if (question.type == 'grid') {
                        if (!question.grid) {
                            return;
                        }
                        question.grid.rows.forEach(function (row) {
                            result.push(service.$$getHeader(questionNumber, question.text, subIndex, row.label, withQuestionNumbers));
                            subIndex++;
                        });
                    }
                    else if (question.type == 'priority') {
                        if (!question.priorityList) {
                            return;
                        }
                        question.priorityList.forEach(function (item) {
                            result.push(service.$$getHeader(questionNumber, question.text, subIndex, item.value, withQuestionNumbers));
                            subIndex++;
                        });
                    }
                    else if (question.type == 'division') {
                        if (!question.divisionList) {
                            return;
                        }
                        question.divisionList.forEach(function (item) {
                            result.push(service.$$getHeader(questionNumber, question.text, subIndex, item.value, withQuestionNumbers));
                            subIndex++;
                        });
                    }
                }
            });
            return result;
        };

        //Get the answers for each question and return an arracy which contains the answer values. 
        service.getResponseSheetRow = function (formData, responseData) {
            var answerDelimiter = '; ';
            var result = [];
            if (!responseData) {
                return result;
            }
            var questions = service.getQuestionWithResponseList(formData, responseData);
            var colIndex = 0;

            var questionsWithSpecialFormatting = [
                "radio",
                "checkbox",
                "select",
                "grid",
                "priority",
                "division"
            ];

            for (var i = 0; i < questions.length; i++) {
                var question = questions[i];
                var response = question.response;

                if (questionsWithSpecialFormatting.indexOf(question.type) !== -1) {
                    if (question.type == 'radio' || question.type == 'select') {
                        if (!response) {
                            result.push("");
                            continue;
                        }
                        var cellVal = "";
                        if (response.selectedAnswer) {
                            cellVal = response.selectedAnswer.value;
                        }

                        if (response.other) {
                            if (cellVal) {
                                cellVal += answerDelimiter
                            }
                            cellVal += response.other;
                        }
                        result.push(cellVal);
                    }
                    else if (question.type == 'checkbox') {
                        if (!response || !response.selectedAnswers) {
                            result.push("");
                            continue;
                        }
                        var cellVal = "";
                        response.selectedAnswers.forEach(function (selectedAnswer) {
                            if (cellVal) {
                                cellVal += answerDelimiter;
                            }
                            cellVal += selectedAnswer.value;

                        });
                        if (response.other) {
                            if (cellVal) {
                                cellVal += answerDelimiter
                            }
                            cellVal += response.other;
                        }
                        result.push(cellVal);
                    }
                    else if (question.type == 'grid') {
                        if (!question.grid) {
                            continue;
                        }
                        if (!response) {
                            question.grid.rows.forEach(function () { result.push("") });
                            continue;
                        }
                        response.forEach(function (entry) {
                            result.push(entry.col ? entry.col.label : "");

                        });
                    }
                    else if (question.type == 'priority') {
                        if (!question.priorityList) {
                            continue;
                        }
                        var orderedItemById = service.$getObjectByIdMap(response);
                        question.priorityList.forEach(function (item) {
                            var orderedItem = orderedItemById[item.id];
                            if (orderedItem) {
                                result.push(orderedItem.priority);
                            } else {
                                result.push("");
                            }

                        });
                    }
                    else if (question.type == 'division') {
                        if (!question.divisionList) {
                            continue;
                        }
                        var assignedItemById = service.$getObjectByIdMap(response);
                        question.divisionList.forEach(function (item) {
                            var assignedItem = assignedItemById[item.id];
                            if (assignedItem) {
                                result.push(assignedItem.value);
                            } else {
                                result.push("");
                            }

                        });
                    }
                } else {
                    result.push(response ? response : "");
                }
            }
            return result;
        };

        service.getResponseSheetRows = function (formData, responseDataList) {
            return responseDataList.map(function (response) {
                return service.getResponseSheetRow(formData, response);
            });
        };

        //Return [[Headers (Questions)], [Rows (Answers)]]
        service.getResponseSheet = function (formData, responseDataObjectOrList, headersWithQuestionNumber) {
            var sheet = [];
            var headers = service.getResponseSheetHeaders(formData, headersWithQuestionNumber);
            sheet.push(headers);
            if (!responseDataObjectOrList) {
                return sheet;
            }
            if (responseDataObjectOrList instanceof Array) {
                responseDataObjectOrList.forEach(function (response) {
                    sheet.push(service.getResponseSheetRow(formData, response));
                });
            } else {
                sheet.push(service.getResponseSheetRow(formData, responseDataObjectOrList));
            }

            return sheet;
        };

        return service;
    });
