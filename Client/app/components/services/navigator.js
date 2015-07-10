(function (app) {
    "use strict";

    var NavigatorService = function ($window) {

        var goTo = function (url) {
            $window.location.hash = "#" + url;
        };

        var instance = {
            goToHome: function () {
                goTo("/");
            },

            goToNewLink: function () {
                goTo("/link/");
            },

            goToLink: function (id) {
                goTo("/link/" + id);
            }
        };

        // specified here in order to be able to access "instance"
        instance.navigationNodes = [
            {label: "home", action: instance.goToHome},
            {label: "new link", action: instance.goToNewLink}
        ];

        return instance;

    };

    NavigatorService.$inject = ["$window"];
    app.service("navigator", NavigatorService);

})(keyPearlApp);