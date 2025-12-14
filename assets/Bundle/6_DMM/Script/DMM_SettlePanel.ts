import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { DMM_Award } from './DMM_Award';
import { DMM_GameManager } from './DMM_GameManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('DMM_SettlePanel')
export class DMM_SettlePanel extends Component {
    public static Instance: DMM_SettlePanel = null;

    @property(Label)
    Reward: Label = null;

    @property(Node)
    AwardStart: Node = null;

    Multiple: number = 1;

    FillRange: number = 0;

    private _rewardNum: number = 100;
    private _pendantIndex: number = 0;

    protected onLoad(): void {
        DMM_SettlePanel.Instance = this;
    }

    protected start(): void {
        this.showUI();
    }

    showUI() {
        this.Reward.string = this._rewardNum.toString();
    }

    getAward() {
        DMM_GameManager.Instance.closeSettlePanel();
        BundleManager.LoadPrefab(GameManager.GameData.Bundles[0], "Bundle/DMM_Prefabs/Award").then((prefab: Prefab) => {
            const award: Node = instantiate(prefab);
            award.parent = DMM_GameManager.Instance.Canvas;
            award.getComponent(DMM_Award).init(this.AwardStart.getWorldPosition().clone(), DMM_GameManager.Instance.AwardTarget.getWorldPosition(), () => {
                DMM_GameManager.Instance.showGold(this._rewardNum * this.Multiple);
            });
        })
    }
}


