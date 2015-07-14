(function (app) {
    "use strict";

    var LinkController = function ($routeParams, $interval, serverApi, tagHelper, navigator) {

        // todo: add some validation (required: yes/no, format: regex, etc.)

        var c = this;
        c.link = {};

        var setLink = function (link) {
            c.link = link;
        };

        var initialize = function () {
            var id = $routeParams.id;
            if (id) {
                c.actionName = "Update";
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

        c.setSelectedTagIds = function (tagId) {
            c.link.tagIds = tagHelper.toggleSelected(c.link.tagIds, tagId);
        };

        c.updateLink = function () {
            serverApi.updateLink(c.link, function(link){
                navigator.goToLink(link.id);
            });
        };

        initialize();
    };

    LinkController.$inject = ["$routeParams", "$interval", "serverApi", "tagHelper", "navigator"];
    app.controller("linkController", LinkController);

})(keyPearlApp);