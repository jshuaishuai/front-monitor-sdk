import tryJS, { setting } from "./try";
import { debounce, merge } from "./util";
import { isObject } from "../utils";
import {
    Monitor,
    ReportConfig,
    Report,
    MonitorInitOptions,
    ERROR_TYPE,
} from "../types";

const init = function (opts: MonitorInitOptions) {
    __config(opts);
    __init();
};

let monitor: Monitor = {
    tryJS: tryJS,
    init: init,
};
monitor.tryJS = tryJS;

setting({ handleTryCatchError: handleTryCatchError });

// 忽略错误监听
(window as any).ignoreError = false;
// 错误日志列表
let errorList: any[] = [];
// 错误处理回调
let report: Report = function () {};

let config: ReportConfig = {
    concat: true, // 是否延时处理
    delay: 2000, // 错误处理间隔时间
    maxError: 16, // 异常报错数量限制
    sampling: 1, // 采样率
};

// 定义的错误类型码
let ERROR_RUNTIME = 1;
let ERROR_SCRIPT = 2;
let ERROR_STYLE = 3;
let ERROR_IMAGE = 4;
let ERROR_AUDIO = 5;
let ERROR_VIDEO = 6;
let ERROR_CONSOLE = 7;
let ERROR_TRY_CATHC = 8;

let LOAD_ERROR_TYPE: ERROR_TYPE = {
    SCRIPT: ERROR_SCRIPT,
    LINK: ERROR_STYLE,
    IMG: ERROR_IMAGE,
    AUDIO: ERROR_AUDIO,
    VIDEO: ERROR_VIDEO,
};

function __config(opts: Partial<ReportConfig>) {
    merge(opts, config);
    report = debounce(config.report, config.delay, function () {
        errorList = [];
    });
}

function __init() {
    // 监听 JavaScript 报错异常(JavaScript runtime error)
    // 监听资源加载错误(JavaScript Scource failed to load)
    window.addEventListener(
        "error",
        function (event: ErrorEvent) {
            // 过滤 target 为 window 的异常，避免与上面的 onerror 重复
            let errorTarget = event.target as any;
            if (
                errorTarget !== window &&
                errorTarget.nodeName &&
                LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()]
            ) {
                handleError(formatLoadError(errorTarget));
            } else {
                let { message, filename, lineno, colno, error } = event;
                const formatedError = formatRuntimerError(
                    message,
                    filename,
                    lineno,
                    colno,
                    error
                );
                handleError(formatedError);
            }
        },
        true
    );

    // 针对 vue 报错重写 console.error
    // TODO
    console.error = (function (origin) {
        const logErr = origin.error;
        return function (info: any, ...args: any[]) {
            info = isObject(info)
                ? JSON.stringify(info, Object.getOwnPropertyNames(info))
                : info;
            let errorLog = {
                type: ERROR_CONSOLE,
                desc: info,
            };
            logErr.call(origin, info, ...args);
            handleError(errorLog);
        };
    })(console);
}

// 处理 try..catch 错误
function handleTryCatchError(error: Error) {
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
function formatRuntimerError(
    message: any,
    source: any,
    lineno: any,
    colno: any,
    error: Error
) {
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
function formatLoadError(errorTarget: any) {
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
function formatTryCatchError(error: any) {
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
function handleError(errorLog: any) {
    // 是否延时处理
    if (!config.concat && config.report) {
        !needReport(config.sampling) || config.report([errorLog]);
    } else {
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
function pushError(errorLog: any) {
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
function needReport(sampling: any) {
    return Math.random() < (sampling || 1);
}

export default monitor;
