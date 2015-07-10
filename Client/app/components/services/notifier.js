(function (app) {
    "use strict";

    var NotifierService = function ($timeout) {

        var instance = {
            pendingRequests: 0,
            notifications: [],
            add: function (message, isError) {

                // todo:
                // - consider waiting one second or so to prevent flashing notifications for fast requests
                //   --> what if we have two requests at the same time!?
                // - consider adding an overload for addError, addSuccess, addInfo, etc.

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

    NotifierService.$inject = ["$timeout"];
    app.service("notifier", NotifierService);

})(keyPearlApp);