angular.module('mwFormBuilder', ['ngSanitize', 'ui.sortable', 'pascalprecht.translate'])
    .constant('MW_QUESTION_TYPES', ['text', 'textarea', 'radio', 'checkbox', 'grid', 'priority', 'division', 'number', 'date', 'time', 'email', 'range', 'url'])
    .value('mwFormBuilderOptions', {});


