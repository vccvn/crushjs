import { getType, inArray, isArray, isFunction, isObject, isString, Str, _defineProperty, _instanceof } from "./helper.js";

/**
 * id cua đối tượng data
 * @var {integer} dataID
 */
var dataID = 0;

/**
 * nới chứa dữ liệu của các 
 */
var dataContainer = [];

/**
 * Giá trị random
 * @var {string}
 */
var NO_VALUE = Str.rand();

/**
 * khai báo data
 * @param {integer} id id
 */
function addObject(id) {
    dataContainer.push({
        id: id,
        data: {},
        array: [],
        origin: null,
        events: [],
        props: {}
    });
}

/**
 * lấy về data
 * @param {integer} id 
 * @returns {*}
 */

function getObject(id) {
    if (dataContainer.length) {
        for (let index = 0; index < dataContainer.length; index++) {
            const objectData = dataContainer[index];
            if (objectData.id == id) return objectData;
        }
    }
    return false;
}
function removeObject(id) {
    if (dataContainer.length) {
        for (let index = 0; index < dataContainer.length; index++) {
            const objectData = dataContainer[index];
            if (objectData.id == id) dataContainer.slice(index, 1);
        }
    }
}

function getObjectData(id, key) {
    var object = getObject(id);
    if (!object) return NO_VALUE;
    if (isString(key)) return Object.hasOwnProperty.call(object.data, key) ? object.data[key] : NO_VALUE;
    return key === undefined ? object.data : NO_VALUE;
}

function setObjectData(id, key, value) {
    var object = getObject(id);
    if (!object) return false;
    if (isObject(key)) {
        for (const k in key) {
            if (Object.hasOwnProperty.call(key, k)) {
                const v = key[k];
                object.data[k] = v;
            }
        }
    } else if (isString(key)) {
        object.data[key] = value;
    }
}
function getObjectProp(id, key) {
    var object = getObject(id);
    if (!object) return NO_VALUE;
    if (isString(key)) return Object.hasOwnProperty.call(object.props, key) ? object.props[key] : NO_VALUE;
    return key === undefined ? object.props : NO_VALUE;
}

function setObjectProp(id, key, value) {
    var object = getObject(id);
    if (!object) return false;
    if (isObject(key)) {
        for (const k in key) {
            if (Object.hasOwnProperty.call(key, k)) {
                const v = key[k];
                object.props[k] = v;
            }
        }
    } else if (isString(key)) {
        object.props[key] = value;
    }
}


function getObjectEvent(id, event, handler) {
    var object = getObject(id);
    if (!object) return NO_VALUE;
    var key = event;
    if (isString(key)) {
        if (Object.hasOwnProperty.call(object.events, key) && isArray(object.events[key])) {
            var events = object.events[key];
            if (handler) {
                var index = events.indexOf(handler);
                if (index !== -1) return events[index];
                return NO_VALUE;
            }
            return events;
        }
    }
    return NO_VALUE;

}

function addObjectEvent(id, event, handler) {
    var object = getObject(id);
    if (!object) return false;
    if (isString(event)) {
        if (!object.events[key] || object.events[key] === undefined) {
            object.events[key] = [];
        }
        if (typeof handler == "function") {
            object.events.push(habdler);
            return true;
        }
    }
    return false;
}
function dispatchObjectEvent(object, event) {
    if (!isObject(object) || !(object.isDataObject || object.isDataArray) || !isObject(event) || !event.accessKey) {
        return false;
    }
    var eventhandlers = getObjectEvent(object.__ID__, event.accessKey);
    var s = true;
    var sc = undefined;
    if (isArray(eventhandlers) && eventhandlers.length) {
        for (let i = 0; i < eventhandlers.length; i++) {
            const fn = eventhandlers[i];
            if (typeof fn == "function") {
                sc = fn.call(object, event);
                if (sc === false || sc == NO_VALUE) s = false;
            }

        }
        return s;
    }
    return NO_VALUE;

}


var DataObject = function DataObject(data) {
    if (!_instanceof(this, DataObject)) {
        return new DataObject(data);
    }
    var id = ++dataID;
    addObject(id);
    Object.defineProperty(this, '__ID__', {
        get: function () {
            return id;
        },
        set: function (value) {
            console.error("Bạn không thể");
        }
    });
    Object.defineProperty(this, '__IsDataObject__', {
        get: function () {
            return true;
        },
        set: function (value) {
            
        }
    });
    this.__IsDataObject__ = true;

    Object.defineProperty(this, '__Origin__', {
        get: function () {
            return getObject(id).origin;
        }
    });

    Object.defineProperty(this, '__VALUE__', {
        get: function () {
            return this.__ToData__();
        },
        set: function (value) {
            if(inArray(['DataObject', 'DataArray'], this.__Type__)){
                console.log("bạn không thể set value")
            }else{
                this.__Setup__(value);

            }
        }
    });
    Object.defineProperty(this, '__KEYS__', {
        get: function () {
            var keys = [];
            if(this.__Type__ == 'DataObject'){
                var d = getObjectData(id);
                for (const key in d) {
                    if (Object.hasOwnProperty.call(d, key)) {
                        const vl = d[key];
                        keys.push(key);
                    }
                }
            }else if(this.__Type__ == 'DataArray'){
                var indexes = this.__Array__.__INDEXES__;
                if(isArray(indexes)){
                    keys = indexes;
                }
            }
            
            return keys;
        },
        set: function (value) {
            console.warn("Bạn không thể gán giá trị cho thuộc tính __KEYS__");
        }
    });
    
    this.__Setup__(data);
};
var DataArray = function DataArray(array) {
    if(!isArray(array)) return new DataObject(array);
    if (!_instanceof(this, DataArray)) {
        return new DataArray(array);
    }
    var id = ++dataID;
    addObject(id);
    Object.defineProperty(this, '__ID__', {
        get: function () {
            return id;
        },
        set: function (value) {
            console.error("Bạn không thể");
        }
    });
    Object.defineProperty(this, '__IsDataArray__', {
        get: function () {
            return true;
        },
        set: function (value) {
            
        }
    });
    this.__IsDataArray__ = true;

    Object.defineProperty(this, '__Origin__', {
        get: function () {
            return getObject(id).origin;
        }
    });

    Object.defineProperty(this, '__VALUE__', {
        get: function () {
            return this.__ToData__();
        },
        set: function (value) {
            if(inArray(['DataObject', 'DataArray'], this.__Type__)){
                console.log("bạn không thể set value")
            }else{
                this.__Setup__(value);

            }
        }
    });
    Object.defineProperty(this, '__KEYS__', {
        get: function () {
            var keys = [];
            if(this.__Type__ == 'DataObject'){
                var d = getObjectData(id);
                for (const key in d) {
                    if (Object.hasOwnProperty.call(d, key)) {
                        const vl = d[key];
                        keys.push(key);
                    }
                }
            }else if(this.__Type__ == 'DataArray'){
                var indexes = this.__Array__.__INDEXES__;
                if(isArray(indexes)){
                    keys = indexes;
                }
            }
            
            return keys;
        },
        set: function (value) {
            console.warn("Bạn không thể gán giá trị cho thuộc tính __KEYS__");
        }
    });
    this.__Setup__(array);
};


function parseValue(value) {

    var vl = value;
    // nếu giá trị thuộc kiểu object
    if (isObject(value)) {
        // hoac phu dinh
        if (!(_instanceof(vl, DataObject) || _instanceof(vl, DataArray) || vl.isDataObject || vl.isDataArray)) {
            vl = new DataObject(value);
        }

    }
    else if (isArray(value)) {
        vl = new DataArray(value);
    }
    else {
        vl = new DataObject(value);
    }
    return vl;
}


Object.assign(DataObject.prototype, {
    constructor: DataObject,
    isDataObject: true,
    /**
     * thiết lập dữ liệu
     * @param {*} data dữ liệu đầu vào
     */
    __Setup__: function setup(data) {
        if (isObject(data)) {
            if (_instanceof(data, DataObject) || data.isDataObject) {
                this.__SetProp__('__Type__', 'DataObject');
                var origin = data.__ToData__();
                this.__SetData__(origin);
                getObject(this.__ID__).origin = data;
            }
            else if (data.constructor === Object) {
                this.__SetProp__('__Type__', 'DataObject');
                this.__SetData__(data);
                getObject(this.__ID__).origin = data;
            }
            else if (_instanceof(data, DataArray) || data.isDataArray) {
                this.__SetProp__('__Type__', 'DataArray');
                getObject(this.__ID__).origin = data.__Origin__;
                this.__SetProp__('__Array__', data);

            } else {
                this.__SetProp__('__Type__', 'object');
                getObject(this.__ID__).origin = data;
            }
        }
        else if (isArray(data)) {
            this.__SetProp__('__Type__', 'DataArray');
            var d = (new DataArray(data)).__SetParent__(this);
            this.__SetProp__('__Array__', d);
            getObject(this.__ID__).origin = d.__Origin__;
        }
        else if (data === undefined) {
            this.__SetProp__('__Type__', 'undefined');
            getObject(this.__ID__).origin = data;
        } else if (data === null) {
            this.__SetProp__('__Type__', 'null');
            getObject(this.__ID__).origin = data;
        } else {
            this.__SetProp__('__Type__', getType(data));
            getObject(this.__ID__).origin = data;
        }

    },
    /**
     * set hía trị thuộc tính
     * @param {string} key chuỗi tên thuộc tính
     * @param {*} propValue gia1q trị bất kỳ
     */
    __SetProp__: function (key, propValue) {
        var objectProp = getObjectProp(this.__ID__);
        if (!Object.hasOwnProperty.call(objectProp, key)) {
            Object.defineProperty(this, key, {
                get: function () {
                    return objectProp[key];
                },
                set: function (value) {
                    objectProp[key] = value;
                }
            });
        }
        objectProp[key] = propValue;
    },
    /**
     * set du lieu
     * @param {*} key key hoặc data
     * @param {*} value gia tri
     */
    __SetData__: function (key, value) {
        if (isObject(key)) {
            if (key.constructor == Object) {
                for (const k in key) {
                    if (Object.hasOwnProperty.call(key, k)) {
                        const v = key[k];
                        this.__SetData__(k, v);
                    }
                }
            }
            else if (_instanceof(key, DataObject) || key.isDataObject) {
                this.__SetData__(key.__ToData__());
            }
        }
        else if (isString(key)) {
            if (isObject(value)) {
                if (_instanceof(value, DataObject) || value.constructor !== Object) {
                    this.__SetDataObjectValue__(key, value);
                } else {
                    this.__SetDataObjectValue__(key, new DataObject(value));
                }
            } else {
                this.__SetDataObjectValue__(key, new DataObject(value));
            }
        }
        return this;
    },


    /**
     * 
     * @param {string} key 
     * @param {*} value gia tri
     * @returns {this}
     */
    __Set__: function set(key, value) {
        return this.__SetData__(key, value);
    },
    /**
     * Set giá trị
     * @param {string} key tên thuộc tính
     * @param {*} value giá trĩ
     * @returns {boolean}
     */
    __SetDataObjectValue__: function (key, value) {
        if (!isString(key)) return false;
        var self = this;
        var id = this.__ID__;
        var data = getObjectData(id);

        var vl = parseValue(value);
        var hasOwnProperty = Object.hasOwnProperty.call(data, key);
        if (!hasOwnProperty) {
            this.__AddSetGet__(key);
        }

        // them du lieu
        data[key] = vl;
        vl.__SetParent__(this);
        console.log(data);
        // dispatch một event change
        this.__DispatchChange__(key, vl);

        return true;
    },
    __SetParent__: function setParent(parent) {
        if (_instanceof(parent, DataObject) || _instanceof(parent)) {
            this.__SetProp__('__Parent__', parent);
        }
        return this;
    },
    __AddSetGet__: function(key) {

        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                return getObjectData(this.__ID__, key);
            },
            set: function (value) {
                var data = getObjectData(this.__ID__);
                var oldValue = data[key];
                var newValue = parseValue(value);
                var isTheSame = oldValue.__IsTheSame__(newValue);
                var s = dispatchObjectEvent(this, {
                    type: "checkbefore",
                    accessKey: key,
                    isTheSame: isTheSame,
                    isDifference: !isTheSame,
                    oldValue: oldValue,
                    newValue: newValue,
                    value: value
                });
                if (s !== false) {
                    newValue.__SetParent__(this);
                    data[key] = newValue;

                    var list = newValue.__GetEventAllChange__();
                    if(list && list.length){
                        for (let index = 0; index < list.length; index++) {
                            const ev = list[index];
                            ev.keys.unshift(key);
                        }
                    }
                    list.push({
                            id: this.__ID__,
                            keys: [key],
                            value: newValue,
                            target: this
                        }
                    )

                    if(!this.__Parent__){
                        this.__DispatchByList__(list);
                    }else{
                        this.__Parent__.__DispatchChangeFromChildren__(list);
                    }

                }


            }
        })
    },
    __DispatchChange__: function(key, value){
        if(!this.__Parent__){
            var s = dispatchObjectEvent(this, {
                type: "property.changed",
                accessKey: key,
                value: value
            });
        }else{
            this.__Parent__.__DispatchChangeFromChildren__([
                {
                    id: this.__ID__,
                    keys: [key],
                    value: value,
                    target: this
                }
            ]);
        }
    },
    __DispatchChangeFromChildren__: function(eventElements){
        var value = eventElements[eventElements.length-1].target;
        var ownerKey = this.__KeyOf__(value);
        if(ownerKey !== false){
            for (let i = 0; i < eventElements.length; i++) {
                const ev = eventElements[i];
                ev.keys.unshift(ownerKey);
            }
        }
        eventElements.push({
            id: this.__ID__,
            keys: [ownerKey],
            value: value,
            target: this
        })
        if(!this.__Parent__){
            this.__DispatchByList__(eventElements);
        }else{
            this.__Parent__.__DispatchChangeFromChildren__(eventElements);
        }
    },
    __DispatchByList__: function(eventList){
        console.log(eventList);
        if(!isArray(eventList) || !eventList.length) return;
        for (let index = 0; index < eventList.length; index++) {
            const event = eventList[index];
            event.accessKey = event.key?event.key: (event.keys?event.keys.join('.'): (event.indexes?event.indexes.join('.'): index));
            dispatchObjectEvent(this, event);
        }
    },
    __GetEventAllChange__: function(){
        var list = [];
        if(this.__Type__ == "DataObject"){
            var data = getObjectData(this.__ID__);
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const value = data[key];
                    const listEvent = value.__GetEventAllChange__();
                    for (let i = 0; i < listEvent.length; i++) {
                        const element = listEvent[i];
                        element.keys.unshift(key);
                        list.push(element);
                    }
                    list.push({
                        id: value.__ID__,
                        keys: [key],
                        value: value,
                        target: this
                    })
                }
            }
        }

        if(this.__Type__ == "DataArray"){
            var listEvent = this.__Array__.__GetEventAllChange__();
            if(listEvent.length){
                for (let index = 0; index < listEvent.length; index++) {
                    const element = listEvent[index];
                    list.push(element);
                }
            }
        }
        return list;
    },
    __AddEventListener__: function (key, handler){
        var self = this;
        if(typeof key == "function"){
            if(this.__Parent__){
                var thisKey = this.__Parent__.__KeyOf__(this);
                if(thisKey !== false){
                    this.__Parent__.__AddEventListener__(thisKey, key);
                }
            }else{
                if(this.__Type__ == "DataObject"){
                    var keys = this.__KEYS__;
                    if(keys.length){
                        keys.map(function(k){
                            self.__AddEventListener__(k, key);
                        });
                    }
                }
                else if(this.__Type__ == "DataArray"){
                    this.__Array__.__AddEventListener__(key);
                }
                else{
                    addObjectEvent(this.__ID__, ':changed', key);
                }
            }
        }
        else if((isString(key) || (isObject(key) && (key.isDataObject || key.isDataArray))) && isFunction(handler)){
            if(this.__Parent__){
                var thisKey = this.__Parent__.__KeyOf__(this);
                if(thisKey !== false){
                    var k = isString(key) ? key : this.__KeyOf__(key);
                    if(k !== false) {
                        this.__Parent__.__AddEventListener__(thisKey + "." + k, handler);
                    }
                    
                }
            }else{
                var k = isString(key) ? key : this.__KeyOf__(key);
                if(k !== false) addObjectEvent(this.__ID__, k, handler);
            }
        }
    },
    __KeyOf__: function(ownerValue){
        var data = getObjectData(this.__ID__);
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const value = data[key];
                if(ownerValue === value) return key;
            }
        }
        return false;
    },
    /**
     * 
     * @param {*} obj doi tuong cần kiểm tra
     * @returns {boolean}
     */
    __IsTheSame__: function (obj) {
        if (isObject(obj) && _instanceof(obj, DataObject)) {
            return obj.__Origin__ === this.__Origin__;
        }
        else if (isArray(obj)) {
            if (this.__Type__ === 'DataArray' && this.__Array__.__Origin__) return obj === this.__Array__.__Origin__;
        }
        return obj === this.__Origin__;
    },

    __ToData__: function () {
        var result = null;
        var t = this.__Type__;
        switch (t) {
            case 'DataObject':
                var d = getObjectData(this.__ID__);
                result = {};
                if (isObject(d)) {
                    for (const key in d) {
                        if (Object.hasOwnProperty.call(d, key)) {
                            const vl = d[key];
                            if (isObject(vl)) {
                                if (vl.isDataObject) {
                                    result[key] = vl.__ToData__();
                                }
                                else if (vl.isDataArray) {
                                    result[key] = vl.__ToArray__();
                                }
                                else {
                                    result[key] = vl;
                                }
                            }
                        }
                    }
                }
                else {
                    result = this.__Origin__;
                }
                break;

            case 'DataArray':
                result = this.__Array__.__ToArray__();
                break;


            default:
                result = this.__Origin__;

                break;
        }
        return result;
    }, 
    toString: function(){
        return this.__ToData__();
    }
});

export default DataObject;
export {DataObject, DataArray}