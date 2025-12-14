import { _decorator, Animation, Node, randomRangeInt, Sprite, tween, UIOpacity, v3, Vec3 } from 'cc';
import { GDDSCBASMR_UIBase } from './GDDSCBASMR_UIBase';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import { GDDSCBASMR_MainPanel } from './GDDSCBASMR_MainPanel';
import { eventCenter } from './GDDSCBASMR_EventCenter';
import { GDDSCBASMR_AudioManager } from './GDDSCBASMR_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_CompletePanel')
export class GDDSCBASMR_CompletePanel extends GDDSCBASMR_UIBase {

    @property(Animation)
    bunny: Animation;

    @property(Node)
    mubkang: Node;

    @property(Node)
    title: Node;

    @property(UIOpacity)
    bg: UIOpacity;

    protected onEnable(): void {
        GDDSCBASMR_AudioManager.Instance._PlaySound(49);
        this.bg.opacity = 0;
        tween(this.bg).to(0.5, { opacity: 255 }).start();
        this.bunny.node.setPosition(v3(0, -250));
        this.title.setScale(Vec3.ZERO);
        tween(this.title)
            .to(0.5, { scale: Vec3.ONE })
            .call(() => { this.bunny.play(); })
            .start();
        if (GDDSCBASMR_DataManager.mukbangSfs) this.mubkang.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${GDDSCBASMR_DataManager.curMubkang[0] + 1}-${GDDSCBASMR_DataManager.jellyName[GDDSCBASMR_DataManager.curMubkang[1]]}_1`) return value; });
        else eventCenter.once("mukbangSfs", () => { this.mubkang.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${GDDSCBASMR_DataManager.curMubkang[0] + 1}-${GDDSCBASMR_DataManager.jellyName[GDDSCBASMR_DataManager.curMubkang[1]]}_1`) return value; }); });
        this.mubkang.children[0].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.curMubkang[3] == 0 ? null : GDDSCBASMR_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${GDDSCBASMR_DataManager.curMubkang[3]}`) return value; });
        this.mubkang.children[1].getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.top1.find((value, index, obj) => { if (value.name == GDDSCBASMR_DataManager.top1Name[GDDSCBASMR_DataManager.curMubkang[2]]) return value; });
        this.scheduleOnce(() => {
            GDDSCBASMR_MainPanel.Instance._Fade(() => {
                GDDSCBASMR_MainPanel.Instance.gamePanel.active = false;
                this.node.active = false;
                GDDSCBASMR_MainPanel.Instance.eatPanel.active = true;
            })
        }, 3);
    }

}