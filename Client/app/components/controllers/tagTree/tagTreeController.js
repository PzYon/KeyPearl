(function (app) {
    "use strict";

    var TagTreeController = function ($routeParams, serverApi, tagHelper, notifier) {

        var c = this;
        var changedTagsHash = {};

        var tagHelperId = "tagTree";

        c.getTags = function () {
            tagHelper.getTags(tagHelperId, function (tagTree) {
                c.tagTree = tagTree;

                var id = $routeParams.id;
                if (id) {
                    var tag = c.tagTree.tagHash[id];
                    tag.ensureExpanded();
                    tag.isHighlighted = true;
                }
            }, true);
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
            tagHelper.updateTags(tagHelperId, changedTagsHash, function (tagTree) {
                c.setChangedTags();
                c.tagTree = tagTree;
            });
        };

        c.getTags();

    };

    TagTreeController.$inject = ["$routeParams", "serverApi", "tagHelper", "notifier"];
    app.controller("tagTreeController", TagTreeController);

})(keyPearlApp);