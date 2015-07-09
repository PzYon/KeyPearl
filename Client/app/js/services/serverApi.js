(function (app) {
    "use strict";

    var ServerApiService = function ($http, $timeout, config, notificationHelper) {

        var errorHandler = function (data, status, headers, config) {
            if (!status) {
                notificationHelper.add("Cannot connect to server.. Maybe it's down?", true);
            } else {
                notificationHelper.add(config.url + ": " + data.exceptionMessage, true);
            }
        };

        var getOnErrorWrapper = function () {
            return getOnCompleteWrapper(errorHandler);
        };

        var getOnCompleteWrapper = function (onComplete) {
            return function (data, status, headers, config) {
                notificationHelper.pendingRequests--;
                onComplete(data, status, headers, config);
            };
        };

        var get = function (url, onSuccess) {
            notificationHelper.pendingRequests++;
            $http.get(url).success(getOnCompleteWrapper(onSuccess)).error(getOnErrorWrapper());
        };

        var post = function (url, data, onSuccess) {
            notificationHelper.pendingRequests++;
            $http.post(url, data).success(getOnCompleteWrapper(onSuccess)).error(getOnErrorWrapper());
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
            loadLinks: function (searchString, tagIds, onSuccess) {
                get(config.serverApiBaseUrl + "links/" + buildQuery(searchString, tagIds), onSuccess);
            },

            loadLink: function (id, onSuccess) {
                get(config.serverApiBaseUrl + "links/getbyid/" + id, onSuccess);
            },

            updateLink: function (link, onSuccess) {
                post(config.serverApiBaseUrl + "links/", link, onSuccess);
            },

            loadTags: function (onSuccess) {
                get(config.serverApiBaseUrl + "tags/", onSuccess);
            }
        };
    };

    ServerApiService.$inject = ["$http", "$timeout", "config", "notificationHelper"];
    app.service("serverApi", ServerApiService);

})(keyPearlClientApp);