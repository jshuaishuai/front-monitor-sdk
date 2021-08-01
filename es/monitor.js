import Cookies from 'js-cookie';
import { get, has, clone, isFunction as isFunction$1, merge as merge$1 } from 'lodash-es';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

/**
 * debounce
 *
 * @param {Function} func 实际要执行的函数
 * @param {Number} delay 延迟时间，单位是 ms
 * @param {Function} callback 在 func 执行后的回调
 *
 * @return {Function}
 */
function debounce(func, delay, callback) {
    var timer = null;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
            func && func.apply(_this, args);
            callback && callback();
        }, delay);
    };
}
/**
 * merge
 *
 * @param  {Object} src
 * @param  {Object} dest
 * @return {Object}
 */
function merge(src, dest) {
    for (var item in src) {
        dest[item] = src[item];
    }
    return dest;
}
/**
 * 是否是函数
 *
 * @param  {Any} func 判断对象
 * @return {Boolean}
 */
function isFunction(func) {
    return Object.prototype.toString.call(func) === "[object Function]";
}
/**
 * 将类数组转化成数组
 *
 * @param  {Object} arrayLike 类数组对象
 * @return {Array} 转化后的数组
 */
function arrayFrom(arrayLike) {
    return [].slice.call(arrayLike);
}

var tryJS = {
    wrap: wrap,
    wrapArgs: tryifyArgs,
};
var config$1 = {
    handleTryCatchError: function (error) {
        console.log(error);
    },
};
function setting(opts) {
    merge(opts, config$1);
}
function wrap(func) {
    return isFunction(func) ? tryify(func) : func;
}
/**
 * 将函数使用 try..catch 包装
 *
 * @param  {Function} func 需要进行包装的函数
 * @return {Function} 包装后的函数
 */
function tryify(func) {
    // 确保只包装一次
    if (!func._wrapped) {
        func._wrapped = function () {
            try {
                return func.apply(this, arguments);
            }
            catch (error) {
                config$1.handleTryCatchError(error);
                window.ignoreError = true;
                throw error;
            }
        };
    }
    return func._wrapped;
}
/**
 * 只对函数参数进行包装
 *
 * @param  {Function} func 需要进行包装的函数
 * @return {Function}
 */
function tryifyArgs(func) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var args = arrayFrom(arguments).map(function (arg) {
            return wrap(arg);
        });
        // @ts-ignore
        return func.apply(this, args);
    };
}

var CODE_DETAIL_RULE = [];
CODE_DETAIL_RULE[1] = {
    df: ["url", "http_code", "during_ms", "size"],
    ef: ["params", "response"],
    dft: {
        size: "response_size_b",
    },
};
CODE_DETAIL_RULE[2] = {
    df: ["url"],
    ef: ["params", "response"],
    dft: {},
};
CODE_DETAIL_RULE[3] = {
    df: ["url", "reason"],
    ef: ["code"],
    dft: {
        reason: "error_no",
    },
};
CODE_DETAIL_RULE[4] = {
    df: ["step"],
    ef: ["desc"],
    dft: {
        step: "error_no",
    },
};
CODE_DETAIL_RULE[5] = {
    df: ["url", "step"],
    ef: ["params"],
    dft: {
        step: "error_no",
    },
};
CODE_DETAIL_RULE[8] = {
    df: [],
    dft: {
        error_name: "error_no",
        http_code: "http_code",
        during_ms: "during_ms",
        url: "url",
        request_size_b: "request_size_b",
        response_size_b: "response_size_b", // 响应值体积, 单位b
    }, //选填字段
};

// 打点服务器，或Nginx地址
var TARGET = "http://39.106.100.186/dig.gif";
// 测试标记
var TEST_FLAG = "b47ca710747e96f1c523ebab8022c19e9abaa56b";
// cookie 标识
var COOKIE_NAME_DIVICE_ID = "crosSdkDT2019DeviceId";
// 定义JS_TRACKER错误类型码
var JS_TRACKER_ERROR_CONSTANT_MAP = {
    1: "ERROR_RUNTIME",
    2: "ERROR_SCRIPT",
    3: "ERROR_STYLE",
    4: "ERROR_IMAGE",
    5: "ERROR_AUDIO",
    6: "ERROR_VIDEO",
    7: "ERROR_CONSOLE",
    8: "ERROR_TRY_CATCH", //try catch异常
};
var JS_TRACKER_ERROR_DISPLAY_MAP = {
    1: "JS_RUNTIME_ERROR",
    2: "SCRIPT_LOAD_ERROR",
    3: "CSS_LOAD_ERROR",
    4: "IMAGE_LOAD_ERROR",
    5: "AUDIO_LOAD_ERROR",
    6: "VIDEO_LOAD_ERROR",
    7: "CONSOLE_ERROR",
    8: "TRY_CATCH_ERROR", //try catch错误
};
// 默认配置
var DEFAULT_CONFIG = {
    pid: "template",
    uuid: "uuid-" + Math.random(),
    ucid: "ucid-" + Math.random(),
    is_test: true,
    record: {
        time_on_page: true,
        performance: true,
        js_error: true,
        // 配置需要监控的页面报错类别, 仅在js_error为true时生效, 默认均为true(可以将配置改为false, 以屏蔽不需要上报的错误类别)
        js_error_report_config: {
            ERROR_RUNTIME: true,
            ERROR_SCRIPT: true,
            ERROR_STYLE: true,
            ERROR_IMAGE: true,
            ERROR_AUDIO: true,
            ERROR_VIDEO: true,
            ERROR_CONSOLE: true,
            ERROR_TRY_CATCH: true,
            // 自定义检测函数, 根据错误描述和栈信息 判断该错误是否需要打点
            checkErrrorNeedReport: function (desc, stack) {
                if (desc === void 0) { desc = ""; }
                if (stack === void 0) { stack = ""; }
                console.log(desc, stack);
                // true 表示需要  false 表示不需要
                return true;
            },
        },
    },
    // 业务方的js版本号, 会随着打点数据一起上传, 方便区分数据来源
    // 可以不填, 默认为1.0.0
    version: "1.0.0",
    // getPageType函数执行时会被传入一个location对象, 业务方需要完成该函数, 返回对应的的页面类型(50字以内, 建议返回汉字, 方便查看), 默认是返回当前页面的url
    getPageType: function (location) {
        if (location === void 0) { location = window.location; }
        return "" + location.host + location.pathname;
    },
};

/**
 * 判断给定值是不是一个对象
 * @param {*} value
 * @returns {Boolean} 如果是返回 true，否则返回 false
 */
function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
}
// 将loadsh的方法集中到 _ 中
var _ = {};
_.get = get;
_.has = has;
_.clone = clone;
_.isFunction = isFunction$1;
_.merge = merge$1;
var isDom = function (target) {
    return typeof HTMLElement === "function"
        ? target instanceof HTMLElement
        : target &&
            typeof target === "object" &&
            target.nodeType === 1 &&
            typeof target.nodeName === "string";
};
var noop = function () { };
/**
 * 生成字符串的hash
 * via https://stackoverflow.com/a/7616484/4197333
 * @param {*} content
 */
function hash(content) {
    content = content + "";
    var hash = 0;
    var index = 0;
    var charCodeAt = 0;
    if (content.length === 0) {
        return hash.toString(36);
    }
    for (index = 0; index < content.length; index++) {
        // 每一位字符的utf-8编码
        charCodeAt = content.charCodeAt(index);
        hash = (hash << 5) - hash + charCodeAt;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(36);
}
// TODO 生成UUID
function getUUID() {
    var time = new Date();
    var timestampMs = time * 1;
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(36)
            .substring(1);
    }
    return (hash(timestampMs + "") +
        "-" +
        hash(navigator.userAgent) +
        "-" +
        s4() +
        s4() +
        s4() +
        s4() +
        s4() +
        "-" +
        s4() +
        s4() +
        s4());
}
function parseDomain(hostname) {
    // 首先用比较严肃的方法:
    // 先尝试匹配常见后缀
    var checkReg = new RegExp(/(.*?)\.?([^.]*?)\.(gl|com|net|org|biz|ws|in|me|co\.uk|co|org\.uk|ltd\.uk|plc\.uk|me\.uk|edu|mil|br\.com|cn\.com|eu\.com|hu\.com|no\.com|qc\.com|sa\.com|se\.com|se\.net|us\.com|uy\.com|ac|co\.ac|gv\.ac|or\.ac|ac\.ac|af|am|as|at|ac\.at|co\.at|gv\.at|or\.at|asn\.au|com\.au|edu\.au|org\.au|net\.au|id\.au|be|ac\.be|adm\.br|adv\.br|am\.br|arq\.br|art\.br|bio\.br|cng\.br|cnt\.br|com\.br|ecn\.br|eng\.br|esp\.br|etc\.br|eti\.br|fm\.br|fot\.br|fst\.br|g12\.br|gov\.br|ind\.br|inf\.br|jor\.br|lel\.br|med\.br|mil\.br|net\.br|nom\.br|ntr\.br|odo\.br|org\.br|ppg\.br|pro\.br|psc\.br|psi\.br|rec\.br|slg\.br|tmp\.br|tur\.br|tv\.br|vet\.br|zlg\.br|br|ab\.ca|bc\.ca|mb\.ca|nb\.ca|nf\.ca|ns\.ca|nt\.ca|on\.ca|pe\.ca|qc\.ca|sk\.ca|yk\.ca|ca|cc|ac\.cn|com\.cn|edu\.cn|gov\.cn|org\.cn|bj\.cn|sh\.cn|tj\.cn|cq\.cn|he\.cn|nm\.cn|ln\.cn|jl\.cn|hl\.cn|js\.cn|zj\.cn|ah\.cn|gd\.cn|gx\.cn|hi\.cn|sc\.cn|gz\.cn|yn\.cn|xz\.cn|sn\.cn|gs\.cn|qh\.cn|nx\.cn|xj\.cn|tw\.cn|hk\.cn|mo\.cn|cn|cx|cz|de|dk|fo|com\.ec|tm\.fr|com\.fr|asso\.fr|presse\.fr|fr|gf|gs|co\.il|net\.il|ac\.il|k12\.il|gov\.il|muni\.il|ac\.in|co\.in|org\.in|ernet\.in|gov\.in|net\.in|res\.in|is|it|ac\.jp|co\.jp|go\.jp|or\.jp|ne\.jp|ac\.kr|co\.kr|go\.kr|ne\.kr|nm\.kr|or\.kr|li|lt|lu|asso\.mc|tm\.mc|com\.mm|org\.mm|net\.mm|edu\.mm|gov\.mm|ms|nl|no|nu|pl|ro|org\.ro|store\.ro|tm\.ro|firm\.ro|www\.ro|arts\.ro|rec\.ro|info\.ro|nom\.ro|nt\.ro|se|si|com\.sg|org\.sg|net\.sg|gov\.sg|sk|st|tf|ac\.th|co\.th|go\.th|mi\.th|net\.th|or\.th|tm|to|com\.tr|edu\.tr|gov\.tr|k12\.tr|net\.tr|org\.tr|com\.tw|org\.tw|net\.tw|ac\.uk|uk\.com|uk\.net|gb\.com|gb\.net|vg|sh|kz|ch|info|ua|gov|name|pro|ie|hk|com\.hk|org\.hk|net\.hk|edu\.hk|us|tk|cd|by|ad|lv|eu\.lv|bz|es|jp|cl|ag|mobi|eu|co\.nz|org\.nz|net\.nz|maori\.nz|iwi\.nz|io|la|md|sc|sg|vc|tw|travel|my|se|tv|pt|com\.pt|edu\.pt|asia|fi|com\.ve|net\.ve|fi|org\.ve|web\.ve|info\.ve|co\.ve|tel|im|gr|ru|net\.ru|org\.ru|hr|com\.hr|ly|xyz)$/);
    var parseResult = hostname.match(checkReg);
    var domain;
    if (parseResult) {
        domain = parseResult[2]
            ? parseResult[2] + "." + parseResult[3]
            : undefined;
    }
    if (domain === undefined) {
        // 没有匹配到常见后缀, 则使用最后两段被.分隔的字符, 作为主域名
        var urlSplitList = hostname.split(".");
        domain = urlSplitList
            .slice(urlSplitList.length - 2, urlSplitList.length)
            .join(".");
    }
    // 强制转为字符串
    domain = domain + "";
    return domain;
}
function getDeviceId() {
    // 尝试在cookie中获取
    var deviceId = Cookies.get(COOKIE_NAME_DIVICE_ID);
    if (deviceId === undefined) {
        // cookie中也没有, 手工设置上
        deviceId = getUUID();
        var hostname = location.hostname;
        var domain = parseDomain(hostname);
        // cookie需要种在主域名上
        Cookies.set(COOKIE_NAME_DIVICE_ID, deviceId, {
            expires: 1000,
            domain: domain,
        });
        // Cookie有可能种失败, 如果接种失败, 则还是返回空字符串
        deviceId = Cookies.get(COOKIE_NAME_DIVICE_ID) || "";
    }
    return deviceId;
}
/**
 * 判断是否需要上传自定义类型错误
 * @param commonConfig 配置信息
 * @param desc 错误描述
 * @param stack 错误堆栈
 * @param debugLogger 控制台日志
 * @returns
 */
function customerErrorCheck(commonConfig, desc, stack, debugLogger) {
    if (debugLogger === void 0) { debugLogger = console.log; }
    // 调用自定义函数, 检测是否需要上报错误
    var customerErrorCheckFunc = _.get(commonConfig, ["record", "js_error_report_config", "checkErrorNeedReport"], _.get(DEFAULT_CONFIG, [
        "record",
        "js_error_report_config",
        "checkErrorNeedReport",
    ]));
    var isNeedReport = false;
    try {
        isNeedReport = customerErrorCheckFunc(desc, stack); // TODO 自定义错误类型是否上传
    }
    catch (e) {
        debugLogger("config.record.js_error_report_config.checkErrorNeedReport\u6267\u884C\u65F6\u53D1\u751F\u5F02\u5E38, \u8BF7\u6CE8\u610F, \u9875\u9762\u62A5\u9519\u4FE1\u606F\u4E3A=>", { e: e, desc: desc, stack: stack });
        isNeedReport = true;
    }
    // 这里绝大多数的框架都支持的是返回undefined认为是false
    return !!isNeedReport;
}
var clog = function (text) {
    console.log("%c " + text, "color:red");
};
/**
 * 验证上报数据是否符合要求
 * @param commonConfig 配置
 * @param type 错误类型
 * @param code 错误码
 * @param detail
 * @param extra
 * @returns
 */
var validLog = function (commonConfig, type, code, detail, extra) {
    if (type === void 0) { type = ""; }
    if (detail === void 0) { detail = {}; }
    if (extra === void 0) { extra = {}; }
    var pid = _.get(commonConfig, ["pid"], "");
    if (!pid) {
        return "请设置工程ID[pid]";
    }
    // js错误日志
    if (type === "error") {
        if (code < 0 || code > 9999) {
            return "type:error的log code 应该在1～9999之间";
        }
    }
    else if (type === "product") {
        if (code < 10000 || code > 19999) {
            return "type:product的log code 应该在10000～19999之间";
        }
    }
    else if (type === "info") {
        if (code < 20000 || code > 29999) {
            return "type:info的log code 应该在20000～29999之间";
        }
    }
    // 字端段类型校验
    if (typeof detail !== "object") {
        return "second argument detail required object";
    }
    // 字端段类型校验
    if (typeof extra !== "object") {
        return "third argument extra required object";
    }
    // 字段校验
    var ruleItem = CODE_DETAIL_RULE[code];
    if (ruleItem) {
        // 消费字段必填
        var requireFields = __spreadArray([], ruleItem.df);
        var realFields_1 = Object.keys(detail);
        var needFields_1 = [];
        requireFields.forEach(function (field) {
            // 缺字端
            if (realFields_1.indexOf(field) === -1) {
                needFields_1.push(field);
            }
        });
        if (needFields_1.length) {
            return "code: " + code + " \u8981\u6C42 " + needFields_1.join(",") + "\u5B57\u6BB5\u5FC5\u586B";
        }
    }
    return "";
};
var detailAdapter = function (code, detail) {
    if (detail === void 0) { detail = {}; }
    var dbDetail = {
        error_no: "",
        http_code: "",
        during_ms: "",
        url: "",
        request_size_b: "",
        response_size_b: "",
    };
    // 查找rule
    var ruleItem = CODE_DETAIL_RULE[code];
    if (ruleItem) {
        var d_1 = __assign({}, dbDetail);
        var fields = Object.keys(detail);
        fields.forEach(function (field) {
            var transferField = ruleItem.dft[field];
            // 需要字段转换
            if (transferField) {
                // 需要字段转换
                d_1[transferField] = detail[field];
                delete detail[field];
            }
            else {
                d_1[field] = detail[field];
            }
        });
        return d_1;
    }
    else {
        return detail;
    }
};

var init = function (opts) {
    __config(opts);
    __init();
};
var monitor = {
    tryJS: tryJS,
    init: init,
};
monitor.tryJS = tryJS;
setting({ handleTryCatchError: handleTryCatchError });
// 忽略错误监听
window.ignoreError = false;
// 错误日志列表
var errorList = [];
// 错误处理回调
var report = function () { };
var config = {
    concat: true,
    delay: 2000,
    maxError: 16,
    sampling: 1, // 采样率
};
// 定义的错误类型码
var ERROR_RUNTIME = 1;
var ERROR_SCRIPT = 2;
var ERROR_STYLE = 3;
var ERROR_IMAGE = 4;
var ERROR_AUDIO = 5;
var ERROR_VIDEO = 6;
var ERROR_CONSOLE = 7;
var ERROR_TRY_CATHC = 8;
var LOAD_ERROR_TYPE = {
    SCRIPT: ERROR_SCRIPT,
    LINK: ERROR_STYLE,
    IMG: ERROR_IMAGE,
    AUDIO: ERROR_AUDIO,
    VIDEO: ERROR_VIDEO,
};
function __config(opts) {
    merge(opts, config);
    report = debounce(config.report, config.delay, function () {
        errorList = [];
    });
}
function __init() {
    // 监听 JavaScript 报错异常(JavaScript runtime error)
    // 监听资源加载错误(JavaScript Scource failed to load)
    window.addEventListener("error", function (event) {
        // 过滤 target 为 window 的异常，避免与上面的 onerror 重复
        var errorTarget = event.target;
        if (errorTarget !== window &&
            errorTarget.nodeName &&
            LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()]) {
            handleError(formatLoadError(errorTarget));
        }
        else {
            var message = event.message, filename = event.filename, lineno = event.lineno, colno = event.colno, error = event.error;
            var formatedError = formatRuntimerError(message, filename, lineno, colno, error);
            handleError(formatedError);
        }
    }, true);
    // 针对 vue 报错重写 console.error
    // TODO
    console.error = (function (origin) {
        var logErr = origin.error;
        return function (info) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            info = isObject(info)
                ? JSON.stringify(info, Object.getOwnPropertyNames(info))
                : info;
            var errorLog = {
                type: ERROR_CONSOLE,
                desc: info,
            };
            logErr.call.apply(logErr, __spreadArray([origin, info], args));
            handleError(errorLog);
        };
    })(console);
}
// 处理 try..catch 错误
function handleTryCatchError(error) {
    handleError(formatTryCatchError(error));
}
/**
 * 生成 runtime 错误日志
 *
 * @param  {String} message 错误信息
 * @param  {String} source  发生错误的脚本 URL
 * @param  {Number} lineno  发生错误的行号
 * @param  {Number} colno   发生错误的列号
 * @param  {Object} error   error 对象
 * @return {Object}
 */
function formatRuntimerError(message, source, lineno, colno, error) {
    return {
        type: ERROR_RUNTIME,
        desc: message + " at " + source + ":" + lineno + ":" + colno,
        stack: error && error.stack ? error.stack : "no stack", // IE <9, has no error stack
    };
}
/**
 * 生成 laod 错误日志
 *
 * @param  {Object} errorTarget
 * @return {Object}
 */
function formatLoadError(errorTarget) {
    return {
        type: LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()],
        desc: errorTarget.baseURI + "@" + (errorTarget.src || errorTarget.href),
        stack: "no stack",
    };
}
/**
 * 生成 try..catch 错误日志
 *
 * @param  {Object} error error 对象
 * @return {Object} 格式化后的对象
 */
function formatTryCatchError(error) {
    return {
        type: ERROR_TRY_CATHC,
        desc: error.message,
        stack: error.stack,
    };
}
/**
 * 错误数据预处理
 *
 * @param  {Object} errorLog    错误日志
 */
function handleError(errorLog) {
    // 是否延时处理
    if (!config.concat && config.report) {
        !needReport(config.sampling) || config.report([errorLog]);
    }
    else {
        // 延迟处理
        pushError(errorLog);
        report(errorList); // 防抖函数
    }
}
/**
 * 往异常信息数组里面添加一条记录
 *
 * @param  {Object} errorLog 错误日志
 */
function pushError(errorLog) {
    if (needReport(config.sampling) && errorList.length < config.maxError) {
        errorList.push(errorLog);
    }
}
/**
 * 设置一个采样率，决定是否上报
 *
 * @param  {Number} sampling 0 - 1
 * @return {Boolean}
 */
function needReport(sampling) {
    return Math.random() < (sampling || 1);
}

var orgFetch = window.fetch;
/**
 * 创建fetch的proxy
 * @param requestAction
 * @param responseAction
 */
function createFetchProxy(requestAction, responseAction) {
    if (!orgFetch) {
        return;
    }
    window.fetch = function (url, params) {
        requestAction(url, params);
        return new Promise(function (resolve, reject) {
            orgFetch(url, params)
                .then(function (res) {
                responseAction();
                return resolve(res);
            })
                .catch(function (e) {
                responseAction();
                return reject(e);
            });
        });
    };
}

function proxyRequest (beforeAction, afterAction) {
    createFetchProxy(beforeAction, afterAction);
}

/**
 * 构建监听
 * @param reportCallback
 */
function initRenderingTime(reportCallback) {
    var initDoms = []; // 被加载得doms
    var delayNum = 0; // 等待加载的时间
    var effective = true; // 操作记录是否有效
    var lastDomChangeTime = Date.now();
    var mutationCallback = function (mutationsList) {
        var now = Date.now();
        lastDomChangeTime = now;
        for (var _i = 0, mutationsList_1 = mutationsList; _i < mutationsList_1.length; _i++) {
            var mutation = mutationsList_1[_i];
            var addedNodes = mutation.addedNodes;
            var _loop_1 = function (i) {
                var addNode = addedNodes[i];
                var domName = getClassName(addNode);
                if (/^HTML/.test(domName)) {
                    // 再判断是否是图片
                    var item_1 = {
                        dom: addNode,
                        time: now,
                        domName: domName,
                    };
                    initDoms.push(item_1);
                    if (/Image/.test(domName)) {
                        // 如果是图片，就添加图片得
                        delayNum++;
                        addNode.addEventListener("load", function () {
                            delayNum--;
                            item_1.time = Date.now();
                        }, false);
                    }
                }
            };
            for (var i = 0; i < addedNodes.length; i++) {
                _loop_1(i);
            }
        }
    };
    var config = {
        attributes: true,
        childList: true,
        subtree: true,
    };
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (!MutationObserver)
        return;
    //  创建一个观察器实例并传入回调函数
    var observer = new MutationObserver(mutationCallback);
    // 以上述配置开始观察目标节点
    observer.observe(document, config); // 监听页面节点变化
    checkLoadFinsh();
    /**
     * 检查加载是否完成
     */
    function checkLoadFinsh() {
        var now = Date.now();
        if (now > lastDomChangeTime + 300 && delayNum === 0 && effective) {
            // 没有元素在变化同时，没有操作
            // 这里就是所有得渲染都完成了，要开始计算首屏元素和时间了
            checkDomInfirstScreen(initDoms, reportCallback);
            observer.disconnect(); // 监听销毁 停止观察
        }
        else if (effective) {
            setTimeout(checkLoadFinsh, 300);
        }
    }
    // 监听全局得click和键盘输入事件
    createEventListener(function () { return (effective = false); });
    // 控制请求数量
    proxyRequest(function () { return delayNum++; }, function () { return delayNum--; });
}
/**
 * 创建event监听
 * @param disAbleEffective
 */
function createEventListener(disAbleEffective) {
    window.addEventListener("click", function () {
        disAbleEffective();
    }, true);
    window.addEventListener("keydown", function () {
        disAbleEffective();
    }, true);
}
/**
 * 检查第一屏幕得元素
 * @param reportCallback
 */
function checkDomInfirstScreen(initDoms, reportCallback) {
    var requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
    requestAnimationFrame(function () {
        // 在这里先筛选出首屏得元素
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;
        // 筛选出top和left在 width和height得元素
        var firstScreenDoms = initDoms.filter(function (item) {
            var dom = item.dom;
            var _a = getOffset(dom), left = _a.left, top = _a.top;
            return left <= width && top <= height;
        });
        // 找出最大得时间
        firstScreenDoms.sort(function (itemA, itemB) { return itemB.time - itemA.time; });
        // const maxTime = firstScreenDoms.reduce((item, time = 0) => item.time > time ? item.time : time)
        var firstScreenLoadingTime = firstScreenDoms[0]
            ? firstScreenDoms[0].time
            : 0;
        reportCallback(firstScreenLoadingTime);
    });
}
/**
 * 获取元素得className
 * @param obj
 * @returns {string}
 */
function getClassName(obj) {
    return Object.prototype.toString
        .call(obj)
        .replace(/^\S+\s+/, "")
        .replace(/]$/, "");
}
// 获取元素得offset
/**
 * 获取绝对定位得值
 * @param dom
 * @param left
 * @param top
 * @returns {*}
 */
function getOffset(dom, left, top) {
    if (left === void 0) { left = 0; }
    if (top === void 0) { top = 0; }
    if (!dom) {
        return { left: left, top: top };
    }
    var _a = dom.offsetLeft, offsetLeft = _a === void 0 ? 0 : _a, _b = dom.offsetTop, offsetTop = _b === void 0 ? 0 : _b;
    left += offsetLeft;
    top += offsetTop;
    return getOffset(dom.parentNode, left, top);
}

var performanceTracker = {
    init: function (cb) {
        var me = this;
        var times = null; // TODO
        var firstScreenLoadingTime = null;
        function reportPerf() {
            if (!times || !firstScreenLoadingTime) {
                return;
            }
            times.firstScreenLoadingTime = firstScreenLoadingTime;
            me.debugLogger("发送页面性能指标数据, 上报内容 => ", __assign(__assign({}, times), { url: "" + window.location.host + window.location.pathname }));
            // 需要等待首屏数据加载完成
            cb &&
                cb.call(me, "perf", 20001, __assign(__assign({}, times), { url: "" + window.location.host + window.location.pathname }));
        }
        // TODO 首屏加载时间
        initRenderingTime(function (loadingTime) {
            firstScreenLoadingTime = loadingTime;
            reportPerf();
        });
        // 使用load事件, 替换onload方法
        window.addEventListener("load", function () {
            if (me.needRecordPerformance === false) {
                me.debugLogger("config.record.performance\u503C\u4E3Afalse, \u8DF3\u8FC7\u6027\u80FD\u6307\u6807\u6253\u70B9");
                return;
            }
            var performance = window.performance;
            if (!performance) {
                // 当前浏览器不支持
                me.debugLogger("你的浏览器不支持 performance 接口");
                return;
            }
            times = {};
            for (var key in performance.timing) {
                if (!isNaN(performance.timing[key])) {
                    times[key] = performance.timing[key];
                }
            }
            reportPerf();
        });
    },
};

var pkg = require("../package.json");
var commonConfig = _.clone(DEFAULT_CONFIG);
var Base = /** @class */ (function () {
    function Base() {
        // 是否为测试模式
        this.isTest = true;
        // 是否为覆盖模式
        this.isOverwrite = false;
        // 是否监控JS错误
        this.needRecordJsError = true;
        // 是否监控用户在线时长
        this.needRecordTimeOnPage = true;
        // 是否监控性能指标
        this.needRecordPerformance = true;
        // 初始化配置
        this.config = Object.create(null);
    }
    // TODO 初始化配置
    Base.prototype.computeConfig = function (config) {
        if (config === void 0) { config = {}; }
        var _conf = this.isOverwrite
            ? __assign({}, config) : _.merge(commonConfig, config);
        // 检测配置项
        var uuid = _.get(_conf, ["uuid"], "");
        if (uuid === "") {
            // 没有设置uuid时, 自动设置一个
            uuid = getDeviceId();
            _conf["uuid"] = uuid;
        }
        var ucid = _.get(_conf, ["ucid"], "");
        if (ucid === "") {
            this.debugLogger("警告: 未设置ucid(用户唯一标识), 无法统计新增用户数");
        }
        var checkErrorNeedReportFunc = _.get(_conf, [
            "record",
            "js_error_report_config",
            "checkErrorNeedReport",
        ]);
        if (_.isFunction(checkErrorNeedReportFunc) === false) {
            // 如果新配置key中取不到回调函数不对, 则尝试一下旧配置
            checkErrorNeedReportFunc = _.get(_conf, [
                "record",
                "js_error_report_config",
                "checkErrorNeedReport",
            ]);
        }
        //  还不对就没办法了
        if (_.isFunction(checkErrorNeedReportFunc) === false) {
            this.debugLogger("警告: config.record.js_error_report_config.checkErrorNeedReport 不是可执行函数, 将导致错误打点数据异常");
        }
        var getPageTypeFunc = _.get(_conf, ["getPageType"]);
        if (_.isFunction(getPageTypeFunc) === false) {
            this.debugLogger("警告: config.getPageType 不是可执行函数, 将导致打点数据异常!");
        }
        window.__dt_conf = _conf;
        var isTest = _.get(_conf, ["is_test"], _.get(DEFAULT_CONFIG, ["is_test"])) ||
            _.get(_conf, ["test"], false); // 兼容旧配置项
        if (isTest) {
            _conf.test = TEST_FLAG;
            this.debugLogger("配置更新完毕");
            this.debugLogger("当前为测试模式");
            this.debugLogger("Tip: 测试模式下打点数据仅供浏览, 不会展示在系统中");
            this.debugLogger("更新后配置为:", _conf);
        }
        return _conf;
    };
    // 各种监控初始化
    Base.prototype.init = function (config, isOverwrite) {
        if (config === void 0) { config = DEFAULT_CONFIG; }
        if (isOverwrite === void 0) { isOverwrite = false; }
        // 是否为覆盖模式
        this.isOverwrite = isOverwrite; // TODO 是否直接覆盖默认模式
        this.config = commonConfig = this.computeConfig(config); // TODO 自定义配置覆盖/融合默认配置
        this.isTest = !!_.get(commonConfig, "test", false);
        // 检查是否监控性能指标
        this.needRecordPerformance = _.get(commonConfig, ["record", "performance"], _.get(DEFAULT_CONFIG, ["record", "performance"]));
        // 检查是否监控JS错误
        this.needRecordJsError = _.get(commonConfig, ["record", "js_error"], _.get(DEFAULT_CONFIG, ["record", "js_error"]));
        // 检查是否监控用户在线时长
        this.needRecordTimeOnPage = _.get(commonConfig, ["record", "time_on_page"], _.get(DEFAULT_CONFIG, ["record", "time_on_page"]));
        // 保存上一级this 指向
        var self = this;
        // js错误统计
        monitor.init({
            concat: false,
            report: function (errorLogList) {
                if (errorLogList === void 0) { errorLogList = []; }
                // TODO 判断是否需要上报JS 错误
                if (self.needRecordJsError === false) {
                    self.debugLogger("config.record.js_error\u4E3Afalse, \u8DF3\u8FC7\u9875\u9762\u62A5\u9519\u6253\u70B9, \u9875\u9762\u62A5\u9519\u5185\u5BB9\u4E3A =>", errorLogList);
                    return;
                }
                for (var _i = 0, errorLogList_1 = errorLogList; _i < errorLogList_1.length; _i++) {
                    var errorLog = errorLogList_1[_i];
                    var type = errorLog.type, desc = errorLog.desc, stack = errorLog.stack;
                    // 检测该errorType是否需要记录
                    var strErrorType = _.get(JS_TRACKER_ERROR_CONSTANT_MAP, type, "");
                    var isErrorTypeNeedRecord = _.get(commonConfig, ["record", "js_error_report_config", strErrorType], _.get(DEFAULT_CONFIG, [
                        "record",
                        "js_error_report_config",
                        strErrorType,
                    ]));
                    if (isErrorTypeNeedRecord === false) {
                        // 主动配置了忽略该错误, 自动返回
                        self.debugLogger("config.record.js_error_report_config." + strErrorType + "\u503C\u4E3Afalse, \u8DF3\u8FC7\u7C7B\u522B\u4E3A" + strErrorType + "\u7684\u9875\u9762\u62A5\u9519\u6253\u70B9, \u9519\u8BEF\u4FE1\u606F=>", errorLog);
                        continue;
                    }
                    var isNeedReport = customerErrorCheck(commonConfig, desc, stack, self.debugLogger.bind(self));
                    if (!!isNeedReport === false) {
                        self.debugLogger("config.record.js_error_report_config.checkErrorNeedReport\u8FD4\u56DE\u503C\u4E3Afalse, \u8DF3\u8FC7\u6B64\u7C7B\u9519\u8BEF, \u9875\u9762\u62A5\u9519\u4FE1\u606F\u4E3A=>", {
                            desc: desc,
                            stack: stack,
                        });
                        continue;
                    }
                    var errorName = "页面报错_" + JS_TRACKER_ERROR_DISPLAY_MAP[type];
                    var location_1 = window.location;
                    self.debugLogger("[自动]捕捉到页面错误, 发送打点数据, 上报内容 => ", {
                        error_no: errorName,
                        url: "" + location_1.host + location_1.pathname,
                        desc: desc,
                        stack: stack,
                    });
                    self.log("error", 7, {
                        error_no: errorName,
                        url: location_1.href,
                    }, {
                        desc: desc,
                        stack: stack,
                    });
                }
            },
        });
        // 页面性能统计
        performanceTracker.init.bind(self)(self.log);
        // promise错误统计
        // promiseTracker.init.bind(self)(self.notify);
        // 用户在线时长统计
        // timeonpageTracker.init.bind(self)(self.product);
    };
    Base.prototype.send = function (info) {
        if (info === void 0) { info = {}; }
        var location = window.location;
        var pageType = location.href;
        var getPageTypeFunc = _.get(commonConfig, ["getPageType"], _.get(DEFAULT_CONFIG, ["getPageType"]));
        try {
            pageType = "" + getPageTypeFunc(location);
        }
        catch (e) {
            this.debugLogger("config.getPageType\u6267\u884C\u65F6\u53D1\u751F\u5F02\u5E38, \u8BF7\u6CE8\u610F, \u9519\u8BEF\u4FE1\u606F=>", {
                e: e,
                location: location,
            });
            pageType = "" + location.host + location.pathname;
        }
        info = Object.assign({
            type: "",
            common: __assign(__assign({}, commonConfig), { timestamp: Date.now(), runtime_version: commonConfig.version, sdk_version: pkg.version, page_type: pageType }),
        }, info);
        // 图片打点
        var img = new window.Image();
        img.src = TARGET + "?d=" + encodeURIComponent(JSON.stringify(info));
    };
    /**
     * 打点数据上报方法
     * @param {类型} type
     * @param {code码} code
     * @param {消费数据} detail
     * @param {展示数据} extra
     */
    Base.prototype.log = function (type, code, detail, extra) {
        if (type === void 0) { type = ""; }
        if (detail === void 0) { detail = {}; }
        if (extra === void 0) { extra = {}; }
        var errorMsg = validLog(commonConfig, type, code, detail, extra);
        if (errorMsg) {
            clog(errorMsg);
            return errorMsg;
        }
        var logInfo = {
            type: type,
            code: code,
            extra: extra,
            detail: detailAdapter(code, detail),
        };
        this.send(logInfo);
    };
    Base.prototype.error = function (code, detail, extra) {
        return this.log("error", code, detail, extra);
    };
    Base.prototype.product = function (code, detail, extra) {
        return this.log("product", code, detail, extra);
    };
    Base.prototype.info = function (code, detail, extra) {
        return this.log("info", code, detail, extra);
    };
    Base.prototype.debugLogger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // 只有在测试时才打印log
        if (this.isTest)
            console.log.apply(console, args);
    };
    return Base;
}());
var Logger = /** @class */ (function (_super) {
    __extends(Logger, _super);
    function Logger() {
        return _super.call(this) || this;
    }
    // TODO 第一步注册配置信息
    Logger.prototype.set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _super.prototype.init.apply(this, args);
    };
    /**
     * 用户行为监控
     * @param {String} code [必填]用户行为标识符, 用于唯一判定用户行为类型, 最多50字符( menu/click/button_1/button_2/etc)
     * @param {String} name [必填]用户行为名称, 和code对应, 用于展示, 最多50字符
     * @param {String} url  [可选]用户点击页面url, 可以作为辅助信息, 最多200字符
     */
    Logger.prototype.behavior = function (code, name, url) {
        if (code === void 0) { code = ""; }
        if (name === void 0) { name = ""; }
        if (url === void 0) { url = ""; }
        this.debugLogger("发送用户点击行为埋点, 上报内容 => ", {
            code: code,
            name: name,
            url: url,
        });
        this.product(10002, {
            code: code,
            name: name,
            url: url,
        });
    };
    Logger.prototype.notify = function (errorName, url, extraInfo) {
        if (errorName === void 0) { errorName = ""; }
        if (url === void 0) { url = ""; }
        if (extraInfo === void 0) { extraInfo = {}; }
        // 规范请求参数
        var detail = {};
        var extra = {};
        if (!errorName) {
            console.log("dt.notify 的 errorName 不能为空");
            return;
        }
        detail["error_name"] = "" + errorName;
        detail["url"] = "" + url;
        // 最大不能超过200字
        if (detail["error_name"].length > 200) {
            detail["error_name"] = detail["error_name"].slice(0, 200);
            this.debugLogger("error_name长度不能超过200字符, 自动截断. 截断后为=>", detail["error_name"]);
        }
        if (detail["url"].length > 200) {
            detail["url"] = detail["url"].slice(0, 200);
            this.debugLogger("url长度不能超过200字符, 自动截断. 截断后为=>", detail["error_name"]);
        }
        for (var _i = 0, _a = [
            "http_code",
            "during_ms",
            "request_size_b",
            "response_size_b",
        ]; _i < _a.length; _i++) {
            var intKey = _a[_i];
            if (_.has(extraInfo, [intKey])) {
                var code = parseInt(extraInfo[intKey]);
                if (isNaN(code) === false) {
                    detail[intKey] = code;
                }
                else {
                    detail[intKey] = 0; // 赋上默认值
                }
            }
        }
        // 将rawDetail中的其余key存到extra中
        for (var _b = 0, _c = Object.keys(extraInfo); _b < _c.length; _b++) {
            var extraKey = _c[_b];
            var protectKeyMap = {
                error_no: true,
                error_name: true,
                url: true,
                http_code: true,
                during_ms: true,
                request_size_b: true,
                response_size_b: true,
            };
            if (protectKeyMap[extraKey] !== true) {
                extra[extraKey] = extraInfo[extraKey];
            }
        }
        this.debugLogger("发送自定义错误数据, 上报内容 => ", { detail: detail, extra: extra });
        return this.error(8, detail, extra);
    };
    /**
     * 提供通用的埋点方法
     * @param {String} name
     * @param {*} args
     */
    Logger.prototype.logger = function (name, args, extra) {
        if (name === void 0) { name = ""; }
        if (args === void 0) { args = {}; }
        if (extra === void 0) { extra = {}; }
        if (!name)
            return this.debugLogger("警告: 未设置【name】(打点事件名)属性, 无法统计该打点数据！");
        if (typeof name !== "string")
            return this.debugLogger("【name属性】(打点事件名)仅支持字符串类型！");
        this.debugLogger("\u53D1\u9001\u3010event\u3011\u7C7B\u578B\u57CB\u70B9\uFF0C\u4E8B\u4EF6\u540D\uFF1A\u3010" + name + "\u3011. \u4E0A\u62A5\u5185\u5BB9 => ", args);
        this.send({
            type: "event",
            name: name,
            props: __assign({}, args),
            extra: extra,
        });
    };
    /**
     * 白屏检测功能API
     * @param {*} target     需要监测DOM变动的节点
     * @param {*} notify     【必填】错误上报的配置
     * @param {*} config     【可选】监测配置
     * @param {*} cb         【可选】需要执行的业务回调
     *
     * @returns {Instance of MutationObserver} 返回MutationObserver的实例，业务可根据需要调用disconnect方法来关闭监测
     */
    Logger.prototype.detect = function (target, notify, config, cb) {
        var _this = this;
        if (target === void 0) { target = document.documentElement; }
        if (notify === void 0) { notify = {}; }
        if (config === void 0) { config = {}; }
        if (cb === void 0) { cb = noop; }
        if (_.isFunction(config)) {
            cb = config;
            config = {};
        }
        var _a = notify.errorName, errorName = _a === void 0 ? "加载页面异常_WhiteScreen" : _a, _b = notify.url, url = _b === void 0 ? "" + location.host + location.pathname : _b, _c = notify.extraInfo, extraInfo = _c === void 0 ? {} : _c;
        var CONF = {
            subtree: true,
            childList: true,
            attributes: false,
            characterData: false,
            timeout: 5 * 1000,
        };
        config = _.merge(CONF, config);
        this.debugLogger("\u767D\u5C4F\u68C0\u6D4B\u914D\u7F6E: ====>", config, cb);
        if (!isDom(target)) {
            clog("param [target] must be a instance of HTMLElement");
            return;
        }
        var _d = config.timeout, timeout = _d === void 0 ? 5 * 1000 : _d, _e = config.childList, childList = _e === void 0 ? true : _e, _f = config.attributes, attributes = _f === void 0 ? false : _f, _g = config.characterData, characterData = _g === void 0 ? false : _g;
        if (!(attributes || childList || characterData)) {
            clog("attributes childList characterData\u914D\u7F6E\u4E0D\u5408\u6CD5, \u8DF3\u8FC7\u767D\u5C4F\u68C0\u6D4B");
            return;
        }
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (!MutationObserver)
            return clog("您的浏览器不支持 MutationObserver API, 跳过白屏检测");
        // 超过设置的超时时间后，执行该逻辑，上报白屏错误
        var timer = setTimeout(function () {
            _this.notify(errorName, url, extraInfo);
            _.isFunction(cb) && cb(mo);
        }, timeout);
        var mo = void 0;
        var callback = function (records) {
            clearTimeout(timer);
            _.isFunction(cb) && cb(mo, records);
        };
        mo = new MutationObserver(callback);
        mo.observe(target, config);
        return mo;
    };
    return Logger;
}(Base));
var logger = new Logger();
// 注册项目名: dt => downtown
window.dt = logger;
var Elog = logger.error.bind(logger);
var Plog = logger.product.bind(logger);
var Ilog = logger.info.bind(logger);

export default logger;
export { Elog, Ilog, Plog };
