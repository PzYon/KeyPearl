(function (app) {
    "use strict";

    // reference: http://sporto.github.io/blog/2013/06/24/nested-recursive-directives-in-angular/
    var TagTreeDirective = function () {

        return {
            restrict: "A",
            scope: {
                tagTree: "=",
                onSelect: "&",
                onSelectFunction: "=",
                onChange: "&",
                onChangeFunction: "=",
                isEditable: "="
            },
            templateUrl: "components/directives/tagTree/tagTree.html",
            link: function (scope) {
                scope.addTopLevelTag = function () {
                    scope.tagTree.addChild(null, true);
                };

                scope.canDropRoot = function () {
                    return true;
                };

                scope.onDropRoot = function (tag) {
                    scope.tagTree.addChild(tag);
                    scope.$apply();
                    // we don't need to remove tag from original parent is tag-object is
                    // updated accordingly here and scope is applied (-> old tag is child scope)
                };
            }
        };

    };

    TagTreeDirective.$inject = [];
    app.directive("tagTree", TagTreeDirective);

})(keyPearlApp);