function Tag(tagRow, tagHash) {
    "use strict";

    Tag.prototype.toggleCollapsed = function () {
        this.isCollapsed = !this.isCollapsed;
    };

    Tag.prototype.toggleSelected = function () {
        this.isSelected = !this.isSelected;
    };

    Tag.prototype.toggleVisibility = function (show) {
        if (angular.isUndefined(show)) {
            this.isHidden = !this.isHidden;
        } else {
            this.isHidden = !show;
        }
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
        if (!tag && !(tag instanceof Tag)) {
            tag = new Tag(tag, tagHash);
        }

        tag.parentId = this.id;
        this.children.unshift(tag);
    };

    Tag.prototype.isDescendantOf = function (tag) {
        var parent = tagHash[this.id];
        while (parent && parent.id) {
            if (parent.id === tag.id) {
                return true;
            }
            parent = tagHash[parent.parentId];
        }
        return false;
    };

    Tag.prototype.isRelatedWith = function(tagId) {
        if (!this.id || this.id === tagId) {
            // root tag or self
            return true;
        }

        var relatedTag = tagHash[tagId];
        return this.isDescendantOf(relatedTag) || relatedTag.isDescendantOf(this);
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
        me.isHidden = false;

        if (tagRow) {
            Object.keys(tagRow).map(function (key) {
                var value = tagRow[key];
                me[key] = value;
            });
        }

    };

    constructor();
}