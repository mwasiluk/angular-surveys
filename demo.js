angular.module('app', ['mwFormBuilder', 'mwFormViewer',  'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic'])
    .config(function($translateProvider){
        $translateProvider.useStaticFilesLoader({
            prefix: 'https://rawgit.com/mwasiluk/angular-surveys/master/dist/i18n/',
            suffix: '/angular-surveys.json'
        });
        $translateProvider.preferredLanguage('en');
    })
    .controller('DemoController', function($q,$http, $translate, mwFormResponseUtils) {
        var ctrl = this;
        ctrl.builderReadOnly = false;
        ctrl.viewerReadOnly = false;
        ctrl.languages = ['en', 'pl', "es"];
        ctrl.formData = {};
        $http.get('form-data.json')
            .then(function(res){
                ctrl.formData = res.data;
            });
        ctrl.formBuilder={};
        ctrl.formViewer = {};
        ctrl.formOptions = {
            autoStart: false
        };
        ctrl.formStatus= {};
        ctrl.responseData={};
        ctrl.showResponseRata=false;
        ctrl.saveResponse = function(){
            var d = $q.defer();
            var res = confirm("Response save success?");
            if(res){
                d.resolve(true);
            }else{
                d.reject();
            }

            return d.promise;
        };

        ctrl.onImageSelection = function (){

            var d = $q.defer();
            var src = prompt("Please enter image src");
            if(src !=null){
                d.resolve(src);
            }else{
                d.reject();
            }

            return d.promise;
        };

        ctrl.resetViewer = function(){
            if(ctrl.formViewer.reset){
                ctrl.formViewer.reset();
            }

        };

        ctrl.resetBuilder= function(){
            if(ctrl.formBuilder.reset){
                ctrl.formBuilder.reset();
            }
        };

        ctrl.changeLanguage = function (languageKey) {
            $translate.use(languageKey);
        };

        ctrl.getMerged=function(){
            return mwFormResponseUtils.mergeFormWithResponse(ctrl.formData, ctrl.responseData);
        };

        ctrl.getQuestionWithResponseList=function(){
            return mwFormResponseUtils.getQuestionWithResponseList(ctrl.formData, ctrl.responseData);
        };
        ctrl.getResponseSheetRow=function(){
            return mwFormResponseUtils.getResponseSheetRow(ctrl.formData, ctrl.responseData);
        };
        ctrl.getResponseSheetHeaders=function(){
            return mwFormResponseUtils.getResponseSheetHeaders(ctrl.formData, ctrl.headersWithQuestionNumber);
        };

        ctrl.getResponseSheet=function(){
            return mwFormResponseUtils.getResponseSheet(ctrl.formData, ctrl.responseData, ctrl.headersWithQuestionNumber);
        };

    });
