import { _decorator, Component, director, Label, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { SHJWZ_GameMgr } from './SHJWZ_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJWZ_Target')
export class SHJWZ_Target extends Component {

    @property()
    targetID: number = 0;

    public isPass: boolean = false;

    public targetContent: Node = null;

    public TouchNode: Node = null;
    public RoleNode: Node = null;

    private talkWindow: Node = null;
    private talkLabel: Label = null;

    private isFirst: boolean = false;
    start() {

        this.TouchNode = this.node.getChildByName("Touch");
        this.RoleNode = this.node.getChildByName("Role");

        this.talkWindow = this.node.getChildByName("对话框");
        this.talkLabel = this.talkWindow.getComponentInChildren(Label);

        let talk = SHJWZ_GameMgr.instance.talkWords[this.targetID];
        this.talkLabel.string = talk;

        director.getScene().on("山海经伪装_触发对话", (index: number) => {
            if (this.targetID === index) {
                SHJWZ_GameMgr.instance.isTalk = true;
                this.Talk();
            }
        }, this);

        this.roleMove();
    }

    Talk() {
        SHJWZ_GameMgr.instance.Talk(this.targetID);
        tween(this.talkWindow)
            .to(0.5, { scale: v3(1, 1, 1) })
            .start();
    }

    closeTalk() {
        tween(this.talkWindow)
            .to(0.5, { scale: v3(0, 0, 0) })
            .start();
    }

    changeRightSprite() {
        this.isPass = true;

        let spriteFrame = SHJWZ_GameMgr.instance.rightSprite[this.targetID];

        let sprite = this.RoleNode.getComponent(Sprite);

        sprite.spriteFrame = spriteFrame;

        this.closeTalk();
    }

    sign: number = 1;
    roleMove() {
        tween(this.RoleNode)
            .by(1, { scale: v3(0.01, 0.01, 0).multiplyScalar(this.sign), })
            .call(() => {
                this.sign = -this.sign;
                this.roleMove();
            })
            .start();
    }
}
