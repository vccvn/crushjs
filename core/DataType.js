import { assignValue, getArguments, getType, inArray, isArray, isCallable, isFunction, isNumber, isObject, isString, Str, _defineProperty, _instanceof } from "./helper.js";

/**
 * unique id
 */
var _uid = 0;
var arr = [];
var slice = arr.slice;

/**
 * Giá trị random
 * @var {string}
 */
var NO_VALUE = Str.rand();

var changeDataMethods = ['shift', 'unshift', 'pop', 'push', 'splice', 'sort'];
var mappingMethods = ['every', 'map', 'filter', 'forEach'];
var indexingMethods = ['indexOf', 'lastIndexOf', 'findIndex'];

var eventListenners = {};

function addEventListener(id, accessKey, callback) {
    if (typeof eventListenners[id] == "undefined") {
        eventListenners[id] = {};
    }
    if (typeof eventListenners[id][accessKey] == "undefined") {
        eventListenners[id][accessKey] = [];
    }
    eventListenners[id][accessKey].push(callback);
}
function removeEventListener(id, accessKey, callback) {
    if (!id || !eventListenners[id]) return false;
    if (!accessKey) eventListenners[id] = {};
    else if (!eventListenners[id][accessKey]) return false;
    else if (typeof callback != "function") eventListenners[id][accessKey] = [];
    else if (eventListenners[id][accessKey].indexOf(callback) == -1) return false;
    else eventListenners[id][accessKey][i].splice(eventListenners[id][accessKey].indexOf(callback), 1);
    return true;
}

function getEventEventListener(id, accessKey) {
    if (!id || !eventListenners[id]) return false;
    if (!accessKey) return eventListenners[id];
    else if (!eventListenners[id][accessKey]) return false;
    return eventListenners[id][accessKey];
}

function dispatchEvent(id, event) {
    if (!id || !eventListenners[id] || !isObject(event) || !event.accessKey || !eventListenners[id][event.accessKey] || !eventListenners[id][event.accessKey].length) return false;
    eventListenners[id][event.accessKey].map(function (fn) {
        if (typeof fn == "function") fn(event);
    });
}


function defConst(obj, key, value, options) {
    var opt = {
        enumerable: false,
        configurable: false
    };
    if (isObject(options)) {
        if (options.enumerable) {
            opt.enumerable = true;
        }
        if (typeof options.get == "function") {
            opt.get = options.get;
            // if(options.writable){
            //     opt.writable = true;
            // }
        }
        else {
            opt.value = Object.hasOwnProperty(options, 'value') ? options.value : value;
        }
    } else {
        opt.value = value;
    }
    Object.defineProperty(obj, key, opt);
}

function defProp(obj, key, value, options) {
    var opt = {
        enumerable: true,
        configurable: true
    };
    if (isObject(options)) {
        if (options.enumerable !== undefined) {
            opt.enumerable = options.enumerable ? true : false;
        }
        if (typeof options.get == "function") {
            opt.get = options.get;
            if (typeof options.set == "function") {
                opt.set = options.set;
            }
        }
        else {
            opt.value = Object.hasOwnProperty(options, 'value') ? options.value : value;
            if (options.writable) {
                opt.writable = true;
            }
        }
    } else {
        opt.value = value;
    }
    Object.defineProperty(obj, key, opt);
}


function getPrimitiveValue(value) {
    var Primitive = function Prim() { this.args = getArguments(arguments) };
    var events = {
        value: [],
        type: []
    };
    var parents = [];
    Primitive = function Primitive(newValue) {
        var type = getType(newValue);
        value = newValue;
        if (inArray(['array', 'object'])) {
            // changeValue(newValue);
            changeType(type);
        }
        else {
            changeValue(newValue);
        }

    };
    defConst(Primitive, 'isPrimitiveValue', true);
    defConst(Primitive, 'isPrimitiveData', true);
    defConst(Primitive, 'isPrimitive', true);

    defConst(Primitive, '__onChange__', function (fn) {
        if (typeof fn == "function") events.value.push(fn);
    });

    defConst(Primitive, '__addChangeEvent__', function (fn) {
        if (typeof fn == "function") {
            if (parents.length) {
                for (let index = 0; index < parents.length; index++) {
                    const parent = parents[index];
                    if (typeof parent.__addChangeEventFromChildren__ == "function") {
                        parent.__addChangeEventFromChildren__({
                            keys: [],
                            callback: fn,
                            target: Primitive
                        });
                    }
                }
            }
        }
    });





    defConst(Primitive, '__onChangeType__', function (fn) {
        if (typeof fn == "function") events.type.push(fn);
    });

    defConst(Primitive, '__toData__', function (fn) {
        if ((isObject(value) || isFunction(value)) && typeof value.__toData__ == "function") return value.__toData__();
        return value;
    });

    defConst(Primitive, 'toString', function (fn) {
        return this.__toData__();
    });


    defConst(Primitive, '__setParent__', function (parent) {
        if (isObject(parent) && (parent.isArrayData || parent.isObjectData)) {
            parents.push(parent);
        }
    });


    function changeType(type) {
        if (events.type.length) events.type.map(function (fn) {
            fn(type, value);
        });
    }
    function changeValue(valu) {
        if (events.value.length) events.value.map(function (fn) {
            fn(valu);
        });
    }

    return Primitive;
}

function getPrimitive(value) {
    var type = getType(value);
    var primitive = null;
    switch (type) {
        case 'number':
            primitive = new Number(value);
            break;
        case 'string':
            primitive = new String(value);
            break;
        case 'boolean':
            primitive = new Boolean(value);
            break;

        

        default:
            return getPrimitiveValue(value);
            break;
    }
    var events = {
        value: [],
        type: []
    };
    var parents = [];
    
    defConst(primitive, 'isPrimitiveValue', true);
    defConst(primitive, 'isPrimitiveData', true);
    defConst(primitive, 'isPrimitive', true);

    defConst(primitive, '__onChange__', function (fn) {
        if (typeof fn == "function") events.value.push(fn);
    });

    defConst(primitive, '__addChangeEvent__', function (fn) {
        if (typeof fn == "function") {
            if (parents.length) {
                for (let index = 0; index < parents.length; index++) {
                    const parent = parents[index];
                    if (typeof parent.__addChangeEventFromChildren__ == "function") {
                        parent.__addChangeEventFromChildren__({
                            keys: [],
                            callback: fn,
                            target: primitive
                        });
                    }
                }
            }
        }
    });



    defConst(primitive, '__onChangeType__', function (fn) {
        if (typeof fn == "function") events.type.push(fn);
    });


    
    defConst(primitive, '__toData__', function (fn) {
        if ((isObject(value) || isFunction(value)) && typeof value.__toData__ == "function") return value.__toData__();
        return value;
    });

    defConst(primitive, 'toString', function (fn) {
        return this.__toData__();
    });


    defConst(primitive, '__setParent__', function (parent) {
        if (isObject(parent) && (parent.isArrayData || parent.isObjectData)) {
            parents.push(parent);
        }
    });


    function changeType(type) {
        if (events.type.length) events.type.map(function (fn) {
            fn(type, value);
        });
    }
    function changeValue(valu) {
        if (events.value.length) events.value.map(function (fn) {
            fn(valu);
        });
    }

    return primitive;
}

function parseValue(value) {
    if ((isObject(value) && (value.isArrayData || value.isObjectData || value.isPrimitiveData)) || (isFunction(value) && value.isPrimitiveData)) return value;
    return isArray(value) ? (new ArrayData(value)) : (isObject(value) && value.constructor == Object ? (new ObjectData(value)) : getPrimitive(value));
}


var ArrayData = function ArrayData(inputData) {
    if (!_instanceof(this, ArrayData)) return new ArrayData(inputData);
    var self = this;
    var arrayLength = isArray(inputData) ? inputData.length : 0;
    var target = inputData;
    // this.length = arrayLength;
    var _data = [];
    var parents = [];
    var id = ++_uid;
    defConst(this, 'length', arrayLength, {
        get: function () { return arrayLength; }
    });
    defConst(this, 'id', id, {
        get: function () { return id; }
    });
    defConst(this, '__ID__', id, {
        get: function () { return id; }
    });

    var $methods = {
        indexOf: function (value) {
            for (let i = 0; i < _data.length; i++) {
                const vl = _data[i];
                if (value == vl || (isObject(vl) && ((vl.isArrayData || vl.isObjectData) && vl.__toData__() == value))) return i;
            }
            return -1;
        },
        lastIndexOf: function (value) {
            var index = -1;
            for (let i = 0; i < _data.length; i++) {
                const vl = _data[i];
                if (value == vl || (isObject(vl) && ((vl.isArrayData || vl.isObjectData) && vl.__toData__() == value))) index = i;
            }
            return index;
        },
        map: function (callback) {
            var ret = [];
            if (isFunction(callback)) {
                for (let i = 0; i < _data.length; i++) {
                    const vl = _data[i];
                    ret.push(callback(vl, i));
                }

            }
            return ret;
        },
        filter: function (callback) {
            var ret = [];
            if (isFunction(callback)) {
                for (let i = 0; i < _data.length; i++) {
                    const vl = _data[i];
                    if (callback(vl, i))
                        ret.push(vl);
                }

            }
            return ret;
        },
        forEach: function (callback) {
            var ret = [];
            if (isFunction(callback)) {
                for (let i = 0; i < _data.length; i++) {
                    const vl = _data[i];
                    if (callback(vl, i) === false)
                        break;
                    else
                        ret.push(vl);
                }

            }
            return ret;
        },
        findIndex: function (callback) {
            if (isFunction(callback)) {
                for (let i = 0; i < _data.length; i++) {
                    const vl = _data[i];
                    if (callback(vl, i))
                        return i;
                }

            }
            return -1;
        },
        toData: function toData() {
            var ret = [];
            for (let index = 0; index < _data.length; index++) {
                const vl = _data[index];
                const type = getType(vl);
                if (inArray(['array', 'function', 'object'], type) && typeof vl.__toData__ == "function") ret.push(vl.__toData__());
                else vl.push(vl);
            }
            return ret;
        },
        setParent: function (parent) {
            if (isObject(parent) || isArray(parent)) {
                index = parents.indexOf(parent);
                if (index == -1) {
                    parents.push(parents);
                }

            }
        },
        removeParent: function (parent) {
            var index = parents.indexOf(parent);
            if (index != -1) {
                parents.push(parents);
            }
        },
        dispatchEventFromChildren: function (eventElements) {
            var value = eventElements[eventElements.length - 1].target;
            var ownerKey = self.indexOf(value);
            if (ownerKey !== false && ownerKey != -1) {
                for (let i = 0; i < eventElements.length; i++) {
                    const ev = eventElements[i];
                    ev.keys.unshift(ownerKey);
                }
            }
            eventElements.push({
                id: self.id,
                keys: [ownerKey],
                value: value,
                target: self
            })
            if (!parents.length) {
                dispatchByList(eventElements);
            } else {
                var s = 0;
                for (let i = 0; i < parents.length; i++) {
                    const parent = parents[i];
                    if (typeof parent.__dispatchChangeFromChildren__ == "function") {
                        parent.__dispatchChangeFromChildren__(eventElements);
                        s++;
                    }
                }
                if (!s) dispatchByList(eventElements);
            }
        },
        addChangeEventFromChildren: function (listenner) {
            if (!(isObject(listenner) && typeof listenner.callback == "function" && listenner.target)) return false;
            var index = self.indexOf(listenner.target);
            if (index == -1) return false;
            var a = {
                keys: listenner.keys.slice(0),
                target: self,
                callback: listenner.callback
            }
            a.keys.unshift(index);
            if (!parents.length) {
                addEventListener(id, a.keys.join('.'), a.callback);
            } else {
                var s = 0;
                for (let i = 0; i < parents.length; i++) {
                    const parent = parents[i];
                    if (typeof parent.__addChangeEventFromChildren__ == "function") {
                        parent.__addChangeEventFromChildren__(a);
                        s++;
                    }
                }
                if (!s) addEventListener(id, a.keys.join('.'), a.callback);
            }
        },
        addChangeEvent: function (fn) {
            if (typeof fn == "function") {
                var s = 0;
                if (parents.length) {
                    for (let index = 0; index < parents.length; index++) {
                        const parent = parents[index];
                        if (typeof parent.__addChangeEventFromChildren__ == "function") {
                            parent.__addChangeEventFromChildren__({
                                keys: [],
                                callback: fn,
                                target: self
                            });
                            s++;
                        }
                    }
                }
                if (!s) {
                    for (let i = 0; i < _data.length; i++) {
                        const vl = _data[i];
                        if ((isObject(vl) || isFunction(vl)) && typeof vl.__addChangeEvent__ == "function") {
                            vl.__addChangeEvent__(fn);
                        }
                    }
                }
            }
        }
    };

    function changeValue(index, value) {
        var s = 0;
        if (parents.length) {
            for (let i = 0; i < parents.length; i++) {
                const parent = parents[i];
                if (isCallable(parent.__dispatchChangeFromChildren__)) {
                    parent.__dispatchChangeFromChildren__([
                        {
                            id: id,
                            value: value,
                            keys: [index],
                            target: self
                        }
                    ]);
                    s++;
                }
            }
        }
        if (!s) {
            dispatchEvent(id, {
                type: "prop.changed",
                value: value,
                accessKey: index,
                target: self
            })
        }

    }
    function dispatchByList(eventList) {
        if (!isArray(eventList) || !eventList.length) return;
        for (let index = 0; index < eventList.length; index++) {
            const event = eventList[index];
            event.accessKey = event.key ? event.key : (event.keys ? event.keys.join('.') : (event.indexes ? event.indexes.join('.') : index));
            dispatchEvent(id, event);
        }
    }
    function addElement(index, value) {
        // this.__$taget$__[index] = value;
        var vl = parseValue(value);
        changeValue(index, vl);
        
        if (!(index in self)) {
            self[index] = vl;
        }
        _data[index] = vl;
        if (_data[index].isPrimitiveData) {
            _data[index].__onChange__(function (v) {
                changeValue(index, v);
            });
            _data[index].__onChangeType__(function (t, v) {
                addElement(index, v);
            });
            vl.__setParent__(self);
        }
        defProp(self, index, vl, {
            get: function getter() {
                return _data[index];
            },
            set: function setter(value) {
                _data[index] = parseValue(value);
                changeValue(index, _data[index]);
                if (_data[index].isPrimitiveData) {
                    _data[index].__setParent__(self);
                    _data[index].__onChange__(function (v) {
                        changeValue(index, v);
                    });
                    _data[index].__onChangeType__(function (t, v) {
                        addElement(index, v);
                    });
                }

                target[index] = value;
            },
            configurable: true,
            enumerable: true
        });
        if (index == arrayLength) {
            arrayLength++;
        }
    }



    function addChangeDataMethod(method) {
        var fn = function () {
            var args = getArguments(arguments);
            // var f = Array.prototype[method];
            var str = "returnEls = target." + method + "(";
            for (let i = 0; i < args.length; i++) {
                str += (i ? ', ' : '') + "args[" + i + "]";
            }
            str += ');';
            var returnEls = undefined;
            eval(str);
            for (var i = 0; i < _data.length; i++) {
                // const element = _data[i];
                delete self[i];
            }
            _data.splice(0);
            arrayLength = target.length;
            for (var index = 0; index < target.length; index++) {
                addElement(index, target[index]);
            }

            return returnEls;
        }
        $methods[method] = fn;

    }

    changeDataMethods.map(function (m) {
        addChangeDataMethod(m);
    });

    function callMethod(method, args) {

        if (typeof $methods[method] == "function") {
            return $methods[method].apply(self, isArray(args) ? args : []);
        }
        return undefined;
    }
    defConst(self, '__call__', callMethod, {
        get: function () {
            return callMethod;
        }
    });



    if (isArray(inputData)) {
        for (let index = 0; index < inputData.length; index++) {
            const value = inputData[index];
            addElement(index, value);
        }
    }






}
ArrayData.prototype = {
    isArrayData: true,
    constructor: ArrayData,
    toArray: function () {
        return this.__call__('toData', []);
    },
    toData: function () {
        return this.__call__('toData', []);
    },
    __toData__: function () {
        return this.__call__('toData', []);
    },
    toString: function () {
        return JSON.stringify(this.__toData__());
    },
    __keyOf__: function (value) {
        return this.indexOf(value);
    },
    __onChange__: function (fn) {

    },
    __dispatchChangeFromChildren__: function () {
        var params = ["dispatchChangeFromChildren", getArguments(arguments)];
        return this.__call__.apply(this, params);
    },
    __addChangeEventFromChildren__: function () {
        var args = getArguments(arguments);
        return this.__call__('addChangeEventFromChildren', args);
    },
    __addChangeEvent__: function (fn) {
        return this.__call__('addChangeEvent', fn);
    }



};

changeDataMethods.map(function (m) {
    ArrayData.prototype[m] = function () {
        var args = getArguments(arguments);
        var params = [m, args];
        return this.__call__.apply(this, params);
    }
})
mappingMethods.map(function (m) {
    ArrayData.prototype[m] = function () {
        var args = getArguments(arguments);
        var params = [m, args];
        return this.__call__.apply(this, params);
    }
})
indexingMethods.map(function (m) {
    ArrayData.prototype[m] = function () {
        var args = getArguments(arguments);
        var params = [m, args];
        return this.__call__.apply(this, params);
    }
})

var ObjectData = function ObjectData(dataValue) {
    if (!_instanceof(this, ObjectData)) return new ObjectData(dataValue);
    var self = this;
    if (isArray(dataValue)) {
        var arrayLength = dataValue.length;
        defConst(this, '__type__', 'array');
        defConst(this, 'length', arrayLength, {
            get: function () { return arrayLength; }
        });
        defConst(this, 'slice', arr.slice);
        defConst(this, 'toArray', function () {
            return slice.call(this);
        });


    }
}

export default ObjectData;
export { ArrayData, ObjectData }