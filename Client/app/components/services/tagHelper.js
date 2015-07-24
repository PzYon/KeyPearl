(function (app) {
    "use strict";

    // todo: consider handling loadTags/updateTags via tagHelper and caching the tags here, e.g.
    // - rename buildTree to getTree
    // - cache hierarchy here
    // - add overload to force reload from service
    var TagHelperService = function () {

        return {
            toggleApplied: function (link, tagId) {
                if (!link.tagIds) {
                    link.tagIds = [];
                }

                var index = link.tagIds.indexOf(tagId);
                if (index > -1) {
                    link.tagIds.splice(index, 1);
                } else {
                    link.tagIds.push(tagId);
                }
            },

            showAvailableTags: function (links, tagHash) {

                var distinctIds = [];
                angular.forEach(links, function (link) {
                    angular.forEach(link.tagIds, function (tagId) {
                        if (distinctIds.indexOf(tagId) === -1) {
                            distinctIds.push(tagId);
                        }
                    });
                });

                angular.forEach(tagHash, function (tag) {
                    tag.toggleVisibility(false);
                    for (var i = 0; i < distinctIds.length; i++) {
                        if (tag.isRelatedWith(distinctIds[i])) {
                            tag.toggleVisibility(true);
                            break;
                        }
                    }
                });

                return distinctIds.length;
            },

            buildTree: function (tagRows, selectedTagIds) {

                var rootTag = new Tag();

                var tagHash = {"0": rootTag};
                tagRows.map(function (tagRow) {
                    tagHash[tagRow.id] = new Tag(tagRow, tagHash);
                });

                angular.forEach(tagRows, function (tagRow) {
                    var tag = tagHash[tagRow.id];
                    tag.isSelected = selectedTagIds && selectedTagIds.indexOf(tag.id) > -1;

                    var parentTag = tagRow.parentId ? tagHash[tagRow.parentId] : rootTag;
                    parentTag.addChild(tag);
                });

                return {
                    rootTag: rootTag,
                    tagHash: tagHash
                };

            },

            transformToTagRows: function (tagHash) {

                var tagRows = [];

                angular.forEach(Object.keys(tagHash), function (tagId) {
                    var tag = tagHash[tagId];
                    tagRows.push({
                        id: tag.id,
                        parentId: tag.parentId,
                        name: tag.name
                    });
                });

                return tagRows;

            }
        };

    };

    TagHelperService.$inject = [];
    app.service("tagHelper", TagHelperService);

})(keyPearlApp);