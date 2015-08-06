(function (app) {
    "use strict";

    var MobileService = function ($window) {

        var isTouchDevice;

        function isTouch() {
            if (angular.isUndefined(isTouch)) {
                isTouchDevice = (("ontouchstart" in $window)
                                 || (navigator.MaxTouchPoints > 0)
                                 || (navigator.msMaxTouchPoints > 0));
            }
            return isTouch;
        }

        return {
            isTouch: isTouch
        };

    };

    MobileService.$inject = ["$window"];
    app.service("mobile", MobileService);

})(keyPearlApp);