(function (app) {
    "use strict";

    var DraggableDirective = function (draggableHelper) {

        var link = function (scope, element) {

            var onDragEnd = function (isSuccess) {
                scope.onDragEnd()(isSuccess);
            };

            var dragStartHandler = function (event) {
                draggableHelper.add(event, scope.draggable.id, scope.draggable, onDragEnd);
                scope.onDragStart()({event: event});
            };

            element.attr("draggable", true);
            element.on("dragstart", dragStartHandler);

            scope.$on("$destroy", function () {
                element.off("dragstart", dragStartHandler);
            });
        };

        return {
            restrict: "A",
            scope: {
                onDragStart: "&",
                onDragEnd: "&",
                draggable: "="
            },
            templateUrl: "",
            link: link
        };

    };

    DraggableDirective.$inject = ["draggableHelper"];
    app.directive("draggable", DraggableDirective);

})(keyPearlApp);