import { _decorator, Component, find, Label, Node, Sprite, SpriteFrame, tween, Tween, UITransform, Vec3 } from 'cc';
import { XDMKQ_AUDIO, XDMKQ_SUPPLY_ITEM } from './XDMKQ_Constant';
import { XDMKQ_GameManager } from './XDMKQ_GameManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_PanelManager } from './XDMKQ_PanelManager';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_SupplyItem')
export class XDMKQ_SupplyItem extends Component {

    @property(SpriteFrame)
    RankIconSFs: SpriteFrame[] = [];

    @property(SpriteFrame)
    SupplyIconSFs: SpriteFrame[] = [];

    RankIcon: Sprite = null;
    SupplyIcon: Sprite = null;
    Price: Label = null;
    SupplyType: Label = null;
    Amplification: Label = null;

    private _isClick: boolean = true;
    private _price: number = 0;
    private _height: number = 0;
    private _startPos: Vec3 = new Vec3();
    private _index: number = 0;
    protected onLoad(): void {
        this.RankIcon = find("RankIcon", this.node).getComponent(Sprite);
        this.SupplyIcon = find("SupplyIcon", this.node).getComponent(Sprite);
        this.Price = find("Price", this.node).getComponent(Label);
        this.SupplyType = find("SupplyType", this.node).getComponent(Label);
        this.Amplification = find("Amplification", this.node).getComponent(Label);
        this._height = this.getComponent(UITransform).height;
        this._startPos = this.node.position.clone();

        this.node.on(Node.EventType.TOUCH_END, this.Click, this);
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_SUPPLYITEM_CLICK, this.ClickByVideo, this);
    }

    Init(supply: XDMKQ_SUPPLY_ITEM, index: number) {
        this._index = index;
        this._price = (supply.Grade + 1) * 100;

        this.RankIcon.spriteFrame = this.RankIconSFs[supply.Grade];
        this.SupplyIcon.spriteFrame = this.SupplyIconSFs[supply.Supply];
        this.Price.string = this._price.toString();
        this.SupplyType.string = supply.Tips1;
        this.Amplification.string = supply.Tips2;
    }

    Switch() {
        Tween.stopAllByTarget(this.node);
        this.node.setPosition(this._startPos);
        tween(this.node)
            .by(0.5, { y: -this._height }, { easing: "sineOut" })
            .call(() => {
                this.node.setPosition(this._startPos.clone().add3f(0, this._height, 0));
                XDMKQ_GameManager.Instance.AddSupply(this._index);
                let supply = XDMKQ_GameManager.Instance.ChangeSupply(this._index);
                while (supply == null) supply = XDMKQ_GameManager.Instance.ChangeSupply(this._index);
                this.Init(supply, this._index);
            })
            .by(0.5, { y: -this._height }, { easing: "sineOut" })
            .call(() => {
                this._isClick = true;
            })
            .start();
    }

    Click() {
        if (!this._isClick) {
            return;
        }
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.点击);
        if (XDMKQ_GameManager.Instance.GoldCount < this._price) {
            XDMKQ_PanelManager.Instance.ShowTips("金币不足！");
            return;
        }
        XDMKQ_GameManager.Instance.ShowGold(-this._price);
        this._isClick = false;
        this.Switch();
    }

    ClickByVideo() {
        this._isClick = false;
        this.Switch();
    }
}


