"use strict";

var currentUser = angular.module("espreso.currentUser", ["ngCookies"])
    .config(function ($provide) {
        $provide.factory("$currentUser", ["$log", "$cookies", function ($log, $cookies) {
            var module = new User();

            module.fromCookie = function () {
                if ($cookies.user)
                    module.fromJSON(JSON.parse($cookies.user));
                $log.log(module);
            };

            return module;
        }]);
    })
    .run(function ($currentUser) {
        $currentUser.fromCookie();
    });
