(function (app) {
    "use strict";

    var TagsDirective = function () {

        var link = function (scope) {
            if (angular.isUndefined(scope.tags)) {
                return;
            }

            var areTagIds = scope.tags.every(function (value) {
                return angular.isNumber(value);
            });

            if (areTagIds) {
                var tags = [];
                angular.forEach(scope.tags, function (tagId) {
                    tags.push(scope.tagHash[tagId]);
                });
                scope.tags = tags;
            }
        };

        return {
            restrict: "A",
            scope: {
                tagHash: "=",
                tags: "="
            },
            template: "<div class='tags' data-ng-repeat='tag in tags' data-tag='tag'></div>",
            link: link
        };

    };

    TagsDirective.$inject = [];
    app.directive("tags", TagsDirective);

})(keyPearlApp);