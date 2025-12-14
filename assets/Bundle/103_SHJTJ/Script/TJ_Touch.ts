import { _decorator, Color, color, Component, EventTouch, instantiate, Label, Node, Sprite, tween, UITransform, v2, Vec3 } from 'cc';
import { TJ_GameManager } from './TJ_GameManager';
import { TJ_Check } from './TJ_Check';
const { ccclass, property } = _decorator;

@ccclass('TJ_Touch')
export class TJ_Touch extends Component {

    @property(Node) gameArea: Node = null;

    private touchStartPos: Vec3 = new Vec3(); // 记录触摸起始位置
    private propStartPos: Vec3 = new Vec3(); // 记录道具起始位置

    private currentProp: Node = null;
    private isTouching: boolean = false;
    private isTweening: boolean = false;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if (this.isTouching || this.currentProp) {
            return;
        }
        this.isTouching = true;

        console.log("touch start", this.node.name);
        const touchLocation = new Vec3(event.getUILocation().x, event.getUILocation().y);
        this.touchStartPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(touchLocation);

        // 禁用滚动视图
        TJ_GameManager.instance.scrollView.enabled = false;

        // 初始化一个对应的道具
        const prop = instantiate(TJ_GameManager.instance.prop);
        prop.getComponent(Sprite).spriteFrame = this.node.getChildByName("Icon").getComponent(Sprite).spriteFrame;
        prop.setParent(this.gameArea);
        prop.setPosition(this.touchStartPos);
        prop.name = this.node.name;
        this.currentProp = prop;

        // 记录道具的初始位置
        this.propStartPos.set(prop.position);
    }

    onTouchMove(event: EventTouch) {
        if (!this.currentProp) return;

        // 直接将currentProp移动到触摸位置
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.currentProp.setPosition(touchMovePos);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.currentProp || !this.currentProp.isValid || this.isTweening) {
            return;
        }

        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        TJ_GameManager.instance.scrollView.enabled = true;

        let placed = false;
        TJ_GameManager.instance.currentCards.forEach(card => {

            const bol = card.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y));
            if (bol) {

                // 判断是否已存在
                const isProp = TJ_GameManager.instance.cardMap.get(card)
                if (isProp && isProp.isValid) {
                    const isNode = TJ_GameManager.instance.propMap.get(isProp)

                    if (isNode) {
                        const la = isNode.getChildByName("Number").getComponent(Label)
                        let x = Number(la.string)
                        x += 1

                        if (x > 1) {
                            la.enabled = true;
                        } else {
                            la.enabled = false;
                        }

                        // 如果存在且未激活，则激活
                        if (!isNode.active) {
                            isNode.active = true;
                        }
                        // 如果已存在且激活，则数量加1
                        if (isNode.active) {
                            la.string = x.toString();
                        }
                        TJ_GameManager.instance.cardMap.delete(card);
                        TJ_GameManager.instance.propMap.delete(isProp);
                        TJ_GameManager.instance.props.splice(TJ_GameManager.instance.props.indexOf(isProp), 1);
                        isProp.destroy();
                    }
                } 

                this.currentProp.setParent(card);
                this.currentProp.setPosition(0, 0);
                TJ_GameManager.instance.cardMap.set(card, this.currentProp);
                TJ_GameManager.instance.propMap.set(this.currentProp, this.node);
                TJ_GameManager.instance.props.push(this.currentProp);
                placed = true;

                // 获取该道具的数量
                const numNode = this.node.getChildByName("Number");
                const label = numNode.getComponent(Label);
                let x = Number(label.string);
                x -= 1;
                label.string = x.toString();

                if (x == 0) {
                    label.enabled = false;
                    this.node.active = false;
                }
                if (x == 1) {
                    label.enabled = false;
                }
                if (x >= 2) {
                    label.enabled = true;
                    console.log("LabelString", label.string)
                }

                if (TJ_GameManager.instance.props.length == TJ_GameManager.instance.currentCards.length) {
                    const bol = TJ_Check.instance.check();
                    if (bol) {
                        TJ_GameManager.instance.right();
                    } else {
                        TJ_GameManager.instance.fail();
                    }
                }
                console.log(TJ_GameManager.instance.props)
            }
        });

        if (!placed) {
            if (this.currentProp && this.currentProp.isValid) {
                this.isTweening = true;
                tween(this.currentProp)
                    .to(0.1, { position: this.propStartPos })
                    .call(() => {
                        if (this.currentProp && this.currentProp.isValid) {
                            this.currentProp.destroy();
                        }
                        this.currentProp = null;
                        this.isTweening = false;
                    })
                    .start();
            } else {
                this.currentProp = null;
            }
        } else {
            this.currentProp = null;
        }

        this.isTouching = false;
    }
}
