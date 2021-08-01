import proxyFetch from "./fetch";
import proxyXhr from "./xhr";

export default function (beforeAction: any, afterAction: any) {
    proxyFetch(beforeAction, afterAction);
    proxyXhr(beforeAction, afterAction);
}
