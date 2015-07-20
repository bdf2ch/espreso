/*****
 *
 *****/


"use strict";


var objects = angular.module("espreso.objects", [])
    .config(function ($provide) {
        $provide.factory("$objects", ["$log", "$http", "$window", "$espreso", "$titules", function ($log, $http, $window, $espreso, $titules) {
            var module = [];

            module.objectTypes = new Collection(new ObjectType());

            /* Получает список типов объектов */
            module.getObjectTypes = function () {

                var params = {
                    action: "getObjectTypes"
                };
                module.objectTypes.isLoaded = false;

                $http.post("server/controllers/objects.php", params).success(function (data) {
                    module.objectTypes.isLoading = true;
                    if (data && parseInt(data) != 0) {
                        angular.forEach(data, function (type) {
                            var temp_type= new ObjectType();
                            temp_type.fromSOURCE(type);
                            module.objectTypes.add(temp_type);
                        });
                    }
                    module.objectTypes.isLoaded = true;
                    module.objectTypes.isLoading = false;

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("object_types", JSON.stringify(module.objectTypes.items));
                    }
                });
            };

            /* Получает типы объектов по идентификатору точки */
            module.getObjectTypesByPointId = function (pointId, destination) {
                if (pointId && destination) {


                    $log.log("pointId = ", pointId);
                    var params = {
                        action: "objectTypesByPointId",
                        data: {
                            id: pointId
                        }
                    };
                    $http.post("server/controllers/object-types.php", params)
                        .success(function (data) {
                            if (data) {
                                $log.log(data);
                                angular.forEach(data, function (objTypeId) {
                                    $log.log("obtype = ", objTypeId["OBJECT_TYPE_ID"]);
                                    if (objTypeId["OBJECT_TYPE_ID"] != 0 && module.objectTypes.find("id", parseInt(objTypeId["OBJECT_TYPE_ID"])) != false) {
                                        destination.push(module.objectTypes.find("id", parseInt(objTypeId["OBJECT_TYPE_ID"])));
                                    }
                                });
                            }
                        });
                }
            };


            /* Получает все объекты по идентификатору точки */
            module.getObjectsByPointId = function (pointId, destination, callback) {
                if (pointId && destination) {

                    destination.pylons.splice(0, destination.pylons.length);
                    destination.unknown.splice(0, destination.unknown.length);
                    destination.objectTypesIds.splice(0, destination.objectTypesIds.length);
                    destination.powerLinesIds.splice(0, destination.powerLinesIds.length);
                    destination.states.ready = false;
                    destination.states.loading = true;

                    var params = {
                        action: "objectsByPointId",
                        data: {
                            id: pointId
                        }
                    };

                    $http.post("server/controllers/objects.php", params)
                        .success(function (data) {
                            if (data && parseInt(data) != 0) {
                                angular.forEach(data, function (object) {
                                    destination.parse(object);
                                });
                            }
                            destination.states.loading = false;
                            destination.states.ready = true;
                             if (callback)
                                 callback();
                        });
                }
            };


            /*** Получение дочерних узлов по id узла ***/
            module.getChildNodesInTitule = function (tituleId, nodeId, callback) {
                if (nodeId !== undefined) {
                    $log.log("callback called");
                    var params = {
                        action: "getChildNodesInTitule",
                        data: {
                            tituleId: tituleId,
                            nodeId: nodeId,
                            sessionId: $espreso.sessionId
                        }
                    };

                    $http.post("server/controllers/nodes.php", params)
                        .success(function (data) {
                            callback(nodeId, data);
                        }
                    );
                }
            };


            /**
             * Возвращает дочерние узлы заданного узла
             * @param tituleId {Number} - Идентификатор титула
             * @param titulePartId {Number} - Идентификатор участка титула
             * @param nodeId {Number} - Идентификатор узла
             * @param callback {Function} - Callback-функция
             */
            module.getChildNodes = function (tituleId, titulePartId, nodeId, callback) {
                if (tituleId !== undefined && titulePartId !== undefined && nodeId !== undefined) {
                    var params = {
                        action: "getChildNodes",
                        data: {
                            tituleId: tituleId,
                            titulePartId: titulePartId,
                            nodeId: nodeId,
                            sessionId: $espreso.sessionId
                        }
                    };
                    $http.post("server/controllers/nodes.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                callback(nodeId, data);
                            }
                        }
                    );
                }
            };


            module.getBranches = function (tituleId, titulePartId, nodeId, callback) {
                if (tituleId !== undefined && titulePartId !== undefined && nodeId !== undefined) {
                    if ($titules.currentTituleNodes.getNode(nodeId).branches === undefined) {
                        var params = {
                            action: "getBranches",
                            data: {
                                tituleId: tituleId,
                                titulePartId: titulePartId,
                                nodeId: nodeId
                            }
                        };
                        $http.post("server/controllers/nodes.php", params)
                            .success(function (data) {
                                if (callback !== undefined)
                                    callback(nodeId, data);
                            }
                        );
                    } else {
                        callback(nodeId, 0);
                    }
                }
            };


            /**
             * Заменяет указанный узел на другой узел
             * @param nodeId
             * @param newNodeId
             * @param tituleId
             * @param titulePartId
             * @param nodePathId
             * @param callback
             */
            module.change = function (nodeId, newNodeId, tituleId, titulePartId, nodePathId, callback) {
                var params = {
                    action: "change",
                    data: {
                        nodeId: nodeId,
                        newNodeId: newNodeId,
                        tituleId: tituleId,
                        titulePartId: titulePartId,
                        nodePathId: nodePathId
                    }
                };
                $http.post("server/controllers/nodes.php", params)
                    .success(function (data) {
                        if (callback !== undefined)
                            callback(data);
                    }
                );
            };


            /**
             *
             * @param objectTypeId
             * @param pointId
             * @param pylonTypeId
             * @param pylonSchemeTypeId
             * @param powerLineId
             * @param pylonNumber
             * @param callback
             */
            module.add = function (
                nodeTypeId,
                pointId,
                pylonTypeId,
                pylonSchemeTypeId,
                powerLineId,
                pylonNumber,
                callback ) {

                var params = {
                    action: "add",
                    data: {
                        nodeTypeId: nodeTypeId,
                        pointId: pointId,
                        pylonTypeId: pylonTypeId,
                        pylonSchemeTypeId: pylonSchemeTypeId,
                        powerLineId: powerLineId,
                        pylonNumber: pylonNumber
                    }
                };

                $http.post("server/controllers/nodes.php", params)
                    .success(function (data) {
                        if (callback !== undefined)
                            callback(data);
                    }
                );
            };


            module.getPylonsByPowerLineId = function (powerLineId, destination) {
                if (powerLineId !== undefined && destination !== undefined && destination.constructor === Collection) {
                    var params = {
                        action: "pylonsByPowerLine",
                        data: {
                            powerLineId: powerLineId
                        }
                    };

                    destination.clear();
                    $http.post("server/controllers/pylons.php", params)
                        .success(function (data) {
                            if (data !== undefined && parseInt(data) !== 0) {
                                angular.forEach(data, function (pylon) {
                                    var temp_pylon = new Pylon();
                                    temp_pylon.fromSOURCE(pylon);
                                    temp_pylon.onInit();
                                    temp_pylon.isBaseObject.value = 1;
                                    destination.add(temp_pylon);
                                });
                            }
                        }
                    );
                }
            };

            return module;
        }]);
    })
    .run(function ($espreso, $window, $objects) {
        if ($window.localStorage) {
            /* Проверка актуальности коллеции титулов */
            if ($espreso.getLocalDataVersion("object_types") && $espreso.getRemoteDataVersion("object_types")) {
                if ($espreso.getLocalDataVersion("object_types") < $espreso.getRemoteDataVersion("object_types")) {
                    $objects.getObjectTypes();
                    $espreso.setLocalDataVersion("object_types", $espreso.getRemoteDataVersion("object_types"));
                } else {
                    if ($window.localStorage.object_types) {
                        $objects.objectTypes.fromJSON($espreso.loadFromLocalStorage("object_types"));
                    } else {
                        $objects.getObjectTypes();
                    }
                }
            }
        }
    });


objects.filter("powerlines", function () {
    return function (input, supported) {
        if (supported && supported.length > 0) {
            //console.log("length of supported = ", supported.length);
            var powerlines = [];
            angular.forEach(input, function (powerline) {
                //console.log("type id = ", type.id.value);
                if (supported.indexOf(parseInt(powerline.id.value)) != -1) {
              //      console.log("powerline " + powerline.id.value + " found");
                    powerlines.push(powerline);
                }
            });
            return powerlines;
        } else
            return input;
    };
});



objects.controller("EditObjectController", ["$log", "$scope", "$objects", "$titules", "$espreso", "$nomenklature", "$routeParams", function ($log, $scope, $objects, $titules, $espreso, $nomenklature, $routeParams) {
    $scope.titules = $titules;
    $scope.objects = $objects;
    $scope.stuff = $nomenklature;
    $scope.node = undefined;
    $scope.pointObjects = new ObjectList();
    $scope.powerLineId = 0;

    if ($scope.titules.currentTituleNodes.getNode(parseInt($routeParams.objectId)) !== undefined) {
        $scope.node = $scope.titules.currentTituleNodes.getNode(parseInt($routeParams.objectId));
        $scope.objects.getObjectsByPointId($scope.node.pointId.value, $scope.pointObjects);
        $log.log($scope.pointObjects);
        $log.log("node for edit = ", $scope.node);
    }

    /* Ждем изменения значения id точки узла */
    $scope.$watch("node.pointId.value", function (newVal, oldVal) {
        if (oldVal !== undefined && newVal !== oldVal) {
            $log.log("POINT WATCHER");
            $scope.objects.getObjectsByPointId($scope.node.pointId.value, $scope.pointObjects);
            $scope.powerLineId = 0;
        }
        if (oldVal !== undefined && newVal === 0) {
            $log.log("end point 0");
            $scope.pointObjects.pylons.splice(0, $scope.pointObjects.pylons.length);
            $scope.pointObjects.objectTypesIds.splice(0, $scope.pointObjects.objectTypesIds.length);
            $scope.pointObjects.powerLinesIds.splice(0, $scope.pointObjects.powerLinesIds.length);
        }
        $scope.node.objectTypeId = 0;
    });


    /**
     * Производит замену узла на другой
     */
    $scope.saveChanges = function () {
        $scope.objects.change (
            $scope.node.backup.id,              // Идентификатор узла, который требуется заменить
            $scope.node.id.value,               // Идентификатор узла, на который будет произведена замена
            $scope.titules.currentTituleId,     // Идентификатор титула
            $scope.titules.currentTitulePartId, // Идентификатор участка титула
            $scope.titules.currentNodePathId    // Идентификатор пути, исходящег оиз узла
        );
    };
}]);