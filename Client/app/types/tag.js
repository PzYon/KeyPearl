function Tag(tagRow) {
    "use strict";

    Tag.prototype.toggleCollapsed = function () {
        this.isCollapsed = !this.isCollapsed;
    };

    Tag.prototype.toggleSelected = function () {
        this.isSelected = !this.isSelected;
    };

    Tag.prototype.hasChildren = function () {
        return this.children && this.children.length > 0;
    };

    Tag.prototype.getKey = function () {
        return this.id || this.name;
    };

    Tag.prototype.isPersisted = function () {
        return this.id && this.id > 0;
    };

    Tag.prototype.addChild = function (tag) {
        if (!tag) {
            tag = new Tag({parentId: this.id});
        }

        this.children.unshift(tag);
    };

    Tag.prototype.canAddChildren = function () {

        if (!this.isPersisted()) {
            return false;
        }

        for (var i = 0; i < this.children.length; i++) {
            if (!this.children[i].isPersisted()) {
                return false;
            }
        }

        return true;
    };

    var me = this;

    var constructor = function () {

        me.children = [];
        me.isCollapsed = false;
        me.isSelected = false;

        if (tagRow) {
            Object.keys(tagRow).map(function (key) {
                var value = tagRow[key];
                me[key] = value;
            });
        }

    };

    constructor();
}