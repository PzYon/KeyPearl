(function (app) {
    "use strict";

    app.constant("config", {
        serverApiBaseUrl: "$build:serverApiBaseUrl$",
        serverApiLinksUrl: "links/",
        serverApiTagsUrl: "tags/",
        executeQueryAfter: 400,
        showPendingRequestsAfter: 800,
        defaultElementSeparator: "|",
        dropdownItemLimit: 25,
        cacheTagTrees: true,
    });

})(keyPearlApp);