import { _decorator, Node, EventTarget } from 'cc';
/**
 * 事件消息中心
 * 用于全局事件的管理和分发
 */

export class THLCB_EventCenter {
    private static _instance: THLCB_EventCenter;
    private _eventTarget: EventTarget;

    private constructor() {
        this._eventTarget = new EventTarget();
    }

    /**
     * 获取事件中心的单例实例
     */
    public static get instance(): THLCB_EventCenter {
        if (!this._instance) {
            this._instance = new THLCB_EventCenter();
        }
        return this._instance;
    }

    /**
     * 监听事件
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 回调函数的上下文
     */
    public on(eventName: string, callback?: (...args: any[]) => void, target?: any): void {
        this._eventTarget.on(eventName, callback, target);
        console.log("注册" + eventName);
    }

    /**
     * 一次性监听事件
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 回调函数的上下文
     */
    public once(eventName: string, callback?: (...args: any[]) => void, target?: any): void {
        this._eventTarget.once(eventName, callback, target);
    }

    /**
     * 移除事件监听
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 回调函数的上下文
     */
    public off(eventName: string, callback?: (...args: any[]) => void, target?: any): void {
        this._eventTarget.off(eventName, callback, target);
    }

    /**
     * 触发事件
     * @param eventName 事件名称
     * @param arg1 传递给回调函数的参数（可选）
     * @param arg2 传递给回调函数的参数（可选）
     * @param arg3 传递给回调函数的参数（可选）
     */
    public emit(eventName: string, arg1?: any, arg2?: any, arg3?: any): void {
        this._eventTarget.emit(eventName, arg1, arg2, arg3);
        console.log("触发" + eventName);
    }
}

// 导出单例实例
export const eventCenter = THLCB_EventCenter.instance;