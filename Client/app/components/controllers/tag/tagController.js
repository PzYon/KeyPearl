(function (app) {
    "use strict";

    var TagController = function (serverApi, tagHelper, notifier) {

        var c = this;
        var changedTagsHash;

        c.loadTags = function () {
            serverApi.loadTags(ensureTagTree);
        };

        c.setChangedTags = function (tag) {
            if (tag) {
                c.tagTree.tagHash[tag.id] = tag;
                changedTagsHash[tag.id] = tag;
            } else {
                changedTagsHash = {};
            }

            var numberOfChangedTags = Object.keys(changedTagsHash).length;
            var notificationKey = "numberOfChangedTags";
            if (numberOfChangedTags > 0) {
                notifier.addSuccess("you have changed " + numberOfChangedTags + " tag(s)", notificationKey);
            } else {
                notifier.remove(notificationKey);
            }
        };

        c.batchUpdateTags = function () {
            serverApi.updateTags(tagHelper.transformToTagRows(changedTagsHash), handleUpdatedTags);
        };

        var handleUpdatedTags = function (result) {
            var message = "updated " + result.numberOfUpdatedTags + " tags and adjusted " + result.numberOfUpdatedLinks + " link(s)";
            notifier.addSuccess(message, "updateTagsInformation");

            ensureTagTree(result.tags);
        };

        var ensureTagTree = function (tags) {
            c.setChangedTags();
            c.tagTree = tagHelper.buildTree(tags);
        };

        var initialize = function () {
            c.loadTags();
        };

        initialize();

    };

    TagController.$inject = ["serverApi", "tagHelper", "notifier"];
    app.controller("tagController", TagController);

})(keyPearlApp);