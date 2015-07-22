(function (app) {
    "use strict";

    var SearchBoxDirective = function ($timeout, searchHelper, config) {

        var link = function (scope) {

            scope.searchHelper = searchHelper;

            scope.toggleSelectedTags = function (tags) {
                scope.searchHelper.toggleSelectedTags(tags);
                scope.onTagChange({tags: scope.searchHelper.selectedTags});
            };

            // todo: we need some kind of dropdown here
            // todo: also consider renaming "matchingTags"
            scope.showMatchingTags = function (tagSearchString) {
                scope.matchingTags = [];

                if (!tagSearchString) {
                    return;
                }

                tagSearchString = tagSearchString.toLowerCase();

                angular.forEach(scope.searchHelper.tagHash, function (tag) {
                    var isMatch = tag.name && tag.name.toLowerCase().indexOf(tagSearchString) > -1;
                    if (isMatch) {
                        scope.matchingTags.push(tag);
                    }
                });
            };

            var delay = null;
            scope.searchByStringDelayed = function () {
                if (delay) {
                    $timeout.cancel(delay);
                }

                delay = $timeout(function () {
                    scope.onChange({
                        searchString: scope.searchString
                    });
                }, config.executeQueryAfter);
            };
        };

        return {
            restrict: "A",
            scope: {
                onChange: "&",
                onTagChange: "&"
            },
            templateUrl: "components/directives/searchBox/searchBox.html",
            link: link
        };

    };

    SearchBoxDirective.$inject = ["$timeout", "searchHelper", "config"];
    app.directive("searchBox", SearchBoxDirective);

})(keyPearlApp);