(function (app) {
    "use strict";

    // we specify templates here so they are only "built" once
    var TagTreeNodeTemplatesService = function () {

        var defaultTemplate = "" +
            "<span class='tag-collapsor' data-ng-if='tag.hasChildren()' data-ng-click='tag.toggleCollapsed()'>" +
                "<span class='container'>{{tag.isCollapsed ? '+' : '-'}}</span>" +
            "</span>" +
            "<span class='tag-label' data-ng-click='handleOnSelect(tag)' data-ng-class='{selected: tag.isSelected}'>" +
                "{{tag.name}}" +
            "</span>" +
            "<span data-tag-tree='tag' data-on-select='onSelectFunction(tag)' " +
                  "data-on-select-function='onSelectFunction' data-ng-if='!tag.isCollapsed'></span>";

        // todo: add possibility to delete tags
        // - how does server know which tags are deleted?
        //   - flag (Tag.IsDeleted?)
        //   - TagController.Delete (must be executed immediately, no callback
        //     to client in order to leave the rest untouched [i.e. changed tags])
        //     -> we would then also need to remove all changed to tags which are affected

        var editableTemplate = "" +
            "<span class='tag-collapsor' data-ng-if='tag.hasChildren()' data-ng-click='tag.toggleCollapsed()'>" +
                "<span class='container'>{{tag.isCollapsed ? '+' : '-'}}</span>" +
            "</span>" +
            "<span class='tag-label' title='id: {{tag.id}}' " +
                  "data-draggable-target data-on-drop='onDrop' data-can-drop='canDrop'>" +
              "<input type='text' data-ng-change='handleOnChange(tag)' data-ng-model='tag.name' />" +
            "</span>" +
            "<span class='draggable' " +
                  "data-draggable='tag' data-on-drag-start='onDragStart' data-on-drag-end='onDragEnd'>" +
                "DnD " +
            "</span>" +
            "<span class='tag-adder' data-ng-if='tag.canAddChildren()' data-ng-click='tag.addChild(null, true)'>+</span>" +
            "<span data-tag-tree='tag' data-is-editable='isEditable' data-on-change='onChangeFunction(tag)' " +
                  "data-on-change-function='onChangeFunction' data-ng-if='!tag.isCollapsed'></span>";

        return {
            defaultTemplate: defaultTemplate,
            editableTemplate: editableTemplate
        };
    };

    TagTreeNodeTemplatesService.$inject = [];
    app.service("tagTreeNodeTemplates", TagTreeNodeTemplatesService);

})(keyPearlApp);