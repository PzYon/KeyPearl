var keyPearlApp = (function () {
    "use strict";

    var routing = function ($routeProvider) {
        $routeProvider.when("/", {
            controller: "homeController",
            controllerAs: "c",
            templateUrl: "components/controllers/home/homeController.html"
        }).when("/link/:id?", {
            controller: "linkController",
            controllerAs: "c",
            templateUrl: "components/controllers/link/linkController.html"
        }).otherwise({
            redirectTo: "/"
        });
    };

    var app = angular.module("keyPearl", ["ngRoute"]);
    app.config(routing);

    return app;

})();