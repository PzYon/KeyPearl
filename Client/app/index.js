var keyPearlClientApp = (function () {
    "use strict";

    var routing = function ($routeProvider) {
        $routeProvider.when("/", {
            controller: "ListController",
            controllerAs: "c",
            templateUrl: "js/controllers/list/listController.html"
        }).otherwise({
            redirectTo: "/"
        });
    };

    var app = angular.module("keyPearl", ["ngRoute"]);
    app.config(routing);

    var RootController = function () {
    };

    RootController.$inject = [];
    app.controller("RootController", RootController);

    return app;

})();