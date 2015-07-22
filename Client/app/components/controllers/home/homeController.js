(function (app) {
    "use strict";

    var HomeController = function (serverApi, searchHelper, navigator, notifier) {

        var c = this;

        c.navigator = navigator;
        c.searchHelper = searchHelper;

        c.setSelectedTags = function (tags) {
            c.selectedTags = tags;
            c.loadLinks();
        };

        c.setSearchString = function (searchString) {
            c.searchString = searchString;
            c.loadLinks();
        };

        c.loadLinks = function () {
            var tagIds = [];
            angular.forEach(c.selectedTags, function (tag) {
                tagIds.push(tag.id);
            });

            serverApi.loadLinks(c.searchString, tagIds.join(";"), c.setLinks);
        };

        c.setLinks = function (links) {
            c.links = links;
            var availableTagsCount = searchHelper.showAvailableTags(links);

            var message = "found " + links.length + " links with " + availableTagsCount + " different tags applied.";
            notifier.addSuccess(message, "searchResultInformation");
        };

        c.initialize = function () {
            c.selectedTags = [];
            c.searchString = "";

            c.loadLinks();
        };

        c.initialize();

    };

    HomeController.$inject = ["serverApi", "searchHelper", "navigator", "notifier"];
    app.controller("homeController", HomeController);

})(keyPearlApp);