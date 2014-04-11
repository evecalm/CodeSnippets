var jqm = (function () {
    var emptyArray = [],
        slice = emptyArray.slice,
        classCache = [],
        eventHandlers = [],
        _eventID = 1,
        jsonPHandlers = [],
        _jsonPID = 1;

    function likeArray(obj) {
        return typeof obj.length == 'number'
    }

    function compact(array) {
        return array.filter(function (item) {
            return item !== undefined && item !== null
        })
    }

    function flatten(array) {
        return array.length > 0 ? [].concat.apply([], array) : array
    }

    function classRE(name) {
        return name in classCache ? classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
    }
    var $ = function (selector, what) {
            return new $jqm(selector, what);
    }
        function _selector(selector, what) {
            var dom;
            if (typeof (selector) === "string") 
                        {
                                if(selector[0]=="#"&&selector.indexOf(" ")==-1)
                                   dom = what.getElementById(selector.replace("#", ""))
                                else if(selector[0]="<"&&selector[selector.length-1]==">") //html
                                {
                                        var tmp=document.createElement("div");
                                        tmp.innerHTML=selector;
                                        dom=tmp.childNodes;
                                }
                                else
                                   dom=(what.querySelectorAll(selector));
                        }
            return dom;
    }
    var $jqm = function (selector, what) {
            var elements = [];
                        this.length=0;
            if (!selector) return emptyArray;
                        
                        //object passed in
                        if(typeof(selector)=="object")
                        {
                           this[this.length++]=selector;
                           return this;
                        }
                        
            if (what === undefined) what = document;
            dom = _selector(selector, what);
            if (!dom) return this; //create empty array
                        else if (dom.length==undefined){
                                this[this.length++]=dom;
                                return this;
                        }                       //If single element, let's add it to an array
                        for(var j=0;j<dom.length;j++)
                        {
                           this[this.length++]=dom[j];
                        }
                        return this;
        }

    $.map = function (elements, callback) {
        var value, values = [],
            i, key;
        if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i);
            if (value != null) values.push(value);
        } else for (key in elements) {
            value = callback(elements[key], key);
            if (value != null) values.push(value);
        }
        return flatten(values);
    }

    $.each = function (elements, callback) {
        var i, key;
        if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
            if (callback(i, elements[i]) === false) return elements;
        } else for (key in elements) {
            if (callback(key, elements[key]) === false) return elements;
        }
        return elements;
    }
    $.extend = function (target) {
                
        if (target == null || typeof (target) === "undefined") target=this;
                if(arguments.length==1){                   
                        for(key in target)
                           this[key]=target[key];
                        return this;
                }
                
                else {
        slice.call(arguments, 1).forEach(function (source) {
            for (key in source) target[key] = source[key];
        })
                }
        return target;
    }

    $.fn = $jqm.prototype = {
                constructor: $jqm,
                get: function( num ) {
                return num == null ?

                        // Return a 'clean' array
                        this.toArray() :

                        // Return just the object
                        ( num < 0 ? this[ this.length + num ] : this[ num ] );
                },
                toArray:function(){
                        return slice.call(this,0);
                },
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,
        selector: _selector,
        map: function (fn) {
            return $.map(this, function (el, i) {
                return fn.call(el, i, el)
            });
        },
        each: function (callback) {
            this.forEach(function (el, idx) {
                callback.call(el, idx, el)
            });
            return this;
        },
        ready: function (callback) {
            if (document.readyState == "complete" || document.readyState == "loaded") callback();
            document.addEventListener("DOMContentLoaded", callback, false);
            return this;
        },
        html: function (html) {
                        if(this.length==0) return null;
            if (html === undefined) return this[0].innerHTML;
            for (var i = 0; i < this.length; i++) {
               this[i].innerHTML = html;
            }
            return this;
        },
        text: function (text) {
                        if(this.length==0) return null;
            if (text === undefined) return this[0].textContent
            for (var i = 0; i < this.length; i++) {
               this[i].textContent = text;
            }
            return this;
        },
        css: function (attribute, value) {
                        if(this.length==0) return null;
            if (value === undefined&&typeof(attribute)=="string") return this[0].style[attribute];
            for (var i = 0; i < this.length; i++) {
                                if(typeof(attribute)=="object")
                                {
                                        for(var j in attribute)
                                        {
                                                this[i].style[j]=attribute[j];
                                        }
                                }
                                else
                                        this[i].style[attribute] = value;
            }
            return this;
        },
        empty: function () {
            for (var i = 0; i < this.length; i++) {
               this[i].innerHTML = '';
            }
            return this;
        },
        hide: function () {
            return this.css("display", "none");
        },
        show: function () {
            return this.css("display", "block");
        },
        toggle: function () {
            for (var i = 0; i < this.length; i++) {
                this[0].style.display = this[0].style.display == "none" ? "block" : "none";
            }
            return this;
        },
        val: function (value) {
                        if(this.length==0) return null;
            if (value === undefined) return this[0].value;
            for (var i = 0; i < this.length; i++) {
               this[i].value = value;
            }
            return this;
        },
        attr: function (attr, value) {
                        if(this.length==0) return null;
            if (value === undefined) return this[0].getAttribute(attr);
            for (var i = 0; i < this.length; i++) {
               this[i].setAttribute(attr, value);
            }
            return this;
        },
        removeAttr: function (attr) {
            for (var i = 0; i < this.length; i++) {
               this[i].removeAttribute(attr);
            }
            return this;
        },
        remove: function () {
            for (var i = 0; i < this.length; i++) {
               this[i].parentNode.removeChild(this[i]);
            }
            return this;
        },
        addClass: function (name) {
            for (var i = 0; i < this.length; i++) {
                var cls =this[i].className;
                var classList = [];
                var that = this;
                name.split(/\s+/g).forEach(function (cname) {
                    if (!that.hasClass(cname, that[i])) classList.push(cname);
                });

               this[i].className += (cls ? " " : "") + classList.join(" ");
            }
            return this;
        },
        removeClass: function (name) {
            for (var i = 0; i < this.length; i++) {
                if (name === undefined) returnthis[i].className = '';
                var classList =this[i].className
                name.split(/\s+/g).forEach(function (cname) {
                    classList = classList.replace(classRE(cname), "");
                });
               this[i].className = classList.trim();
            }
            return this;
        },
        hasClass: function (name, element) {
                        if(this.length==0) return false;
            if (!element) element = this[0];
            return classRE(name).test(element.className)
        },
        bind: function (event, callback) {
            for(var i=0;i<this.length;i++)
                        {
                (function(obj){
                                        
                                        var id = obj._eventID ? obj._eventID : _eventID++;
                                        obj._eventID = id;
                                        var that = obj;
                                        event.split(/\s+/g).forEach(function (name) {
                                                var prxFn = function (event) {
                                                                var result = callback.call(that, event);
                                                                if (result === false) event.preventDefault();
                                                                return result;
                                                        }
                                                eventHandlers[id + "_" + name] = prxFn;
                                                obj.addEventListener(name, prxFn, false);
                                        });
                                        
                                })(this[i]);
                                
            }
            return this;
        },
        unbind: function (event) {
            for(var i=0;i<this.length;i++)
                        {
                                (function(obj){
                                        var id = obj._eventID;
                                        var that = obj;
                                        event.split(/s+g/).forEach(function (name) {
                    if (eventHandlers[id + "_" + name]) {
                        var prxFn = eventHandlers[id + "_" + name];
                        delete eventHandlers[id + "_" + name];
                        that.removeEventListener(name, prxFn, false);
                    }
                                        });
                                })(this[i]);
            };
            return this;
        },
        trigger: function (event, data) {
                        if(this.length==0) return this;
            if (typeof (event) == "string") {
                var evtName = event;
                var event = document.createEvent("Event");
                event.type = evtName;
                event.target = this[0];
                event.initEvent(evtName, false, true);
            }
            event.data = data;
            this[0].dispatchEvent(event)
            return this;
        },
        append: function (element) {
                        var i;
            for (i = 0; i < this.length; i++) {
                                if(element.length&&typeof(element)!=="string")
                                   element=element[0];
                if (typeof (element) == "string")this[i].innerHTML += element
                else this[i].appendChild(element);
            }
            return this;
        },
        prepend: function (element) {
                   var i;
            var that = this;
            for (i = 0; i < this.length; i++) {
                                if(element.length&&typeof(element)!=="string")
                                   element=element[0];
                if (typeof (element) == "string")this[i].innerHTML = element +this[i].innerHTML;
                else this[i].appendChild(element,this[i].firstChild);
            }
            return this;
        },
                get:function(index){
                  return (this[index])?this[index]:null;
                }
    };

    /* AJAX functions */

    function empty() {}
    var ajaxSettings = {
        type: 'GET',
        beforeSend: empty,
        success: empty,
        error: empty,
        complete: empty,
        context: null,
        timeout: 0
    };

    $.jsonP = function (options) {
        var callbackName = 'jsonp_callback' + (++_jsonPID);
        var abortTimeout = "",
            context;
        script = document.createElement("script");
        abort = function () {
            $(script).remove();
            if (window[callbackName]) window[callbackName] = empty;
        }
        window[callbackName] = function (data) {
            clearTimeout(abortTimeout);
            $(script).remove();
            delete window[callbackName];
            options.success.call(context, data);
        };
        script.src = options.url.replace(/=\?/, '=' + callbackName);
        $('head').append(script);
        if (options.timeout > 0) abortTimeout = setTimeout(function () {
            xhr.abort();
            options.error.call(context, xhr, 'timeout');
        }, options.timeout);
        return {};
    }

    $.ajax = function (opts) {
                try{
        var xhr = new window.XMLHttpRequest();
        settings = opts || {}
        for (key in ajaxSettings) {
            if (!settings[key]) settings[key] = ajaxSettings[key];
        }

        if (!settings.url) settings.url = window.location;
        if (!settings.contentType) settings.contentType = "application/x-www-form-urlencoded";
        if (!settings.headers) settings.headers = {};
        settings.headers = $.extend({
            'X-Requested-With': 'XMLHttpRequest'
        }, settings.headers);
        if (!settings.dataType) settings.dataType = "text/html";
        else {
            switch (settings.dataType) {
            case "script":
                settings.dataType = 'text/javascript, application/javascript';
                break;
            case "json":
                settings.dataType = 'application/json';
                break;
            case "xml":
                settings.dataType = 'application/xml, text/xml';
                break;
            case "html":
                settings.dataType = 'text/html';
                break;
            case "text":
                settings.dataType = 'text/plain';
                break;
            default:
                settings.dataType = "text/html";
                break;
                        case "jsonp":
                           return $.jsonP(opts);
                           break;
            }
        }
        if (typeof (settings.data) == "object") settings.data = $.serialize(settings.data);
        if (settings.type.toLowerCase() == "get" && settings.data) {
            if (settings.url.indexOf("?") == -1) settings.url += "?" + settings.data;
            else settings.url += "&" + settings.data
        }

        if (/=\?/.test(settings.url)) return $.jsonP(settings);

        var mime = settings.dataType,
            abortTimeout, context = settings.context;

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                clearTimeout(abortTimeout);
                var result, error = false;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
                    if (mime == 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
                        try {
                            result = JSON.parse(xhr.responseText);
                        } catch (e) {
                            error = e;
                        }
                    } else result = xhr.responseText;
                    if (error) settings.error.call(context, xhr, 'parsererror', error);
                    else {
                        settings.success.call(context, result, 'success', xhr);
                    }
                } else {
                    error = true;
                    settings.error.call(context, xhr, 'error');
                }
                settings.complete.call(context, xhr, error ? 'error' : 'success');
            }
        };
        xhr.open(settings.type, settings.url, true);

        if (settings.contentType) settings.headers['Content-Type'] = settings.contentType;
        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
        if (settings.beforeSend.call(context, xhr, settings) === false) {
            xhr.abort();
            return false;
        }

        if (settings.timeout > 0) abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = empty;
            xhr.abort();
            settings.error.call(context, xhr, 'timeout');
        }, settings.timeout);
        xhr.send(settings.data);
                }
                catch(e){console.log(e);}
        return xhr;
    };
    $.get = function (url, success) {
        return this.ajax({
            url: url,
            success: success
        });
    };
        $.post = function (url, data, success, dataType) {
        if (typeof (data) == "success") {
            success = data;
            data = {};
        }
        if (typeof (dataType) == "undefined") dataType = "html";
        return this.ajax({
            url: url,
            type: "POST",
            data: data,
            dataType: dataType,
            success: success
        });
    }
        $.getJSON = function (url, data, success) {
        if (typeof (data) == "function") {
            success = data;
            data = {};
        }
        return this.ajax({
            url: url,
            data: data,
            success: success,
            dataType: "json"
        });
    };
        $.serialize = function (obj, prefix) {
        var str = [];
        for (var p in obj) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
        return str.join("&");
    };
        $.parseJSON=function(string){
           return JSON.parse(string);
        };
        (function($,userAgent){
                        $.os={};
                        $.os.webkit = userAgent.match(/WebKit\/([\d.]+)/)?true:false,
                        $.os.android = userAgent.match(/(Android)\s+([\d.]+)/)?true:false,
                        $.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/)?true:false,
                        $.os.iphone = !$.os.ipad  && userAgent.match(/(iPhone\sOS)\s([\d_]+)/)?true:false,
                        $.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/)?true:false,
                        $.os.touchpad = $.os.webos && userAgent.match(/TouchPad/)?true:false;
                        $.os.ios=$.os.ipad||$.os.iphone;
                        
        })($,navigator.userAgent);
    return $;
})();
'$' in window || (window.$ = jqm);