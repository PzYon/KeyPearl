(function (app) {
    "use strict";

    var AuthoringInfosDirective = function (dateHelper) {

        var link = function (scope) {
            var modified = scope.entity.modified;
            var created = scope.entity.created;

            var text = "added: " + dateHelper.formatDate(created);

            if (created !== modified) {
                text += " | modified: " + dateHelper.formatDate(modified);
            }

            scope.infoText = text;
        };

        return {
            restrict: "A",
            scope: {
                entity: "=authoringInfos"
            },
            template: "{{infoText}}",
            link: link
        };

    };

    AuthoringInfosDirective.$inject = ["dateHelper"];
    app.directive("authoringInfos", AuthoringInfosDirective);

})(keyPearlApp);