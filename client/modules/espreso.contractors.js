"use strict";

/*****
 * Модуль контрагентов и типов контрагентов системы
 *****/
var contractors = angular.module("espreso.contractors", [])
    .config(function ($provide) {
        $provide.factory("$contractors", ["$log", "$http", "$window", "$espreso", function ($log, $http, $window, $espreso) {
            var module = new Module({
                id: "contractorsmodule",
                title: "Контрагенты и типы контрагентов",
                description: "Управление контрагентами и типами контрагентов системы"
            });

            module.menu = new Menu({
                id: "contractors",
                url: "/contractors",
                template: "client/templates/contractors/contractors_list_table.html",
                controller: "ContractorsCtrl",
                icon: "client/resources/img/contractors_32x32.png",
                order: 3,
                description: "Контрагенты и типы контрагентов"
            })
                .submenu({
                    id: "contractors",
                    url: "/contractors",
                    template: "client/templates/contractors/contractors_list_table.html",
                    controller: "ContractorsCtrl",
                    title: "Контрагенты"
                })
                .submenu({
                    id: "contractortypes",
                    url: "/contractor-types",
                    template: "client/templates/contractors/contractor_types_list_table.html",
                    controller: "ContractorTypesCtrl",
                    title: "Типы контрагентов"
                })
                .link({
                    id: "newcontractor",
                    parentMenuId: "contractors",
                    parentSubMenuId: "contractors",
                    url: "/new-contractor",
                    template: "client/templates/contractors/contractor_add_form.html",
                    controller: "AddContractorCtrl"
                })
                .link({
                    id: "newcontractortype",
                    parentMenuId: "contractors",
                    parentSubMenuId: "contractortypes",
                    url: "/new-contractor-type",
                    template: "client/templates/contractors/contractor_type_add_form.html",
                    controller: "AddContractorTypeCtrl"
                })
                .link({
                    id: "editcontractor",
                    parentMenuId: "contractors",
                    parentSubMenuId: "contractors",
                    url: "/contractors/:contractorId",
                    template: "client/templates/contractors/contractor_edit_form.html",
                    controller: "EditContractorCtrl"
                })
                .link({
                    id: "editcontractortype",
                    parentMenuId: "contractors",
                    parentSubMenuId: "contractortypes",
                    url: "/contractor-types/:contractorTypeId",
                    template: "client/templates/contractors/contractor_type_edit_form.html",
                    controller: "EditContractorTypeCtrl"
                });

            module.contractors = new Collection(new Contractor());
            module.contractorTypes = new Collection(new ContractorType());
            module.newContractor = new Contractor();
            module.newContractorType = new ContractorType();
            module.currentContractor = undefined;
            module.currentContractorType = undefined;
            module.currentContractorIsDeleted = false;
            module.currentContractorTypeIsDeleted = false;
            module.contractorAddedSuccessfully = false;
            module.contractorTypeAddedSuccessfully = false;



            /* Получает список типов контрагентов */
            module.getContractorTypes = function () {
                module.contractorTypes.isLoaded = false;
                $http.post("server/controllers/contractor-types.php", {action: "query"}).success(function (data) {
                    module.contractorTypes.isLoading = true;
                    if (data && parseInt(data) != 0) {
                        angular.forEach(data, function (type) {
                            var temp_type = new ContractorType();
                            //console.log(data);
                            temp_type.fromSOURCE(type);
                            module.contractorTypes.add(temp_type);
                        });
                    }
                    module.contractorTypes.isLoaded = true;
                    module.contractorTypes.isLoading = false;

                    console.log(JSON.stringify(module.contractorTypes.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("contractor_types", JSON.stringify(module.contractorTypes.items));
                    }

                    $log.log(module.contractorTypes.items);
                });
            };


            /* Добавляет новый тип контрагента */
            module.addContractorType = function () {
                var params = {
                    action: "add",
                    data: {
                        title: module.newContractorType.title.value
                    }
                };

                /* Валидация данных */
                module.contractorTypes.clearErrors();
                if (module.newContractorType.title.value == "")
                    module.contractorTypes.errors.push("Вы не указали наименование типа контрагента");

                /* Если ошибок нет - отправляет данные новой группы контроллеру */
                if (module.contractorTypes.errors.length == 0) {
                    $http.post("server/controllers/contractor-types.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (type) {
                                var temp_type = new ContractorType();
                                temp_type.fromSOURCE(type);
                                module.contractorTypes.add(temp_type);
                                if (type["MOMENT"])
                                    $espreso.setLocalDataVersion("contractor_types", parseInt(type["MOMENT"]))
                                $espreso.saveToLocalStorage("contractor_types", module.contractorTypes.items);
                            });
                            module.contractorTypeAddedSuccessfully = true;
                            module.newContractorType.reset();
                        }
                    });
                }
            };


            /* Сохраняет изменения в тип контрагента */
            module.editContractorType = function (id) {
                if (id) {
                    console.log("contractor type id = " + id);
                    var temp_type = module.contractorTypes.find("id", id);
                    console.log(temp_type);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_type.id.value,
                            title: temp_type.title.value
                        }
                    };

                    /* Валидация данных */
                    module.contractorTypes.clearErrors();
                    if (temp_type.title.value == 0)
                        module.contractorTypes.errors.push("Вы не ввели наименование типа контрагента");

                    /* Если ошибок нет - отправляет данные измененного тика контрагента контроллеру */
                    if (module.contractorTypes.errors.length == 0) {
                        $http.post("server/controllers/contractor-types.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (type) {
                                    if (type["MOMENT"])
                                        $espreso.setLocalDataVersion("contractor_types", parseInt(type["MOMENT"]));
                                    $espreso.saveToLocalStorage("contractor_types", module.contractorTypes.items);
                                });
                                temp_type.setToNotChanged();
                                temp_type.cancelEditMode();
                            }
                        });
                    }
                }
            };


            /* Удаляет тип контрагента */
            module.deleteContractorType = function (contractorType) {
                if (contractorType) {
                    var params = {
                        action: "delete",
                        data: {
                            id: contractorType.id.value
                        }
                    };

                    contractorType.setDeleteProgress(true);
                    $http.post("server/controllers/contractor-types.php", params).success(function (data) {
                        if (data && data != 0) {
                            $log.log(data);
                            $espreso.setLocalDataVersion("contractor_types", parseInt(data));
                            module.currentContractorTypeIsDeleted = true;
                            contractorType.setDeleteProgress(false);
                            module.contractorTypes.remove("id", contractorType.id.value);
                            $espreso.saveToLocalStorage("contractor_types", module.contractorTypes.items);
                        }
                    });

                }
            };


            /* Получает список контрагентов */
            module.getContractors = function () {
                module.contractors.isLoaded = false;
                $http.post("server/controllers/contractors.php", {action: "query"}).success(function (data) {
                    module.contractors.isLoading = true;
                    if (data && parseInt(data) != 0) {
                        angular.forEach(data, function (contractor) {
                            var temp_contractor = new Contractor();
                            //console.log(data);
                            temp_contractor.fromSOURCE(contractor);
                            module.contractors.add(temp_contractor);
                        });
                    }
                    module.contractors.isLoaded = true;
                    module.contractors.isLoading = false;

                    console.log(JSON.stringify(module.contractors.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("contractors", JSON.stringify(module.contractors.items));
                    }

                    $log.log(module.contractors.items);
                });
            };


            /* Добавляет нового контрагента */
            module.addContractor = function () {
                var params = {
                    action: "add",
                    data: {
                        title: module.newContractor.title.value,
                        fullTitle: module.newContractor.fullTitle.value,
                        contractorTypeId: module.newContractor.contractorTypeId.value
                    }
                };

                /* Валидация данных */
                module.contractors.clearErrors();
                if (module.newContractor.title.value == "")
                    module.contractors.errors.push("Вы не указали наименование контрагента");
                if (module.newContractor.fullTitle.value == "")
                    module.contractors.errors.push("Вы не указали полное наименование контрагента");
                if (module.newContractor.contractorTypeId.value == 0)
                    module.contractors.errors.push("Вы не выбрали тип контрагента");

                /* Если ошибок нет - отправляет данные новой группы контроллеру */
                if (module.contractors.errors.length == 0) {
                    $http.post("server/controllers/contractors.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (contractor) {
                                var temp_contractor = new Contractor();
                                temp_contractor.fromSOURCE(contractor);
                                module.contractors.add(temp_contractor);
                                if (contractor["MOMENT"])
                                    $espreso.setLocalDataVersion("contractors", parseInt(contractor["MOMENT"]));
                                $espreso.saveToLocalStorage("contractors", module.contractors.items);
                            });
                            module.contractorAddedSuccessfully = true;
                            module.newContractor.reset();
                        }
                    });
                }
            };


            /* Сохраняет изменения в контрагенте */
            module.editContractor = function (id) {
                if (id) {
                    console.log("contractor id = " + id);
                    var temp_contractor = module.contractors.find("id", id);
                    console.log(temp_contractor);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_contractor.id.value,
                            title: temp_contractor.title.value,
                            fullTitle: temp_contractor.fullTitle.value,
                            contractorTypeId: temp_contractor.contractorTypeId.value
                        }
                    };

                    /* Валидация данных */
                    module.contractors.clearErrors();
                    if (temp_contractor.title.value == 0)
                        module.contractors.errors.push("Вы не ввели наименование контрагента");
                    if (temp_contractor.fullTitle.value == 0)
                        module.contractors.errors.push("Вы не ввели полное наименование контрагента");
                    if (temp_contractor.contractorTypeId.value == 0)
                        module.contractors.errors.push("Вы не выбрали тип контрагента");

                    /* Если ошибок нет - отправляет данные измененного контрагента контроллеру */
                    if (module.contractors.errors.length == 0) {
                        $http.post("server/controllers/contractors.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (contractor) {
                                    if (contractor["MOMENT"])
                                        $espreso.setLocalDataVersion("contractors", parseInt(contractor["MOMENT"]));
                                    $espreso.saveToLocalStorage("contractors", module.contractors.items);
                                });
                                temp_contractor.setToNotChanged();
                                temp_contractor.cancelEditMode();
                            }
                        });
                    }
                }
            };



            /* Удаляет контрагента */
            module.deleteContractor = function (contractor) {
                if (contractor) {
                    var params = {
                        action: "delete",
                        data: {
                            id: contractor.id.value
                        }
                    };

                    contractor.setDeleteProgress(true);
                    $http.post("server/controllers/contractors.php", params).success(function (data) {
                        if (data && data != 0) {
                            $log.log(data);
                            $espreso.setLocalDataVersion("contractors", parseInt(data));
                            module.currentContractorIsDeleted = true;
                            contractor.setDeleteProgress(false);
                            module.contractors.remove("id", contractor.id.value);
                            $espreso.saveToLocalStorage("contractors", module.contractors.items);
                        }
                    });

                }
            };

            return module;
        }])
    })
    .run(function ($menu, $contractors, $window, $espreso) {
        $menu.register($contractors.menu);

        if ($window.localStorage) {
            /* Проверка актуальности коллеции пользователей */
            if ($espreso.getLocalDataVersion("contractor_types") && $espreso.getRemoteDataVersion("contractor_types")) {
                if ($espreso.getLocalDataVersion("contractor_types") < $espreso.getRemoteDataVersion("contractor_types")) {
                    $contractors.getContractorTypes();
                    $espreso.setLocalDataVersion("contractor_types", $espreso.getRemoteDataVersion("contractor_types"));
                } else {
                    if ($window.localStorage.contractor_types) {
                        $contractors.contractorTypes.fromJSON($espreso.loadFromLocalStorage("contractor_types"));
                    } else {
                        $contractors.getContractorTypes();
                    }
                }
            }

            /* Проверка актуальности коллекции групп пользователей */
            if ($espreso.getLocalDataVersion("contractors") && $espreso.getRemoteDataVersion("contractors")) {
                if ($espreso.getLocalDataVersion("contractors") < $espreso.getRemoteDataVersion("contractors")) {
                    console.log("contractors is out of date");
                    $contractors.getContractors();
                    $espreso.setLocalDataVersion("contractors", $espreso.getRemoteDataVersion("contractors"));
                } else {
                    if ($window.localStorage.contractors) {
                        $contractors.contractors.fromJSON($espreso.loadFromLocalStorage("contractors"));
                    } else {
                        $contractors.getContractors();
                    }
                }
            }

        }
    });



/*****
 * Контроллер списка контрагентов
 *****/
contractors.controller("ContractorsCtrl", ["$log", "$scope", "$contractors", function ($log, $scope, $contractors) {
    $scope.contractors = $contractors;

    $log.log($scope.contractors.contractors);
}]);



/*****
 * Контроллер списка типов контрагентов
 *****/
contractors.controller("ContractorTypesCtrl", ["$log", "$scope", "$location", "$contractors", function ($log, $scope, $location, $contractors) {
    $scope.contractors = $contractors;

    /* Загружает шаблон формы добавления типа контрагента */
    $scope.gotoAddContractorTypeForm = function () {
        $location.url("/new-contractor-type");
    };

    /* Загружает шаблон формы редактирования типа контрагента */
    $scope.gotoEditContractorTypeForm = function (id) {
        $scope.contractors.currentContractorTypeId = id;
        $location.url("/contractor-types/" + id);
    };
}]);



/*****
 * Контроллер добавления типа контрагента
 *****/
contractors.controller("AddContractorTypeCtrl", ["$log", "$scope", "$contractors", function ($log, $scope, $contractors) {
    $scope.contractors = $contractors;

    $scope.contractors.contractorTypeAddedSuccessfully = false;
}]);



/*****
 *  Контроллер редактирования типа контрагента
 *****/
usr.controller("EditContractorTypeCtrl", ["$log", "$scope", "$routeParams", "$contractors", function ($log, $scope, $routeParams, $contractors) {
    $scope.contractors = $contractors;
    $scope.currentContractorTypeId = $routeParams.contractorTypeId;
    $scope.formTitle = "";
    $scope.contractors.contractorTypes.clearErrors();

    $log.log($scope.contractors.contractorTypes.find("id", $scope.currentContractorTypeId));
    $scope.contractors.currentContractorTypeIsDeleted = false;

    /* Если искомый тип контрагента сщуествует и коллекция типов контрагентов не пустая */
    if ($scope.contractors.contractorTypes.length() > 0 && $scope.contractors.contractorTypes.find("id", $scope.currentContractorTypeId) != false) {
        $scope.contractors.currentContractorType = $scope.contractors.contractorTypes.find("id", $scope.currentContractorTypeId);
        $scope.formTitle = $scope.contractors.currentContractorType.title.value;
    }
}]);



/*****
 * Контроллер списка контрагентов
 *****/
contractors.controller("ContractorsCtrl", ["$log", "$scope", "$location", "$contractors", function ($log, $scope, $location, $contractors) {
    $scope.contractors = $contractors;

    /* Загружает шаблон формы добавления контрагента */
    $scope.gotoAddContractorForm = function () {
        $location.url("/new-contractor");
    };

    /* Загружает шаблон формы редактирования контрагента */
    $scope.gotoEditContractorForm = function (id) {
        $scope.contractors.currentContractorId = id;
        $location.url("/contractors/" + id);
    };
}]);



/*****
 * Контроллер добавления контрагента
 *****/
contractors.controller("AddContractorCtrl", ["$log", "$scope", "$contractors", function ($log, $scope, $contractors) {
    $scope.contractors = $contractors;

    $scope.contractors.contractorAddedSuccessfully = false;
}]);



/*****
 *  Контроллер редактирования контрагента
 *****/
usr.controller("EditContractorCtrl", ["$log", "$scope", "$routeParams", "$contractors", function ($log, $scope, $routeParams, $contractors) {
    $scope.contractors = $contractors;
    $scope.currentContractorId = $routeParams.contractorId;
    $scope.formTitle = "";
    $scope.contractors.contractors.clearErrors();

    $log.log($scope.contractors.contractors.find("id", $scope.currentContractorId));
    $scope.contractors.currentContractorIsDeleted = false;

    /* Если искомый контрагент сщуествует и коллекция контрагентов не пустая */
    if ($scope.contractors.contractors.length() > 0 && $scope.contractors.contractors.find("id", $scope.currentContractorId) != false) {
        $scope.contractors.currentContractor = $scope.contractors.contractors.find("id", $scope.currentContractorId);
        $scope.formTitle = $scope.contractors.currentContractor.title.value;
    }
}]);
