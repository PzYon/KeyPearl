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
            templateUrl: "components/directives/formElement/formElement.html",
        };
    };

    FormElementDirective.$inject = [];
    app.directive("formElement", FormElementDirective);

})(keyPearlApp);