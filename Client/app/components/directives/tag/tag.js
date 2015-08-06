(function (app) {
    "use strict";

    var TagDirective = function (mobile) {

        return {
            restrict: "A",
            scope: {
                tag: "=",
                onClick: "="
            },
            templateUrl: "components/directives/tag/tag.html",
            link: function (scope, element) {

                scope.tagHierarchy = scope.tag.getHierarchyTopDown();

                scope.onMouseOver = function () {
                    scope.isHover = !mobile.isTouch();
                };

                scope.onMouseLeave = function () {
                    scope.isHover = false;
                };

                if (mobile.isTouch()) {
                    element.on("click", function () {
                        // todo: DEREGISTER!!
                        scope.isHover = true;
                        scope.$apply();
                    });
                }

            }
        };

    };

    TagDirective.$inject = ["mobile"];
    app.directive("tag", TagDirective);

})(keyPearlApp);