import hookAnyThing from "./hook_any_thing";

const orgXMLHttpRequest = window.XMLHttpRequest;

/**
 * 创建 proxyXMLHttpRequest
 * @param orXMLHttpRequestƒƒ
 */
export default function createProxyXMLHttpRequest(
    requestAction: any,
    responseAction: any
) {
    return function () {
        const xhr = new orgXMLHttpRequest();
        function onload(args: any, oriFunc: any) {
            if (xhr.readyState === 4) {
                responseAction();
            }
            // 在等于4得时候发送消息到存储中去
            oriFunc(args);
        }
        //@ts-ignore
        return hookAnyThing.call(this, xhr, {
            open(args: any, oriFunc: any) {
                // 这里计入请求发送队列，对并发得请求数做限制，最大不超过5个请求同时发送
                const [method, url] = args;
                requestAction(url, method);
                oriFunc(args);
            },
            onreadystatechange: onload,
            onload,
        });
    };
}
