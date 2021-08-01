import { arrayFrom, isFunction, merge } from "./util";

var tryJS: any = {
    wrap,
    wrapArgs: tryifyArgs,
};

var config: any = {
    handleTryCatchError: function (error: any) {
        console.log(error);
    },
};

export function setting(opts: any) {
    merge(opts, config);
}

function wrap(func: any) {
    return isFunction(func) ? tryify(func) : func;
}

/**
 * 将函数使用 try..catch 包装
 *
 * @param  {Function} func 需要进行包装的函数
 * @return {Function} 包装后的函数
 */
function tryify(func: any) {
    // 确保只包装一次
    if (!func._wrapped) {
        func._wrapped = function () {
            try {
                return func.apply(this, arguments);
            } catch (error) {
                config.handleTryCatchError(error);
                (window as any).ignoreError = true;
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
function tryifyArgs(func: any) {
    return function (...args: any[]) {
        var args = arrayFrom(arguments).map(function (arg) {
            return wrap(arg);
        });
        // @ts-ignore
        return func.apply(this, args);
    };
}

export default tryJS;
