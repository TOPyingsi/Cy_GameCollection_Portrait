import { _decorator, Animation, AnimationClip, Label, Node, Prefab, sp } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { GDDSCBASMR_Item } from './GDDSCBASMR_Item';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_UpgradePanel')
export class GDDSCBASMR_UpgradePanel extends GDDSCBASMR_UIBase {

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property(Label)
    levelLabel: Label;

    @property(Prefab)
    itemPrefab: Prefab;

    @property(Node)
    content: Node;

    protected _InitData(): void {
        GDDSCBASMR_AudioManager.Instance._PlaySound(44);
        this._UpdateSkin();
        this._InitNewItems();
    }

    _InitNewItems() {
        let level = GDDSCBASMR_DataManager.Instance.getNumberData("Level");
        this.levelLabel.string = "等级 " + level;
        let num = 0;
        for (let i = 0; i < GDDSCBASMR_DataManager.unlockItemLevels.length; i++) {
            const element = GDDSCBASMR_DataManager.unlockItemLevels[i];
            for (let j = 0; j < element.length; j++) {
                const element2 = element[j];
                if (element2 == level) {
                    let item = this.content.children[num];
                    if (!item) item = PoolManager.GetNodeByPrefab(this.itemPrefab, this.content);
                    item.getComponent(GDDSCBASMR_Item)._Init(i, j, false);
                    num++;
                }
            }
        }
    }

    _UpdateSkin() {
        let num = GDDSCBASMR_DataManager.Instance.getNumberData("Skin");
        this.player.setSkin("pifu" + num);
    }

    ClosePanel(): void {
        GDDSCBASMR_AudioManager.Instance._PlaySound(1);
        let ani = this.node.getComponent(Animation);
        ani.getState("panelIntro").wrapMode = AnimationClip.WrapMode.Default;
        ani.play();
    }
}