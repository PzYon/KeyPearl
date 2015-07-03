(function (app) {
    "use strict";

    var ServerApiService = function ($http, $timeout, config) {

        var get = function (url, onSuccess, onError) {
            $http.get(url).success(onSuccess).error(onError);
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
            getLinks: function (searchString, tagIds, onSuccess, onError) {
                get(config.serverApiBaseUrl + "links/" + buildQuery(searchString, tagIds), onSuccess, onError);
            }
        };
    };

    ServerApiService.$inject = ["$http", "$timeout", "config"];
    app.service("ServerApi", ServerApiService);

})(keyPearlClientApp);