(function (app, angular) {
    "use strict";

    var SearchHelper = function (serverApi, tagHelper) {

        var selectedTagIds = [];

        var toggleSelectedTag = function (tag, isSelected) {
            isSelected = tag.toggleSelected(isSelected);

            var index = selectedTagIds.indexOf(tag.id);
            if (isSelected && index === -1) {
                instance.selectedTags.push(tag);
                selectedTagIds.push(tag.id);
            } else if (!isSelected && index > -1) {
                instance.selectedTags.splice(index, 1);
                selectedTagIds.splice(index, 1);
            }
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

        var clearTagSearchString = function () {
            instance.tagSearchString = null;
        };

        var resetSelectedTags = function () {
            toggleSelectedTags(instance.selectedTags);
        };

        var showAvailableTags = function (links) {
            return tagHelper.showAvailableTags(links, instance.tagHash);
        };

        var hasQuery = function () {
            return !!instance.tagSearchString || (selectedTagIds && selectedTagIds.length);
        };

        var ensureSelectedTags = function () {
            var tagIds = selectedTagIds.slice(0, selectedTagIds.length);
            selectedTagIds = [];
            instance.selectedTags = [];

            angular.forEach(tagIds, function (tagId) {
                toggleSelectedTag(instance.tagHash[tagId], true);
            });
        };

        var ensureInitialized = function () {
            tagHelper.getTags(function (tagTree) {
                instance.rootTag = tagTree.rootTag;
                instance.tagHash = tagTree.tagHash;
                ensureSelectedTags();
            });
        };

        var instance = {
            selectedTags: [],
            ensureInitialized: ensureInitialized,
            hasQuery: hasQuery,
            toggleSelectedTag: toggleSelectedTag,
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