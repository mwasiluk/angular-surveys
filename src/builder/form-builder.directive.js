angular.module('mwFormBuilder').directive('mwFormBuilder', ["$rootScope", function ($rootScope) {

    return {
        replace: true,
        restrict: 'AE',
        scope: {
            formData: '=',
            readOnly: '=?',
            options: '=?',
            formStatus: '=?',
            onImageSelection: '&',
            api: '=?'
        },
        templateUrl: 'mw-form-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: ["mwFormUuid", "MW_QUESTION_TYPES", "mwFormBuilderOptions", function(mwFormUuid, MW_QUESTION_TYPES, mwFormBuilderOptions){
            var ctrl = this;
            // Put initialization logic inside `$onInit()`
            // to make sure bindings have been initialized.
            ctrl.$onInit = function() {
                ctrl.currentPage = 0;

                if(!ctrl.formData.pages || !ctrl.formData.pages.length){
                    ctrl.formData.pages = [];
                    ctrl.formData.pages.push(createEmptyPage(1));
                }

                ctrl.options = mwFormBuilderOptions.$init(ctrl.options);

                if(ctrl.api){
                    ctrl.api.reset = function(){
                        for (var prop in ctrl.formData) {
                            if (ctrl.formData.hasOwnProperty(prop) && prop != 'pages') {
                                delete ctrl.formData[prop];
                            }
                        }

                        ctrl.formData.pages.length=0;
                        ctrl.formData.pages.push(createEmptyPage(1));

                    }
                }
            };
            

            ctrl.numberOfPages=function(){
                return Math.ceil(ctrl.formData.pages.length/ctrl.options.pageSize);                
            };
            ctrl.lastPage = function(){
               ctrl.currentPage = Math.ceil(ctrl.formData.pages.length/ctrl.options.pageSize - 1); 
            };
            ctrl.addPage = function(){
                ctrl.formData.pages.push(createEmptyPage(ctrl.formData.pages.length+1));
                ctrl.lastPage();
                $rootScope.$broadcast("mwForm.pageEvents.pageAdded");
            };
            ctrl.onChangePageSize = function(){
                if(ctrl.currentPage > Math.ceil(ctrl.formData.pages.length/ctrl.options.pageSize - 1)){
                   ctrl.currentPage = Math.ceil(ctrl.formData.pages.length/ctrl.options.pageSize - 1); 
                }
            };
            

            function createEmptyPage(number){
                var defaultPageFlow = null;
                if(ctrl.possiblePageFlow){
                    defaultPageFlow = ctrl.possiblePageFlow[0];
                }

                return {
                    id: mwFormUuid.get(),
                    number: number,
                    name: null,
                    description: null,
                    pageFlow: defaultPageFlow,
                    elements: []
                };
            }

            function updatePageNumbers() {
                for(var i=0; i<ctrl.formData.pages.length; i++){
                    ctrl.formData.pages[i].number = i+1;
                }
                ctrl.updatePageFlow();
            }

            ctrl.addPageAfter=function(page){
                var index = ctrl.formData.pages.indexOf(page);
                var newIndex = index+1;
                var newPage = createEmptyPage(page.number+1);
                if(newIndex<ctrl.formData.pages.length){
                    ctrl.formData.pages.splice(newIndex,0, newPage);
                }else{
                    ctrl.formData.pages.push(newPage);
                }
                updatePageNumbers();
                $rootScope.$broadcast("mwForm.pageEvents.pageAdded");

            };

            ctrl.moveDownPage= function(page){
                var fromIndex = ctrl.formData.pages.indexOf(page);
                var toIndex=fromIndex+1;
                if(toIndex<ctrl.formData.pages.length){
                    arrayMove(ctrl.formData.pages, fromIndex, toIndex);
                }
                updatePageNumbers();
                $rootScope.$broadcast("mwForm.pageEvents.pageMoved");

            };

            ctrl.moveUpPage= function(page){
                var fromIndex = ctrl.formData.pages.indexOf(page);
                var toIndex=fromIndex-1;
                if(toIndex>=0){
                    arrayMove(ctrl.formData.pages, fromIndex, toIndex);
                }
                updatePageNumbers();
                $rootScope.$broadcast("mwForm.pageEvents.pageMoved");

            };

            ctrl.removePage=function(page){
                var index = ctrl.formData.pages.indexOf(page);
                ctrl.formData.pages.splice(index,1);
                updatePageNumbers();
                $rootScope.$broadcast("mwForm.pageEvents.pageRemoved");
                ctrl.onChangePageSize();
            };

            function arrayMove(arr, fromIndex, toIndex) {
                var element = arr[fromIndex];
                arr.splice(fromIndex, 1);
                arr.splice(toIndex, 0, element);
            }

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

            ctrl.possiblePageFlow = [];
            var defaultPageFlow = {
                nextPage: true,
                label: 'mwForm.pageFlow.goToNextPage'
            };
            ctrl.possiblePageFlow.push(defaultPageFlow);
            ctrl.isSamePageFlow = function (p1, p2){
                return (p1.page && p2.page &&  p1.page.id==p2.page.id) || p1.formSubmit && p2.formSubmit || p1.nextPage && p2.nextPage;
            };

            ctrl.updatePageFlow = function(){
                ctrl.possiblePageFlow.length=1;

                ctrl.formData.pages.forEach(function(page){

                    ctrl.possiblePageFlow.push({
                        page:{
                            id: page.id,
                            number: page.number
                        },
                        label: 'mwForm.pageFlow.goToPage'
                    });
                });

                ctrl.possiblePageFlow.push({
                    formSubmit:true,
                    label: 'mwForm.pageFlow.submitForm'
                });
                ctrl.formData.pages.forEach(function(page){
                    ctrl.possiblePageFlow.forEach(function(pageFlow){
                        if(page.pageFlow) {
                            if(ctrl.isSamePageFlow(pageFlow, page.pageFlow)){
                                page.pageFlow = pageFlow;
                            }
                        }else{
                            page.pageFlow = defaultPageFlow;
                        }

                        page.elements.forEach(function(element){
                            var question = element.question;
                            if(question && question.pageFlowModifier){
                                question.offeredAnswers.forEach(function(answer){
                                    if(answer.pageFlow){
                                        if(ctrl.isSamePageFlow(pageFlow, answer.pageFlow)){
                                            answer.pageFlow = pageFlow;
                                        }
                                    }
                                });
                            }

                        });
                    });
                });
            };

            scope.$watch('ctrl.formData.pages.length', function(newVal, oldVal){
                ctrl.updatePageFlow();
            });
            scope.$watch('ctrl.currentPage', function(newVal, oldVal){
                $rootScope.$broadcast("mwForm.pageEvents.pageCurrentChanged",{index:ctrl.currentPage});
            });
            scope.$on('mwForm.pageEvents.changePage', function(event,data){
                if(typeof data.page !== "undefined" && data.page < ctrl.numberOfPages()){
                   ctrl.currentPage = data.page;
                }
            });
            scope.$on('mwForm.pageEvents.addPage', function(event,data){
                ctrl.addPage();
            });
        }
    };
}]);


angular.module('mwFormBuilder').filter('mwStartFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});