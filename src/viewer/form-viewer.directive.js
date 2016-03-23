
angular.module('mwFormViewer').directive('mwFormViewer', function () {

    return {
        replace: true,
        restrict: 'AE',
        scope: {
            formData: '=',
            responseData: '=',
            templateData: '=?',
            readOnly: '=?',
            options: '=?',
            formStatus: '=?', //wrapper for internal angular form object
            onSubmit: '&',
            api: '=?'

        },
        templateUrl: 'mw-form-viewer.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($timeout, $interpolate){
            var ctrl = this;

            ctrl.defaultOptions = {
                nestedForm: false,
                autoStart: false
            };
            ctrl.options = angular.extend({}, ctrl.defaultOptions, ctrl.options);

            ctrl.submitStatus='NOT_SUBMITTED';
            ctrl.formSubmitted=false;

            sortPagesByNumber();
            ctrl.pageIdToPage={};
            ctrl.formData.pages.forEach(function(page){
                ctrl.pageIdToPage[page.id]=page;
            });


            ctrl.buttons={
                prevPage: {
                    visible: false,
                    disabled: false
                },
                nextPage: {
                    visible: false,
                    disabled: false
                },
                submitForm: {
                    visible: false,
                    disabled: false
                }
            };

            ctrl.submitForm = function(){
                ctrl.formSubmitted=true;
                ctrl.submitStatus='IN_PROGRESS';

                ctrl.setCurrentPage(null);


                var resultPromise = ctrl.onSubmit();
                resultPromise.then(function(){
                    ctrl.submitStatus='SUCCESS';
                }).catch(function(){
                    ctrl.submitStatus='ERROR';
                });


            };

            ctrl.setCurrentPage = function (page) {
                ctrl.currentPage = page;
                if(!page){

                    ctrl.buttons.submitForm.visible=false;
                    ctrl.buttons.prevPage.visible=false;

                    ctrl.buttons.nextPage.visible=false;
                    return;
                }

                ctrl.setDefaultNextPage();

                ctrl.initResponsesForCurrentPage();


            };


            ctrl.setDefaultNextPage  = function(){
                var index = ctrl.formData.pages.indexOf(ctrl.currentPage);
                ctrl.currentPage.isFirst = index==0;
                ctrl.currentPage.isLast = index==ctrl.formData.pages.length-1;

                ctrl.buttons.submitForm.visible=ctrl.currentPage.isLast;
                ctrl.buttons.prevPage.visible=!ctrl.currentPage.isFirst;

                ctrl.buttons.nextPage.visible=!ctrl.currentPage.isLast;
                if(ctrl.currentPage.isLast){
                    ctrl.nextPage=null;
                }else{
                    ctrl.nextPage=ctrl.formData.pages[index+1];
                }

                if(ctrl.currentPage.pageFlow){
                    var formSubmit = false;
                    if(ctrl.currentPage.pageFlow.formSubmit){
                        ctrl.nextPage=null;
                        formSubmit = true;
                    }else if(ctrl.currentPage.pageFlow.page){
                        ctrl.nextPage=ctrl.pageIdToPage[ctrl.currentPage.pageFlow.page.id];
                        ctrl.buttons.nextPage.visible=true;
                    }else if(ctrl.currentPage.isLast){
                        ctrl.nextPage=null;
                        formSubmit = true;
                    }
                    ctrl.buttons.submitForm.visible=formSubmit;
                    ctrl.buttons.nextPage.visible=!formSubmit;
                }
            };

            ctrl.initResponsesForCurrentPage = function(){
                ctrl.currentPage.elements.forEach(function(element){
                    var question = element.question;
                    if(question && !ctrl.responseData[question.id]){
                        ctrl.responseData[question.id]={};
                    }
                });
            };

            ctrl.beginResponse=function(){

                if(ctrl.formData.pages.length>0){
                    ctrl.setCurrentPage(ctrl.formData.pages[0]);
                }
            };

            ctrl.resetPages = function(){
                ctrl.prevPages=[];

                ctrl.currentPage=null;
                ctrl.nextPage = null;
                ctrl.formSubmitted=false;
                if(ctrl.options.autoStart){
                    ctrl.beginResponse();
                }

            };
            ctrl.resetPages();

            ctrl.goToPrevPage= function(){
                var prevPage = ctrl.prevPages.pop();
                ctrl.setCurrentPage(prevPage);
                ctrl.updateNextPageBasedOnAllAnswers();
            };

            ctrl.goToNextPage= function(){
                ctrl.prevPages.push(ctrl.currentPage);

                ctrl.updateNextPageBasedOnAllAnswers();

                ctrl.setCurrentPage(ctrl.nextPage);
            };

            ctrl.updateNextPageBasedOnAllAnswers = function(){
                ctrl.currentPage.elements.forEach(function(element){
                    ctrl.updateNextPageBasedOnPageElementAnswers(element);
                });

                ctrl.buttons.submitForm.visible=!ctrl.nextPage;
                ctrl.buttons.nextPage.visible=!!ctrl.nextPage;
            };

            ctrl.updateNextPageBasedOnPageElementAnswers = function (element) {
                var question = element.question;
                if (question && question.pageFlowModifier) {
                    question.offeredAnswers.forEach(function (answer) {
                        if (answer.pageFlow) {
                            if(ctrl.responseData[question.id].selectedAnswer == answer.id){
                                if (answer.pageFlow.formSubmit) {
                                    ctrl.nextPage = null;
                                } else if (answer.pageFlow.page) {
                                    ctrl.nextPage = ctrl.pageIdToPage[answer.pageFlow.page.id];
                                }
                            }
                        }
                    });
                }
            };

            ctrl.onResponseChanged = function(pageElement){
                ctrl.setDefaultNextPage();
                ctrl.updateNextPageBasedOnAllAnswers();
            };

            if(ctrl.api){
                ctrl.api.reset = function(){
                    for (var prop in ctrl.responseData) {
                        if (ctrl.responseData.hasOwnProperty(prop)) {
                            delete ctrl.responseData[prop];
                        }
                    }

                    ctrl.buttons.submitForm.visible=false;
                    ctrl.buttons.prevPage.visible=false;
                    ctrl.buttons.nextPage.visible=false;
                    ctrl.currentPage=null;
                    $timeout(ctrl.resetPages, 0);

                }
            }

            function sortPagesByNumber() {
                ctrl.formData.pages.sort(function(a,b){
                    return a.number - b.number;
                });
            }

            ctrl.print=function(input){
                if (ctrl.templateData){
                    return $interpolate(input)(ctrl.templateData);
                }
                return input;
            }

        },
        link: function (scope, ele, attrs){
            var ctrl = scope.ctrl;
            if(ctrl.formStatus){
                ctrl.formStatus.form = ctrl.form;
            }


        }
    };
});
