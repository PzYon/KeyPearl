(function (app) {
    "use strict";

    var ManageLinkController = function ($routeParams, serverApi) {

        // todo: add possibility to manage tags for link
        // todo: add some validation (required: yes/no, format: regex, etc.)

        var c = this;
        c.formValues = {};

        function setLink (link) {
            c.formValues = link;
        }

        function onError() {
            alert("error");
        }

        function initialize() {
            var id = $routeParams.id;
            if (id) {
                c.actionName = "Update";
                serverApi.loadLink(id, setLink, onError);
            } else {
                c.actionName = "Create";
            }
        }

        c.updateLink = function () {
            serverApi.updateLink(c.formValues, setLink, onError);
        };

        initialize();
    };

    ManageLinkController.$inject = ["$routeParams", "serverApi"];
    app.controller("manageLinkController", ManageLinkController);

})(keyPearlClientApp);