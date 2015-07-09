(function (app) {
    "use strict";

    var TagHelperService = function () {

        return {
            toggleSelected: function(tagIds, tagId) {

                if (!tagIds) {
                    tagIds = [];
                }

                var index = tagIds.indexOf(tagId);
                if (index > -1) {
                    tagIds.splice(index, 1);
                } else {
                    tagIds.push(tagId);
                }

                return tagIds;

            },
            buildTree: function (tagRows, selectedTagIds) {

                var hash = {};
                var parentId = 0;
                var rootTag = new Tag();
                var parentTag = rootTag;

                angular.forEach(tagRows, function (tagRow) {
                    var tag = new Tag(tagRow);
                    tag.isSelected = selectedTagIds && selectedTagIds.indexOf(tag.id) > -1;

                    hash[tag.id] = tag;

                    if (tag.parentId > parentId) {
                        parentTag = hash[tag.parentId];
                        parentId = parentTag.id;
                    }

                    parentTag.children.push(tag);
                });

                return rootTag;
            }
        };

    };

    TagHelperService.$inject = [];
    app.service("tagHelper", TagHelperService);

})(keyPearlClientApp);