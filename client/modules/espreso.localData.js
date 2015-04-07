"use strict";

var data = angular.module("espreso.localData", [])
    .config(function ($provide) {
        /*****
         * $localData
         * Сервис локального хранения данных и их актуализации
         *****/
        $provide.factory("$localData", ["$log", "$window", function ($log, $window) {
            /* Описание модуля */
            var module = new Module({
                id: "localData",
                title: "Управление данными",
                description: "Сервис локального хранения и актуализации данных",
                version: "1.0"
            });

            /* Проверяет доступность localStorage */
            module.isLocalStorageEnabled = function () {
                var result = false;
                return result = $window.localStorage ? true : false;
            };


            /* Проверяет доступность записи о версиях данных в localStorage */
            module.isDataVersionsEnabled = function () {
                var result = false;
                return result = $window.localStorage.dataVersions ? true : false;
            };


            /* Сохраняет данные в localStorage */
            module.saveToLocalStorage = function (dataname, source) {
                if (dataname) {
                    if (source) {
                        if (module.isLocalStorageEnabled()) {
                            var stringifiedData = JSON.stringify(source);
                            $window.localStorage.setItem(dataname, stringifiedData);
                            return true;
                        } else {
                            $log.log("localStorage not enabled");
                            return false;
                        }
                    } else {
                        $log.log("Data not specified while saving data to localStorage");
                        return false;
                    }
                } else {
                    $log.log("Data name not specified while saving data to localStorage");
                    return false;
                }
            };


            /* Загружает данные из localStorage */
            module.loadFromLocalStorage = function (dataname) {
                if (dataname) {
                    if (module.isLocalStorageEnabled()) {
                        if ($window.localStorage[dataname]) {
                            var parsedData = JSON.parse($window.localStorage[dataname]);
                            return parsedData;
                        } else {
                            $log.log("Data '" + dataname + "' not enabled in localStorage");
                            return false;
                        }
                    } else {
                        $log.log("localStorage is not enabled");
                        return false;
                    }
                } else {
                    $log.log("Data name not specified while saving data to localStorage");
                    return false;
                }
            };


            /* Получает версию локальных данных */
            module.getLocalDataVersion = function (dataname) {
                if (dataname) {
                    if (module.isLocalStorageEnabled) {
                        if (module.isDataVersionsEnabled()) {
                            var versions = JSON.parse($window.localStorage.dataVersions);
                            if (versions[dataname]) {
                                return parseInt(versions[dataname]);
                            } else {
                                $log.log("Version of '" + dataname + "' not enabled in localStorage.dataVersions");
                                return false;
                            }
                        } else {
                            $log.log("'dataVersions' not enabled in localStorage");
                            return false;
                        }
                    } else {
                        $log.log("localStorage is not enabled");
                        return false;
                    }
                } else {
                    $log.log("Data name not specified while checking local version of data");
                    return false;
                }
            };


            /* Устанавливает версию локальных данных */
            module.setLocalDataVersion = function (dataname, version) {
                if (dataname) {
                    if (version) {
                        if (module.isLocalStorageEnabled()) {
                            if (module.isDataVersionsEnabled()) {
                                var versions = JSON.parse($window.localStorage.dataVersions);
                                if (versions[dataname]) {
                                    versions[dataname] = version;
                                    return true;
                                } else {
                                    $log.log("Version of '" + dataname + "' not enabled in localStorage.dataVersions");
                                    return false;
                                }
                            } else {
                                $log.log("'dataVersions' not enabled in localStorage");
                                return false;
                            }
                        } else {
                            $log.log("localStorage is not enabled");
                            return false;
                        }
                    } else {
                        $log.log("Version not specified while setting local data version");
                        return false;
                    }
                } else {
                    $log.log("Data name not specified while setting local data version");
                    return false;
                }
            };


            return module;
        }]);
    })
    .run(function ($modules, $localData) {
        $modules.register($localData);
    });