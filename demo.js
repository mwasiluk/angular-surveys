angular.module('app', ['mwFormBuilder', 'mwFormViewer', 'pascalprecht.translate', 'monospaced.elastic'])
    .config(function($translateProvider){
        $translateProvider.useStaticFilesLoader({
            prefix: 'https://rawgit.com/mwasiluk/angular-surveys/master/dist/i18n/',
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
              "id": "bfee98e7120f0683a3423426f93e1afc",
              "number": 1,
              "name": null,
              "description": null,
              "pageFlow": {
                "nextPage": true,
                "label": "mwForm.pageFlow.goToNextPage"
              },
              "elements": [
                {
                  "id": "57c2efdf23f6f9b20060adf2ea16c94e",
                  "orderNo": 1,
                  "type": "question",
                  "question": {
                    "id": "13eac1ee6dbe50fe5f554ace92be1638",
                    "text": "Short Question lorem ipsum",
                    "type": "text",
                    "required": true,
                    "pageFlowModifier": false
                  }
                },
                {
                  "id": "046f47cf762a55cd0c9810eb8a716735",
                  "orderNo": 2,
                  "type": "question",
                  "question": {
                    "id": "fcdceaecbef81f31019847e582d6cfbb",
                    "text": "Grid question",
                    "type": "grid",
                    "required": true,
                    "grid": {
                      "rows": [
                        {
                          "id": "8858def63736ba8b38eaa3de2d0cd03d",
                          "orderNo": 1,
                          "label": "row 1"
                        },
                        {
                          "id": "9ce3a283d1739e1fa4f1f10e9564cb49",
                          "orderNo": 2,
                          "label": "row 2"
                        },
                        {
                          "id": "7877850f6796ab0fb6f1b09d03ca0d63",
                          "orderNo": 3,
                          "label": "row 3"
                        }
                      ],
                      "cols": [
                        {
                          "id": "349aef76372cfec97f8b15d2ef538daa",
                          "orderNo": 1,
                          "label": "1"
                        },
                        {
                          "id": "d395abb4398d77d33e7fb589880fc263",
                          "orderNo": 2,
                          "label": "2"
                        },
                        {
                          "id": "bdf8a60a488f752027b6f46ddfc2749a",
                          "orderNo": 3,
                          "label": "3"
                        },
                        {
                          "id": "73bbfc6eab1ae69e7af65926d42831b6",
                          "orderNo": 4,
                          "label": "4"
                        },
                        {
                          "id": "5a92e469f4084a46513704117ba68672",
                          "orderNo": 5,
                          "label": "5"
                        },
                        {
                          "id": "13004efd23f026db9dfd1b66d54b2fc3",
                          "orderNo": 6,
                          "label": "6"
                        },
                        {
                          "id": "1278ccb4326c6ab97f5d455258462526",
                          "orderNo": 7,
                          "label": "7"
                        }
                      ]
                    },
                    "pageFlowModifier": false
                  }
                }
              ],
              "namedPage": false,
              "isFirst": true,
              "isLast": false
            },
            {
              "id": "87a455ef6c0352eed3fbceaa835d18d1",
              "number": 2,
              "name": null,
              "description": null,
              "pageFlow": {
                "nextPage": true,
                "label": "mwForm.pageFlow.goToNextPage"
              },
              "elements": [
                {
                  "id": "f3f204cfee0f65c493b65833008de2da",
                  "orderNo": 1,
                  "type": "image",
                  "image": {
                    "id": "15d20aa5b6e7c42f5883104367242df1",
                    "align": "center",
                    "src": "http://www.cosy.sbg.ac.at/~pmeerw/Watermarking/lena_color.gif",
                    "caption": "Image caption"
                  }
                },
                {
                  "id": "c4da39184e789745f33c156512510ab1",
                  "orderNo": 2,
                  "type": "question",
                  "question": {
                    "id": "0318e74124c77721404c896e32f4c2a7",
                    "text": "Question text",
                    "type": "checkbox",
                    "required": true,
                    "offeredAnswers": [
                      {
                        "id": "5bc6c8a1546d4c08f2aad5f676766591",
                        "orderNo": 1,
                        "value": "aaaaaaaaaaaaaaaaa",
                        "pageFlow": {
                          "nextPage": true,
                          "label": "mwForm.pageFlow.goToNextPage"
                        }
                      },
                      {
                        "id": "6ae5a8573cca891ca2c1daa6841a1b53",
                        "orderNo": 2,
                        "value": "bbbbbbbbbbbbbbbb",
                        "pageFlow": {
                          "nextPage": true,
                          "label": "mwForm.pageFlow.goToNextPage"
                        }
                      },
                      {
                        "id": "94022c6079f844c58c348943735cdf4b",
                        "orderNo": 3,
                        "value": "ccccccccccccccccccccc",
                        "pageFlow": {
                          "nextPage": true,
                          "label": "mwForm.pageFlow.goToNextPage"
                        }
                      },
                      {
                        "id": "93f6152289512c9e85ab3dc02d46a911",
                        "orderNo": 4,
                        "value": "dddddddddddddddd",
                        "pageFlow": {
                          "nextPage": true,
                          "label": "mwForm.pageFlow.goToNextPage"
                        }
                      }
                    ],
                    "pageFlowModifier": false,
                    "otherAnswer": true
                  }
                }
              ],
              "namedPage": false,
              "isFirst": false,
              "isLast": true
            }
          ],
          "name": "Lorem ipsum",
          "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie tempus erat ut auctor. In sed iaculis ligula. In rhoncus quis orci a dapibus. Donec leo enim, vulputate ac magna ac, efficitur accumsan justo. Sed in finibus arcu, vitae volutpat lorem. Sed ornare sapien pretium massa fringilla lacinia. In in suscipit orci, elementum porttitor quam. Donec sit amet viverra lectus, quis dignissim augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia enim dignissim porttitor finibus."
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
