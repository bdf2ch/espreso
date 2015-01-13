/*****
 * Модуль дял работы с пользователями
 *****/
"use strict";



var usr = angular.module('Users', [])
    .config(function ($provide) {
        $provide.factory("Users", ["$log", "$http", "$window", "$espreso", function ($log, $http, $window, $espreso) {
           // var module = {};
            var users = new Model();

            var module = new Module({
                id: "usersmodule",
                title: "Пользователи и группы пользователей",
                description: "Управление пользователями и группами пользователей системы"
            });

            module.model(users);

            module.menu = new Menu({
                id: "users",
                url: "/users",
                template: "client/templates/users/users_list_table.html",
                controller: "UsersCtrl",
                icon: "client/resources/img/group_32x32.png",
                order: 2
            })
                .submenu({
                    id: "users",
                    url: "/users",
                    template: "client/templates/users/users_list_table.html",
                    controller: "UsersCtrl",
                    title: "Пользователи"
                })
                .submenu({
                    id: "groups",
                    url: "/groups",
                    template: "client/templates/users/groups_list_table.html",
                    controller: "GroupsCtrl",
                    title: "Группы"
                })
                .link({
                    id: "newuser",
                    parentMenuId: "users",
                    parentSubMenuId: "users",
                    url: "/new-user",
                    parentId: "users",
                    template: "client/templates/users/user_add_form.html",
                    controller: "AddUserCtrl"
                })
                .link({
                    id: "newgroup",
                    parentMenuId: "users",
                    parentSubMenuId: "groups",
                    url: "/new-group",
                    parentId: "groups",
                    template: "client/templates/users/group_add_form.html",
                    controller: "AddGroupCtrl"
                })
                .link({
                    id: "edituser",
                    parentMenuId: "users",
                    parentSubMenuId: "users",
                    url: "/users/:userId",
                    template: "client/templates/users/user_edit_form.html",
                    controller: "EditUserCtrl"
                })
                .link({
                    id: "editgroup",
                    parentMenuId: "users",
                    parentSubMenuId: "groups",
                    url: "/groups/:groupId",
                    template: "client/templates/users/group_edit_form.html",
                    controller: "EditGroupCtrl"
                });

            module.moduleId = "users";
            module.users = new Collection(new User());
            module.groups = new Collection(new UserGroup());
            module.newUser = new User();
            module.newGroup = new UserGroup();
            module.newUser.password = new Field({ source: "PASSWORD", value: "" });
            module.currentGroup = undefined;
            module.currentUser = undefined;
            module.currentGroupIsDeleted = false;
            module.currentUserIsDeleted = false;
            module.groupAddedSuccessfully = false;
            module.userAddedSuccessfully = false;

            module.subMenu = [
                new SubMenu({
                    id: "userssubmenu",
                    url: "#/users",
                    title: "Пользователи"
                }),
                new SubMenu({
                    id: "groupssubmenu",
                    url: "#/groups",
                    title: "Группы"
                })
            ];

            /* Получает список пользователей */
            module.getUsers = function () {
                module.users.isLoaded = false;
                $http.post("server/controllers/users.php", {action: "query"}).success(function (data) {
                    module.users.isLoading = true;
                    if (data && parseInt(data) != 0) {
                        angular.forEach(data, function (user) {
                            var temp_user = new User();
                            //console.log(data);
                            temp_user.fromSOURCE(user);
                            module.users.add(temp_user);
                        });
                    }
                    module.users.isLoaded = true;
                    module.users.isLoading = false;

                    console.log(JSON.stringify(module.users.items));

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

                module.groups.isLoaded = false;
                $http.post("server/controllers/userGroups.php", params).success(function (data) {
                    module.groups.isLoading = true;
                    if (data && parseInt(data) != 0) {
                        angular.forEach(data, function (group) {
                            var temp_group = new UserGroup();
                            temp_group.fromSOURCE(group);
                            $log.log(temp_group);
                            module.groups.add(temp_group);
                        });
                    }
                    module.groups.isLoading = false;
                    module.groups.isLoaded = true;

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $log.log(module.groups);
                        $log.log(JSON.stringify(module.groups));
                        $window.localStorage.setItem("user_groups", JSON.stringify(module.groups.items));
                    }

                    $log.log(module.groups.items);
                });
            };



            /* Добавляет пользователя */
            module.addUser = function () {
                var params = {
                    action: "add",
                    data: {
                        name: module.newUser.name.value,
                        fname: module.newUser.fname.value,
                        surname: module.newUser.surname.value,
                        groupId: module.newUser.groupId.value,
                        email: module.newUser.email.value,
                        phone: module.newUser.phone.value,
                        password: module.newUser.password.value
                    }
                };

                $log.log(module.newUser);

                module.users.clearErrors();
                if (module.newUser.name.value == "")
                    module.users.errors.push("Вы не ввели имя пользователя");
                if (module.newUser.fname.value == "")
                    module.users.errors.push("Вы не ввели отчество пользователя");
                if (module.newUser.surname.value == "")
                    module.users.errors.push("Вы не ввели фамилию пользователя");
                if (module.newUser.groupId.value == 0)
                    module.users.errors.push("Вы не выбрали группу пользователей");
                if (module.newUser.email.value == "")
                    module.users.errors.push("Вы не ввели e-mail пользователя");
                if (module.newUser.password.value == "")
                    module.users.errors.push("Вы не ввели пароль пользователя");

                if (module.users.errors.length == 0) {
                    $http.post("server/controllers/users.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (user) {
                                var temp_user = new User();
                                temp_user.fromSOURCE(user);
                                module.users.add(temp_user);
                                if (user["MOMENT"])
                                    $espreso.setLocalDataVersion("users", parseInt(user["MOMENT"]))
                                $espreso.saveToLocalStorage("users", module.users.items);
                            });
                            module.userAddedSuccessfully = true;
                            module.newUser.reset();
                        }
                    });
                }
            };



            /* Добавляет новую группу пользователей */
            module.addGroup = function () {
                var params = {
                    action: "add",
                    data: {
                        title: module.newGroup.title.value,
                        description: module.newGroup.description.value
                    }
                };

                /* Валидация данных */
                //module.groups.errors.length = 0;
                module.groups.clearErrors();
                if (module.newGroup.title.value == "")
                    module.groups.errors.push("Вы не указали наименование группы");

                /* Если ошибок нет - отправляет данные новой группы контроллеру */
                if (module.groups.errors.length == 0) {
                    $http.post("server/controllers/userGroups.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (group) {
                                var temp_group = new UserGroup();
                                temp_group.fromSOURCE(group);
                                module.groups.add(temp_group);
                                if (group["MOMENT"])
                                    $espreso.setLocalDataVersion("user_groups", parseInt(group["MOMENT"]))
                                $espreso.saveToLocalStorage("user_groups", module.groups.items);
                            });
                            module.groupAddedSuccessfully = true;
                            module.newGroup.reset();
                        }
                    });
                }
            };


            module.editUser = function (id) {
                if (id) {
                    console.log("user id = " + id);
                    var temp_user = module.users.find("id", id);
                    console.log(temp_user);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_user.id.value,
                            groupId: temp_user.groupId.value,
                            name: temp_user.name.value,
                            fname: temp_user.fname.value,
                            surname: temp_user.surname.value,
                            email: temp_user.email.value,
                            phone: temp_user.phone.value
                        }
                    };

                    /* Валидация данных */
                    module.users.clearErrors();
                    if (temp_user.groupId.value == 0)
                        module.users.errors.push("Вы не выбрали группу, к которой относится пользователь");
                    if (temp_user.surname.value == "")
                        module.users.errors.push("Вы не указали фамилию пользователя");
                    if (temp_user.name.value == "")
                        module.users.errors.push("Вы не указали имя пользователя");
                    if (temp_user.fname.value == "")
                        module.users.errors.push("Вы не указали отчество пользователя");
                    if (temp_user.email.value == "")
                        module.users.errors.push("Вы не указали e-mail пользователя");

                    /* Если ошибок нет - отправляет данные измененной группы контроллеру */
                    if (module.users.errors.length == 0) {
                        $http.post("server/controllers/users.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (user) {
                                    if (user["MOMENT"])
                                        $espreso.setLocalDataVersion("users", parseInt(user["MOMENT"]));
                                    $espreso.saveToLocalStorage("users", module.users.items);
                                });
                                temp_user.setToNotChanged();
                                temp_user.cancelEditMode();
                            }
                        });
                    }
                }
            };

            /* Сохраняет измененную группу */
            module.editGroup = function (id) {
                if (id) {
                    console.log("group id = " + id);
                    var temp_group = module.groups.find("id", id);
                    console.log(temp_group);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_group.id.value,
                            title: temp_group.title.value,
                            description: temp_group.description.value
                        }
                    };

                    /* Валидация данных */
                    module.groups.clearErrors();
                    if (temp_group.title.value == "")
                        module.groups.errors.push("Вы не указали наименование группы");

                    /* Если ошибок нет - отправляет данные измененной группы контроллеру */
                    if (module.groups.errors.length == 0) {
                        $http.post("server/controllers/userGroups.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (group) {
                                    if (group["MOMENT"])
                                        $espreso.setLocalDataVersion("user_groups", parseInt(group["MOMENT"]));
                                    $espreso.saveToLocalStorage("user_groups", module.groups.items);
                                });
                                temp_group.setToNotChanged();
                                temp_group.cancelEditMode();
                            }
                        });
                    }
                }
            };


            /* Удаляет пользователя */
            module.deleteUser = function (user) {
                if (user) {
                    var params = {
                        action: "delete",
                        data: {
                            id: user.id.value
                        }
                    };

                    user.setDeleteProgress(true);
                    $http.post("server/controllers/users.php", params).success(function (data) {
                        if (data && data != 0) {
                            $log.log(data);
                            $espreso.setLocalDataVersion("users", parseInt(data));
                            module.currentUserIsDeleted = true;
                            user.setDeleteProgress(false);
                            module.users.remove("id", user.id.value);
                            $espreso.saveToLocalStorage("users", module.users.items);
                        }
                    });

                }
            };


            /* Удаляет группу */
            module.deleteGroup = function (group) {
                if (group) {
                    var params = {
                        action: "delete",
                        data: {
                            id: group.id.value
                        }
                    };

                    group.setDeleteProgress(true);
                    $http.post("server/controllers/userGroups.php", params).success(function (data) {
                        if (data && data != 0) {
                            $log.log(data);
                            $espreso.setLocalDataVersion("user_groups", parseInt(data));
                            module.currentGroupIsDeleted = true;
                            group.setDeleteProgress(false);
                            module.groups.remove("id", group.id.value);
                            $espreso.saveToLocalStorage("user_groups", module.groups.items);
                        }
                    });

                }
            };

            return module;
        }]);
    })
    .run(function ($log, $espreso, $window, Users, $menu, $modules) {
        $menu.register(Users.menu);
        $modules.register(Users);

        if ($window.localStorage) {
            /* Проверка актуальности коллеции пользователей */
            if ($espreso.getLocalDataVersion("users") && $espreso.getRemoteDataVersion("users")) {
                if ($espreso.getLocalDataVersion("users") < $espreso.getRemoteDataVersion("users")) {
                    Users.getUsers();
                    $espreso.setLocalDataVersion("users", $espreso.getRemoteDataVersion("users"));
                } else {
                    if ($window.localStorage.users) {
                        Users.users.fromJSON($espreso.loadFromLocalStorage("users"));
                    } else {
                        Users.getUsers();
                    }
                }
            }

            /* Проверка актуальности коллекции групп пользователей */
            if ($espreso.getLocalDataVersion("user_groups") && $espreso.getRemoteDataVersion("user_groups")) {
                if ($espreso.getLocalDataVersion("user_groups") < $espreso.getRemoteDataVersion("user_groups")) {
                    console.log("user_groups is out of date");
                    Users.getGroups();
                    $espreso.setLocalDataVersion("user_groups", $espreso.getRemoteDataVersion("user_groups"));
                } else {
                    if ($window.localStorage.user_groups) {
                        Users.groups.fromJSON($espreso.loadFromLocalStorage("user_groups"));
                    } else {
                        Users.getGroups();
                    }
                }
            }
        }
    });



/* Контроллер для доступа к данным модуля пользователей */
usr.controller("UsersCtrl", ["$scope", "$log", "$espreso", "Users", "$location", function ($scope, $log, $espreso, Users, $location) {
    $scope.app = $espreso;
    $scope.users = Users;
    $scope.errors = [];

    $log.log("users controller");

    /* Загружает шаблон формы добавления пользователя */
    $scope.gotoAddUserForm = function () {
        $location.url("/new-user");
    };

    /* Загружает шаблон формы редактирования пользователя */
    $scope.gotoEditUserForm = function (id) {
        $scope.users.currentUserId = id;
        $location.url("/users/" + id);
    };

}]);



/* Контроллер добавления пользователя */
usr.controller("AddUserCtrl", ["$log", "$scope", "$routeParams", "Users", function ($log, $scope, $routeParams, Users) {
    $scope.users = Users;

    /* Инициализация подменю и прочее*/
    $scope.users.userAddedSuccessfully = false;
    $scope.users.userAddedSuccessfully = false;
}]);



/* Контроллер редактирования пользователя */
usr.controller("EditUserCtrl", ["$log", "$scope", "$routeParams", "Users", "$modules", "$menu", function ($log, $scope, $routeParams, Users, $modules, $menu) {
    $scope.users = Users;
    $scope.modules = $modules;
    $scope.menu = $menu;
    $scope.currentUserId = $routeParams.userId;

    $log.log($scope.users.users.find("id", $scope.currentUserId));

    /* Инициализация подменю и прочего */
    $scope.users.currentUserIsDeleted = false;

    /* Если искомый пользователь сщуествует и коллекция пользователей не пустая */
    if ($scope.users.users.length() > 0 && $scope.users.users.find("id", $scope.currentUserId) != false)
        $scope.users.currentUser = $scope.users.users.find("id", $scope.currentUserId);
}]);



/* Контроллер групп пользователей */
usr.controller("GroupsCtrl", ["$log", "$scope", "$location", "Users", function ($log, $scope, $location, Users) {
    $scope.users = Users;

    /* Загружает шаблон формы добавления пользователя */
    $scope.gotoAddGroupForm = function () {
        $location.url("/new-group");
    };

    /* Загружает шаблон формы редактирования пользователя */
    $scope.gotoEditGroupForm = function (id) {
        $log.log("group id = " + id);

        $scope.users.currentGroupId = id;
        $location.url("groups/" + id);
    };

    /* Загружает шаблон списка всех пользователей */
    $scope.gotoListGroups = function () {

    };
}]);



/* Контроллер добавления группы пользователей */
usr.controller("AddGroupCtrl", ["$log", "$scope", "$routeParams", "Users", function ($log, $scope, $routeParams, Users) {
    $scope.users = Users;

    $scope.users.groupAddedSuccessfully = false;

}]);



/* Контроллер редактирования группы пользователей */
usr.controller("EditGroupCtrl", ["$log", "$scope", "$routeParams", "Users", function ($log, $scope, $routeParams, Users) {
    $scope.users = Users;
    $scope.currentGroupId = $routeParams.groupId;
    $scope.users.currentGroupIsDeleted = false;

    $log.log($routeParams.groupId);
    $log.log($scope.users.groups.find("id", $scope.currentGroupId));

    /* Если искомая группа сщуествует и коллекция групп пользователей не пустая */
    if ($scope.users.groups.length() > 0 && $scope.users.groups.find("id", $scope.currentGroupId) != false) {
        $scope.users.currentGroup = $scope.users.groups.find("id", $scope.currentGroupId);
        $log.log($scope.users.currentGroup);
    }
}]);
