(function (app, angular) {
    "use strict";

    var SearchController = function (serverApi, searchHelper, navigator, notifier) {

        var c = this;

        c.navigator = navigator;
        c.searchHelper = searchHelper;

        var setLinks = function (result) {

            c.links = result.data;

            notifier.clear();

            if (!c.links.length) {
                var errorMessage = !searchHelper.hasQuery()
                    ? "nothing found - maybe you haven't added any links yet?"
                    : "no links found matching your criteria, please reset and try again...";
                notifier.addError(errorMessage);

                return;
            }

            var message;

            var totalLinksCount = result.info.totalLinksCount;
            if (totalLinksCount) {
                searchHelper.showAllTags();
                message = "loaded " + c.links.length + " links. results are truncated, in total there are " +
                          totalLinksCount + " links. you might need to be more precise in order to find" +
                          " what you are actually looking for.";
            } else {
                var availableTagsCount = searchHelper.showAvailableTags(c.links);
                message = "found " + c.links.length + " links with " + availableTagsCount + " different tags applied.";
            }

            notifier.addSuccess(message + " time used: " + result.serverTimeInMs + "ms", "searchResultInformation");
        };

        c.loadLinks = function () {
            var tagIds = [];
            angular.forEach(searchHelper.selectedTags, function (tag) {
                tagIds.push(tag.id);
            });

            serverApi.searchLinks(searchHelper.searchString, tagIds.join(";"), setLinks);
        };

        c.onToggleSelectedTag = function (tag) {
            searchHelper.toggleSelectedTag(tag);
            c.loadLinks();
        };

        c.searchHelper.ensureInitialized();
        c.loadLinks();

    };

    SearchController.$inject = ["serverApi", "searchHelper", "navigator", "notifier"];
    app.controller("searchController", SearchController);

})(keyPearlApp, angular);