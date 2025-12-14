import { _decorator, Animation, AnimationClip, Label, Node, Prefab, sp } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import { THLCB_DataManager } from './THLCB_DataManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { THLCB_Item } from './THLCB_Item';
import { THLCB_AudioManager } from './THLCB_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_UpgradePanel')
export class THLCB_UpgradePanel extends THLCB_UIBase {

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property(Label)
    levelLabel: Label;

    @property(Prefab)
    itemPrefab: Prefab;

    @property(Node)
    content: Node;

    protected _InitData(): void {
        THLCB_AudioManager.Instance._PlaySound(44);
        this._UpdateSkin();
        this._InitNewItems();
    }

    _InitNewItems() {
        let level = THLCB_DataManager.Instance.getNumberData("Level");
        this.levelLabel.string = "等级 " + level;
        let num = 0;
        for (let i = 0; i < THLCB_DataManager.unlockItemLevels.length; i++) {
            const element = THLCB_DataManager.unlockItemLevels[i];
            if (element == level) {
                let item = this.content.children[num];
                if (!item) item = PoolManager.GetNodeByPrefab(this.itemPrefab, this.content);
                item.getComponent(THLCB_Item)._Init(i, false);
                num++;
            }
        }
    }

    _UpdateSkin() {
        let num = THLCB_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin("pifu" + num);
    }

    ClosePanel(): void {
        THLCB_AudioManager.Instance._PlaySound(1);
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}