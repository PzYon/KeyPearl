var Tag = (function (angular) {
    "use strict";

    return function (tagRow, tagHash, settings) {

        var me = this;

        Tag.prototype.ensureSetting = function (settingsProperty, value) {
            if (!settings) {
                return;
            }

            // looks complicated, but we try to keep settings object as small as possible
            // i.e. no empty objects, etc.
            if (!value && settings[this.id] && angular.isDefined(settings[this.id][settingsProperty])) {
                delete settings[this.id][settingsProperty];
            } else if (value) {
                if (!settings[this.id]) {
                    settings[this.id] = {};
                }
                settings[this.id][settingsProperty] = true;
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

        // todo: if too many tags are expanded, then we get digest error
        // (Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!)
        Tag.prototype.expandAllRecursive = function () {
            this.toggleExpanded(true);
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].expandAllRecursive();
            }
        };

        Tag.prototype.ensureExpanded = function () {
            var tag = this;
            while (tag && tag.id) {
                tag.toggleExpanded(true);
                tag = tagHash[tag.parentId];
            }
        };

        Tag.prototype.isRoot = function () {
            return !this.id;
        };

        Tag.prototype.hasChildren = function () {
            return this.children && this.children.length > 0;
        };

        Tag.prototype.countChildren = function () {
            var count = 1;
            if (this.hasChildren()) {
                angular.forEach(this.children, function (childTag) {
                    count += childTag.countChildren();
                });
            }
            return count;
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

            // todo: this could be cached!
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

        var getTagSetting = function (settingsKey) {
            return !!(settings && settings[me.id] && settings[me.id][settingsKey]);
        };

        var constructor = function () {
            me.id = 0;
            me.children = [];

            if (tagRow) {
                Object.keys(tagRow).map(function (key) {
                    var value = tagRow[key];
                    me[key] = value;
                });
            }

            // ensure settings after tagRow values have been applied to be sure we have an id and ensure settings by
            // bypassing "toggle"-functions to prevent default value from being written to settings
            me.isExpanded = getTagSetting("isExpanded");
            me.isSelected = getTagSetting("isSelected");
            me.isHidden = getTagSetting("isHidden");
        };

        constructor();
    };

})(angular);