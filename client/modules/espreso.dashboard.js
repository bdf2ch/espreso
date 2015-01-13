"use strict";

var dashboard = angular.module("espreso.dashboard", [])
    .config(function ($provide) {
        $provide.factory("$dashboard", ["$log", function ($log) {
            var module = {};

            module.menu = new Menu({
                id: "dashboard",
                url: "/",
                template: "client/templates/dashboard/dashboard.html",
                controller: "DashboardCtrl",
                icon: "client/resources/img/house_32x32.png",
                order: 1
            });

            return module;
        }]);
    })
    .run(function ($menu, $dashboard) {
        $menu.register($dashboard.menu);
    });


dashboard.controller("DashboardCtrl", ["$log", "$scope", '$espreso', function ($log, $scope, $espreso) {
    $scope.app = $espreso;
}]);