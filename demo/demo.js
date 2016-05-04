angular.module('app', [
		'mwFormBuilder',
		'mwFormViewer',
		'mwFormUtils',
		'pascalprecht.translate'
	])
	.config(function ($translateProvider) {
		$translateProvider.useStaticFilesLoader({
			prefix: '../dist/i18n/',
			suffix: '/angular-surveys.json'
		});
		$translateProvider.useLoaderCache(true);
		$translateProvider.preferredLanguage('en');
		$translateProvider.useSanitizeValueStrategy('sanitize');
	})
	.controller('DemoController', function ($q, $translate, mwFormResponseUtils) {

		var vm = this;
		vm.mergeFormWithResponse = true;
		vm.cgetQuestionWithResponseList = true;
		vm.cgetResponseSheetHeaders = true;
		vm.cgetResponseSheetRow = true;
		vm.cgetResponseSheet = true;
		vm.headersWithQuestionNumber = true;
		vm.builderReadOnly = false;
		vm.viewerReadOnly = false;
		vm.languages = ['en', 'pl', "es"];
		vm.formData = {
			"pages": [{
				"id": "3e85e01175c78021d0b552a72ecddd76",
				"number": 1,
				"name": null,
				"description": null,
				"pageFlow": {
					"page": {
						"id": "4ea50b65fff0e30f197d78ef82d5a946",
						"number": 1
					},
					"label": "mwForm.pageFlow.goToPage"
				},
				"elements": [],
				"namedPage": false,
				"isFirst": true,
				"isLast": false
			}],
			"name": "TEST",
			"description": "Test decision tree",
			"confirmationMessage": "DONE!"
		};
		// $http.get('form-data2.json')
		//     .then(function(res){
		//         vm.formData = res.data;
		//     });
		vm.multiple = [1, 2, 3, 4, 5, 6, 7, 8];
		vm.formBuilder = {};
		vm.formViewer = {};
		vm.formOptions = {
			autoStart: false
		};

		vm.modify = function () {
			for (var i = 0; i < vm.multiple.length; i++) {
				if (!(vm.responseData[vm.id].hasOwnProperty(vm.multiple[i]) && vm.responseData[vm.id][vm.multiple[i]])) {
					vm.responseData[vm.id][vm.multiple[i]] = {answer: parseInt(vm.value,10)};
					break;
				}
			}
		};
		vm.optionsBuilder = {
			/*elementButtons:   [{title: 'My title tooltip', icon: 'fa fa-database', text: '', callback: vm.callback, filter: vm.filter, showInOpen: true}],
			customQuestionSelects:  [
			    {key:"category", label: 'Category', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}], required: false},
			    {key:"category2", label: 'Category2', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}]}
			],
			elementTypes: ['question', 'image']*/
		};
		vm.formStatus = {};
		vm.responseData = {
			"ed9a53e5ebc4fd4cdf84686743c0b939": {
				"answer": "short text answer"
			},
			"46d605c6b29161e49918733ea2c21b10": {
				"answer": "long text answer"
			},
			"16a37f04b1f2c4ed9ccad0f90c202f3e": {
				"selectedAnswer": "c1860469d05cb0be1ef6c254809c207e"
			},
			"3ba201eb2562dca36a5257ef3ff2be2d": {
				"selectedAnswers": [
					"567678e87b794541a9e6f7e1376b562c"
				],
				"other": "checkbox other answer"
			},
			"10b08afca4dff80e975f4910ee85ef3f": {
				"48b09d72e6fb0d2a63985eef4018346e": "ace63d4001112c28e97b00ff67ceeeca",
				"f35a6e5d1ce9407b5ece224198032cb6": "ace63d4001112c28e97b00ff67ceeeca"
			},
			"dc640ed493ba5a00d4a44f3a216cfa34": {
				"priorityList": [{
					"priority": 1,
					"id": "c389bfb386b59483c7592719d9968d35"
				}, {
					"priority": 2,
					"id": "14629777a4bda0e1d40044429aaf63f9"
				}, {
					"priority": 3,
					"id": "66a28c757482c280b30db318b5922201"
				}]
			},
			"8666ad943291900f0e5b34bc14bb18dc": {
				"dc3c109e947b736c49415faf0b595091": 10,
				"476d950019a69252524ac00d2a39ef54": 30,
				"d9b54b9da75bdfe78d4cbc41d0cdf9e0": 60
			},
			"7d8826e84a398532fbe78be646214eab": {
				"answer": "Aenean non ante id turpis aliquam dignissim ut quis erat. Integer sed libero nunc."
			}
		};
		// $http.get('response-data.json')
		//     .then(function(res){
		//         vm.responseData = res.data;
		//     });

		// $http.get('template-data.json')
		//     .then(function(res){
		//         vm.templateData = res.data;
		//     });
		vm.templateData = {
			"price": 1.13,
			"noAnswer": "no",
			"person": {
				"name": "Bob",
				"age": 33
			},
			"templateData": "from template"
		};

		vm.showResponseRata = false;
		vm.saveResponse = function () {
			var d = $q.defer();
			var res = confirm("Response save success?");
			if (res) {
				d.resolve(true);
			} else {
				d.reject();
			}
			return d.promise;
		};

		vm.onImageSelection = function () {

			var d = $q.defer();
			var src = prompt("Please enter image src");
			if (src !== null) {
				d.resolve(src);
			} else {
				d.reject();
			}

			return d.promise;
		};

		vm.resetViewer = function () {
			if (vm.formViewer.reset) {
				vm.formViewer.reset();
			}

		};

		vm.resetBuilder = function () {
			if (vm.formBuilder.reset) {
				vm.formBuilder.reset();
			}
		};

		vm.changeLanguage = function (languageKey) {
			$translate.use(languageKey);
		};

		vm.getMerged = function () {
			return mwFormResponseUtils.mergeFormWithResponse(vm.formData, vm.responseData);
		};

		vm.getQuestionWithResponseList = function () {
			return mwFormResponseUtils.getQuestionWithResponseList(vm.formData, vm.responseData);
		};
		vm.getResponseSheetRow = function () {
			return mwFormResponseUtils.getResponseSheetRow(vm.formData, vm.responseData);
		};
		vm.getResponseSheetHeaders = function () {
			return mwFormResponseUtils.getResponseSheetHeaders(vm.formData, vm.headersWithQuestionNumber);
		};

		vm.getResponseSheet = function () {
			return mwFormResponseUtils.getResponseSheet(vm.formData, vm.responseData, vm.headersWithQuestionNumber);
		};

	});
