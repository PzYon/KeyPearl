(function (app) {
    "use strict";

    var TagController = function ($routeParams, serverApi, dateHelper, tagHelper, notifier, navigator) {

        var c = this;
        c.dateHelper = dateHelper;
        c.navigator = navigator;

        var tagHelperId = "tag";

        c.deleteTag = function () {
            tagHelper.deleteTag(tagHelperId, c.tag, function (reult) {
                navigator.goToTags(true);
            });
        };

        c.updateTag = function () {
            var tagHash = {};
            tagHash[c.tag.id] = c.tag;

            tagHelper.updateTags(tagHelperId, tagHash, function (tagTree) {
                c.tag = tagTree.tagHash[c.tag.id];
                notifier.addSuccess("updated '" + c.tag.name + "'");
            });
        };

        c.getDeleteTagConfirmationMessage = function () {
            return "are you sure you want to delete tag '" + c.tag.name + "' and "
                   + (c.tag.countChildren() - 1) + " child tag(s)?";
        };

        var initialize = function () {
            var id = $routeParams.id;
            if (id) {
                tagHelper.getTags(tagHelperId, function (tagTree) {
                    c.tagTree = tagTree;
                    c.tag = c.tagTree.tagHash[id];

                    if (!c.tag) {
                        navigator.goToTags();
                    }
                });
            }
        };

        initialize();
    };

    TagController.$inject = ["$routeParams", "serverApi", "dateHelper", "tagHelper", "notifier", "navigator"];
    app.controller("tagController", TagController);

})(keyPearlApp);