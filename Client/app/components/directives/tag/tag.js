(function (app) {
    "use strict";

    var TagDirective = function (mobile) {

        var link = function (scope, element) {

            scope.tagHierarchy = scope.tag.getHierarchyTopDown();

            scope.onMouseOver = function () {
                scope.isHover = !mobile.isTouch();
            };

            scope.onMouseLeave = function () {
                scope.isHover = false;
            };

            if (mobile.isTouch()) {
                var handler = function () {
                    scope.isHover = true;
                    scope.$apply();
                };

                element.on("click", handler);

                scope.$on("$destroy", function () {
                    element.off("click", handler);
                });
            }

        };

        return {
            restrict: "A",
            scope: {
                tag: "=",
                onClick: "="
            },
            templateUrl: "components/directives/tag/tag.html",
            link: link
        };

    };

    TagDirective.$inject = ["mobile"];
    app.directive("tag", TagDirective);

})(keyPearlApp);