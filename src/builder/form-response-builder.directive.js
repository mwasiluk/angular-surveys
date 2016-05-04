angular.module('mwFormBuilder').factory("FormResponseBuilderId", function () {
	var id = 0;
	return {
		next: function () {
			return ++id;
		}
	};
})

.directive('mwFormResponseBuilder', function () {

	return {
		replace: true,
		restrict: 'AE',
		require: '^mwFormPageElementBuilder',
		scope: {
			response: '=',
			formObject: '=',
			onReady: '&',
			isPreview: '=?',
			readOnly: '=?'
		},
		templateUrl: 'mw-form-response-builder.html',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: function ($timeout, FormResponseBuilderId, mwFormBuilderOptions) {
			var ctrl = this;
			console.log('야호');
			ctrl.id = FormResponseBuilderId.next();
			ctrl.responseTypes = mwFormBuilderOptions.responseTypes;
			ctrl.formSubmitted = false;

			sortAnswersByOrderNo();

			function updateAnswersOrderNo() {
				if (ctrl.response.responseAnswers) {
					for (var i = 0; i < ctrl.response.responseAnswers.length; i++) {
						ctrl.response.responseAnswers[i].orderNo = i + 1;
					}
				}

			}

			function sortAnswersByOrderNo() {
				if (ctrl.response.responseAnswers) {
					ctrl.response.responseAnswers.sort(function (a, b) {
						return a.orderNo - b.orderNo;
					});
				}
			}

			ctrl.save = function () {
				ctrl.formSubmitted = true;
				if (ctrl.form.$valid) {
					ctrl.onReady();
				}

			};

			ctrl.responseAnswersSortableConfig = {
				disabled: ctrl.readOnly,
				ghostClass: "beingDragged",
				handle: ".drag-handle",
				onEnd: function (e, ui) {
					updateAnswersOrderNo();
				}
			};

			ctrl.responseTypeChanged = function () {
				if (ctrl.response.type == 'radio' || ctrl.response.type == 'checkbox') {
					if (!ctrl.response.responseAnswers) {
						ctrl.response.responseAnswers = [];
					}

				}
				if (ctrl.response.type != 'radio') {
					clearCustomPageFlow();
					$timeout(function () {
						ctrl.response.pageFlowModifier = false;
					});

				}
				if (ctrl.response.type != 'radio' && ctrl.response.type != 'checkbox') {
					delete ctrl.response.responseAnswers;
				}

			};

			function clearCustomPageFlow() {

				if (!ctrl.response.responseAnswers) {
					return;
				}

				ctrl.response.responseAnswers.forEach(function (answer) {
					if (ctrl.response.pageFlowModifier) {
						answer.pageFlow = ctrl.possiblePageFlow[0];
					} else {
						delete answer.pageFlow;
					}

				});
			}

			ctrl.pageFlowModifierChanged = function () {
				clearCustomPageFlow();
			};

		},
		link: function (scope, ele, attrs, formPageElementBuilder) {
			console.log('얍');

			var ctrl = scope.ctrl;
			ctrl.possiblePageFlow = formPageElementBuilder.possiblePageFlow;
			ctrl.options = formPageElementBuilder.options;
		}
	};
});
