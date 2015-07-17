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
                var tag = draggableHelper.getData(event);
                if (!tag) {
                    return;
                }

                var isSuccess = false;

                if (scope.canDrop()(tag)) {
                    scope.onDrop()(tag);
                    scope.$apply();
                    isSuccess = true;
                }

                draggableHelper.callOnDragEnd(tag.id, isSuccess);
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