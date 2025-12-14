import { _decorator, Component, EventTouch, Label, Node, tween, UITransform, Vec3 } from 'cc';
import { SHJGY_GameManager } from './SHJGY_GameManager';
import { SHJGY_AudioManager } from './SHJGY_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SHJGY_SBTouch')
export class SHJGY_SBTouch extends Component {

    @property(Node) gameArea: Node = null;
    @property(Node) objective: Node = null;

    private startPos: Vec3 = new Vec3();
    private issb: boolean = false;
    private isTriggered: boolean = false; // 添加触发状态标记
    private triggerCooldown: number = 1.0; // 冷却时间（秒）

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }


    onTouchStart(event: EventTouch) {
        if (this.issb) return;
        this.issb = true;
        this.startPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
    }

    onTouchMove(event: EventTouch) { }

    onTouchEnd(event: EventTouch) {
        if (this.isTriggered) return;

        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        if (this.startPos) {
            if (touchEndPos.y >= (this.startPos.y += 50)) {
                this.isTriggered = true; // 设置触发标记
                this.startPos = null
                this.objective.active = true;
                tween(this.objective)
                    .to(0.5, { position: this.objective.position.add(new Vec3(0, 100, 0)) })
                    .call(() => {
                        SHJGY_GameManager.instance.jzLabel.active = true;
                        SHJGY_GameManager.instance.jzLabel.getChildByName("String").getComponent(Label).string = "还是被你发现了，请不要告诉别人";
                        const time = SHJGY_AudioManager.instance.playAudio("还是被你发现了，请不要告诉别人");
                        this.scheduleOnce(() => {
                            SHJGY_GameManager.instance.jzLabel.active = false;
                            SHJGY_GameManager.instance.xx();
                        }, time);
                    })
                    .start()

                // 设置冷却时间
                this.scheduleOnce(() => {
                    this.isTriggered = false;
                }, this.triggerCooldown);
            } else {
                this.issb = false;
            }
        }
    }
}


