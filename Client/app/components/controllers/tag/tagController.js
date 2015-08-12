(function (app) {
    "use strict";

    var TagController = function (serverApi, tagHelper, notifier) {

        var c = this;
        var changedTagsHash = {};

        c.getTags = function () {
            notifier.clear();

            tagHelper.getTags(function (tagTree) {
                c.tagTree = tagTree;
            });
        };

        c.setChangedTags = function (tag) {
            if (tag) {
                c.tagTree.tagHash[tag.id] = tag;
                changedTagsHash[tag.id] = tag;
            } else {
                changedTagsHash = {};
            }

            var notificationKey = "numberOfChangedTags";
            var numberOfChangedTags = Object.keys(changedTagsHash).length;
            if (numberOfChangedTags > 0) {
                notifier.addSuccess("you have changed " + numberOfChangedTags + " tag(s)", notificationKey);
            } else {
                notifier.remove(notificationKey);
            }
        };

        c.batchUpdateTags = function () {
            tagHelper.updateTags(changedTagsHash, function (tagTree) {
                c.tagTree = tagTree;
            });
        };

        c.getTags();

    };

    TagController.$inject = ["serverApi", "tagHelper", "notifier"];
    app.controller("tagController", TagController);

})(keyPearlApp);