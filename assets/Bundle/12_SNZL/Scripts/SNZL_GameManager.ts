import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { SNZL_LV, SNZL_LVNAME } from './SNZL_Constant';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('SNZL_GameManager')
export class SNZL_GameManager extends Component {
    public static Instance: SNZL_GameManager = null;

    @property(GamePanel)
    GamePanel: GamePanel = null;

    @property(Prefab)
    Answer1: Prefab = null;

    @property(Prefab)
    Answer2: Prefab = null;

    @property(Node)
    LV: Node = null;

    public static CurLV: SNZL_LV = SNZL_LV.LV1;

    protected onLoad(): void {
        SNZL_GameManager.Instance = this;
        if (GameManager.GameData.gameName === "收纳整理1") {
            this.GamePanel.answerPrefab = this.Answer1;
        } else if (GameManager.GameData.gameName === "收纳整理2") {
            this.GamePanel.answerPrefab = this.Answer2;
        }
        this.GamePanel.winStr = "英雄出少年！试试别的关卡吧！"
    }

    protected start(): void {
        this.loadLV();
    }

    loadLV() {
        this.LV.removeAllChildren();
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, `Prefabs/${GameManager.GameData.gameName}`).then((prefab: Prefab) => {
            const lv = instantiate(prefab);
            lv.parent = this.LV;
            lv.setPosition(Vec3.ZERO);
        })
    }
}


