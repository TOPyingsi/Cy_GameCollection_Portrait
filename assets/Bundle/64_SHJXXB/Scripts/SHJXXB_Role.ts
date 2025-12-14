import { _decorator, Animation, AudioSource, Canvas, Component, director, EventTouch, find, instantiate, Node, Rect, rect, ScrollView, Sprite, tween, UITransform, Vec2, Vec3 } from 'cc';
import { SHJXXB_Global } from './SHJXXB_GlobalDt';
import { SHJXXB_RoleMgr } from './SHJXXB_RoleMgr';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('SHJXXB_RoleContrl')
export class SHJXXB_RoleContrl extends Component {



    private roleMgr: SHJXXB_RoleMgr = null;

    private originalPos: Vec3 = new Vec3(); //初始位置（本地坐标）

    private originalParent: Node;

    private playArea: Node;

    private placeholder: Node = null;// 占位节点
    private originalIndex: number = 0; // 记录原节点在父节点中的索引

    private alreadyInsert = false;

    //保存滚动视图的包围盒
    private scrollView: Rect;

    protected onLoad(): void {

        this.originalParent = find("Canvas/playArea/roleBox/ScrollView/view/content");
        this.roleMgr = this.originalParent.getComponent(SHJXXB_RoleMgr);
        this.playArea = find("Canvas/playArea");
        this.scrollView = this.playArea.getChildByName("roleBox").getChildByName("ScrollView").getComponent(UITransform).getBoundingBoxToWorld();
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected start(): void {
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        else this.Init();
    }

    Init() {
        //入场动画
        SHJXXB_Global.Instance.curNotTouch = true;//禁止操作
        let startAnimN: Node = this.playArea.getChildByName("startAnim");
        tween(startAnimN)
            .call(() => {
                this.playArea.getChildByName("startAnim").getComponent(AudioSource).play();
            })
            .to(
                3,
                { position: new Vec3(-800, -270, 0) }
            )
            .call(() => {
                SHJXXB_Global.Instance.curNotTouch = false;
            })
            .start();
    }

    onTouchStart(event: EventTouch) {

        this.originalParent = find("Canvas/playArea/roleBox/ScrollView/view/content");
        if (SHJXXB_Global.Instance.curNotTouch) {
            return;
        }
        // 记录原节点在父节点中的索引
        this.originalIndex = this.node.getSiblingIndex();

        this.originalPos.set(this.node.position.x, this.node.position.y, 0);

        this.placeholder = new Node();
        this.placeholder.name = "placeholder";
        let transform = this.placeholder.addComponent(UITransform);
        let sprite = this.placeholder.addComponent(Sprite);
        let originalTransform = this.node.getComponent(UITransform);
        transform.contentSize = originalTransform.contentSize.clone();
        sprite.color.set(0, 0, 0, 0);

    }

    onTouchMove(event: EventTouch) {
        // if (this.scrollView.contains(event.getUILocation())) {
        //     return;
        // }
        if (SHJXXB_Global.Instance.curNotTouch) {
            return;
        }

        if (!this.alreadyInsert) {
            // 将占位节点插入到原节点位置
            if (!this.originalParent) {
                return;
            }
            if (!this.placeholder) {
                return;
            }
            this.placeholder.setPosition(this.originalPos);
            this.originalParent.insertChild(this.placeholder, this.originalIndex);
            this.alreadyInsert = true;
        }

        if (this.node.parent !== this.playArea) {
            this.node.removeFromParent();
            this.playArea.addChild(this.node);
        }

        let touPos: Vec3 = new Vec3(event.getUILocation().x, event.getUILocation().y, 0);
        //转化成本地坐标
        let UItouPos: Vec3 = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(touPos);
        this.node.setPosition(UItouPos);

        // this.node.removeFromParent();
        // this.node.setPosition(UItouPos);
        // this.playArea.addChild(this.node);


    }

    onTouchEnd(event: EventTouch) {
        if (SHJXXB_Global.Instance.curNotTouch) {
            return;
        }

        // this.node.removeFromParent();
        // this.originalParent.addChild(this.node);

        //移除占位节点的函数
        const removePlaceholder = () => {
            if (this.placeholder) {
                this.placeholder.removeFromParent();
                this.placeholder = null;
                this.alreadyInsert = false;
            }
        };

        // 确保节点回到原父节点
        if (this.node.parent !== this.originalParent) {
            this.node.removeFromParent();
            this.originalParent.insertChild(this.node, this.originalIndex); // 插入到原位置
        }

        let N: number = Number(this.node.name);

        let wm: Node = SHJXXB_Global.Instance.TriggerN[0];
        let wmTransform: UITransform = wm.getComponent(UITransform);

        let m: Node = SHJXXB_Global.Instance.TriggerN[1];
        let mTransform: UITransform = m.getComponent(UITransform);
        if (N < 8) {//女生

            if (wmTransform.getBoundingBoxToWorld().contains(event.getUILocation())) {
                SHJXXB_Global.Instance.curNotTouch = true;//禁止操作

                //触发打勾
                let bingo: Node = this.playArea.getChildByName("bingo");
                bingo.active = true;
                bingo.getComponent(Animation).play();
                bingo.getComponent(AudioSource).play();

                //触发屏幕左边的角色入场动画
                let woman: Node = this.playArea.getChildByName("womamAnim");
                woman.getComponent(Sprite).spriteFrame = this.roleMgr.roleImg[N];

                let tweenDuration: number = 0.5;
                // let audioLength: number;
                tween(woman)
                    .call(() => {
                        this.playArea.getChildByName("stage").active = true;
                    })
                    .to(
                        tweenDuration,
                        { position: new Vec3(0, -325, 0) }
                    )
                    .call(() => {
                        woman.getComponent(Animation).play();
                        woman.getComponent(AudioSource).clip = SHJXXB_Global.Instance.audios[N];
                        woman.getComponent(AudioSource).play();
                        // audioLength = woman.getComponent(AudioSource).clip.getDuration() + 2;
                    })
                    .delay(2.5)
                    .call(() => {
                        woman.getComponent(Animation).stop();
                        this.playArea.getChildByName("stage").active = false;
                    })
                    .to(
                        tweenDuration,
                        { position: new Vec3(-830, -325, 0) }
                    )
                    .call(() => {
                        SHJXXB_Global.Instance.curNotTouch = false;
                        SHJXXB_Global.Instance.Progress += 1;
                        if (SHJXXB_Global.Instance.Progress === 16) {
                            this.endAnimation();
                        }

                    })
                    .start();
                //正确放置时移除占位节点
                removePlaceholder();
                this.node.removeFromParent();
                return;
            } if (mTransform.getBoundingBoxToWorld().contains(event.getUILocation())) {
                //触发心的破碎动画
                if (SHJXXB_Global.Instance.xin) {
                    SHJXXB_Global.Instance.curNotTouch = true;//禁止操作
                    this.playArea.getChildByName("error").active = true;
                    this.playArea.getChildByName("life").getComponent(AudioSource).play();
                    this.scheduleOnce(() => {
                        this.playArea.getChildByName("error").active = false;
                    }, 1);
                    let xinS: string = SHJXXB_Global.Instance.xin.toString();
                    let life: Node = find("Canvas/playArea/life");
                    life.getChildByName(xinS).getComponent(Animation).play();
                    SHJXXB_Global.Instance.xin -= 1;
                }
                //移除占位节点并恢复位置

                removePlaceholder();
                this.node.position = this.originalPos;
                return;
            }


            this.node.position = this.originalPos;
            removePlaceholder();

        } else {//男生

            if (mTransform.getBoundingBoxToWorld().contains(event.getUILocation())) {
                SHJXXB_Global.Instance.curNotTouch = true;//禁止操作

                //触发打勾动画
                let bingo: Node = this.playArea.getChildByName("bingo");
                bingo.active = true;
                bingo.getComponent(Animation).play();
                bingo.getComponent(AudioSource).play();

                //触发屏幕右边的角色入场动画
                let man: Node = this.playArea.getChildByName("manAnim");
                man.getComponent(Sprite).spriteFrame = this.roleMgr.roleImg[N];

                let tweenDuration: number = 0.5;
                // let audioLength: number;
                tween(man)
                    .call(() => {
                        this.playArea.getChildByName("stage").active = true;
                    })
                    .to(
                        tweenDuration,
                        { position: new Vec3(0, -325, 0) }
                    )
                    .call(() => {
                        man.getComponent(Animation).play();
                        man.getComponent(AudioSource).clip = SHJXXB_Global.Instance.audios[N];
                        man.getComponent(AudioSource).play();
                        // audioLength = man.getComponent(AudioSource).clip.getDuration() + 2;
                    })
                    .delay(2)
                    .call(() => {
                        man.getComponent(Animation).stop();
                        this.playArea.getChildByName("stage").active = false;
                    })
                    .to(
                        tweenDuration,
                        { position: new Vec3(860, -325, 0) }
                    )
                    .call(() => {
                        SHJXXB_Global.Instance.curNotTouch = false;
                        SHJXXB_Global.Instance.Progress += 1;
                        if (SHJXXB_Global.Instance.Progress === 16) {
                            this.endAnimation();
                        }

                    })
                    .start();

                removePlaceholder();
                this.node.removeFromParent();
                return;
            } if (wmTransform.getBoundingBoxToWorld().contains(event.getUILocation())) {
                //触发心的破碎动画
                if (SHJXXB_Global.Instance.xin) {
                    SHJXXB_Global.Instance.curNotTouch = true;//禁止操作
                    this.playArea.getChildByName("error").active = true;
                    this.playArea.getChildByName("life").getComponent(AudioSource).play();

                    this.scheduleOnce(() => {
                        this.playArea.getChildByName("error").active = false;
                    }, 1);
                    let xinS: string = SHJXXB_Global.Instance.xin.toString();
                    let life: Node = find("Canvas/playArea/life");
                    life.getChildByName(xinS).getComponent(Animation).play();
                    SHJXXB_Global.Instance.xin -= 1;
                }
                removePlaceholder();
                this.node.position = this.originalPos;
                return;
            }
        }
        removePlaceholder();
        this.node.position = this.originalPos;

    }


    endAnimation() {
        this.playArea.getChildByName("roleBox").active = false;
        let woman: Node = this.playArea.getChildByName("endAnimWoman");
        woman.active = true;
        let man: Node = this.playArea.getChildByName("endAnimMan");
        man.active = true;
        tween(woman)
            .to(
                5,
                { position: new Vec3(-2600, 120, 0) }
            )
            .start();
        tween(man)
            .to(
                5,
                { position: new Vec3(560, -360, 0) }
            )
            .call(() => {
                GamePanel.Instance.Win();

            })
            .start();
    }


}


