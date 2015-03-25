"use strict";

var menu = angular.module("espreso.menu", [])
    .config(function ($provide, $routeProvider) {
        $provide.factory("$menu", ["$log", function ($log) {
            var module = {};

            module.menuItems = [];
            module.subMenu = [];

            /* Регистрация раздела меню */
            module.register = function (menu) {
                if (menu && menu.constructor == Menu) {

                    /* Регистрация раздела главного меню */
                    $routeProvider.when(menu.url, {
                        templateUrl: menu.template,
                        controller: menu.controller
                    });

                    /* Регистрация разделов подменю */
                    if (menu.submenuItems.length > 0) {
                        for (var i = 0; i < menu.submenuItems.length; i++) {
                            $routeProvider.when(menu.submenuItems[i].url, {
                                templateUrl:  menu.submenuItems[i].template,
                                controller: menu.submenuItems[i].controller
                            });
                        }
                    }

                    /* Регистрация дополнительных разделов */
                    if (menu.links.length > 0) {
                        for (var link in menu.links) {
                            $routeProvider.when(menu.links[link].url, {
                                templateUrl: menu.links[link].template,
                                controller: menu.links[link].controller
                            });
                        }
                    }

                    module.menuItems.push(menu);
                }
            };


            /* Делает активным раздел меню */
            module.setActiveMenu = function (id) {
                if (id) {
                    for (var menu in module.menuItems) {
                        if (module.menuItems[menu].id == id) {
                            module.menuItems[menu].isActive = true;
                        } else {
                            module.menuItems[menu].isActive = false;
                        }
                    }
                }
            };


            /* Делает активным раздел подменю */
            module.setActiveSubmenu = function (id) {
                if (id) {
                    for (var submenu in module.subMenu) {
                        if (module.subMenu[submenu].id == id) {
                            module.subMenu[submenu].isActive = true;
                        } else {
                            module.subMenu[submenu].isActive = false;
                        }
                    }
                }
            };

            /* Регистрация пути стартовой страницы */
            $routeProvider.when('/', {
                templateUrl: "client/templates/dashboard/dashboard.html",
                controller: "DashboardCtrl"
            }).otherwise({ redirectTo: '/' });

            return module;
        }])
    })
    .run(function ($log, $rootScope, $route, $menu) {
        $rootScope.$on("$routeChangeStart", function (event, data) {
            for (var menu in $menu.menuItems) {
                if (data.$$route && data.$$route.originalPath == $menu.menuItems[menu].url) {
                    $menu.setActiveMenu($menu.menuItems[menu].id);
                    $menu.subMenu = $menu.menuItems[menu].submenuItems;
                }


                if (data.$$route && $menu.menuItems[menu].submenuItems.length > 0) {
                    for (var submenu in $menu.menuItems[menu].submenuItems) {
                        if ($menu.menuItems[menu].submenuItems[submenu].url == data.$$route.originalPath) {
                            $menu.subMenu = $menu.menuItems[menu].submenuItems;
                            $menu.setActiveSubmenu($menu.subMenu[submenu].id);
                            $menu.setActiveMenu($menu.menuItems[menu].id);
                        }
                    }
                }


                if (data.$$route && $menu.menuItems[menu].links.length > 0) {
                    for (var link in $menu.menuItems[menu].links) {
                        if ($menu.menuItems[menu].links[link].url == data.$$route.originalPath) {
                            $menu.subMenu = $menu.menuItems[menu].submenuItems;
                            $menu.setActiveMenu($menu.menuItems[menu].links[link].parentMenuId);
                            $menu.setActiveSubmenu($menu.menuItems[menu].links[link].parentSubMenuId);
                        }
                    }
                }
            }
        });


    });


menu.controller("MenuCtrl", ["$log", "$scope", "$menu", function ($log, $scope, $menu) {
    $scope.menu = $menu;
}]);