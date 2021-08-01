import { AnyReportConfig } from "../types";

/**
 * debounce
 *
 * @param {Function} func 实际要执行的函数
 * @param {Number} delay 延迟时间，单位是 ms
 * @param {Function} callback 在 func 执行后的回调
 *
 * @return {Function}
 */
export function debounce(
    func: Function | undefined,
    delay: number,
    callback?: Function
) {
    let timer: any = null;

    return function (this: any, ...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func && func.apply(this, args);
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
export function merge(src: Partial<AnyReportConfig>, dest: AnyReportConfig) {
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
export function isFunction(func: any) {
    return Object.prototype.toString.call(func) === "[object Function]";
}

/**
 * 将类数组转化成数组
 *
 * @param  {Object} arrayLike 类数组对象
 * @return {Array} 转化后的数组
 */
export function arrayFrom(arrayLike: any) {
    return [].slice.call(arrayLike);
}
