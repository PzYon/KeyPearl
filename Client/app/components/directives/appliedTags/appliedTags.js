(function (app) {
    "use strict";

    var AppliedTagsDirective = function (tagHelper) {

        return {
            restrict: "A",
            scope: {
                tagHash: "=",
                tagIds: "="
            },
            templateUrl: "components/directives/appliedTags/appliedTags.html",
            link: function (scope) {
                scope.tagHierarchies = [];

                angular.forEach(scope.tagIds, function(tagId){
                    scope.tagHierarchies.push(tagHelper.getHierarchyTopDown(scope.tagHash, tagId));
                });
            }
        };

    };

    AppliedTagsDirective.$inject = ["tagHelper"];
    app.directive("appliedTags", AppliedTagsDirective);

})(keyPearlApp);