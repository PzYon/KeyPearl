(function (app, angular) {
    "use strict";

    var MobileService = function ($window) {

        var isTouchDevice;

        function isTouch() {
            if (angular.isUndefined(isTouchDevice)) {
                isTouchDevice = (("ontouchstart" in $window)
                                 || (navigator.MaxTouchPoints > 0)
                                 || (navigator.msMaxTouchPoints > 0));
            }

            return isTouchDevice;
        }

        return {
            isTouch: isTouch
        };

    };

    MobileService.$inject = ["$window"];
    app.service("mobile", MobileService);

})(keyPearlApp, angular);