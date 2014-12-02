/***
 * Модуль основного приложения
 ***/

var espreso = angular.module("Espreso", ["ngRoute", "Users", "Authorization", "ngCookies"])
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

            module.activePartition = "";
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