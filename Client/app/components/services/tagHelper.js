(function (app, angular) {
    "use strict";

    var TagHelperService = function (serverApi, notifier) {

        var tagRowCache = null;

        var getTags = function (onLoad, settings) {
            if (!tagRowCache) {
                serverApi.loadTags(function (loadedTags) {
                    tagRowCache = loadedTags;
                    onLoad(buildTree(tagRowCache, settings));
                });
            } else {
                onLoad(buildTree(tagRowCache, settings));
            }
        };

        var toggleApplied = function (link, tagId) {
            if (!link.tagIds) {
                link.tagIds = [];
            }

            var index = link.tagIds.indexOf(tagId);
            if (index > -1) {
                link.tagIds.splice(index, 1);
            } else {
                link.tagIds.push(tagId);
            }
        };

        var showAllTags = function (tagHash) {
            angular.forEach(tagHash, function (tag) {
                tag.toggleVisibility(true);
            });
        };

        var showAvailableTags = function (links, tagHash) {

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
        };

        var buildTree = function (tagRows) {

            var rootTag = new Tag();

            var tagHash = {"0": rootTag};
            tagRows.map(function (tagRow) {
                tagHash[tagRow.id] = new Tag(tagRow, tagHash);
            });

            angular.forEach(tagRows, function (tagRow) {
                var tag = tagHash[tagRow.id];
                var parentTag = tagRow.parentId ? tagHash[tagRow.parentId] : rootTag;
                parentTag.addChild(tag);
            });

            return {
                rootTag: rootTag,
                tagHash: tagHash
            };

        };

        var applySettings = function (tagHash, settings) {
            angular.forEach(settings.selectedIds, function (tagId) {
                tagHash[tagId].toggleSelected(true);
            });

            angular.forEach(settings.expandedIds, function (tagId) {
                tagHash[tagId].toggleCollapsed(true);
            });

            angular.forEach(settings.hiddenIds, function (tagId) {
                tagHash[tagId].toggleVisibility(false);
            });
        };

        var transformToTagRows = function (tagHash) {

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

        };

        var updateTags = function (changedTagsHash, onUpdated) {

            serverApi.updateTags(transformToTagRows(changedTagsHash), function (result) {
                var message = "updated " + result.numberOfUpdatedTags + " tag(s) and adjusted " +
                              result.numberOfUpdatedLinks + " link(s)";
                notifier.addSuccess(message, "updateTagsInformation");

                tagRowCache = result.tags;

                onUpdated(buildTree(tagRowCache));
            });

        };

        return {
            getTags: getTags,
            updateTags: updateTags,
            applySettings: applySettings,
            toggleApplied: toggleApplied,
            showAllTags: showAllTags,
            showAvailableTags: showAvailableTags
        };

    };

    TagHelperService.$inject = ["serverApi", "notifier"];
    app.service("tagHelper", TagHelperService);

})(keyPearlApp, angular);