(function (app) {
    "use strict";

    var ManageLinkController = function ($routeParams, $interval, serverApi, tagHelper, navigator) {

        // todo: add possibility to manage tags for link
        // todo: add some validation (required: yes/no, format: regex, etc.)

        var c = this;
        c.link = {};

        function setLink (link) {
            c.link = link;
        }

        function initialize() {
            var id = $routeParams.id;
            if (id) {
                c.actionName = "Update";
                serverApi.loadLink(id, setLink);
            } else {
                c.actionName = "Create";
            }

            serverApi.loadTags(function (tags) {
                var waitUntilLinkIsLoad = $interval(function () {
                    if (c.link || !c.link.id) {
                        $interval.cancel(waitUntilLinkIsLoad);
                        c.tags = tagHelper.buildTree(tags, c.link.tagIds);
                    }
                }, 10);
            });
        }

        c.selectTag = function (tagId) {
            c.link.tagIds = tagHelper.toggleSelected(c.link.tagIds, tagId);
        };

        c.updateLink = function () {
            serverApi.updateLink(c.link, function(link){
                navigator.goToLink(link.id);
            });
        };

        initialize();
    };

    ManageLinkController.$inject = ["$routeParams", "$interval", "serverApi", "tagHelper", "navigator"];
    app.controller("manageLinkController", ManageLinkController);

})(keyPearlClientApp);