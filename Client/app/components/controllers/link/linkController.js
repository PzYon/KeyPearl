(function (app) {
    "use strict";

    var LinkController = function ($scope, $routeParams, $interval, serverApi, tagHelper, dateHelper, navigator, notifier) {

        // todo: add some validation (required: yes/no, format: regex, etc.)

        var c = this;

        c.dateHelper = dateHelper;

        // required for $watch to work correctly
        c.link = {
            id: 0
        };

        var setLink = function (link) {
            if (link) {
                c.link = link;
            } else {
                notifier.addError("cannot find link.. maybe it doesn't exist anymore?");
            }
        };

        var onTagsLoaded = function (tagTree) {
            c.rootTag = tagTree.rootTag;

            var deregisterWatch = $scope.$watch("c.link.id", function () {
                if (c.link.id) {
                    tagHelper.applySettings(tagTree.tagHash, {selectedIds: c.link.tagIds});
                    deregisterWatch();
                }
            });
        };

        var initialize = function () {
            var id = $routeParams.id;
            if (id) {
                c.actionName = "Change";
                serverApi.loadLink(id, setLink);
            } else {
                c.actionName = "Create";
            }

            tagHelper.getTags(onTagsLoaded);
        };

        c.toggleAppliedTag = function (tag) {
            tag.toggleSelected();
            tagHelper.toggleApplied(c.link, tag.id);
        };

        c.updateLink = function () {

            var isCreate = !c.link.id;

            serverApi.updateLink(c.link, function (updatedLink) {
                var executedAction;
                if (isCreate) {
                    // we need to navigate to correct url
                    executedAction = "added";
                    navigator.goToLink(updatedLink.id);
                } else {
                    // we simply need to update the link with new server value
                    executedAction = "changed";
                    c.link = updatedLink;
                }

                notifier.addSuccess(executedAction + " link '" + updatedLink.name + "'");
            });

        };

        initialize();
    };

    LinkController.$inject = [
        "$scope",
        "$routeParams",
        "$interval",
        "serverApi",
        "tagHelper",
        "dateHelper",
        "navigator",
        "notifier"
    ];

    app.controller("linkController", LinkController);

})(keyPearlApp);