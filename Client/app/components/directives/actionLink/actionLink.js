(function (app) {
    "use strict";

    var ActionLinkDirective = function () {

        return {
            restrict: "A",
            transclude: true,
            scope: {
                action: "&actionLink"
            },
            templateUrl: "components/directives/actionLink/actionLink.html"
        };

    };

    ActionLinkDirective.$inject = [];
    app.directive("actionLink", ActionLinkDirective);

})(keyPearlApp);