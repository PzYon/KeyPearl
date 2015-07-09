function Tag(tagRow) {
    "use strict";

    Tag.prototype.toggleCollapsed = function () {
        this.isCollapsed = !this.isCollapsed;
    };

    Tag.prototype.toggleSelected = function () {
        this.isSelected = !this.isSelected;
    }

    Tag.prototype.hasChildren = function(){
        return this.children && this.children.length > 0;
    }

    var me = this;

    function constructor() {

        me.children = [];
        me.isCollapsed = false;
        me.isSelected = false;

        if (tagRow) {
            Object.keys(tagRow).map(function (key) {
                var value = tagRow[key];
                me[key] = value;
            });
        }

    }

    constructor();
}