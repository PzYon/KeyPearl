(function (app, angular) {
    "use strict";

    var SearchHelper = function (serverApi, tagHelper) {

        var selectedTagIds = [];

        var tagHelperId = "searchHelper";

        var toggleSelectedTag = function (tag, isSelected) {
            if (angular.isNumber(tag)){
                tag = instance.tagHash[tag];
            }

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

        var showAllTags = function () {
            tagHelper.showAllTags(instance.tagHash);
        };

        var clearTagSearchString = function () {
            instance.tagSearchString = null;
        };

        var resetSelectedTags = function () {
            instance.clearTagSearchString();

            // we need to copy array in order to have a different reference than
            // what toggleSelectedTag is using, as otherwise we chang the array
            // we are iterating over
            var tagIds = angular.copy(selectedTagIds);

            angular.forEach(tagIds, function (tagId) {
                toggleSelectedTag(tagId, false);
            });
        };

        var showAvailableTags = function (links) {
            return tagHelper.showAvailableTags(links, instance.tagHash);
        };

        var hasQuery = function () {
            return !!instance.tagSearchString || (selectedTagIds && selectedTagIds.length);
        };

        var ensureSelectedTags = function () {
            var tagIds = angular.copy(selectedTagIds);
            selectedTagIds = [];
            instance.selectedTags = [];

            angular.forEach(tagIds, function (tagId) {
                toggleSelectedTag(tagId, true);
            });
        };

        var ensureInitialized = function () {
            tagHelper.getTags(tagHelperId, function (tagTree) {
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