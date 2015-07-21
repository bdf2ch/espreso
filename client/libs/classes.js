//"use strict";


/*****
 * Класс поля данных
 *****/
function Field (parameters) {
    this.source = "";   // Источник данных поля
    this.value = "";     // Значение поля

    if (parameters) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param))
                this[param] = parameters[param];
        }
    }

    /* Устанавливает источник данных поля */
    this.setSource = function (new_source) {
        if (new_source) {
            this.source = new_source;
            return this;
        }
    };

    /* Устанавливает значение поля */
    this.setValue = function (new_value) {
        if (new_value) {
            this.value = new_value;
            return this;
        }
    };

    return this;
};



/*****
 * Класс модели данных, содержит вспомогательные методы
 *****/
function DataModel () {

    /* Создвние и инициализация бэкапа */
    this.setupBackup = function () {
        this.backup = {};
        for (prop in this) {
            if (this[prop].constructor == Field) {
                this.backup[prop] = this[prop]["value"];
            }
        }
        this.isChanged = false;
        this.isActive = false;
        this.inEditMode = false;
        this.inDeleteMode = false;
        this.deleteInProgress = false;
        this.deleted = false;
    };

    /* Восстанавливает объект из бэкапа */
    this.restoreFromBackup = function () {
        if (this.backup) {
            for (var prop in this.backup) {
                if (this.hasOwnProperty(prop) && this[prop].constructor == Field) {
                    if(!isNaN(parseInt(this.backup[prop]))) {
                        console.log(prop + " is numeric");
                        this[prop]["value"] = parseInt(this.backup[prop]);
                    } else
                        this[prop]["value"] = this.backup[prop];
                }
                if (this.hasOwnProperty(prop) && this[prop].constructor != Field)
                    this[prop]["value"] = this.backup[prop];
            }
            this.setupBackup();
            this.isChanged = false;
        }
    };

    /**/
    this.setToChanged = function () {
        //if (this.isChanged != undefined)
            this.isChanged = true;
    };

    /**/
    this.setToNotChanged = function () {
        //if (this.isChanged != undefined)
            this.isChanged = false;
        //for (var attr in this) {
        //    if (this[attr].constructor == Field)
        //        this[attr].states.changed(false);
       // }
    };

    /* Помечает текущий элемент как активный / неактивный */
    this.setToActive = function (flag) {
        if (flag != undefined && flag.constructor == Boolean) {
            this.isActive = flag;
        }
    };

    this.setToDeleteMode = function () {
        //if (this.inDeleteMode != undefined)
            this.inDeleteMode = true;
    };

    this.cancelDeleteMode = function () {
        //if (this.inDeleteMode != undefined) {
            this.inDeleteMode = false;
        //}
    };

    this.setDeleteProgress = function (flag) {
        if (flag) {
            switch (flag) {
                case true:
                    this.deleteInProgress = true;
                    break;
                case false:
                    this.deleteInProgress = false;
                    break;
            }
        }
    };

    /**/
    this.setToEditMode = function () {
        //if (this.inEditMode != undefined)
            this.inEditMode = true;
    };

    this.cancelEditMode = function () {
        this.inEditMode = false;
    };

    this.cancelModes = function () {
        if (this.inEditMode) {
            this.cancelEditMode();
            this.restoreFromBackup();
        }
        if (this.inDeleteMode)
            this.cancelDeleteMode();
    };

    /* Инициализация объекта на основе переданного объекта с параметрами */
    this.init = function (parameters) {
        if (parameters) {
            for (var param in parameters) {
                if (this.hasOwnProperty(param))
                    this[param] = parameters[param];
            }
        }
    };

    /* Инициализация объекта на основе данных из удаленного хранилища */
    this.fromSOURCE = function (SRCdata) {
        if (SRCdata) {
            for (var data in SRCdata) {
                for (var field in this) {
                    if (this[field]["source"] == data) {
                        if (!isNaN(parseInt(SRCdata[data]))) {
                            this[field]["value"] = parseInt(SRCdata[data]);
                            //console.log(data + " = " + SRCdata[data] + " is numeric");
                        }
                        else
                            this[field]["value"] = SRCdata[data];
                    }
                }
            }
            this.setupBackup();
            if (this.onInit !== undefined)
                this.onInit();
        }
    };

    /* Инициализация объекта на основе JSON-данных */
    this.fromJSON = function (JSONdata) {
        if (JSONdata) {
            for (var data in JSONdata) {
                if (this.hasOwnProperty(data))
                    this[data]["value"] = JSONdata[data]["value"];
            }
            this.setupBackup();
            //this.onInit();
        }
    };

    /**/
    //this.toJSON = function () {
    //    var result = [];
    //    for (var prop in this) {
    //        if (this[prop].constructor == Field) {
    //            result.push(this[prop])
    //        }
    //    }
    //    return result;
    //};

    this.setId = function (id) {
        if (id) {
            if (this.hasOwnProperty("id") && this["id"].constructor == "Field")
                this["id"]["value"] = id;
        }
    };

};


/* Класс модуля */
function Module (parameters) {
    this.info = {
        id: "",
        title: "",
        description: ""
    };

    this.model = function (model) {
        if (model && model.constructor == Model) {
            this.models.push(model);
            return this;
        }
    };

    if (parameters) {
        for (var param in parameters) {
            if (this.info.hasOwnProperty(param))
                this.info[param] = parameters[param];
        }
        return this;
    }

};


/* Класс раздела меню */
function Menu (parameters) {
    this.id = "";
    this.url = "";
    this.template = "";
    this.controller = "";
    this.isActive = false;
    this.icon = "";
    this.order = 0;
    this.description = "";
    this.submenuItems = [];
    this.links = [];

    if (parameters) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param))
                this[param] = parameters[param];
        }
    }

    this.submenu = function (parameters) {
        if (parameters) {
            var submenu = new SubMenu(parameters);
            submenu.parentId = this.id;
            this.submenuItems.push(submenu);
            return this;
        }
    };

    this.link = function (parameters) {
        if (parameters) {
            var link = new Link(parameters);
            if (!parameters["parentId"])
                link.parentId = this.id;
            this.links.push(link);
            return this;
        }
    };

    return this;
};


function SubMenu (parameters) {
    this.id = "";
    this.parentId = "";
    this.url = "";
    this.title = "";
    this.template = "";
    this.controller = "";
    this.isActive = false;

    if (parameters) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param))
                this[param] = parameters[param];
        }
    }

    return this;
};


function Link (parameters) {
    this.id = "";
    this.parentMenuId = "";
    this.parentSubMenuId = "";
    this.url = "";
    this.title = "";
    this.template = "";
    this.controller = "";
    this.isActive = false;

    if (parameters) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param))
                this[param] = parameters[param];
        }
    }
};



/* Класс типа пользовательского действия */
function UserActionType () {
    this.id = new Field({ source: "ID", value: 0 });
    this.title = new Field({ source: "ACTION_NAME", value: "" });
};
UserActionType.prototype = new DataModel();



/* Класс пользовательского действия */
function UserAction () {
    this.id = new Field({ source: "ID", value: 0 });
    this.userActionTypeId = new Field({ source: "USER_ACTION_TYPE_ID", value: 0 });
    this.userId = new Field({ source: "USER_ID", value: 0 });
    this.dataSource = new Field({ source: "DATA_SOURCE", value: "" });
    this.dataId = new Field({ source: "DATA_ID", value: 0 });
    this.date = new Field({ source: "TIMESTAMP", value: 0 });
};
UserAction.prototype = new DataModel();



/*****
 * Класс пользователя
 *****/
function User () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.groupId = new Field({ source: "USER_GROUP_ID", value: 0 });        // Идентификатор группы пользователей
    this.email = new Field({ source: "EMAIL", value: "" });                 // E-mail
    this.name = new Field({ source: "FNAME", value: "" });                  // Имя
    this.fname = new Field({ source: "SNAME", value: "" });                 // Отчество
    this.surname = new Field({ source: "SURNAME", value: "" });             // Фамилия
    this.phone = new Field({ source: "PHONE", value: "" });                 // Контактный телефон
    this.password = new Field({ source: "PASSWD", value: "" });             // Пароль
    this.fio = new Field({ value: "" });
    this.permissions = {};

    /* Сбрасывает значения полей объектов на первоначальные */
    this.reset = function () {
        this.id.value = 0;
        this.groupId.value = 0;
        this.email.value = "";
        this.name.value = "";
        this.fname.value = "";
        this.surname.value = "";
        this.phone.value = "";
        this.password.value = "";
    };

    this.onInit = function () {
        this.fio.value = this.name.value + " " + this.fname.value + " " + this.surname.value;
    };
};
User.prototype = new DataModel();
User.prototype.constructor = User;



/*****
 * Класс группы пользователей
 *****/
function UserGroup () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.title = new Field({ source: "TITLE", value: "" });                 // Наименование
    this.description = new Field({ source: "DESCRIPTION", value: "" });     // Описание

    /* Сбрасывает значения полей объектов на первоначальные */
    this.reset = function () {
        this.id.value = 0;
        this.title.value = "";
        this.description.value = "";
    };
};
UserGroup.prototype = new DataModel();
UserGroup.prototype.constructor = UserGroup;



/*****
 * Класс титула
 *****/
function Titule () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.title = new Field({ source: "TITUL_NAME", value: "" });                  // Наименование
    this.startPointId = new Field({ source: "START_POINT_ID", value: 0 });
    this.startObjectTypeId = new Field({ source: "START_OBJECT_TYPE_ID", value: 0 });
    this.startObjectId = new Field({ source: "START_OBJECT_ID", value: 0 });
    this.endPointId = new Field({ source: "END_POINT_ID", value: 0 });
    this.endObjectTypeId = new Field({ source: "END_OBJECT_TYPE_ID", value: 0 });
    this.endObjectId = new Field({ source: "END_OBJECT_ID", value: 0 });
    this.description = new Field({ source: "NAME_EXTRA", value: "" });       // Описание
    this.length = new Field({ source: "LENGTH", value: 0 });                // Протяженность
    this.isActive = false;

    this.reset = function () {
        this.id.value = 0;
        this.title.value = "";
        this.startObjectTypeId.value = 0;
        this.startObjectId.value = 0;
        this.endObjectTypeId.value = 0;
        this.endObjectId.value = 0;
        this.description.value = "";
    };
};
Titule.prototype = new DataModel();
Titule.prototype.constructor = Titule;



/*****
 * Класс участка титула
 ****/
function TitulePart () {
    this.id = new Field({ source: "ID", value: 0 });                           // Идентификатор
    this.tituleId = new Field({ source: "TITUL_ID", value: 0 });             // Идентификатор титула
    this.title = new Field({ source: "TITLE", value: "" });                  // Наименование
    this.startPointId = new Field({ source: "START_POINT_ID", value: 0 });
    this.startObjectTypeId = new Field({ source: "START_OBJECT_TYPE_ID", value: 0 });
    this.startObjectId = new Field({ source: "START_OBJECT_ID", value: 0 }); // Идентификатор начального объекта
    this.endPointId = new Field({ source: "END_POINT_ID", value: 0 });
    this.endObjectTypeId = new Field({ source: "END_OBJECT_TYPE_ID", value: 0 });
    this.endObjectId = new Field({ source: "END_OBJECT_ID", value: 0 });     // Идентификатор конечного объекта
    this.length = new Field({ source: "LENGTH", value: 0 });                 // Протяженность

    this.reset = function () {
        this.id.value = 0;
        this.tituleId.value = 0;
        this.startPointId.value = 0;
        this.startObjectTypeId.value = 0;
        this.startObjectId.value = 0;
        this.endPointId.value = 0;
        this.endObjectTypeId.value = 0;
        this.endObjectId.value = 0;
        this.title.value = "";
    };
};
TitulePart.prototype = new DataModel();
TitulePart.prototype.constructor = TitulePart;



/*****
 * Класс статуса
 *****/
function Status () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.title = new Field({ source: "TITLE", value: "" });           // Наименование

    this.reset = function () {
        this.id.value = 0;
        this.title.value = "";
    };
};
Status.prototype = new DataModel();
Status.prototype.constructor = Status;



/*****
 * Класс географической точки
 *****/
function Point () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.title = new Field({ source: "TITLE", value: "" });                 // Наименование
    this.latitude = new Field({ source: "LATITUDE", value: 0 });            // Широта
    this.longitude = new Field({ source: "LONGITUDE", value: 0 });          // Долгота
    this.altitude = new Field({ source: "ALTITUDE", value: 0 });            // Высота
    this.x = new Field({ source: "X", value: "" });                          // X - координата
    this.y = new Field({ source: "Y", value: "" });                          // Y - координата
    this.description = new Field({ source: "DESCRIPTION", value: "" });     // Описание
    this.typeahead = "";
    this.coordinates = "";

    this.onInit = function () {
        this.typeahead = this.title.value + " [" + this.latitude.value + ", " + this.longitude.value + ", " + this.altitude.value + "]";
        this.coordinates = this.latitude.value + ", " + this.longitude.value + ", " + this.latitude.value;
    };

    this.reset = function () {
        this.id.value = 0;
        this.title.value = "";
        this.latitude.value = 0;
        this.longitude.value = 0;
        this.altitude.value = 0;
        this.x.value = 0;
        this.y.value = 0;
        this.description.value = "";
    };
};
Point.prototype = new DataModel();
Point.prototype.constructor = Point;



/*****
 * Класс объекта
 *****/
function Obj () {
    this.id = new Field({ source: "NODE_ID", value: 0 });                        // Идентификатор
    this.pointId = new Field({ source: "POINT_ID", value: 0 });             // Идентификатор географической точки
    this.tituleId = new Field({ source: "TITULE_ID", value: 0 });
    this.titulePartId = new Field({ source: "TITULE_PART_ID", value: 0 });
    this.branchesCount = new Field({ source: "OUT_PATHS", value: 0 });
    //this.children = [];
    this.objectTypeId = 0;

    this.reset = function () {

    };

    this.onInit = function () {
        //this.levels.splice(0, this.levels.length);
        //for (var i = 1; i < this.level.value; i++) {
            //this.levels.push(i);
        //}
        //this.children.splice(0, this.children.length);
    };
};
Obj.prototype = new DataModel();
Obj.prototype.constructor = Obj;


function ObjectType () {
    this.id = new Field({ source: "ID", value: 0 });
    this.title = new Field({ source: "TITLE", value: "" });
    this.isBaseObject = new Field({ source: "IS_BASE_OBJECT", value: 0 });
};
ObjectType.prototype = new DataModel();
ObjectType.prototype.constructor = ObjectType;



/*****
 * Класс ЛЭП
 *****/
function PowerLine () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.title = new Field({ source: "TITLE", value: "" });             // Наименование
    this.voltage = new Field({ source: "VOLTAGE", value: 0 });              // Напряжение

    this.reset = function () {
        this.id.value = 0;
        this.title.value = "";
        this.voltage.value = 0;
    };
};
PowerLine.prototype = new DataModel();
PowerLine.prototype.constructor = PowerLine;



/*****
 * Класс контрагента
 *****/
function Contractor () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.contractorTypeId = new Field({ source: "CONTRACTOR_TYPE_ID", value: 0 });    // Идентификатор типа контрагента
    this.title = new Field({ source: "NAME", value: "" });                  // Наименование
    this.fullTitle = new Field({ source: "FULL_NAME", value: "" });         // Полное наименование

    this.reset = function () {
        this.id = 0;
        this.contractorTypeId = 0;
        this.title = "";
        this.fullTitle = "";
    };
};
Contractor.prototype = new DataModel();
Contractor.prototype.constructor = Contractor;



/*****
 * Класс типа котрагента
 *****/
function ContractorType () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.title = new Field({ source: "NAME", value: "" });                  // Наименование типа

    this.reset = function () {
        this.id = 0;
        this.title = "";
    };
};
ContractorType.prototype = new DataModel();
ContractorType.prototype.constructor = ContractorType;



/*****
 * Класс опоры
 *****/
function Pylon () {
    this.id = new Field({ source: "NODE_ID", value: 0 });
    //this.objectId = new Field({ source: "OBJECT_ID", value: 0 });
    this.objectTypeId = new Field({ source: "OBJECT_TYPE_ID", value: 1 });
    this.pointId = new Field({ source: "POINT_ID", value: 0 });
    this.pylonTypeId = new Field({ source: "PYLON_TYPE_ID", value: 0 });
    this.pylonSchemeTypeId = new Field({ source: "PYLON_SCHEME_TYPE_ID", value: 0 });
    this.powerLineId = new Field({ source: "POWER_LINE_ID", value: 0 });
    this.number = new Field({ source: "PYLON_NUMBER", value: 0 });
    this.branchesCount = new Field({ source: "OUT_PATHS", value: 0 });
    this.isBaseObject = new Field({ source: "IS_BASE_OBJECT", value: 0 });
    //this.children = [];
    this.objectTypeId = 1;
    this.typeahead = "";

    this.onInit = function () {
        this.typeahead = "#" + this.number.value;
        //this.children.splice(0, this.children.length);

        //this.levels.splice(0, this.levels.length);
        //for (var i = 1; i < this.level.value; i++) {
        //    this.levels.push(i);
        //}
    };

    this.reset = function () {
        this.id.value = 0;
        //this.objectId.value = 0;
        this.pointId.value = 0;
        this.pylonTypeId.value = 0;
        this.pylonSchemeTypeId.value = 0;
        this.powerLineId.value = 0;
        this.number.value = 0;
    };
};
Pylon.prototype = new DataModel();
Pylon.prototype.constructor = Pylon;



/*****
 * Класс типа опоры
 *****/
function PylonType() {
    this.id = new Field({ source: "ID", value: 0 });
    this.title = new Field({ source: "NAME", value: "" });

    this.reset = function () {
        this.id.value = 0;
        this.title.value = "";
    };
};
PylonType.prototype = new DataModel();
PylonType.prototype.constructor = PylonType;



/*****
 * Класс типа схемы опоры
 *****/
function PylonSchemeType() {
    this.id = new Field({ source: "ID", value: 0 });
    this.title = new Field({ source: "NAME", value: "" });
};
PylonSchemeType.prototype = new DataModel();



/*****
 * Класс типа кабеля
 *****/
function CableType () {
    this.id = new Field({ source: "ID", value: 0 });
    this.title = new Field({ source: "NAME", value: "" });
    this.titleExtra = new Field({ source: "FULL_NAME", value: "" });
    this.capacity = new Field({ source: "CAPACITY", value: 0 });
    this.colorCode = new Field({ source: "COLOR_CODE", value: 0 });

    this.reset = function () {
        this.id.value = 0;
        this.title.value = "";
        this.titleExtra.value = "";
        this.capacity.value = 0;
        this.colorCode.value = 0;
    };
};
CableType.prototype = new DataModel();
CableType.prototype.constructor = CableType;



/*****
 * Класс якоря
 *****/
function Anchor () {
    this.objectId = new Field({ source: "OBJECT_ID", value: 0 });
    this.anchorTypeId = new Field({ source: "ANCHOR_TYPE_ID", value: 0 });
    this.ownerId = new Field({ source: "OWNER_ID", value: 0 });

    this.reset = function () {
        this.objectId.value = 0;
        this.anchorTypeId.value = 0;
        this.ownerId.value = 0;
    };
};
Anchor.prototype = new DataModel();
Anchor.prototype.constructor = Anchor;



/*****
 * Класс типа якоря
 * *****/
function AnchorType () {
    this.id  = new Field({ source: "ID", value: 0 });
    this.title = new Field({ source: "NAME", value: "" });

    this.reset = function () {
        this.id.value = 0;
        this.title.value = "";
    };
};
AnchorType.prototype = new DataModel();
AnchorType.prototype.constructor = AnchorType;



/*****
 * Класс электростанции
 *****/
function PowerStation () {
    this.objectId = new Field({ source: "OBJECT_ID", value: 0 });
    this.title = new Field({ source: "TITLE", value: "" });
    this.valtage = new Field({ source: "VOLTAGE", value: 0 });
};
PowerStation.prototype = new DataModel();



/*****
 * Класс типа виброгасителя
 *****/
function VibroType () {
    this.id = new Field({ source: "ID", value: 0 });
    this.title = new Field({ source: "NAME", value: "" });

    this.reset = function () {
        this.id.value = 0;
        this.title.value = "";
    };
};
VibroType.prototype = new DataModel();
VibroType.prototype.constructor = VibroType;



/*****
 *
 *****/
function Union () {
    this.objectId = new Field({ source: "OBJECT_ID", value: 0 });
    this.unionTypeId = new Field({ source: "UNION_TYPE_ID", value: 0 });

    this.reset = function () {
        this.objectId.value = 0;
        this.unionTypeId.value = 0;
    };
};
Union.prototype = new DataModel();
Union.prototype.constructor = Union;



/*****
 * Класс типа ...
 *****/
function UnionType () {
    this.id = new Field({ source: "ID", value: 0});
    this.title = new Field({ source: "NAME", value: "" });
};
UnionType.prototype = new DataModel();



/*****
 * Класс соединения
 *****/
function TracePart () {
    this.id = new Field({ source: "LINK_ID", value: 0 });
    this.startObjectId = new Field({ source: "START_OBJECT_ID", value: 0 });
    this.endObjectId = new Field({ source: "END_OBJECT_ID", value: 0 });
    this.tituleId = new Field({ source: "TITULE_ID", value: 0 });
    this.titulePartId = new Field({ source: "TITULE_PART_ID", value: 0 });
    this.cableTypeId = new Field({ source: "CABLE_TYPE_ID", value: 0 });
    this.startVibroTypeId = new Field({ source: "START_VIBRO_TYPE_ID", value: 0 });
    this.endVibroTypeId = new Field({ source: "END_VIBRO_TYPE_ID", value: 0 });
    this.length = new Field({ source: "LENGTH", value: 0 });
    this.tension = new Field({ source: "TENSION", value: 0 });

    this.reset = function () {
        this.id.value = 0;
        this.startObjectId.value = 0;
        this.endObjectId.value = 0;
        this.tituleId.value = 0;
        this.titulePartId.value = 0;
        this.cableTypeId.value = 0;
        this.startVibroTypeId.value = 0;
        this.endVibroTypeId.value = 0;
        this.length.value = 0;
        this.tension.value = 0;
    };
};
TracePart.prototype = new DataModel();
TracePart.prototype.constructor = TracePart;






/*****
 * Структура, описывающая коллекцию данных
 *****/
function Collection (mdl) {
    this.items = []; // Массив элементов коллекции
    this.isLoaded = true; // Флаг загрузки коллекции
    this.isLoading = false;
    this.model = undefined;
    this.errors = [];

    if (mdl) {
        this.model = mdl;
        this.model.constructor = mdl.constructor;
    }

    /* Добавляет элемент в коллекцию */
    Collection.prototype.add = function(item){
        if (item) {
            this.items.push(item);
        }
    };

    /* Удаляет элемент из коллекции */
    Collection.prototype.remove = function (field, value) {
        if (field && value) {
            for (var i = 0; i < this.items.length; i++){
                if(this.items[i][field] && this.items[i][field].constructor == Field && this.items[i][field]["value"] == value){
                    this.items.splice(i, 1);
                    return this.items.length;
                }
            }
            return false;
        }
    };

    /* Находит элемент в коллекции по наименованию поля и значению поля */
    Collection.prototype.find = function (field, value) {
        for (var i = 0; i < this.items.length; i++) {
            if(this.items[i][field] && this.items[i][field]["value"] == value)
                return this.items[i];
        }
        return false;
    };

    /* Возвращает количество элементов в коллекции */
    Collection.prototype.length = function () {
        return this.items.length;
    };

    /* Удаляет все элементы из коллекции */
    Collection.prototype.clear = function () {
        this.items.splice(0, this.items.length);
    };

    /* Возвращает массив с элементами коллекции */
    Collection.prototype.toArray = function () {
        return this.items;
    };
    Collection.prototype.fromArray = function (array) {
        if (array && array.constructor == Array) {
            this.items.splice(0, this.items.length);
            for (var i = 0; i < array.length; i++) {
                this.items.push(array[i]);
            }
            console.log("end");
            console.log(this.items);
        }
    };

    Collection.prototype.fromJSON = function (JSONdata) {
        if (JSONdata) {
            //console.log(JSONdata);
            for (var i = 0; i < JSONdata.length; i++) {
                if (this.model) {
                    var temp_obj = new this.model.constructor;
                    temp_obj.fromJSON(JSONdata[i]);
                    //console.log(temp_obj);
                    this.items.push(temp_obj);
                } else {
                    var temp_obj = JSONdata[i];
                    this.items.push(temp_obj);
                }
            }
            this.isLoaded = true;
            this.isLoading = false;
        }
    };

    Collection.prototype.clearErrors = function () {
        this.errors.length = 0;
    };

    /**/
    //Collection.prototype.toJSON = function () {
    //    var result = [];
    //    for (var item in this.items) {
    //        for (var prop in this.items[item]) {
    //            if (this.items[item][prop].constructor == Field) {
    //                result.push(this.items[item][prop])
    //            }
    //        }
    //    }
    //    return result;
    //};

};




function ObjectList () {
    this.objectTypesIds = [];
    this.pylons = [];
    this.powerLinesIds = [];
    this.unknown = [];

    this.states = {
        loading: false,
        ready: false,
        finished: function (flag) {
            if (flag != undefined && flag.constructor == Boolean) {
                this.states.ready = flag;
                this.states.loading = false;
            }
        }
    };

    this.parse = function (json) {
        if (json) {
            var objectTypeId = parseInt(json["OBJECT_TYPE_ID"]);
            if (objectTypeId != 0 && this.objectTypesIds.indexOf(objectTypeId) == -1)
                this.objectTypesIds.push(objectTypeId);

            switch (objectTypeId) {
                case 0:
                    var unknown = new Obj();
                    unknown.fromSOURCE(json);
                    this.unknown.push(unknown);
                    break;
                case 1:
                    var powerLineId = parseInt(json["POWER_LINE_ID"]);
                    if (this.powerLinesIds.indexOf(powerLineId) == -1)
                        this.powerLinesIds.push(powerLineId);
                    var pylon = new Pylon();
                    pylon.fromSOURCE(json);
                    pylon.onInit();
                    console.log("pylon typeahead = ", pylon.typeahead);
                    this.pylons.push(pylon);
                    break;
            }
        }
    };
};


function TituleObjects (titule) {
    this.startObject = undefined;
    this.endObject = undefined;

    this.states = {
        loading: false,
        ready: false,
        finished: function (flag) {
            if (flag != undefined && flag.constructor == Boolean) {
                this.states.ready = flag;
                this.states.loading = flag;
            }
        }
    };

    this.parse = function (json) {
        if (json) {
            angular.forEach(json, function (object) {
                var objectId = parseInt(object["OBJECT_ID"]);
                var objectTypeId = parseInt(object["OBJECT_TYPE_ID"]);
                switch (objectId) {
                    case titule.startObjectId.value:
                        switch (objectTypeId) {
                            case 0:
                                this.startObject = new Obj();
                                this.startObject.fromSOURCE(object);
                                break;
                            case 1:
                                this.startObject = new Pylon();
                                this.startObject.fromSOURCE(object);
                                this.startObject.onInit();
                                break;
                        }
                        break;
                    case titule.endObjectId.value:
                        switch (objectTypeId) {
                            case 0:
                                this.endObject = new Obj();
                                this.endObject.fromSOURCE(object);
                                break;
                            case 1:
                                this.endObject = new Pylon();
                                this.endObject.fromSOURCE(object);
                                this.endObject.onInit();
                                break;
                        }
                        break;
                }
            });
        }
    }
};



function FileItem () {
    this.id = new Field({ source: "ID", value: 0 });
    this.tituleId = new Field({ source: "TITULE_ID", value: 0 });
    this.userId = new Field({ source: "USER_ID", value: 0 });
    this.added = new Field({ source: "ADDED", value: 0 });
    this.title = new Field({ source: "TITLE", value: "" });
    this.url = new Field({ source: "URL", value: "" });
    this.size = new Field ({ source: "FILESIZE", value: 0 });
};
FileItem.prototype = new DataModel();
FileItem.prototype.constructor = FileItem;







function TituleNodes () {
    this.path = {
        nodes: []
    };
    this.pathNodeIds = [];      // Массив идентификаторов узлов в пути титула
    this.stack = [];            // Глобальный стек всех узлов титула


    /**
     * Добавляет узел в конец массива узлов пути и в глобальный стек узлов
     * @param node - Добавляемый узел
     */
    this.appendNode = function (node) {
        console.log(this);
        if (this.path.nodes.length > 0) {
            node.prevNodeIndex = this.path.nodes.length - 1;
            node.prevNodeId = this.path.nodes[node.prevNodeIndex].id.value;
            this.path.nodes[node.prevNodeIndex].nextNodeIndex = node.prevNodeIndex + 1;
            this.path.nodes[node.prevNodeIndex].nextNodeId = node.id.value;
        } else {
            node.prevNodeIndex = -1;
            node.prevNodeId = -1;
        }
        node.nextNodeIndex = -1;
        node.nextNodeId = -1;
        node.haveBranches = node.branchesCount.value > 0 ? true : false;
        node.collapsed = true;

        this.path.nodes.push(node);
        this.stack.push(node);
        console.log("appended node to path ", node);
    };



    /**
     * Добавляет узел после узла, заданного идентификатором prevNodeId
     * @param prevNodeId - Идентификатор узла, за которым будет добавлен новый узел
     * @param node - Узел, который будет добавлен
     * @returns {boolean}
     */
    this.insertNodeAfter = function (prevNodeId, node) {
        for (var i = 0; i < this.path.nodes.length; i++) {
            if (this.path.nodes[i].id.value === prevNodeId) {
                node.prevNodeIndex = i;
                node.nextNodeIndex = this.path.nodes[i].nextNodeIndex;
                node.nextNodeId = this.path.nodes[i].nextNodeId;
                node.prevNodeId = this.path.nodes[i].id.value;
                node.haveBranches = node.branchesCount.value > 0 ? true : false;
                node.collapsed = true;
                this.path.nodes[i].nextNodeId = node.id.value;
                if (this.path.nodes[i + 1] !== undefined) {
                    this.path.nodes[i + 1].prevNodeIndex = i + 1;
                    this.path.nodes[i + 1].prevNodeId = node.id.value;
                }
                if (this.path.nodes[i].parentId !== undefined) {
                    for (var y = 0; y < this.stack.length; y++) {
                        if (this.stack[y] === this.path.nodes[i].parentId) {
                            this.appendChild(this.stack[y].id.value, node);
                        }
                    }
                }
                this.path.nodes.splice(i + 1, 0 , node);
                this.stack.splice(i + 1, 0, node);
            }
        }
    };


    /**
     * Добавляет узел после узла, заданного идентификатором prevNodeId в ответвление, заданное идентификатором branchId
     * @param nodeId {Number}
     * @param branchId {Number}
     * @param prevNodeId {Number}
     * @param node {Object}
     */
    this.insertNodeAfterToBranch = function (nodeId, branchId, prevNodeId, node) {
        if (nodeId !== undefined && branchId !== undefined && prevNodeId !== undefined && node !== undefined) {
            var length = this.stack.length;
            var branch_length = 0;
            var i, x = 0;

            for (i = 0; i < length; i++) {
                if (this.stack[i].id.value === nodeId) {
                    if (this.stack[i].branches !== undefined && this.stack[i].branches[branchId] !== undefined) {
                        branch_length = this.stack[i].branches[branchId].length;
                        for (x = 0; x < branch_length; x++) {
                            if (this.stack[i].branches[branchId][x].id.value === prevNodeId) {
                                node.prevNodeIndex = x;
                                node.nextNodeIndex = this.stack[i].branches[branchId][x].nextNodeIndex;
                                node.nextNodeId = this.stack[i].branches[branchId][x].nextNodeId;
                                node.prevNodeId = this.stack[i].branches[branchId][x].id.value;
                                node.haveBranches = node.branchesCount.value > 0 ? true : false;
                                node.pathId = branchId;
                                node.parentId = nodeId;
                                node.collapsed = true;

                                /* Вносим изменения в предыдущий него */
                                this.stack[i].branches[branchId][x].nextNodeIndex = x + 1;
                                this.stack[i].branches[branchId][x].nextNodeId = node.id.value;


                                /* Если в ответвлении существует следующий после текущего узел, то вносим изменения в него */
                                if (this.stack[i].branches[branchId][x + 1] !== undefined) {
                                    this.stack[i].branches[branchId][x + 1].prevNodeIndex = x + 1;
                                    this.stack[i].branches[branchId][x + 1].prevNodeId = node.id.value;
                                }

                                this.stack[i].branches[branchId].splice(x + 1, 0, node);
                                this.stack.push(node);
                            }
                        }
                    }
                }
            }
        }
    };


    /**
     * Добавляет узел в ответвление от заданного узла
     * @param nodeId
     * @param node
     */

    this.addBranch = function (nodeId, node) {
        var length = this.stack.length;
        for (var i = 0; i < length; i++) {
            if (this.stack[i].id.value === nodeId) {
                this.stack[i].children = [];
                node.prevNodeIndex = i;
                node.prevNodeId = this.stack[node.prevNodeIndex].id.value;
                node.nextNodeIndex = -1;
                node.nextNodeId = -1;
                this.stack[i].children.push(node);
                this.stack.push(node);



            }
        }
    };


    /**
     * Добавляет дочерний узел в заданный узел
     * @param nodeIndex
     * @param child
     */
    this.appendChild = function (nodeId, child) {
        for (var i = 0; i < this.stack.length; i++) {
            if (this.stack[i].id.value === nodeId) {
                if (this.stack[i].children === undefined)
                    this.stack[i].children = [];
                child.parentId = this.stack[i].id.value;
                child.haveChildren = child.links.value > 0 ? true : false;
                child.prevNodeIndex = this.stack[i].children.length > 0 ? this.stack[i].children.length - 1 : -1;
                child.prevNodeId = child.prevNodeIndex === -1 ? -1 : this.stack[i].children[child.prevNodeIndex].id.value;
                child.nextNodeIndex = -1;
                child.nextNodeId = -1;
                this.stack[i].children.push(child);
                this.stack.push(child);
                console.log(child, " appended to ", child.parentId);
                console.log(this.stack[i].children);
            }
        }

    };


    /**
     * Добавляет узел в указанное ответвление
     * @param nodeId {Number} - Идентификатор узла, в ответвление которого требуется добавить узел
     * @param branchId {number} - Идентификатор пути ответвления
     * @param node {Object} - Узел, который требуется добавить
     */
    this.appendNodeToBranch = function (nodeId, branchId, node) {
        var length = this.stack.length;
        var prevNodeIndex = -1;
        var branch = [];
        var branch_found = false;
        var branch_index = -1;

        for (var i = 0; i < length; i++) {
            if (this.stack[i].id.value === nodeId) {

                /* Если у узла отстуствует массив с ответвлениями - добавляем его */
                if (this.stack[i].branches === undefined)
                    this.stack[i].branches = [];


                for (var z = 0; z < this.stack[i].branches.length; z++) {
                    if (this.stack[i].branches[z].id === branchId) {
                        branch_index = z;
                    }
                }

                node.parentId = nodeId;
                node.pathId = branchId;
                node.lastNodeInBranch = true;

                if (branch_index === -1) {
                    branch.id = branchId;
                    branch_index = (this.stack[i].branches.push(branch) - 1);
                    node.prevNodeId = nodeId;
                } else {
                    prevNodeIndex = this.stack[i].branches[branch_index].length > 0 ? this.stack[i].branches[branch_index].length - 1 : -1;
                    node.prevNodeId = prevNodeIndex !== -1 ? this.stack[i].branches[branch_index][prevNodeIndex].id.value : -1;
                    if (prevNodeIndex !== -1) {
                        this.stack[i].branches[branch_index][prevNodeIndex].nextNodeId = node.id.value;
                        this.stack[i].branches[branch_index][prevNodeIndex].lastNodeInBranch = false;
                    }
                }

                node.nextNodeId = -1;
                node.haveBranches = node.branchesCount.value > 0 ? true : false;
                node.collapsed = true;
                this.stack[i].branches[branch_index].push(node);


                this.stack[i].isOpened = true;
                this.stack.push(node);

                //for (var o = 0; o < this.stack[i].branches.length; o++) {
                //    if (this.stack[i].branches[o].id === branchId) {
                //        this.stack[i].branches[o].push(node);
                //    }
                //}

                console.log(this.stack[i]);
            }
        }
    };



    /**
     * Отмечает узел как активный
     * @param nodeIndex {Number} - Идентификатор узла, который требуется отметить как активный
     */
    this.select = function (nodeId) {
        var selectedNodeId = -1;
        var i = 0;

        for (i = 0; i < this.stack.length; i++) {
            if (this.stack[i].id.value === nodeId) {
                if (this.stack[i].isActive === false) {
                    selectedNodeId = this.stack[i].id.value;
                    this.stack[i].isActive = true;
                    console.log("node id = ", this.stack[i].id.value);
                    console.log("prev node id = ", this.stack[i].prevNodeId);
                    console.log("next node id = ", this.stack[i].nextNodeId);
                    console.log(this.stack[i]);
                    //console.log("branches count = ", this.stack[i].branches.length);
                } else {
                    this.stack[i].isActive = false;
                    selectedNodeId = -1;
                }
            } else {
                this.stack[i].isActive = false;
            }
        }
        //console.log("selected = ", selectedNode);
        return selectedNodeId;
    };


    this.expand = function (nodeId) {
        if (nodeId !== undefined) {
            var length = this.stack.length;
            var i = 0;
            for (i = 0; i < length; i++) {
                if (this.stack[i].id.value === nodeId) {
                    this.stack[i].collapsed = false;
                }
            }
        }
    };


    this.collapse = function (nodeId) {
        if (nodeId !== undefined) {
            console.log("node for collapse = ", nodeId);
            var length = this.stack.length;
            var i = 0;

            for (i = 0; i < length; i++) {
                if (this.stack[i].id.value === nodeId) {
                    this.stack[i].collapsed = true;
                }
            }
        }
    };


    /**
     * Проверяет, является ли узел активным
     * @param nodeId - Идентификатор узла
     * @returns {boolean} - Возвращает флаг, является ли узел активным
     */
    this.isNodeActive = function (nodeId) {
        if (nodeId !== undefined) {
            var length = this.stack.length;
            for (var i = 0; i < length; i++) {
                if (this.stack[i].id.value === nodeId) {
                    return this.stack[i].isActive;
                }
            }
        }
    };


    /**
     * Ищет и возвращает узел из стека узлов
     * @param nodeId - Идентификатор искомого узла
     * @returns {{}} - Возвращает узел из стека
     */
    this.getNode = function (nodeId) {
        if (nodeId !== undefined) {
            var result = undefined;
            for (var i = 0; i < this.stack.length; i++) {
                if (this.stack[i].id.value === nodeId) {
                    result =  this.stack[i];
                }
            }
            return result;
        }
    };


    this.setNodeHaveChildren = function (nodeId, flag) {
        if (nodeId !== undefined && flag !== undefined && flag.constructor === Boolean) {
            for (var i = 0; i < this.path.length; i++) {
                if (this.nodes[i].id.value === nodeId)
                    this.nodes[i].haveChildren = true;
            }
        }
    };

    this.clearNodes = function () {
        this.path.nodes.splice(0, this.path.nodes.length);
        this.stack.splice(0, this.stack.length);
    };

    this.getChildNodes = function (nodeId) {
        var result = false;
        for (var i = 0; i < this.stack.length; i++) {
            if (this.stack[i].id.value === nodeId) {
                if (this.stack[i].children !== undefined)
                    result = this.stack[i].children;
            }
        }
        return result;
    };


    this.getBranches = function (nodeId) {
        var result = false;
        var length = this.stack.length;
        for (var i = 0; i < length; i++) {
            if (this.stack[i].id.value === nodeId) {
                if (this.stack[i].branches !== undefined)
                    result = this.stack[i].branches;
                //if (this.stack[i]._branches_ !== undefined)
                //    result = this.stack[i]._branches_.items;
            }
        }
        console.log("branches = ", result);
        return result;
    };


    this.isOpened = function (nodeId) {
        if (nodeId !== undefined) {
            var length = this.stack.length;
            for (var i = 0; i < length; i++) {
                if (this.stack[i].id.value === nodeId)
                    return this.stack[i].isOpened;
            }
        }
    };

};



