(function(app){
    "use strict";

    app.constant("config", {
        serverApiBaseUrl: "http://localhost:61345/api/",
        serverApiLinksUrl: "links",
        serverApiTagsUrl: "tags",
        executeQueryAfter: 400,
        removeNotificationsAfter: 15000,
        showPendingRequestsAfter: 500
    });

})(keyPearlApp);