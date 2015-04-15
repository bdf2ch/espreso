/*****
 *
 *****/


"use strict";


var objects = angular.module("espreso.objects", [])
    .config(function ($provide) {
        $provide.factory("$objects", ["$log", "$http", "$window", "$espreso", function ($log, $http, $window, $espreso) {
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
            module.getChildNodes = function (nodeId, callback) {
                if (nodeId !== undefined) {
                    $log.log("callback called");
                    var params = {
                        action: "getChildNodes",
                        data: {
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
    }
});