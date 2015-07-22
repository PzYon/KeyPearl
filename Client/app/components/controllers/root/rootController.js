(function (app) {
    "use strict";

    var RootController = function (navigator, notifier) {
        this.navigator = navigator;
        this.notifier = notifier;
    };

    RootController.$inject = ["navigator", "notifier"];
    app.controller("rootController", RootController);

})(keyPearlApp);