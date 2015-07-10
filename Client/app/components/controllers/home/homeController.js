(function (app) {
    "use strict";

    var HomeController = function (serverApi, tagHelper, navigator) {
        var c = this;

        c.navigator = navigator;

        c.selectTag = function (tagId) {
            c.selectedTagIds = tagHelper.toggleSelected(c.selectedTagIds, tagId);
            c.loadLinks();
        };

        c.setSearchString = function(searchString){
            c.searchString = searchString;
            c.loadLinks();
        };

        c.loadLinks = function () {
            serverApi.loadLinks(c.searchString, c.selectedTagIds.join(";"), c.setLinks);
        };

        c.setLinks = function (links) {
            c.links = links;
        };

        c.loadTags = function () {
            serverApi.loadTags(c.setTags);
        };

        c.setTags = function (tags) {
            c.tags = tagHelper.buildTree(tags);
        };

        c.initialize = function () {
            c.selectedTagIds = [];
            c.searchString = "";

            c.loadLinks();
            c.loadTags();
        };

        c.initialize();
    };

    HomeController.$inject = ["serverApi", "tagHelper", "navigator"];
    app.controller("homeController", HomeController);

})(keyPearlApp);