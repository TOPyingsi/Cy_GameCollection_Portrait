import { _decorator, Component, director, Node, Prefab } from 'cc';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('NewComponent')
export class SHJXF_GlobalDt extends Component {

    //按顺序保存道具的触发节点(第一个是错误范围)
    @property([Node])
    Trigger: Node[] = [];

    @property(Prefab)
    panel: Prefab;

    //保存当前需要的道具索引
    public curPropIndex = 1;

    //保存当前失败次数
    public curErrorNum = 0;

    private static _instance: SHJXF_GlobalDt = null;

    public static get Instance(): SHJXF_GlobalDt {
        return this._instance;
    }

    
    protected onLoad(): void {
        SHJXF_GlobalDt._instance = this;

    }

    protected onEnable(): void {
        GamePanel.Instance.answerPrefab = this.panel;

    }











}


