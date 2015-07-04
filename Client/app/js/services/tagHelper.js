(function (app) {
    "use strict";

    var TagHelperService = function () {

        return {
            buildTree: function (tagRows) {

                var hash = {};
                var parentId = 0;
                var rootTag = new Tag();
                var parentTag = rootTag;

                angular.forEach(tagRows, function (tagRow) {
                    var tag = new Tag(tagRow);
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
    app.service("TagHelper", TagHelperService);

})(keyPearlClientApp);