(function (app) {
    "use strict";

    app.constant("config", {
        serverApiBaseUrl: "http://localhost:61345/",
        serverApiLinksUrl: "links",
        serverApiTagsUrl: "tags",
        executeQueryAfter: 400,
        showPendingRequestsAfter: 800,
        defaultElementSeparator: "|",
        dropdownItemLimit: 25,
        cacheTagTrees: true,
    });

})(keyPearlApp);