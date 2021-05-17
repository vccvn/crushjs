import Helper, { assignValue, assignWithout, cl, date, getArguments, getType, inArray, isArray, isBoolean, isEmpty, isFunction, isNull, isObject, isString, Str, _defineProperty, _instanceof } from './helper.js';
// import Dom, { $, Query, query } from './dom.js';
import createClass from './es5.class.js';
import Dom, { getDomInf } from './dom.js';


/**
 * Tạo đối tượng dom
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children
 * @param {object} attributes
 * @returns {Html}
 * @note {string} Đoạn này thật ra không cần thiết. nhưng viết bào để trình soạn thảo sử dụng gợi ỳ
 */
 var Html = function Html(selector, children, attributes) {
    this.setup.apply(this, getArguments(arguments));
    this.isHtml = true;
};

Object.assign(Html.prototype, {
    isHtml: true
}, {
    constructor: Html
});
Html = createClass("Html", false).extends(Dom)({
    const$isHtml: true
});

function createTagClass(tag) {
    return createClass(Str.ucfirst(tag), false).extends(Html)({
        const$tagName: tag,
        constructor: function constructor() {
            var args = getArguments(arguments);
            if (args.length && isString(args[0])) {
                var a = getDomInf(args[0]);
                if (a.isElement) {
                    if (a.isDefault) {
                        args[0] = tag.toLowerCase() + args[0];
                    } else {
                        args[0] = this.tagName + args[0].substr(a.tagName.length);
                    }
                }
                else {
                    args.unshift(this.tagName);
                }
            }
            else {
                args.unshift(this.tagName);
            }

            this.setElement.apply(this, args);
        }
    });
}
function checkImageURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null || url.match(/^(http|https)\:\/\//) != null);
}
/**
 * Tạo một lớp đối tượng
 * @param {string} tag tên thẻ bạn muốn khởi tạo
 * @returns {Html}
 */
function createElementClass(tag, properties) {
    var prop = {};
    if (isObject(properties)) {
        for (var key in properties) {
            if (Object.hasOwnProperty.call(properties, key)) {
                var fn = properties[key];
                if (key == "constructor") {
                    if (typeof fn == "function") prop.__constructor__ = fn;
                }
                else {
                    prop[key] = fn;
                }
            }
        }
    }
    var t = tag.toLowerCase();
    var classProps = {
        const$tagName: tag,
        constructor: function constructor() {
            var args = getArguments(arguments);
            if (args.length && isString(args[0])) {
                if (args[0].match(/^(\.|\#|\[|\:)[A-Za-z_\-]+/i) !== null) {
                    var a = getDomInf(args[0]);
                    if (a.isElement) {
                        if (a.isDefault) {
                            args[0] = tag.toLowerCase() + args[0];
                        } else {
                            args[0] = this.tagName + args[0].substr(a.tagName.length);
                        }
                    }
                    else {
                        args.unshift(this.tagName);
                    }
                }
                else {
                    args.unshift(this.tagName);
                    if (args[0].match(/^\{.*\}$/i) !== null) {
                        args[0] = args[0].substr(1, args[0].length - 2);
                    }
                }
    
            }
            else {
                args.unshift(this.tagName);
            }
    
            this.setElement.apply(this, args);
        }
    };
    classProps['const$is' + Str.ucfirst(t)] = true;
    if (t == 'img') {
        assignValue(classProps, {
            const$isImage: true,
            $srcSync: false,
            $src: null,
            inits: '__src_init__', 
            onGet$src: function(value){
                // return this.val();
            },
            onset$src: function(value){
                if(this.srcSync) this.attr('src',value);
            },
            __src_init__: function(){
                this.src = this.attr('src');
                var self = this;
                this.on('change', function(e){
                    var value = this.attr('src');
                    if(value != self.src){
                        self.valueSync = false;
                        self.src = value;
                        self.srcSync = true;
                    }
                });
                this.srcSync = true;
            }, 
            constructor: function constructor() {
                var args = getArguments(arguments);
                var src = null;
                var createArgs = [];
                var attrs = {};
                var hasTag = false;
                for (var index = 0; index < args.length; index++) {
                    var vl = args[index];
                    if (index == 0) {
                        if (isString(vl)) {
                            if (checkImageURL(vl)) {
                                src = vl;
                                createArgs.unshift(this.tagName);
                            } else {
                                var a = getDomInf(vl);
                                if (a.isElement) {
                                    if (a.isDefault) {
                                        createArgs.push(tag.toLowerCase() + args[0]);
                                        hasTag = true;
                                    } else {
                                        createArgs.push(this.tagName + args[0].substr(a.tagName.length));
                                        hasTag = true;
                                    }
                                }
                                else {
                                    createArgs.unshift(this.tagName);
                                }
                            }
    
                        }
                        else {
                            createArgs.unshift(this.tagName);
                            assignValue(attrs, vl);
                        }
                    }
                    else {
                        if (isString(vl)) {
                            if (!src && checkImageURL(vl)) {
                                src = vl;
                            }
                            else {
                                attrs.alt = vl;
                            }
    
                        }
                        else if (isObject(vl)) {
                            assignValue(attrs, vl);
                        }
                    }
                }
    
                if (src && !attrs.src) attrs.src = src;
                createArgs.push(attrs);
    
                this.setElement.apply(this, createArgs);
            }
        });
    }
    else if (t == 'input') {
        assignValue(classProps, {
            $valueSync: false,
            $value: null,
            inits: '__value_init__', 
            onGet$Value: function(value){
                // return this.val();
            },
            onset$value: function(value){
                if(this.valueSync) this.val(value);
            },
            __value_init__: function(){
                this.value = this.val();
                var self = this;
                this.on('change', function(e){
                    var value = this.val();
                    if(value != self.value){
                        self.valueSync = false;
                        self.value = value;
                        self.valueSync = true;
                    }
                });
                this.valueSync = true;
            },
            constructor: function constructor() {
                var args = getArguments(arguments);
                // nếu nhập vào ("select", "name", "value", data)
                var createArgs = [];
                var domEls = [];
                if (args.length) {
                    if (isObject(args[0]) && !args[0].isDom) {
    
                        createArgs.push(args[0])
    
                    }
                    else {
                        var inputOptions = {
                            type: "",
                            name: "",
                            value: "",
                            default: "",
                            data: {}
                        }
                        var s = 0;
                        var domEls = [];
                        for (var index = 0; index < args.length; index++) {
                            var vl = args[index];
    
                            if (isString(vl)) {
                                var vlow = String(vl).toLowerCase();
                                if (!s) {
                                    var a = getDomInf(vl);
                                    if (inputTypes.indexOf(vlow) !== -1 || inputTags.indexOf(vlow) !== -1) {
                                        inputOptions.type = vlow;
                                        s++;
                                    }
                                    else if (a.isElement) {
                                        var tg = a.tagName.toLowerCase();
                                        if (inputTypes.indexOf(tg) !== -1) {
                                            inputOptions.type = tg;
                                        }
                                        else if (inputTags.indexOf(tg) != -1) {
                                            inputOptions.type = tg;
                                        }
                                        s++;
                                        if (!isEmpty(a.attrs)) {
                                            assignValue(inputOptions, a.attrs);
                                        };
                                        if (!isEmpty(a.props)) assignValue(inputOptions, a.props);
                                        if (a.className) {
                                            inputOptions.className = a.className;
                                        }
                                        if (a.id) {
                                            inputOptions.id = a.id;
                                        }
    
                                    } else {
                                        inputOptions.name = vl;
                                        s++;
                                    }
    
                                }
                                else if (index < 3) {
                                    if ((inputOptions.name && inputTypes.indexOf(vlow) !== -1 || inputTags.indexOf(vlow) !== -1) && !inputOptions.type) {
                                        inputOptions.type = vlow;
                                    }
                                    else if (!inputOptions.name && vl.match(/^[A-z_]+[A-z_\[\]0-9\.\-]*$/i) != null) {
                                        inputOptions.name = vl;
                                    }
                                    else {
                                        inputOptions.value = vl;
                                    }
                                }
                            }
                            else if (isObject(vl)) {
                                if (vl.isDom) {
                                    domEls.push(vl);
                                }
                                else {
                                    assignValue(inputOptions, vl);
                                }
    
                            }
    
    
                        }
                        if (!inputOptions.type) inputOptions.type = 'text';
                        createArgs.push(inputOptions);
                    }
                }
                if (createArgs.length) {
                    var elem = input.apply(this, createArgs);
                    var el = elem.el;
                    if (el) {
    
                        if (!el.id && this.id) el.id = this.id;
                        if (!el.className && this.className) el.className = this.className;
    
                        this.el = el;
                        if (!isEmpty(elem.dynamicAttrs)) {
                            this.addDynamicAttr(elem.dynamicAttrs);
                        }
                        // console.log(this, args, elem.contents);
                        if (elem.tag == 'select' && !isEmpty(elem.contents)) {
                            this.setHtml(Div(elem.contents).html());
    
                        }
                        if (!isEmpty(elem.events)) {
                            this.on(elem.events);
                        }
    
                        // DoanDepTrai
                        if (!isEmpty(elem.methods)) {
                            for (var method in elem.methods) {
                                if (Object.hasOwnProperty.call(elem.methods, method)) {
                                    var fn = elem.methods[method];
                                    // console.log(method, fn)
                                    _defineProperty(this, method, fn);
                                }
                            }
                        }
                        if (this._pendingContents.length) {
                            while (this._pendingContents.length) {
                                var a = this._pendingContents.shift();
                                this[a.key] = a.content;
                                this.append(a.content);
                            }
                        }
                    }
                }
    
            }
        });
    }
        
    return createClass(Str.ucfirst(tag), false).extends(Dom).uses(prop)(classProps);
}



/**
 * Tạo đối tượng a 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var A = function A(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng abbr 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Abbr = function Abbr(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng acronym 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Acronym = function Acronym(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng address 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Address = function Address(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng applet 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Applet = function Applet(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng area 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Area = function Area(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng article 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Article = function Article(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng aside 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Aside = function Aside(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng audio 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Audio = function Audio(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng b 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var B = function B(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng base 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Base = function Base(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng basefont 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Basefont = function Basefont(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng bb 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Bb = function Bb(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng bdo 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Bdo = function Bdo(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng big 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Big = function Big(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng blockquote 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Blockquote = function Blockquote(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng body 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Body = function Body(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng br 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Br = function Br(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng button 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Button = function Button(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng canvas 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Canvas = function Canvas(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng caption 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Caption = function Caption(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng center 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Center = function Center(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng cite 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Cite = function Cite(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng code 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Code = function Code(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng col 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Col = function Col(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng colgroup 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Colgroup = function Colgroup(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng command 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Command = function Command(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng datagrid 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Datagrid = function Datagrid(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng datalist 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Datalist = function Datalist(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng dd 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Dd = function Dd(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng del 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Del = function Del(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng details 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Details = function Details(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng dfn 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Dfn = function Dfn(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng dialog 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Dialog = function Dialog(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng dir 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Dir = function Dir(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng div 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Div = function Div(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng dl 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Dl = function Dl(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng dt 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Dt = function Dt(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng em 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Em = function Em(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng embed 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Embed = function Embed(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng eventsource 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Eventsource = function Eventsource(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng fieldset 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Fieldset = function Fieldset(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng figcaption 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Figcaption = function Figcaption(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng figure 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Figure = function Figure(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng font 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Font = function Font(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng footer 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Footer = function Footer(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng form 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Form = function Form(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng frame 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Frame = function Frame(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng frameset 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Frameset = function Frameset(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng h1 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var H1 = function H1(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng h2 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var H2 = function H2(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng h3 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var H3 = function H3(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng h4 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var H4 = function H4(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng h5 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var H5 = function H5(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng h6 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var H6 = function H6(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng head 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Head = function Head(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng header 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Header = function Header(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng hgroup 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Hgroup = function Hgroup(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng hr 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Hr = function Hr(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng i 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var I = function I(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng iframe 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Iframe = function Iframe(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };

/**
 * Tạo đối tượng img 
 * @param {string|object} selector
 * @param {object} attributes
 * @returns {Html}
 */
var Img = function Img(selector, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };


/**
 * Tạo đối tượng input 
 * @param {string} type
 * @param {string} name
 * @param {string} value
 * @param {object} attributes
 * @returns {Html}
 */
var Input = function Input(type, name, value, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };

/**
 * Tạo đối tượng ins 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Ins = function Ins(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng isindex 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Isindex = function Isindex(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng kbd 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Kbd = function Kbd(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng keygen 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Keygen = function Keygen(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng label 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Label = function Label(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng legend 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Legend = function Legend(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng li 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Li = function Li(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng link 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Link = function Link(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng map 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Map = function Map(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng mark 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Mark = function Mark(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng menu 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Menu = function Menu(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng meta 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Meta = function Meta(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng meter 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Meter = function Meter(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng nav 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Nav = function Nav(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng noframes 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Noframes = function Noframes(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng noscript 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Noscript = function Noscript(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng ol 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Ol = function Ol(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng optgroup 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Optgroup = function Optgroup(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng option 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Option = function Option(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng output 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Output = function Output(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng p 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var P = function P(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng param 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Param = function Param(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng pre 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Pre = function Pre(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng progress 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Progress = function Progress(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng q 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Q = function Q(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng rp 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Rp = function Rp(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng rt 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Rt = function Rt(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng ruby 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Ruby = function Ruby(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng s 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var S = function S(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng samp 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Samp = function Samp(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng script 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Script = function Script(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng section 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Section = function Section(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng select 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Select = function Select(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng small 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Small = function Small(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng source 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Source = function Source(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng span 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Span = function Span(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng strike 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Strike = function Strike(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng strong 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Strong = function Strong(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng style 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Style = function Style(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng sub 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Sub = function Sub(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng sup 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Sup = function Sup(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng table 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Table = function Table(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng tbody 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Tbody = function Tbody(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng td 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Td = function Td(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng textarea 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Textarea = function Textarea(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng tfoot 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Tfoot = function Tfoot(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng th 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Th = function Th(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng thead 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Thead = function Thead(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng time 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Time = function Time(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng title 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Title = function Title(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng tr 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Tr = function Tr(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng track 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Track = function Track(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng tt 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Tt = function Tt(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng u 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var U = function U(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng ul 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Ul = function Ul(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng video 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Video = function Video(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };
/**
 * Tạo đối tượng wbr 
 * @param {string|object} selector
 * @param {string|Element|string[]|Element[]} children 
 * @param {object} attributes
 * @returns {Html}
 */
var Wbr = function Wbr(selector, children, attributes) { this.setup.apply(this, getArguments(arguments)); this.isHtml = true; };


function input(args) {
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
                        content.push(createEl('option', text, option));
                    }
                }
            }
        } else if (type == "textarea") {
            content = value;
        } else {
            content = attributes;
        }
        return create.call(this, tagName, attributes, content, boot, init);
    }
    return null;
};


A = createElementClass("a"); Abbr = createElementClass("abbr"); Acronym = createElementClass("acronym"); Address = createElementClass("address"); Applet = createElementClass("applet"); Area = createElementClass("area"); Article = createElementClass("article"); Aside = createElementClass("aside"); Audio = createElementClass("audio");
B = createElementClass("b"); Base = createElementClass("base"); Basefont = createElementClass("basefont"); Bb = createElementClass("bb"); Bdo = createElementClass("bdo"); Big = createElementClass("big"); Blockquote = createElementClass("blockquote"); Body = createElementClass("body"); Br = createElementClass("br"); Button = createElementClass("button");
Canvas = createElementClass("canvas"); Caption = createElementClass("caption"); Center = createElementClass("center"); Cite = createElementClass("cite"); Code = createElementClass("code"); Col = createElementClass("col"); Colgroup = createElementClass("colgroup"); Command = createElementClass("command");
Datagrid = createElementClass("datagrid"); Datalist = createElementClass("datalist"); Dd = createElementClass("dd"); Del = createElementClass("del"); Details = createElementClass("details"); Dfn = createElementClass("dfn"); Dialog = createElementClass("dialog"); Dir = createElementClass("dir"); Div = createElementClass("div"); Dl = createElementClass("dl"); Dt = createElementClass("dt");
Em = createElementClass("em"); Embed = createElementClass("embed"); Eventsource = createElementClass("eventsource");
Fieldset = createElementClass("fieldset"); Figcaption = createElementClass("figcaption"); Figure = createElementClass("figure"); Font = createElementClass("font"); Footer = createElementClass("footer"); Form = createElementClass("form"); Frame = createElementClass("frame"); Frameset = createElementClass("frameset");
H1 = createElementClass("h1"); H2 = createElementClass("h2"); H3 = createElementClass("h3"); H4 = createElementClass("h4"); H5 = createElementClass("h5"); H6 = createElementClass("h6"); Head = createElementClass("head"); Header = createElementClass("header"); Hgroup = createElementClass("hgroup"); Hr = createElementClass("hr");
I = createElementClass("i"); Iframe = createElementClass("iframe"); Img = createElementClass("img"); Input = createElementClass("input"); Ins = createElementClass("ins"); Isindex = createElementClass("isindex");
Kbd = createElementClass("kbd"); Keygen = createElementClass("keygen");
Label = createElementClass("label"); Legend = createElementClass("legend"); Li = createElementClass("li"); Link = createElementClass("link");
Map = createElementClass("map"); Mark = createElementClass("mark"); Menu = createElementClass("menu"); Meta = createElementClass("meta"); Meter = createElementClass("meter");
Nav = createElementClass("nav"); Noframes = createElementClass("noframes"); Noscript = createElementClass("noscript");
Ol = createElementClass("ol"); Optgroup = createElementClass("optgroup"); Option = createElementClass("option"); Output = createElementClass("output");
P = createElementClass("p"); Param = createElementClass("param"); Pre = createElementClass("pre"); Progress = createElementClass("progress");
Q = createElementClass("q");
Rp = createElementClass("rp"); Rt = createElementClass("rt"); Ruby = createElementClass("ruby"); S = createElementClass("s");
Samp = createElementClass("samp"); Script = createElementClass("script"); Section = createElementClass("section"); Select = createElementClass("select"); Small = createElementClass("small"); Source = createElementClass("source"); Span = createElementClass("span"); Strike = createElementClass("strike"); Strong = createElementClass("strong"); Style = createElementClass("style"); Sub = createElementClass("sub"); Sup = createElementClass("sup");
Table = createElementClass("table"); Tbody = createElementClass("tbody"); Td = createElementClass("td"); Textarea = createElementClass("textarea"); Tfoot = createElementClass("tfoot"); Th = createElementClass("th"); Thead = createElementClass("thead"); Time = createElementClass("time"); Title = createElementClass("title"); Tr = createElementClass("tr"); Track = createElementClass("track"); Tt = createElementClass("tt");
U = createElementClass("u"); Ul = createElementClass("ul");
Video = createElementClass("video");
Wbr = createElementClass("wbr");



Html.static({
    a: A, abbr: Abbr, acronym: Acronym, address: Address, applet: Applet, area: Area, article: Article, aside: Aside, audio: Audio,
    b: B, base: Base, basefont: Basefont, bb: Bb, bdo: Bdo, big: Big, blockquote: Blockquote, body: Body, br: Br, button: Button,
    canvas: Canvas, caption: Caption, center: Center, cite: Cite, code: Code, col: Col, colgroup: Colgroup, command: Command,
    datagrid: Datagrid, datalist: Datalist, dd: Dd, del: Del, details: Details, dfn: Dfn, dialog: Dialog, dir: Dir, div: Div, dl: Dl, dt: Dt,
    em: Em, embed: Embed, eventsource: Eventsource,
    fieldset: Fieldset, figcaption: Figcaption, figure: Figure, font: Font, footer: Footer, form: Form, frame: Frame, frameset: Frameset,
    h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6, head: Head, header: Header, hgroup: Hgroup, hr: Hr,
    i: I, iframe: Iframe, img: Img, input: Input, ins: Ins, isindex: Isindex,
    kbd: Kbd, keygen: Keygen,
    label: Label, legend: Legend, li: Li, link: Link,
    map: Map, mark: Mark, menu: Menu, meta: Meta, meter: Meter,
    nav: Nav, noframes: Noframes, noscript: Noscript,
    ol: Ol, optgroup: Optgroup, option: Option, output: Output,
    p: P, param: Param, pre: Pre, progress: Progress,
    q: Q,
    rp: Rp, rt: Rt, ruby: Ruby,
    s: S, samp: Samp, script: Script, section: Section, select: Select, small: Small, source: Source, span: Span, strike: Strike, strong: Strong, style: Style, sub: Sub, sup: Sup,
    table: Table, tbody: Tbody, td: Td, textarea: Textarea, tfoot: Tfoot, th: Th, thead: Thead, time: Time, title: Title, tr: Tr, track: Track, tt: Tt,
    u: U, ul: Ul,
    video: Video,
    wbr: Wbr
});




// htmlTags.map(function(fn){
//     s += "var " + (fn.substr(0, 1).toUpperCase() + fn.substr(1) ) + " = createElementClass(\""+fn+ "\");\n"; 
//  })


//  htmlTags.map(function(fn){
//     s += "HtmlMethods." + fn + " = " + (fn.substr(0, 1).toUpperCase() + fn.substr(1) ) + ";\n"; 
//  })
//  s+= "export { "
//  htmlTags.map(function(fn){
//     s += fn.substr(0, 1).toUpperCase() + fn.substr(1)  + ","; 
//  })
export default Html;
export {
    createElementClass,
    Html,
    A,
    Abbr, Acronym, Address, Applet, Area, Article, Aside, Audio,
    B, Base, Basefont, Bb, Bdo, Big, Blockquote, Body, Br, Button,
    Canvas, Caption, Center, Cite, Code, Col, Colgroup, Command,
    Datagrid, Datalist, Dd, Del, Details, Dfn, Dialog, Dir, Div, Dl, Dt,
    Em, Embed, Eventsource,
    Fieldset, Figcaption, Figure, Font, Footer, Form, Frame, Frameset,
    H1, H2, H3, H4, H5, H6, Head, Header, Hgroup, Hr,
    I, Iframe, Img, Input, Ins, Isindex,
    Kbd, Keygen,
    Label, Legend, Li, Link,
    Map, Mark, Menu, Meta, Meter,
    Nav, Noframes, Noscript,
    Ol, Optgroup, Option, Output,
    P, Param, Pre, Progress,
    Q,
    Rp, Rt, Ruby,
    S, Samp, Script, Section, Select, Small, Source, Span, Strike, Strong, Style, Sub, Sup,
    Table, Tbody, Td, Textarea, Tfoot, Th, Thead, Time, Title, Tr, Track, Tt,
    U, Ul,
    Video, Wbr
};