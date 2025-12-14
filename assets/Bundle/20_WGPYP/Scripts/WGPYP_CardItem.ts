import { _decorator, Button, Component, Label, Material, Node, Sprite, SpriteFrame, Tween, tween, v3, Vec3 } from 'cc';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { WGPYP_GameManager } from './WGPYP_GameManager';
const { ccclass } = _decorator;

@ccclass('WGPYP_CardItem')
export class WGPYP_CardItem extends Component {
    private static instance: WGPYP_CardItem = null;

    static getInstance(): WGPYP_CardItem {
        if (!this.instance) {
            this.instance = new WGPYP_CardItem();
        }
        return this.instance;
    }

    Icon: Sprite = null;
    Front: Sprite = null;
    xixi: Sprite = null;
    Label: Label = null;

    Card: Node = null;
    Back: Node = null;

    Button: Button = null;

    index: number = 0;
    callback: Function = null;


    Init(index: number, callback: Function) {
        this.Icon = NodeUtil.GetComponent("Icon", this.node, Sprite);
        this.Front = NodeUtil.GetComponent("Front", this.node, Sprite);
        this.xixi = NodeUtil.GetComponent("xixi", this.node, Sprite);
        this.Label = NodeUtil.GetComponent("Label", this.node, Label);
        this.Card = NodeUtil.GetNode("Card", this.node);
        this.Back = NodeUtil.GetNode("Back", this.node);
        this.Button = this.node.getComponent(Button);

        this.index = index;
        this.callback = callback;

        BundleManager.LoadSpriteFrame(GameManager.GameData.DefaultBundle, `Res/Images/${index}`).then((spriteFrame: SpriteFrame) => {
            this.xixi.spriteFrame = spriteFrame;
        });
    }


    OnButtonClick() {
        // if (WGPYP_GameManager.Instance.curCards.length >= 2) return;

        if (this.Card.scale.x < 0) {
            this.flipBack();
        } else {
            this.flip();
        }
    }

    getFrontImageName(): string {
        return this.xixi.spriteFrame.name;
    }

    Success(Material: Material = null) {
        // WGPYP_GameManager.Instance.ClearCard(this);
        this.Front.customMaterial = Material;
        this.Button.enabled = false;
    }

    flip() {
        // WGPYP_GameManager.Instance.curCards.push(this);

        this.Back.active = true;
        Tween.stopAllByTarget(this.Card);
        this.Card.setScale(v3(1, 1, 1));

        tween(this.Card).to(0.1, { scale: v3(0, 1, 1) })
            .call(() => this.Back.active = false).to(0.1, { scale: v3(-1, 1, 1) })
            .call(() => {
                this.callback(this);
            }).start();
    }

    flipBack() {
        // WGPYP_GameManager.Instance.ClearCard(this);

        this.Back.active = false;
        Tween.stopAllByTarget(this.Card);
        this.Card.setScale(v3(-1, 1, 1));

        tween(this.Card)
            .to(0.1, { scale: v3(0, 1, 1) })
            .call(() => {
                this.Back.active = true;
                tween(this.Card)
                    .to(0.1, { scale: v3(1, 1, 1) })
                    .start();
            })
            .start();
    }


}