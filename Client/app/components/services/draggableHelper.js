(function (app) {
    "use strict";

    var DraggableHelper = function () {

        var eventId = "text";
        var items = {};

        var add = function (event, key, object, onDragEnd) {
            items[key] = {
                key: key,
                data: object,
                onDragEnd: onDragEnd
            };

            // key must be a string in order to work in IE
            event.dataTransfer.setData(eventId, key.toString());
        };

        var getEntry = function (event) {
            var key = event.dataTransfer.getData(eventId);
            return items[key];
        };

        var callOnDragEnd = function (entry, isSuccess) {
            delete items[entry.key];
            if (angular.isFunction(entry.onDragEnd)) {
                entry.onDragEnd(entry.data, isSuccess);
            }
        };

        return {
            add: add,
            getEntry: getEntry,
            callOnDragEnd: callOnDragEnd
        };

    };

    DraggableHelper.$inject = [];
    app.service("draggableHelper", DraggableHelper);

})(keyPearlApp);