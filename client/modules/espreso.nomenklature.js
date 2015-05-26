"use strict";

var nomenklature = angular.module("espreso.nomenklature", [])
    .config(function ($provide) {
        $provide.factory("$nomenklature", ["$log", "$routeParams", "$window", "$http", "$espreso", function ($log, $routeParams, $window, $http, $espreso) {
            var module = {};

            module.menu = new Menu({
                id: "nomenklature",
                url: "/nomenklature",
                template: "client/templates/nomenklature/nomenklature_list_table.html",
                controller: "NomenklatureCtrl",
                icon: "client/resources/img/nomenklature_32x32.png",
                order: 4,
                description: "Номенклатура"
            })
                .submenu({
                    id: "pylons",
                    url: "/pylons",
                    template: "client/templates/nomenklature/pylons_list_table.html",
                    controller: "PylonsCtrl",
                    title: "Опоры"
                })
                .submenu({
                    id: "powerlines",
                    url: "/powerlines",
                    template: "client/templates/nomenklature/powerlines_list_table.html",
                    controller: "PowerlinesCtrl",
                    title: "Линии"
                })
                .submenu({
                    id: "pylontypes",
                    url: "/pylon-types",
                    template: "client/templates/nomenklature/pylon_types_list_table.html",
                    controller: "PylonTypesCtrl",
                    title: "Типы опор"
                })
                .submenu({
                    id: "anchortypes",
                    url: "/anchor-types",
                    template: "client/templates/nomenklature/anchor_types_list_table.html",
                    controller: "AnchorTypesCtrl",
                    title: "Типы креплений"
                })
                .submenu({
                    id: "vibrotypes",
                    url: "/vibro-types",
                    template: "client/templates/nomenklature/vibro_types_list_table.html",
                    controller: "VibroTypesCtrl",
                    title: "Типы виброгасителей"
                })
                .submenu({
                    id: "cabletypes",
                    url: "/cable-types",
                    template: "client/templates/nomenklature/cable_types_list_table.html",
                    controller: "CableTypesCtrl",
                    title: "Типы кабеля"
                })
                .submenu({
                    id: "statuses",
                    url: "/statuses",
                    template: "client/templates/nomenklature/statuses_list_table.html",
                    controller: "StatusesCtrl",
                    title: "Статусы"
                })
                .submenu({
                    id: "geopoints",
                    url: "/geo-points",
                    template: "client/templates/nomenklature/points_list_table.html",
                    controller: "PointsCtrl",
                    title: "Географические точки"
                })
                .link({
                    id: "newpylontype",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "pylontypes",
                    url: "/new-pylon-type",
                    template: "client/templates/nomenklature/pylon_type_add_form.html",
                    controller: "AddPylonTypeCtrl"
                })
                .link({
                    id: "editpylontype",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "pylontypes",
                    url: "/pylon-types/:pylonTypeId",
                    template: "client/templates/nomenklature/pylon_type_edit_form.html",
                    controller: "EditPylonTypeCtrl"
                })
                .link({
                    id: "newvibrotype",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "vibrotypes",
                    url: "/new-vibro-type",
                    template: "client/templates/nomenklature/vibro_type_add_form.html",
                    controller: "AddVibroTypeCtrl"
                })
                .link({
                    id: "editvibrotype",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "vibrotypes",
                    url: "/vibro-types/:vibroTypeId",
                    template: "client/templates/nomenklature/vibro_type_edit_form.html",
                    controller: "EditVibroTypeCtrl"
                })
                .link({
                    id: "newcabletype",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "cabletypes",
                    url: "/new-cable-type",
                    template: "client/templates/nomenklature/cable_type_add_form.html",
                    controller: "AddCableTypeCtrl"
                })
                .link({
                    id: "editcabletype",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "cabletypes",
                    url: "/cable-types/:cableTypeId",
                    template: "client/templates/nomenklature/cable_type_edit_form.html",
                    controller: "EditCableTypeCtrl"
                }).link({
                    id: "newanchortype",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "anchortypes",
                    url: "/new-anchor-type",
                    template: "client/templates/nomenklature/anchor_type_add_form.html",
                    controller: "AddAnchorTypeCtrl"
                })
                .link({
                    id: "editanchortype",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "anchortypes",
                    url: "/anchor-types/:anchorTypeId",
                    template: "client/templates/nomenklature/anchor_type_edit_form.html",
                    controller: "EditAnchorTypeCtrl"
                }).link({
                    id: "newpowerline",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "powerlines",
                    url: "/new-powerline",
                    template: "client/templates/nomenklature/powerline_add_form.html",
                    controller: "AddPowerlineCtrl"
                })
                .link({
                    id: "editpowerline",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "powerlines",
                    url: "/powerlines/:powerlineId",
                    template: "client/templates/nomenklature/powerline_edit_form.html",
                    controller: "EditPowerlineCtrl"
                }).link({
                    id: "newpylon",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "pylons",
                    url: "/new-pylon",
                    template: "client/templates/nomenklature/pylon_add_form.html",
                    controller: "AddPylonCtrl"
                })
                .link({
                    id: "editpylon",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "pylons",
                    url: "/pylons/:pylonId",
                    template: "client/templates/nomenklature/pylon_edit_form.html",
                    controller: "EditPylonCtrl"
                }).link({
                    id: "newstatus",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "statuses",
                    url: "/new-status",
                    template: "client/templates/nomenklature/status_add_form.html",
                    controller: "AddStatusCtrl"
                })
                .link({
                    id: "editstatus",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "statuses",
                    url: "/statuses/:statusId",
                    template: "client/templates/nomenklature/status_edit_form.html",
                    controller: "EditStatusCtrl"
                })
                .link({
                    id: "newpoint",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "geopoints",
                    url: "/new-geo-point",
                    template: "client/templates/nomenklature/point_add_form.html",
                    controller: "AddPointCtrl"
                })
                .link({
                    id: "editpoint",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "geopoints",
                    url: "/geo-points/:pointId",
                    template: "client/templates/nomenklature/point_edit_form.html",
                    controller: "EditPointCtrl"
                })
                .link({
                    id: "newanchorunion",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "pylons",
                    url: "/new-anchor-union",
                    template: "client/templates/nomenklature/anchor_union_add_form.html",
                    controller: "AddAnchorUnionCtrl"
                })
                .link({
                    id: "editanchor",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "pylons",
                    url: "/anchors/:anchorId",
                    template: "client/templates/nomenklature/anchor_edit_form.html",
                    controller: "EditAnchorCtrl"
                })
                .link({
                    id: "editunion",
                    parentMenuId: "nomenklature",
                    parentSubMenuId: "pylons",
                    url: "/unions/:unionId",
                    template: "client/templates/nomenklature/union_edit_form.html",
                    controller: "EditUnionCtrl"
                });

            module.powerlines = new Collection(new PowerLine());
            module.newPowerline = new PowerLine();
            module.currentPowerline = undefined;
            module.currentPowerlineIsDeleted = false;
            module.powerlineAddedSuccessfully = false;

            module.pylons = new Collection(new Pylon());
            module.newPylon = new Pylon();
            module.currentPylon = undefined;
            module.currentPylonIsDeleted = false;
            module.pylonAddedSuccessfully = false;

            module.pylonTypes = new Collection(new PylonType());
            module.newPylonType = new PylonType();
            module.currentPylonType = undefined;
            module.currentPylonTypeIsDeleted = false;
            module.pylonTypeAddedSuccessfully = false;

            module.anchorTypes = new Collection(new AnchorType());
            module.newAnchorType = new AnchorType();
            module.currentAnchorType = undefined;
            module.currentAnchorTypeIsDeleted = false;
            module.anchorTypeAddedSuccessfully = false;

            module.vibroTypes = new Collection(new VibroType());
            module.newVibroType = new VibroType();
            module.currentVibroType = undefined;
            module.currentVibroTypeIsDeleted = false;
            module.vibroTypeAddedSuccessfully = false;

            module.cableTypes = new Collection(new CableType());
            module.newCableType = new CableType();
            module.currentCableType = undefined;
            module.currentCableTypeIsDeleted = false;
            module.cableTypeAddedSuccessfully = false;

            module.statuses = new Collection(new Status());
            module.newStatus = new Status();
            module.currentStatus = undefined;
            module.currentStatusIsDeleted = false;
            module.statusAddedSuccessfully = false;

            module.points = new Collection(new Point());
            module.currentPoint = undefined;
            module.currentPointIsDeleted = false;

            module.anchors = new Collection(new Anchor());
            module.newAnchor = new Anchor();
            module.currentAnchor = undefined;
            module.currentAnchorIsDeleted = false;
            module.anchorAddedSuccessfully = false;

            module.unions = new Collection(new Union());
            module.newUnion = new Union();
            module.currentUnion = undefined;
            module.currentUnionIsDeleted = false;
            module.unionAddedSuccessfully = false;


            /* Устанавливает текущую линию */
            module.setCurrentPowerline = function (id) {
                if (id) {
                    angular.forEach(module.powerlines.items, function (powerline) {
                        if (powerline.id.value === id) {
                            powerline.setToActive(true);
                            module.currentPowerline = powerline;
                            module.newPylon.powerLineId.value = id;
                            module.currentPylon = undefined;
                            module.getPylonsByPowerLine();
                        } else {
                            powerline.setToActive(false);
                        }
                    });
                }
            };

            /* Устанавливает текущую опору */
            module.setCurrentPylon = function (id) {
                if (id) {
                    angular.forEach(module.pylons.items, function (pylon) {
                        if (pylon.id.value === id) {
                            $log.log(pylon);
                            pylon.setToActive(true);
                            module.currentPylon = pylon;
                            module.newPylon.powerLineId.value = id;
                            module.newAnchor.ownerId.value = id;
                            //module.getPylonsByPowerLine();
                        } else {
                            pylon.setToActive(false);
                        }
                    });
                }
            };

            module.getPylonTypes = function () {
                module.pylonTypes.isLoaded = false;
                $http.post("server/controllers/pylon-types.php", {action: "query"}).success(function (data) {
                    module.pylonTypes.isLoading = true;
                    if (data && parseInt(data) !== 0) {
                        angular.forEach(data, function (type) {
                            var temp_type = new PylonType();
                            //console.log(data);
                            temp_type.fromSOURCE(type);
                            module.pylonTypes.add(temp_type);
                        });
                    }
                    module.pylonTypes.isLoaded = true;
                    module.pylonTypes.isLoading = false;

                    console.log(JSON.stringify(module.pylonTypes.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("pylon_types", JSON.stringify(module.pylonTypes.items));
                    }

                    $log.log(module.pylonTypes.items);
                });
            };


            /* Добавляет новый тип опор */
            module.addPylonType = function () {
                var params = {
                    action: "add",
                    data: {
                        title: module.newPylonType.title.value
                    }
                };

                /* Валидация данных */
                module.pylonTypeAddedSuccessfully = false;
                module.pylonTypes.clearErrors();
                if (module.newPylonType.title.value === "")
                    module.pylonTypes.errors.push("Вы не указали наименование типа опор");

                /* Если ошибок нет - отправляет данные нового типа опор контроллеру */
                if (module.pylonTypes.errors.length === 0) {
                    $http.post("server/controllers/pylon-types.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (type) {
                                var temp_type = new PylonType();
                                temp_type.fromSOURCE(type);
                                module.pylonTypes.add(temp_type);
                                if (type["MOMENT"]) {
                                    $espreso.setLocalDataVersion("pylon_types", parseInt(type["MOMENT"]));
                                }
                                $espreso.saveToLocalStorage("pylon_types", module.pylonTypes.items);
                            });
                            module.pylonTypeAddedSuccessfully = true;
                            module.newPylonType.reset();
                        }
                    });
                }
            };



            /* Сохраняет изменения в типе опор */
            module.editPylonType = function (id) {
                if (id) {
                    console.log("pylon type id = " + id);
                    var temp_type = module.pylonTypes.find("id", id);
                    console.log(temp_type);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_type.id.value,
                            title: temp_type.title.value
                        }
                    };

                    /* Валидация данных */
                    module.pylonTypes.clearErrors();
                    if (temp_type.title.value === 0)
                        module.pylonTypes.errors.push("Вы не ввели наименование типа опора");

                    /* Если ошибок нет - отправляет данные измененного тика контрагента контроллеру */
                    if (module.pylonTypes.errors.length === 0) {
                        $http.post("server/controllers/pylon-types.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (type) {
                                    if (type["MOMENT"]) {
                                        $espreso.setLocalDataVersion("pylon_types", parseInt(type["MOMENT"]));
                                    }
                                    $espreso.saveToLocalStorage("pylon_types", module.pylonTypes.items);
                                });
                                temp_type.setToNotChanged();
                                temp_type.cancelEditMode();
                            }
                        });
                    }
                }
            };



            /*** Получает список всех типов виброгасителей ***/
            module.getVibroTypes = function () {
                module.vibroTypes.isLoaded = false;
                $http.post("server/controllers/vibro-types.php", {action: "query"}).success(function (data) {
                    module.vibroTypes.isLoading = true;
                    if (data && parseInt(data) !== 0) {
                        angular.forEach(data, function (type) {
                            var temp_type = new VibroType();
                            //console.log(data);
                            temp_type.fromSOURCE(type);
                            module.vibroTypes.add(temp_type);
                        });
                    }
                    module.vibroTypes.isLoaded = true;
                    module.vibroTypes.isLoading = false;

                    console.log(JSON.stringify(module.vibroTypes.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("vibro_types", JSON.stringify(module.vibroTypes.items));
                    }

                    $log.log(module.vibroTypes.items);
                });
            };



            /*** Добавляет новый тип виброгасителя ***/
            module.addVibroType = function () {
                var params = {
                    action: "add",
                    data: {
                        title: module.newVibroType.title.value
                    }
                };

                /* Валидация данных */
                module.vibroTypeAddedSuccessfully = false;
                module.vibroTypes.clearErrors();
                if (module.newVibroType.title.value === "")
                    module.vibroTypes.errors.push("Вы не указали наименование типа виброгасителя");

                /* Если ошибок нет - отправляет данные нового типа виброгасителя контроллеру */
                if (module.vibroTypes.errors.length === 0) {
                    $http.post("server/controllers/vibro-types.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (type) {
                                var temp_type = new VibroType();
                                temp_type.fromSOURCE(type);
                                module.vibroTypes.add(temp_type);
                                if (type["MOMENT"])
                                    $espreso.setLocalDataVersion("vibro_types", parseInt(type["MOMENT"]))
                                $espreso.saveToLocalStorage("vibro_types", module.vibroTypes.items);
                            });
                            module.vibroTypeAddedSuccessfully = true;
                            module.newVibroType.reset();
                        }
                    });
                }
            };



            /*** Сохраняет изменения в типе виброгаситея ***/
            module.editVibroType = function (id) {
                if (id) {
                    console.log("vibro type id = " + id);
                    var temp_type = module.vibroTypes.find("id", id);
                    console.log(temp_type);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_type.id.value,
                            title: temp_type.title.value
                        }
                    };

                    /* Валидация данных */
                    module.vibroTypes.clearErrors();
                    if (temp_type.title.value === 0)
                        module.vibroTypes.errors.push("Вы не ввели наименование типа виброгасителя");

                    /* Если ошибок нет - отправляет данные измененного типа виброгасителя контроллеру */
                    if (module.vibroTypes.errors.length === 0) {
                        $http.post("server/controllers/vibro-types.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (type) {
                                    if (type["MOMENT"])
                                        $espreso.setLocalDataVersion("vibro_types", parseInt(type["MOMENT"]));
                                    $espreso.saveToLocalStorage("vibro_types", module.vibroTypes.items);
                                });
                                temp_type.setToNotChanged();
                                temp_type.cancelEditMode();
                            }
                        });
                    }
                }
            };



            /*** Получает список всех типов кабеля ***/
            module.getCableTypes = function () {
                module.cableTypes.isLoaded = false;
                $http.post("server/controllers/cable-types.php", {action: "query"}).success(function (data) {
                    module.cableTypes.isLoading = true;
                    if (data && parseInt(data) !== 0) {
                        angular.forEach(data, function (type) {
                            var temp_type = new CableType();
                            //console.log(data);
                            temp_type.fromSOURCE(type);
                            module.cableTypes.add(temp_type);
                        });
                    }
                    module.cableTypes.isLoaded = true;
                    module.cableTypes.isLoading = false;

                    console.log(JSON.stringify(module.cableTypes.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("cable_types", JSON.stringify(module.cableTypes.items));
                    }

                    $log.log(module.cableTypes.items);
                });
            };



            /*** Добавляет новый тип кабеля ***/
            module.addCableType = function () {
                var params = {
                    action: "add",
                    data: {
                        title: module.newCableType.title.value,
                        fullTitle: module.newCableType.titleExtra.value,
                        capacity: module.newCableType.capacity.value,
                        colorCode: module.newCableType.colorCode.value
                    }
                };

                /* Валидация данных */
                module.cableTypeAddedSuccessfully = false;
                module.cableTypes.clearErrors();
                if (module.newCableType.title.value === "")
                    module.cableTypes.errors.push("Вы не указали наименование типа кабеля");
                if (module.newCableType.capacity.value === "")
                    module.cableTypes.errors.push("Вы не указали емкость типа кабеля");

                /* Если ошибок нет - отправляет данные нового типа кабеля контроллеру */
                if (module.cableTypes.errors.length === 0) {
                    $http.post("server/controllers/cable-types.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (type) {
                                var temp_type = new CableType();
                                temp_type.fromSOURCE(type);
                                module.cableTypes.add(temp_type);
                                if (type["MOMENT"])
                                    $espreso.setLocalDataVersion("cable_types", parseInt(type["MOMENT"]))
                                $espreso.saveToLocalStorage("cable_types", module.cableTypes.items);
                            });
                            module.cableTypeAddedSuccessfully = true;
                            module.newCableType.reset();
                        }
                    });
                }
            };



            /*** Сохраняет изменения в типе кабеля ***/
            module.editCableType = function (id) {
                if (id) {
                    console.log("cable type id = " + id);
                    var temp_type = module.cableTypes.find("id", id);
                    console.log(temp_type);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_type.id.value,
                            title: temp_type.title.value,
                            fullTitle: temp_type.titleExtra.value,
                            capacity: temp_type.capacity.value,
                            colorCode: temp_type.colorCode.value
                        }
                    };

                    /* Валидация данных */
                    module.cableTypes.clearErrors();
                    if (temp_type.title.value === 0)
                        module.cableTypes.errors.push("Вы не ввели наименование типа кабеля");
                    if (temp_type.capacity.value === 0)
                        module.cableTypes.errors.push("Вы не ввели емкость кабеля");

                    /* Если ошибок нет - отправляет данные измененного типа кабеля контроллеру */
                    if (module.cableTypes.errors.length === 0) {
                        $http.post("server/controllers/cable-types.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (type) {
                                    if (type["MOMENT"])
                                        $espreso.setLocalDataVersion("cable_types", parseInt(type["MOMENT"]));
                                    $espreso.saveToLocalStorage("cable_types", module.cableTypes.items);
                                });
                                temp_type.setToNotChanged();
                                temp_type.cancelEditMode();
                            }
                        });
                    }
                }
            };



            /*** Получает список всех типов креплений ***/
            module.getAnchorTypes = function () {
                module.anchorTypes.isLoaded = false;
                $http.post("server/controllers/anchor-types.php", {action: "query"}).success(function (data) {
                    module.anchorTypes.isLoading = true;
                    if (data && parseInt(data) !== 0) {
                        angular.forEach(data, function (type) {
                            var temp_type = new AnchorType();
                            //console.log(data);
                            temp_type.fromSOURCE(type);
                            module.anchorTypes.add(temp_type);
                        });
                    }
                    module.anchorTypes.isLoaded = true;
                    module.anchorTypes.isLoading = false;

                    console.log(JSON.stringify(module.anchorTypes.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("anchor_types", JSON.stringify(module.anchorTypes.items));
                    }

                    $log.log(module.anchorTypes.items);
                });
            };



            /*** Добавляет новый тип крепления ***/
            module.addAnchorType = function () {
                var params = {
                    action: "add",
                    data: {
                        title: module.newAnchorType.title.value
                    }
                };

                /* Валидация данных */
                module.anchorTypeAddedSuccessfully = false;
                module.anchorTypes.clearErrors();
                if (module.newAnchorType.title.value === "")
                    module.anchorTypes.errors.push("Вы не указали наименование типа крепления");

                /* Если ошибок нет - отправляет данные нового типа крепления контроллеру */
                if (module.anchorTypes.errors.length === 0) {
                    $http.post("server/controllers/anchor-types.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (type) {
                                var temp_type = new AnchorType();
                                temp_type.fromSOURCE(type);
                                module.anchorTypes.add(temp_type);
                                if (type["MOMENT"])
                                    $espreso.setLocalDataVersion("anchor_types", parseInt(type["MOMENT"]))
                                $espreso.saveToLocalStorage("anchor_types", module.anchorTypes.items);
                            });
                            module.anchorTypeAddedSuccessfully = true;
                            module.newAnchorType.reset();
                        }
                    });
                }
            };



            /*** Сохраняет изменения в типе крепления ***/
            module.editAnchorType = function (id) {
                if (id) {
                    console.log("anchor type id = " + id);
                    var temp_type = module.anchorTypes.find("id", id);
                    console.log(temp_type);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_type.id.value,
                            title: temp_type.title.value
                        }
                    };

                    /* Валидация данных */
                    module.anchorTypes.clearErrors();
                    if (temp_type.title.value === 0)
                        module.anchorTypes.errors.push("Вы не ввели наименование типа крепления");

                    /* Если ошибок нет - отправляет данные измененного типа крепления контроллеру */
                    if (module.anchorTypes.errors.length === 0) {
                        $http.post("server/controllers/anchor-types.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (type) {
                                    if (type["MOMENT"])
                                        $espreso.setLocalDataVersion("anchor_types", parseInt(type["MOMENT"]));
                                    $espreso.saveToLocalStorage("anchor_types", module.anchorTypes.items);
                                });
                                temp_type.setToNotChanged();
                                temp_type.cancelEditMode();
                            }
                        });
                    }
                }
            };



            /*** Получает список всех линий***/
            module.getPowerlines = function () {
                module.powerlines.isLoaded = false;
                $http.post("server/controllers/powerlines.php", {action: "query"}).success(function (data) {
                    module.powerlines.isLoading = true;
                    if (data && parseInt(data) !== 0) {
                        angular.forEach(data, function (type) {
                            var temp_powerline = new PowerLine();
                            //console.log(data);
                            temp_powerline.fromSOURCE(type);
                            module.powerlines.add(temp_powerline);
                        });
                    }
                    module.powerlines.isLoaded = true;
                    module.powerlines.isLoading = false;

                    console.log(JSON.stringify(module.powerlines.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("power_lines", JSON.stringify(module.powerlines.items));
                    }

                    $log.log(module.powerlines.items);
                });
            };



            /*** Добавляет новую линию ***/
            module.addPowerline = function () {
                var params = {
                    action: "add",
                    data: {
                        title: module.newPowerline.title.value,
                        voltage: module.newPowerline.voltage.value
                    }
                };

                /* Валидация данных */
                module.powerlineAddedSuccessfully = false;
                module.powerlines.clearErrors();
                if (module.newPowerline.title.value === "")
                    module.powerlines.errors.push("Вы не указали наименование линии");
                if (module.newPowerline.voltage.value === "")
                    module.powerlines.errors.push("Вы не указали напряжение линии");

                /* Если ошибок нет - отправляет данные новой линии крепления контроллеру */
                if (module.powerlines.errors.length === 0) {
                    $http.post("server/controllers/powerlines.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (powerline) {
                                var temp_powerline = new PowerLine();
                                temp_powerline.fromSOURCE(powerline);
                                module.powerlines.add(temp_powerline);
                                if (powerline["MOMENT"])
                                    $espreso.setLocalDataVersion("power_lines", parseInt(powerline["MOMENT"]))
                                $espreso.saveToLocalStorage("power_lines", module.powerlines.items);
                            });
                            module.powerlineAddedSuccessfully = true;
                            module.newPowerline.reset();
                        }
                    });
                }
            };



            /*** Сохраняет изменения в линии ***/
            module.editPowerline = function (id) {
                if (id) {
                    console.log("powerline id = " + id);
                    var temp_powerline = module.powerlines.find("id", id);
                    console.log(temp_powerline);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_powerline.id.value,
                            title: temp_powerline.title.value,
                            voltage: temp_powerline.voltage.value
                        }
                    };

                    /* Валидация данных */
                    module.powerlines.clearErrors();
                    if (temp_powerline.title.value === "")
                        module.powerlines.errors.push("Вы не ввели наименование линии");
                    if (temp_powerline.voltage.value === "")
                        module.powerlines.errors.push("Вы не ввели напряжение линии");

                    /* Если ошибок нет - отправляет данные измененной линии контроллеру */
                    if (module.powerlines.errors.length === 0) {
                        $http.post("server/controllers/powerlines.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (powerline) {
                                    if (powerline["MOMENT"])
                                        $espreso.setLocalDataVersion("power_lines", parseInt(powerline["MOMENT"]));
                                    $espreso.saveToLocalStorage("power_lines", module.powerlines.items);
                                });
                                temp_powerline.setToNotChanged();
                                temp_powerline.cancelEditMode();
                            }
                        });
                    }
                }
            };



            /*** Получает список всех опор на линии***/
            module.getPylonsByPowerLine = function (dest) {
                module.pylons.isLoaded = false;
                module.pylons.items.length = 0;
                var params = {
                    action: "pylonsByPowerLine",
                    data: {
                        powerLineId: module.currentPowerline.id.value
                    }
                };
                $http.post("server/controllers/pylons.php", params).success(function (data) {
                    if (dest != undefined && dest.constructor === Collection) {
                        dest.isLoading = true;
                        if (data && parseInt(data) !== 0) {
                            angular.forEach(data, function (pylon) {
                                var temp_pylon = new Pylon();
                                temp_pylon.fromSOURCE(pylon);
                                temp_pylon.onInit();
                                dest.add(temp_pylon);
                            });
                        }
                        dest.isLoaded = true;
                        dest.pylons.isLoading = false;
                    } else {
                        module.pylons.isLoading = true;
                        if (data && parseInt(data) !== 0) {
                            angular.forEach(data, function (pylon) {
                                var temp_pylon = new Pylon();
                                //console.log(data);
                                temp_pylon.fromSOURCE(pylon);
                                temp_pylon.onInit();
                                module.pylons.add(temp_pylon);
                            });
                        }
                        module.pylons.isLoaded = true;
                        module.pylons.isLoading = false;

                        console.log(JSON.stringify(module.pylons.items));
                    }


                    /* Если доступен localStorage, то сохраняет данные туда */
                    //if ($window.localStorage) {
                    //    $window.localStorage.setItem("power_lines", JSON.stringify(module.powerlines.items));
                    //}
                });
            };


            /*** Добавляет новую опору ***/
            module.addPylon = function () {
                var params = {
                    action: "add",
                    data: {
                        objectId: module.newPylon.objectId.value,
                        pylonSchemeTypeId: module.newPylon.pylonSchemeTypeId.value,
                        powerLineId: module.newPylon.powerLineId.value,
                        pylonTypeId: module.newPylon.pylonTypeId.value,
                        number: module.newPylon.number.value
                    }
                };

                /* Валидация данных */
                module.pylonAddedSuccessfully = false;
                module.pylons.clearErrors();
                if (module.newPylon.powerLineId.value === 0)
                    module.pylons.errors.push("Вы не выбрали линию");
                if (module.newPylon.pylonTypeId.value === 0)
                    module.pylons.errors.push("Вы не выбрали тип опоры");
                if (module.newPylon.number.value === 0 || module.newPylon.number.value === "")
                    module.pylons.errors.push("Вы не указали № опоры");

                /* Если ошибок нет - отправляет данные новой опоры контроллеру */
                if (module.pylons.errors.length === 0) {
                    $http.post("server/controllers/pylons.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (pylon) {
                                var temp_pylon = new Pylon();
                                temp_pylon.fromSOURCE(pylon);
                                module.pylons.add(temp_pylon);
                                //if (pylon["MOMENT"])
                                //    $espreso.setLocalDataVersion("power_lines", parseInt(powerline["MOMENT"]))
                                //$espreso.saveToLocalStorage("power_lines", module.powerlines.items);
                            });
                            module.pylonAddedSuccessfully = true;
                            module.newPylon.reset();
                        }
                    });
                }
            };



            /***  ***/
            module.getPylonChildren = function () {
                module.anchors.isLoaded = false;
                module.unions.isLoaded = false;
                module.anchors.items.length = 0;
                module.unions.items.length = 0;

                var params = {
                    action: "childrenByPylon",
                    data: {
                        pylonId: module.currentPylon.id.value
                    }
                };
                $http.post("server/controllers/pylons.php", params).success(function (data) {
                    module.anchors.isLoading = true;
                    module.unions.isLoading = true;
                    if (data && parseInt(data) !== 0) {
                        angular.forEach(data, function (obj) {
                            var temp_pylon = new Pylon();
                            //console.log(data);
                            temp_pylon.fromSOURCE(pylon);
                            module.pylons.add(temp_pylon);
                        });
                    }
                    module.pylons.isLoaded = true;
                    module.pylons.isLoading = false;

                    console.log(JSON.stringify(module.pylons.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    //if ($window.localStorage) {
                    //    $window.localStorage.setItem("power_lines", JSON.stringify(module.powerlines.items));
                    //}
                });
            };



            /*** Получает список всех статусов ***/
            module.getStatuses = function () {
                module.statuses.isLoaded = false;
                $http.post("server/controllers/statuses.php", {action: "query"}).success(function (data) {
                    module.statuses.isLoading = true;
                    if (data && parseInt(data) !== 0) {
                        angular.forEach(data, function (status) {
                            var temp_status = new Status();
                            //console.log(data);
                            temp_status.fromSOURCE(status);
                            module.statuses.add(temp_status);
                        });
                    }
                    module.statuses.isLoaded = true;
                    module.statuses.isLoading = false;

                    console.log(JSON.stringify(module.statuses.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("statuses", JSON.stringify(module.statuses.items));
                    }

                    $log.log(module.statuses.items);
                });
            };



            /*** Добавляет новый статус ***/
            module.addStatus = function () {
                var params = {
                    action: "add",
                    data: {
                        title: module.newStatus.title.value
                    }
                };

                /* Валидация данных */
                module.statusAddedSuccessfully = false;
                module.statuses.clearErrors();
                if (module.newStatus.title.value === "")
                    module.statuses.errors.push("Вы не указали наименование статуса");

                /* Если ошибок нет - отправляет данные нового статуса контроллеру */
                if (module.statuses.errors.length === 0) {
                    $http.post("server/controllers/statuses.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (status) {
                                var temp_status = new Status();
                                temp_status.fromSOURCE(status);
                                module.statuses.add(temp_status);
                                if (status["MOMENT"])
                                    $espreso.setLocalDataVersion("statuses", parseInt(status["MOMENT"]))
                                $espreso.saveToLocalStorage("statuses", module.statuses.items);
                            });
                            module.statusAddedSuccessfully = true;
                            module.newStatus.reset();
                        }
                    });
                }
            };



            /*** Сохраняет изменения в статусе ***/
            module.editStatus= function (id) {
                if (id) {
                    console.log("status id = " + id);
                    var temp_status = module.statuses.find("id", id);
                    console.log(temp_status);
                    var params = {
                        action: "edit",
                        data: {
                            id: temp_status.id.value,
                            title: temp_status.title.value
                        }
                    };

                    /* Валидация данных */
                    module.statuses.clearErrors();
                    if (temp_status.title.value === "")
                        module.statuses.errors.push("Вы не ввели наименование статуса");

                    /* Если ошибок нет - отправляет данные измененного статуса контроллеру */
                    if (module.statuses.errors.length === 0) {
                        $http.post("server/controllers/statuses.php", params).success(function (data) {
                            if (data) {
                                angular.forEach(data, function (status) {
                                    if (status["MOMENT"])
                                        $espreso.setLocalDataVersion("statuses", parseInt(status["MOMENT"]));
                                    $espreso.saveToLocalStorage("statuses", module.statuses.items);
                                });
                                temp_status.setToNotChanged();
                                temp_status.cancelEditMode();
                            }
                        });
                    }
                }
            };



            /*** Получает список всех точек ***/
            module.getPoints = function () {
                module.points.isLoaded = false;
                $http.post("server/controllers/points.php", {action: "query"}).success(function (data) {
                    module.points.isLoading = true;
                    if (data && parseInt(data) !== 0) {
                        angular.forEach(data, function (point) {
                            var temp_point = new Point();
                            //console.log(data);
                            temp_point.fromSOURCE(point);
                            temp_point.onInit();
                            module.points.add(temp_point);
                        });
                    }
                    module.points.isLoaded = true;
                    module.points.isLoading = false;

                    console.log(JSON.stringify(module.points.items));

                    /* Если доступен localStorage, то сохраняет данные туда */
                    if ($window.localStorage) {
                        $window.localStorage.setItem("points", JSON.stringify(module.points.items));
                    }

                    //$log.log(module.points.items);
                });
            };



            /*** Добавляет новую точку ***/
            module.addPoint = function (point) {
                if (point && point.constructor === Point) {
                    var params = {
                        action: "add",
                        data: {
                            title: point.title.value,
                            latitude: point.latitude.value,
                            longitude: point.longitude.value,
                            altitude: point.altitude.value,
                            x: point.x.value,
                            y: point.y.value,
                            description: point.description.value
                        }
                    };
                    $http.post("server/controllers/points.php", params)
                        .success(function (data) {
                            if (data) {
                                angular.forEach(data, function (point) {
                                    var temp_point = new Point();
                                    temp_point.fromSOURCE(point);
                                    temp_point.onInit();
                                    module.points.add(temp_point);
                                    if (point["MOMENT"])
                                        $espreso.setLocalDataVersion("points", parseInt(point["MOMENT"]))
                                    $espreso.saveToLocalStorage("points", module.points.items);
                                });
                                point.pointAddedSuccessfully = true;
                                point.reset();
                            }
                        }
                    );
                }
            };



            /*** Сохраняет изменения в точке ***/
            module.editPoint = function (point) {
                if (point && point.constructor === Point) {
                    var pt = module.points.find("id", point.id.value);
                    var params = {
                        action: "edit",
                        data: {
                            id: point.id.value,
                            title: point.title.value,
                            latitude: point.latitude.value,
                            longitude: point.longitude.value,
                            altitude: point.altitude.value,
                            x: point.x.value,
                            y: point.y.value,
                            description: point.description.value
                        }
                    };

                    $http.post("server/controllers/points.php", params)
                        .success(function (data) {
                            if (data) {
                                angular.forEach(data, function (pnt) {
                                    if (pnt["MOMENT"])
                                        $espreso.setLocalDataVersion("points", parseInt(pnt["MOMENT"]));
                                    $espreso.saveToLocalStorage("points", module.points.items);
                                });
                                pt.setToNotChanged();
                                pt.cancelEditMode();
                            }
                        }
                    );
                }
            };



            /*** Добавляет новое крепление ***/
            module.addAnchor = function () {
                var params = {
                    action: "add",
                    data: {
                        anchorTypeId: module.newAnchor.anchorTypeId.value,
                        ownerId: module.newAnchor.ownerId.value
                    }
                };

                /* Валидация данных */
                module.anchorAddedSuccessfully = false;
                module.anchors.clearErrors();
                if (!module.currentPowerline)
                    module.anchors.errors.push("Вы не выбрали линию");
                if (module.newAnchor.ownerId.value === 0)
                    module.anchors.errors.push("Вы не выбрали опору");
                if (module.newAnchor.anchorTypeId.value === 0)
                    module.anchors.errors.push("Вы не указали тип крепления");

                /* Если ошибок нет - отправляет данные нового крепления контроллеру */
                if (module.anchors.errors.length === 0) {
                    $http.post("server/controllers/anchors.php", params).success(function (data) {
                        if (data) {
                            angular.forEach(data, function (anchor) {
                                var temp_anchor = new Anchor();
                                temp_anchor.fromSOURCE(anchor);
                                module.anchors.add(temp_anchor);
                                //if (point["MOMENT"])
                                //    $espreso.setLocalDataVersion("statuses", parseInt(status["MOMENT"]))
                                //$espreso.saveToLocalStorage("statuses", module.statuses.items);
                            });
                            module.anchorAddedSuccessfully = true;
                            module.newAnchor.reset();
                        }
                    });
                }
            };



            return module;
        }])
    })
    .run(function ($window, $menu, $espreso, $nomenklature) {
        $menu.register($nomenklature.menu);

        if ($window.localStorage) {
            /* Проверка актуальности коллеции типов опор */
            if ($espreso.getLocalDataVersion("pylon_types") && $espreso.getRemoteDataVersion("pylon_types")) {
                if ($espreso.getLocalDataVersion("pylon_types") < $espreso.getRemoteDataVersion("pylon_types")) {
                    $nomenklature.getPylonTypes();
                    $espreso.setLocalDataVersion("pylon_types", $espreso.getRemoteDataVersion("pylon_types"));
                } else {
                    if ($window.localStorage.pylon_types) {
                        $nomenklature.pylonTypes.fromJSON($espreso.loadFromLocalStorage("pylon_types"));
                    } else {
                        $nomenklature.getPylonTypes();
                    }
                }
            }

            /* Проверка актуальности коллеции типов виброгасителей */
            if ($espreso.getLocalDataVersion("vibro_types") && $espreso.getRemoteDataVersion("vibro_types")) {
                if ($espreso.getLocalDataVersion("vibro_types") < $espreso.getRemoteDataVersion("vibro_types")) {
                    $nomenklature.getVibroTypes();
                    $espreso.setLocalDataVersion("vibro_types", $espreso.getRemoteDataVersion("vibro_types"));
                } else {
                    if ($window.localStorage.vibro_types) {
                        $nomenklature.vibroTypes.fromJSON($espreso.loadFromLocalStorage("vibro_types"));
                    } else {
                        $nomenklature.getVibroTypes();
                    }
                }
            }
        }

        /* Проверка актуальности коллеции типов кабеля */
        if ($espreso.getLocalDataVersion("cable_types") && $espreso.getRemoteDataVersion("cable_types")) {
            if ($espreso.getLocalDataVersion("cable_types") < $espreso.getRemoteDataVersion("cable_types")) {
                $nomenklature.getCableTypes();
                $espreso.setLocalDataVersion("cable_types", $espreso.getRemoteDataVersion("cable_types"));
            } else {
                if ($window.localStorage.cable_types) {
                    $nomenklature.cableTypes.fromJSON($espreso.loadFromLocalStorage("cable_types"));
                } else {
                    $nomenklature.getCableTypes();
                }
            }
        }

        /* Проверка актуальности коллеции типов креплений */
        if ($espreso.getLocalDataVersion("anchor_types") && $espreso.getRemoteDataVersion("anchor_types")) {
            if ($espreso.getLocalDataVersion("anchor_types") < $espreso.getRemoteDataVersion("anchor_types")) {
                $nomenklature.getAnchorTypes();
                $espreso.setLocalDataVersion("anchor_types", $espreso.getRemoteDataVersion("anchor_types"));
            } else {
                if ($window.localStorage.anchor_types) {
                    $nomenklature.anchorTypes.fromJSON($espreso.loadFromLocalStorage("anchor_types"));
                } else {
                    $nomenklature.getAnchorTypes();
                }
            }
        }

        /* Проверка актуальности коллеции линий */
        if ($espreso.getLocalDataVersion("power_lines") && $espreso.getRemoteDataVersion("power_lines")) {
            if ($espreso.getLocalDataVersion("power_lines") < $espreso.getRemoteDataVersion("power_lines")) {
                $nomenklature.getPowerlines();
                $espreso.setLocalDataVersion("power_lines", $espreso.getRemoteDataVersion("power_lines"));
            } else {
                if ($window.localStorage.power_lines) {
                    $nomenklature.powerlines.fromJSON($espreso.loadFromLocalStorage("power_lines"));
                } else {
                    $nomenklature.getPowerlines();
                }
            }
        }

        /* Проверка актуальности коллеции статусов */
        if ($espreso.getLocalDataVersion("statuses") && $espreso.getRemoteDataVersion("statuses")) {
            if ($espreso.getLocalDataVersion("statuses") < $espreso.getRemoteDataVersion("statuses")) {
                $nomenklature.getStatuses();
                $espreso.setLocalDataVersion("statuses", $espreso.getRemoteDataVersion("statuses"));
            } else {
                if ($window.localStorage.statuses) {
                    $nomenklature.statuses.fromJSON($espreso.loadFromLocalStorage("statuses"));
                } else {
                    $nomenklature.getStatuses();
                }
            }
        }

        /* Проверка актуальности коллеции точек */
        if ($espreso.getLocalDataVersion("points") && $espreso.getRemoteDataVersion("points")) {
            if ($espreso.getLocalDataVersion("points") < $espreso.getRemoteDataVersion("points")) {
                $nomenklature.getPoints();
                $espreso.setLocalDataVersion("points", $espreso.getRemoteDataVersion("points"));
            } else {
                if ($window.localStorage.points) {
                    $nomenklature.points.fromJSON($espreso.loadFromLocalStorage("points"));
                    angular.forEach($nomenklature.points.items, function (item) {
                        item.onInit();
                    });
                } else {
                    $nomenklature.getPoints();
                }
            }
        }
    });



/*****
 * Контроллер номенклатуры
 *****/
nomenklature.controller("NomenklatureCtrl", ["$log", "$scope", "$location", "$nomenklature", function ($log, $scope, $location, $nomenklature) {
    $scope.stuff = $nomenklature;


}]);



/*****
 * Контроллер списка типов опор
 *****/
nomenklature.controller("PylonTypesCtrl", ["$log", "$scope", "$location", "$nomenklature", function ($log, $scope, $location, $nomenklature) {
    $scope.stuff = $nomenklature;

    /* Загружает шаблон формы добавления типа опор */
    $scope.gotoAddPylonTypeForm = function () {
        $log.log("goto");
        $location.url("/new-pylon-type");
    };

    /* Загружает шаблон формы редактирования типа опор */
    $scope.gotoEditPylonTypeForm = function (id) {
        $scope.stuff.currentPylonTypeId = id;
        $location.url("/pylon-types/" + id);
    };
}]);



/*****
 * Контроллер добавления типа опор
 *****/
nomenklature.controller("AddPylonTypeCtrl", ["$log", "$scope", "$nomenklature", function ($log, $scope, $nomenklature) {
    $scope.stuff = $nomenklature;

    $scope.stuff.pylonTypeAddedSuccessfully = false;
    $scope.stuff.pylonTypes.clearErrors();
}]);



/*****
 *  Контроллер редактирования типа опор
 *****/
nomenklature.controller("EditPylonTypeCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentPylonTypeId = $routeParams.pylonTypeId;
    $scope.formTitle = "";
    $scope.stuff.pylonTypes.clearErrors();

    $log.log($scope.stuff.pylonTypes.find("id", $scope.currentPylonTypeId));
    $scope.stuff.currentPylonTypeIsDeleted = false;

    /* Если искомый тип опор сщуествует и коллекция типов опор не пустая */
    if ($scope.stuff.pylonTypes.length() > 0 && $scope.stuff.pylonTypes.find("id", $scope.currentPylonTypeId) !== false) {
        $scope.stuff.currentPylonType = $scope.stuff.pylonTypes.find("id", $scope.currentPylonTypeId);
        $scope.formTitle = $scope.stuff.currentPylonType.title.value;
    }
}]);



/*****
 * Контроллер списка типов виброгасителей
 *****/
nomenklature.controller("VibroTypesCtrl", ["$log", "$scope", "$location", "$nomenklature", function ($log, $scope, $location, $nomenklature) {
    $scope.stuff = $nomenklature;

    /* Загружает шаблон формы добавления типа виброгасителя */
    $scope.gotoAddVibroTypeForm = function () {
        $location.url("/new-vibro-type");
    };

    /* Загружает шаблон формы редактирования типа виброгасителя */
    $scope.gotoEditVibroTypeForm = function (id) {
        $scope.stuff.currentVibroTypeId = id;
        $location.url("/vibro-types/" + id);
    };
}]);



/*****
 * Контроллер добавления типа виброгасителя
 *****/
nomenklature.controller("AddVibroTypeCtrl", ["$log", "$scope", "$nomenklature", function ($log, $scope, $nomenklature) {
    $scope.stuff = $nomenklature;

    $scope.stuff.vibroTypeAddedSuccessfully = false;
    $scope.stuff.vibroTypes.clearErrors();
}]);



/*****
 *  Контроллер редактирования типа виброгасителя
 *****/
nomenklature.controller("EditVibroTypeCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentVibroTypeId = $routeParams.vibroTypeId;
    $scope.formTitle = "";
    $scope.stuff.vibroTypes.clearErrors();

    $log.log($scope.stuff.vibroTypes.find("id", $scope.currentVibroTypeId));
    $scope.stuff.currentVibroTypeIsDeleted = false;

    /* Если искомый тип виброгасителя сщуествует и коллекция типов виброгасителей не пустая */
    if ($scope.stuff.vibroTypes.length() > 0 && $scope.stuff.vibroTypes.find("id", $scope.currentVibroTypeId) !== false) {
        $scope.stuff.currentVibroType = $scope.stuff.vibroTypes.find("id", $scope.currentVibroTypeId);
        $scope.formTitle = $scope.stuff.currentVibroType.title.value;
    }
}]);



/*****
 * Контроллер списка типов кабеля
 *****/
nomenklature.controller("CableTypesCtrl", ["$log", "$scope", "$location", "$nomenklature", function ($log, $scope, $location, $nomenklature) {
    $scope.stuff = $nomenklature;

    /* Загружает шаблон формы добавления типа кабеля */
    $scope.gotoAddCableTypeForm = function () {
        $location.url("/new-cable-type");
    };

    /* Загружает шаблон формы редактирования типа кабеля */
    $scope.gotoEditCableTypeForm = function (id) {
        $scope.stuff.currentCableTypeId = id;
        $location.url("/cable-types/" + id);
    };
}]);



/*****
 * Контроллер добавления типа кабеля
 *****/
nomenklature.controller("AddCableTypeCtrl", ["$log", "$scope", "$nomenklature", function ($log, $scope, $nomenklature) {
    $scope.stuff = $nomenklature;

    $scope.stuff.cableTypeAddedSuccessfully = false;
    $scope.stuff.cableTypes.clearErrors();
}]);



/*****
 *  Контроллер редактирования типа кабеля
 *****/
nomenklature.controller("EditCableTypeCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentCableTypeId = $routeParams.cableTypeId;
    $scope.formTitle = "";
    $scope.stuff.cableTypes.clearErrors();

    $log.log($scope.stuff.cableTypes.find("id", $scope.currentCableTypeId));
    $scope.stuff.currentCableTypeIsDeleted = false;

    /* Если искомый тип кабеля сщуествует и коллекция типов кабеля не пустая */
    if ($scope.stuff.cableTypes.length() > 0 && $scope.stuff.cableTypes.find("id", $scope.currentCableTypeId) !== false) {
        $scope.stuff.currentCableType = $scope.stuff.cableTypes.find("id", $scope.currentCableTypeId);
        $scope.formTitle = $scope.stuff.currentCableType.title.value;
    }
}]);



/*****
 * Контроллер списка типов креплений
 *****/
nomenklature.controller("AnchorTypesCtrl", ["$log", "$scope", "$location", "$nomenklature", function ($log, $scope, $location, $nomenklature) {
    $scope.stuff = $nomenklature;

    /* Загружает шаблон формы добавления типа крепления */
    $scope.gotoAddAnchorTypeForm = function () {
        $location.url("/new-anchor-type");
    };

    /* Загружает шаблон формы редактирования типа крепления */
    $scope.gotoEditAnchorTypeForm = function (id) {
        $scope.stuff.currentAnchorTypeId = id;
        $location.url("/anchor-types/" + id);
    };
}]);



/*****
 * Контроллер добавления типа крепления
 *****/
nomenklature.controller("AddAnchorTypeCtrl", ["$log", "$scope", "$nomenklature", function ($log, $scope, $nomenklature) {
    $scope.stuff = $nomenklature;

    $scope.stuff.anchorTypeAddedSuccessfully = false;
    $scope.stuff.anchorTypes.clearErrors();
}]);



/*****
 *  Контроллер редактирования типа крепления
 *****/
nomenklature.controller("EditAnchorTypeCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentAnchorTypeId = $routeParams.anchorTypeId;
    $scope.stuff.anchorTypes.clearErrors();
    $scope.formTitle = "";

    $log.log($scope.stuff.anchorTypes.find("id", $scope.currentAnchorTypeId));
    $scope.stuff.currentAnchorTypeIsDeleted = false;

    /* Если искомый тип крепления сщуествует и коллекция типов креплений не пустая */
    if ($scope.stuff.anchorTypes.length() > 0 && $scope.stuff.anchorTypes.find("id", $scope.currentAnchorTypeId) !== false) {
        $scope.stuff.currentAnchorType = $scope.stuff.anchorTypes.find("id", $scope.currentAnchorTypeId);
        $scope.formTitle = $scope.stuff.currentAnchorType.title.value;
    }
}]);



/*****
 * Контроллер списка линий
 *****/
nomenklature.controller("PowerlinesCtrl", ["$log", "$scope", "$location", "$nomenklature", function ($log, $scope, $location, $nomenklature) {
    $scope.stuff = $nomenklature;

    /* Загружает шаблон формы добавления линии */
    $scope.gotoAddPowerlineForm = function () {
        $location.url("/new-powerline");
    };

    /* Загружает шаблон формы редактирования линии */
    $scope.gotoEditPowerlineForm = function (id) {
        $scope.stuff.currentPowerlineId = id;
        $location.url("/powerlines/" + id);
    };
}]);



/*****
 * Контроллер добавления линии
 *****/
nomenklature.controller("AddPowerlineCtrl", ["$log", "$scope", "$nomenklature", function ($log, $scope, $nomenklature) {
    $scope.stuff = $nomenklature;

    $scope.stuff.powerlineAddedSuccessfully = false;
    $scope.stuff.powerlines.clearErrors();
}]);



/*****
 *  Контроллер редактирования линии
 *****/
nomenklature.controller("EditPowerlineCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentPowerlineId = $routeParams.powerlineId;
    $scope.stuff.powerlines.clearErrors();
    $scope.formTitle = "";

    $log.log($scope.stuff.powerlines.find("id", $scope.currentPowerlineId));
    $scope.stuff.currentPowerlineIsDeleted = false;

    /* Если искомая линия сщуествует и коллекция линий не пустая */
    if ($scope.stuff.powerlines.length() > 0 && $scope.stuff.powerlines.find("id", $scope.currentPowerlineId) !== false) {
        $scope.stuff.currentPowerline = $scope.stuff.powerlines.find("id", $scope.currentPowerlineId);
        $scope.formTitle = $scope.stuff.currentPowerline.title.value;
    }
}]);




/*****
 * Контроллер списка опор
 *****/
nomenklature.controller("PylonsCtrl", ["$log", "$scope", "$location", "$nomenklature", function ($log, $scope, $location, $nomenklature) {
    $scope.stuff = $nomenklature;

    /* Загружает шаблон формы добавления опоры */
    $scope.gotoAddPylonForm = function () {
        $location.url("/new-pylon");
    };

    /* Загружает шаблон формы редактирования опоры */
    $scope.gotoEditPylonForm = function (id) {
        $scope.stuff.currentPylonId = id;
        $location.url("/pylons/" + id);
    };

    /* Загружает шаблон формы редактирования опоры */
    $scope.gotoAddLineForm = function () {
        $location.url("/new-powerline/");
    };

    /**/
    $scope.gotoAddAnchorUnionForm = function () {
        $location.url("/new-anchor-union/");
    };

    $scope.setCurrentPowerline = function () {

    };
}]);



/*****
 * Контроллер добавления опоры
 *****/
nomenklature.controller("AddPylonCtrl", ["$log", "$scope", "$nomenklature", "$objects", function ($log, $scope, $nomenklature, $objects) {
    $scope.stuff = $nomenklature;
    $scope.objects = $objects;
    $scope.pylon = new Pylon();
    $scope.errors = [];

    $scope.pylonAddedSuccessfully = false;
    //$scope.stuff.pylons.clearErrors();

    $scope.addPylon = function () {
        $scope.errors.splice(0, $scope.errors.length);

        if ($scope.pylon.pointId.value === 0)
            $scope.errors.push("Вы не указали точку нахождения опоры");

        if ($scope.pylon.pylonTypeId.value === 0)
            $scope.errors.push("Вы не выбрали тип опоры");

        if ($scope.pylon.powerLineId.value === 0)
            $scope.errors.push("Вы не выбрали линию");

        if ($scope.pylon.number.value === 0 || $scope.pylon.number.value === "")
            $scope.errors.push("Вы не указали номер опоры");

        if ($scope.errors.length === 0) {
            $scope.objects.add(
                1,                              // Идентификатор типа добавляемого узла
                $scope.pylon.pointId.value,     // Идентификатор точки нахождения опоры
                $scope.pylon.pylonTypeId.value, // Идентификатор типа опоры
                0,                              // Идентификатор типа схемы опоры
                $scope.pylon.powerLineId.value, // Идентификатор линии
                $scope.pylon.number.value,      // Номер опоры
                $scope.onSuccess                // Callback-функция
            );
        }
    };

    $scope.onSuccess = function (data) {
        $log.log(data);
        if (data !== 0) {
            $scope.pylonAddedSuccessfully = true;
            $scope.pylon.pointId.value = 0;
            $scope.pylon.powerLineId.value = 0;
            $scope.pylon.number.value = 0;
            $scope.pylon.pylonTypeId.value = 0;
        }
    };
}]);



/*****
 *  Контроллер редактирования опоры
 *****/
nomenklature.controller("EditPylonCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentPylonId = $routeParams.pylonId;
    $scope.stuff.pylons.clearErrors();
    $scope.formTitle = "";

    $log.log($scope.stuff.pylons.find("id", $scope.currentPylonId));
    $scope.stuff.currentPylonIsDeleted = false;

    /* Если искомая опора сщуествует и коллекция опор не пустая */
    if ($scope.stuff.pylons.length() > 0 && $scope.stuff.pylons.find("id", $scope.currentPylonId) !== false) {
        $scope.stuff.currentPylon = $scope.stuff.pylons.find("id", $scope.currentPylonId);
        $scope.formTitle = "Опора №" + $scope.stuff.currentPylon.number.value;
    }
}]);




/*****
 * Контроллер списка статусов
 *****/
nomenklature.controller("StatusesCtrl", ["$log", "$scope", "$location", "$nomenklature", function ($log, $scope, $location, $nomenklature) {
    $scope.stuff = $nomenklature;

    /* Загружает шаблон формы добавления статуса */
    $scope.gotoAddStatusForm = function () {
        $location.url("/new-status");
    };

    /* Загружает шаблон формы редактирования статуса */
    $scope.gotoEditStatusForm = function (id) {
        $scope.stuff.currentStatusId = id;
        $location.url("/statuses/" + id);
    };

}]);



/*****
 * Контроллер добавления статуса
 *****/
nomenklature.controller("AddStatusCtrl", ["$log", "$scope", "$nomenklature", function ($log, $scope, $nomenklature) {
    $scope.stuff = $nomenklature;

    $scope.stuff.statusAddedSuccessfully = false;
    $scope.stuff.statuses.clearErrors();
}]);



/*****
 *  Контроллер редактирования статуса
 *****/
nomenklature.controller("EditStatusCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentStatusId = $routeParams.statusId;
    $scope.stuff.statuses.clearErrors();
    $scope.formTitle = "";

    $log.log($scope.stuff.statuses.find("id", $scope.currentStatusId));
    $scope.stuff.currentStatusIsDeleted = false;

    /* Если искомый статус сщуествует и коллекция статусов не пустая */
    if ($scope.stuff.statuses.length() > 0 && $scope.stuff.statuses.find("id", $scope.currentStatusId) !== false) {
        $scope.stuff.currentStatus = $scope.stuff.statuses.find("id", $scope.currentStatusId);
        $scope.formTitle = $scope.stuff.currentStatus.title.value;
    }
}]);



/*****
 * Контроллер списка точек
 *****/
nomenklature.controller("PointsCtrl", ["$log", "$scope", "$location", "$nomenklature", function ($log, $scope, $location, $nomenklature) {
    $scope.stuff = $nomenklature;

    if ($scope.stuff.points.items.length === 0) {
        $scope.stuff.getPoints();
    }

    /* Загружает шаблон формы добавления точки */
    $scope.gotoAddPointForm = function () {
        $location.url("/new-geo-point");
    };

    /* Загружает шаблон формы редактирования точки */
    $scope.gotoEditPointForm = function (id) {
        $scope.stuff.currentPointId = id;
        $location.url("/geo-points/" + id);
    };

}]);



/*****
 * Контроллер добавления точки
 *****/
nomenklature.controller("AddPointCtrl", ["$log", "$scope", "$nomenklature", function ($log, $scope, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.newPoint = new Point();
    $scope.newPoint.pointAddedSuccessfully = false;
    $scope.errors = [];

    //$scope.stuff.pointAddedSuccessfully = false;
    //$scope.stuff.points.clearErrors();

    $scope.add = function () {
        $scope.errors.splice(0, $scope.errors.length);

        if ($scope.newPoint.title.value === "")
            $scope.errors.push("Вы не указали наименование точки");
        if ($scope.newPoint.x.value === 0)
            $scope.errors.push("Вы не указали X-координату точки");
        else {
            if (isNaN(parseInt($scope.newPoint.x.value)) || isNaN(parseFloat($scope.newPoint.x.value)))
                $scope.errors.push("Неверный формат X-координаты");
        }
        if ($scope.newPoint.y.value === 0)
            $scope.errors.push("Вы не указали Y-координату точки");
        else {
            if (isNaN(parseInt($scope.newPoint.y.value)) || isNaN(parseFloat($scope.newPoint.y.value)))
                $scope.errors.push("Неверный формат Y-координаты");
        }

        if ($scope.errors.length === 0) {
            $scope.stuff.addPoint($scope.newPoint);
        }
    };
}]);



/*****
 *  Контроллер редактирования точки
 *****/
nomenklature.controller("EditPointCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentPointId = $routeParams.pointId;
    $scope.currentPoint = new Point();
    $scope.formTitle = "";
    $scope.errors = [];

    $log.log($scope.stuff.points.find("id", $scope.currentPointId));
    $scope.stuff.currentPointIsDeleted = false;

    /* Если искомая точка сщуествует и коллекция точек не пустая */
    if ($scope.stuff.points.length() > 0 && $scope.stuff.points.find("id", $scope.currentPointId) !== false) {
        $scope.currentPoint = $scope.stuff.points.find("id", $scope.currentPointId);
        $scope.formTitle = $scope.currentPoint.title.value + " (" + $scope.currentPoint.latitude.value + ", " + $scope.currentPoint.longitude.value + ", " + $scope.currentPoint.altitude.value + ")";
    }

    $scope.edit = function () {
        $scope.errors.splice(0, $scope.errors.length);

        if ($scope.currentPoint.title.value === "")
            $scope.errors.push("Вы не указали наименование точки");
        if ($scope.currentPoint.x.value === 0 || $scope.currentPoint.x.value === "")
            $scope.errors.push("Вы не указали X-координату точки");
        else {
            if (isNaN(parseInt($scope.currentPoint.x.value)) || isNaN(parseFloat($scope.currentPoint.x.value)))
                $scope.errors.push("Неверный формат X-координаты");
        }
        if ($scope.currentPoint.y.value === 0 || $scope.currentPoint.y.value === "")
            $scope.errors.push("Вы не указали Y-координату точки");
        else {
            if (isNaN(parseInt($scope.currentPoint.y.value)) || isNaN(parseFloat($scope.currentPoint.y.value)))
                $scope.errors.push("Неверный формат Y-координаты");
        }

        if ($scope.errors.length === 0)
            $scope.stuff.editPoint($scope.currentPoint);
    };
}]);



/*****
 * Контроллер добавления крепления/муфты
 *****/
nomenklature.controller("AddAnchorUnionCtrl", ["$log", "$scope", "$nomenklature", function ($log, $scope, $nomenklature) {
    $scope.stuff = $nomenklature;

    $scope.objectTypeId = 0;
    $scope.stuff.anchorAddedSuccessfully = false;
    $scope.stuff.unionAddedSuccessfully = false;
    $scope.stuff.anchors.clearErrors();
    $scope.stuff.unions.clearErrors();

    $scope.addAnchorUnion = function () {
        switch ($scope.objectTypeId) {
            case "1":
                $scope.stuff.addAnchor();
                break;
            case "2":
                $scope.stuff.addUnion();
                break;
        }
    };
}]);



/*****
 *  Контроллер редактирования крепления
 *****/
nomenklature.controller("EditAnchorCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentAnchorId = $routeParams.anchorId;
    $scope.stuff.anchors.clearErrors();
    $scope.formTitle = "";

    $log.log($scope.stuff.anchors.find("id", $scope.currentAnchorId));
    $scope.stuff.currentAnchorIsDeleted = false;

    /* Если искомое крепление сщуествует и коллекция креплений не пустая */
    if ($scope.stuff.anchors.length() > 0 && $scope.stuff.anchors.find("id", $scope.currentAnchorId) !== false) {
        $scope.stuff.currentAnchor = $scope.stuff.anchors.find("id", $scope.currentAnchorId);
        $scope.formTitle = "Опора #" + $scope.stuff.currentPylon.number.value + " / Крепление";
    }
}]);



/*****
 *  Контроллер редактирования муфты
 *****/
nomenklature.controller("EditUnionCtrl", ["$log", "$scope", "$routeParams", "$nomenklature", function ($log, $scope, $routeParams, $nomenklature) {
    $scope.stuff = $nomenklature;
    $scope.currentUnionId = $routeParams.unionId;
    $scope.stuff.unions.clearErrors();
    $scope.formTitle = "";

    $log.log($scope.stuff.unions.find("id", $scope.currentUnionId));
    $scope.stuff.currentUnionIsDeleted = false;

    /* Если искомая муфта сщуествует и коллекция муфт не пустая */
    if ($scope.stuff.unions.length() > 0 && $scope.stuff.unions.find("id", $scope.currentUnionsId) !== false) {
        $scope.stuff.currentUnion = $scope.stuff.unions.find("id", $scope.currentUnionId);
        $scope.formTitle = "Опора #" + $scope.stuff.currentPylon.number.value + " / Муфта";
    }
}]);





