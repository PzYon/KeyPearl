(function (app) {
    "use strict";

    var LinkController = function ($scope, $routeParams, $interval, serverApi, tagHelper, dateHelper, navigator, notifier) {

        var c = this;

        c.dateHelper = dateHelper;

        // required for $watch to work correctly
        c.link = {
            id: 0
        };

        var tagHelperId = "link";

        var setLink = function (result) {
            var link = result.data;
            if (link) {
                c.link = link;
                notifier.addSuccess("loaded link '" + link.name + "' in " + result.serverTimeInMs + "ms");
            } else {
                notifier.addError("cannot find link.. maybe it doesn't exist anymore?");
            }
        };

        var onTagsLoaded = function (tagTree) {
            c.rootTag = tagTree.rootTag;

            var deregisterWatch = $scope.$watch("c.link.id", function () {
                if (c.link.id) {
                    angular.forEach(c.link.tagIds, function (tagId) {
                        tagTree.tagHash[tagId].toggleSelected(true);
                    });

                    deregisterWatch();
                }
            });
        };

        var initialize = function () {
            var id = $routeParams.id;
            if (id) {
                c.actionName = "Save";
                serverApi.loadLink(id, setLink);
            } else {
                c.actionName = "Create";
            }

            tagHelper.getTags(tagHelperId, onTagsLoaded);
        };

        c.toggleAppliedTag = function (tag) {
            tag.toggleSelected();
            tagHelper.toggleApplied(c.link, tag.id);
        };

        c.updateLink = function () {

            var isCreate = !c.link.id;

            serverApi.updateLink(c.link, function (result) {
                var updatedLink = result.data;

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

                notifier.addSuccess(executedAction + " link '" + updatedLink.name
                                    + "' in " + result.serverTimeInMs + "ms");
            });

        };

        c.deleteLink = function () {
            var name = c.link.name;

            serverApi.deleteLink(c.link, function(result) {
                navigator.goToNewLink();
                notifier.addSuccess("deleted link '" + name + "' in " + result.serverTimeInMs + "ms");
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