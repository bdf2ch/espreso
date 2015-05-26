/***
 * Модуль основного приложения
 ***/

var espreso = angular.module("Espreso",
    [
        "ngRoute",
        "angularFileUpload",
        "espreso.users",
        "Authorization",
        "ngCookies",
        "espreso.menu",
        "espreso.currentUser",
        "espreso.dashboard",
        "espreso.modules",
        "espreso.contractors",
        "espreso.nomenklature",
        "espreso.pylons",
        "espreso.titules",
        "espreso.localData",
        "espreso.ui",
        "espreso.objects",
        "espreso.filters",
        "espreso.localData",
        "espreso.files",
        "espreso.links"
    ])
    .config(function ($provide, $routeProvider) {
        /* Сервис основного приложения - каркаса */
        $provide.factory("$espreso", ["$log", "$window", "$cookies", function ($log, $window, $cookies) {
            var module = {};

            module.activePartition = "";
            module.activeSubMenu = [];
            module.activeSubMenuId = "";
            module.subMenu = [];
            module.updates = {};
            module.sessionId = 0;

            /* Сохраняет данные в localStorage */
            module.saveToLocalStorage = function (lsname, data) {
                if (lsname && data) {
                    if ($window.localStorage) {
                        $window.localStorage.setItem(lsname, JSON.stringify(data));
                        return true;
                    } else {
                        $log.info("Браузер не поддерживает localStorage");
                        return false;
                    }
                }
            };

            /* Загружает данные из localStorage */
            module.loadFromLocalStorage = function (lsname) {
                if (lsname) {
                    if ($window.localStorage) {
                        //$log.log($window.localStorage);
                        if ($window.localStorage[lsname]) {
                            var data = JSON.parse($window.localStorage[lsname]);
                            return data;
                        } else {
                            $log.info("Объект '" + lsname + "' не определен в localStorage");
                            return false;
                        }
                    } else {
                        $log.info("Браузер не поддерживает localStorage");
                        return false;
                    }
                }
            };

            /* Получает версию удаленных данных из кук */
            module.getRemoteDataVersion = function (dtname) {
                if (dtname) {
                    if ($cookies[dtname]) {
                        //console.log("remote version of '" + dtname + "' = " + parseInt($cookies[dtname]));
                        return parseInt($cookies[dtname]);
                    } else {
                        $log.info("Информация об удаленной версии '" + dtname + "' отсутствует");
                        return false;
                    }
                }
            };

            /* Получает версию локальных данных из localStorage */
            module.getLocalDataVersion = function (dtname) {
                if (dtname) {
                    if ($window.localStorage) {
                        if ($window.localStorage.updates) {
                            var updates = module.loadFromLocalStorage("updates");
                            //$log.log(updates);
                            if (updates[dtname]) {
                                //console.log("local version of '" + dtname + "' = " + updates[dtname]);
                                return parseInt(updates[dtname]);
                            } else {
                                $log.info("В localStorage.updates отсутствует информация об обновлениях для '" + dtname + "'");
                                return false;
                            }
                        } else {
                            $log.info("В localStorage отсутствует информация о версиях данных");
                            return false;
                        }
                    } else {
                        $log.info("Браузер не поддерживает localStorage");
                        return false;
                    }
                }
            };

            /* Устанавливает версию локальных данных в localStorage */
            module.setLocalDataVersion = function (ldname, version) {
                if (ldname && version) {
                    if ($window.localStorage) {
                        if ($window.localStorage.updates) {
                            var updates = module.loadFromLocalStorage("updates");
                            updates[ldname] = version;
                            module.saveToLocalStorage("updates", updates);
                        } else {
                            $log.info("В localStorage отсутствует информация о версиях данных");
                            return false;
                        }
                    } else {
                        $log.info("Браузер не поддерживает localStorage");
                        return false;
                    }
                }
            };

            /* Установка и настройка механизма локального хранения данных */
            if ($window.localStorage) {
                if (!$window.localStorage.updates) {
                    var updates = {};
                    if ($cookies.object_types)
                        updates.object_types = parseInt($cookies.object_types);
                    if ($cookies.users)
                        updates.users = parseInt($cookies.users);
                    if ($cookies.user_groups)
                        updates.user_groups = parseInt($cookies.user_groups);
                    if ($cookies.titules)
                        updates.titules = parseInt($cookies.titules);
                    if ($cookies.contractor_types)
                        updates.contractor_types = parseInt($cookies.contractor_types);
                    if ($cookies.contractors)
                        updates.contractors = parseInt($cookies.contractors);
                    if ($cookies.titule_parts)
                        updates.titule_parts = parseInt($cookies.titule_parts);
                    if ($cookies.pylon_types)
                        updates.pylon_types = parseInt($cookies.pylon_types);
                    if ($cookies.vibro_types)
                        updates.vibro_types = parseInt($cookies.vibro_types);
                    if ($cookies.cable_types)
                        updates.cable_types = parseInt($cookies.cable_types);
                    if ($cookies.anchor_types)
                        updates.anchor_types = parseInt($cookies.anchor_types);
                    if ($cookies.power_lines)
                        updates.power_lines = parseInt($cookies.power_lines);
                    if ($cookies.statuses)
                        updates.statuses = parseInt($cookies.statuses);
                    if ($cookies.points)
                        updates.points = parseInt($cookies.points);

                    module.saveToLocalStorage("updates", updates);
                }
            }

            return module;
        }]);
    })
    .run(function ($log, $window, $espreso, $cookies, $menu) {
        /* Firefox window reload bug */
        if (!$cookies.user)
            $window.location.reload();
        else {
            $espreso.currentUser = JSON.parse($cookies.user);
        }

        $espreso.sessionId = $cookies.sessionid;
        $log.log("phpsessid = ", $espreso.sessionId);

        //$currentUser.fromCookie();
        $log.log($menu.items);

        moment.locale("ru");
    });


espreso.controller("EspresoCtrl", ["$log", "$scope", "$espreso", "Authorization", "$currentUser", function ($log, $scope, $espreso, Authorization, $currentUser) {
    $scope.app = $espreso;
    $scope.auth = Authorization;
    $scope.currentUser = $currentUser;
    $log.log("Espreso Controller");
}]);
