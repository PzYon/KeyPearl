(function (app) {
    "use strict";

    var HomeController = function (serverApi, tagHelper, navigator, notifier) {

        var c = this;

        c.navigator = navigator;

        var showAvailableTags = function () {

            var distinctIds = [];
            angular.forEach(c.links, function (link) {
                angular.forEach(link.tagIds, function (tagId) {
                    if (distinctIds.indexOf(tagId) === -1) {
                        distinctIds.push(tagId);
                    }
                });
            });

            angular.forEach(c.tagHash, function (tag) {
                tag.toggleVisibility(false);
                for (var i = 0; i < distinctIds.length; i++) {
                    if (tag.isRelatedWith(distinctIds[i])) {
                        tag.toggleVisibility(true);
                        break;
                    }
                }
            });

            return distinctIds.length;
        };

        c.setSelectedTagIds = function (tagId) {
            c.selectedTagIds = tagHelper.toggleSelected(c.selectedTagIds, tagId);
            c.loadLinks();
        };

        c.setSearchString = function (searchString) {
            c.searchString = searchString;
            c.loadLinks();
        };

        c.loadLinks = function () {
            serverApi.loadLinks(c.searchString, c.selectedTagIds.join(";"), c.setLinks);
        };

        c.setLinks = function (links) {
            c.links = links;
            var distinctIdsCount =  showAvailableTags();

            var message = "found " + links.length + " links with " + distinctIdsCount + " different tags applied.";
            notifier.addSuccess(message, "searchResultInformation");
        };

        c.loadTags = function () {
            serverApi.loadTags(c.setTags);
        };

        c.setTags = function (tags) {
            var tree = tagHelper.buildTree(tags);
            c.rootTag = tree.rootTag;
            c.tagHash = tree.tagHash;
        };

        c.initialize = function () {
            c.selectedTagIds = [];
            c.searchString = "";

            c.loadLinks();
            c.loadTags();
        };

        c.initialize();

    };

    HomeController.$inject = ["serverApi", "tagHelper", "navigator", "notifier"];
    app.controller("homeController", HomeController);

})(keyPearlApp);