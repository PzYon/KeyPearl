(function (app) {
    "use strict";

    var NavigatorService = function ($window, $location, notifier) {

        var instance = {
            navigationNodes: [
                {url: "/", label: "search"},
                {url: "/link/", label: "add link"},
                {url: "/tags/", label: "manage tags"}
            ],

            goTo: function (url, retainNotifications) {
                if (!retainNotifications) {
                    notifier.clear();
                }

                $location.path(url);
            },

            goToHome: function () {
                instance.goTo("/");
            },

            goToLink: function (id) {
                instance.goTo("/link/" + id);
            },

            goToNewLink: function () {
                instance.goToLink("");
            },

            goToTags: function (retainNotifications) {
                instance.goTo("/tags/", retainNotifications);
            },

            goToTagInTree: function (id) {
                instance.goTo("/tags/" + id);
            },

            goToTagDetails: function (id) {
                instance.goTo("/tag/" + id);
            },

            getCurrentPath: function () {
                return $location.path();
            }
        };

        return instance;

    };

    NavigatorService.$inject = ["$window", "$location", "notifier"];
    app.service("navigator", NavigatorService);

})(keyPearlApp);