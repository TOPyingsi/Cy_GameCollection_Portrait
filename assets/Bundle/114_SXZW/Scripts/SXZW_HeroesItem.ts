import { _decorator, Color, Component, Label, Mesh, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { SXZW_GameManage } from './SXZW_GameManage';
const { ccclass, property } = _decorator;

@ccclass('SXZW_HeroesItem')
export class SXZW_HeroesItem extends Component {

    @property(Sprite)
    public sprite: Sprite = null;

    @property(Node)
    private buttonNode: Node = null;

    @property(Sprite)
    public icon: Sprite = null;

    @property(Label)
    private label: Label = null;

    @property(Sprite)
    private bgSprite: Sprite = null;

    @property({ type: SpriteFrame, group: "英雄数据" })
    private spriteFrame: SpriteFrame = null

    @property({ type: Mesh, group: "英雄数据" })
    public mesh: Mesh = null

    @property({ type: Boolean, group: "英雄数据" })
    public showFace: boolean = true

    @property({ type: Vec3, group: "英雄数据" })
    public position: Vec3 = null

    @property({ type: Vec3, group: "英雄数据" })
    public rotation: Vec3 = null

    @property(Boolean)
    public isVideo: boolean = false

    @property(Number)
    public money: number = 0

    public get heroesName(): string {
        return this.spriteFrame.name
    }

    start() {
        this.sprite.spriteFrame = this.spriteFrame;
    }

    public init(isUnlock: boolean, onClick: (item: SXZW_HeroesItem) => void) {
        this.buttonNode.targetOff(this);
        this.sprite.node.parent.targetOff(this);
        if (isUnlock) {
            this.buttonNode.active = false;
            this.sprite.node.parent.on(Node.EventType.TOUCH_END, () => onClick(this), this)
        } else {
            this.buttonNode.active = true;
            this.buttonNode.on(Node.EventType.TOUCH_END, () => onClick(this), this)
            this.sprite.node.parent.on(Node.EventType.TOUCH_END, () => {
                SXZW_GameManage.Instance.showTips("未解锁该英雄");
            }, this)
            if (this.isVideo) {
                this.label.string = "获取";
                this.bgSprite.color = new Color(0, 255, 255);
            } else {
                this.label.string = `${this.money}`;
                this.bgSprite.color = new Color(0, 255, 0);
            }

        }
    }

    protected onDestroy(): void {
        try { this.buttonNode?.targetOff(this); } catch { }
        this.sprite?.node?.parent?.targetOff(this);
    }

}


