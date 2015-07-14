(function (app) {
    "use strict";

    var NotifierService = function ($timeout, config) {

        var add = function (message, isError) {

            instance.notifications.push({
                message: message,
                isError: isError
            });

            $timeout(function () {
                var index = instance.notifications.indexOf(message);
                instance.notifications.splice(index, 1);
            }, config.removeNotificationsAfter);
        };

        var instance = {
            pendingRequests: 0,
            notifications: [],
            addError: function addError(message) {
                add(message, true);
            },
            addSuccess: function addSuccess(message) {
                add(message);
            }
        };

        return instance;
    };

    NotifierService.$inject = ["$timeout", "config"];
    app.service("notifier", NotifierService);

})(keyPearlApp);