(function (app) {
    "use strict";

    // we specify templates here so they are only "built" once
    var TagTreeNodeTemplatesService = function () {

        var defaultTemplate = "" +
            "<span data-ng-mouseover='isHover=true;' data-ng-mouseleave='isHover=false;'>" +
                "<span class='tag-collapsor' data-ng-if='tag.hasChildren()' data-ng-click='tag.toggleExpanded()'>" +
                    "<span class='container'>{{tag.isExpanded ? '-' : '+'}}</span>" +
                "</span>" +
                "<span class='tag-label' data-ng-click='handleOnSelect(tag)' data-ng-class='{selected: tag.isSelected}'>" +
                    "{{tag.name}}" +
                "</span>" +
                "<span class='action-links' data-ng-if='isHover'>[" +
                    "<span data-separated-elements>" +
                        "<span data-action-link='navigator.goToTagDetails(tag.id)'>" +
                            "manage" +
                        "</span>" +
                        "<span data-action-link='tag.expandAllRecursive()' data-ng-if='tag.hasChildren()'>" +
                            "expand all" +
                        "</span>" +
                    "]</span>" +
                "</span>" +
            "</span>" +
            "<span data-tag-tree='tag' data-on-select='onSelectFunction(tag)' " +
                  "data-on-select-function='onSelectFunction' data-ng-if='tag.isExpanded'></span>";

        var editableTemplate = "" +
            "<span data-ng-mouseover='isHover=true;' data-ng-mouseleave='isHover=false;'>" +
                "<span class='tag-collapsor' data-ng-if='tag.hasChildren()' data-action-link='tag.toggleExpanded()'>" +
                    "{{tag.isExpanded ? '-' : '+'}}" +
                "</span>" +
                "<span class='tag-label' data-draggable-target data-on-drop='onDrop' data-can-drop='canDrop'>" +
                  "<input type='text' data-ng-change='handleOnChange(tag)' data-ng-model='tag.name' " +
                          "data-ng-class='{highlighted: tag.isHighlighted}' />" +
                "</span>" +
                "<span class='action-links' data-ng-if='isHover && tag.isPersisted()'>[" +
                    "<span data-separated-elements>" +
                        "<span class='draggable' data-ng-if='!isTouch' " +
                              "data-draggable='tag' data-on-drag-start='onDragStart' data-on-drag-end='onDragEnd'>" +
                            "<span data-action-link>move</span>" +
                        "</span>" +
                        "<span data-action-link='tag.addChild(null, true)' data-ng-if='tag.canAddChildren()'>" +
                            "add child" +
                        "</span>" +
                        "<span data-action-link='tag.expandAllRecursive()' data-ng-if='tag.hasChildren()'>" +
                            "expand all" +
                        "</span>" +
                        "<span data-action-link='navigator.goToTagDetails(tag.id)' data-ng-if='tag.isPersisted()'>" +
                            "details" +
                        "</span>" +
                    "]</span>" +
                "</span>" +
            "</span>" +
            "<span data-tag-tree='tag' data-is-editable='isEditable' data-on-change='onChangeFunction(tag)' " +
                  "data-on-change-function='onChangeFunction' data-ng-if='tag.isExpanded'></span>";

        return {
            defaultTemplate: defaultTemplate,
            editableTemplate: editableTemplate
        };
    };

    TagTreeNodeTemplatesService.$inject = [];
    app.service("tagTreeNodeTemplates", TagTreeNodeTemplatesService);

})(keyPearlApp);