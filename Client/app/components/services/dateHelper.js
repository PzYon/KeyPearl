(function (app) {
    "use strict";

    var DateHelperService = function ($filter) {
        return {
            formatDate: function(date) {
                return $filter("date")(date, "dd.MM.yy @ HH:mm");
            }
        };
    };

    DateHelperService.$inject = ["$filter"];
    app.service("dateHelper", DateHelperService);

})(keyPearlApp);