angular.module('mwFormBuilder')
    .service('mwFormUuid', function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        this.get = function () {
            return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();


        };
    })
    .factory('mwFormClone', ["mwFormUuid", function (mwFormUuid) {
        var service = {};
        var checkedObjects = [];

        service.resetIds = function (obj, root) {
            if (root) {
                checkedObjects = [];
            }
            if (checkedObjects.indexOf(obj) >= 0) {
                return;
            }
            checkedObjects.push(obj);
            if (!obj === Object(obj)) {
                return;
            }

            if (Array.isArray(obj)) {
                obj.forEach(service.resetIds);
                return;
            }

            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    service.resetIds(obj[property]);
                }
            }

            if (obj.hasOwnProperty('id')) {
                var newId = mwFormUuid.get();
                var oldId = obj.id;
                obj.id = newId;
            }
        };

        service.cloneElement = function (pageElement) {
            var element = {};
            angular.copy(pageElement, element);
            service.resetIds(element, true);
            return element;
        };

        service.clonePage = function (formPage) {
            var _page = {};
            angular.copy(formPage, _page);
            _page.id = mwFormUuid.get();
            var _elements = [];
            if (Array.isArray(formPage.elements)) {
                for (var i = 0; i < formPage.elements.length; i++) {
                    _elements.push(service.cloneElement(formPage.elements[i]));
                }
            }
            _page.elements = _elements;
            return _page;
        };

        service.cloneForm = function (form) {
            var _form = {};
            angular.copy(form, _form);
            var _pages = [];
            if (Array.isArray(form.pages)) {
                for (var i = 0; i < form.pages.length; i++) {
                    _pages.push(service.clonePage(form.pages[i]));
                }
            }
            _form.pages = _pages;
            return _form;
        };

        return service;

    }]);
