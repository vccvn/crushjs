'use strict';



// var Helper;
var global = this || window;
function Helper() {
    this.e = 0;
};
function addToGlobal(name, value) {
    global[name] = value;
}

// console log
var cl = function () {
    console.log.apply(console, arguments);
};


// mang
var arr = [];

var document = window.document;

var div = document.createElement("div");

// var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var createElement = document.createElement;


// var $$;
if (typeof Object.assign != 'function') {

    Object.assign = function (target, varArgs) { // .length của function là 2
        'use strict';
        if (target == null) { // TypeError nếu undefined hoặc null
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Bỏ qua nếu undefined hoặc null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}


var isFunction = function isFunction(obj) {

    // Support: Chrome <=57, Firefox <=52
    // In some browsers, typeof returns "function" for HTML <object> elements
    // (i.e., `typeof document.createElement( "object" ) === "function"`).
    // We don't want to classify *any* DOM node as a function.
    return typeof obj === "function" && typeof obj.nodeType !== "number";
};

var isCallable = function (variable) {
    return typeof variable === "function";
};

/**
 * lấy kiểu giá trị của biến
 * @param {*} obj
 * @return {string}
 */
var getType = function (obj) {
    var t = 'null';
    var type = typeof obj;
    if (type == 'object') {
        if (obj === null) {
            t = 'null';
        } else if (obj.constructor == FormData) {
            t = 'formdata';
        } else if (obj.constructor == Array) {
            t = 'array';
        } else if (obj.constructor == Object) {
            t = 'object';
        } else if (obj.constructor == Number) {
            t = 'number';
        } 
        else if(obj.isPrimitive){
            t = "primitive";
        }
        else {

            t = 'object';
        }
    } else if(type == "function"){
        if(obj.isPrimitive){
            t = "primitive";
        }
        else {
            t = type;
        }
    }
    else {
        t = type;
    }
    return t;
};
/**
 * kiềm tra có phải chuỗi
 * @param {*} variable biến bất kỳ
 */
var isString = function isString(variable) {
    var type = getType(variable);
    return type == "string" || (type == "number" && !isNaN(variable));
}
/**
 * kiềm tra có phải null
 * @param {*} variable biến bất kỳ
 */
var isNull = function isNull(variable) {
    var t = getType(variable);
    return t == "null" || (t == "primitive" && variable.isNull);
}
/**
 * kiềm tra có phải array
 * @param {*} variable biến bất kỳ
 */
var isArray = function isArray(variable) {
    return getType(variable) == "array";
}
/**
 * kiềm tra có phải object
 * @param {*} variable biến bất kỳ
 */
var isObject = function isObject(variable) {
    return getType(variable) == "object";
}
/**
 * kiềm tra có phải number
 * @param {*} variable biến bất kỳ
 */
 var isNumber = function isNumber(variable) {
    var type = getType(variable);
    return ((type === "number" || type === "string") && !isNaN(variable - parseFloat(variable))) || (type === "primitive" && variable.isNumber);
}
/**
 * kiềm tra có phải loat
 * @param {*} variable biến bất kỳ
 */
 var isFloat = function isFloat(variable) {
    var type = getType(variable);
    return ((type === "number" || type === "string") && !isNaN(variable - parseFloat(variable))) || (type === "primitive" && isNumber(variable.__toData__()));
}

/**
 * kiềm tra có phải number
 * @param {*} variable biến bất kỳ
 */
var isInteger = function isInteger(variable) {
    return isNumber(variable) && String(parseInt(variable.toString())) == String(variable);
}


/**
 * kiềm tra có phải boolean
 * @param {*} variable biến bất kỳ
 */
 var isBoolean = function isBoolean(variable) {
    var type = getType(variable)
    return (type  == "boolean") || (type == "primitive" && variable.isBoolean);
}

/**
 * kiềm tra có phải Formdata
 * @param {*} variable biến bất kỳ
 */
var isFormData = function isFormData(variable) {
    return getType(variable) == "formdata";
}

/**
 * kiềm tra có phải boolean
 * @param {*} variable biến bất kỳ
 */
 var isUndefined = function isUndefined(variable) {
    var type = getType(variable);
    return (type == "undefined") || (type == "primitive" && variable.isUndefined);
}

var isTrue = function isTrue(variable){
    return isBoolean(variable) && variable == true;
}
var isFalse = function isFalse(variable){
    return isBoolean(variable) && variable == false;
}

/**
 * kiềm tra có phải chuỗi
 * @param {*} variable biến bất kỳ
 */
var isEmail = function isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

var checkEmptyType = {
    object: function (object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    },
    array: function (ar) { return ar.length == 0; },
    string: function (ar) { return ar.length == 0; }
};
var isEmpty = function (any) {

    if (typeof any == "undefined") return true;
    // console.log(any.constructor)
    var type = getType(any);

    return typeof checkEmptyType[type] == "function" ? checkEmptyType[type](any) : (!any);
}
var emptyFunc = function () { };

/**
 *
 * @param {object} dst
 * @param {object} src
 * @returns {object}
 */
var merge = function (dst, src) {
    if (!dst || !isObject(dst)) dst = {};
    var to = Object(dst);
    var srclength = arguments.length;
    for (var i = 1; i < srclength; i++) {
        var srcObj = arguments[i];
        if (isObject(srcObj)) {
            for (var key in srcObj) {
                if (srcObj.hasOwnProperty(key)) {
                    var val = srcObj[key];
                    if ((isObject(val) || isArray(val)) && !isFormData(val) && val.constructor != CrazyXHR && val.constructor != CrazyAJAX && val.constructor != Promise) {
                        var d = {};
                        to[key] = merge(d, val);
                    } else {
                        to[key] = val;
                    }
                }
            }
        }
    }
    return dst;
}

/**
 * sao chép toàn bộ thuộc tính của một object sang 1 onject mới
 * @param {object} src
 * @returns {object}
 */
var deepCopy = function (src) {
    var dst = {};
    var srclength = arguments.length;
    for (var i = 0; i < srclength; i++) {
        var srcObj = arguments[i];
        if (isArray(srcObj) && srclength == 1) {
            dst = [];
            for (var j = 0; j < srcObj.length; j++) {
                var val = srcObj[i];
                if (((isObject(val) && val.constructor == Object) || isArray(val)) && !isFormData(val)) {
                    dst[j] = deepCopy(val);
                }
                else {
                    dst[j] = val;
                }
            }
        }
        else if (isObject(srcObj) && srcObj.constructor == Object) {
            for (var key in srcObj) {
                if (srcObj.hasOwnProperty(key)) {
                    var val = srcObj[key];
                    if (((isObject(val) && val.constructor == Object) || isArray(val)) && !isFormData(val) && val.constructor != Object) {
                        dst[key] = deepCopy(val);
                    }
                    else {
                        dst[key] = val;
                    }
                }
            }
        }
    }
    return dst;
};

/**
 * sao chep gia tri trong mang
 * @param {array|object} src mang doi tuong  can sao chep
 */
var copyArray = function (src) {
    var arr = [];
    var t = getType(src);
    if (t == 'object' || t == 'array') {
        if (src.length) {
            for (var index = 0; index < src.length; index++) {
                if (typeof src[index] != "undefined") {
                    arr.push(src[index]);
                }
            }
        } else if (t == 'object') {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    var item = src[key];
                    arr.push(item);
                }
            }
        }
    }
    return arr;
};


var combine = function combine(list) {
    var sth = function (lst, i) {
        if (!i) i = 0;
        var ls = [];
        if (lst.length <= i) return [];
        var arr = lst[i];
        arr.map(function (c) {
            var s = c;
            if (i < lst.length - 1) {
                var tl = sth(lst, i + 1);
                if (tl.length) {
                    tl.map(function (t) {
                        ls.push(c + "" + t);
                    });
                } else {
                    ls.push(c);
                }
            } else {
                ls.push(c);
            }
        });
        return ls;
    };
    return sth(list);
};


var objectKeys = function (obj) {
    var keys = [];
    if (isArray(obj) || isObject(obj)) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
    }
    return keys;
};
var objectValues = function (obj) {
    var values = [];
    if (isArray(obj) || isObject(obj)) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                values.push(obj[key]);
            }
        }
    }
    return values;
};

var isProperty = function isProperty(object, key) {
    return Object.hasOwnProperty.call(object, key);
}
var isMethod = function isisMethod(object, key) {
    return typeof object[key] == "function";
}

/**
 * kiểm tra giá trị có trong mảng / object hay không
 * @param {array} arr mảng
 * @param {*} value
 * @returns {boolean}
 */
var hasValue = function hasValue(arr, value, checkType) {
    if (typeof arr == "undefined") return false;
    var t = getType(arr);
    if (t == 'array') {
        if (checkType == true) {
            for (var index = 0; index < arr.length; index++) {
                var v = arr[index];
                if (v === value) return true;
            }
        } else {
            return arr.indexOf(value) >= 0;
        }
    } else if (t == 'object') {
        if (checkType) {
            for (var key in arr) {
                if (arr.hasOwnProperty(key)) {
                    var v = arr[key];
                    if (v === value) {
                        return true;
                    }
                }
            }
        } else {
            for (var key in arr) {
                if (arr.hasOwnProperty(key)) {
                    var v = arr[key];
                    if (v == value) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

/**
 * kiểm tra giá trị có trong mảng / object hay không
 * @param {array} arr mảng
 * @param {*} value
 * @returns {boolean}
 */
var inArray = function inArray(arr, value, checkType) {
    if (typeof arr == "undefined") return false;
    var t = getType(arr);
    if (t != "array" && t != "object" && (isArray(value) || isObject(value))) {
        var c = arr;
        arr = value;
        value = c;
        t = getType(arr);
    }
    if (t == 'array') {
        if (checkType == true) {
            for (var index = 0; index < arr.length; index++) {
                var v = arr[index];
                if (v === value) return true;
            }
        } else {
            return arr.indexOf(value) >= 0;
        }
    } else if (t == 'object') {
        if (checkType) {
            for (var key in arr) {
                if (arr.hasOwnProperty(key)) {
                    var v = arr[key];
                    if (v === value) {
                        return true;
                    }
                }
            }
        } else {
            for (var key in arr) {
                if (arr.hasOwnProperty(key)) {
                    var v = arr[key];
                    if (v == value) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

var cutWithout = function cutWithout(obj, keys) {
    var newObj = {};
    if (isArray(obj) || isObject(obj)) {
        var list = [];
        if (isArray(keys)) list = keys;
        else if (isObject(keys)) {
            for (var key in keys) {
                if (keys.hasOwnProperty(key)) {
                    list.push(keys[key]);
                }
            }
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (!inArray(list, key)) {
                    newObj[key] = obj[key];
                }
            }
        }
    }
    return newObj;
}

var copyWithout = function copyWithout(obj, keys) {
    var newObj = {};
    if (isArray(obj) || isObject(obj)) {
        var list = [];
        if (isArray(keys)) list = keys;
        else if (isObject(keys)) {
            for (var key in keys) {
                if (keys.hasOwnProperty(key)) {
                    list.push(keys[key]);
                }
            }
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (!inArray(list, key)) {
                    newObj[key] = obj[key];
                }
            }
        }
    }
    return newObj;
};


var copyByList = function copyByList(obj, keys) {
    var newObj = {};
    if (isArray(obj) || isObject(obj)) {
        var list = [];
        if (isArray(keys)) list = keys;
        else if (isObject(keys)) {
            for (var key in keys) {
                if (keys.hasOwnProperty(key)) {
                    var v = keys[key];
                    list.push(key);
                }
            }
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (inArray(list, key)) {
                    newObj[key] = obj[key];
                }
            }
        }
    }
    return newObj;
};

/**
 * kiểm tra toàn bộ kiểu dử liệu của các phần tử con
 * @param {string} type kiểu dử liệu
 * @param {array} object đối tượng cần kiểm tra
 */
var checkAllElementType = function checkAllElementType(type, object) {
    if (!(isString(type) || isArray(type)) || !(isArray(object) || isObject(object))) {
        return false;
    }
    var types = [];
    if (!isArray(type)) types = [type];
    else types = type.slice(0);
    var checked = false;
    if (isArray(object)) return object.length && object.length == object.filter(function (value) { return types.indexOf(getType(value)) >= 0; }).length;
    for (var key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            if (types.indexOf(getType(object[key])) < 0) return false;
            checked = true;
        }
    }
    return checked;

}
/**
 * trổn 2 mảng thành mảng kết hợp mới
 * @param {array[]} arrayArr mảng chứa các phần tử con là 1 mảng
 * @param {any[]} arrayAny mảng chứa các phần tử con có kiểu dử liệu là string hoặc number
 * @returns {array[]}
 */
var combineTwoArray = function combineTwoArray(arrayArr, arrayAny) {
    var newArr = [];
    for (var i = 0; i < arrayArr.length; i++) {
        var arr = arrayArr[i];

        for (var j = 0; j < arrayAny.length; j++) {
            var any = arrayAny[j];
            var v = arr.slice(0);
            v.push(any);
            newArr.push(v);
        }
    }
    return newArr;
};


/**
 * lấy tổ hợp các các phần từ com
 * @param {array} arr1 
 * @param {array} arr2 
 */
var combineElenentsToArrList = function combineElenentsToArrList(arr1, arr2) {
    var arrayList = [];
    for (var index = 0; index < arguments.length; index++) {
        var arg = arguments[index];
        if (!isArray(arg) || !checkAllElementType(['string', 'number'], arg)) return [];

        arrayList.push(arg);
    }
    if (arrayList.length < 2) return arr1;
    var results = [];
    arrayList[0].map(function (str) {
        results.push([str]);
    });
    for (var i = 1; i < arrayList.length; i++) {
        var arr = arrayList[i];
        results = combineTwoArray(results, arr);
    }

    return results;
};

/**
 * trộn 2 hoặc nhiều mảng thành mảng tổ hợp các phần tử dược nối với nhau bằng delimiter
 * @param {string} deliniter ký tự nối
 * @param {string[]} arr1 mảng 1
 * @param {string[]} arr2 mảng 2
 * @param {string[]} ...arrN mảng 2
 * 
 * @returns {string[]}
 */
var combineElenentsJoinStringList = function combineElenentsJoinStringList(deliniter, arr1, arr2) {
    var arrayList = [];
    for (var index = 1; index < arguments.length; index++) {
        var arg = arguments[index];

        if (!isArray(arg) || !checkAllElementType(['string', 'number'], arg)) return [];

        arrayList.push(arg);
    }
    if (arrayList.length < 2) return arr1;
    var results = combineElenentsToArrList.apply(null, arrayList);
    if (!isString(deliniter)) deliniter = '';
    return results.map(function (arr) {
        return arr.join(deliniter);
    });
}



var documentReady = function () {
    if (document.readyState !== 'complete') return;
    return true;


};

var isGlobalOrRoot = function (obj) {
    return obj == global || obj == document;
};

/**
 * so sánh giá trị bên trong 2 đối tượng
 * @param {object} left đối tượng muốn so sánh
 * @param {object} right đối tượng dùng để so sánh
 * @param {undefined|string} k prefix key
 * @param {undefined|array} list kết quả so sánh. rỗng nghĩa là không có khax1 biệt
 * @returns {array}
 */
var compareObject = function compareObject(left, right, k, list) {
    if (!k) k = "";
    if (k) k = k + ".";
    if (list) list = [];
    if (typeof left != "object" || typeof right != "object") {
        list.push({
            key: k,
            value_left: left,
            value_right: right
        });
    }
    for (var key in left) {

        if (left.hasOwnProperty(key)) {
            var vl = left[key];
            if (!right || typeof right[key] != typeof vl) {
                list.push({
                    key: k + key,
                    value_left: vl,
                    value_right: right[key]
                });
            } else if ((isObject(vl) || isArray(vl)) && isObject(right[key]) || isArray(right[key])) {
                list = compareObject(vl, right[key], k + key, list);
            } else if (vl != right[key]) {

                list.push({
                    key: k + key,
                    value_left: vl,
                    value_right: right[key]
                });
            }

        }
    }
}

/**
 * lay ra gia tri nho nhat
 * @param {array|object} obj doi tuong mang chua cac gia tri 
 */
var minOf = function minOf(obj) {
    var min = NaN;
    if (arguments.length > 1 && !(isArray(obj) || isObject(obj))) {
        obj = copyArray(arguments);
    }
    if (isArray(obj)) {
        for (var index = 0; index < obj.length; index++) {
            if (!isNumber(obj[index])) continue;
            var n = Number(obj[index]);

            if (isNaN(min) || !index)
                min = n;
            else if (n < min) min = n;
        }
    }
    else if (isObject(obj)) {
        var index = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (!isNumber(obj[index])) continue;
                else {
                    var n = Number(obj[index]);
                    if (isNaN(min) || !index) min = n;
                    else if (n < min) min = n;
                }
                index++;
            }
        }
    }
    return min;
};

/**
 * lay ra gia tri lon nhat
 * @param {array|object} obj doi tuong mang chua cac gia tri 
 */
var maxOf = function maxOf(obj) {
    var min = NaN;
    if (arguments.length > 1 && !(isArray(obj) || isObject(obj))) {
        obj = copyArray(arguments);
    }
    if (isArray(obj)) {
        for (var index = 0; index < obj.length; index++) {
            if (!isNumber(obj[index])) continue;
            else {
                var n = Number(obj[index]);
                if (isNaN(min) || !index) min = n;
                else if (n > min) min = n;
            }
        }
    }
    else if (isObject(obj)) {
        var index = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (!isNumber(obj[index])) continue;
                else {
                    var n = Number(obj[index]);
                    if (isNaN(min) || !index) min = n;
                    else if (n > min) min = n;
                }
                index++;
            }
        }
    }
    return min;
};

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
};

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
};

function _defineProperties(target, props) {
    if (isArray(props)) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    else if (isObject(props)) {
        for (var key in props) {
            if (Object.hasOwnProperty.call(props, key)) {
                var val = props[key];
                Object.defineProperty(target, key, val);
            }
        }
    }

};

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
};

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
};

var checkType = function checkType(type, value, absolultely) {
    if (typeof type !== "string" || !type) return false;
    var tl = type.toLowerCase();
    if (tl == "float") tl = 'number';
    if (tl == 'mixed') return true;
    var t = type.substr(0, 1).toUpperCase() + type.substr(1).toLowerCase();

    if (typeof Helper['is' + t] == "function") {
        return Helper['is' + t].call(Helper, value);
    }
    var t2 = getType(value);

    return absolultely ? t2 === tl : t2 == tl;
};
checkType.bind(Helper);


/**
 * Kiểm tra tồn tại key hay ko?
 * @param {*} obj doi tuong can kiem tra
 * @param {string} key 
 * @returns {boolean}
 */
function objectHasKey(obj, key) {
    return (isObject(obj) && isString(key) && Object.hasOwnProperty.call(obj, key));
}

/**
 * kiểm tra sự tồn tại của thuộc tinh thông qua key và kiểu giá trị
 * @param {*} obj doi tuong can kiem tra
 * @param {string} key danh sach key kem kiey gia tri
 * @param {string} type kieu gia tri
 * @returns {boolean}
 */
var objectHasProperty = function objectHasElement(obj, key, type) {
    if(!isObject(obj) || isEmpty(obj) || typeof key == "undefined" || (!isString(key) && !isArray(key))) return false;
    var keys = isArray(key) ? key : [key + (isString(type)?":"+type:"")];
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var ks = k.split(':');
        var kv = ks[0];
        if(!objectHasKey(obj, kv)) return false;
        if(ks.length == 2){
            var b = ks[1].split('|').map(function(t){return t.trim();}).filter(function(vl){return vl.length > 0;});
            if(b.length && !inArray(b, getType(obj[kv]))) return false;
        }
    }
    return true;
}

/**
 * joi các mảng vào làm một
 * @param {string[]|number[]} target mảng đầu vào cần join
 * @returns {array}
 */
function arrayJoin(target) {
    if(!isArray(target)) target = [];
    function addToTarget(arr) {
        arr.map(function(vl){
            if(target.indexOf(vl) === -1){
                target.push(vl);
            }
        })
    }
    for (let i = 1; i < arguments.length; i++) {
        const arg = arguments[i];
        if(isArray(arg)) addToTarget(arg);
        else if(isObject(arg)) addToTarget(objectValues(arg));
        else addToTarget(arg);
    }
    return target;
}





// Helper.isReady = function () {
//     return background.documentReady;
// };
Helper.setDefault = function (object, data) {
    if (!data || typeof data == 'undefined') return;
    for (var key of object.init_list) {
        if (typeof data[key] != 'undefined') {
            var d = data[key];
            var t = this.getType(d);

            var t2 = (typeof (object[key]) != 'undefined') ? this.getType(object[key]) : "string";
            if ((t == 'array' && t2 == 'array') || (t == 'object' && t2 == 'object')) {
                for (var k in d) {
                    var v = d[k];
                    object[key][k] = v;
                }
            } else {
                object[key] = d;
            }
        }
    }
    return object;
};



var getEl = function (obj, key, delimiter) {
    if (typeof obj == 'undefined') {
        return null;
    }
    if (typeof key == 'undefined') {
        return obj;
    }
    var tpo = getType(obj);
    var tpk = getType(key);
    if (tpo == 'array') {
        var k = NaN;
        if (tpk == 'number') {
            k = key;
        } else if (parseInt(key) != NaN) {
            k = parseInt(key);
        }
        if (!isNaN(k)) {
            if (typeof obj[k] != 'undefined') {
                return obj[k];
            }
        }
    } else if (tpo == 'object' || obj == App) {
        if (tpk == 'number') {
            if (typeof obj[key] != 'undefined') {
                return obj[key];
            }
        } else if (tpk == 'string') {
            if (typeof delimiter == 'undefined') {
                delimiter = '.';
            } else {
                var t = getType(delimiter);
                if (t != 'string' && t != 'number') {
                    delimiter = '.';
                }
            }
            var _keys = key.split(delimiter);
            var d = obj;
            for (var i = 0; i < _keys.length; i++) {
                var k = _keys[i];
                if (typeof d[k] != 'undefined') {
                    d = d[k];
                } else {
                    d = null;
                    i += _keys.length;
                }
            }
        }
        return d;
    }
    return null;
};

var Num = {
    rand: function (from, to) {
        if (!from) from = 0;
        if (!to) to = 0;
        if (from == 0) to++;
        var rand = Math.floor(Math.random() * to) + from;
        return rand;
    },
    currency: function (x) {
        return x.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1\.");
    }
};

var convertedArray = [];

var Str = {
    html_char_raw: ['%', '&', '=', '?', '#', '+', ':', '/', ' ', '\n', '{', '}'],
    html_char_enc: ['%25', '%26', '%3D', '%3F', '%23', '%2B', '%3A', '%2F', '+', '%0D%0A', '%7B', '%7D'],
    urlcode: { '%': '%25', '&': '%26', '=': '%3D', '?': '%3F', '#': '%23', '+': '%2B', ':': '%3A', '/': '%2F', ' ': '%20', '\n': '%0D%0A', '{': '%7B', '}': '%7D' },
    unicode: {
        js: ["\\u00e0", "\\u00e1", "\\u1ea1", "\\u1ea3", "\\u00e3", "\\u00e2", "\\u1ea7", "\\u1ea5", "\\u1ead", "\\u1ea9", "\\u1eab", "\\u0103", "\\u1eb1", "\\u1eaf", "\\u1eb7", "\\u1eb3", "\\u1eb5", "\\u00e8", "\\u00e9", "\\u1eb9", "\\u1ebb", "\\u1ebd", "\\u00ea", "\\u1ec1", "\\u1ebf", "\\u1ec7", "\\u1ec3", "\\u1ec5", "\\u00ec", "\\u00ed", "\\u1ecb", "\\u1ec9", "\\u0129", "\\u00f2", "\\u00f3", "\\u1ecd", "\\u1ecf", "\\u00f5", "\\u00f4", "\\u1ed3", "\\u1ed1", "\\u1ed9", "\\u1ed5", "\\u1ed7", "\\u01a1", "\\u1edd", "\\u1edb", "\\u1ee3", "\\u1edf", "\\u1ee1", "\\u00f9", "\\u00fa", "\\u1ee5", "\\u1ee7", "\\u0169", "\\u01b0", "\\u1eeb", "\\u1ee9", "\\u1ef1", "\\u1eed", "\\u1eef", "\\u1ef3", "\\u00fd", "\\u1ef5", "\\u1ef7", "\\u1ef9", "\\u0111", "\\u00c0", "\\u00c1", "\\u1ea0", "\\u1ea2", "\\u00c3", "\\u00c2", "\\u1ea6", "\\u1ea4", "\\u1eac", "\\u1ea8", "\\u1eaa", "\\u0102", "\\u1eb0", "\\u1eae", "\\u1eb6", "\\u1eb2", "\\u1eb4", "\\u00c8", "\\u00c9", "\\u1eb8", "\\u1eba", "\\u1ebc", "\\u00ca", "\\u1ec0", "\\u1ebe", "\\u1ec6", "\\u1ec2", "\\u1ec4", "\\u00cc", "\\u00cd", "\\u1eca", "\\u1ec8", "\\u0128", "\\u00d2", "\\u00d3", "\\u1ecc", "\\u1ece", "\\u00d5", "\\u00d4", "\\u1ed2", "\\u1ed0", "\\u1ed8", "\\u1ed4", "\\u1ed6", "\\u01a0", "\\u1edc", "\\u1eda", "\\u1ee2", "\\u1ede", "\\u1ee0", "\\u00d9", "\\u00da", "\\u1ee4", "\\u1ee6", "\\u0168", "\\u01af", "\\u1eea", "\\u1ee8", "\\u1ef0", "\\u1eec", "\\u1eee", "\\u1ef2", "\\u00dd", "\\u1ef4", "\\u1ef6", "\\u1ef8", "\\u0110"],
        vi: ["\u00e0", "\u00e1", "\u1ea1", "\u1ea3", "\u00e3", "\u00e2", "\u1ea7", "\u1ea5", "\u1ead", "\u1ea9", "\u1eab", "\u0103", "\u1eb1", "\u1eaf", "\u1eb7", "\u1eb3", "\u1eb5", "\u00e8", "\u00e9", "\u1eb9", "\u1ebb", "\u1ebd", "\u00ea", "\u1ec1", "\u1ebf", "\u1ec7", "\u1ec3", "\u1ec5", "\u00ec", "\u00ed", "\u1ecb", "\u1ec9", "\u0129", "\u00f2", "\u00f3", "\u1ecd", "\u1ecf", "\u00f5", "\u00f4", "\u1ed3", "\u1ed1", "\u1ed9", "\u1ed5", "\u1ed7", "\u01a1", "\u1edd", "\u1edb", "\u1ee3", "\u1edf", "\u1ee1", "\u00f9", "\u00fa", "\u1ee5", "\u1ee7", "\u0169", "\u01b0", "\u1eeb", "\u1ee9", "\u1ef1", "\u1eed", "\u1eef", "\u1ef3", "\u00fd", "\u1ef5", "\u1ef7", "\u1ef9", "\u0111", "\u00c0", "\u00c1", "\u1ea0", "\u1ea2", "\u00c3", "\u00c2", "\u1ea6", "\u1ea4", "\u1eac", "\u1ea8", "\u1eaa", "\u0102", "\u1eb0", "\u1eae", "\u1eb6", "\u1eb2", "\u1eb4", "\u00c8", "\u00c9", "\u1eb8", "\u1eba", "\u1ebc", "\u00ca", "\u1ec0", "\u1ebe", "\u1ec6", "\u1ec2", "\u1ec4", "\u00cc", "\u00cd", "\u1eca", "\u1ec8", "\u0128", "\u00d2", "\u00d3", "\u1ecc", "\u1ece", "\u00d5", "\u00d4", "\u1ed2", "\u1ed0", "\u1ed8", "\u1ed4", "\u1ed6", "\u01a0", "\u1edc", "\u1eda", "\u1ee2", "\u1ede", "\u1ee0", "\u00d9", "\u00da", "\u1ee4", "\u1ee6", "\u0168", "\u01af", "\u1eea", "\u1ee8", "\u1ef0", "\u1eec", "\u1eee", "\u1ef2", "\u00dd", "\u1ef4", "\u1ef6", "\u1ef8", "\u0110"],
        en: ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "i", "i", "i", "i", "i", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "y", "y", "y", "y", "y", "d", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "I", "I", "I", "I", "I", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "U", "U", "U", "U", "U", "U", "U", "U", "U", "U", "U", "Y", "Y", "Y", "Y", "Y", "D"],
        upper: ["À", "Á", "Ạ", "Ả", "Ã", "Â", "Ầ", "Ấ", "Ậ", "Ẩ", "Ẫ", "Ă", "Ằ", "Ắ", "Ặ", "Ẳ", "Ẵ", "È", "É", "Ẹ", "Ẻ", "Ẽ", "Ê", "Ề", "Ế", "Ệ", "Ể", "Ễ", "Ì", "Í", "Ị", "Ỉ", "Ĩ", "Ò", "Ó", "Ọ", "Ỏ", "Õ", "Ô", "Ồ", "Ố", "Ộ", "Ổ", "Ỗ", "Ơ", "Ờ", "Ớ", "Ợ", "Ở", "Ỡ", "Ù", "Ú", "Ụ", "Ủ", "Ũ", "Ư", "Ừ", "Ứ", "Ự", "Ử", "Ữ", "Ỳ", "Ý", "Ỵ", "Ỷ", "Ỹ", "Đ"],
        lower: ["à", "á", "ạ", "ả", "ã", "â", "ầ", "ấ", "ậ", "ẩ", "ẫ", "ă", "ằ", "ắ", "ặ", "ẳ", "ẵ", "è", "é", "ẹ", "ẻ", "ẽ", "ê", "ề", "ế", "ệ", "ể", "ễ", "ì", "í", "ị", "ỉ", "ĩ", "ò", "ó", "ọ", "ỏ", "õ", "ô", "ồ", "ố", "ộ", "ổ", "ỗ", "ơ", "ờ", "ớ", "ợ", "ở", "ỡ", "ù", "ú", "ụ", "ủ", "ũ", "ư", "ừ", "ứ", "ự", "ử", "ữ", "ỳ", "ý", "ỵ", "ỷ", "ỹ", "đ"]
    },
    clearUnicode: function (str) {
        return this.replace(str, this.unicode.vi, this.unicode.en);
    },
    isSN: function (str) {
        if (typeof str == 'undefined') return null;
        var t = getType(str);
        if (t == 'string' || t == 'number') return true;
        return false;
    },
    /**
     * thay the chuoi trong chuoi bang mot chuoi =)))))
     * @param {string} str  chuoi dau vao
     * @param {string|object|array} find  tham so tim kiem
     * @param {string|object|array} replace  tham so thay the
     */
    replace: function () {
        var a = arguments;
        var t = a.length;
        if (t == 0) return '';
        if (typeof a[0] != 'string' || t < 2) {
            return a[0];
        }
        var str = a[0];

        var b = getType(a[1]);
        if (this.isSN(a[1])) {
            if (t >= 3 && this.isSN(a[2])) {
                var obj = {};
                obj[a[1]] = a[2];
                str = this.replaceByObj(str, obj);
            }
        } else if (b == 'array') {
            if (t >= 3 && getType(a[2]) == 'array') {
                str = this.replaceByArr(str, a[1], a[2]);
            } else if (t >= 3 && getType(a[2]) == 'string') {
                var obj = {},
                    val = a[2];
                var d = a[1];
                for (var k in d) {
                    obj[d[k]] = val;
                }
                str = this.replaceByObj(str, obj);
            }
        } else if (b == 'object') {
            str = this.replaceByObj(str, a[1]);
        }
        return str;
    },
    replaceByArr: function () {
        var a = arguments;
        var t = a.length;
        if (t == 0) return '';
        if (typeof a[0] != 'string' || t < 2) {
            return a[0];
        }
        var str = a[0];
        var b = getType(a[1]);
        if (b == 'object') {
            str = this.replaceByObj(str, a[1]);
        } else if (b == 'array') {
            var obj = {};
            if (t >= 3) {
                var f = getType(a[2]);
                if (f == 'string') {
                    for (var k in a[1]) {
                        obj[a[1][k]] = a[2];
                    }
                } else if (f == 'array') {
                    var e = a[1].length,
                        g = a[2].length;
                    var max = (e > g) ? e : g;
                    for (var i = 0; i < max; i++) {
                        obj[a[1][i]] = a[2][i];
                    }
                }
            }
            str = this.replaceByObj(str, obj);
        }
        return str;
    },
    replaceByObj: function () {
        var a = arguments;
        var t = a.length;
        if (t == 0) return '';
        if (typeof a[0] != 'string' || t < 2) {
            return a[0];
        }
        var str = a[0];
        var b = getType(a[1]);
        if (b == 'object') {
            var max = null;
            if (typeof a[2] == 'number') {
                max = a[2];
            }
            var i = 1;
            var sts = a[1];
            for (var key in sts) {
                var txt = sts[key];
                str = this.preg_replace(key, txt, str);
                if (max && i >= max) break;
                i++;
            }
        }
        return str;
    },
    escapeRegExp: function (string) {
        var str = "" + string + "";
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    },

    preg_replace: function (find, replace, string) {
        var string = "" + string + "";
        return string.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    },

    /**
     * Tạo một chuỗi random Ngẫu nhiên
     * @param {string} charList chuỗi ký tự bổ xung
     * @returns {string}
     */
    rand: function (charList) {
        var st = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (charList && isString(charList)) st = st + String(charList);
        var sp = st.split('');
        var l = sp.length - 1;
        var s = '';
        for (var i = 0; i < 32; i++) {
            s += sp[Num.rand(0, l)];
        }
        return s;
    },
    /**
     * biến đổ chuỗi thành slug
     * @param {string} str chuỗi đầu vào
     * @param {string} joinKey ký tự nối
     * @returns {string}
     */
    camelToSlug: function (str, joinKey) {
        if(typeof str == "undefined") str = "";
        var st = 'BCDEFGHIJKLMNOPQRSTUVWXYZ';
        var sp = st.split('');
        var l = sp.length - 1;
        var s = '';
        var find = [];
        var replace = [];
        var k = isString(joinKey) ? joinKey : "-";
        sp.map(function (c) {
            find.push(c);
            replace.push(k + c.toLowerCase());
        });
        return this.replace(str, find, replace);
    },
    upperToWord: function (str) {
        var st = 'abcdefghijklmnopqrstuvwxyz';
        var sp = st.split('');
        var l = sp.length - 1;
        var s = this.clearUnicode(String(str));
        var find = [];
        var replace = "";
        sp.map(function (c) {
            find.push(c);
        });

        return this.lower(s.substr(0, 1)) + this.lower(this.replace(s.substr(1), find, replace));
    },


    urlencode: function (str) {
        var t = this.html_char_raw.length;
        for (var i = 0; i < t; i++) str = this.replace(str, this.html_char_raw[i], this.html_char_enc[i]);
        return str;
    },
    urldecode: function (str) {
        var t = this.html_char_raw.length;
        for (var i = t - 1; i >= 0; i--) str = this.replace(str, this.html_char_enc[i], this.html_char_raw[i]);
        return str;
    },
    eval: function (template, data) {
        var t = typeof data;
        var tpl = template;
        if (t == 'object' || t == "array") {
            data = this.convertTextObject({}, data);
            for (var k in data) {
                var val = data[k];
                if (val === null) val = '';
                var f = "\{\$" + k + "\}";
                tpl = this.replace(tpl, f, val);
            }
        }
        return tpl;
    },
    convertTextObject: function (root, object, name, joinKey) {

        if (inArray(convertedArray, object)) return root;

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                if (typeof joinKey != "string") joinKey = ".";
                var val = object[key];
                var t = typeof val;
                var k = (typeof name != "undefined" && ("" + name).length) ? name + joinKey + key : key;
                if (val != null && (t == 'object' || t == "array")) {
                    root = this.convertTextObject(root, val, k, joinKey);
                } else {
                    root[k] = val;
                }
            }
        }
        convertedArray.push(object);
        return root;
    },
    upper: function (str) {
        if (typeof str == "undefined") return null;
        if (isString(str)) {
            var s = str.toUpperCase();
            return this.replace(s, this.unicode.lower, this.unicode.upper);
        }
        else if ((isObject(str) && typeof str.length != "undefined") || isArray(str)) {
            for (var i = 0; i < str.length; i++) {
                str[i] = this.upper(str[i]);
            }
            return str;
        }
        else if (isObject(str)) {
            for (var key in str) {
                if (str.hasOwnProperty(key)) {
                    var st = str[key];
                    str[key] = this.upper(st);
                }
            }
            return str;

        }
    },
    lower: function (str) {
        if (typeof str == "undefined") return null;
        if (isString(str)) {
            var s = str.toLowerCase();
            str = this.replace(s, this.unicode.upper, this.unicode.lower);
        }
        else if ((isObject(str) && typeof str.length != "undefined") || isArray(str)) {
            for (var i = 0; i < str.length; i++) {
                str[i] = this.upper(str[i]);
            }
        }
        else if (isObject(str)) {
            for (var key in str) {
                if (str.hasOwnProperty(key)) {
                    var st = str[key];
                    str[key] = this.upper(st);
                }
            }
        }

        return str;
    },
    ucfirst: function (str) {
        if (isString(str)) {
            if (str.length) {
                var first = str.substring(0, 1);
                str = this.upper(first) + str.substring(1);
            }
        }
        else if ((isObject(str) && typeof str.length != "undefined") || isArray(str)) {
            for (var i = 0; i < str.length; i++) {
                str[i] = this.ucfirst(str[i]);
            }
        }
        else if (isObject(str)) {
            for (var key in str) {
                if (str.hasOwnProperty(key)) {
                    str[key] = this.ucfirst(str[key]);
                }
            }
        }
        return str;
    },
    ucword: function (str) {
        var self = this;
        if (isString(str)) {
            if (str.length) {
                str = str.split(" ").map(function (s) { return self.ucfirst(s) }).join(" ");
            }
        }
        else if ((isObject(str) && typeof str.length != "undefined") || isArray(str)) {
            for (var i = 0; i < str.length; i++) {
                str[i] = this.ucword(str[i]);
            }
        }
        else if (isObject(str)) {
            for (var key in str) {
                if (str.hasOwnProperty(key)) {
                    str[key] = this.ucword(str[key]);
                }
            }
        }
        return str;
    },

    htmlentities: function (str) {
        return this.eval(str, {
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quote;",
            "&": "&amp;"
        });
    },
    formSlug: function (str) {
        return typeof str != "string" ? str : this.replace(this.replace(str, "[]", '.*'), { "[": ".", "]": "" });
    },
    slug: function (str, key) {
        if (!key) key = '-';
        var s = String(str);
        var l = 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var list = [];
        var n = 0;
        var t = this.replace(this.replace(
            this.clearUnicode(this.lower(s)),
            "[]{}();:'\"\\|,./?~!@#$%^&*+=".split(""),
            "-"
        ), '--', '-');
        for (var i = 0; i < t.length; i++) {
            var st = t[i];
            if (l.indexOf(st) == -1) {
                if (typeof list[n] != "undefined") {
                    if (l.indexOf(t[i - 1]) >= 0) n++;
                }
            } else {
                if (typeof list[n] == "undefined") {
                    list[n] = st;
                } else {
                    list[n] += st;
                }
            }
        };
        return list.join(key);
    },
    slugToCamel: function (str) {
        if (isString(str)) {
            var self = this;
            var t = this.replace(
                this.replace(
                    this.clearUnicode(str),
                    "[]{}();:'\"\\|,./?~!@#$%^&*+=".split(""),
                    "-"
                ),
                '--',
                '-'
            ).split("-")
                .map(function (s) { return s.trim(); })
                .filter(function (s) { return s.length > 0; })
                .map(function (s, i) {
                    return i > 0 ? self.ucfirst(s) : s;
                }).join("");
            str = t;


        }
        return str;
    }

};





var date = function (format, lang) {
    var offset = 0;
    var d = new Date();
    var t = {};
    var l = String(lang).toLowerCase() != 'en' ? 'vi' : 'en';

    var dl = {
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        vi: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    };
    var ml = {
        en: ["", "Jan"]
    };


    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    d = new Date(utc + (3600000 * offset));



    t.ms = d.getMilliseconds();
    t.Y = d.getFullYear();
    t.y = d.getYear();
    t.H = d.getHours();
    t.i = d.getMinutes();
    t.m = d.getMonth() + 1;
    t.s = d.getSeconds();
    t.time = d.getTime();
    t.d = d.getDate();
    t.w = dl[l][d.getDay()];
    if (!format) return t;
    var f = getType(format);
    if (f == 'string') {
        var txt = format;
        txt = Str.replace(txt, 'ms', t.ms);
        txt = Str.replace(txt, 'time', t.time);
        txt = Str.replace(txt, t);
        return txt;
    }
    return null;
};



/**
 * 
 * @param {object} target đối  tượng cần gán thuộc tính
 * @param {object|string} key key hoặc object thuộc tính
 * @param {*} value giá trị
 */
var assignValue = function (target, key, value) {
    if (!isArray(target) && !isObject(target)) return target;
    if (isObject(key)) {
        if(isArray(target)){
            console.warn("Target khong cung kieu voi object");
            var a = target;
            target = assignValue({}, a);
        }
        for (var k in key) {
            if (key.hasOwnProperty(k)) {

                var s13 = String(k).substr(0, 13);
                if(s13 == "______rand_id" || s13 == "______unique_"){

                }else{
                    var v = key[k];
                    assignValue(target, k, v);
                }
    
                
            }
        }
    } else if (isArray(key)) {
        for (let i = 0; i < key.length; i++) {
            const vl = key[i];
            assignValue(target, i, vl);
        }
    }
    else if ((isString(key) || isNumber(key)) && String(key).length) {
        var s13 = String(key).substr(0, 13);
        if(s13 == "______rand_id" || s13 == "______unique_"){
            // kong6 làm gì
        }else if (String(key).substr(0, 1) == '@') {
            var f = key.substr(1);
            if (typeof target[f] == "function") {
                target[f].apply(target, isArray(value) ? value : [value]);
            }
        }
        else if (isObject(value)) {
            if (value.constructor == Object || value.constructor == UniqueData) {
                if (typeof target[key] != "object") target[key] = {};
                assignValue(target[key], value);
            }
            else {
                target[key] = value;
            }
        }
        else if (isArray(value)) {
            if (typeof target[key] == "undefined" || !isArray(target[key])) {
                target[key] = [];
                assignValue(target[key], value);
            } else {
                assignValue(target[key], value);
            }
        }
        else {
            target[key] = value;
        }
    }
    return target;
};

var assignWithout = function (target, source) {
    if (typeof target != "object" || typeof source != "object") return target;
    var il = [];
    for (var index = 2; index < arguments.length; index++) {
        var list = arguments[index];
        if (isArray(list)) {
            for (var i = 0; i < list.length; i++) {
                var field = list[i];
                il.push(field);
            }
        } else if (isObject(list)) {
            for (var field in list) {
                if (list.hasOwnProperty(field)) {
                    var val = list[field];
                    il.push(field);
                }
            }
        }
    }
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var val = source[key];
            if (!inArray(il, key)) {
                assignValue(target, key, val);
            }
        }
    }
    return target;
};
var rgbToHex = function (rgb) {
    var hex = parseInt(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};
var colorToHex = function (r, g, b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return "#" + red + green + blue;
};

var invertHexColor = function invertHexColor(hexTripletColor) {
    var color = hexTripletColor;
    color = color.substring(1); // remove #
    color = parseInt(color, 16); // convert to integer
    color = 0xFFFFFF ^ color; // invert three bytes
    color = color.toString(16); // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color; // prepend #
    return color;
}

/**
 * xửu lý hàng đợi
 * @param {function} work hàm thục thi công việc
 * @param {Number} delay thời gian giữa 2 lần chạy task
 * @param {Number} step số lần thực hiện công việc nếu chưa bị reject hay resolve
 */
var Queue = function (work, delay, step) {
    if (typeof work == "undefined") return this;
    this.status = "pending";
    this.result = null;
    var d = (typeof delay == "undefined" || !isNumber(delay) || delay < 1) ? 10 : delay;
    var s = (typeof step == "undefined" || !isNumber(step) || step < 0) ? -1 : step;
    var self = this;
    var properties = {
        timeDelay: d,
        stepCount: s,
        resolved: false,
        rejected: false,
        cancelled: false,
        stopped: false,
        status: "pending",
        timeId: null,
        turn: 1,
        count: 1
    };
    var methods = {
        then: function (rs) {
            // App.log(rs);
        },
        catch: function (err) {
            console.log(err);
        },
        clear: function () {
            if (properties.timeId) {
                clearTimeout(properties.timeId);
                self.status = properties.status;
            }

        },
        run: function () {
            var comtext = this;
            var time = properties.timeDelay || 10;
            var stop = properties.stepCount;
            var resolve = function (rs) {
                properties.resolved = rs;
                if (properties.status == "pending") {
                    properties.status = "resolved";
                    self.result = rs;
                    comtext.clear();
                    return comtext.then(rs);
                }
                comtext.clear();
                return true;

            };
            var reject = function (err) {
                properties.rejected = err;
                if (properties.status == "pending") {
                    properties.status = "rejected";
                    self.result = err;
                    comtext.catch(err);
                }
                comtext.clear();
                return err;

            };
            var runtask = function () {
                properties.timeId = setTimeout(function () {
                    if (properties.stepCount > -1 && properties.turn > properties.stepCount) {
                        properties.status = "stoped";
                        properties.stopped = "time out";
                        comtext.clear();
                        return false;
                    } else if (properties.status != "pending") {
                        return false;
                    } else {
                        try {
                            var stt = work(resolve, reject, properties.turn);
                            if (stt !== undefined) {
                                if (properties.status == "pending") {
                                    comtext.stop();
                                    return false;
                                }
                            }
                            properties.turn++;
                        } catch (error) {
                            comtext.stop();
                            comtext.catch(error);
                            return false;
                        }
                    }

                    properties.count++;
                    runtask();
                }, time);
            };
            runtask();
        },
        stop: function () {
            properties.stepCount = 0;
            properties.status = "stopped";
            this.clear();
        },
        delay: function (delay) {
            if (typeof delay == "undefined" || !isNumber(delay) || delay < 1) return;
            properties.timeDelay = delay;
            this.clear();
            this.run();
        },
        step: function (step) {
            if (typeof step == "undefined" || !isNumber(step) || step < -1 || step == 0) return;
            properties.stepCount = step;
            this.clear();
            this.run();
        },
        restart: function () {
            this.clear();
            properties.turn = 1;
            this.run();
        },
        addThen: function (fn) {
            if (typeof fn == "function") {
                this.then = fn;
            }
        },
        addCatch: function (fn) {
            if (typeof fn == "function") {
                this.catch = fn;
            }
        },
        getData: function () {
            return properties;
        }
    };
    this.e = function () {
        if (!arguments.length || typeof arguments[0] != "string") return null;
        var method = arguments[0];
        var r = null;
        if (typeof methods[method] == "function") {
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                var arg = arguments[i];
                args.push(arg);
            }

            r = methods[method].apply(methods, args);
        }
        return r;
    };
    setTimeout(function () {
        methods.run();
    }, 1);
};

Queue.prototype = {
    constructor: Queue,
    delay: function (delay) {
        if (typeof delay == "undefined" || !isNumber(delay) || delay < 1) return;
        this.e("delay", delay);
        return this;
    },
    step: function (step) {
        if (typeof step == "undefined" || !isNumber(step) || step < -1 || step == 0) return;
        this.e("step", step);
        return this;
    },
    try: function (step) {
        if (typeof step == "undefined" || !isNumber(step) || step < -1 || step == 0) return;
        this.e("step", step);
        return this;
    },
    restart: function () {
        this.e("restart");
        return this;
    },
    stop: function () {
        this.e("stop");
        return this;
    },
    then: function (fn) {
        if (typeof fn == "function") {
            this.e("addThen", fn);
        }
        return this;
    },
    catch: function (fn) {
        if (typeof fn == "function") {
            this.e("addCatch", fn);
        }
        return this;
    },
    getData: function () {
        return this.e("getData");
    }
};

/**
 * xửu lý hàng đợi
 * @param {function} work hàm thục thi công việc
 * @param {Number} delay thời gian giữa 2 lần chạy task
 * @param {Number} step số lần thực hiện công việc nếu chưa bị reject hay resolve
 */
function queueTask(work, delay, step) {
    return new Queue(work, delay, step);
}

/**
 * lấy danh sách tham số nội hàm khi dược gọi
 * @param {Arguments} args tham số nội hàm
 * @param {integer} start vị trí bắt đầu lấy tham số
 * @returns {mixed[]}
 */
function getArguments(args, start) {
    var a = [];
    if(!isNumber(start) || start < 0) start = 0;
    if (args && args.length) {
        for (let i = start; i < args.length; i++) {
            const arg = args[i];
            a.push(arg);
        }
    }
    return a;
}


function JsonToBase64(data) {
    return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
}


function b64toBlob(b64Data, contentType, sliceSize) {
    if (!contentType) contentType = '';
    if (!sliceSize) sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}


var uniqueID = 1000000;
function UniqueData(data){
    this["______rand_id" + Str.rand(date('ms'))+"_" + (uniqueID++)] = Str.rand(date('ms'));
    this["______unique_" + Str.rand(date('ms'))] = uniqueID;
    if(isObject(data)){
        assignValue(this, assignValue(new UniqueData(), data));
    }
    
}

function uniqueObject(data){
    return new UniqueData(data);
}


/**
 * resize anh
 * @param {string|Element} img anh
 * @param {int} resizeWidth do rong 
 * @param {int} resizeHeight chieu cao
 * @param {function} callback ham call back
 */
function resizeImage(img, resizeWidth, resizeHeight, callback) {
    function fn(imgTag) {
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', resizeWidth);
        canvas.setAttribute('height', resizeHeight);
        
        
        var ctx = canvas.getContext("2d");

        var imageWidth = imgTag.width;
        var imageHeight = imgTag.height;

        var zoomWidth = imageWidth, zoomHeight = imageHeight;
        var imageRatio = imageWidth / imageHeight;
        var resizeRatio = resizeWidth / resizeHeight;
        // tỉ lệ là dài trên cao

        if (imageRatio < resizeRatio) { // Nếu rỉ lệ của ảnh nhỏ hơn tỷ lệ resize thì sẽ zoom ảnh theo chiều rộng resize
            zoomWidth = resizeWidth;
            zoomHeight = zoomHeight / imageRatio;
        } else { // nhược lại sẽ zoom ảnh theo chiều cao resize
            zoomHeight = resizeHeight;
            zoomWidth = zoomHeight * imageRatio;
        }

        // var image = new Image();
        // image.src = imgTag.src;
        // console.log(imgTag)
        ctx.drawImage(imgTag, (resizeWidth - zoomWidth) / 2, (resizeHeight - zoomHeight) / 2, zoomWidth, zoomHeight);
        var url = canvas.toDataURL("image/png");
        callback(url);

    };
    return isString(img) ? function () {
        var el = document.createElement('img');
        el.src = img;
        el.onload = function () {
            fn(el);
        }
        return el;
    }() :
        img instanceof Element ? fn(img) : null;
}
Helper._instanceof = _instanceof;
Helper.classCallCheck = _classCallCheck;
Helper.defineProperties = _defineProperties;
Helper.createClass = _createClass;
Helper.defineProperty = _defineProperty;
Helper.addToGlobal = addToGlobal;
Helper.getType = getType;
Helper.isBoolean = isBoolean;
Helper.isArray = isArray;
Helper.isObject = isObject;
Helper.isString = isString;
Helper.isNumber = isNumber;
Helper.isInteger = isInteger;
Helper.isFloat = isFloat;
Helper.isEmail = isEmail;
Helper.isNull = isNull;
Helper.isFormData = isFormData;
Helper.isEmpty = isEmpty;
Helper.isCallable = isCallable;
Helper.isFunction = isFunction;
Helper.isProperty = isProperty;
Helper.isMethod = isMethod;
Helper.hasValue = hasValue;
Helper.inArray = inArray;
Helper.arrayJoin = arrayJoin;
Helper.cutWithout = cutWithout;
Helper.copyWithout = copyWithout;
Helper.compareObject = compareObject;
Helper.checkType = checkType;
Helper.originModules = [];
Helper.log = cl;
Helper.deepCopy = deepCopy;
Helper.copyArray = copyArray;
Helper.objectKeys = objectKeys;
Helper.objectValues = objectValues;
Helper.objectHasKey = objectHasKey;
Helper.objectHasProperty = objectHasProperty;
Helper.merge = merge;
Helper.combine = combine;
Helper.number = Num;
Helper.minOf = minOf;
Helper.maxOf = maxOf;
Helper.str = Str;
Helper.date = date;
Helper.getEl = getEl;
Helper.assignValue = assignValue;
Helper.assignWithout = assignWithout;
Helper.colorToHex = colorToHex;
Helper.invertHexColor = invertHexColor;
Helper.copyByList = copyByList;
Helper.queue = queueTask;
Helper.queueTask = queueTask;
Helper.Queue = Queue;
Helper.combineElenentsToArrList = combineElenentsToArrList;
Helper.combineElenentsJoinStringList = combineElenentsJoinStringList;
Helper.getArguments = getArguments;
Helper.JsonToBase64 = JsonToBase64;
Helper.b64toBlob = b64toBlob;
Helper.resizeImage = resizeImage;
Helper.isUndefined = isUndefined;
Helper.isNull = isNull;
Helper.isTrue = isTrue;
Helper.isFalse = isFalse;
export default Helper;
export {
    _instanceof, _defineProperties, _createClass, _defineProperty, addToGlobal,
    getType, checkType, isArray, isBoolean, isObject, isString, isNumber, isInteger, isEmail, isNull, isFormData, isEmpty, 
    isCallable, isFunction, isProperty, isMethod, hasValue, inArray, isTrue, isFalse, isUndefined, 
    cutWithout, copyWithout, compareObject, cl, deepCopy, copyArray, objectKeys, objectValues, merge, combine, arrayJoin, objectHasKey, objectHasProperty,
    Num, Str, date, getEl, assignValue, assignWithout, colorToHex, invertHexColor, minOf, maxOf, copyByList, isFloat,
    Queue, queueTask, combineElenentsToArrList, combineElenentsJoinStringList, getArguments, JsonToBase64, b64toBlob, resizeImage
};