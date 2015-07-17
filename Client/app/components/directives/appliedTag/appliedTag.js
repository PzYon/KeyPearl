(function (app) {
    "use strict";

    var AppliedTagDirective = function () {

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

    AppliedTagDirective.$inject = [];
    app.directive("appliedTag", AppliedTagDirective);

})(keyPearlApp);