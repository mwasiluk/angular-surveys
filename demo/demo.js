angular.module('app', ['mwFormBuilder', 'mwFormViewer', 'pascalprecht.translate', 'monospaced.elastic'])
    .config(function($translateProvider){
        $translateProvider.useStaticFilesLoader({
            prefix: '../dist/i18n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
    })
    .controller('DemoController', function($q, $translate) {
        var ctrl = this;
        ctrl.languages = ['en', 'pl'];
        ctrl.formData = {
            "pages": [
                {
                    "id": "f60c27ba319d4a645c9e145bba95ef9f",
                    "number": 1,
                    "name": null,
                    "description": null,
                    "elements": [
                        {
                            "id": "a3a6f740ea85672b56ff37f4dac77ae6",
                            "orderNo": 1,
                            "type": "question",
                            "question": {
                                "id": "ef04ed873bc341239f7b3ac54a86b9bf",
                                "text": "123",
                                "type": "radio",
                                "required": true,
                                "offeredAnswers": [
                                    {
                                        "id": "1e9241d6d65d9c1236b52ab62d4143ae",
                                        "orderNo": 1,
                                        "value": "1",
                                        "pageFlow": {
                                            "nextPage": true,
                                            "label": "mwForm.pageFlow.goToNextPage"
                                        }
                                    },
                                    {
                                        "id": "b537fa40395a8585cced00911caf2d5a",
                                        "orderNo": 2,
                                        "value": "2",
                                        "pageFlow": {
                                            "page": {
                                                "id": "a9eb4937ae6187d2f8354a23b153f80f"
                                            },
                                            "label": "Go to page 2"
                                        }
                                    },
                                    {
                                        "id": "20906a5a57a1ca70b43bcb0b724fefce",
                                        "orderNo": 3,
                                        "value": "3",
                                        "pageFlow": {
                                            "page": {
                                                "id": "e13ae72a0e02d07594209f195b7eefe9"
                                            },
                                            "label": "Go to page 3"
                                        }
                                    }
                                ],
                                "pageFlowModifier": true
                            }
                        }
                    ],
                    "namedPage": false,
                    "isFirst": true,
                    "isLast": false
                },
                {
                    "id": "a9eb4937ae6187d2f8354a23b153f80f",
                    "number": 2,
                    "name": "2",
                    "description": null,
                    "elements": [],
                    "namedPage": true
                },
                {
                    "id": "e13ae72a0e02d07594209f195b7eefe9",
                    "number": 3,
                    "name": "3",
                    "description": null,
                    "elements": [],
                    "namedPage": true
                }
            ]
        };
        ctrl.formViewer = {};
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

        ctrl.changeLanguage = function (languageKey) {
            $translate.use(languageKey);
        };
    });