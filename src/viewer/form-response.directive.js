angular.module('mwFormViewer').factory("FormResponseId", function () {
	var id = 0;
	return {
		next: function () {
			return ++id;
		}
	};
})

.directive('mwFormResponse', function () {

	return {
		replace: true,
		restrict: 'AE',
		require: '^mwFormViewer',
		scope: {
			response: '=',
			multiple: '=',
			responseResponse: '=',
			readOnly: '=?',
			options: '=?',
			onResponseChanged: '&?'
		},
		templateUrl: 'mw-form-response.html',
		controllerAs: 'ctrl',
		bindToController: true,
		controller: function ($timeout, FormResponseId) {
			var ctrl = this;
			ctrl.id = FormResponseId.next();
			if (!ctrl.multiple) {
				ctrl.multiple = [1];
			}

			if (ctrl.response.type == 'radio') {
				if (!ctrl.responseResponse.selectedAnswer) {
					ctrl.responseResponse.selectedAnswer = null;
				}
				if (ctrl.responseResponse.other) {
					ctrl.isOtherAnswer = true;
				}

			} else if (ctrl.response.type == 'checkbox') {
				if (ctrl.responseResponse.selectedAnswers && ctrl.responseResponse.selectedAnswers.length) {
					ctrl.selectedAnswer = true;
				} else {
					ctrl.responseResponse.selectedAnswers = [];
				}
				if (ctrl.responseResponse.other) {
					ctrl.isOtherAnswer = true;
				}


			}


			ctrl.isAnswerSelected = false;

			ctrl.selectedAnswerChanged = function () {
				delete ctrl.responseResponse.other;
				ctrl.isOtherAnswer = false;
				ctrl.answerChanged();

			};
			ctrl.otherAnswerRadioChanged = function () {
				if (ctrl.isOtherAnswer) {
					ctrl.responseResponse.selectedAnswer = null;
				}
				ctrl.answerChanged();
			};

			ctrl.otherAnswerCheckboxChanged = function () {
				if (!ctrl.isOtherAnswer) {
					delete ctrl.responseResponse.other;
				}
				ctrl.selectedAnswer = ctrl.responseResponse.selectedAnswers.length || ctrl.isOtherAnswer ? true : null;
				ctrl.answerChanged();
			};

			ctrl.removeResponse = function (m) {
				delete ctrl.responseResponse[m];
			};


			ctrl.toggleSelectedAnswer = function (answer) {
				if (ctrl.responseResponse.selectedAnswers.indexOf(answer.id) === -1) {
					ctrl.responseResponse.selectedAnswers.push(answer.id);
				} else {
					ctrl.responseResponse.selectedAnswers.splice(ctrl.responseResponse.selectedAnswers.indexOf(answer.id), 1);
				}
				ctrl.selectedAnswer = ctrl.responseResponse.selectedAnswers.length || ctrl.isOtherAnswer ? true : null;

				ctrl.answerChanged();
			};

			ctrl.answerChanged = function () {
				if (ctrl.onResponseChanged) {
					ctrl.onResponseChanged();
				}
			};

		},
		link: function (scope, ele, attrs, mwFormViewer) {
			var ctrl = scope.ctrl;
			ctrl.print = mwFormViewer.print;
		}
	};
});
