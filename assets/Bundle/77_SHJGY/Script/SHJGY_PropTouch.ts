import { _decorator, Component, EventTouch, Label, Node, Sprite, SpriteFrame, UITransform, v2, Vec3 } from 'cc';
import { SHJGY_GameManager } from './SHJGY_GameManager';
import { SHJGY_AudioManager } from './SHJGY_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJGY_PropTouch')
export class SHJGY_PropTouch extends Component {

    @property(Node) gameArea: Node = null;
    @property(Node) objective: Node = null;
    @property(SpriteFrame) sf: SpriteFrame = null;

    private originalPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if (SHJGY_GameManager.instance.mask.active) return;
        const touchStartPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.originalPos = this.node.position.clone();
        this.node.setPosition(touchStartPos.x, touchStartPos.y);
    }

    onTouchMove(event: EventTouch) {
        if (SHJGY_GameManager.instance.mask.active) return;
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(touchMovePos.x, touchMovePos.y);
    }

    onTouchEnd(event: EventTouch) {
        if (SHJGY_GameManager.instance.mask.active) return;
        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        const touchNodeName = this.node.name
        const bol = this.objective.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
        let sf = this.objective.getComponent(Sprite).spriteFrame;

        try {
            if (bol) {

                if (touchNodeName == "钉子") {
                    if (sf.name == "木棍人大人_铁棒") {
                        this.node.active = false
                        this.objective.getComponent(Sprite).spriteFrame = this.sf;
                        const la = this.objective.getChildByName("Label")
                        la.active = true;
                        la.getChildByName("String").getComponent(Label).string = "我受伤了，体内打了几根钢钉";
                        const time = SHJGY_AudioManager.instance.playAudio("我受伤了，体内打了几根钢钉");
                        this.scheduleOnce(() => {
                            la.active = false;
                            SHJGY_GameManager.instance.xx()
                        }, time);
                    }
                    else {
                        this.node.setPosition(this.originalPos)
                    }
                }

                else if (touchNodeName == "钢笔") {
                    if (sf.name == "黄瓜大象") {
                        this.node.active = false
                        this.objective.getComponent(Sprite).spriteFrame = this.sf;
                        const la = this.objective.getChildByName("Label")
                        la.active = true;
                        la.getChildByName("String").getComponent(Label).string = "我头被打过语言系统出了点问题";
                        const time = SHJGY_AudioManager.instance.playAudio("我头被打过语言系统出了点问题");
                        this.scheduleOnce(() => {
                            la.active = false;
                            SHJGY_GameManager.instance.xx()
                        }, time);
                    }
                    else {
                        this.node.setPosition(this.originalPos)
                    }
                }

            }
            else {
                this.node.setPosition(this.originalPos)
            }

        } catch (error) {
            console.error(error)
        }

    }

}


