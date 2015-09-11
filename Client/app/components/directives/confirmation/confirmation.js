(function (app, angular) {
    "use strict";

    var ConfirmationDirective = function () {

        return {
            restrict: "A",
            transclude: true,
            scope: {
                onOkAction: "=",
                confirmationMessage: "=?confirmation",
                messageGetter: "&?"
            },
            templateUrl: "components/directives/confirmation/confirmation.html",
            link: function (scope) {

                scope.toggleConfirmationMessage = function (show) {
                    show = angular.isDefined(show)
                        ? show
                        : !scope.showConfirmationMessage;

                    if (show && angular.isFunction(scope.messageGetter)) {
                        scope.confirmationMessage = scope.messageGetter()();
                    }

                    scope.showConfirmationMessage = show;
                };

            }
        };

    };

    ConfirmationDirective.$inject = [];
    app.directive("confirmation", ConfirmationDirective);

})(keyPearlApp, angular);