(function (app) {
    "use strict";

    var NavigationDirective = function (navigator) {
        return {
            restrict: "A",
            replace: true,
            templateUrl: "components/directives/navigation/navigation.html",
            link: function (scope) {
                scope.navigator = navigator;
            }
        };
    };

    NavigationDirective.$inject = ["navigator"];
    app.directive("navigation", NavigationDirective);

})(keyPearlApp);