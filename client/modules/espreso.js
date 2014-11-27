/***
 * Модуль основного приложения
 ***/

var espreso = angular.module("Espreso", ["ngRoute", "Users", "Authorization"])
    .config(function ($provide) {
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
            $window.localStorage.setItem("test", JSON.stringify(Espreso.currentUser));
            $log.log(JSON.parse($window.localStorage.test));

            if ($window.localStorage.users) {

            } else
                $log.log("Users dataset not found in localStorage");
        }
        else
            $log.log("localStorage is disabled");

        /* Firefox window reload bug */
        if (!$cookies.user)
            $window.location.reload();
    });


espreso.controller("TestCtrl", ["$log", "$scope", "Authorization", function ($log, $scope, Authorization) {
    $scope.auth = Authorization;
}]);