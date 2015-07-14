(function (app) {
    "use strict";

    var TagController = function (serverApi, tagHelper) {
        var c = this;

        var changedTagsHash = {};

        c.numberOfChangedTags = 0;

        c.setChangedTags = function (tag) {
            c.tagTree.tagHash[tag.id] = tag;
            changedTagsHash[tag.id] = tag;
            c.numberOfChangedTags = Object.keys(changedTagsHash).length;
        };

        c.batchUpdateTags = function () {
            serverApi.updateTags(tagHelper.transformToTagRows(changedTagsHash), function(updatedTags){
               alert("You just updated " + updatedTags.length + " tag(s).");
            });
        };

        var initialize = function () {
            serverApi.loadTags(function (tags) {
                c.tagTree = tagHelper.buildTree(tags);
            });
        };

        initialize();
    };

    TagController.$inject = ["serverApi", "tagHelper"];
    app.controller("tagController", TagController);

})(keyPearlApp);