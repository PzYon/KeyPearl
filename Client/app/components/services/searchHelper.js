(function (app) {
    "use strict";

    var SearchHelper = function (serverApi, tagHelper) {

        var loadTags = function () {
            serverApi.loadTags(function (tags) {
                var tree = tagHelper.buildTree(tags);
                instance.rootTag = tree.rootTag;
                instance.tagHash = tree.tagHash;
            });
        };

        var toggleSelectedTag = function (tag, isSelected) {
            isSelected = instance.tagHash[tag.id].toggleSelected(isSelected);

            var index = instance.selectedTags.indexOf(tag);
            if (isSelected && index === -1) {
                instance.selectedTags.push(tag);
            } else if (!isSelected && index > -1) {
                instance.selectedTags.splice(index, 1);
            }
        };

        var resetSelectedTags = function () {
            angular.forEach(instance.tagHash, function (tag) {
                toggleSelectedTag(tag, false);
            });
        };

        var toggleSelectedTags = function (tags) {
            instance.tagSearchString = null;
            if (angular.isArray(tags)) {
                angular.forEach(tags, toggleSelectedTag);
            } else {
                toggleSelectedTag(tags);
            }
        };

        var showAvailableTags = function (links) {
            return tagHelper.showAvailableTags(links, instance.tagHash);
        };

        loadTags();

        var instance = {
            selectedTags: [],
            toggleSelectedTags: toggleSelectedTags,
            showAvailableTags: showAvailableTags,
            resetSelectedTags: resetSelectedTags
        };

        return instance;

    };

    SearchHelper.$inject = ["serverApi", "tagHelper"];
    app.service("searchHelper", SearchHelper);

})(keyPearlApp);