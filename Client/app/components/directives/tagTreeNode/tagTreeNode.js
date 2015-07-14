(function(app){
    "use strict";

    var TagTreeNodeDirective = function ($compile, tagTreeTemplates) {
        return {
            restrict: "A",
            scope: {
                tag: "=tagTreeNode",
                onSelect: "&",
                onSelectFunction: "=",
                isEditable: "=",
                onChange: "&",
                onChangeFunction: "="
            },
            template: "",
            link: function (scope, element) {

                // todo: do we need to add some validation (i.e throw exceptions) here?
                // e.g. isEditable && onChangeFunction == 'undefined'

                var template = scope.isEditable ? tagTreeTemplates.editableTemplate : tagTreeTemplates.defaultTemplate;
                element.append(template);
                $compile(element.contents())(scope);

                scope.handleOnSelect = function (tag) {
                    tag.toggleSelected();
                    scope.onSelect({tagId: tag.id});
                };

                scope.handleOnChange = function(tag) {
                    scope.onChange({tag: tag});
                };
            }
        };
    };

    TagTreeNodeDirective.$inject = ["$compile", "tagTreeTemplates"];
    app.directive("tagTreeNode", TagTreeNodeDirective);

})(keyPearlApp);