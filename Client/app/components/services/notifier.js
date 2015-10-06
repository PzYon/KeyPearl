(function (app, angular) {
    "use strict";

    var NotifierService = function () {

        var add = function (message, isError, key) {
            var messageObject = !angular.isObject(message)
                ? {message: message}
                : message;

            messageObject.isError = messageObject.isError || isError;
            messageObject.key = messageObject.key || key;

            if (messageObject.key) {
                remove(messageObject.key);
            }

            instance.notifications.push(messageObject);
        };

        var addError = function addError(message, key) {
            add(message, true, key);
        };

        var addSuccess = function addSuccess(message, key) {
            add(message, false, key);
        };

        var clear = function () {
            instance.notifications = [];
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

        var instance = {
            pendingRequests: 0,
            notifications: [],
            addError: addError,
            addSuccess: addSuccess,
            remove: remove,
            clear: clear
        };

        return instance;
    };

    NotifierService.$inject = [];
    app.service("notifier", NotifierService);

})(keyPearlApp, angular);