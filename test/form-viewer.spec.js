describe('form-viewer', function() {
    var $compile,
        $rootScope,
        $scope;
    var beginButtonHTML = "<button type=\"button\" class=\"btn btn-default begin-response-button ng-scope\" ng-click=\"ctrl.beginResponse()\" translate=\"mwForm.buttons.begin\">";
    var nextButtonHTML = "<button type=\"button\" ng-disabled=\"ctrl.form.$invalid\" ng-if=\"ctrl.buttons.nextPage.visible\" class=\"btn btn-default next-page-button ng-scope\" ng-click=\"ctrl.goToNextPage()\">";
    var nextButtonDisabledHTML = "<button type=\"button\" ng-disabled=\"ctrl.form.$invalid\" ng-if=\"ctrl.buttons.nextPage.visible\" class=\"btn btn-default next-page-button ng-scope\" ng-click=\"ctrl.goToNextPage()\" disabled=\"disabled\">";

    var formData = {
        "pages": [
            {
                "id": "bfee98e7120f0683a3423426f93e1afc",
                "number": 1,
                "name": "page 1 name",
                "namedPage": true,
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
                            "src": "lena.gif",
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
        "description": "Form description. Lorem ipsum"
    };

    beforeEach(module('mwFormViewer'));


    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $scope.formData = angular.copy(formData);
    }));

    it('Replaces the element with the appropriate content', function() {
        $scope.responseData = {};
        var element = $compile("<mw-form-viewer form-data=\"formData\"  response-data=\"responseData\"></mw-form-viewer>")($scope);

        $scope.$digest();
        expect(element.html()).toContain(formData.name);
        expect(element.html()).toContain(formData.description);
        expect(element.html()).toContain(beginButtonHTML);

        expect(element.html()).not.toContain(nextButtonHTML);

    });

    it('Replaces the element with the appropriate content with autoStart option enabled', function() {
        $scope.responseData = {};
        $scope.options = {
            autoStart: true
        };

        var element = $compile("<mw-form-viewer form-data=\"formData\"  response-data=\"responseData\" options='options'></mw-form-viewer>")($scope);

        $scope.$digest();
        expect(element.html()).toContain(formData.name);
        expect(element.html()).toContain(formData.pages[0].name);
        expect(element.html()).toContain(nextButtonDisabledHTML);

        expect(element.html()).not.toContain(formData.description);
        expect(element.html()).not.toContain(beginButtonHTML);

    });

});