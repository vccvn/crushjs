import Helper, { cl, getType, isArray, isEmpty, isFunction, isNull, isObject, isString, Str, _instanceof } from './helper.js';
"use strict";
var global = window;

// mang
var arr = [];

var document = window.document;

var div = document.createElement("div");

// var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var createElement = document.createElement;

var isHTML = str => isString(str) ? (
    /<(?=.*? .*?\/*>|br|hr|input|!--|wbr)[a-z\-_\:]+.*?>|<([a-z\-_\:]+).*?<\/\1>/i.test(str)
) :
    _instanceof(str, Element);


var checkHtmlStr = (str) => !(str || '')
    // replace html tag with content
    .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, '')
    // remove remaining self closing tags
    .replace(/(<([^>]+)>)/ig, '')
    // remove extra space at start and end
    .trim();
// mang
var arr = [];

var emptyFunc = function () { };

/**
 * gán sự kiện cho đối tượng dom
 * @param {Element} el đối tượng dom
 * @param {string} event sự kiện
 * @param {dunction} handler hàm xử lý sự kiện
 */
var addEventListener = function addEventListener(el, event, handler) {
    if (!(el instanceof Element) && el != document && el != window) return false;
    let cb = (typeof handler == "function") ? handler : function (e) {
        Helper.func.call(handler, [e.target]);
    };
    if (el.addEventListener) {
        el.addEventListener(event, cb);
    } else if (el.attachEvent) {
        el.attachEvent(event, cb);
    }
}
/**
 * Hủy một sự kiện trong dom
 * @param {Element} el
 * @param {string} event
 * @param {function} callback
 */
var removeEventListener = function removeEventListener(el, event, callback) {
    if (!(el instanceof Element) && el != document) return false;
    let cb = (typeof callback == "function") ? callback : function (e) {
        Helper.func.call(callback, [e.target]);
    };
    if (el.removeEventListener) {
        el.removeEventListener(event, cb);
    }
}
var documentReady = function () {
    if (document.readyState !== 'complete') return;
    return true;


};

var isGlobalOrRoot = function (obj) {
    return obj == global || obj == document;
};
/**
 * thao tác với dom thông qua html query gần giống jquery nhưng ít chức năng hơn
 */
var domEvents = (
    "blur focus focusin focusout resize scroll click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup contextmenu load input"
).split(" ");




/**
* cái này là thao tác dom ảo
*/



/**
 * lấy thông tin thẻ từ chuỗi đầu vào có dạng css selector
 * @param {string} s css selector
 */
var getDomInf = function (s) {
    var obj = { tagName: "", id: "", className: "", props: "", attrs: "", content: "", other: "" };
    var a = String(s).split("");
    var m = "tagName";
    // số lượng các cổng đang mở 
    var contentMode = 0;
    var attrMode = 0;

    var status = false;
    // lặp qua từng ký tự để tách chuỗi thông qua việc đêm các ký tự đặc biệt
    for (let i = 0; i < a.length; i++) {
        var c = a[i];
        // nếu nội dung dang được kích hoạt
        if (contentMode > 0) {
            if (c == "{") {
                contentMode++;
            }
            else if (c == "}") {
                contentMode--;
            }
            if (contentMode) {
                obj[m] += "" + c;
            }
            else {
                m = "other";
                obj.other += " ";
            }



        }
        // bắt đầu đọc thuộc tính có giá trị
        else if (attrMode > 0) {
            if (c == "[") {
                attrMode++;
            }
            else if (c == "]") {
                attrMode--;
            }
            if (attrMode) {
                obj[m] += "" + c;
            } else {
                m = "other";
                obj.other += " ";
            }

        }

        // bắt đầu dặc id
        else if (c == "#") {
            m = "id";
        }
        // bắt đầu dọc class
        else if (c == ".") {
            m = "className";
            obj.className += " ";
        }
        // bắt đầu đọc thuộc tính trạng thái
        else if (c == ":") {
            m = "props";
            obj.props += " ";
        }
        // bắt đầu đọc thuộc tính có giá trị
        else if (c == "[") {
            m = "attrs";
            attrMode++;
            obj.attrs += "\n";
        }
        // kết thúc việc đọc
        else if (c == "]") {
            attrMode--;
            m = "other";
            obj.other += " ";

        }
        // dọc nội dung
        else if (c == "{") {
            m = "content";
            // obj.content+= "";
            contentMode++;
        }
        // kết thúc đọc nội dung
        else if (c == "}") {
            m = "other";
            obj.other += " ";
            contentMode--;
        }
        // đang làm việc gì tiếp tục làm việc đó
        else {
            obj[m] += "" + c;
        }
    }
    var obj2 = { tagName: "", id: "", className: "", props: {}, attrs: {}, other: "", content: '', isElement: false };
    var tagName = obj.tagName.trim();
    var id = obj.id.trim();
    var className = obj.className.trim();
    var props = obj.props.trim();
    var attrs = obj.attrs.trim();
    var content = obj.content.trim();

    if (tagName) {
        obj2.tagName = tagName;
        status = true;
    } else if (s) {
        obj2.tagName = "div";
    }

    if (id) {
        obj2.id = id;
        status = true;
    }

    if (className) {
        obj2.className = className;
        status = true;
    }

    if (props) {
        var p = props.split(" ");
        for (var i = 0; i < p.length; i++) {
            var prop = p[i];
            obj2.props[prop] = true;
            status = true;
        }
    }
    if (attrs) {
        var p = attrs.split("\n");
        for (var i = 0; i < p.length; i++) {
            var attr = p[i].split("=");
            if (attr.length == 2) {
                status = true;
                if (Helper.inArray(['"', "'"], attr[1][0]) && Helper.inArray(['"', "'"], attr[1][attr[1].length - 1])) {
                    obj2.attrs[attr[0]] = attr[1].substr(1, attr[1].length - 2);
                }
                else {
                    obj2.attrs[attr[0]] = attr[1];
                }
            }

        }
    }

    if (content) {
        obj2.content = content;

    }

    obj2.isElement = status;
    return obj2;

};

/**
 * danh sách simple tag
 */
var simpleTags = ['img', 'meta', 'link', 'input', 'br', 'hr'];

/**
 * Tạo đối tượng dom
 * @param {string|object} tag ten the hoặc tất cả các thông tin của thẻ
 */
var create = function create(tag) {
    var tagName = 'div',
        id = '',
        className = '',
        attrs = {},
        dynamicAttrs = {},
        events = {},
        props = {},
        contents = [],
        contentf = "",
        inf = { isElement: false },
        isSimple = false,
        boot = null,
        init = null;

    /**
     * phan tich objec chưa cac thuoc tinh
     * @param {object} object doi tuong thuoc tinh
     * @param {boolean} changeTagName 
     */
    var parseAttrs = function (object, changeTagName) {
        for (var k in object) {
            if (object.hasOwnProperty(k)) {
                var vl = object[k];
                var s = String(k).toLowerCase();
                if (s.substr(0, 1) == '$') {
                    dynamicAttrs[k.substr(1)] = vl;
                }
                else if (Helper.inArray(['tag', 'tagname'], s)) {
                    // tagName = vl;
                    if (changeTagName) {
                        tagName = vl;
                    }
                }
                else if (Helper.inArray(['init', 'boot'], s)) {
                    if (s == 'boot') boot = vl;
                    else init = vl;
                }
                else if (s.substr(0, 2) == 'on' && Dom.isDomEvent(s.substr(2))) {
                    events[s.substr(2)] = vl;
                }
                else if (s.substr(0, 1) == '@' && Dom.isDomEvent(s.substr(1))) {
                    events[s.substr(1)] = vl;
                }
                else if (Helper.inArray(["content", "content", "children"], s)) {
                    if (Helper.isArray(vl)) {
                        for (var j = 0; j < vl.length; j++) {
                            var cnt = vl[j];
                            contents.push(cnt);
                        }
                    } else {
                        contents.push(vl);
                    }
                }
                else {
                    attrs[k] = vl;
                }
            }
        }
    }

    if ((Helper._instanceof(tag, Query) || Helper._instanceof(tag, Dom)) || (isObject(tag) && (tag.isQuery || tag.isDomQuery))) {
        contents.push(tag);
    }
    else if (isObject(tag) && tag.isDomElement) {
        contents.push(tag.el);
    }
    else if (Helper.isObject(tag)) {
        parseAttrs(tag, true);
    }
    else if (Helper.isString(tag)) tagName = tag;
    var max = arguments.length > 3 ? 3 : arguments.length;
    for (var i = 1; i < max; i++) {
        var arg = arguments[i];
        if ((Helper._instanceof(arg, Query) && arg.length) || (Helper.isObject(arg) && (arg.isQuery || arg.isDomQuery))) {
            arg.map(function (el) { contents.push(el) })
        }
        else if (isObject(arg) && arg.isDomElement) {
            contents.push(arg.el);
        }
        else if (Helper._instanceof(arg, Element)) {
            contents.push(arg);
        }
        else if (Helper._instanceof(arg, Dom)) {
            contents.push(arg.el);
        }
        else if (Helper.isObject(arg)) {
            parseAttrs(arg);
        }
        else if (Helper.isString(arg)) {
            contents.push(arg);
        } else if (Helper.isArray(arg)) {
            for (var j = 0; j < arg.length; j++) {
                var cnt = arg[j];
                contents.push(cnt);
            }
        }
    }

    // lọc xong tất cả content va attr


    var inf = Dom.getInf(tagName);
    if (inf.isElement) {
        if (tagName != inf.tagName) {

            tagName = inf.tagName;
            isSimple = simpleTags.indexOf(tagName.toLowerCase()) >= 0;
            if (inf.id) {
                id = inf.id;
            }
            if (inf.className) {
                className = inf.className;
            }
            if (!Helper.isEmpty(inf.attrs)) {
                parseAttrs(inf.attrs);
            }
            if (!Helper.isEmpty(inf.props)) {
                Helper.assignValue(props, inf.props);
            }
            if (inf.content) {
                if (!isSimple) {
                    contentf = inf.content;
                }
                // else if (typeof attrs.content == "undefined") attrs.content = inf.content;
            }
        }
    }
    if (id) {
        if (typeof attrs.id == "undefined") {
            attrs.id = id;
        }
    }

    isSimple = simpleTags.indexOf(tagName.toLowerCase()) >= 0;
    /**
     * 
     */
    var htmlObject = document.createElement(tagName);
    if (typeof boot == "function") boot.call(htmlObject, attrs, events);
    if (!Helper.isEmpty(attrs)) {
        var csk, v;
        var css = {};
        for (var prop in attrs) {
            if (attrs.hasOwnProperty(prop)) {
                var val = attrs[prop];
                var key = prop.toLowerCase();
                var k = key;
                var f = k.substring(0, 1);
                var f2 = k.substring(0, 2);
                var isEvent = Dom.eventList.indexOf(key) >= 0;
                if (Helper.inArray(['tag', 'tagname'], key)) {
                    // tagName = vl;
                }
                else if (key == "style") {
                    if (typeof val == "object") {
                        for (var cssKey in val) {
                            if (val.hasOwnProperty(cssKey)) {
                                v = val[cssKey];
                                css[cssKey] = v;
                            }
                        }

                        for (var ck in css) {
                            if (css.hasOwnProperty(ck)) {
                                var cv = css[ck];
                                htmlObject.style[ck] = cv;
                            }
                        }
                    } else {
                        htmlObject.setAttribute(key, val);
                    }
                }
                else if (typeof val == 'object') {
                    if (val.isQuery || val.isDomQuery || val.isDomElement) {

                    } else {
                        let attrObj = Helper.str.convertTextObject({}, val, prop, '-');
                        for (var ak in attrObj) {
                            if (attrObj.hasOwnProperty(ak)) {
                                var v = attrObj[ak];
                                htmlObject.setAttribute(ak, v);
                            }
                        }
                    }

                } else if (key == 'class' || key == 'classname') {
                    htmlObject.className = val;
                }
                else if (key != "content" || isSimple) {
                    var slug = Helper.str.camelToSlug(prop, '-');
                    htmlObject.setAttribute(slug, val);
                }
            }
        }
    }

    if (!isSimple) {
        if (contents.length) {
            if (tagName.toLowerCase() == 'textarea') {
                htmlObject.innerText = contents[0];
                if (contentf) {
                    htmlObject.innerText += contentf;
                }
            } else {
                for (var i = 0; i < contents.length; i++) {
                    var el = contents[i];
                    if ((Helper._instanceof(el, Query) && el.length) || (Helper.isObject(el) && (el.isQuery || el.isDomQuery))) {
                        el.map(function (elem) {
                            htmlObject.appendChild(elem);
                        });
                    }
                    else if (Helper.isObject(el) && el.isDomElement) {
                        htmlObject.appendChild(el.el);
                    }
                    else if (el instanceof Element) {
                        htmlObject.appendChild(el);
                    } else if (Helper.isObject(el) || Helper.isString(el)) {
                        var a = parse(el);
                        if (a) htmlObject.appendChild(a);
                    }
                }

            }
        }
        else if (contentf) {
            if (tagName.toLowerCase() == 'textarea') {
                htmlObject.innerText += contentf;
            } else {
                htmlObject.appendChild(parse(contentf));

            }

        }

    }
    else if (contentf && !attrs.hasOwnProperty('content')) {
        htmlObject.setAttribute('content', contentf);
        contents = [];
    }

    if (className) {
        className.split(" ").filter(function (str) {
            return str.length > 0;
        }).map(function (str) {
            htmlObject.classList.add(str);
        })

    }

    var addEv = function (ev, fn) {
        var cb = (typeof fn == "function") ? fn : function (e) {
            Helper.func.call(fn, [e.target]);
        };
        if (htmlObject.addEventListener) {
            htmlObject.addEventListener(ev, cb);
        } else if (htmlObject.attachEvent) {
            htmlObject.attachEvent(ev, cb);
        }
    };


    if (!Helper.isEmpty(events)) {
        for (var key in events) {
            if (Object.hasOwnProperty.call(events, key)) {
                var fn = events[key];
                addEv(key, fn);
            }
        }


    }
    if (typeof init == "function") {
        init.call(htmlObject);
    }
    return htmlObject;

}

/**
 * lấy ra đối tượng dom từ tham số đầu vào
 * @param {*} str giá trị bất kì
 * @returns {Element}
 */
var parse = function (str) {
    var div = document.createElement('div');
    if ((str instanceof Element)) return str;
    else if (typeof str == "object" && !isNull(str)) {
        if (isQuery(str)) {
            if (str.length > 0) {
                return str[0];
            } else {
                return div;
            }
        }
        else if (str instanceof Dom || str.constructor == Dom) {
            return str.el;
        }

        else {
            return create(str);
        }
    }
    div.innerHTML = Helper.isString(str) && !Helper.isNumber(str) ? String(str).trim() : str;

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
};


/**
 * tạo ra các thẻ dom input
 * @param {object} args thuộc tính input
 */
var input = function (args) {
    if (typeof args == "object") {
        var tagName = 'input';
        var attrs = {};
        var content = null;
        var value = null;
        var type = "text";
        var ignore = [];
        var data = [];
        var boot = null,
            init = null;
        for (var prop in args) {
            if (args.hasOwnProperty(prop)) {
                var val = args[prop];
                let p = prop.toLowerCase();
                if (p == 'type') {
                    let v = (typeof val == 'string') ? val.toLowerCase() : 'text';
                    type = v;
                    if (v == 'textarea') {
                        tagName = v;
                        ignore.push("type", "value");
                    } else if (v == "select") {
                        tagName = "select";
                        ignore.push("type", "value", "data");
                    } else {
                        attrs[p] = v;
                    }
                } else if (ignore.indexOf(p) >= 0) {
                    // next
                } else if (p == "init") {
                    init = val;
                } else if (p == "boot") {
                    boot = val;
                } else {
                    attrs[prop] = val;
                }

                if (p == 'value') {
                    value = val;
                } else if (p == 'data') {
                    data = val;
                }
            }
        }
        var attributes = {};
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                var va = attrs[key];
                if (ignore.indexOf(key.toLowerCase()) >= 0) {
                    // next
                } else {
                    attributes[key] = va;
                }
            }
        }
        if (type == 'select') {
            content = [];
            if (typeof data == "object") {
                for (var vl in data) {
                    if (data.hasOwnProperty(vl)) {
                        var text = data[vl];
                        let option = { value: vl };
                        if (vl == value) {
                            option.selected = "selected";
                        }
                        content.push(create('option', text, option));
                    }
                }
            }
        } else if (type == "textarea") {
            content = value;
        } else {
            content = attributes;
        }
        return create(tagName, attributes, content, boot, init);
    }
    return null;
};


var encode = function (html) {
    var div = document.createElement("div");
    div.appendChild(make(html));
    return div.innerHTML;
};
var decode = function (html) {
    return make(html);
};
var render = function (html, root) {
    if (root instanceof Element) {
        root.appendChild(parse(html));
    } else {
        document.body.appendChild(parse(html));
    }
};


var parseClass = function (className) {
    var prefix = '';//Helper.getSystemOption("cssClassPrefix");
    var cls = '';
    cls += prefix + className;
    if (arguments.length > 1) {
        for (let i = 1; i < arguments.length; i++) {
            var cln = arguments[i];
            cls += " " + prefix + cln;
        }
    }
    return cls;
};
var make = function (tag, attributes, content) {
    return new Dom(tag, attributes, content);
};


var eventHandler = function (e) {
    console.log(e.target);
};

/**
* mảng chứ các event sự kiện
* mỗi phần tử trong mảng chứa element, tên sự kiện, handle, và task
* task là một danh sách gồm callback và data
*/
var events = [];
// thêm sự kiện

/**
* them su kien cho element
* @param {Element} element dom element
* @param {string} event ten su kien
* @param {function} callback
* @param {string} data
* @return {boolean}
*/
var addEvent = function (element, event, callback, data) {
    if (!element || !event || (!(element instanceof Element) && !isGlobalOrRoot(element)) || !Helper.isString(event) || !callback || !Helper.isCallable(callback)) return false;
    event = event.toLowerCase();
    data = data || null;

    // tìm trong danh sách sự kiện có tồn tại sự kiện này chưa
    for (let i = 0; i < events.length; i++) {
        var eventData = events[i];
        // một cặp element và event là key của một bản ghi dom event
        if (eventData.element === element && eventData.event === event) {
            for (let j = 0; j < eventData.tasks.length; j++) {
                var evCallback = eventData.tasks[j];
                if (data) {
                    if (data == evCallback.data && evCallback.callback === callback) return true;
                } else if (evCallback.callback === callback) return true;
            }
            addEventListener(element, event, callback);
            events[i].tasks.push({
                callback: callback,
                data: data
            });


            return true;
        }
    }
    addEventListener(element, event, callback);
    events.push({
        element: element,
        event: event,
        data: data,
        tasks: [
            {
                callback: callback,
                data: data
            }
        ]
    });
    return true;
};

/**
* them su kien cho element
* @param {Element} element dom element
* @param {string} event ten su kien
* @param {function} callback
* @param {string} data
* @return {boolean}
*/

var removeEvent = function (element, event, callback, data) {
    // trưởng hợp không gửi element nào thì xóa tất cả
    if (!element || (!(element instanceof Element) && !isGlobalOrRoot(element)) || !Helper.isString(event)) {
        for (let i = 0; i < events.length; i++) {
            var eventData = events[i];
            if (eventData.tasks.length) {
                eventData.tasks.map(function (task) {
                    removeEventListener(eventData.element, eventData.event, task.callback);
                });
            }

        }
        events = [];

        //
        return false;
    }
    event = event ? event.toLowerCase() : null;
    data = data || null;
    // duyệt mảng để tím element và event phù hợp
    for (let i = 0; i < events.length; i++) {
        var eventData = events[i];
        if (eventData.element === element) {
            if (!event) {
                if (eventData.tasks.length) {
                    eventData.tasks.map(function (task) {
                        removeEventListener(eventData.element, eventData.event, task.callback);
                    });
                }
                events.splice(i, 1);
                i--;
            }
            else if (eventData.event === event) {
                for (let j = 0; j < eventData.tasks.length; j++) {
                    var evCallback = eventData.tasks[j];
                    if (data) {
                        if (data == evCallback.data) {
                            if (callback && Helper.isFunction(callback)) {
                                if (evCallback.callback === callback) {
                                    removeEventListener(eventData.element, eventData.event, evCallback.callback);
                                    events[i].tasks.splice(j, 1);
                                    j--;
                                }
                            }
                        }
                    } else if (callback && Helper.isFunction(callback)) {
                        if (evCallback.callback === callback) {
                            removeEventListener(eventData.element, eventData.event, evCallback.callback);
                            events[i].tasks.splice(j, 1);
                            j--;
                        }
                    } else {
                        removeEventListener(eventData.element, eventData.event, evCallback.callback);
                        events[i].tasks.splice(j, 1);
                        j--;
                    }
                }
                if (!events[i].tasks.length) {
                    // removeEventListener(eventData.element, eventData.event, eventData.handle);
                    events.splice(i, 1);
                    i--;
                }
            }
        }
    }
};
var getEvents = function (element, event, data) {
    event = event || null;
    element = element || null;
    data = data || null;
    var list = [];
    if (!element && !event) return events;
    for (let i = 0; i < events.length; i++) {
        var eventData = events[i];
        if ((!element || element == eventData.element) && (!event || event == eventData.event)) {
            list.push(eventData);
        }
    }
    return list;
};
var triggerEvent = function (element, event, data) {
    event = event || null;
    element = element || null;
    data = data || null;
    if (!element && !event) return events;
    for (let i = 0; i < events.length; i++) {
        var eventData = events[i];
        if (element == eventData.element && event == eventData.event) {
            if (eventData.tasks.length) {
                eventData.tasks.map(function (task) {
                    // removeEventListener(eventData.element, eventData.event,);
                    if (typeof task.callback == "function") {
                        task.callback.apply(eventData.element, data)
                    }
                });
            }
        }
    }
};
var getEventData = function (element, event, data) {
    event = event || null;
    element = element || null;
    data = data || null;
    if (!element && !event) return null;
    for (let i = 0; i < events.length; i++) {
        var eventData = events[i];
        if ((!element || element == eventData.element) && (!event || event == eventData.event)) {
            return eventData;
        }
    }
    return null;
};

/**
 * kiểm tra xem có phải sự kiện dom hay ko
 * @param {string|string[]} eventName 
 * @returns {boolean}
 */
var isDomEvent = function isEvent(eventName) {
    var stt = false;
    if (isArray(eventName)) eventName.map(function (e) { if (domEvents.indexOf(String(e).toLowerCase()) != -1) stt = true; });
    else if (isString(eventName) && domEvents.indexOf(eventName.toLowerCase()) != -1) stt = true;
    return stt;
};



function setCssProp(element, prop, value) {
    if (element instanceof Element && Helper.isString(prop) && Helper.isString(value)) {
        element.style[prop] = value;
    }
}
function getCssProp(element, prop) {
    if (element instanceof Element && Helper.isString(prop)) {
        return typeof element.style[prop] != "undefined" ? String(element.style[prop]) : "";
    }
    return "";
}

function getTree(elem, list) {
    if (typeof elem == "undefined") return [];
    if (typeof list == "undefined" || !Helper.isArray(list)) {
        list = [];
    }
    if (elem instanceof Element) {
        var self = this;
        if (!elem.children.length) return list;
        for (let i = 0; i < elem.children.length; i++) {
            var child = elem.children[i];
            list.push(child);
            if (child.children.length) {
                list = getTree(child, list);
            }
        }
    }
    return list;
}
function getParentNodes(elem, list, elementStop) {
    if (typeof elem == "undefined") return [];
    if (typeof list == "undefined" || !Helper.isArray(list)) {
        list = [];
    }
    if (elem instanceof Element) {
        if (!elem.parentNode || (elementStop && elementStop == elem)) return list;
        var self = this;
        list.push(elem.parentNode);
        list = getParentNodes(elem.parentNode, list, elementStop);
    }
    return list;
}


var $window = null, $root = null;

function isQuery(obj) {
    if (!isObject(obj)) return false;
    if (obj.constructor == query || obj.constructor == Query || obj instanceof Query || obj.isQuery || obj.isDomQuery) return true;
    return false;
}

/**
* lớp bao đối tượng
* @param {String|Element|Query} selector
* @param {object} options
*/

function Query(selector, options) {
    // lấy element từ selector
    var elements = this.getDomElements(selector);
    var n = 0;
    for (var index = 0; index < elements.length; index++) {
        this[n] = elements[index];
        n++;
    }
    this.length = n;
    var self = this;

    var data = {};
    var methods = {
        all: function () {
            return elements;
        },
        selector: () => selector
    };
    this.__e = function () {
        if (!arguments.length || typeof arguments[0] != "string") return null;
        var method = arguments[0];
        var r = null;
        if (typeof methods[method] == "function") {
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            r = methods[method].apply(this, args);
        }
        return r;

    };
};
/**
 * Tạo ra các đối tượng dom
 * @param {string|object} options 
 * @param {string|string[]|object[]} children
 * @param {object} attributes Các thuộc tính hoặc vắt sự kiện
 * @returns {Dom|Element}
 */
function Dom(selector, children, attributes) {
    if (!this || (this.constructor != Dom && !(this instanceof Dom))) {
        return create.apply(Dom, arguments);
    }
    this.el = create.apply(Dom, arguments);

    this.Query.call(this, this.el);
};


/**
* lớp bao đối tượng
* @param {String|Element|Query} selector
* @param {object} options
* @returns {Query}
*/

var query = function (selector, options) {
    var a;
    if (selector == document) {
        if ($root) {
            a = $root;
        } else {
            $root = a = new Query(selector, options);
        }
    } else if (selector == global) {
        if ($window) {
            a = $window;
        } else {
            a = $window = new Query(selector, options);
        }
    } else {
        a = new Query(selector, options);
    }
    return a;
}
var $ = query;


Query.prototype = {
    isQuery: true,
    splice: arr.splice,
    constructor: Query,
    toArray: function () {
        return slice.call(this);
    },
    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    /**
     * Get the whole matched element set as a clean array
     * @param {int} num index của phần tử
     */
    get: function (num) {

        // Return all the elements in a clean array
        if (num == null) {
            return slice.call(this);
        }

        // Return just the one element from the set
        return num < 0 ? this[num + this.length] : this[num];
    },

    slice: function () {
        return slice.apply(this, arguments);
    },


    /**
     * lấy danh sach doi tuong dom element 
     * @param {string|Query|Dom|Element} selector dau vao
     * @returns {HTMLAllCollection|Element[]}
     */
    getDomElements: function (selector) {
        if (typeof selector == "undefined") return [];
        var elements = [];
        if (typeof selector == "string") {
            if (selector[0] == "<" && selector[selector.length - 1] == ">") {
                elements.push(parse(selector));
            }
            else if (
                selector.indexOf(" ") >= 0 ||
                selector.indexOf(">") >= 0 ||
                selector.indexOf("]") >= 0 ||
                selector.indexOf("[") >= 0 ||
                selector.indexOf(",") >= 0 ||
                selector.split(".").length >= 3 ||
                selector.split(",").length >= 2 ||
                selector.split("#").length >= 2
            ) {
                elements = document.querySelectorAll(selector) || [];
            }
            else if (selector.split(".").length > 1) {
                elements = document.querySelectorAll(selector) || [];
            }
            else {
                if (selector[0] == "#") {
                    var el = document.getElementById(selector.slice(1));
                    if (el) {
                        elements.push(el);
                    }
                } else if (selector[0] == "." && selector.lastIndexOf(".") == 0) {
                    var elems = document.getElementsByClassName(selector.slice(1));
                    if (elems && elems.length) {
                        elements = elems;
                    }
                } else {
                    var els = document.getElementsByTagName(selector);
                    if (els && els.length) {
                        elements = els;
                    }
                }

            }
        }
        else if (selector instanceof Element || selector.constructor == HTMLHeadingElement || selector.constructor == HTMLElement || isGlobalOrRoot(selector)) {
            elements.push(selector);
        }
        else if (selector.constructor == Dom || selector instanceof Dom) {
            elements.push(selector.el);
        }
        else if (isQuery(selector)) {
            elements = selector.__e("all");
        }
        else if (Helper.isArray(selector)) {
            for (let i = 0; i < selector.length; i++) {
                var elm = selector[i];
                if (elm instanceof Element || elm == document || elm == global) {
                    elements.push(elm);
                }
                else if (elm instanceof Dom || elm.constructor == Dom) {
                    elements.push(elm.el);
                }
            }
        }
        return elements;
    },
    /**
     * thêm sự kiện
     * @param {string} event ten su kien
     * @param {string|function} dataHandler
     * @param {function} handler
     */
    on: function () {
        if (this.length) {
            var args = [];
            var event = typeof arguments[0] == "string" ? arguments[0] : "error";
            for (let i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                args.push(arg)
            }
            var self = this;
            for (let j = 0; j < this.length; j++) {
                var element = this[j];
                let selector = null;

                let fn = null;

                if (args.length == 3) {
                    if (typeof args[2] == "function") {
                        fn = args[2];
                    }
                    if (isQuery(args[1]) || Helper.isString(args[1]) || args[1] instanceof Element || isGlobalOrRoot(arg[1])) {
                        selector = args[1];
                        if (!fn) fn = args[2];
                    } else if (Helper.isFunction(args[1]) && !fn) {
                        fn = args[1];
                    }
                    if (!fn) {
                        // doan này chưa xong
                        // Helper.func.check();
                    }
                } else if (args.length == 2) {
                    fn = args[1];
                }

                let fnc = fn ? fn : function (e) {
                    console.log(e);
                };


                let fnt = fnc;

                if (typeof fn == "string") {
                    fnt = function (e) {
                        return Helper.func.call(fn, [e]);
                    };
                }
                let cb = fnt;
                if (selector) {
                    cb = function (e) {
                        let tag = e.target;
                        let evtag = null;
                        // danh sách phần tữ con dược giới hạn bởi phần tử element
                        let children = getParentNodes(tag, [tag], element);
                        // danh sách phần tữ con trùng khớp với selector
                        var matchChild = query(children).filter(selector).getElements();

                        if (children.length) {
                            for (let n = 0; n < children.length; n++) {
                                var child = children[n];
                                for (let m = 0; m < matchChild.length; m++) {
                                    var em = matchChild[m];
                                    if (child == em && em) {
                                        evtag = em;
                                        m += matchChild.length;
                                        n += children.length;
                                    }
                                }
                            }
                        }
                        if (evtag) {
                            e.stopPropagation();
                            return fnt.apply(evtag, [e, element]);
                        }
                    };
                }
                event.split(" ").filter(function (evt) { return (domEvents.indexOf(evt) >= 0); }).map(function (evt) {
                    addEvent(element, evt, cb, selector);
                });

            }
        }
        return this;
    },
    /**
     * Huỷ sự kiện 
     * @param {string} events Danh sách sự kiện
     * @param {function} data 
     * @returns {Query|Dom}
     */
    off: function (events, data) {
        data = data || null;
        if (this.length) {
            var evs = (events && events.length) ? events.split(" ") : domEvents;
            if (evs.length) {
                for (let i = 0; i < this.length; i++) {
                    var el = this[i];
                    for (let j = 0; j < evs.length; j++) {
                        var ev = evs[j];
                        removeEvent(el, ev, null, data);
                    }
                }

            }
        }
        return this;
    },
    /**
     * Gán sự kiện
     * @param {string} event sự kiện
     * @returns {Query|Dom}
     */
    trigger: function (event) {
        var ev = isString(event) ? event : (event ? event.type : null);
        var e = !isObject(event) ? { type: ev } : event;
        if (this.length) {
            for (let i = 0; i < this.length; i++) {
                var el = this[i];
                if (!e.target) {
                    e.target = el;
                }
                triggerEvent(el, ev, e);
            }


        }
        return this;
    },
    /**
     * Huỳ sự kiện
     */
    unbind: function () {
        this.off.apply(this, arguments);
        return this;
    },
    /**
     * hàm lấy ra các phần tử trong list
     * @param {string} selector 
     * @param {function} filter func dùng để filter
     * @returns {Element[]}
     */
    getElements: function (selector, filter) {
        if (!this.length) {
            return [];
        }
        var elements = [];
        for (let i = 0; i < this.length; i++) {
            if (typeof this[i] != "undefined") {
                var element = this[i];
                elements.push(element);
            }

        }
        if (typeof filter == "function") {
            return elements.filter(filter);
        }
        return elements;
    },
    /**
     * Lặm qua cá phần tử trong lý
     * @param {function(Element, number)} mapFunc hàm dùng để xử lý các phần rử khi lặp qua
     * @returns {Element[]}
     */
    map: function (mapFunc) {
        if (typeof mapFunc != "function") return [];
        var mapArr = [];
        for (let i = 0; i < this.length; i++) {
            if (typeof this[i] != "undefined") {
                var element = this[i];
                let mapEl = mapFunc(element, i);
                if (mapEl !== undefined) mapArr.push(mapEl);
            }
        }
        return mapArr;

    },
    /**
     * lặp qua từng phần tử
     * @param {function(Element, number)} eachFunc 
     * 
     * @returns {Element[]}
     */
    each: function (eachFunc) {
        if (typeof eachFunc != "function") return [];
        var mapArr = [];
        for (let i = 0; i < this.length; i++) {
            if (typeof this[i] != "undefined") {
                var element = this[i];
                let mapEl = eachFunc(i, element);
                if (mapEl !== undefined) mapArr.push();
            }
        }
        return mapArr;
    },
    /**
     * lọc các phần tử trùng khớp
     * @param {string|Element} eachFunc 
     * 
     * @returns {Query|Dom}
     */
    filter: function (selector) {
        var elems = this.getElements();
        var listMatch = query(selector).getElements().filter(function (el) {
            for (let i = 0; i < elems.length; i++) {
                var elem = elems[i];
                if (el == elem) return true;
            }
            return false;
        });
        return query(listMatch);
    },
    /**
     * Lấy ra Wrapper chứa các phần tử con trùng khớp
     * @param {string} selector 
     * @returns {Query|Dom}
     */
    children: function (selector) {
        if (!this.length) return query();
        var childList = [];
        this.map(function (el) {
            if (el.children.length) {
                for (let i = 0; i < el.children.length; i++) {
                    var element = el.children[i];
                    childList.push(element);
                }
            }
        });
        if (!childList.length) return query();
        var children = query(childList);
        if (typeof selector == "undefined" || selector == null) return children;
        return children.filter(selector);

    },
    /**
     * Lấy ra danh sách các parent trùng khớp
     * @param {string} selector 
     * @returns {Query|Dom}
     */
    parent: function (selector) {
        var list = [];
        this.map(function (el) {
            if (el.parentNode) {
                list.push(el.parentNode);
            }
        });
        if (!selector) return query(list);
        var finders = query(selector).getElements();
        var filterList = (finders.length && list.length) ? list.filter(function (el) {
            for (let i = 0; i < finders.length; i++) {
                var element = finders[i];
                if (el == element) return true;
            }
            return false;
        }) : [];
        return query(filterList);
    },
    /**
     * Lấy ra phần tử cha có kết quả trùng khớp
     * @param {string|Element|Query|Dom} selector 
     * @returns {Query|Dom}
     */
    closest: function (selector) {
        if (selector == undefined) return this.parent();
        var finder = query(selector).getElements();
        var closestList = [];
        var findLength = finder.length;
        if (findLength) {
            var elements = this.getElements();
            var elementLength = elements.length;
            var parents = [];
            var parentLength = 0;
            var parent, find;
            if (findLength == 1) {

                finder = finder[0];
                if (elementLength == 1) {
                    parents = getParentNodes(elements[0]);
                } else {
                    for (let i = 0; i < elementLength; i++) {
                        var element = elements[i];
                        let ps = getParentNodes(element);
                        ps.map(function (p) {
                            parents.push(p);
                        });
                    }
                }
                parentLength = parents.length;
                for (let n = 0; n < parentLength; n++) {
                    parent = parents[n];
                    if (parent == finder) {
                        if (closestList.indexOf(parent) < 0) {
                            closestList.push(parent);
                        }

                        n += parentLength;
                        break;
                    }
                }
            } else {
                if (elementLength == 1) {
                    parents = getParentNodes(elements[0]);
                } else {
                    for (let i = 0; i < elementLength; i++) {
                        var element = elements[i];
                        let ps = getParentNodes(element);
                        ps.map(function (p) {
                            parents.push(p);
                        });
                    }
                }
                parentLength = parents.length;

                for (let n = 0; n < parentLength; n++) {
                    parent = parents[n];
                    for (let m = 0; m < findLength; m++) {
                        find = finder[m];
                        if (parent == find) {
                            if (closestList.indexOf(parent) < 0) {
                                closestList.push(parent);
                            }

                            m += findLength;
                        }
                    }
                }
            }
        }
        return query(closestList);
    },
    /**
     * Kiểm tra phần từ có trùng khớp với trạng thái hay phần tử đầu vào hay không
     * @param {string|Element} selector 
     * @returns {boolean}
     */
    is: function (selector) {
        if (this.length == 1) {

            if (Helper.isString(selector) && selector.length > 1 && selector.substring(0, 1) == ":") {
                var s = selector.substring(1);
                return (typeof this[0][s] != 'undefined' && this[0][s]) ? true : false;
            }
            var $list = query(selector);
            if ($list.filter(this[0]).length == 1) {
                return true;
            }
        }
        return false;
    },
    /**
     * lấy ra các phan622 tử con trùng khớp
     * @param {string} selector 
     * @returns {Query|Dom}
     */
    find: function (selector) {
        if (typeof selector == "undefined" || !selector) return query();
        var listChild = [];
        var self = this;
        this.map(function (el) {
            var ch = el.querySelectorAll(selector) || [];
            var l = ch.length;
            if (l) {
                for (let i = 0; i < l; i++) {
                    var c = ch[i];
                    listChild.push(c);
                }
            }

        });
        return query(listChild);
    },
    /**
     * lấy ra phần tử có index trùng khớp với số dầu váo
     * @param {number} index 
     * @returns {Query|Dom}
     */
    get: function get(index) {
        if (typeof index == "undefined") return this;
        if (Helper.isNumber(index)) {
            var elements = this.getElements();
            if (typeof elements[index] != "undefined") {
                return query(elements[index]);
            }
        }
        return query();
    },
    /**
     * lấy ra wrapper của phần tử đầu tiên trong danh sách
     * @returns {Query|Dom}
     */
    first: function () {
        return query(this.length ? this.getElements(null, function (el, i) {
            return i == 0;
        }) : [])
    },
    /**
     * lấy ra phần tử cuối cùng
     * @returns {Query|Dom}
     */
    last: function () {
        var elements = this.getElements();
        return query(elements.length ? elements[elements.length - 1] : []);
    },

    /**
     * Thêm phần tử con vào cuối danh danh sách phần tử con cvua3 element
     * @param {*} child 
     * @returns {Query|Dom}
     */
    append: function (child) {
        if (typeof child == "undefined") return this;
        if (child.constructor == Dom) {
            this.map(function (el) {
                el.appendChild(child.el);
            });
        } else {
            this.map(function (el) {
                el.appendChild(parse(child));
            });

        }

        return this;
    },
    /**
     * Thêm phần tử con vào Đầu danh sách phần tử con cvua3 element
     * @param {*} child 
     * @returns {Query|Dom}
     */
    prepend: function (child) {
        if (typeof child == "undefined") return this;
        if (child.constructor == Dom) {
            this.map(function (el) {
                el.insertBefore(parse(child.el), el.firstChild);
            });
        } else {
            this.map(function (el) {
                el.insertBefore(parse(child), el.firstChild);
            });

        }
        return this;
    },

    /**
     * Thêm phần tử con vào cuối danh danh sách phần tử con cvua3 element
     * @param {*} parent 
     * @returns {Query|Dom}
     */

    appendTo: function (parent) {
        if (typeof parent == "undefined") return this;
        if (parent.constructor == Dom || parent instanceof Dom) {
            this.map(function (el) {
                parent.append(el);
            });
        } else if (parent instanceof Element) {
            this.map(function (el) {
                parent.appendChild(el);
            });

        } else if (isQuery(parent)) {
            this.map(function (el) {
                parent.append(el);
            });

        }
        return this;
    },
    prependTo: function (parent) {
        if (typeof parent == "undefined") return this;
        if (parent.constructor == Dom || parent instanceof Dom) {
            this.map(function (el) {
                parent.prepend(el);
                // el.insertBefore(parse(child.el), el.firstChild);
            });
        } else if (parent instanceof Element) {
            this.map(function (el) {
                parent.insertBefore(el, parent.firstChild);
            });

        }
        else if (isQuery(parent)) {
            this.map(function (el) {
                parent.prepend(el);
            });

        }


        return this;
    },
    /**
     * xoá phần tử khỏi DOM
     */
    remove: function () {
        this.map(function (el) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            } else if (el.remove && Helper.isFunction(el.remove)) {
                el.remove();
            }
        });
        return this;
    },

    getProp: function (prop, all) {
        if (!this.length) return "";
        if (!all) {
            return (typeof this[0][prop] != "undefined") ? this[0][prop] : null;
        } else {
            var p = [];
            this.map(function (el) {
                p.push(el[prop]);
            });
            return p;
        }
    },
    setProp: function (prop, value) {
        if (!this.length) return this;
        var props = {};
        if (typeof prop == "object") {
            props = pros
        } else {
            props[prop] = value;
        }
        var elements = this.getElements();
        for (var p in props) {
            if (props.hasOwnProperty(p)) {
                var val = props[p];
                elements.map(function (element, index) {
                    element[prop] = val;
                });
            }
        }

        return this;
    },
    removeProp: function (prop) {
        if (typeof prop != "undefined") {
            var elements = this.__e("all");
            if (Helper.isString(prop)) prop = [prop];
            if (Helper.isArray(prop)) {
                elements.map(function (el) {
                    prop.map(function (p) {
                        if (Helper.isString(p)) {
                            delete el[p];
                        }
                    })
                });
            }
        }
        return this;
    },
    /**
     * 
     * @param {string|string{}} prop 
     * @param {*} value 
     */
    prop: function (prop, value) {
        if (prop) {
            if (typeof value != "undefined") {
                if (!this.length) return this;
                this.map(function (el) {
                    if (value === false) delete el[prop];
                    else el[prop] = value;
                });
            } else {
                if (!this.length) return null;
                return this[0][prop] || null;
            }
        } else {
            if (!this.length) return {};
            var props = {};
            for (var key in this[0]) {
                if (this[0].hasOwnProperty(key)) {
                    var propVal = this[0][key];
                    props[key] = propVal;
                }
            }
            return props;
        }
    },
    val: function (value) {
        if (typeof value == "undefined" || value === null) {
            if (!this.length) return null;
            var inputs = this.getElements().filter(function (el) {
                if (isGlobalOrRoot(el)) return false;
                var tag = el.tagName.toLowerCase();
                return (["input", "select", "textarea"].indexOf(tag) >= 0);
            });
            if (inputs.length) {
                for (let i = 0; i < inputs.length; i++) {
                    var input = inputs[i];
                    let tag = input.tagName.toLowerCase();
                    let type = input.getAttribute("type");
                    if (tag == "textarea" || type == "textarea") {
                        return input.value || input.innerText;
                    } else if (["rasio", "checkbox"].indexOf(type) >= 0) {
                        if (input.checked) {
                            if (input.value != undefined) {
                                return input.value;
                            } else {
                                return "on";
                            }
                        }
                        return null;
                    }
                    else {
                        return input.value;
                    }

                }
            }
            return null;
        } else {
            var inputs = this.getElements().filter(function (el) {
                if (isGlobalOrRoot(el)) return false;
                var tag = el.tagName.toLowerCase();
                return (["input", "select", "tetxtarea"].indexOf(tag) >= 0);
            });
            if (inputs.length) {
                for (let i = 0; i < inputs.length; i++) {
                    var input = inputs[i];
                    let tag = input.tagName.toLowerCase();
                    if (tag == "textarea") {
                        input.innerText = value
                    } else {
                        input.value = value;
                    }

                }
            }
        }

        return this;
    },
    serialize: function () {
        if (!this.length || isGlobalOrRoot(this[0]) || this[0].tagName.toLowerCase() != "form") return "";
        var form = this[0];

        // Setup our serialized data
        var serialized = [];

        // Loop through each field in the form
        for (var i = 0; i < form.elements.length; i++) {

            var field = form.elements[i];

            // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
            if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

            // If a multi-select, get all selections
            if (field.type === 'select-multiple') {
                for (var n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected) continue;
                    serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
                }
            }

            // Convert field data to a query string
            else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
            }
        }

        return serialized.join('&');

    },
    /*!
    * Serialize all form data into a array
    * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
    * @param  {Node}   form The form to serialize
    * @return {array}      The serialized form data
    */
    serializeArray: function () {
        if (!this.length || isGlobalOrRoot(this[0]) || this[0].tagName.toLowerCase() != "form") return [];
        var form = this[0];
        // Setup our serialized data
        // Setup our serialized data
        var serialized = [];
        // Loop through each field in the form
        for (var i = 0; i < form.elements.length; i++) {
            var field = form.elements[i];
            // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
            if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'button') continue;
            // If a multi-select, get all selections
            if (field.type === 'select-multiple') {
                for (var n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected) continue;
                    serialized.push({
                        name: field.name,
                        value: field.options[n].value
                    });
                }
            }

            // Convert field data to a query string
            else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                serialized.push({
                    name: field.name,
                    value: field.value
                });
            }
        }
        return serialized;
    },


    formdata: function () {
        if (!this.length || isGlobalOrRoot(this[0]) || this[0].tagName.toLowerCase() != "form") return [];
        var form = this[0];
        // Setup our serialized data

        // Setup our serialized data
        var f = new FormData(form);
        return f;

    },
    serializeObject: function () {
        var serialized = this.serializeArray();
        var data = {};
        serialized.map(function (inp) {
            if (typeof data[inp.name] != undefined) {
                if (Helper.getType(data[inp.name]) == 'array') {
                    data[inp.name].push(inp.value);
                } else {
                    data[inp.name] = [data[inp.name]];
                }
            } else {
                data[inp.name] = inp.value;
            }
        });
        return data;
    },

    getHtml: function (all, joinKey) {
        if (!this.length) return "";
        if (!all && !isGlobalOrRoot(this[0])) {
            return this[0].innerHTML;
        } else {
            var html = "";
            if (!joinKey) joinKey = "";
            html = this.getElements().map(function (el) { return (isGlobalOrRoot(el)) ? "" : el.innerHTML; }).join(joinKey);
            return html;
        }
    },
    html: function (str, all) {
        if (this.length) {
            if (typeof str == "undefined" || str === null) {
                return this.getHtml(all, "");
            } else {
                var self = this;
                var elements = this.getElements(null, function (el) {
                    if (isGlobalOrRoot(el)) return false;
                    var tag = el.tagName.toLowerCase();
                    return simpleTags.indexOf(tag) < 0;
                }).map(function (el) {
                    el.innerHTML = str;
                });

            }
        }
        return this;
    },
    getAttribute: function (attr) {
        return this.length > 0 ? this[0].getAttribute(attr) : null;
    },
    setAttribute: function (attr, value) {
        this.getElements().map(function (el) { el.setAttribute(attr, value) });
        return this;
    },
    attr: function (attr, value) {
        if (typeof attr == "undefined" || attr === null) {
            return this.length ? this[0].attributes : {};
        }
        else if ((typeof value == "undefined" || value === null) && typeof attr != "object") {
            return this.getAttribute(attr);
        }
        else if (typeof attr != "undefined" && getType(attr) == "object") {
            var elements = this.getElements();
            for (var key in attr) {
                if (attr.hasOwnProperty(key)) {
                    var ava = attr[key];
                    elements.map(function (t) {
                        t.setAttribute(key, ava);
                    })
                }
            }
        }

        return this.setAttribute(attr, value)
    },
    data: function (key) {
        if (!this.length) return null;
        if (!this.__data) {
            var data = {};
            var dataRaw = {};

            var attrs = this[0].attributes;
            if (attrs.length) {
                for (let i = 0; i < attrs.length; i++) {
                    var attr = attrs[i];
                    if (attr.name.toLowerCase().indexOf("data-") === 0) {
                        let a = attr.name.substring(5);
                        dataRaw[a] = attr.value;
                        let b = a.split("-");
                        let c = b.shift();
                        let d = b.map(function (v) { return Helper.str.ucfirst(v) });
                        let k = c + (d.length ? d.join("") : "");
                        data[k] = attr.value;
                    }
                }
            }
            this.__data = {
                raw: dataRaw,
                parse: data
            };
        }
        if (typeof key == "undefined" || key == null) {
            return this.__data.parse;
        }
        if (typeof key == "string") {
            return (typeof this.__data.raw[key] != "undefined") ? this.__data.raw[key] : null;
        }
        if (Helper.isArray(key)) {
            var arrData = {};
            for (let i = 0; i < key.length; i++) {
                var kk = key[i];
                if (typeof this.__data.raw[kk] != "undefined") {
                    arrData[kk] = this.__data.raw[kk];
                }
            }
            return arrData;
        }
        return null;
    },
    addClass: function (classname) {
        var classlist = [];
        var mapFunc = function (val) {
            if (Helper.isString(val)) {
                classlist.push(val);
            } else if (Helper.isArray(val)) {
                val.map(mapFunc);
            }
        };
        if (arguments.length) {
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (isString(arg)) {
                    mapFunc(arg.split(" ").map(function (v) {
                        return v.trim();
                    }).filter(function (v) { return v.length > 0 }));
                } else {
                    mapFunc(arg);
                }

            }

        }
        this.getElements(null, function (el) { return !isGlobalOrRoot(el); }).map(function (el) {
            classlist.map(function (str) {
                el.classList.add(str);
            });
        });
        return this;
    },
    removeClass: function (classname) {
        var elems = this.getElements(null, function (el) { return !isGlobalOrRoot(el); });
        var classlist = [];
        var mapFunc = function (val) {
            if (Helper.isString(val)) {
                classlist.push(val);
            } else if (Helper.isArray(val)) {
                val.map(mapFunc);
            }
        };
        var args = [];

        if (arguments.length) {
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (isString(arg)) {
                    mapFunc(arg.split(" ").map(function (v) {
                        return v.trim();
                    }).filter(function (v) { return v.length > 0 }));
                } else {
                    mapFunc(arg);
                }
            }
            elems.map(function (el) {
                classlist.map(function (str) {
                    el.classList.remove(str);
                });
            });
        } else {
            elems.map(function (el) {
                el.className = "";
            });
        }
        return this;
    },
    hasClass: function (classname) {
        if (this.length) {
            return this.length == this.getElements(null, function (el) { return (!isGlobalOrRoot(el) && el.classList.contains(classname)) }).length;
        }
        return false;
    },

    css: function (prop, value) {
        var self = this;
        if (!this.length) {
            return {};
        }
        else if (!prop) {
            return this[0].style;
        }
        else if (isString(prop) && isEmpty(value)) {
            var style = this[0].style;
            var p = Str.camelToSlug(prop, '-');
            var s = p[0].toLowerCase() + prop.substr(1);
            if (Object.hasOwnProperty.call(style, p)) return style[p];
            if (Object.hasOwnProperty.call(style, s)) return style[s];
            return "";
        }
        if (Helper.isString(prop)) {
            this.map(function (e) {
                setCssProp(e, prop, value);
            });
        } else if (Helper.isObject(prop)) {
            this.map(function (e) {
                for (var key in prop) {
                    if (prop.hasOwnProperty(key)) {
                        var v = prop[key];
                        setCssProp(e, key, v);
                    }
                }
            });
        }
        return this;
    },
    height: function (height) {
        return typeof height == "undefined" ? (this.length ? (this[0].clientHeight || this[0].offsetHeight) : 0) : this.css({ height: height });
    },
    width: function (width) {
        return typeof width == "undefined" ? (this.length ? (this[0].clientWidth || this[0].offsetWidth) : 0) : this.css({ width: width });
    },
    show: function (time, callback) {
        var self = this;
        var t = Helper.isNumber(time) ? parseInt(time) : 0;
        var cb = Helper.isCallable(time) ? time : (Helper.isCallable(callback) ? callback : emptyFunc);
        this.css("display", "block");
        if (t > 0) {
            var vpt = 1 / time;
            var opc = 0;
            this.map(function (e) {
                var opacity = getCssProp(e, "opacity");
                if (opacity == "1") {
                    setTimeout(function () {
                        cb.call(e);
                    }, t);
                    return;
                }
                self.setCssProp(e, "opacity", 0);
                for (let i = 0; i < t; i++) {
                    setTimeout(function () {
                        opc += vpt;
                        setCssProp(e, "opacity", opc);
                    }, i + 1);
                }
                setTimeout(function () {
                    setCssProp(e, "opacity", 1);
                    cb.call(e);
                }, t);
            });
        } else {
            this.map(function (e) {
                var opacity = getCssProp(e, "opacity");
                if (opacity == "1") {
                    cb.call(e);
                    return;
                }
                setCssProp(e, "opacity", 1);
                cb.call(e);
            });
        }
        return this;
    },
    /**
     * 
     * @param {int} time thời gian tinh bang ms
     * @param {function} callback làm gì đó sau khi hoàn thành
     */
    hide: function (time, callback) {
        var self = this;
        var t = Helper.isNumber(time) ? parseInt(time) : 0;
        var cb = Helper.isCallable(time) ? time : (Helper.isCallable(callback) ? callback : emptyFunc);

        if (t > 0) {
            var vpt = 1 / time;
            var opc = 1;
            this.map(function (e) {
                var opacity = getCssProp(e, "opacity");
                if (opacity == "0" || opacity == "") {
                    setTimeout(function () {
                        cb.call(e);
                        setCssProp(e, "display", "none");
                    }, t);
                    return;
                }
                for (let i = 0; i < t; i++) {
                    setTimeout(function () {
                        opc -= vpt;
                        setCssProp(e, "opacity", opc);
                    }, i + 1);
                }
                setTimeout(function () {
                    setCssProp(e, "opacity", 0);
                    setCssProp(e, "display", "none");
                    cb.call(e);
                }, t);
            });
        } else {
            this.map(function (e) {
                setCssProp(e, "opacity", 0);
                setCssProp(e, "display", "none");
                cb.call(e);
            });
        }

        return this;
    }


};
function addQueryEvent(ev) {
    Query.prototype[ev] = function (fn) {
        var args = [ev];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        if (args.length == 1) {
            this.map(function (el) {
                if (el[ev] != undefined && Helper.isFunction(el[ev])) {
                    el[ev].call(el);
                }
            });
            return this;
        }
        return this.on.apply(this, args);

    }
}
for (var i = 0; i < domEvents.length; i++) {
    var ev = domEvents[i];
    addQueryEvent(ev);
}

/**
* triển khai thêm module
* @param {object|string} moduleName
* @param {*} moduleData
*/
var addQueryModule = function (moduleName, moduleData) {
    if (moduleName) {
        if (Helper.isString(moduleName) && !Helper.isNumber(moduleName)) {
            Query.prototype[moduleName] = moduleData;
        } else if (Helper.isObject(moduleName)) {
            for (var key in moduleName) {
                if (moduleName.hasOwnProperty(key)) {
                    var val = moduleName[key];
                    Query.prototype[key] = val;
                }
            }
        }
    }
}

Query.extends = addQueryModule;
query.extends = addQueryModule;
Object.assign(Dom.prototype, Query.prototype, {
    isDomQuery: true,
    constructor: Dom,
    Query: Query
});
Dom.addEventListener = addEventListener;
Dom.removeEventListener = removeEventListener;
Dom.simpleTags = simpleTags;
Dom.getInf = getDomInf;
Dom.parse = parse;
Dom.create = create;
Dom.input = input;
Dom.encode = encode;
Dom.decode = decode;
Dom.render = render;
Dom.parseClass = parseClass;
Dom.make = make;
Dom.addEvent = addEvent;
Dom.removeEvent = removeEvent;
Dom.getEvents = getEvents;
Dom.getEventData = getEventData;
Dom.Query = Query;
Dom.query = query;
Dom.$ = $;
Dom.addQueryModule = addQueryModule
Dom.eventList = domEvents;
Dom.isDomEvent = isDomEvent;


var html = Dom;
export default Dom;
export { html, create, $, query, Query }