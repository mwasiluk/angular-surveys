
angular.module('mwFormBuilder').directive('mwFormBuilder', function ($filter) {

    return {
        replace: true,
        restrict: 'AE',
        scope: {
            formData: '=',
            readOnly: '=?',
            options: '=?',
            formStatus: '=?',
            confirm: '=',
            onImageSelection: '&'
        },
        templateUrl: 'mw-form-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function(uuid){
            var ctrl = this;

            //angular.extend(ctrl.formData, {
            //    name: null,
            //    description: null
            //});

            if(!ctrl.formData.pages || !ctrl.formData.pages.length){
                ctrl.formData.pages = [];
                ctrl.formData.pages.push(createEmptyPage(1));
            }

            console.log(ctrl.formData);

            ctrl.addPage = function(){
                ctrl.formData.pages.push(createEmptyPage(ctrl.formData.pages.length+1));
            };


            function createEmptyPage(number){
                return {
                    id: uuid.get(),
                    number: number,
                    name: null,
                    description: null,
                    elements: []
                };
            }

            function updatePageNumbers() {
                for(var i=0; i<ctrl.formData.pages.length; i++){
                    ctrl.formData.pages[i].number = i+1;
                }
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
            };

            ctrl.moveDownPage= function(page){
                var fromIndex = ctrl.formData.pages.indexOf(page);
                var toIndex=fromIndex+1;
                if(toIndex<ctrl.formData.pages.length){
                    arrayMove(ctrl.formData.pages, fromIndex, toIndex);
                }
                updatePageNumbers();
            };

            ctrl.moveUpPage= function(page){
                var fromIndex = ctrl.formData.pages.indexOf(page);
                var toIndex=fromIndex-1;
                if(toIndex>=0){
                    arrayMove(ctrl.formData.pages, fromIndex, toIndex);
                }
                updatePageNumbers();
            };

            ctrl.removePage=function(page){
                var index = ctrl.formData.pages.indexOf(page);
                ctrl.formData.pages.splice(index,1);
                updatePageNumbers();
            };



            function arrayMove(arr, fromIndex, toIndex) {
                var element = arr[fromIndex];
                arr.splice(fromIndex, 1);
                arr.splice(toIndex, 0, element);
            }

        },
        link: function (scope, ele, attrs){
            var ctrl = scope.ctrl;
            var $translate = $filter('translate');
            ctrl.formStatus.form = ctrl.form;

            ctrl.possiblePageFlow = [];
            scope.$watch('ctrl.formData.pages.length', function(newVal, oldVal){

                ctrl.possiblePageFlow.length=0;

                ctrl.formData.pages.forEach(function(page){

                    ctrl.possiblePageFlow.push({
                        page:{
                            id: page.id
                        },
                        label: $translate('mwForm.pageFlow.goToPage', {page:page.number})
                    });
                });

                ctrl.possiblePageFlow.push({
                    formSubmit:true,
                    label: $translate('mwForm.pageFlow.submitForm')
                });
                ctrl.formData.pages.forEach(function(page){
                    ctrl.possiblePageFlow.forEach(function(pageFlow){
                        if(page.pageFlow) {
                            if((pageFlow.page && page.pageFlow.page &&  pageFlow.page.id==page.pageFlow.page.id) || pageFlow.formSubmit && page.pageFlow.formSubmit){
                                page.pageFlow = pageFlow;
                            }
                        }

                        page.elements.forEach(function(element){
                            var question = element.question;
                            if(question && question.pageFlowModifier){
                                question.offeredAnswers.forEach(function(answer){
                                    if(answer.pageFlow){

                                            if((pageFlow.page && answer.pageFlow.page &&  pageFlow.page.id==answer.pageFlow.page.id) || pageFlow.formSubmit && answer.pageFlow.formSubmit){
                                                answer.pageFlow = pageFlow;
                                            }
                                    }
                                });

                            }

                        });
                    });
                });


            });
        }
    };
});
