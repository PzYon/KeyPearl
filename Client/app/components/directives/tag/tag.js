(function (app) {
    "use strict";

    var TagDirective = function () {

        return {
            restrict: "A",
            scope: {
                tag: "=",
                onClick: "="
            },
            templateUrl: "components/directives/tag/tag.html",
            link: function (scope) {

                scope.tagHierarchy = scope.tag.getHierarchyTopDown();

                scope.onMouseOver = function () {
                    scope.isHover = true;
                };

                scope.onMouseLeave = function () {
                    scope.isHover = false;
                };

            }
        };

    };

    TagDirective.$inject = [];
    app.directive("tag", TagDirective);

})(keyPearlApp);