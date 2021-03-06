(function (app) {
    "use strict";

    var ServerApiService = function ($http, $timeout, config, notifier) {

        var errorHandler = function (data, status, headers, config) {
            var notification;
            switch (status) {
                case -1:
                    notification = {message: "cannot connect to server.. maybe it's down?", key: "serverDown"};
                    break;

                case 500:
                    notification = {message: config.url + " | " + data.errorMessage, serverTime: data.serverTimeInMs};
                    break;

                default:
                    notification = config.url + " | " + status + ": " + data.message;
                    if (data.messageDetail) {
                        notification += " (" + data.messageDetail + ")";
                    }
                    break;
            }

            notifier.addError(notification);
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

        var del = function (url, onSuccess) {
            notifier.pendingRequests++;
            $http.delete(url).success(getOnCompleteWrapper(onSuccess)).error(getOnErrorWrapper());
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

        var linksUrl = config.serverApiBaseUrl + config.serverApiLinksUrl;
        var tagsUrl = config.serverApiBaseUrl + config.serverApiTagsUrl;

        return {
            loadLink: function (id, onSuccess) {
                get(linksUrl + id, onSuccess);
            },

            searchLinks: function (searchString, tagIds, onSuccess) {
                get(linksUrl + "search/" + buildQuery(searchString, tagIds), onSuccess);
            },

            updateLink: function (link, onSuccess) {
                post(linksUrl, link, onSuccess);
            },

            deleteLink: function (link, onSuccess) {
                del(linksUrl + link.id, onSuccess);
            },

            loadTags: function (onSuccess) {
                get(tagsUrl, onSuccess);
            },

            updateTags: function (tags, onSuccess) {
                post(tagsUrl, tags, onSuccess);
            },

            deleteTag: function (tag, onSuccess) {
                del(tagsUrl + tag.id, onSuccess);
            },

            loadTagStatistics: function (tagId, onSuccess) {
                get(tagsUrl + "statistics/" + tagId, onSuccess);
            }
        };
    };

    ServerApiService.$inject = ["$http", "$timeout", "config", "notifier"];
    app.service("serverApi", ServerApiService);

})(keyPearlApp);