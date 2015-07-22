(function (app) {
    "use strict";

    var TagTreeNodeDirective = function ($compile, tagTreeNodeTemplates, notifier) {

        var link = function (scope, element) {

            // todo: do we need to add some validation (i.e throw exceptions) here?
            // e.g. isEditable && onChangeFunction == 'undefined'

            var template = scope.isEditable
                    ? tagTreeNodeTemplates.editableTemplate
                    : tagTreeNodeTemplates.defaultTemplate;

            element.append(template);
            $compile(element.contents())(scope);

            scope.handleOnSelect = function (tag) {
                scope.onSelect({tag: tag});
            };

            scope.handleOnChange = function (tag) {
                scope.onChange({tag: tag});
            };

            scope.onDragStart = function (event) {
                // todo: don't we need to do anything here?
            };

            scope.canDrop = function (draggedTag) {
                var isNotParent = draggedTag.parentId !== scope.tag.id;
                var isNotDescendantOf = !scope.tag.isDescendantOf(draggedTag);
                return isNotParent && isNotDescendantOf;
            };

            scope.onDrop = function (draggedTag) {
                scope.tag.addChild(draggedTag);
            };

            scope.onDragEnd = function (draggedTag, isSuccess) {
                if (!isSuccess) {
                    return;
                }

                scope.handleOnChange(scope.tag);

                var index = scope.parentTag.children.indexOf(scope.tag);
                if (index > -1) {
                    scope.parentTag.children.splice(index, 1);
                }

                notifier.addSuccess("moved '" + draggedTag.getDisplayName() +
                                    "' to '" + draggedTag.getParent().getDisplayName() + "'");

                scope.$apply();
            };
        };

        return {
            restrict: "A",
            scope: {
                tag: "=tagTreeNode",
                parentTag: "=",
                onSelect: "&",
                onSelectFunction: "=",
                isEditable: "=",
                onChange: "&",
                onChangeFunction: "="
            },
            template: "",
            link: link
        };
    };

    TagTreeNodeDirective.$inject = ["$compile", "tagTreeNodeTemplates", "notifier"];
    app.directive("tagTreeNode", TagTreeNodeDirective);

})(keyPearlApp);