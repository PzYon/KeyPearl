(function (app) {
    "use strict";

    var ServerApiService = function ($http, $timeout, config, notifier) {

        var errorHandler = function (data, status, headers, config) {
            var message = status
                    ? config.url + ": " + data.exceptionMessage
                    : "Cannot connect to server.. Maybe it's down?";
            notifier.addError(message);
        };

        var getOnErrorWrapper = function () {
            return getOnCompleteWrapper(errorHandler);
        };

        var getOnCompleteWrapper = function (onComplete) {
            return function (data, status, headers, config) {
                notifier.pendingRequests--;
                onComplete(data, status, headers, config);
            };
        };

        var get = function (url, onSuccess) {
            notifier.pendingRequests++;
            $http.get(url).success(getOnCompleteWrapper(onSuccess)).error(getOnErrorWrapper());
        };

        var post = function (url, data, onSuccess) {
            notifier.pendingRequests++;
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
            loadLink: function (id, onSuccess) {
                get(config.serverApiBaseUrl + "links/getbyid/" + id, onSuccess);
            },

            loadLinks: function (searchString, tagIds, onSuccess) {
                get(config.serverApiBaseUrl + "links/" + buildQuery(searchString, tagIds), onSuccess);
            },

            updateLink: function (link, onSuccess) {
                post(config.serverApiBaseUrl + "links/", link, onSuccess);
            },

            loadTags: function (onSuccess) {
                get(config.serverApiBaseUrl + "tags/", onSuccess);
            },

            updateTags: function (tags, onSuccess) {
                post(config.serverApiBaseUrl + "tags/", tags, onSuccess);
            }
        };
    };

    ServerApiService.$inject = ["$http", "$timeout", "config", "notifier"];
    app.service("serverApi", ServerApiService);

})(keyPearlApp);