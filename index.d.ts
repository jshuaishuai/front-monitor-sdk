declare type JS_ERROR_REPORT_CONFIG = {
    ERROR_RUNTIME: boolean;
    ERROR_SCRIPT: boolean;
    ERROR_STYLE: boolean;
    ERROR_IMAGE: boolean;
    ERROR_AUDIO: boolean;
    ERROR_VIDEO: boolean;
    ERROR_CONSOLE: boolean;
    ERROR_TRY_CATCH: boolean;
    checkErrorNeedReport?: (desc?: string, stack?: string) => boolean;
};
declare type MonitorConfig = {
    pid: string;
    uuid: string;
    ucid: string;
    is_test: boolean;
    record: {
        time_on_page: boolean;
        performance: boolean;
        js_error: boolean;
        js_error_report_config: JS_ERROR_REPORT_CONFIG;
    };
    version: string;
    getPageType?: (...args: any[]) => any;
};
declare type MonitorConfigArray = [config: MonitorConfig, isOverwrite?: boolean];

declare class Base {
    isTest: boolean;
    isOverwrite: boolean;
    needRecordJsError: boolean;
    needRecordTimeOnPage: boolean;
    needRecordPerformance: boolean;
    config: Object;
    constructor();
    computeConfig(config?: {}): any;
    init(config?: MonitorConfig, isOverwrite?: boolean): void;
    send(info?: {}): void;
    /**
     * 打点数据上报方法
     * @param {类型} type
     * @param {code码} code
     * @param {消费数据} detail
     * @param {展示数据} extra
     */
    log(type: string | undefined, code: number, detail?: {}, extra?: {}): string | undefined;
    error(code: number, detail: any, extra?: any): string | undefined;
    product(code: number, detail: any, extra?: any): string | undefined;
    info(code: number, detail: any, extra?: any): string | undefined;
    debugLogger(...args: any[]): void;
}
declare class Logger extends Base {
    constructor();
    set(...args: MonitorConfigArray): void;
    /**
     * 用户行为监控
     * @param {String} code [必填]用户行为标识符, 用于唯一判定用户行为类型, 最多50字符( menu/click/button_1/button_2/etc)
     * @param {String} name [必填]用户行为名称, 和code对应, 用于展示, 最多50字符
     * @param {String} url  [可选]用户点击页面url, 可以作为辅助信息, 最多200字符
     */
    behavior(code?: string, name?: string, url?: string): void;
    notify(errorName?: string, url?: string, extraInfo?: any): string | undefined;
    /**
     * 提供通用的埋点方法
     * @param {String} name
     * @param {*} args
     */
    logger(name?: string, args?: {}, extra?: {}): void;
    /**
     * 白屏检测功能API
     * @param {*} target     需要监测DOM变动的节点
     * @param {*} notify     【必填】错误上报的配置
     * @param {*} config     【可选】监测配置
     * @param {*} cb         【可选】需要执行的业务回调
     *
     * @returns {Instance of MutationObserver} 返回MutationObserver的实例，业务可根据需要调用disconnect方法来关闭监测
     */
    detect(target?: HTMLElement, notify?: any, config?: any, cb?: any): any;
}
declare const logger: Logger;
declare const Elog: (code: number, detail: any, extra?: any) => string | undefined;
declare const Plog: (code: number, detail: any, extra?: any) => string | undefined;
declare const Ilog: (code: number, detail: any, extra?: any) => string | undefined;

export default logger;
export { Elog, Ilog, Plog };
