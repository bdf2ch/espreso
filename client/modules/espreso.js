/***
 * Модуль основного приложения
 ***/

var espreso = angular.module("Espreso", ["ngRoute", "Users", "Authorization", "ngCookies"])
    .config(function ($provide, $routeProvider) {
        /* Установка и настройка адресов-переходов */
        $routeProvider
            .when('/', {
                templateUrl: 'client/templates/dashboard/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .when('/users', {
                templateUrl: 'client/templates/users/users.html',
                controller: 'UsersCtrl'
            })
            .otherwise({ redirectTo: '/' });

        /* Сервис основного приложения - каркаса */
        $provide.factory("Espreso", ["$log", "Users", function ($log, Users) {
            var module = {};

            module.activePartition = "";
            module.currentUser = new User();
            module.users = Users;
            module.updates = {
                users: 0,
                userGroups: 0
            };

            return module;
        }]);
    })
    .run(function ($log, $window, Espreso, $cookies, Users) {
        $log.log("ESPRESO EXECUTED");

        if ($window.localStorage) {
            if ($window.localStorage.updates) {
                var updates = JSON.parse($window.localStorage.updates);

                /* Если локальная версия коллекции пользователей старше удаленной - скачиваем себе свежую версию */
                if ($window.localStorage.users) {
                    if (updates.users && $cookies.USERS && updates.users < parseInt($cookies.USERS)) {
                        updates.users = parseInt($cookies.USERS);
                        Users.getUsers();
                    } else if (updates.users && $cookies.USERS && updates.users == parseInt($cookies.USERS)) {
                        var users = JSON.parse($window.localStorage.users);
                        Users.users.fromJSON(users);
                    }
                } else {
                    Users.getUsers();
                }


            } else {
                var updates = {};

                /* Устанавливаем дату последнего изменения коллекции пользователей */
                if ($cookies.USERS)
                    updates.users = parseInt($cookies.USERS);
                Users.getUsers();

                /* Устанавливаем дату последнего изменения коллекции групп пользователей */
                if ($cookies.USER_GROUPS)
                    updates.userGroups = parseInt($cookies.USER_GROUPS);

                /* Записываем информацию об изменениях коллекций в localStorage */
                $window.localStorage.updates = JSON.stringify(updates);
            }
        }


        /* Firefox window reload bug */
        if (!$cookies.user)
            $window.location.reload();
        else {
            Espreso.currentUser = JSON.parse($cookies.user);
        }
    });


espreso.controller("EspresoCtrl", ["$log", "$scope", "Espreso", "Authorization", function ($log, $scope, Espreso, Authorization) {
    $scope.app = Espreso;
    $scope.auth = Authorization;
    $log.log("Espreso Controller");


    $scope.$on("partition", function (event, data) {
        $scope.app.activePartition = data;
    });
}]);


espreso.controller("DashboardCtrl", ["$log", "$scope", function ($log, $scope) {
    $scope.$emit("partition", "dashboard");
}]);