(function (app) {
    "use strict";

    var DraggableHelper = function () {

        var eventId = "text";
        var items = {};

        var add = function (event, key, object, onDragEnd) {
            items[key] = {
                data: object,
                onDragEnd: onDragEnd
            };

            event.dataTransfer.setData(eventId, key);
        };

        var getData = function (event) {
            var key = event.dataTransfer.getData(eventId);
            var entry = items[key];
            return entry ? entry.data : null;
        };

        var callOnDragEnd = function (key, isSuccess) {
            var entry = items[key];
            delete items[key];
            if (angular.isFunction(entry.onDragEnd)) {
                entry.onDragEnd(isSuccess);
            }
        };

        return {
            add: add,
            getData: getData,
            callOnDragEnd: callOnDragEnd
        };

    };

    DraggableHelper.$inject = [];
    app.service("draggableHelper", DraggableHelper);

})(keyPearlApp);