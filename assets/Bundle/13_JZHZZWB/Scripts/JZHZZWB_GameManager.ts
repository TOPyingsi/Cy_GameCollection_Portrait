import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
import { GameManager } from '../../../Scripts/GameManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
const { ccclass, property } = _decorator;

@ccclass('JZHZZWB_GameManager')
export class JZHZZWB_GameManager extends Component {
    public static Instance: JZHZZWB_GameManager = null;

    @property(Node)
    LVParent: Node = null;

    @property(GamePanel)
    GamePanel: GamePanel = null;

    protected onLoad(): void {
        JZHZZWB_GameManager.Instance = this;
        this.loadLV();
        this.GamePanel.winStr = "不同的组合能有不一样的效果哦！";
    }

    loadLV() {
        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, `Prefabs/${GameManager.GameData.gameName}`).then((prefab: Prefab) => {
            const lv = instantiate(prefab);
            lv.parent = this.LVParent;
            this.GamePanel.time = 300;
        })
    }

}


