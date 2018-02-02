angular.module('mwFormViewer').directive('mwFormViewer', ["$rootScope", function ($rootScope) {

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
            onSave: '&',
            api: '=?'

        },
        templateUrl: 'mw-form-viewer.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: ["$timeout", "$interpolate", function($timeout, $interpolate){
            var ctrl = this;
            // Put initialization logic inside `$onInit()`
            // to make sure bindings have been initialized.
            ctrl.$onInit = function() {
                ctrl.defaultOptions = {
                    nestedForm: false,
                    autoStart: false,
                    disableSubmit: false
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
                $rootScope.submitButton = ctrl.buttons.submitForm.visible;
                $rootScope.formValid = ctrl.form;
                ctrl.resetPages();

                if(ctrl.api){
                    ctrl.api.reset = function(){
                        for (var prop in ctrl.responseData) {
                            if (ctrl.responseData.hasOwnProperty(prop)) {
                                delete ctrl.responseData[prop];
                            }
                        }

                        ctrl.buttons.submitForm.visible=false;
                        $rootScope.submitButton = ctrl.buttons.submitForm.visible;
                        $rootScope.formValid = ctrl.form;
                        ctrl.buttons.prevPage.visible=false;
                        ctrl.buttons.nextPage.visible=false;
                        ctrl.currentPage=null;
                        $timeout(ctrl.resetPages, 0);

                    }
                }
            };

            ctrl.submitForm = function() {
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

                    $rootScope.submitButton = ctrl.buttons.submitForm.visible;

                    $rootScope.formValid = ctrl.form;

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
                $rootScope.submitButton = ctrl.buttons.submitForm.visible;
                $rootScope.formValid = ctrl.form;
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
                    $rootScope.submitButton = ctrl.buttons.submitForm.visible;
                    $rootScope.formValid = ctrl.form;
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
                    $rootScope.$broadcast("mwForm.pageEvents.pageCurrentChanged",{currentPage:ctrl.currentPage});
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


            ctrl.goToPrevPage= function(){
                window.scrollTo(0,0);
                var prevPage = ctrl.prevPages.pop();
                ctrl.setCurrentPage(prevPage);
                ctrl.updateNextPageBasedOnAllAnswers();
                $rootScope.$broadcast("mwForm.pageEvents.pageCurrentChanged",{currentPage:ctrl.currentPage});
            };

            ctrl.goToNextPage= function(){
                window.scrollTo(0,0);
                //TODO Saving each page data on next button 
                ctrl.onSave();
                
                ctrl.prevPages.push(ctrl.currentPage);

                ctrl.updateNextPageBasedOnAllAnswers();

                ctrl.setCurrentPage(ctrl.nextPage);
                $rootScope.$broadcast("mwForm.pageEvents.pageCurrentChanged",{currentPage:ctrl.currentPage});
            };

            ctrl.updateNextPageBasedOnAllAnswers = function(){
                ctrl.currentPage.elements.forEach(function(element){
                    ctrl.updateNextPageBasedOnPageElementAnswers(element);
                });

                ctrl.buttons.submitForm.visible=!ctrl.nextPage;
                $rootScope.submitButton = ctrl.buttons.submitForm.visible;
                $rootScope.formValid = ctrl.form;
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

            function sortPagesByNumber() {
                ctrl.formData.pages.sort(function(a,b){
                    return a.number - b.number;
                });
            }

            ctrl.print=function(input){
                if (input&&ctrl.templateData){
                    return $interpolate(input)(ctrl.templateData);
                }
                return input;
            };

            // Prior to v1.5, we need to call `$onInit()` manually.
            // (Bindings will always be pre-assigned in these versions.)
            if (angular.version.major === 1 && angular.version.minor < 5) {
                ctrl.$onInit();
            }

        }],
        link: function (scope, ele, attrs){
            var ctrl = scope.ctrl;
            if(ctrl.formStatus){
                ctrl.formStatus.form = ctrl.form;
            }
            
            scope.$on('mwForm.pageEvents.changePage', function(event,data){
                if(typeof data.page !== "undefined" && data.page < ctrl.formData.pages.length){
                   ctrl.resetPages();
                   for(var i =0; i < data.page;i++){
                        ctrl.prevPages.push(ctrl.formData.pages[i]);
                   } 
                   var currenPge=ctrl.formData.pages[data.page];
                   ctrl.setCurrentPage(currenPge);
                   $rootScope.$broadcast("mwForm.pageEvents.pageCurrentChanged",{currentPage:currenPge});
                   ctrl.updateNextPageBasedOnAllAnswers();
                }
            });


        }
    };
}]);