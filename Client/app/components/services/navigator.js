(function (app) {
    "use strict";

    var NavigatorService = function ($window, $location, notifier) {

        var goTo = function (key, url) {
            instance.activeKey = key;

            notifier.clear();
            $location.path(url);
        };

        var instance = {
            activeKey: "home",

            goToHome: function () {
                goTo("home", "/");
            },

            goToNewLink: function () {
                goTo("link", "/link");
            },

            goToLink: function (id) {
                goTo("link", "/link/" + id);
            },

            goToTags: function () {
                goTo("manageTags", "/tags");
            }
        };

        // specified separately in order to be able to access "instance"
        instance.navigationNodes = [
            {key: "home", label: "home", action: instance.goToHome},
            {key: "link", label: "add link", action: instance.goToNewLink},
            {key: "manageTags", label: "manage tags", action: instance.goToTags}
        ];

        return instance;

    };

    NavigatorService.$inject = ["$window", "$location", "notifier"];
    app.service("navigator", NavigatorService);

})(keyPearlApp);