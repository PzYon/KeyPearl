(function (app) {
    "use strict";

    // todo: we should not copy this with gulp in order to not overwrite the settings
    // already stored on the server..

    app.constant("config", {
        serverApiBaseUrl: "http://localhost:61345/",
        serverApiLinksUrl: "links",
        serverApiTagsUrl: "tags",
        executeQueryAfter: 400,
        showPendingRequestsAfter: 500
    });

})(keyPearlApp);