type JS_ERROR_REPORT_CONFIG = {
    ERROR_RUNTIME: boolean; // js运行时报错
    ERROR_SCRIPT: boolean; // js资源加载失败
    ERROR_STYLE: boolean; // css资源加载失败
    ERROR_IMAGE: boolean; // 图片资源加载失败
    ERROR_AUDIO: boolean; // 音频资源加载失败
    ERROR_VIDEO: boolean; // 视频资源加载失败
    ERROR_CONSOLE: boolean; // vue运行时报错
    ERROR_TRY_CATCH: boolean; // 未catch错误
    checkErrorNeedReport?: (desc?: string, stack?: string) => boolean;
};

export type MonitorConfig = {
    pid: string;
    uuid: string;
    ucid: string;
    is_test: boolean;
    record: {
        time_on_page: boolean;
        performance: boolean; //
        js_error: boolean; //
        js_error_report_config: JS_ERROR_REPORT_CONFIG;
    };
    version: string;
    getPageType?: (...args: any[]) => any;
};

export type MonitorConfigArray = [config: MonitorConfig, isOverwrite?: boolean];

export type Monitor = {
    tryJS(): void;
    init(opts: any): void;
};

export type Report = (errorLogList: any[]) => void;

export interface ReportConfig {
    concat: boolean; // 是否延时处理
    delay: number; // 错误处理间隔时间
    maxError: number; // 异常报错数量限制
    sampling: number; // 采样率
    report?: Report;
}

export interface MonitorInitOptions {
    concat: boolean; //
    report?: Report;
}

export interface AnyReportConfig extends ReportConfig {
    [extraParam: string]: any;
}
export interface AnyMonitorInitOptions extends MonitorInitOptions {
    [extraParam: string]: any;
}
/* 错误类型 */
export type ERROR_TYPE = {
    SCRIPT: number;
    LINK: number;
    IMG: number;
    AUDIO: number;
    VIDEO: number;
    [extraParam: string]: any;
};
