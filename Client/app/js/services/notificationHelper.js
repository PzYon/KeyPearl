(function (app) {
    "use strict";

    var NotificationHelper = function ($timeout) {

        var instance = {
            pendingRequests: 0,
            notifications: [],
            add: function (message, isError) {
                instance.notifications.push({
                    message: message,
                    isError: isError
                });

                $timeout(function(){
                   var index = instance.notifications.indexOf(message);
                    instance.notifications.splice(index, 1);
                }, 15000);
            }
        };

        return instance;
    };

    NotificationHelper.$inject = ["$timeout"];
    app.service("notificationHelper", NotificationHelper);

})(keyPearlClientApp);