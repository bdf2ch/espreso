"use strict";

/*****
 * Поле модели данных
 *****/
function Field (parameters) {
    this.default = undefined;       // Значение по умолчанию
    this.value = undefined;         // Значение
    this.source = undefined;        // Источник данных

    /* Инициализация на основе аргумента конструктора */
    if (parameters) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param))
                this[param] = parameters[param];
        }
        if (this.value == undefined && this.default != undefined)
            this.value = this.default;
    }
};



/*****
 * Модель данных
 *****/
function Model (parameters) {
    this._controller = undefined;  // url контроллера на стороне сервера
    this._backup = {};             // Бэкап модели

    /* Инициализирует бэкап модели */
    this._setupBackup = function () {
        for (var prop in this) {
            if (this[prop].constructor == Field) {
                this._backup[prop] = this[prop];
            }
        }
    };

    /* Восстанавливает значения полей модели из бэкапа */
    this._restoreFromBackup = function () {
        for (var prop in this._backup) {
            if (this[prop] && this[prop].constructor == Field)
                this[prop].value = this._backup[prop];
        }
    };

    /* Инициализация модели на основе json-данных */
    this._fromJSON = function (json) {
        if (json) {
            for (var data_piece in json) {
                for (var prop in this) {
                    if (this[prop].constructor == Field && this[prop].source == data_piece) {
                        this[prop].value = json[data_piece];
                    }
                }
            }
            this._setupBackup();
        }
    };

    /* Устанавливает значения полей по умолчанию */
    this._reset = function () {
        for (var prop in this) {
            if (this[prop].constructor == Field && this[prop].default != undefined)
                this[prop].value = this[prop].default;
        }
    };

    /* Контроль за текущим состоянием модели */
    this._state = {
        isActive: false,        // Находится ли модель в активном состоянии
        inEditMode: false,      // Находится ли модель в режиме редактирования объекта
        inAddMode: false,       // Находится ли модель в режиме добавления нового объекта
        inDeleteMode: false,    // Находится ли модель в режиме удаления объекта

        /* Устанавливает режим активности элемента */
        setActive: function (flag) {
            if (flag != undefined && flag.constructor == Boolean)
                this.isActive = flag;
        },

        /* Устанавливает режим редактирования объекта */
        setEditMode: function (flag) {
            if (flag != undefined && flag.constructor == Boolean)
                this.inEditMode = flag;
        },

        /* Устанавливает режим добавления объекта */
        setAddMode: function (flag) {
            if (flag != undefined && flag.constructor == Boolean)
                this.inAddMode = flag;
        },

        /* Устанавливает режим удаления объекта */
        setDeleteMode: function (flag) {
            if (flag != undefined && flag.constructor == Boolean)
                this.inDeleteMode = flag;
        }
    };


    /* Инициализация на основе аргумента конструктора */
    if (parameters) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param))
                this[param] = parameters[param];
        }
    }

};



/*****
 * Коллекция экземпляров модели
 *****/
function Storage (parameters) {
    this.data = [];
    this._model = undefined;

    /* Добавляет элемент в коллекцию */
    this.add = function (item) {
        if (item != undefined && item.constructor == this._model) {
            this.data.push(item);
        }
    };

    if (parameters) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param)) {
                switch (param) {
                    case "_model":
                        this._model = parameters[param].constructor;
                        break;
                    default:
                        this[param] = parameters[param];
                        break;
                }
            }
        }
    }


};