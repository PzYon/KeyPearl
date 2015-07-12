(function (app) {
    "use strict";

    // todo: consider handling loadTags via tagHelper and caching the tags here, e.g.
    // - rename buildTree to getTree
    // - cache hierarchy here
    // - add overload to force reload from service
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

                var tagHash = {};
                var parentId = 0;
                var rootTag = new Tag();
                var parentTag = rootTag;

                angular.forEach(tagRows, function (tagRow) {
                    var tag = new Tag(tagRow);
                    tag.isSelected = selectedTagIds && selectedTagIds.indexOf(tag.id) > -1;

                    tagHash[tag.id] = tag;

                    if (tag.parentId > parentId) {
                        parentTag = tagHash[tag.parentId];
                        parentId = parentTag.id;
                    }

                    parentTag.children.push(tag);
                });

                return {
                    rootTag: rootTag,
                    tagHash: tagHash
                };
            },
            getHierarchyTopDown: function (tagHash, tagId) {
                var tags = [];

                var tag = null;
                do {
                    tag = tagHash[tag ? tag.parentId : tagId];
                    tags.push(tag);
                } while (tag.parentId > 0);

                return tags.reverse();
            }
        };

    };

    TagHelperService.$inject = [];
    app.service("tagHelper", TagHelperService);

})(keyPearlApp);