(function (app) {
    "use strict";

    var NotificationsDirective = function ($timeout, config, notifier) {

        var delayPendingRequests = function (scope) {
            scope.hidePendingRequests = true;

            $timeout(function () {
                if (scope.notifier.pendingRequests) {
                    scope.hidePendingRequests = false;
                }
            }, config.showPendingRequestsAfter);
        };

        var link = function (scope) {
            scope.notifier = notifier;

            scope.$watch("notifier.pendingRequests", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    delayPendingRequests(scope);
                }
            });
        };

        return {
            restrict: "A",
            replace: true,
            templateUrl: "components/directives/notifications/notifications.html",
            link: link
        };

    };

    NotificationsDirective.$inject = ["$timeout", "config", "notifier"];
    app.directive("notifications", NotificationsDirective);

})(keyPearlApp);