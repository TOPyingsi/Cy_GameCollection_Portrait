import { _decorator, CapsuleCollider, Component, find, Node, tween, UIOpacity, v3, Vec3 } from 'cc';
import { NZCK_LVController } from './NZCK_LVController';
import { NZCK_SoundController, NZCK_Sounds } from './NZCK_SoundController';
const { ccclass, property } = _decorator;

@ccclass('NZCK_Box')
export class NZCK_Box extends Component {
    Icon: Node = null;
    Mask: Node = null;
    Box: Node = null;
    Hand: Node = null;
    BoxOpen: Node = null;
    Card: Node = null;

    private _boxOpenPos: Vec3 = new Vec3();
    private _cardPos: Vec3 = new Vec3();
    private _isclick: boolean = false;

    protected onLoad(): void {
        this.Icon = this.node.getChildByName("Icon");
        this.Mask = this.node.getChildByName("Mask");
        this.Box = this.node.getChildByName("Box");
        this.Hand = this.node.getChildByName("Hand");
        this.BoxOpen = this.node.getChildByName("BoxOpen");
        this.Card = find("BoxOpen/Mask/卡包", this.node);

        this._boxOpenPos = this.BoxOpen.getWorldPosition().clone();
        this._cardPos = this.Card.getWorldPosition().clone();
    }

    show() {
        this.node.active = true;
        this.node.scale = v3(3, 3, 3);
        tween(this.node)
            .to(1, { scale: Vec3.ONE }, { easing: `sineOut` })
            .call(() => {
                NZCK_LVController.Instance.showJD();
            })
            .start();

        const uiOpacity: UIOpacity = this.node.getComponent(UIOpacity)
        if (uiOpacity) {
            uiOpacity.opacity = 50;
            tween(uiOpacity)
                .to(1, { opacity: 255 }, { easing: `sineOut` })
                .start();
        }
    }

    peel() {
        tween(this.Mask)
            .by(0.5, { position: v3(-700, 0, 0) }, { easing: `sineOut` })
            .call(() => {
                this.Mask.destroy();
                this.showBox();
            })
            .start();
    }

    showBox() {
        this.Icon.active = false;
        this.Box.active = true;
        this.Hand.active = true;
        tween(this.Hand)
            .to(1, { scale: v3(0.5, 0.5, 0.5) }, { easing: `sineOut` })
            .to(1, { scale: v3(1.2, 1.2, 1.2) }, { easing: `sineOut` })
            .union()
            .repeatForever()
            .start();
    }

    clickBox() {
        if (this._isclick) return;
        this._isclick = true;
        NZCK_SoundController.Instance.PlaySound(NZCK_Sounds.Click);
        this.Box.active = false;
        this.Hand.active = false;
        this.BoxOpen.active = true;

        this.showCard();
    }

    showCard() {
        this.Card.setWorldPosition(this._cardPos);
        this.Card.active = true;
        tween(this.Card)
            .by(1, { position: v3(0, 250, 0) }, { easing: `sineOut` })
            .call(() => {
                this.Card.active = false;
                NZCK_LVController.Instance.showCard();
                this.BoxOpen.setWorldPosition(this._boxOpenPos);
                tween(this.BoxOpen)
                    .by(1, { position: v3(-1000, 0, 0) }, { easing: `sineOut` })
                    .start();
            })
            .start();
    }

    showBoxOpen() {
        tween(this.BoxOpen)
            .by(1, { position: v3(1000, 0, 0) }, { easing: `sineOut` })
            .call(() => {
                this._isclick = false;
                this.showCard();
            })
            .start();
    }
}


