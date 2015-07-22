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

        c.setLinks = function (links) {
            c.links = links;

            notifier.clear();

            if (!links.length) {
                notifier.addError("no links found matching your criteria, please reset and try again...");
                return;
            }

            var availableTagsCount = searchHelper.showAvailableTags(links);
            var message = "found " + links.length + " links with " + availableTagsCount + " different tags applied.";
            notifier.addSuccess(message, "searchResultInformation");
        };

        c.loadLinks = function () {
            var tagIds = [];
            angular.forEach(c.selectedTags, function (tag) {
                tagIds.push(tag.id);
            });

            serverApi.loadLinks(c.searchString, tagIds.join(";"), c.setLinks);
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