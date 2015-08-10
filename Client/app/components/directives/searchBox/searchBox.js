(function (app, angular) {
    "use strict";

    var SearchBoxDirective = function ($timeout, searchHelper, config) {

        var link = function (scope) {

            var onChangeWrapper = function () {
                scope.setMatchingTags();
                scope.onChange();
            };

            scope.searchHelper = searchHelper;

            scope.toggleSelectedTags = function (tags) {
                searchHelper.toggleSelectedTags(tags);
                onChangeWrapper();
            };

            scope.resetAll = function () {
                searchHelper.searchString = "";
                scope.resetSelectedTags();
                // no need to call scope.onChange() as resetSelectedTags() already does this
            };

            scope.resetSelectedTags = function () {
                searchHelper.resetSelectedTags();
                onChangeWrapper();
            };

            scope.clearTagSearchString = function () {
                searchHelper.clearTagSearchString();
            };

            scope.toggleTree = function () {
                scope.showTree = !scope.showTree;
            };

            scope.setMatchingTags = function () {
                scope.matchingTags = [];

                var tagSearchString = searchHelper.tagSearchString ? searchHelper.tagSearchString.toLowerCase() : "";

                angular.forEach(scope.searchHelper.tagHash, function (tag) {
                    var isMatchAndVisible = !tag.isHidden
                                            && tag.name
                                            && tag.name.toLowerCase().indexOf(tagSearchString) > -1;
                    if (isMatchAndVisible) {
                        scope.matchingTags.push(tag);
                    }
                });
            };

            var delayed = null;
            scope.searchByStringDelayed = function () {
                if (delayed) {
                    $timeout.cancel(delayed);
                }

                delayed = $timeout(onChangeWrapper, config.executeQueryAfter);
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

})(keyPearlApp, angular);