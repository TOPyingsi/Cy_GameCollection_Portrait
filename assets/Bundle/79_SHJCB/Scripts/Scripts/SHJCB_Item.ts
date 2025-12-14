import { _decorator, Button, Component, Node, size, sp, Sprite, SpriteFrame, UITransform, v3, Vec3 } from 'cc';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import Banner from 'db://assets/Scripts/Banner';
import { SHJCB_GamePanel } from './SHJCB_GamePanel';
import { eventCenter } from './SHJCB_EventCenter';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_Item')
export class SHJCB_Item extends Component {

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
                if (SHJCB_DataManager.moldSfs) this.sprite.spriteFrame = SHJCB_DataManager.moldSfs.find((value, index, obj) => { if (value.name == `mold${_num + 1}`) return value; });
                else eventCenter.once("moldSfs", () => { this.sprite.spriteFrame = SHJCB_DataManager.moldSfs.find((value, index, obj) => { if (value.name == `mold${_num + 1}`) return value; }); });
                this.sprite.sizeMode = Sprite.SizeMode.CUSTOM;
                this.sprite.getComponent(UITransform).setContentSize(size(495, 383));
                this.sprite.node.setScale(0.3, 0.3, 1);
                break;
            case 1:
                this.sprite.spriteFrame = SHJCB_DataManager.jellySfs.find((value, index, obj) => { if (value.name == SHJCB_DataManager.jellyName[_num]) return value; });
                this.sprite.sizeMode = Sprite.SizeMode.TRIMMED;
                this.sprite.node.setScale(Vec3.ONE);
                break;
            case 2:
                this.sprite.spriteFrame = SHJCB_DataManager.top1.find((value, index, obj) => { if (value.name == SHJCB_DataManager.top1Name[_num]) return value; });
                this.sprite.sizeMode = Sprite.SizeMode.TRIMMED;
                this.sprite.node.setScale(v3(0.5, 0.5, 1));
                break;
            case 3:
                this.sprite.spriteFrame = SHJCB_DataManager.top2.find((value, index, obj) => { if (value.name == `blink${_num}`) return value; });
                this.sprite.sizeMode = Sprite.SizeMode.CUSTOM;
                this.sprite.getComponent(UITransform).setContentSize(size(128, 128));
                this.sprite.node.setScale(Vec3.ONE);
                break;
        }
        this.button.enabled = isButton;
        let level = SHJCB_DataManager.Instance.getNumberData("Level");
        this.lock.active = isButton && SHJCB_DataManager.unlockItemLevels[_type][_num] > level;
        this.video.active = isButton && this.lock.active && SHJCB_DataManager.requestMubkang[_type] == _num;
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
        if (SHJCB_GamePanel.Instance.isAni) return;
        this.getComponent(Sprite).spriteFrame = this.kuangSfs[1];
        let item = SHJCB_GamePanel.Instance.content.children[SHJCB_DataManager.curMubkang[this.type]]?.getComponent(SHJCB_Item);
        item && item._Cancel();
        SHJCB_GamePanel.Instance.next.active = true;
        SHJCB_DataManager.curMubkang[this.type] = this.num;
        switch (this.type) {
            case 0:
                let mold = SHJCB_GamePanel.Instance.mubkang.children[0];
                mold.active = true;
                mold.getComponent(sp.Skeleton).setSkin(`mold${this.num + 1}/mold${this.num + 1}`);
                break;
            case 1:
                let juice = SHJCB_GamePanel.Instance.mubkang.children[1];
                juice.active = true;
                juice.getComponent(sp.Skeleton).setSkin(`juice/juice-${SHJCB_DataManager.jellyName[this.num]}`);
                break;
            case 2:
                let top1 = SHJCB_GamePanel.Instance.finishMubkang.children[1];
                top1.active = true;
                top1.getComponent(Sprite).spriteFrame = SHJCB_DataManager.top1.find((value, index, obj) => { if (value.name == SHJCB_DataManager.top1Name[this.num]) return value; });
                break;
            case 3:
                let top2 = SHJCB_GamePanel.Instance.top2;
                top2.active = true;
                top2.getComponent(Sprite).spriteFrame = SHJCB_DataManager.curMubkang[3] == 0 ? null : SHJCB_DataManager.top2.find((value, index, obj) => { if (value.name == `blink${this.num}`) return value; });
                let finishiTop2 = SHJCB_GamePanel.Instance.finishMubkang.children[0].getComponent(Sprite);
                finishiTop2.spriteFrame = SHJCB_DataManager.curMubkang[3] == 0 ? null : SHJCB_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${this.num}`) return value; });
                break;
        }
    }

    _Cancel() {
        this.getComponent(Sprite).spriteFrame = this.kuangSfs[0];
    }

}