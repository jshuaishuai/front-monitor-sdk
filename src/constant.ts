// 打点服务器，或Nginx地址
export const TARGET = "http://localhost/dig.gif";
// 测试标记
export const TEST_FLAG = "b47ca710747e96f1c523ebab8022c19e9abaa56b";
// cookie 标识
export const COOKIE_NAME_DIVICE_ID = "crosSdkDT2019DeviceId";

type ERROR_MAP = {
    [propName: number]: string;
};
// 定义JS_TRACKER错误类型码
export const JS_TRACKER_ERROR_CONSTANT_MAP: ERROR_MAP = {
    1: "ERROR_RUNTIME", //运行时错误
    2: "ERROR_SCRIPT", //脚本错误
    3: "ERROR_STYLE", //样式错误
    4: "ERROR_IMAGE", //图片错误
    5: "ERROR_AUDIO", //音频错误
    6: "ERROR_VIDEO", //视频错误
    7: "ERROR_CONSOLE", //控制台错误
    8: "ERROR_TRY_CATCH", //try catch异常
};

export const JS_TRACKER_ERROR_DISPLAY_MAP: ERROR_MAP = {
    1: "JS_RUNTIME_ERROR", //JS运行时错误
    2: "SCRIPT_LOAD_ERROR", //脚本架构错误
    3: "CSS_LOAD_ERROR", //CSS架构错误
    4: "IMAGE_LOAD_ERROR", //图片加载错误
    5: "AUDIO_LOAD_ERROR", //音频加载错误
    6: "VIDEO_LOAD_ERROR", //视频加载错误
    7: "CONSOLE_ERROR", //控制台错误
    8: "TRY_CATCH_ERROR", //try catch错误
};

// 默认配置
export const DEFAULT_CONFIG = {
    pid: "template", // [必填]项目id,项目组统一分配
    uuid: "uuid-" + Math.random(), // [可选]设备唯一id, 用于计算uv数&设备分布. 一般在cookie中可以取到, 没有uuid可用设备mac/idfa/imei替代. 或者在storage的key中存入随机数字, 模拟设备唯一id.
    ucid: "ucid-" + Math.random(), // [可选]用户ucid, 用于发生异常时追踪用户信息, 一般在cookie中可以取到, 没有可传空字符串
    is_test: true, // 是否为测试数据, 默认为false(测试模式下打点数据仅供浏览, 不会展示在系统中)
    record: {
        time_on_page: true, // 是否监控用户在线时长数据, 默认为true
        performance: true, // 是否监控页面载入性能, 默认为true
        js_error: true, //  是否监控页面报错信息, 默认为true
        // 配置需要监控的页面报错类别, 仅在js_error为true时生效, 默认均为true(可以将配置改为false, 以屏蔽不需要上报的错误类别)
        js_error_report_config: {
            ERROR_RUNTIME: true, // js运行时报错
            ERROR_SCRIPT: true, // js资源加载失败
            ERROR_STYLE: true, // css资源加载失败
            ERROR_IMAGE: true, // 图片资源加载失败
            ERROR_AUDIO: true, // 音频资源加载失败
            ERROR_VIDEO: true, // 视频资源加载失败
            ERROR_CONSOLE: true, // vue运行时报错
            ERROR_TRY_CATCH: true, // 未catch错误
            // 自定义检测函数, 根据错误描述和栈信息 判断该错误是否需要打点
            checkErrrorNeedReport: (desc: string = "", stack: string = "") => {
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
    getPageType: (location = window.location) => {
        return `${location.host}${location.pathname}`;
    },
};
