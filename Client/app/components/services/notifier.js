(function (app) {
    "use strict";

    var NotifierService = function () {

        var add = function (message, isError, key) {
            if (key) {
                remove(key);
            }

            instance.notifications.push({
                key: key,
                message: message,
                isError: isError
            });
        };

        var remove = function (notificationOrKey) {
            if (angular.isObject(notificationOrKey)) {
                var index = instance.notifications.indexOf(notificationOrKey);
                if (index > -1) {
                    instance.notifications.splice(index, 1);
                }
            } else {
                for (var i = 0; i < instance.notifications.length; i++) {
                    var notification = instance.notifications[i];
                    if (notification && notification.key === notificationOrKey) {
                        instance.notifications.splice(i, 1);
                        break;
                    }
                }
            }
        };

        var clear = function () {
            instance.notifications = [];
        };

        var instance = {
            pendingRequests: 0,
            notifications: [],
            addError: function addError(message) {
                add(message, true);
            },
            addSuccess: function addSuccess(message, key) {
                add(message, false, key);
            },
            remove: remove,
            clear: clear
        };

        return instance;
    };

    NotifierService.$inject = [];
    app.service("notifier", NotifierService);

})(keyPearlApp);