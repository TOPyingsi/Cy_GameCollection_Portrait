import { _decorator, Component, Event, EventTouch, Node, Prefab, ScrollView, Sprite, SpriteFrame, UIOpacity, UITransform, v3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('NZAJS_GameManager')
export class NZAJS_GameManager extends Component {

    private static instance: NZAJS_GameManager;
    public static get Instance(): NZAJS_GameManager {
        return this.instance;
    }

    @property(Node)
    book: Node;

    @property(Node)
    content: Node;

    @property(Node)
    touchNode: Node;

    @property(Node)
    finish: Node;

    @property(Node)
    finishPanel: Node;

    @property([SpriteFrame])
    touchSfs: SpriteFrame[] = [];

    @property(GamePanel)
    GamePanel: GamePanel;

    @property(Prefab)
    Prefab: Prefab;

    protected onLoad(): void {
        NZAJS_GameManager.instance = this;
        this.GamePanel.answerPrefab = this.Prefab;
        this.GamePanel.winStr = "真好看!";
    }

    start() {
        for (let i = 0; i < this.book.children.length; i++) {
            const element = this.book.children[i];
            element.on(Node.EventType.TOUCH_START, this.TouchStart, this);
            element.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
            element.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
            element.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
            const element2 = this.content.children[i];
            element2.on(Node.EventType.TOUCH_START, this.TouchStart, this);
            element2.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
            element2.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
            element2.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        }
    }

    update(deltaTime: number) {

    }

    TouchStart(event: EventTouch) {
        let node: Node = event.target;
        node.getComponent(UIOpacity).opacity = 0;
        let num = node.getSiblingIndex();
        this.touchNode.setWorldPosition(v3(event.getUILocation().x, event.getUILocation().y));
        this.touchNode.getComponent(Sprite).spriteFrame = this.touchSfs[num];
        this.touchNode.active = true;
        this.content.parent.parent.getComponent(ScrollView).enabled = false;
    }

    TouchMove(event: EventTouch) {
        this.touchNode.setWorldPosition(v3(event.getUILocation().x, event.getUILocation().y));
    }

    TouchEnd(event: EventTouch) {
        let node: Node = event.target;
        let num = node.getSiblingIndex();
        if (this.book.getComponent(UITransform).getBoundingBoxToWorld().contains(event.getUILocation())) {
            if (this.book.children.indexOf(node) != -1) {
                node.setWorldPosition(v3(event.getUILocation().x, event.getUILocation().y));
                node.getComponent(UIOpacity).opacity = 255;
            }
            else {
                let node2 = this.book.children[num];
                node2.setWorldPosition(v3(event.getUILocation().x, event.getUILocation().y));
                node2.active = true;
                node.active = false;
                this.Check();
            }
        }
        node.getComponent(UIOpacity).opacity = 255;
        this.touchNode.active = false;
        this.content.parent.parent.getComponent(ScrollView).enabled = true;
    }

    Check() {
        for (let i = 0; i < this.content.children.length; i++) {
            const element = this.content.children[i];
            if (element.active) return;
        }
        this.finish.active = true;
    }

    Finish() {
        this.finish.active = false;
        this.finishPanel.active = true;
        this.scheduleOnce(() => {
            console.log("Victory");
            this.GamePanel.Win();
        }, 2);
    }
}


