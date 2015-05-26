/*****
 *
 *****/


"use strict";


var pylons = angular.module("espreso.pylons", [])
    .config(function ($provide) {
        $provide.factory("$pylons", ["$log", "$http", function ($log, $http) {
            var module = {};

            module.pylonTypes = new Collection(new PylonType());

            /*** Получает список всех опор на линии по идентификатору линии ***/
            module.getPylonsByPowerlineId = function (powerlineId, destination) {
                if (powerlineId && destination && destination.constructor == Collection) {
                    destination.isLoaded = false;
                    destination.items.splice(0, destination.items.length);
                    var params = {
                        action: "pylonsByPowerLine",
                        data: {
                            powerLineId: powerlineId
                        }
                    };
                    $http.post("server/controllers/pylons.php", params)
                        .success(function (data) {
                            destination.isLoading = true;
                            if (data && parseInt(data) != 0) {
                                angular.forEach(data, function (pylon) {
                                    var temp_pylon = new Pylon();
                                    temp_pylon.fromSOURCE(pylon);
                                    temp_pylon.onInit();
                                    destination.add(temp_pylon);
                                });
                            }
                            destination.isLoaded = true;
                            destination.isLoading = false;
                        });
                }
            };



            /*** Получает опору по идентификатору ***/
            module.getPylonById = function (pylonId, destination) {
                if (pylonId && destination) {
                    var params = {
                        action: "pylonById",
                        data: {
                            id: pylonId
                        }
                    };
                    $http.post("server/controllers/pylons.php", params)
                        .success(function (data) {
                            $log.log(data);
                            if (data && parseInt(data) != 0) {
                                angular.forEach(data, function (pylon) {
                                    destination.fromSOURCE(pylon);
                                });
                            }
                        });
                }
            };


            return module;
        }]);
    })
    .run(function () {

    });

