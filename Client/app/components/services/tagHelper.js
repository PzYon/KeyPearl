(function (app, angular) {
    "use strict";

    var TagHelperService = function (config, serverApi, notifier) {

        var tagRowCache = [];
        var tagTreeCache = {};
        var instanceSettingsCache = {};

        var getTags = function (instanceKey, onLoad) {
            if (!config.cacheTagTrees || !tagRowCache.length) {
                serverApi.loadTags(function (tagRows) {
                    onLoad(ensureTree(instanceKey, tagRows));
                });
            } else {
                onLoad(ensureTree(instanceKey));
            }
        };

        var ensureTree = function (instanceKey, tagRows) {
            if (config.cacheTagTrees) {
                var cachedTree = tagTreeCache[instanceKey];
                if (cachedTree) {
                    return cachedTree;
                }

                if (tagRows) {
                    tagRowCache = tagRows;
                } else {
                    tagRows = tagRowCache;
                }
            }

            var tree = buildTree(instanceKey, tagRows);

            if (config.cacheTagTrees) {
                tagTreeCache[instanceKey] = tree;
            }

            return tree;
        };

        var buildTree = function (instanceKey, tagRows) {
            var settings = getInstanceSettings(instanceKey);
            var rootTag = new Tag({name: "root"}, null, settings);

            var tagHash = {"0": rootTag};
            tagRows.map(function (tagRow) {
                tagHash[tagRow.id] = new Tag(tagRow, tagHash, settings);
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

        var getInstanceSettings = function (key) {
            if (!instanceSettingsCache[key]) {
                instanceSettingsCache[key] = {};
            }

            return instanceSettingsCache[key];
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

        var updateTags = function (instanceKey, changedTagsHash, onUpdated) {
            serverApi.updateTags(transformToTagRows(changedTagsHash), function (result) {

                var message = "updated " + result.numberOfUpdatedTags + " tag(s) and adjusted " +
                              result.numberOfUpdatedLinks + " link(s)";
                notifier.addSuccess(message, "updateTagsInformation");

                tagTreeCache = {};

                onUpdated(ensureTree(instanceKey, result.tags));
            });
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
                tag.toggleHidden(false);
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
                tag.toggleHidden(true);
                for (var i = 0; i < distinctIds.length; i++) {
                    if (tag.isRelatedWith(distinctIds[i])) {
                        tag.toggleHidden(false);
                        break;
                    }
                }
            });

            return distinctIds.length;
        };

        return {
            getTags: getTags,
            updateTags: updateTags,
            toggleApplied: toggleApplied,
            showAllTags: showAllTags,
            showAvailableTags: showAvailableTags
        };

    };

    TagHelperService.$inject = ["config", "serverApi", "notifier"];
    app.service("tagHelper", TagHelperService);

})(keyPearlApp, angular);