(function (app, angular) {
    "use strict";

    // todo: consider adding a template html containing pre- and after-elements (e.g. "[" and "]")
    var SeparatedElementsDirective = function (config) {

        var className = "separator-element";

        var isSeparator = function (e) {
            return angular.element(e).hasClass(className);
        };

        var addSeparators = function (element, separator) {
            var children = element.children();

            angular.forEach(children, function (child, i) {
                var isFirst = i === 0;
                var isLast = i + 1 === children.length;
                child = angular.element(child);

                if ((isFirst || isLast) && isSeparator(child)) {
                    child.remove();
                } else if (!isLast && !isSeparator(children[i + 1])) {
                    child.after("<span class='" + className + "'>" + separator + "</span>");
                }
            });
        };

        var link = function (scope, element) {

            var separator = scope.separator || config.defaultElementSeparator;
            var lastChildCount = 0;

            scope.$watch(function () {
                if (element.children().length !== lastChildCount) {
                    addSeparators(element, separator);
                    // count after adding element in order to have correct amount of children
                    lastChildCount = element.children().length;
                }
            });

        };

        return {
            restrict: "A",
            replace: true,
            scope: {
                separator: "=separatedElements"
            },
            template: "",
            link: link
        };

    };

    SeparatedElementsDirective.$inject = ["config"];
    app.directive("separatedElements", SeparatedElementsDirective);

})(keyPearlApp, angular);