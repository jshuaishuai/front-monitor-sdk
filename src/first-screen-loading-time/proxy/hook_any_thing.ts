/**
 * hooks any thing
 * @param ori
 * @param hooks :{
 *   key:function 或者是 { set:function  ，get:function }
 */
export default function hookAnyThing(ori: any, hooks: any) {
    for (let key in ori) {
        const hook = hooks[key];
        if (typeof ori[key] === "function") {
            // @ts-ignore
            hookFunction.call(this, key, ori, hook);
            continue;
        }
        // 不是方法的话肯定就是普通的值了
        // @ts-ignore

        hookOther.call(this, key, ori, hook);
    }
    // @ts-ignore
    return this;
}

/**
 * hook function
 * @param key
 * @param ori
 * @param hookFunc
 */
function hookFunction(key: any, ori: any, hookFunc: any) {
    // @ts-ignore
    this[key] = function (...args) {
        if (typeof hookFunc !== "function") {
            return ori[key].apply(ori, args);
        }
        return hookFunc.call(this, args, (args: any) =>
            ori[key].apply(ori, args)
        );
    };
}

/**
 * hook 非特殊值得
 * @param key
 * @param ori
 * @param hookFunc
 */
function hookOther(key: any, ori: any, hookFunc = {}) {
    const enumerable = ori.propertyIsEnumerable(key);
    let set, get;
    if (typeof hookFunc === "function") {
        set = function (val: any) {
            ori[key] = function (...args: any) {
                hookFunc.call(this, args, (args: any) => val.apply(this, args));
            };
        };
        get = function () {
            return ori[key];
        };
    } else {
        // @ts-ignore
        const { set: setFunc, get: getFunc } = hookFunc;
        set = function (val: any) {
            if (setFunc) {
                // @ts-ignore
                setFunc.call(this, val, (val) => (ori[key] = val));
            } else {
                ori[key] = val;
            }
        };
        get = function () {
            if (getFunc) {
                // @ts-ignore
                return getFunc.call(this, () => ori[key]);
            } else {
                return ori[key];
            }
        };
    }
    // @ts-ignore
    Object.defineProperty(this, key, {
        enumerable,
        set,
        get,
    });
}
