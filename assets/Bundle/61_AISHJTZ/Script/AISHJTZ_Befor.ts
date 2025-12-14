import { _decorator, AudioSource, Component, director, EventTouch, Node, quat, Size, Sprite, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { AISHJTZ_GameManager } from './AISHJTZ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('AISHJTZ_Befor')
export class AISHJTZ_Befor extends Component {
    public static Instance: AISHJTZ_Befor = null;

    @property(Node) hand: Node = null;
    @property(Node) wd1: Node = null;
    @property(Node) wd2: Node = null;
    @property(Node) wd3: Node = null;
    @property(Node) wd4: Node = null;

    @property(Node) role1: Node = null;
    @property(Node) role2: Node = null;
    @property(Node) role3: Node = null;
    @property(Node) role4: Node = null;

    @property(Node) playArea: Node = null;
    @property(Node) content: Node = null;

    private num: number = 1;
    private isTouch: boolean = true;
    private as: AudioSource = null;

    protected onLoad(): void {
        AISHJTZ_Befor.Instance = this;
        this.node.on(Node.EventType.TOUCH_START, this.TOUCH_START, this);
        this.as = this.node.getComponent(AudioSource);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.TOUCH_START, this);
    }

    protected start(): void {
        this.tipTween();
    }

    private TOUCH_START(event: EventTouch) {
        if (!this.isTouch) return;
        this.hand.active = false;
        this.wdTween(this[`wd${this.num}`]);
    }

    wdTween(node: Node) {
        const top = node.getChildByName("Top")
        const bottom = node.getChildByName("Bottom")
        this.as.play();
        tween(top)
            .to(0.5, { eulerAngles: v3(0, 0, 45) })
            .call(() => {
                top.destroy()
                this.propTween(this[`role${this.num}`])
                tween(bottom)
                    .to(0.1, { position: v3(bottom.position.x, bottom.position.y + 30, bottom.position.z) })
                    .to(0.1, { position: v3(bottom.position.x, bottom.position.y - 30, bottom.position.z) })
                    .union()
                    .repeat(3)
                    .call(() => {
                        this.as.stop()
                        if (this.num >= 4) {
                            director.getScene().emit("游戏开始");
                            this.isTouch = false;
                            this.node.destroy();
                            AISHJTZ_GameManager.Instance.loadRole();
                        } else {
                            this.num++;
                            this.tipTween();
                        }
                        bottom.destroy();
                    })
                    .start();
            }).union().start();
    }

    propTween(node: Node) {
        node.active = true;
        node.children.forEach(element => {
            element.active = true;
            tween(element)
                .to(0.2, { position: v3(element.position.x, element.position.y + 30, element.position.z) })
                .to(0.5, { position: v3(0, -525) })
                .call(() => {
                    element.active = false;
                    node.children.forEach((item, index) => {
                        AISHJTZ_GameManager.Instance.activtNode(item)
                    })
                })
                .start();
        });
    }

    tipTween() {
        this.hand.active = true;
        this.hand.setPosition(this[`wd${this.num}`].position)

        tween(this.hand)
            .to(0.5, { scale: v3(1.2, 1.2, 1.2) })
            .to(0.5, { scale: v3(1, 1, 1) })
            .union()
            .repeatForever()
            .start();
    }
}


