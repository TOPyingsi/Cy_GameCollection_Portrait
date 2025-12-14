import { _decorator, Animation, AnimationClip, Label, Node, Prefab, sp } from 'cc';
import { SHJCB_UIBase } from './SHJCB_UIBase';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { SHJCB_Item } from './SHJCB_Item';
import { SHJCB_AudioManager } from './SHJCB_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_UpgradePanel')
export class SHJCB_UpgradePanel extends SHJCB_UIBase {

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property(Label)
    levelLabel: Label;

    @property(Prefab)
    itemPrefab: Prefab;

    @property(Node)
    content: Node;

    protected _InitData(): void {
        SHJCB_AudioManager.Instance._PlaySound(44);
        this._UpdateSkin();
        this._InitNewItems();
    }

    _InitNewItems() {
        let level = SHJCB_DataManager.Instance.getNumberData("Level");
        this.levelLabel.string = "等级 " + level;
        let num = 0;
        for (let i = 0; i < SHJCB_DataManager.unlockItemLevels.length; i++) {
            const element = SHJCB_DataManager.unlockItemLevels[i];
            for (let j = 0; j < element.length; j++) {
                const element2 = element[j];
                if (element2 == level) {
                    let item = this.content.children[num];
                    if (!item) item = PoolManager.GetNodeByPrefab(this.itemPrefab, this.content);
                    item.getComponent(SHJCB_Item)._Init(i, j, false);
                    num++;
                }
            }
        }
    }

    _UpdateSkin() {
        let num = SHJCB_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin("pifu" + num);
    }

    ClosePanel(): void {
        SHJCB_AudioManager.Instance._PlaySound(1);
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}