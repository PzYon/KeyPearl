(function (app) {
    "use strict";

    var AuthoringInfosDirective = function (dateHelper) {

        return {
            restrict: "A",
            scope: {
                entity: "=authoringInfos"
            },
            templateUrl: "components/directives/authoringInfos/authoringInfos.html",
            link: function (scope) {
                scope.modified = dateHelper.formatDate(scope.entity.modified);
                scope.added = dateHelper.formatDate(scope.entity.created);
            }
        };

    };

    AuthoringInfosDirective.$inject = ["dateHelper"];
    app.directive("authoringInfos", AuthoringInfosDirective);

})(keyPearlApp);