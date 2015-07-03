(function (app) {
    "use strict";

    var ListController = function (serverApi) {
        var c = this;

        c.loadLinks = function (searchString, tagIds) {
            serverApi.getLinks(searchString, tagIds, c.setLinks, c.handleError);
        };

        c.setLinks = function (links) {
            c.links = links;
        };

        c.handleError = function(){
            alert("error!");
        };

        c.initialize = function () {
            c.loadLinks();
        };

        c.initialize();
    };

    ListController.$inject = ["ServerApi"];
    app.controller("ListController", ListController);

})(keyPearlClientApp);