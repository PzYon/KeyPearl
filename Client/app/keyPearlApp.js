var keyPearlApp = (function (angular) {
    "use strict";

    var app = angular.module("keyPearl", ["ngRoute", "ngTouch", "ngAnimate"]);

    var config = function ($routeProvider) {
        $routeProvider.when("/", {
            controller: "searchController",
            controllerAs: "c",
            templateUrl: "components/controllers/search/searchController.html"
        }).when("/link/:id?", {
            controller: "linkController",
            controllerAs: "c",
            templateUrl: "components/controllers/link/linkController.html"
        }).when("/tags/", {
            controller: "tagController",
            controllerAs: "c",
            templateUrl: "components/controllers/tag/tagController.html"
        }).otherwise({
            redirectTo: "/"
        });
    };

    config.$inject = ["$routeProvider"];

    app.config(config);

    return app;

})(angular);