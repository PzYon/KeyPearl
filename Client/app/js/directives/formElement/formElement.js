(function (app) {
    "use strict";

    var FormElementDirective = function () {
        return {
            restrict: "A",
            replace: true,
            scope: {
                label: "=",
                type: "=",
                model: "="
            },
            templateUrl: "js/directives/formElement/formElement.html",
        };
    };

    FormElementDirective.$inject = [];
    app.directive("formElement", FormElementDirective);

})(keyPearlClientApp);