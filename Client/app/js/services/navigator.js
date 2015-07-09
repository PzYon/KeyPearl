(function (app) {
    "use strict";

    var Navigator = function ($window) {

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

    Navigator.$inject = ["$window"];
    app.service("navigator", Navigator);

})(keyPearlClientApp);