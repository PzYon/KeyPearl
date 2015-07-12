(function(app){
    "use strict";

    var TagTreeNodeDirective = function ($compile) {
        return {
            restrict: "A",
            scope: {
                tag: "=tagTreeNode",
                onSelect: "&",
                onSelectFunction: "="
            },
            template: "",
            link: function (scope, element) {
                element.append(TagTreeNodeDirective.template);
                $compile(element.contents())(scope);

                scope.handleOnSelect = function (tag) {
                    tag.toggleSelected();
                    scope.onSelect({tagId: tag.id});
                };
            }
        };
    };

    // we specify template here so it is only "built" once
    TagTreeNodeDirective.template = "" +
        "<span class='tag-collapsor' data-ng-if='tag.hasChildren()' data-ng-click='tag.toggleCollapsed()'>" +
          "{{tag.collapsed ? '+' : '-'}}" +
        "</span>" +
        "<span class='tag-label' data-ng-click='handleOnSelect(tag)' data-ng-class='{selected: tag.isSelected}'>" +
          "{{tag.name}} [id {{tag.id}}]" +
        "</span>" +
        "<span data-tag-tree='tag' data-on-select='onSelectFunction({tagId: tagId})' " +
              "data-on-select-function='onSelectFunction' data-ng-if='!tag.isCollapsed'></span>";

    TagTreeNodeDirective.$inject = ["$compile"];
    app.directive("tagTreeNode", TagTreeNodeDirective);

})(keyPearlApp);