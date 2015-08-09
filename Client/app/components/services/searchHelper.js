(function (app, angular) {
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

        var clearTagSearchString = function () {
            instance.tagSearchString = null;
        };

        var resetSelectedTags = function () {
            angular.forEach(instance.tagHash, function (tag) {
                toggleSelectedTag(tag, false);
            });
        };

        var toggleSelectedTags = function (tags) {
            instance.clearTagSearchString();
            if (angular.isArray(tags)) {
                angular.forEach(tags, toggleSelectedTag);
            } else {
                toggleSelectedTag(tags);
            }
        };

        var showAllTags = function () {
            tagHelper.showAllTags(instance.tagHash);
        };

        var showAvailableTags = function (links) {
            return tagHelper.showAvailableTags(links, instance.tagHash);
        };

        var hasQuery = function () {
            return !!instance.tagSearchString || (instance.selectedTags && instance.selectedTags.length);
        };

        loadTags();

        var instance = {
            selectedTags: [],
            hasQuery: hasQuery,
            toggleSelectedTags: toggleSelectedTags,
            showAllTags: showAllTags,
            showAvailableTags: showAvailableTags,
            resetSelectedTags: resetSelectedTags,
            clearTagSearchString: clearTagSearchString
        };

        return instance;

    };

    SearchHelper.$inject = ["serverApi", "tagHelper"];
    app.service("searchHelper", SearchHelper);

})(keyPearlApp, angular);