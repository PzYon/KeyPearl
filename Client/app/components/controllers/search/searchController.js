(function (app, angular) {
    "use strict";

    var SearchController = function (serverApi, searchHelper, navigator, notifier) {

        var c = this;

        c.navigator = navigator;
        c.searchHelper = searchHelper;

        var setLinks = function (result) {

            c.links = result.links;

            notifier.clear();

            if (!c.links.length) {
                var message = !searchHelper.hasQuery()
                    ? "nothing found - maybe you haven't added any links yet?"
                    : "no links found matching your criteria, please reset and try again...";
                notifier.addError(message);

                return;
            }

            var availableTagsCount = searchHelper.showAvailableTags(c.links);

            var message = "found " + c.links.length + " links with " + availableTagsCount + " different tags applied.";

            if (result.totalLinksCount) {
                message += " results are truncated, in total there are " + result.totalLinksCount + " links." +
                           " you might need to be more precise in order to find what you are actually looking for.";
            }

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

    SearchController.$inject = ["serverApi", "searchHelper", "navigator", "notifier"];
    app.controller("searchController", SearchController);

})(keyPearlApp, angular);