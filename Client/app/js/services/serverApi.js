(function (app) {
    "use strict";

    var ServerApiService = function ($http, $timeout, config) {

        var get = function (url, onSuccess, onError) {
            $http.get(url).success(onSuccess).error(onError);
        };

        var post = function (url, data, onSuccess, onError) {
            $http.post(url, data).success(onSuccess).error(onError);
        };

        var buildQuery = function (searchString, tagIds) {
            var searchQuery = "";
            if (searchString) {
                searchQuery += "$searchString(" + searchString + ")";
            }

            if (tagIds) {
                searchQuery += "$tagIds(" + tagIds + ")";
            }

            return searchQuery.length
                    ? "?queryString=" + searchQuery
                    : searchQuery;
        };

        return {
            loadLinks: function (searchString, tagIds, onSuccess, onError) {
                get(config.serverApiBaseUrl + "links/" + buildQuery(searchString, tagIds), onSuccess, onError);
            },

            loadLink: function (id, onSuccess, onError) {
                get(config.serverApiBaseUrl + "links/getbyid/" + id, onSuccess, onError);
            },

            updateLink: function (link, onSuccess, onError) {
                post(config.serverApiBaseUrl + "links/", link, onSuccess, onError);
            },

            loadTags: function (onSuccess, onError) {
                get(config.serverApiBaseUrl + "tags/", onSuccess, onError);
            }
        };
    };

    ServerApiService.$inject = ["$http", "$timeout", "config"];
    app.service("serverApi", ServerApiService);

})(keyPearlClientApp);