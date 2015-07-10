(function (app) {
    "use strict";

    // reference: http://sporto.github.io/blog/2013/06/24/nested-recursive-directives-in-angular/
    var TagTreeDirective = function () {

        return {
            restrict: "A",
            scope: {
                tagTree: "=",
                onSelect: "&",
                onSelectFunction: "="
            },
            templateUrl: "components/directives/tagTree/tagTree.html"
        };

    };

    TagTreeDirective.$inject = [];
    app.directive("tagTree", TagTreeDirective);

})(keyPearlApp);