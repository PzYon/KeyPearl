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

    var RootController = function (navigator) {
        this.navigator = navigator;
    };

    RootController.$inject = ["navigator"];
    app.controller("rootController", RootController);

    return app;

})();