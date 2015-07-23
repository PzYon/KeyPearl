(function (app) {
    "use strict";

    var SearchBoxDirective = function ($timeout, searchHelper, config) {

        var link = function (scope) {

            scope.searchHelper = searchHelper;

            scope.toggleSelectedTags = function (tags) {
                searchHelper.toggleSelectedTags(tags);
                scope.onChange();
            };

            scope.resetSelectedTags = function () {
                searchHelper.resetSelectedTags();
                scope.onChange();
            };

            scope.toggleTree = function () {
                scope.showTree = !scope.showTree;
            };

            scope.setMatchingTags = function () {
                scope.matchingTags = [];

                if (!searchHelper.tagSearchString) {
                    return;
                }

                searchHelper.tagSearchString = searchHelper.tagSearchString.toLowerCase();

                angular.forEach(scope.searchHelper.tagHash, function (tag) {
                    var isMatch = tag.name && tag.name.toLowerCase().indexOf(searchHelper.tagSearchString) > -1;
                    if (isMatch) {
                        scope.matchingTags.push(tag);
                    }
                });
            };

            var delayed = null;
            scope.searchByStringDelayed = function () {
                if (delayed) {
                    $timeout.cancel(delayed);
                }

                delayed = $timeout(scope.onChange, config.executeQueryAfter);
            };
        };

        return {
            restrict: "A",
            scope: {
                onChange: "&"
            },
            templateUrl: "components/directives/searchBox/searchBox.html",
            link: link
        };

    };

    SearchBoxDirective.$inject = ["$timeout", "searchHelper", "config"];
    app.directive("searchBox", SearchBoxDirective);

})(keyPearlApp);