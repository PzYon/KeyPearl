(function (app, angular) {
    "use strict";

    var DropdownDirective = function ($document,config) {

        var keyCodes = {
            tab: 9,
            enter: 13,
            esc: 27,
            up: 38,
            down: 40
        };

        var link = function (scope) {

            var onKeyDown = function (event) {
                switch (event.keyCode) {
                case keyCodes.up:
                    scope.moveActive(event, false);
                    break;
                case keyCodes.down:
                    scope.moveActive(event, true);
                    break;
                case keyCodes.tab:
                case keyCodes.enter:
                    if (scope.activeItemIndex > -1) {
                        scope.onSelect()(scope.items[scope.activeItemIndex]);
                    }
                    break;
                case keyCodes.esc:
                    scope.onExit();
                    scope.$apply();
                    break;
                }
            };

            scope.dropdownItemLimit = config.dropdownItemLimit;

            scope.moveActive = function (event, isDown) {
                event.preventDefault();

                var newIndex = angular.isUndefined(scope.activeItemIndex)
                    ? 0
                    : scope.activeItemIndex + (isDown ? 1 : -1);

                if (newIndex >= scope.items.length || newIndex < 0) {
                    return;
                }

                scope.activeItemIndex = newIndex;
                scope.$apply();
            };

            $document.on("keydown", onKeyDown);

            scope.$on("$destroy", function () {
                $document.off("keydown", onKeyDown);
            });
        };

        return {
            restrict: "A",
            scope: {
                items: "=dropdown",
                onSelect: "&",
                onExit: "="
            },
            templateUrl: "components/directives/dropdown/dropdown.html",
            link: link
        };

    };

    DropdownDirective.$inject = ["$document", "config"];
    app.directive("dropdown", DropdownDirective);

})(keyPearlApp, angular);