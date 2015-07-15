(function (app) {
    "use strict";

    var TagController = function (serverApi, tagHelper) {

        var c = this;
        var changedTagsHash;

        c.loadTags = function () {
            serverApi.loadTags(ensureTagTree);
        };

        c.setChangedTags = function (tag) {
            c.tagTree.tagHash[tag.id] = tag;
            changedTagsHash[tag.id] = tag;
            c.numberOfChangedTags = Object.keys(changedTagsHash).length;
        };

        c.batchUpdateTags = function () {
            serverApi.updateTags(tagHelper.transformToTagRows(changedTagsHash), ensureTagTree);
        };

        var ensureTagTree = function (tags) {
            changedTagsHash = {};
            c.numberOfChangedTags = 0;

            c.tagTree = tagHelper.buildTree(tags);
        };

        var initialize = function () {
            c.loadTags();
        };

        initialize();

    };

    TagController.$inject = ["serverApi", "tagHelper"];
    app.controller("tagController", TagController);

})(keyPearlApp);