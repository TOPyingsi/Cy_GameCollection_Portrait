import { _decorator, Component, Label, Node, sp, Sprite, SpriteFrame } from 'cc';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import { SHJCB_DecorPanel } from './SHJCB_DecorPanel';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_DecorItem')
export class SHJCB_DecorItem extends Component {

    @property(Node)
    mask: Node;

    @property(Node)
    video: Node;

    @property(Node)
    own: Node;

    @property(Node)
    equip: Node;

    @property(Node)
    price: Node;

    @property(Label)
    priceLabel: Label;

    @property(Label)
    nameLabel: Label;

    @property(Sprite)
    kuangSprite: Sprite;

    @property(Sprite)
    icon: Sprite;

    @property(sp.Skeleton)
    player: sp.Skeleton;

    @property(sp.Skeleton)
    pet: sp.Skeleton;

    @property([sp.SkeletonData])
    petSpines: sp.SkeletonData[] = [];

    @property([SpriteFrame])
    kuangSfs: SpriteFrame[] = [];

    @property([SpriteFrame])
    decorBgSfs: SpriteFrame[] = [];

    @property([SpriteFrame])
    decorTableSfs: SpriteFrame[] = [];

    @property([SpriteFrame])
    decorSfs: SpriteFrame[] = [];

    type: number;
    num: number

    _Init(_type = this.type, _num = this.num) {
        this.type = _type;
        this.num = _num;
        for (let i = 0; i < this.mask.children.length; i++) {
            const element = this.mask.children[i];
            element.active = _type == i || (_type > 2 && i == 2) ? true : false;
        }
        let preName = "";
        switch (_type) {
            case 0:
                this.player.setSkin("pifu" + _num);
                this.player.animation = "daiji";
                preName = "Skin";
                this.nameLabel.string = "";
                break;
            case 1:
                this.pet.skeletonData = this.petSpines[_num];
                this.player.animation = "daiji";
                preName = "Pet";
                this.nameLabel.string = SHJCB_DataManager.allNames[1][_num];
                break;
            case 2:
                this.icon.spriteFrame = this.decorBgSfs.find((value, index, obj) => { if (value.name == "bg-" + (_num + 1)) return value; });
                preName = "Bg";
                this.nameLabel.string = "";
                break;
            case 3:
                this.icon.spriteFrame = this.decorTableSfs.find((value, index, obj) => { if (value.name == "table-" + (_num + 1)) return value; });
                preName = "Table";
                this.nameLabel.string = "";
                break;
            case 4:
                this.icon.spriteFrame = this.decorSfs.find((value, index, obj) => { if (value.name == "decor-" + (_num + 1)) return value; });
                preName = "Decor";
                this.nameLabel.string = "";
                break;
        }
        let data = SHJCB_DataManager.Instance.getArrayData<number>(preName + "States")[_num];
        if (data == 1) {
            this.video.active = false;
            this.price.active = false;
            let data2 = SHJCB_DataManager.Instance.getNumberData(preName);
            this.equip.active = data2 == _num;
            this.own.active = data2 != _num;
            this.kuangSprite.spriteFrame = this.kuangSfs[data2 == _num ? 1 : 0];
        }
        else {
            this.equip.active = false;
            this.own.active = false;
            let cost = SHJCB_DataManager.allDecorPrices[_type][_num];
            this.price.active = cost != -1;
            this.video.active = cost == -1;
            this.priceLabel.string = cost.toString();
            this.kuangSprite.spriteFrame = this.kuangSfs[0];
        }
        this.node.active = true;
    }

    Choose() {
        let preName = "";
        switch (this.type) {
            case 0:
                preName = "Skin";
                break;
            case 1:
                preName = "Pet";
                SHJCB_DecorPanel.Instance.buyPetData = this.pet.skeletonData;
                break;
            case 2:
                preName = "Bg";
                break;
            case 3:
                preName = "Table";
                break;
            case 4:
                preName = "Decor";
                break;
        }
        if (this.type > 1) SHJCB_DecorPanel.Instance.buyIcon = this.icon.spriteFrame;
        let choose = SHJCB_DataManager.Instance.getNumberData(preName);
        if (choose == this.num) return;
        let data = SHJCB_DataManager.Instance.getArrayData<number>(preName + "States")[this.num];
        if (data == 1) SHJCB_DecorPanel.Instance.ChooseDecor(this.type, this.num);
        else {
            let cost = SHJCB_DataManager.allDecorPrices[this.type][this.num];
            if (cost == -1) SHJCB_DecorPanel.Instance.VideoDecor(this.type, this.num);
            else SHJCB_DecorPanel.Instance.BuyDecor(this.type, this.num);
        }
    }

}