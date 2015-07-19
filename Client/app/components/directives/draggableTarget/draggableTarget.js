(function (app) {
    "use strict";

    var DraggableTargetDirective = function (draggableHelper) {

        var link = function (scope, element) {

            var dragOverHandler = function (event) {
                // it would be nice if we could check here if we can drop on target.
                // this however ain't possible due to bugs/restrictions within the
                // browsers.. that's why we try to do it in the drop.
                event.preventDefault();
            };

            var dropHandler = function (event) {

                // required for everything to work fine in FF
                event.preventDefault();

                var entry = draggableHelper.getEntry(event);
                if (!entry || !entry.data) {
                    return;
                }

                var isSuccess = false;
                var object = entry.data;

                if (scope.canDrop()(object)) {
                    scope.onDrop()(object);
                    scope.$apply();
                    isSuccess = true;
                }

                draggableHelper.callOnDragEnd(entry.key, isSuccess);

            };

            element.on("dragover", dragOverHandler);
            element.on("drop", dropHandler);

            scope.$on("$destroy", function () {
                element.off("dragover", dragOverHandler);
                element.off("drop", dropHandler);
            });
        };

        return {
            restrict: "A",
            scope: {
                onDrop: "&",
                canDrop: "&"
            },
            templateUrl: "",
            link: link
        };

    };

    DraggableTargetDirective.$inject = ["draggableHelper"];
    app.directive("draggableTarget", DraggableTargetDirective);

})(keyPearlApp);