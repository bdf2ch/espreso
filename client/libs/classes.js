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
        this.inEditMode = false;
        this.inDeleteMode = false;
        this.deleteInProgress = false;
        this.deleted = false;
    };

    /* Восстанавливает объект из бэкапа */
    this.restoreFromBackup = function () {
        if (this.backup) {
            for (var prop in this.backup) {
                if (this.hasOwnProperty(prop) && this[prop].constructor == Field)
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
                        this[field]["value"] = SRCdata[data];
                    }
                }
            }
            this.setupBackup();
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
    this.models = [];


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



function Model () {
    this.class = undefined;
    this.links = {
        view: "",
        edit: "",
        delete: ""
    };
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
UserAction.prototype = new DataModel();



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
    this.title = new Field({ source: "NAME", value: "" });                  // Наименование
    this.extraTitle = new Field({ source: "NAME_EXTRA", value: "" });       // Описание
    this.length = new Field({ source: "LENGTH", value: 0 });                // Протяженность
};
Titule.prototype = new DataModel();



/*****
 * Класс проекта
 ****/
function Project () {
    this.id = new Field({ source: "", value: 0 });                           // Идентификатор
    this.tituleId = new Field({ source: "TITUL_ID", value: 0 });             // Идентификатор титула
    this.statusId = new Field({ source: "STATUS_ID", value: 0 });            // Идентификатор статуса
    this.title = new Field({ source: "TITLE", value: "" });                  // Наименование
    this.startObjectId = new Field({ source: "START_OBJECT_ID", value: 0 }); // Идентификатор начального объекта
    this.endObjectId = new Field({ source: "END_OBJECT_ID", value: 0 });     // Идентификатор конечного объекта
    this.invNumber = new Field({ source: "INV_NUMBER", value: "" });         // Инвентарный номер
    this.length = new Field({ source: "LENGTH", value: 0 });                 // Протяженность
};
Project.prototype = new DataModel();



/*****
 * Класс статуса
 *****/
function Status () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.title = new Field({ source: "NAMENOVANIE", value: "" });           // Наименование
};
Status.prototype = new DataModel();



/*****
 * Класс географической точки
 *****/
function Point () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.x = new Field({ source: "X", value: 0 });                          // X-координата
    this.y = new Field({ source: "Y", value: 0 });                          // Y-координата
    this.z = new Field({ source: "Z", value: 0 });                          // Z-координата
    this.description = new Field({ source: "DESCRIPTION", value: "" });     // Описание
};
Point.prototype = new DataModel();



/*****
 * Класс объекта
 *****/
function Object () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.pointId = new Field({ source: "POINT_ID", value: 0 });             // Идентификатор географической точки
    this.title = new Field({ source: "NAMENOVANIE", value: "" });           // Наименование
};
Object.prototype = new DataModel();



/*****
 * Класс ЛЭП
 *****/
function PowerLine () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.title = new Field({ source: "LINE_NAME", value: "" });             // Наименование
    this.voltage = new Field({ source: "VOLTAGE", value: 0 });              // Напряжение
};
PowerLine.prototype = new DataModel();



/*****
 * Класс контрагента
 *****/
function Contractor () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.contractorTypeId = new Field({ source: "CONTRACTOR_TYPE_ID", value: 0 });    // Идентификатор типа контрагента
    this.title = new Field({ source: "NAME", value: "" });                  // Наименование
    this.fullTitle = new Field({ source: "FULL_NAME", value: "" });         // Полное наименование
};
Contractor.prototype = new DataModel();



/*****
 * Класс типа котрагента
 *****/
function ContractorType () {
    this.id = new Field({ source: "ID", value: 0 });                        // Идентификатор
    this.title = new Field({ source: "NAME", value: "" });                  // Наименование типа
};
ContractorType.prototype = new DataModel();



/*****
 * Класс опоры
 *****/
function Pylon () {
    this.id = new Field({ source: "ID", value: 0 });
    this.objectId = new Field({ source: "OBJECT_ID", value: 0 });
    this.pylonTypeId = new Field({ source: "PYLON_TYPE_ID", value: 0 });
    this.pylonSchemeTypeId = new Field({ source: "PYLON_SCHEME_TYPE_ID", value: 0 });
    this.powerLineId = new Field({ source: "POWER_LINE_ID", value: 0 });
    this.number = new Field({ source: "PYLON_NUMBER", value: 0 });
};
Pylon.prototype = new DataModel();



/*****
 * Класс типа опоры
 *****/
function PylonType() {
    this.id = new Field({ source: "ID", value: 0 });
    this.title = new Field({ source: "NAME", value: "" });
};
PylonType.prototype = new DataModel();



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
};
CableType.prototype = new DataModel();



/*****
 * Класс якоря
 *****/
function Anchor () {
    this.objectId = new Field({ source: "OBJECT_ID", value: 0 });
    this.anchorTypeId = new Field({ source: "ANCHOR_TYPE_ID", value: 0 });
    this.ownerId = new Field({ source: "OWNER_ID", value: 0 });
};
Anchor.prototype = new DataModel();



/*****
 * Класс типа якоря
 * *****/
function AnchorType () {
    this.id  = new Field({ source: "ID", value: 0 });
    this.title = new Field({ source: "NAME", value: "" });
};
AnchorType.prototype = new DataModel();



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
};
VibroType.prototype = new DataModel();



/*****
 *
 *****/
function Union () {
    this.objectId = new Field({ source: "OBJECT_ID", value: 0 });
    this.unionTypeId = new Field({ source: "UNION_TYPE_ID", value: 0 });
};
Union.prototype = new DataModel();



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
    this.id = new Field({ source: "ID", value: 0 });
    this.startObjectId = new Field({ source: "START_OBJECT_ID", value: 0 });
    this.endObjectId = new Field({ source: "END_OBJECT_ID", value: 0 });
    this.projectId = new Field({ source: "PROJECT_ID", value: 0 });
    this.cableTypeId = new Field({ source: "CABLE_TYPE_ID", value: 0 });
    this.startVibroType = new Field({ source: "START_VIBRO_TYPE", value: 0 });
    this.endVibroType = new Field({ source: "END_VIBRO_TYPE", value: 0 });
    this.length = new Field({ source: "LENGTH", value: 0 });
    this.tension = new Field({ source: "TENSION", value: 0 });
};
TracePart.prototype = new DataModel();





/*****
 * Структура, описывающая коллекцию данных
 *****/
function Collection (mdl) {
    this.items = []; // Массив элементов коллекции
    this.isLoaded = false; // Флаг загрузки коллекции
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
