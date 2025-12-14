import { _decorator, Component, EventTouch, instantiate, Node, Prefab, Skeleton, sp, Sprite, SpriteFrame, Tween, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
const { ccclass, property } = _decorator;

@ccclass('GMJH_RoleController')
export class GMJH_RoleController extends Component {

    public static Instance: GMJH_RoleController;

    @property(Node)
    role1: Node = null;

    @property(Node)
    role2: Node = null;

    @property(Node)
    man: Node = null;

    @property(Node)
    gameOverPanel: Node = null;

    @property(Prefab)
    particle2D: Prefab = null;

    private particleNode: Node = null; // 用于存储当前的粒子特效节点

    /**
     * true  : role1在左 role2在右
     * false : role1在右 role2在左
     */
    isLR = true;
    isTouch = false;

    private touchStartPos: Vec3 = null;
    private isRole1: boolean;
    private isRole2: boolean;

    private oriScale: Vec3 = v3();

    @property
    speed: number = 1;

    @property
    scaleGap: number = 0.05;

    role1Skel: sp.Skeleton = null;
    role2Skel: sp.Skeleton = null;
    manSkel: sp.Skeleton = null;

    onLoad() {
        GMJH_RoleController.Instance = this;

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.bottom(this.role1);
        this.bottom(this.role2);

        this.role1Skel = this.role1.getComponent(sp.Skeleton);
        this.role2Skel = this.role2.getComponent(sp.Skeleton);
        this.manSkel = this.man.getComponent(sp.Skeleton);

        {
            this.setRole1Skel("主人公(空）", 1);
            this.setRole1Skel("女二初始头发", 1);
            this.setRole1Skel("主人公白丝", 0);
            this.setRole1Skel("主人公黑丝", 0);
            this.setRole1Skel("伴娘花", 0);
            this.setRole1Skel("双尾", 0);
            this.setRole1Skel("头冠", 0);
            this.setRole1Skel("头纱", 0);
            this.setRole1Skel("头饰", 0);
            this.setRole1Skel("女2浓妆1", 0);
            this.setRole1Skel("女二淡妆", 0);
            this.setRole1Skel("婚纱", 0);
            this.setRole1Skel("平底鞋", 0);
            this.setRole1Skel("新娘花", 0);
            this.setRole1Skel("珍珠耳坠", 0);
            this.setRole1Skel("眼泪", 0);
            this.setRole1Skel("短发", 0);
            this.setRole1Skel("红包", 0);
            this.setRole1Skel("耳坠项链", 0);
            this.setRole1Skel("花1", 0);
            this.setRole1Skel("花2", 0);
            this.setRole1Skel("衣服", 0);
            this.setRole1Skel("跑车", 0);
            this.setRole1Skel("项链", 0);
            this.setRole1Skel("高跟鞋", 0);
        }

        {
            this.setRole2Skel("初始角色", 1);
            this.setRole2Skel("初始头发", 1);
            this.setRole2Skel("白丝", 0);
            this.setRole2Skel("黑丝", 0);
            this.setRole2Skel("伴娘花", 0);
            this.setRole2Skel("双尾", 0);
            this.setRole2Skel("头冠", 0);
            this.setRole2Skel("头纱", 0);
            this.setRole2Skel("头饰", 0);
            this.setRole2Skel("浓妆", 0);
            this.setRole2Skel("淡妆", 0);
            this.setRole2Skel("婚纱", 0);
            this.setRole2Skel("平底鞋", 0);
            this.setRole2Skel("新娘花", 0);
            this.setRole2Skel("珍珠耳坠", 0);
            this.setRole2Skel("眼泪", 0);
            this.setRole2Skel("短发", 0);
            this.setRole2Skel("红包", 0);
            this.setRole2Skel("耳坠项链", 0);
            this.setRole2Skel("花1", 0);
            this.setRole2Skel("花2", 0);
            this.setRole2Skel("衣服", 0);
            this.setRole2Skel("跑车", 0);
            this.setRole2Skel("项链", 0);
            this.setRole2Skel("高跟鞋", 0);
        }

        {
            this.setManSkel("新郎bad", 0)
            this.setManSkel("新郎good", 0)
        }
    }

    setRole1Skel(name: string, a: number) {
        const x = this.role1Skel.findSlot(name);
        if (x) {
            this.role1Skel.findSlot(name).color.a = a;
        }
    }

    setRole2Skel(name: string, a: number) {
        this.role2Skel.findSlot(name).color.a = a;
    }

    setManSkel(name: string, a: number) {
        const x = this.manSkel.findSlot(name);
        if (x) {
            this.manSkel.findSlot(name).color.a = a;
        }
    }

    private onTouchStart(event: EventTouch): void {
        if (!this.isTouch) return;
        this.touchStartPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.particleNode = instantiate(this.particle2D); // 创建粒子特效节点
        this.particleNode.setPosition(this.touchStartPos);
        this.node.addChild(this.particleNode);
        this.isRole1 = this.role1.getComponent(UITransform).getBoundingBox().contains(v2(this.touchStartPos.x, this.touchStartPos.y));
        this.isRole2 = this.role2.getComponent(UITransform).getBoundingBox().contains(v2(this.touchStartPos.x, this.touchStartPos.y));
    }

    private onTouchMove(event: EventTouch): void {
        if (!this.isTouch || !this.particleNode) return;
        const touchMovePos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        this.particleNode.setPosition(touchMovePos); // 更新粒子特效位置
    }

    private onTouchEnd(event: EventTouch): void {
        if (!this.isTouch) return;
        const touchEndPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        const deltaX = touchEndPos.x - this.touchStartPos.x;
        if (this.isRole1 || this.isRole2) if (Math.abs(deltaX) > 50) this.swapRoles();

        // 销毁粒子特效节点
        this.particleNode.destroy();
        this.particleNode = null;
    }

    private swapRoles(): void {
        if (!this.role1 || !this.role2) return;

        this.isLR = !this.isLR;

        const role1Pos = this.role1.position;
        const role2Pos = this.role2.position;

        tween(this.role1)
            .to(0.1, { position: role2Pos })
            .start();

        tween(this.role2)
            .to(0.1, { position: role1Pos })
            .start();
    }

    bottom(node: Node) {
        Tween.stopAllByTarget(node);
        this.oriScale.set(node.getScale());

        tween(node)
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y + this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y - this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .union().repeatForever().start();
    }

    setRole(round: number) {
        console.log("setRole", round);
        switch (round) {
            case 1:
                if (this.isLR) {
                    this.setRole1Skel("女2浓妆1", 1);
                    this.setRole2Skel("淡妆", 1);
                } else {
                    this.setRole1Skel("女二淡妆", 1);
                    this.setRole2Skel("浓妆", 1);
                }
                break;

            case 2:
                this.setRole1Skel("女二初始头发", 0);
                this.setRole2Skel("初始头发", 0);
                if (this.isLR) {
                    this.setRole1Skel("短发", 1);
                    this.setRole2Skel("双尾", 1);
                } else {
                    this.setRole1Skel("双尾", 1);
                    this.setRole2Skel("短发", 1);
                }
                break;

            case 3:
                if (this.isLR) {
                    this.setRole1Skel("头饰", 1);
                    this.setRole2Skel("头冠", 1);
                } else {
                    this.setRole1Skel("头冠", 1);
                    this.setRole2Skel("头饰", 1);
                }
                break;

            case 4:
                if (this.isLR) {
                    this.setRole1Skel("平底鞋", 1);
                    this.setRole2Skel("高跟鞋", 1);
                } else {
                    this.setRole1Skel("高跟鞋", 1);
                    this.setRole2Skel("平底鞋", 1);
                }
                break;

            case 5:
                if (this.isLR) {
                    this.setRole1Skel("主人公黑丝", 1);
                    this.setRole2Skel("白丝", 1)
                } else {
                    this.setRole1Skel("主人公白丝", 1);
                    this.setRole2Skel("黑丝", 1)

                }
                break;

            case 6:
                if (this.isLR) {
                    this.setRole1Skel("婚纱", 1);
                    this.setRole2Skel("衣服", 1);
                } else {
                    this.setRole1Skel("衣服", 1);
                    this.setRole2Skel("婚纱", 1);
                }
                break;

            case 7:
                if (this.isLR) {
                    this.setRole1Skel("珍珠耳坠", 1);
                    this.setRole2Skel("耳坠项链", 1);
                } else {
                    this.setRole1Skel("耳坠项链", 1);
                    this.setRole2Skel("珍珠耳坠", 1);
                }
                break;

            case 8:
                if (this.isLR) {
                    this.setRole1Skel("新娘花", 1);
                    this.setRole2Skel("伴娘花", 1);
                } else {
                    this.setRole1Skel("伴娘花", 1);
                    this.setRole2Skel("新娘花", 1);
                }
                break;

            case 9:
                if (this.isLR) {
                    this.setRole1Skel("项链", 1);
                    this.setRole2Skel("头纱", 1);
                } else {
                    this.setRole1Skel("头纱", 1);
                    this.setRole2Skel("项链", 1);
                }
                break;

            case 10:
                if (this.isLR) {
                    this.setRole1Skel("花2", 1);
                    this.setRole2Skel("花1", 1);
                } else {
                    this.setRole1Skel("花1", 1);
                    this.setRole2Skel("花2", 1);
                }
                break;
            case 11:
                if (this.isLR) {
                    this.setRole1Skel("跑车", 1);
                    this.setRole2Skel("红包", 1);
                } else {
                    this.setRole1Skel("红包", 1);
                    this.setRole2Skel("跑车", 1);
                }
                break;
        }
    }

    L(isWin: boolean) {
        Tween.stopAll();
        this.man.active = true;
        if (!isWin) {
            this.setRole1Skel("眼泪", 1);
            GMJH_RoleController.Instance.manSkel.setSkin("新郎bad");
        }
        GMJH_RoleController.Instance.manSkel.setSkin("新郎good");


        this.bottom(this.role1);
        this.bottom(this.role2);

        this.gameOverPanel.addChild(this.man);
        this.gameOverPanel.addChild(this.role1);
        this.gameOverPanel.addChild(this.role2);

        this.role1.setPosition(0, -800);
        this.role2.setPosition(300, -800);

    }


    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }


}