/***
 * Модуль основного приложения
 ***/

var espreso = angular.module("Espreso", ["ngRoute", "Users", "Authorization"])
    .config(function ($provide, $routeProvider) {
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

        $provide.factory("Espreso", ["$log", "Users", function ($log, Users) {
            var module = {};

            module.currentUser = new User();
            module.users = Users;

            return module;
        }]);
    })
    .run(function ($log, $window, Espreso, $cookies) {
        $log.log("ESPRESO EXECUTED");

        if ($window.localStorage) {
            $log.log("localStorage is enabled");

            /* Если справочник пользователей отсутствует в localStorage - загружаем его */
            if ($window.localStorage.users) {

            } else
                $log.log("Users dataset not found in localStorage");
        }
        else
            $log.log("localStorage is disabled");

        /* Firefox window reload bug */
        if (!$cookies.user)
            $window.location.reload();
        else {
            Espreso.currentUser = JSON.parse($cookies.user);
        }
    });


espreso.controller("HeaderCtrl", ["$log", "$scope", "Authorization", "Espreso", "$cookies", function ($log, $scope, Authorization, Espreso, $cookies) {
    $scope.app = Espreso;
    $scope.auth = Authorization;
    $log.log("HeaderCtrl");
    $log.log(JSON.parse($cookies.user));
}]);

espreso.controller("DashboardCtrl", ["$log", "$scope", function ($log, $scope) {

}]);