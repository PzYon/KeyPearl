(function (app) {
    "use strict";

    var Navigator = function ($window) {

        function goTo(url) {
            $window.location.hash = "#" + url;
        }

        return {
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

    };

    Navigator.$inject = ["$window"];
    app.service("navigator", Navigator);

})(keyPearlClientApp);