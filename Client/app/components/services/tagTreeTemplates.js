(function (app) {
    "use strict";

    // we specify templates here so they are only "built" once
    var TagTreeTemplatesService = function () {

        var defaultTemplate = "" +
            "<span class='tag-collapsor' data-ng-if='tag.hasChildren()' data-ng-click='tag.toggleCollapsed()'>" +
                "{{tag.isCollapsed ? '+' : '-'}}" +
            "</span>" +
            "<span class='tag-label' data-ng-click='handleOnSelect(tag)' data-ng-class='{selected: tag.isSelected}'>" +
                "{{tag.name}}" +
            "</span>" +
            "<span data-tag-tree='tag' data-on-select='onSelectFunction(tag.id)' " +
                  "data-on-select-function='onSelectFunction' data-ng-if='!tag.isCollapsed'></span>";

        var editableTemplate = "" +
            "<span class='tag-collapsor' data-ng-if='tag.hasChildren()' data-ng-click='tag.toggleCollapsed()'>" +
              "{{tag.isCollapsed ? '+' : '-'}}" +
            "</span>" +
            "<span class='tag-label'>" +
              "<input type='text' data-ng-change='handleOnChange(tag)' data-ng-model='tag.name' />" +
            "</span>" +
            "<span class='tag-adder' data-ng-if='tag.canAddChildren()' data-ng-click='tag.addChild()'>+</span>" +
            "<span data-tag-tree='tag' data-is-editable='isEditable' data-on-change='onChangeFunction(tag)' " +
                  "data-on-change-function='onChangeFunction' data-ng-if='!tag.isCollapsed'></span>";

        return {
            defaultTemplate: defaultTemplate,
            editableTemplate: editableTemplate
        };
    };

    TagTreeTemplatesService.$inject = [];
    app.service("tagTreeTemplates", TagTreeTemplatesService);

})(keyPearlApp);