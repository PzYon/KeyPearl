(function (app) {
    "use strict";

    var ActionLinkDirective = function () {

        return {
            restrict: "A",
            transclude: true,
            scope: {
                action: "&actionLink"
            },
            templateUrl: "components/directives/actionLink/actionLink.html",
            link: function (scope) {
                scope.noAction = function(){
                };
            }
        };

    };

    ActionLinkDirective.$inject = [];
    app.directive("actionLink", ActionLinkDirective);

})(keyPearlApp);