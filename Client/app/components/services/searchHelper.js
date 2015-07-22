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

        var toggleSelectedTag = function (tag) {
            var isSelected = instance.tagHash[tag.id].toggleSelected();
            var index = instance.selectedTags.indexOf(tag);
            if (isSelected && index === -1) {
                instance.selectedTags.push(tag);
            } else if (!isSelected && index > -1) {
                instance.selectedTags.splice(index, 1);
            }
        };

        var toggleSelectedTags = function (tags) {
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
            showAvailableTags: showAvailableTags
        };

        return instance;

    };

    SearchHelper.$inject = ["serverApi", "tagHelper"];
    app.service("searchHelper", SearchHelper);

})(keyPearlApp);