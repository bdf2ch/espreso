"use strict";


var ui = angular.module("espreso.ui", []);


    ui.directive('tabs', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: function($scope) {
                var panes = $scope.panes = [];

                $scope.select = function(pane) {
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                };

                this.addPane = function(pane) {
                    if (panes.length === 0) {
                        $scope.select(pane);
                    }
                    panes.push(pane);
                };
            },
            template: '<ul><li ng-repeat="tab in panes"></li></ul>'
        };
    });
    ui.directive('tab', function() {
        return {
            require: '^tabs',
            restrict: 'E',
            transclude: true,
            scope: {
                title: '@'
            },
            link: function(scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template: '<span>sdas</span>'
        };
    });


ui.directive("flexible", ["$log", function ($log) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var parent = element.parent();
            $log.log(parent);
            var parent_width = angular.element(parent).prop("offsetWidth");
            $log.log("flexible");
            $log.log("pw = " + parent_width);
            //angular.element(element).css({"width": parent_width - 250 + 'px'});
        }
    }
}]);


ui.directive("typeahead", ["$log", "$document", function ($log) {
    return {
        restrict: "E",
        require: "ngModel",
        scope: {
            collection: "=",
            placeholder: "@",
            collectionValue: "@",
            ngDisabled: "="
            //ngChange: "="
        },
        templateUrl: "client/templates/ui/typeahead.html",
        link: function (scope, element, attrs, ctrl) {
            var matches = scope.matches = [];
            var display = scope.display = "";
            var ctrl = scope.ctrl = ctrl;

            //scope.$watch("collection.items", function (value) {
            //    $log.log("collection changed", scope.collection.items.length);
            //});



            scope.$watch("collection.length", function (value) {
                console.log("new collection length = ", value);
                if (value > 0) {
                    angular.forEach(scope.collection, function (item) {
                        if (item[scope.collectionValue] && item[scope.collectionValue].value == scope.ctrl.$modelValue) {
                            scope.display = item.typeahead;
                        }
                    });
                }
            });


            /*
            scope.$watch("collection", function (newVal, oldVal) {
                if (newVal != oldVal) {
                    console.log("collection changed ");
                    //scope.collection = newVal;
                    if (newVal.length > 0) {
                        angular.forEach(newVal, function (item) {
                            if (item[scope.collectionValue] && item[scope.collectionValue].value == scope.ctrl.$modelValue) {
                                scope.display = item.typeahead;
                            }
                        });
                    }

                }

            });
            */

            /* Отслеживание изменения модели данных */
            scope.$watch("ctrl.$modelValue", function (newValue, oldValue) {
                $log.log("new model value = ", newValue);
                if (newValue == "") {
                    scope.display = "";
                    scope.ctrl.$setViewValue(0);
                } else {
                    //if (scope.collection.length == 0)
                    //    console.log("collection is empty");
                    angular.forEach(scope.collection, function (item) {
                        if (item[scope.collectionValue] && item[scope.collectionValue].value == scope.ctrl.$modelValue) {
                            $log.log("typeahead = " + item.typeahead);
                            scope.display = item.typeahead;
                        }
                    });
                }
                //scope.ngChange;
            });

            /* Парсер модели данных - то, что попадает в модель */
            function parser (value) {
                if (value != undefined){
                    $log.log("new value = ", value);
                    return value;
                }

            };
            scope.ctrl.$parsers.push(parser);



            scope.update = function () {
                matches.splice(0, matches.length);
                angular.forEach(scope.collection, function (item) {
                    $log.log("tepeahead = ", item.typeahead);
                    $log.log("modelValue = ", scope.ctrl.$modelValue);
                    if (scope.display != "" && item.typeahead.toLowerCase().indexOf(scope.display.toLocaleLowerCase()) != -1) {
                        matches.push(item);
                    }
                    if (scope.display == "") {
                        $log.log("empty");
                        scope.ctrl.$setViewValue(0);
                    }

                });
                $log.log(matches.length);
            };

            scope.select = function (index) {
                $log.log("index = ", index);
                scope.display = matches[index].typeahead;
                if (matches[index][scope.collectionValue]) {
                    $log.log(matches[index].typeahead);
                    $log.log(scope.collectionValue + " = " + matches[index][scope.collectionValue].value);
                    scope.ctrl.$setViewValue(parseInt(matches[index][scope.collectionValue].value));
                }
                else
                    $log.log("No such field in found");
                matches.splice(0, matches.length);
            };


        }
    }
}]);
