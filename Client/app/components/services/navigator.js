(function (app) {
    "use strict";

    var NavigatorService = function ($window, $location, notifier) {

        var instance = {
            navigationNodes: [
                {url: "/", label: "search"},
                {url: "/link/", label: "add link"},
                {url: "/tags/", label: "manage tags"}
            ],

            goTo: function (url) {
                notifier.clear();
                $location.path(url);
            },

            goToLink: function (id) {
                instance.goTo("/link/" + id);
            },

            goToTag: function (id) {
                instance.goTo("/tags/" + id);
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