import { _decorator, Button, Component, Node, size, sp, Sprite, SpriteFrame, UITransform, v3, Vec3 } from 'cc';
import { GDDSCBASMR_DataManager } from './GDDSCBASMR_DataManager';
import Banner from 'db://assets/Scripts/Banner';
import { GDDSCBASMR_GamePanel } from './GDDSCBASMR_GamePanel';
import { eventCenter } from './GDDSCBASMR_EventCenter';
const { ccclass, property } = _decorator;

@ccclass('GDDSCBASMR_Item')
export class GDDSCBASMR_Item extends Component {

    @property(Sprite)
    sprite: Sprite;

    @property(Button)
    button: Button;

    @property(Node)
    lock: Node;

    @property(Node)
    video: Node;

    @property([SpriteFrame])
    kuangSfs: SpriteFrame[] = [];

    type: number;
    num: number;

    _Init(_type: number, _num: number, isButton = true) {
        this._Cancel();
        this.type = _type;
        this.num = _num;
        switch (_type) {
            case 0:
                if (GDDSCBASMR_DataManager.moldSfs) this.sprite.spriteFrame = GDDSCBASMR_DataManager.moldSfs.find((value, index, obj) => { if (value.name == `mold${_num + 1}`) return value; });
                else eventCenter.once("moldSfs", () => { this.sprite.spriteFrame = GDDSCBASMR_DataManager.moldSfs.find((value, index, obj) => { if (value.name == `mold${_num + 1}`) return value; }); });
                this.sprite.sizeMode = Sprite.SizeMode.CUSTOM;
                this.sprite.getComponent(UITransform).setContentSize(size(495, 383));
                this.sprite.node.setScale(0.3, 0.3, 1);
                break;
            case 1:
                this.sprite.spriteFrame = GDDSCBASMR_DataManager.jellySfs.find((value, index, obj) => { if (value.name == GDDSCBASMR_DataManager.jellyName[_num]) return value; });
                this.sprite.sizeMode = Sprite.SizeMode.TRIMMED;
                this.sprite.node.setScale(Vec3.ONE);
                break;
            case 2:
                this.sprite.spriteFrame = GDDSCBASMR_DataManager.top1.find((value, index, obj) => { if (value.name == GDDSCBASMR_DataManager.top1Name[_num]) return value; });
                this.sprite.sizeMode = Sprite.SizeMode.TRIMMED;
                this.sprite.node.setScale(v3(0.5, 0.5, 1));
                break;
            case 3:
                this.sprite.spriteFrame = GDDSCBASMR_DataManager.top2.find((value, index, obj) => { if (value.name == `blink${_num}`) return value; });
                this.sprite.sizeMode = Sprite.SizeMode.CUSTOM;
                this.sprite.getComponent(UITransform).setContentSize(size(128, 128));
                this.sprite.node.setScale(Vec3.ONE);
                break;
        }
        this.button.enabled = isButton;
        let level = GDDSCBASMR_DataManager.Instance.getNumberData("Level");
        this.lock.active = isButton && GDDSCBASMR_DataManager.unlockItemLevels[_type][_num] > level;
        this.video.active = isButton && this.lock.active && GDDSCBASMR_DataManager.requestMubkang[_type] == _num;
        this.node.active = true;
    }

    Choose() {
        if (this.lock.active) {
            let x = this;
            if (this.video.active) Banner.Instance.ShowVideoAd(() => {
                x.lock.active = false;
                x.video.active = false;
                x._Choose();
            })
        }
        else this._Choose();
    }

    _Choose() {
        if (GDDSCBASMR_GamePanel.Instance.isAni) return;
        this.getComponent(Sprite).spriteFrame = this.kuangSfs[1];
        let item = GDDSCBASMR_GamePanel.Instance.content.children[GDDSCBASMR_DataManager.curMubkang[this.type]]?.getComponent(GDDSCBASMR_Item);
        item && item._Cancel();
        GDDSCBASMR_GamePanel.Instance.next.active = true;
        GDDSCBASMR_DataManager.curMubkang[this.type] = this.num;
        switch (this.type) {
            case 0:
                let mold = GDDSCBASMR_GamePanel.Instance.mubkang.children[0];
                mold.active = true;
                mold.getComponent(sp.Skeleton).setSkin(`mold${this.num + 1}/mold${this.num + 1}`);
                break;
            case 1:
                let juice = GDDSCBASMR_GamePanel.Instance.mubkang.children[1];
                juice.active = true;
                juice.getComponent(sp.Skeleton).setSkin(`juice/juice-${GDDSCBASMR_DataManager.jellyName[this.num]}`);
                break;
            case 2:
                let top1 = GDDSCBASMR_GamePanel.Instance.finishMubkang.children[1];
                top1.active = true;
                top1.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.top1.find((value, index, obj) => { if (value.name == GDDSCBASMR_DataManager.top1Name[this.num]) return value; });
                break;
            case 3:
                let top2 = GDDSCBASMR_GamePanel.Instance.top2;
                top2.active = true;
                top2.getComponent(Sprite).spriteFrame = GDDSCBASMR_DataManager.curMubkang[3] == 0 ? null : GDDSCBASMR_DataManager.top2.find((value, index, obj) => { if (value.name == `blink${this.num}`) return value; });
                let finishiTop2 = GDDSCBASMR_GamePanel.Instance.finishMubkang.children[0].getComponent(Sprite);
                finishiTop2.spriteFrame = GDDSCBASMR_DataManager.curMubkang[3] == 0 ? null : GDDSCBASMR_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${this.num}`) return value; });
                break;
        }
    }

    _Cancel() {
        this.getComponent(Sprite).spriteFrame = this.kuangSfs[0];
    }

}