"use strict";

/*****
 * Модуль титулов, участков и проектов ВОЛС
 *****/
var titules = angular.module("espreso.titules", [])
    .config(function ($provide) {
        $provide.factory("$titules", ["$http", "$window", "$log", "$espreso", function ($http, $window, $log, $espreso) {
            var module = new Module({
                id: "titules",
                title: "Титулы",
                description: "Управление титулами, участками и проектами ВОЛС"
            });

            module.menu = new Menu({
                id: "titules",
                url: "/titules",
                template: "client/templates/titules/titules_list_table.html",
                controller: "TitulesCtrl",
                icon: "client/resources/img/transmit_blue_32x32.png",
                order: 2,
                description: "Управление титулами, участками и проектами ВОЛС"
            })
                .link({
                    id: "newtitule",
                    parentMenuId: "titules",
                    url: "/new-titule",
                    template: "client/templates/titules/titule_add_form.html",
                    controller: "AddTituleCtrl"
                })
                .link({
                    id: "edittitule",
                    parentMenuId: "titules",
                    url: "/titules/:tituleId",
                    template: "client/templates/titules/titule_edit_form.html",
                    controller: "EditTituleCtrl"
                })
                .link({
                    id: "newtitulepart",
                    parentMenuId: "titules",
                    url: "/new-titule-part",
                    template: "client/templates/titules/titule_part_add_form.html",
                    controller: "AddTitulePartCtrl"
                })
                .link({
                    id: "edittitulepart",
                    parentMenuId: "titules",
                    url: "/titule-parts/:titulePartId",
                    template: "client/templates/titules/titule_part_edit_form.html",
                    controller: "EditTitulePartCtrl"
                })
                .link({
                    id: "newtracepart",
                    parentMenuId: "titules",
                    url: "/new-trace-part",
                    template: "client/templates/titules/trace_part_add_form.html",
                    controller: "AddTracePartController"
                });

            module.titules = new Collection(new Titule());
            module.parts = new Collection(new TitulePart());
            module.currentTituleId = -1;
            module.currentTitulePartId = -1;
            module.currentTitulePartsCount = 0;
            module.currentObjectId = -1;
            module.currentTituleIsDeleted = false;
            module.currentTituleObjects = [];
            module.newTracePartStartObjectIndex = -1;
            module.currentTitulePartIsDeleted = false;

            /* Получает список титулов */
            module.getTitules = function () {
                module.titules.isLoaded = false;
                $http.post("server/controllers/titules.php", {action: "query"}).success(function (data) {
                    module.titules.isLoading = true;
                    if (data && parseInt(data) != 0) {
                        angular.forEach(data, function (titule) {
                            var temp_titule = new Titule();
                            //console.log(data);
                            temp_titule.fromSOURCE(titule);
                            module.titules.add(temp_titule);
                        });
                    }
                    module.titules.isLoaded = true;
                    module.titules.isLoading = false;

                    console.log(JSON.stringify(module.titules.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("titules", JSON.stringify(module.titules.items));
                    }

                    $log.log(module.titules.items);
                });
            };


            /* Добавляет новый титул */
            module.addTitule = function (titule) {
                if (titule && titule.constructor == Titule) {
                    var params = {
                        action: "add",
                        data: {
                            title: titule.title.value,
                            startObjectTypeId: titule.startObjectTypeId.value,
                            endObjectTypeId: titule.endObjectTypeId.value,
                            startObjectPointId: titule.startPointId,
                            endObjectPointId: titule.endPointId,
                            startObjectId: titule.startObjectId.value,
                            endObjectId: titule.endObjectId.value,
                            description: titule.description.value
                        }
                    };

                    $http.post("server/controllers/titules.php", params)
                        .success(function (data) {
                            if (data) {
                                angular.forEach(data, function (titule) {
                                    var temp_titule = new Titule();
                                    temp_titule.fromSOURCE(titule);
                                    module.titules.add(temp_titule);
                                    if (titule["MOMENT"])
                                        $espreso.setLocalDataVersion("titules", parseInt(titule["MOMENT"]));
                                    $espreso.saveToLocalStorage("titules", module.titules.items);
                                });
                                titule.tituleAddedSuccessfully = true;
                            }
                        });
                }
            };


            /* Сохраняет измененный титул */
            module.editTitule = function (titule) {
                if (titule && titule.constructor == Titule) {
                    var ttl = module.titules.find("id", titule.id.value);
                    var params = {
                        action: "edit",
                        data: {
                            id: titule.id.value,
                            startObjectTypeId: titule.startObjectTypeId.value,
                            endObjectTypeId: titule.endObjectTypeId.value,
                            startPointId: titule.startPointId.value,
                            endPointId: titule.endPointId.value,
                            startObjectId: titule.startObjectId.value,
                            endObjectId: titule.endObjectId.value,
                            title: titule.title.value,
                            description: titule.description.value
                        }
                    };

                    $http.post("server/controllers/titules.php", params)
                        .success(function (data) {
                            if (data && parseInt(data) != 0) {
                                angular.forEach(data, function (titule) {
                                    var edited_titule = new Titule();
                                    edited_titule.fromSOURCE(titule);
                                    //ttl.fromSOURCE();
                                    ttl.startObjectId.value = edited_titule.startObjectId.value;
                                    ttl.endObjectId.value = edited_titule.endObjectId.value;
                                    if (titule["MOMENT"])
                                        $espreso.setLocalDataVersion("titules", parseInt(titule["MOMENT"]));
                                    $espreso.saveToLocalStorage("titules", module.titules.items);
                                });
                                ttl.setToNotChanged();
                                ttl.cancelEditMode();
                            }
                        }
                    );
                }
            };



            /* Получает список участков титулов */
            module.getTituleParts = function () {
                module.parts.isLoaded = false;
                $http.post("server/controllers/titule-parts.php", {action: "query"}).success(function (data) {
                    module.parts.isLoading = true;
                    if (data && parseInt(data) != 0) {
                        angular.forEach(data, function (part) {
                            var temp_part = new TitulePart();
                            //console.log(data);
                            temp_part.fromSOURCE(part);
                            module.parts.add(temp_part);
                        });
                    }
                    module.parts.isLoaded = true;
                    module.parts.isLoading = false;

                    console.log(JSON.stringify(module.parts.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("titule_parts", JSON.stringify(module.parts.items));
                    }

                    $log.log(module.parts.items);
                });
            };


            /* Добавляет новый участок титула */
            module.addTitulePart = function (part) {
                if (part && part.constructor == TitulePart) {
                    var params = {
                        action: "add",
                        data: {
                            tituleId: part.tituleId.value,
                            startObjectTypeId: part.startObjectTypeId.value,
                            endObjectTypeId: part.endObjectTypeId.value,
                            startPointId: part.startPointId.value,
                            endPointId: part.endPointId.value,
                            startObjectId: part.startObjectId.value,
                            endObjectId: part.endObjectId.value,
                            title: part.title.value
                        }
                    };

                    $http.post("server/controllers/titule-parts.php", params)
                        .success(function (data) {
                            if (data) {
                                angular.forEach(data, function (part) {
                                    var temp_part = new TitulePart();
                                    temp_part.fromSOURCE(part);
                                    module.parts.add(temp_part);
                                    if (part["MOMENT"])
                                        $espreso.setLocalDataVersion("titule_parts", parseInt(part["MOMENT"]));
                                    $espreso.saveToLocalStorage("titule_parts", module.parts.items);
                                });
                                part.titulePartAddedSuccessfully = true;
                            }
                        });
                }
            };


            module.getTituleById = function (tituleId, destination) {
                if (tituleId && destination) {
                    destination.splice(0, destination.length);
                    var parameters = {
                        action: "tituleById",
                        data: {
                            id: tituleId,
                            sessionId: $espreso.sessionId
                        }
                    };

                    $http.post("server/controllers/objects.php", parameters)
                        .success(function (data) {
                           if (data && parseInt(data) !== 0) {
                               angular.forEach(data, function (value, key) {
                                   switch (parseInt(value["OBJECT_TYPE_ID"])) {
                                       case 0:
                                           $log.log(key + ": unknown object");
                                           var temp_obj = new Obj();
                                           temp_obj.fromSOURCE(value);
                                           destination.push(temp_obj);
                                           break;
                                       case 1:
                                           $log.log(key + ": pylon");
                                           var temp_pylon = new Pylon();
                                           temp_pylon.fromSOURCE(value);
                                           temp_pylon.onInit();
                                           destination.push(temp_pylon);
                                           break;
                                   }
                               });
                           }
                        });
                }
            };

            /* Сбрасывает активный участок титула */
            module.resetCurrentTitulePart = function () {
                angular.forEach(module.parts.items, function (part) {
                    if (part.isActive === true)
                        part.setToActive(false);
                });
                module.currentTitulePartId = -1;
            };

            /* Устанавливает текущий титул */
            module.setCurrentTitule = function (tituleId) {
                if (tituleId !== undefined) {
                    angular.forEach(module.titules.items, function (titule) {
                        if (titule.id.value === tituleId) {
                            if (titule.isActive === false) {
                                titule.setToActive(true);
                                module.currentTituleId = titule.id.value;
                                module.currentObjectId = -1;
                                module.getTituleById(tituleId, module.currentTituleObjects);
                            } else {
                                titule.setToActive(false);
                                module.currentTituleId = -1;
                            }
                            module.resetCurrentTitulePart();
                        } else {
                            titule.setToActive(false);
                        }
                    });
                }
            };

            /* Устанавливает текущий участок титула */
            module.setCurrentTitulePart = function (titulePartId) {
                if (titulePartId !== undefined) {
                    angular.forEach(module.parts.items, function (part) {
                        if (part.id.value === titulePartId) {
                            if (part.isActive === false) {
                                part.setToActive(true);
                                module.currentTitulePartId = part.id.value;
                                module.currentObjectId = -1;
                            } else {
                                part.setToActive(false);
                                module.currentTitulePartId = -1;
                            }
                        } else
                            part.setToActive(false);
                    });
                }
            };

            /* Устанавливает текущий Объект */
            module.setCurrentObject = function (objectId) {
                if (objectId !== undefined && module.currentTituleObjects.length !== 0) {
                    angular.forEach(module.currentTituleObjects, function (object) {
                        if (object.id.value === objectId) {
                            if (object.isActive === false) {
                                object.setToActive(true);
                                module.currentObjectId = object.id.value;
                            } else {
                                object.setToActive(false);
                                module.currentObjectId = -1;
                            }
                        } else
                            object.setToActive(false);
                    });
                }
            };

            return module;
        }]);
    })
    .run(function ($menu, $titules, $espreso, $window) {
        $menu.register($titules.menu);

        if ($window.localStorage) {
            /* Проверка актуальности коллеции титулов */
            if ($espreso.getLocalDataVersion("titules") && $espreso.getRemoteDataVersion("titules")) {
                if ($espreso.getLocalDataVersion("titules") < $espreso.getRemoteDataVersion("titules")) {
                    $titules.getTitules();
                    $espreso.setLocalDataVersion("titules", $espreso.getRemoteDataVersion("titules"));
                } else {
                    if ($window.localStorage.titules) {
                        $titules.titules.fromJSON($espreso.loadFromLocalStorage("titules"));
                    } else {
                        $titules.getTitules();
                    }
                }
            }
        }

        if ($window.localStorage) {
            /* Проверка актуальности коллеции титулов */
            if ($espreso.getLocalDataVersion("titule_parts") && $espreso.getRemoteDataVersion("titule_parts")) {
                if ($espreso.getLocalDataVersion("titule_parts") < $espreso.getRemoteDataVersion("titule_parts")) {
                    $titules.getTituleParts();
                    $espreso.setLocalDataVersion("titule_parts", $espreso.getRemoteDataVersion("titule_parts"));
                } else {
                    if ($window.localStorage.titule_parts) {
                        $titules.parts.fromJSON($espreso.loadFromLocalStorage("titule_parts"));
                    } else {
                        $titules.getTituleParts();
                    }
                }
            }
        }
    });



/*****
 * Контроллер списка титулов
 *****/
titules.controller("TitulesCtrl", ["$log", "$scope", "$location", "$titules", "$objects", "$nomenklature", "FileUploader", function ($log, $scope, $location, $titules, $objects, $nomenklature, FileUploader) {
    $scope.titules = $titules;
    $scope.objects = $objects;
    $scope.stuff = $nomenklature;
    $scope.tabs = [
        {
            id: 1,
            title: "Монтажная ведомость",
            templateUrl: "client/templates/titules/montage_scheme.html",
            controller: "MontageSchemeController",
            active: true
        },
        {
            id: 2,
            title: "Эскиз",
            templateUrl: "client/templates/titules/virtual_map.html",
            controller: "VirtualMapController",
            active: false
        },
        {
            id: 3,
            title: "Линейная схема",
            templateUrl: "client/templates/titules/linear_scheme.html",
            controller: "LinearSchemeController",
            active: false
        },
        {
            id: 4,
            title: "Документация",
            templateUrl: "client/templates/titules/documentation.html",
            controller: "DocumentationController",
            active: false
        }
    ];
    $scope.currentTab = $scope.tabs[0];
    $scope.currentTabId = 1;
    $scope.currentTituleObjects = [];
    var uploader = $scope.uploader = new FileUploader({
        url: "server/uploader.php"
    });

    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    uploader.onAfterAddingFile = function(fileItem) {
        uploader.formData = {
            tituleId: $scope.titules.currentTituleId
        };
        console.info('onAfterAddingFile', fileItem);
        uploader.uploadAll();
    };

    /* Устанавливает активну вкладку */
    $scope.setActiveTab = function (index) {
        if (index !== undefined ) {
            $log.log("$index = ", index);
            angular.forEach($scope.tabs, function (tab, key) {
                if (key === index) {
                    tab.active = true;
                    $scope.currentTab = tab;
                    $scope.currentTabId = tab.id;
                } else
                    tab.active = false;
            });
        }
    };

    /* Загружает шаблон формы добавления титула */
    $scope.gotoAddTituleForm = function () {
        $location.url("/new-titule");
    };

    /* Загружает шаблон формы редактирования титула */
    $scope.gotoEditTituleForm = function () {
        $log.log("currentTituleId = ", $scope.titules.currentTituleId);
        //$scope.titules.currentTituleId = id;
        if ($scope.titules.currentTituleId !== -1)
            $location.url("/titules/" + $scope.titules.currentTituleId);
    };

    /* Загружает шаблон формы добавления участка титула */
    $scope.gotoAddTitulePartForm = function () {
        $location.url("/new-titule-part");
    };

    /* Загружает шаблон редактирования участка титула */
    $scope.gotoEditTitulePartForm = function () {
        if ($scope.titules.currentTitulePartId !== -1)
            $location.url("/titule-parts/" + $scope.titules.currentTitulePartId);
    };

    $scope.gotoAddTracePartForm = function (objectIndex) {
        $scope.titules.newTracePartStartObjectIndex = objectIndex;
        $location.url("/new-trace-part");
    };



}]);



/*****
 * Контроллер добавления нового титула
 *****/
titules.controller("AddTituleCtrl", ["$log", "$scope", "$titules", "$pylons", "$nomenklature", "$objects", function ($log, $scope, $titules, $pylons, $nomenklature, $objects) {
    $scope.titules = $titules;
    $scope.pylons = $pylons;
    $scope.stuff = $nomenklature;
    $scope.objects = $objects;
    $scope.newTitule = new Titule();
    $scope.newTitule.tituleAddedSuccessfully = false;
    $scope.errors = [];

    $scope.newTitule.startPointId = 0;
    $scope.startPointObjects = new ObjectList();
    $scope.startPointPowerLineId = -1;

    $scope.newTitule.endPointId = 0;
    $scope.endPointObjects = new ObjectList();
    $scope.endPointPowerLineId = -1;



    /* Ожидание изменения начальной точки */
    $scope.$watch("newTitule.startPointId", function (newVal, oldVal) {
        if (newVal !== undefined) {
            if (newVal !== oldVal && newVal !== 0) {
                $log.log("newStartPointId = ", newVal);
                $scope.objects.getObjectsByPointId(newVal, $scope.startPointObjects);
                $scope.newTitule.startObjectTypeId.value = 0;
                $scope.startPointPowerLineId = -1;
                $scope.newTitule.startObjectId.value = 0;
            } else if (newVal === 0 && newVal !== oldVal) {
                $log.log("start point reseted");
                $log.log("oldVal = ", oldVal);
                $scope.newTitule.startObjectTypeId.value = 0;
                $scope.startPointPowerLineId = -1;
                $scope.newTitule.startObjectId.value = 0;

            }
        }
    });


    /* Ожидание изменения конечной точки */
    $scope.$watch("newTitule.endPointId", function (newVal, oldVal) {
        if (newVal !== undefined) {
            if (newVal !== oldVal && newVal !== 0) {
                $log.log("newEndPointId = ", newVal);
                $scope.objects.getObjectsByPointId(newVal, $scope.endPointObjects);
                $scope.newTitule.endObjectTypeId.value = 0;
                $scope.endPointPowerLineId = -1;
                $scope.newTitule.endObjectId.value = 0;
            } else if (newVal === 0 && newVal !== oldVal) {
                $log.log("endpoint reseted");
                $log.log("oldVal = ", oldVal);
                $scope.newTitule.endObjectTypeId.value = 0;
                $scope.endPointPowerLineId = -1;
                $scope.newTitule.endObjectId.value = 0;
            }
        }
    });


    /* Ожидание флага об успешном добавлении титула */
    $scope.$watch("newTitule.tituleAddedSuccessfully", function (value) {
        if (value === true) {
            $scope.newTitule.reset();
            $scope.newTitule.startPointId = 0;
            $scope.startPointPowerLineId = 0;
            $scope.newTitule.endPointId = 0;
            $scope.endPointPowerLineId = 0;
        }
    });


    $scope.add = function () {
        $scope.errors.splice(0, $scope.errors.length);
        $scope.newTitule.tituleAddedSuccessfully = false;

        if ($scope.newTitule.title.value === "")
            $scope.errors.push("Вы не указали наименование титула");
        if ($scope.newTitule.startPointId === 0)
            $scope.errors.push("Вы не выбрали начальную точку");
        if ($scope.newTitule.startObjectTypeId.value === 1) {
            if ($scope.startPointPowerLineId === -1)
                $scope.errors.push("Вы не выбрали линию для опоры в начальной точке");
            if ($scope.newTitule.startObjectId.value === 0)
                $scope.errors.push("Вы не выбрали опору в начальной точке");
        }
        if ($scope.newTitule.endPointId === 0)
            $scope.errors.push("Вы не выбрали конечную точку");
        if ($scope.newTitule.endObjectTypeId.value === 1) {
            if ($scope.endPointPowerLineId === -1)
                $scope.errors.push("Вы не выбрали линию для опоры в конечной точке");
            if ($scope.newTitule.endObjectId.value === 0)
                $scope.errors.push("Вы не выбрали опору в конечной точке");
        }

        if ($scope.errors.length === 0)
            $scope.titules.addTitule($scope.newTitule);
    };
}]);



/*****
 * Контроллер редактирования титула
 *****/
titules.controller("EditTituleCtrl", ["$log", "$scope", "$routeParams", "$titules", "$nomenklature", "$pylons", "$objects", function ($log, $scope, $routeParams, $titules, $nomenklature, $pylons, $objects) {
    $scope.titules = $titules;
    $scope.stuff = $nomenklature;
    //$scope.pylons = $pylons;
    $scope.objects = $objects;
    $scope.currentTituleId = $routeParams.tituleId;
    $scope.currentTitule = new Titule();
    $scope.currentTitule.currentTituleIsDeleted = false;
    $scope.errors = [];

    $scope.startPointObjects = new ObjectList();
    $scope.startPointPowerLineId = -1;

    $scope.endPointObjects = new ObjectList();
    $scope.endPointPowerLineId = -1;


    /* Ждем изменения значения id точки начала титула */
    $scope.$watch("currentTitule.startPointId.value", function (newVal, oldVal) {
        if (oldVal != undefined && newVal != oldVal) {
            $log.log("START POINT WATCHER");
            $scope.objects.getObjectsByPointId($scope.currentTitule.startPointId.value, $scope.startPointObjects, $scope.parseStartObjects);
            $scope.startPointPowerLineId = 0;
            $scope.currentTitule.startObjectTypeId.value = 0;
            $scope.currentTitule.startObjectId.value = 0;
        }
        if (oldVal != undefined && newVal == 0) {
            $log.log("start point 0");
            $scope.startPointObjects.pylons.splice(0, $scope.startPointObjects.pylons.length);
            $scope.startPointObjects.objectTypesIds.splice(0, $scope.startPointObjects.objectTypesIds.length);
            $scope.startPointObjects.powerLinesIds.splice(0, $scope.startPointObjects.powerLinesIds.length);
        }
    });


    /* Ждем изменения значения id точки окончания титула */
    $scope.$watch("currentTitule.endPointId.value", function (newVal, oldVal) {
        if (oldVal != undefined && newVal != oldVal) {
            $log.log("END POINT WATCHER");
            $scope.objects.getObjectsByPointId($scope.currentTitule.endPointId.value, $scope.endPointObjects, $scope.parseEndObjects);
            $scope.endPointPowerLineId = 0;
            $scope.currentTitule.endObjectTypeId.value = 0;
            $scope.currentTitule.endObjectId.value = 0;
        }
        if (oldVal != undefined && newVal == 0) {
            $log.log("end point 0");
            $scope.endPointObjects.pylons.splice(0, $scope.endPointObjects.pylons.length);
            $scope.endPointObjects.objectTypesIds.splice(0, $scope.endPointObjects.objectTypesIds.length);
            $scope.endPointObjects.powerLinesIds.splice(0, $scope.endPointObjects.powerLinesIds.length);
        }
    });


    /* Парсинг объектов в начальной точке титула */
    $scope.parseStartObjects = function () {
        $log.log("startPointObjects callback is called");
        switch ($scope.currentTitule.backup.startObjectTypeId) {
            case 1:
                $log.log("startObjectType is pylon");
                if ($scope.currentTitule.startPointId.value == $scope.currentTitule.backup.startPointId) {
                    $scope.currentTitule.startObjectTypeId.value = 1;
                    $scope.currentTitule.startObjectId.value = $scope.currentTitule.backup.startObjectId;
                }
                angular.forEach($scope.startPointObjects.pylons, function (pylon) {
                    if (pylon.id.value == $scope.currentTitule.backup.startObjectId) {
                        $log.log("bingo, id = ", pylon.id.value);
                        $scope.startPointPowerLineId = pylon.powerLineId.value;
                    }
                });
                break;
        }
    };


    /* Парсинг объектов в конечной точке титула */
    $scope.parseEndObjects = function () {
        $log.log("endPointObjects callback is called");
        switch ($scope.currentTitule.backup.endObjectTypeId) {
            case 1:
                $log.log("endObjectType is pylon");
                if ($scope.currentTitule.endPointId.value == $scope.currentTitule.backup.endPointId) {
                    $scope.currentTitule.endObjectTypeId.value = 1;
                    $scope.currentTitule.endObjectId.value = $scope.currentTitule.backup.endObjectId;
                }
                angular.forEach($scope.endPointObjects.pylons, function (pylon) {
                    if (pylon.id.value == $scope.currentTitule.backup.endObjectId) {
                        $log.log("bingo, id = ", pylon.id.value);
                        $scope.endPointPowerLineId = pylon.powerLineId.value;
                    }
                });
                break;
        }
    };


    /* Если искомый титул сщуествует и коллекция титулов не пустая */
    if ($scope.titules.titules.length() > 0 && $scope.titules.titules.find("id", $scope.currentTituleId) != false) {
        $scope.currentTitule = $scope.titules.titules.find("id", $scope.currentTituleId);
        $scope.objects.getObjectsByPointId($scope.currentTitule.startPointId.value, $scope.startPointObjects, $scope.parseStartObjects);
        $scope.objects.getObjectsByPointId($scope.currentTitule.endPointId.value, $scope.endPointObjects, $scope.parseEndObjects);
    }


    $scope.edit = function () {
        $log.log("edit called");
        $scope.errors.splice(0, $scope.errors.length);
        //$scope.currentTitule.tituleAddedSuccessfully = false;

        if ($scope.currentTitule.title.value == "")
            $scope.errors.push("Вы не указали наименование титула");
        if ($scope.currentTitule.startPointId.value == 0)
            $scope.errors.push("Вы не выбрали начальную точку");
        if ($scope.currentTitule.startObjectTypeId.value == 1) {
            if ($scope.startPointPowerLineId == 0)
                $scope.errors.push("Вы не выбрали линию для опоры в начальной точке");
            if ($scope.currentTitule.startObjectId.value == 0)
                $scope.errors.push("Вы не выбрали опору в начальной точке");
        }
        if ($scope.currentTitule.endPointId.value == 0)
            $scope.errors.push("Вы не выбрали конечную точку");
        if ($scope.currentTitule.endObjectTypeId.value == 1) {
            if ($scope.endPointPowerLineId == 0)
                $scope.errors.push("Вы не выбрали линию для опоры в конечной точке");
            if ($scope.currentTitule.endObjectId.value == 0)
                $scope.errors.push("Вы не выбрали опору в конечной точке");
        }

        if ($scope.errors.length == 0)
            $scope.titules.editTitule($scope.currentTitule);
    };
}]);



/*****
 * Контроллер добавления нового титула
 *****/
titules.controller("AddTitulePartCtrl", ["$log", "$scope", "$titules", "$objects", "$nomenklature", function ($log, $scope, $titules, $objects, $nomenklature) {
    $scope.titules = $titules;
    $scope.objects = $objects;
    $scope.stuff = $nomenklature;

    $scope.newTitulePart = new TitulePart();
    $scope.newTitulePart.tituleId.value = $scope.titules.currentTituleId;
    $scope.newTitulePart.titulePartAddedSuccessfully = false;
    $scope.errors = [];

    $scope.startPointObjects = new ObjectList();
    $scope.startPointPowerLineId = -1;

    $scope.endPointObjects = new ObjectList();
    $scope.endPointPowerLineId = -1;



    /* Парсинг объектов в начальной точке титула */
    $scope.parseStartObjects = function () {
        $log.log("startPointObjects callback is called");
        switch ($scope.newTitulePart.startObjectTypeId.value) {
            case 1:
                $log.log("startObjectType is pylon");
                angular.forEach($scope.startPointObjects.pylons, function (pylon) {
                    if (pylon.id.value == $scope.newTitulePart.startObjectId.value) {
                        $log.log("bingo, id = ", pylon.id.value);
                        $scope.startPointPowerLineId = pylon.powerLineId.value;
                    }
                });
                break;
        }
    };


    /* Парсинг объектов в начальной точке титула */
    $scope.parseEndObjects = function () {
        $log.log("endPointObjects callback is called");
        switch ($scope.newTitulePart.endObjectTypeId.value) {
            case 1:
                $log.log("endObjectType is pylon");
                angular.forEach($scope.endPointObjects.pylons, function (pylon) {
                    if (pylon.id.value == $scope.newTitulePart.endObjectId.value) {
                        $log.log("bingo, id = ", pylon.id.value);
                        $scope.endPointPowerLineId = pylon.powerLineId.value;
                    }
                });
                break;
        }
    };


    /* Ждем изменения значения id точки начала участка титула */
    $scope.$watch("newTitulePart.startPointId.value", function (newVal, oldVal) {
        if (oldVal != undefined && newVal != oldVal) {
            $log.log("START POINT WATCHER");
            $scope.objects.getObjectsByPointId($scope.newTitulePart.startPointId.value, $scope.startPointObjects, $scope.parseStartObjects);
            $scope.startPointPowerLineId = 0;
            $scope.newTitulePart.startObjectTypeId.value = 0;
            $scope.newTitulePart.startObjectId.value = 0;
        }
        if (oldVal != undefined && newVal == 0) {
            $log.log("start point 0");
            $scope.startPointObjects.pylons.splice(0, $scope.startPointObjects.pylons.length);
            $scope.startPointObjects.objectTypesIds.splice(0, $scope.startPointObjects.objectTypesIds.length);
            $scope.startPointObjects.powerLinesIds.splice(0, $scope.startPointObjects.powerLinesIds.length);
        }
    });


    /* Ждем изменения значения id точки окончания участка титула */
    $scope.$watch("newTitulePart.endPointId.value", function (newVal, oldVal) {
        if (oldVal != undefined && newVal != oldVal) {
            $log.log("START POINT WATCHER");
            $scope.objects.getObjectsByPointId($scope.newTitulePart.endPointId.value, $scope.endPointObjects, $scope.parseEndObjects);
            $scope.endPointPowerLineId = 0;
            $scope.newTitulePart.endObjectTypeId.value = 0;
            $scope.newTitulePart.endObjectId.value = 0;
        }
        if (oldVal != undefined && newVal == 0) {
            $log.log("start point 0");
            $scope.endPointObjects.pylons.splice(0, $scope.endPointObjects.pylons.length);
            $scope.endPointObjects.objectTypesIds.splice(0, $scope.endPointObjects.objectTypesIds.length);
            $scope.endPointObjects.powerLinesIds.splice(0, $scope.endPointObjects.powerLinesIds.length);
        }
    });

    /* Валидация данных нового участка титула и отправка на добавление */
    $scope.add = function () {
        $scope.errors.splice(0, $scope.errors.length);

        if ($scope.newTitulePart.tituleId.value == 0)
            $scope.errors.push("Вы не выбрали титул");
        if ($scope.newTitulePart.title.value == "")
            $scope.errors.push("Вы не указали наименование участка");
        if ($scope.newTitulePart.startPointId.value == 0)
            $scope.errors.push("Вы не выбрали начальную точку");
        if ($scope.newTitulePart.startObjectTypeId.value == 1) {
            if ($scope.startPointPowerLineId == 0)
                $scope.errors.push("Вы не выбрали линию для опоры в начальной точке");
            if ($scope.newTitulePart.startObjectId.value == 0)
                $scope.errors.push("Вы не выбрали опору в начальной точке");
        }
        if ($scope.newTitulePart.endPointId.value == 0)
            $scope.errors.push("Вы не выбрали конечную точку");
        if ($scope.newTitulePart.endObjectTypeId.value == 1) {
            if ($scope.endPointPowerLineId == 0)
                $scope.errors.push("Вы не выбрали линию для опоры в конечной точке");
            if ($scope.newTitulePart.endObjectId.value == 0)
                $scope.errors.push("Вы не выбрали опору в конечной точке");
        }

        if ($scope.errors.length == 0)
            $scope.titules.addTitulePart($scope.newTitulePart);
    };

}]);



/*****
 * Контроллер редактирования участка титула
 *****/
titules.controller("EditTitulePartCtrl", ["$log", "$scope", "$routeParams", "$titules", "$objects", "$nomenklature", function ($log, $scope, $routeParams, $titules, $objects, $nomenklature) {
    $scope.titules = $titules;
    $scope.objects = $objects;
    $scope.stuff = $nomenklature;
    $scope.currentTitulePartId = $routeParams.titulePartId;
    $scope.currentTitulePart = new TitulePart();
    $scope.currentTitulePart.currentTitulePartIsDeleted = false;
    $scope.errors = [];

    $scope.startPointObjects = new ObjectList();
    $scope.startPointPowerLineId = -1;

    $scope.endPointObjects = new ObjectList();
    $scope.endPointPowerLineId = -1;

    $log.log($scope.titules.parts.find("id", $scope.currentTitulePartId));
    $scope.titules.currentTitulePartIsDeleted = false;



    /* Парсинг объектов в начальной точке титула */
    $scope.parseStartObjects = function () {
        $log.log("startPointObjects callback is called");
        switch ($scope.currentTitulePart.backup.startObjectTypeId) {
            case 1:
                $log.log("startObjectType is pylon");
                if ($scope.currentTitulePart.startPointId.value == $scope.currentTitulePart.backup.startPointId && !$scope.currentTitulePart.inEditMode) {
                    $log.log("inEditMode");
                    $scope.currentTitulePart.startObjectTypeId.value = 1;
                    $scope.currentTitulePart.startObjectId.value = $scope.currentTitulePart.backup.startObjectId;
                }
                angular.forEach($scope.startPointObjects.pylons, function (pylon) {
                    if (pylon.id.value == $scope.currentTitulePart.backup.startObjectId) {
                        $log.log("bingo, id = ", pylon.id.value);
                        $scope.startPointPowerLineId = pylon.powerLineId.value;
                    }
                });
                break;
        }
    };


    /* Парсинг объектов в конечной точке титула */
    $scope.parseEndObjects = function () {
        $log.log("endPointObjects callback is called");
        switch ($scope.currentTitulePart.backup.endObjectTypeId) {
            case 1:
                $log.log("endObjectType is pylon");
                if ($scope.currentTitulePart.endPointId.value == $scope.currentTitulePart.backup.endPointId) {
                    $scope.currentTitulePart.endObjectTypeId.value = 1;
                    $scope.currentTitulePart.endObjectId.value = $scope.currentTitulePart.backup.endObjectId;
                }
                angular.forEach($scope.endPointObjects.pylons, function (pylon) {
                    if (pylon.id.value == $scope.currentTitulePart.backup.endObjectId) {
                        $log.log("bingo, id = ", pylon.id.value);
                        $scope.endPointPowerLineId = pylon.powerLineId.value;
                    }
                });
                break;
        }
    };


    /* Ждем изменения значения id точки начала титула */
    $scope.$watch("currentTitulePart.startPointId.value", function (newVal, oldVal) {
        if (oldVal != undefined && newVal != oldVal) {
            $log.log("START POINT WATCHER");
            $scope.objects.getObjectsByPointId($scope.currentTitulePart.startPointId.value, $scope.startPointObjects, $scope.parseStartObjects);
            $scope.startPointPowerLineId = 0;
            $scope.currentTitulePart.startObjectTypeId.value = 0;
            $scope.currentTitulePart.startObjectId.value = 0;
        }
        if (oldVal != undefined && newVal == 0) {
            $log.log("start point 0");
            $scope.startPointObjects.pylons.splice(0, $scope.startPointObjects.pylons.length);
            $scope.startPointObjects.objectTypesIds.splice(0, $scope.startPointObjects.objectTypesIds.length);
            $scope.startPointObjects.powerLinesIds.splice(0, $scope.startPointObjects.powerLinesIds.length);
            $scope.startPointPowerLineId = 0;
            $scope.currentTitulePart.startObjectTypeId.value = 0;
            $scope.currentTitulePart.startObjectId.value = 0;
        }
    });


    /* Ждем изменения значения id точки окончания титула */
    $scope.$watch("currentTitulePart.endPointId.value", function (newVal, oldVal) {
        if (oldVal != undefined && newVal != oldVal) {
            $log.log("END POINT WATCHER");
            $scope.objects.getObjectsByPointId($scope.currentTitulePart.endPointId.value, $scope.endPointObjects, $scope.parseEndObjects);
            $scope.endPointPowerLineId = 0;
            $scope.currentTitulePart.endObjectTypeId.value = 0;
            $scope.currentTitulePart.endObjectId.value = 0;
        }
        if (oldVal != undefined && newVal == 0) {
            $log.log("end point 0");
            $scope.endPointObjects.pylons.splice(0, $scope.endPointObjects.pylons.length);
            $scope.endPointObjects.objectTypesIds.splice(0, $scope.endPointObjects.objectTypesIds.length);
            $scope.endPointObjects.powerLinesIds.splice(0, $scope.endPointObjects.powerLinesIds.length);
        }
    });


    /* Если искомый участок титула сщуествует и коллекция титулов не пустая */
    if ($scope.titules.parts.length() > 0 && $scope.titules.parts.find("id", $scope.currentTitulePartId) != false) {
        $scope.currentTitulePart = $scope.titules.parts.find("id", $scope.currentTitulePartId);
        $scope.objects.getObjectsByPointId($scope.currentTitulePart.startPointId.value, $scope.startPointObjects, $scope.parseStartObjects);
        $scope.objects.getObjectsByPointId($scope.currentTitulePart.endPointId.value, $scope.endPointObjects, $scope.parseEndObjects);
    }


    /* Валидация данных участка титула и отправка на изменение */
    $scope.edit = function () {
        $scope.errors.splice(0, $scope.errors.length);

        if ($scope.currentTitulePart.title.value == "")
            $scope.errors.push("Вы не указали наименование участка");
        if ($scope.currentTitulePart.startPointId.value == 0)
            $scope.errors.push("Вы не выбрали начальную точку");
        if ($scope.currentTitulePart.startObjectTypeId.value == 1) {
            if ($scope.startPointPowerLineId == 0)
                $scope.errors.push("Вы не выбрали линию для опоры в начальной точке");
            if ($scope.currentTitulePart.startObjectId.value == 0)
                $scope.errors.push("Вы не выбрали опору в начальной точке");
        }
        if ($scope.currentTitulePart.endPointId.value == 0)
            $scope.errors.push("Вы не выбрали конечную точку");
        if ($scope.currentTitulePart.endObjectTypeId.value == 1) {
            if ($scope.endPointPowerLineId == 0)
                $scope.errors.push("Вы не выбрали линию для опоры в конечной точке");
            if ($scope.currentTitulePart.endObjectId.value == 0)
                $scope.errors.push("Вы не выбрали опору в конечной точке");
        }

        if ($scope.errors.length == 0)
            //$scope.titules.addTitulePart($scope.newTitulePart);
            $log.log("no errors");
    };

}]);



/*****
 * Контроллер вкладки монтажной схемы
 *****/
titules.controller("MontageSchemeController", ["$log", "$scope", "$location", "$titules", function ($log, $scope, $location, $titules) {
    $scope.titules = $titules;

    $scope.gotoAddTracePartForm = function (startObjectId) {
        $location.url("/new-trace-part");
    };

    $log.log("MontageScheme");
}]);




titules.controller("AddTracePartController", ["$log", "$scope", "$location", "$titules", "$nomenklature", "$objects", function ($log, $scope, $location, $titules, $nomenklature, $objects) {
    $scope.titules = $titules;
    $scope.stuff = $nomenklature;
    $scope.objects = $objects;
    $scope.startObject = {};
    //$scope.

    $log.log("newTraceStartObjcetindex = ", $scope.titules.newTracePartStartObjectIndex);
    if ($scope.titules.newTracePartStartObjectIndex != -1) {
        $scope.startObject = $scope.titules.currentTituleObjects[$scope.titules.newTracePartStartObjectIndex];
        $log.log("point = ", $scope.startObject.pointId.value);
    }
}]);



/*****
 * Фильтр участков титулов по ID титула
 *****/
titules.filter("tituleId", ["$log", "$titules", function ($log, $titules) {
    return function (input, tituleId) {
        var parts = [];
        angular.forEach(input, function (part) {
            if (part.tituleId.value == tituleId) {
                parts.push(part);
            }
        });
        if (parts.length === 0)
            $titules.currentTitulePartsCount = 0;
        else
            $titules.currentTitulePartsCount = parts.length;
        return parts;
    }
}]);