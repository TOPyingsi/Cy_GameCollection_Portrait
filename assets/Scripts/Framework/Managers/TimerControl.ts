import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;



@ccclass('TimerControl')
export class TimerControl extends Component {

    public IncidentList: Map<string, { type: [Function, number, number, boolean, Node] }> = new Map<string, { type: [Function, number, number, boolean, Node] }>;

    private static _instance: TimerControl = null;
    public static get Instance(): TimerControl {
        if (!this._instance) {
            this._instance = new TimerControl();
        }
        return this._instance;
    }

    protected onLoad(): void {
        TimerControl._instance = this;
    }

    protected update(dt: number): void {
        this.IncidentList.forEach((data, key) => {
            data.type[1] -= dt;
            if (data.type[1] <= 0) {
                if (data.type[4].isValid) {//如果存在锚定节点
                    data.type[0]();//执行事件
                    if (data.type[3]) {//如果循环
                        data.type[1] = data.type[2];//重置时间
                    } else {
                        this.ReMoveIncident(key);//移除事件
                    }
                } else {
                    console.log(`事件管理:${key}的锚定节点已经消失，停止事件且删除事件！`);
                    this.ReMoveIncident(key);
                }
            }
        })
    }

    /**
     * 添加事件
     * @param IncidentName 事件名
     * @param fun 事件函数
     * @param Time 事件间隔（多少秒后执行事件）
     * @param anchoringNode 锚定节点(需要设定锚定节点，如果节点消失，事件终止)
     * @param isLoop 是否循环
     */
    AddIncident(IncidentName: string, fun: Function, Time: number, anchoringNode: Node, isLoop: boolean = false) {
        this.IncidentList.set(IncidentName, { type: [fun, Time, Time, isLoop, anchoringNode] });
    }
    /**
     * 移除事件
     * @param IncidentName 事件名
     */
    ReMoveIncident(IncidentName: string) {
        this.IncidentList.delete(IncidentName);
    }

}