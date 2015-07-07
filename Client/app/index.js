var keyPearlClientApp = (function () {
    "use strict";

    var routing = function ($routeProvider) {
        $routeProvider.when("/", {
            controller: "listController",
            controllerAs: "c",
            templateUrl: "js/controllers/list/listController.html"
        }).when("/link/:id?", {
            controller: "manageLinkController",
            controllerAs: "c",
            templateUrl: "js/controllers/manageLinkController/manageLinkController.html"
        }).otherwise({
            redirectTo: "/"
        });
    };

    var app = angular.module("keyPearl", ["ngRoute"]);
    app.config(routing);

    var RootController = function (navigator, notificationHelper) {
        this.navigator = navigator;
        this.notificationHelper = notificationHelper;
    };

    RootController.$inject = ["navigator", "notificationHelper"];
    app.controller("rootController", RootController);

    return app;

})();