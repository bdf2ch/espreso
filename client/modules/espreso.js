/***
 * Модуль основного приложения
 ***/

var espreso = angular.module("Espreso", ["ngRoute", "Users", "Authorization", "ngCookies", "espreso.menu", "espreso.currentUser", "espreso.dashboard", "espreso.modules"])
    .config(function ($provide, $routeProvider) {
        /* Установка и настройка адресов-переходов */
        /*
        $routeProvider
            .when('/', {
                templateUrl: "client/templates/dashboard/dashboard.html",
                controller: "DashboardCtrl"
            }).when('/users', {
                templateUrl: "client/templates/users/users_list_table.html",
                controller: "UsersCtrl"
            }).when('/users/:userId', {
                templateUrl: "client/templates/users/user_edit_form.html",
                controller: "EditUserCtrl"
            }).when('/new-user', {
                templateUrl: "client/templates/users/user_add_form.html",
                controller: "AddUserCtrl"
            }).when('/groups', {
                templateUrl: "client/templates/users/groups_list_table.html",
                controller: "GroupsCtrl"
            }).when('/groups/:groupId', {
                templateUrl: "client/templates/users/group_edit_form.html",
                controller: "EditGroupCtrl"
            }).when('/new-group', {
                templateUrl: "client/templates/users/group_add_form.html",
                controller: "AddGroupCtrl"
            }).otherwise({ redirectTo: '/' });
            */


        /* Сервис основного приложения - каркаса */
        $provide.factory("$espreso", ["$log", "$window", "$cookies", function ($log, $window, $cookies) {
            var module = {};

            module.activePartition = "";
            module.activeSubMenu = [];
            module.activeSubMenuId = "";
            module.subMenu = [];
            module.updates = {
                users: 0,
                user_groups: 0
            };

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
                        console.log("remote version of '" + dtname + "' = " + parseInt($cookies[dtname]));
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
                                console.log("local version of '" + dtname + "' = " + updates[dtname]);
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

            /* Установка и настройка механизма локального храниения данных */
            if ($window.localStorage) {
                if (!$window.localStorage.updates) {
                    var updates = {};
                    if ($cookies.users)
                        updates.users = parseInt($cookies.users);
                    if ($cookies.user_groups)
                        updates.user_groups = parseInt($cookies.user_groups);
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

        //$currentUser.fromCookie();
        $log.log($menu.items);
    });


espreso.controller("EspresoCtrl", ["$log", "$scope", "$espreso", "Authorization", "$currentUser", function ($log, $scope, $espreso, Authorization, $currentUser) {
    $scope.app = $espreso;
    //$scope.menu = $submenu;
    $scope.auth = Authorization;
    $scope.currentUser = $currentUser;
    $log.log("Espreso Controller");

    $scope.$on("partition", function (event, data) {
        $scope.app.activePartition = data;
    });
}]);
