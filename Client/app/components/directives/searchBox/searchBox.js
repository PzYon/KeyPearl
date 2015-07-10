(function (app) {
    "use strict";

    var SearchBoxDirective = function ($timeout, config) {

        var link = function (scope) {

            var delay = null;

            scope.fireChange = function () {
                if (delay) {
                    $timeout.cancel(delay);
                }

                delay = $timeout(function () {
                    scope.onChange({
                        searchString: scope.searchString
                    });
                }, config.queryDelay);
            };
        };

        return {
            restrict: "A",
            scope: {
                onChange: "&"
            },
            template: "SearchString: <input type='text' data-ng-model='searchString' data-ng-change='fireChange()' />",
            link: link
        };

    };

    SearchBoxDirective.$inject = ["$timeout", "config"];
    app.directive("searchBox", SearchBoxDirective);

})(keyPearlApp);