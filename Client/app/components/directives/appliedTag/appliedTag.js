(function (app) {
    "use strict";

    var AppliedTag = function () {

        return {
            restrict: "A",
            scope: {
                tagHierarchy: "=appliedTag"
            },
            templateUrl: "components/directives/appliedTag/appliedTag.html",
            link: function (scope) {
                scope.tag = scope.tagHierarchy[scope.tagHierarchy.length - 1];

                scope.onMouseOver = function () {
                    scope.isHover = true;
                };

                scope.onMouseLeave = function () {
                    scope.isHover = false;
                };
            }
        };

    };

    AppliedTag.$inject = [];
    app.directive("appliedTag", AppliedTag);

})(keyPearlApp);