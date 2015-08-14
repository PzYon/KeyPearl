var Tag = (function (angular) {
    "use strict";

    return function (tagRow, tagHash, settings) {

        var me = this;

        Tag.prototype.ensureSetting = function (settingsProperty, value) {
            if (!settings) {
                return;
            }

            if (!settings[settingsProperty]) {
                settings[settingsProperty] = [];
            }

            var id = this.id;
            var index = settings[settingsProperty].indexOf(id);

            if (!value && index > -1) {
                settings[settingsProperty].splice(index, 1);

            } else if (value && index === -1) {
                settings[settingsProperty].push(id);
            }

            return value;
        };

        Tag.prototype.toggleExpanded = function (isExpanded) {
            this.isExpanded = angular.isDefined(isExpanded)
                ? isExpanded
                : !this.isExpanded;

            this.ensureSetting("isExpanded", this.isExpanded);
        };
        Tag.prototype.toggleSelected = function (isSelected) {
            this.isSelected = angular.isDefined(isSelected)
                ? isSelected
                : !this.isSelected;

            return this.ensureSetting("isSelected", this.isSelected);
        };

        Tag.prototype.toggleHidden = function (isHidden) {
            this.isHidden = angular.isDefined(isHidden)
                ? isHidden
                : !this.isHidden;

            return this.ensureSetting("isHidden", this.isHidden);
        };

        Tag.prototype.expandAllRecursive = function () {
            this.toggleExpanded(true);
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].expandAllRecursive();
            }
        };

        Tag.prototype.isRoot = function () {
            return !this.id;
        };

        Tag.prototype.hasChildren = function () {
            return this.children && this.children.length > 0;
        };

        Tag.prototype.isPersisted = function () {
            return this.id && this.id > 0;
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

        Tag.prototype.isRelatedWith = function (tagId) {
            if (this.isRoot() || this.id === tagId) {
                return true;
            }

            var relatedTag = tagHash[tagId];
            return this.isDescendantOf(relatedTag) || relatedTag.isDescendantOf(this);
        };

        Tag.prototype.getHierarchyTopDown = function () {
            var tags = [];
            var tag = this;

            // todo: this can be cached!
            do {
                tags.push(tag);
                tag = tag.getParent();
            } while (!tag.isRoot());

            return tags.reverse();
        };

        Tag.prototype.addChild = function (tag, showExpanded) {
            if (!tag && !(tag instanceof Tag)) {
                tag = new Tag(tag, tagHash);
            }

            tag.parentId = this.id;

            if (showExpanded) {
                this.toggleExpanded(true);
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

        Tag.prototype.getParent = function () {
            return tagHash[this.parentId];
        };

        var constructor = function () {
            me.id = 0;
            me.children = [];
            me.isExpanded = false;
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
    };

})(angular);