(function (app) {
    "use strict";

    var HomeController = function (serverApi, searchHelper, navigator, notifier) {

        var c = this;

        c.navigator = navigator;
        c.searchHelper = searchHelper;

        var setLinks = function (links) {
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
            angular.forEach(searchHelper.selectedTags, function (tag) {
                tagIds.push(tag.id);
            });

            serverApi.loadLinks(searchHelper.searchString, tagIds.join(";"), setLinks);
        };

        c.onToggleSelectedTags = function (tag) {
            searchHelper.toggleSelectedTags(tag);
            c.loadLinks();
        };

        c.loadLinks();

    };

    HomeController.$inject = ["serverApi", "searchHelper", "navigator", "notifier"];
    app.controller("homeController", HomeController);

})(keyPearlApp);