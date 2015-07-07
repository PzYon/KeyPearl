(function (app) {
    "use strict";

    var ServerApiService = function ($http, $timeout, config, notificationHelper) {

        function errorHandler(data, status, headers, config) {
            if (!status) {
                notificationHelper.add("Cannot connect to server.. Maybe it's down?", true);
            } else {
                notificationHelper.add(config.url + ": " + data.exceptionMessage, true);
            }
        }

        function getOnErrorWrapper() {
            return getOnCompleteWrapper(errorHandler);
        }

        function getOnCompleteWrapper(onComplete) {
            return function (data, status, headers, config) {
                notificationHelper.pendingRequests--;
                onComplete(data, status, headers, config);
            };
        }

        function get(url, onSuccess, onError) {
            notificationHelper.pendingRequests++;
            $http.get(url).success(getOnCompleteWrapper(onSuccess)).error(getOnErrorWrapper());
        }

        function post(url, data, onSuccess, onError) {
            notificationHelper.pendingRequests++;
            $http.post(url, data).success(getOnCompleteWrapper(onSuccess)).error(getOnErrorWrapper());
        }

        function buildQuery(searchString, tagIds) {
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
        }

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