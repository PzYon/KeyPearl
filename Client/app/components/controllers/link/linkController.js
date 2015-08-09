(function (app) {
    "use strict";

    var LinkController = function ($routeParams, $interval, serverApi, tagHelper, dateHelper, navigator, notifier) {

        // todo: add some validation (required: yes/no, format: regex, etc.)

        var c = this;
        c.dateHelper = dateHelper;
        c.link = {};

        var setLink = function (link) {
            c.link = link;
        };

        var initialize = function () {
            var id = $routeParams.id;
            if (id) {
                c.actionName = "Change";
                serverApi.loadLink(id, setLink);
            } else {
                c.actionName = "Create";
            }

            serverApi.loadTags(function (tags) {
                var waitUntilLinkIsLoaded = $interval(function () {
                    if (c.link || !c.link.id) {
                        $interval.cancel(waitUntilLinkIsLoaded);
                        c.rootTag = tagHelper.buildTree(tags, c.link.tagIds).rootTag;
                    }
                }, 10);
            });
        };

        c.toggleAppliedTag = function (tag) {
            tag.toggleSelected();
            tagHelper.toggleApplied(c.link, tag.id);
        };

        c.updateLink = function () {

            var isCreate = !c.link.id;

            serverApi.updateLink(c.link, function (link) {
                var executedAction;
                if (isCreate) {
                    // we need to navigate to correct url
                    executedAction = "added";
                    navigator.goToLink(link.id);
                } else {
                    // we simply need to update the link with new server value
                    executedAction = "changed";
                    c.link = link;
                }

                notifier.addSuccess(executedAction + " link '" + link.name + "'");
            });

        };

        initialize();
    };

    LinkController.$inject = [
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