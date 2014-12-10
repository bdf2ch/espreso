/*****
 * Модуль дял работы с пользователями
 *****/
"use strict";



var users = angular.module('Users', [])
    .config(function ($provide) {
        $provide.factory("Users", ["$log", "$http", "$window", function ($log, $http, $window) {
            var module = {};

            module.moduleId = "users";
            module.includes = {
                list: "client/templates/users/includes/users_list_table.html",
                add: "client/templates/users/includes/users_add_form.html",
                edit: "client/templates/users/includes/users_edit_form.html"
            };
            module.currentInclude = "";
            module.users = new Collection(new User());
            module.groups = new Collection();

            /* Получает список пользователей */
            module.getUsers = function () {
                var params = {
                    action: "query"
                };

                module.users.isLoaded = false;
                $http.post("server/controllers/users.php", params).success(function (data) {
                    module.users.isLoading = true;
                    if (data && parseInt(data) != 0) {
                        angular.forEach(data, function (user) {
                            var temp_user = new User();
                            temp_user.fromSOURCE(user);
                            module.users.add(temp_user);
                        });
                    }
                    module.users.isLoaded = true;
                    module.users.isLoading = false;

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("users", JSON.stringify(module.users.items));
                    }

                    $log.log(module.users.items);
                });
            };

            /* Получает список групп пользователей */
            module.getGroups = function () {
                var params = {
                    action: "query"
                };

                module.userGroups.isLoaded = false;
                $http.post("server/controllers/userGroups.php", params).success(function (data) {
                    if (data) {
                        angular.forEach(data, function (group) {
                            var temp_group = new UserGroup();
                            temp_group.fromJSON(group);
                            module.groups.add(temp_group);
                        });
                    }
                });
                module.groups.isLoading = false;
                module.groups.isLoaded = true;

                /* Если доступен localStorage, то сохраняет данные туда */
                if ($window.localStorage) {
                    $window.localStorage.setItem("userGroups", JSON.stringify(module.groups.items));
                }
            };

            return module;
        }]);
    })
    .run(function ($log, Espreso) {
        $log.log("USERS EXECUTED");
    });



/* Контроллер для доступа к данным модуля пользователей */
users.controller("UsersCtrl", ["$scope", "$log", "Espreso", "Users", function ($scope, $log, Espreso, Users) {
    $scope.app = Espreso;
    $scope.users = Users;

    $log.log("Users controller");

    $scope.$emit("partition", $scope.users.moduleId);
    $scope.users.currentInclude = $scope.users.includes.list;
}]);

