(function(app){
    "use strict";

    var TagDirective = function ($compile) {
        return {
            restrict: "A",
            scope: {
                tag: "=",
                onSelect: "&",
                onSelectFunction: "="
            },
            template: "",
            link: function (scope, element) {
                element.append(TagDirective.template);
                $compile(element.contents())(scope);

                scope.handleOnSelect = function (tag) {
                    tag.toggleSelected();
                    scope.onSelect({tagId: tag.id});
                };
            }
        };
    };

    // we specify template here so it is only "built" once
    TagDirective.template = "<span class='tag-collapser'"
        "data-ng-if='tag.hasChildren()' data-ng-click='tag.toggleCollapsed()'>" +
        "{{tag.collapsed ? '+' : '-'}}" +
        "</span>" +
        "<span class='tag-label' data-ng-click='handleOnSelect(tag)' data-ng-class='{selected: tag.isSelected}'>" +
        "{{tag.name}} [id {{tag.id}}]" +
        "</span>" +
        "<span data-tag-tree='tag' data-on-select='onSelectFunction({tagId: tagId})'"+
        "data-on-select-function='onSelectFunction' data-ng-if='!tag.isCollapsed'></span>";

    TagDirective.$inject = ["$compile"];
    app.directive("tag", TagDirective);

})(keyPearlClientApp);