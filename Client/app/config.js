(function (app) {
    "use strict";

    app.constant("config", {
        serverApiBaseUrl: "http://localhost:61345/",
        serverApiLinksUrl: "links",
        serverApiTagsUrl: "tags",
        executeQueryAfter: 400,
        showPendingRequestsAfter: 500,
        defaultElementSeparator: "|",
        dropdownItemLimit: 25
    });

})(keyPearlApp);