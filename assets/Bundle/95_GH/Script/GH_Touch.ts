import { _decorator, Component, EventTouch, find, Label, Node, quat, Quat, sp, Tween, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { GH_GameManager } from './GH_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GH_Touch')
export class GH_Touch extends Component {

    @property(Node) gameArea: Node = null;
    @property([Node]) objectives: Node[] = [];
    @property(Node) after: Node = null;
    @property(Vec3) pos: Vec3 = new Vec3();

    private originalPos: Vec3 = new Vec3();
    private originalIndex: number = 0;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const touchStartPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.originalPos = this.node.position.clone();
        this.node.setPosition(touchStartPos.x, touchStartPos.y);
        this.originalIndex = this.node.getSiblingIndex();
        this.node.setSiblingIndex(99)
        AudioManager.Instance.PlaySFX(GH_GameManager.instance.button)
    }

    onTouchMove(event: EventTouch) {
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(touchMovePos.x, touchMovePos.y);
    }

    onTouchEnd(event: EventTouch) {
        const touchEndPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.objectives = this.objectives.filter(objective => objective.active);
        this.objectives.forEach(objective => {
            if (objective && objective.active) {

                const size = objective.getComponent(UITransform).contentSize;
                const pos = objective.position.clone();

                //apk
                if (touchEndPos.clone().subtract(pos).length() < 50) {

                    console.log("---------------------------------------------------------------------------------------")
                    console.log("目标位置：", pos)
                    console.log("目标范围：", v2(pos.x - size.width / 2, pos.y - size.height / 2), v2(pos.x + size.width / 2, pos.y + size.height / 2))
                    console.log("触摸位置：", touchEndPos)

                    AudioManager.Instance.PlaySFX(GH_GameManager.instance.button)

                    GH_GameManager.instance.mask.active = true;
                    if (this.node.name == "马桶_Touch") {
                        this.node.setPosition(this.originalPos);
                        this.node.setSiblingIndex(this.originalIndex);
                        AudioManager.Instance.PlaySFX(GH_GameManager.instance.mt)
                        tween(objective)
                            .to(2, { angle: 1440 })
                            .repeatForever()
                            .start();
                        tween(objective)
                            .to(2, { scale: v3(0.3, 0.3) })
                            .start();
                        tween(objective)
                            .to(2, { position: this.pos })
                            .call(() => {
                                objective.active = false;

                                this.scheduleOnce(() => {
                                    objective.active = true;
                                    objective.setPosition(-345, -395)


                                    Tween.stopAll();


                                    tween(objective)
                                        .by(2, { angle: 1440 })
                                        .start();

                                    tween(objective)
                                        .to(2, { scale: v3(1, 1) })
                                        .call(() => {
                                            // objective.rotation = quat(0, 0, 0)
                                            console.log("LYLOG:666666666");
                                            const lb = objective.getChildByName("Label");
                                            lb.active = true;
                                            lb.getChildByName("String").getComponent(Label).string = "过是过来了,就是有点晕晕的";
                                            GH_GameManager.instance.playAudio("过是过来了,就是有点晕晕的")
                                            const uio = this.node.getComponent(UIOpacity)
                                            tween(uio)
                                                .to(0.5, { opacity: 0 })
                                                .start()
                                            this.scheduleOnce(() => {
                                                console.log("LYLOG:77777777");
                                                lb.active = false;
                                                const ske = objective.getComponent(sp.Skeleton)
                                                ske.setAnimation(0, "animation", true);
                                                tween(objective).to(2, { position: v3(-800, -800) })
                                                    .call(() => {
                                                        console.log("LYLOG:99999999999999");
                                                        GH_GameManager.instance.mask.active = false;
                                                        GH_GameManager.instance.refresh();
                                                        console.log("LYLOG:8888888888");
                                                        // objective.active = false;
                                                        // this.node.destroy();
                                                        objective.active = false;
                                                        this.node.active = false;
                                                    })
                                                    .start()
                                            }, 2);
                                        })
                                        .start();
                                }, 0.5)

                            })
                            .start();

                    } else {
                        this.node.active = false;
                        this.after.active = true;

                        objective.setSiblingIndex(this.objectives[this.objectives.length - 1].getSiblingIndex());
                        objective.setPosition(0, 120, 0);

                        const _x = this.pos.x - this.after.position.clone().x;
                        const _y = this.pos.y - this.after.position.clone().y;

                        if (this.node.name == "鲨鱼鳍_Touch") {
                            this.move(objective, v3(-100, 70, 0), v3(_x, _y), "谢谢你耐克鲨鱼，我以后再也不往河里尿尿了");
                        }
                        if (this.node.name == "大鹅_Touch") {
                            this.move(objective, v3(-75, 65, 0), v3(_x, _y), "谢谢你小坤鸡,等我回来再和你一起打篮球");
                        }
                        if (this.node.name == "挂画_Touch") {
                            this.move(objective, v3(-100, 280, 0), v3(_x, _y), "宰相肚里都能撑船，皇帝撑我不过分吧");
                        }
                        if (this.node.name == "药水_Touch") {
                            objective.active = false;
                            const ani = find("Canvas/GameArea/烟雾")
                            ani.active = true;
                            this.scheduleOnce(() => {
                                GH_GameManager.instance.mask.active = false;
                                ani.active = false;
                            }, 0.5)
                        }

                        if (this.node.name == "汽水_Touch") {
                            this.after.setSiblingIndex(objective.getSiblingIndex() - 1)
                            this.scheduleOnce(() => {
                                tween(this.after)
                                    .to(1, { position: v3(-325, -445) })
                                    .call(() => {
                                        const uio = this.after.getComponent(UIOpacity)
                                        tween(uio).to(0.5, { opacity: 0 }).call(() => { this.after.destroy() }).start()
                                    })
                                    .start();
                                tween(objective)
                                    .to(1, { position: v3(-345, -395) })
                                    .call(() => {
                                        const lb = objective.getChildByName("Label");
                                        lb.active = true;
                                        lb.getChildByName("String").getComponent(Label).string = "可乐的汽真足";
                                        GH_GameManager.instance.playAudio("可乐的汽真足")
                                        this.scheduleOnce(() => {
                                            lb.active = false;
                                            const ske = objective.getComponent(sp.Skeleton)
                                            ske.setAnimation(0, "animation", true);
                                            tween(objective).to(2, { position: v3(-650, -600) })
                                                .call(() => {
                                                    GH_GameManager.instance.mask.active = false;
                                                    GH_GameManager.instance.refresh()
                                                    objective.active = false
                                                })
                                                .start()
                                        }, 2);
                                    })
                                    .start();
                            }, 0.5)
                        }

                        if (this.node.name == "手机_Touch") { //有点问题，待修改---------------------------------------
                            this.after.active = true;
                            tween(this.after)
                                .to(0.5, { position: this.pos })
                                .start();
                            tween(this.after)
                                .to(0.5, { scale: v3(1, 1, 1) })
                                .call(() => {
                                    const lb = this.after.getChildByName("Label");
                                    lb.active = true;
                                    lb.getChildByName("String").getComponent(Label).string = "小棍棍，原来你躲在这里呢";
                                    GH_GameManager.instance.playAudio("小棍棍，原来你躲在这里呢")
                                    this.scheduleOnce(() => {
                                        lb.active = false;

                                        const lb1 = objective.getChildByName("Label");
                                        lb1.active = true;
                                        lb1.getChildByName("String").getComponent(Label).string = "妈妈发现我了，快逃";
                                        GH_GameManager.instance.playAudio("妈妈发现我了，快逃")
                                        this.scheduleOnce(() => {
                                            lb1.active = false;

                                            tween(objective)
                                                .to(0.2, { position: v3(-150, 150) })
                                                .call(() => {
                                                    tween(objective)
                                                        .to(0.3, { position: v3(-345, -395) })
                                                        .call(() => {
                                                            const uio = this.after.getComponent(UIOpacity)
                                                            tween(uio).to(0.5, { opacity: 0 }).call(() => { this.after.destroy() }).start()

                                                            const ske = objective.getComponent(sp.Skeleton)
                                                            ske.setAnimation(0, "animation", true);
                                                            tween(objective).to(2, { position: v3(-650, -600) })
                                                                .call(() => {
                                                                    GH_GameManager.instance.mask.active = false;
                                                                    GH_GameManager.instance.refresh()
                                                                    objective.active = false
                                                                })
                                                                .start()
                                                        })
                                                        .start();
                                                })
                                                .start();
                                        }, 2);

                                    }, 2);
                                })
                                .start();
                        }//--------------------------------------------------------------------------------------------------

                        if (this.node.name == "小吸管_Touch") {
                            objective.active = false;
                            tween(this.after)
                                .to(1, { position: this.pos })
                                .call(() => {
                                    this.after.active = false;
                                    objective.active = true;
                                    objective.setPosition(-345, -395)
                                    const lb = objective.getChildByName("Label");
                                    lb.active = true;
                                    lb.getChildByName("String").getComponent(Label).string = "这是以前咖啡忍者叔叔教我的";
                                    GH_GameManager.instance.playAudio("这是以前咖啡忍者叔叔教我的")

                                    this.scheduleOnce(() => {
                                        lb.active = false;
                                        const ske = objective.getComponent(sp.Skeleton)
                                        ske.setAnimation(0, "animation", true);
                                        tween(objective).to(2, { position: v3(-650, -600) })
                                            .call(() => {
                                                GH_GameManager.instance.mask.active = false;
                                                GH_GameManager.instance.refresh()
                                                objective.active = false
                                            }).start()
                                    }, 2);
                                })
                                .start();
                        }
                    }

                } else {
                    this.node.setPosition(this.originalPos);
                    this.node.setSiblingIndex(this.originalIndex);
                }

                // const bol = objective.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))
                // if (bol) {
                //     AudioManager.Instance.PlaySFX(GH_GameManager.instance.button)

                //     GH_GameManager.instance.mask.active = true;
                //     if (this.node.name == "马桶_Touch") {
                //         this.node.setPosition(this.originalPos);
                //         this.node.setSiblingIndex(this.originalIndex);
                //         AudioManager.Instance.PlaySFX(GH_GameManager.instance.mt)
                //         tween(objective)
                //             .to(2, { angle: 1440 })
                //             .repeatForever()
                //             .start();
                //         tween(objective)
                //             .to(2, { scale: v3(0.3, 0.3) })
                //             .start();
                //         tween(objective)
                //             .to(2, { position: this.pos })
                //             .call(() => {
                //                 objective.active = false;

                //                 this.scheduleOnce(() => {
                //                     objective.active = true;
                //                     objective.setPosition(-345, -395)


                //                     Tween.stopAll();


                //                     tween(objective)
                //                         .by(2, { angle: 1440 })
                //                         .start();

                //                     tween(objective)
                //                         .to(2, { scale: v3(1, 1) })
                //                         .call(() => {
                //                             // objective.rotation = quat(0, 0, 0)

                //                             const lb = objective.getChildByName("Label");
                //                             lb.active = true;
                //                             lb.getChildByName("String").getComponent(Label).string = "过是过来了,就是有点晕晕的";
                //                             GH_GameManager.instance.playAudio("过是过来了,就是有点晕晕的")
                //                             const uio = this.node.getComponent(UIOpacity)
                //                             tween(uio)
                //                                 .to(0.5, { opacity: 0 })
                //                                 .start()
                //                             this.scheduleOnce(() => {
                //                                 lb.active = false;
                //                                 const ske = objective.getComponent(sp.Skeleton)
                //                                 ske.setAnimation(0, "animation", true);
                //                                 tween(objective).to(2, { position: v3(-800, -800) })
                //                                     .call(() => {
                //                                         GH_GameManager.instance.mask.active = false;
                //                                         GH_GameManager.instance.refresh()
                //                                         this.node.destroy()
                //                                         objective.active = false
                //                                     })
                //                                     .start()
                //                             }, 2);
                //                         })
                //                         .start();
                //                 }, 0.5)

                //             })
                //             .start();

                //     } else {
                //         this.node.active = false;
                //         this.after.active = true;

                //         objective.setSiblingIndex(this.objectives[this.objectives.length - 1].getSiblingIndex());
                //         objective.setPosition(0, 120, 0);

                //         const _x = this.pos.x - this.after.position.clone().x;
                //         const _y = this.pos.y - this.after.position.clone().y;

                //         if (this.node.name == "鲨鱼鳍_Touch") {
                //             this.move(objective, v3(-100, 70, 0), v3(_x, _y), "谢谢你耐克鲨鱼，我以后再也不往河里尿尿了");
                //         }
                //         if (this.node.name == "大鹅_Touch") {
                //             this.move(objective, v3(-75, 65, 0), v3(_x, _y), "谢谢你小坤鸡,等我回来再和你一起打篮球");
                //         }
                //         if (this.node.name == "挂画_Touch") {
                //             this.move(objective, v3(-100, 280, 0), v3(_x, _y), "宰相肚里都能撑船，皇帝撑我不过分吧");
                //         }
                //         if (this.node.name == "药水_Touch") {
                //             objective.active = false;
                //             const ani = find("Canvas/GameArea/烟雾")
                //             ani.active = true;
                //             this.scheduleOnce(() => {
                //                 GH_GameManager.instance.mask.active = false;
                //                 ani.active = false;
                //             }, 0.5)
                //         }

                //         if (this.node.name == "汽水_Touch") {
                //             this.after.setSiblingIndex(objective.getSiblingIndex() - 1)
                //             this.scheduleOnce(() => {
                //                 tween(this.after)
                //                     .to(1, { position: v3(-325, -445) })
                //                     .call(() => {
                //                         const uio = this.after.getComponent(UIOpacity)
                //                         tween(uio).to(0.5, { opacity: 0 }).call(() => { this.after.destroy() }).start()
                //                     })
                //                     .start();
                //                 tween(objective)
                //                     .to(1, { position: v3(-345, -395) })
                //                     .call(() => {
                //                         const lb = objective.getChildByName("Label");
                //                         lb.active = true;
                //                         lb.getChildByName("String").getComponent(Label).string = "可乐的汽真足";
                //                         GH_GameManager.instance.playAudio("可乐的汽真足")
                //                         this.scheduleOnce(() => {
                //                             lb.active = false;
                //                             const ske = objective.getComponent(sp.Skeleton)
                //                             ske.setAnimation(0, "animation", true);
                //                             tween(objective).to(2, { position: v3(-650, -600) })
                //                                 .call(() => {
                //                                     GH_GameManager.instance.mask.active = false;
                //                                     GH_GameManager.instance.refresh()
                //                                     objective.active = false
                //                                 })
                //                                 .start()
                //                         }, 2);
                //                     })
                //                     .start();
                //             }, 0.5)
                //         }

                //         if (this.node.name == "手机_Touch") { //有点问题，待修改---------------------------------------
                //             this.after.active = true;
                //             tween(this.after)
                //                 .to(0.5, { position: this.pos })
                //                 .start();
                //             tween(this.after)
                //                 .to(0.5, { scale: v3(1, 1, 1) })
                //                 .call(() => {
                //                     const lb = this.after.getChildByName("Label");
                //                     lb.active = true;
                //                     lb.getChildByName("String").getComponent(Label).string = "小棍棍，原来你躲在这里呢";
                //                     GH_GameManager.instance.playAudio("小棍棍，原来你躲在这里呢")
                //                     this.scheduleOnce(() => {
                //                         lb.active = false;

                //                         const lb1 = objective.getChildByName("Label");
                //                         lb1.active = true;
                //                         lb1.getChildByName("String").getComponent(Label).string = "妈妈发现我了，快逃";
                //                         GH_GameManager.instance.playAudio("妈妈发现我了，快逃")
                //                         this.scheduleOnce(() => {
                //                             lb1.active = false;

                //                             tween(objective)
                //                                 .to(0.2, { position: v3(-150, 150) })
                //                                 .call(() => {
                //                                     tween(objective)
                //                                         .to(0.3, { position: v3(-345, -395) })
                //                                         .call(() => {
                //                                             const uio = this.after.getComponent(UIOpacity)
                //                                             tween(uio).to(0.5, { opacity: 0 }).call(() => { this.after.destroy() }).start()

                //                                             const ske = objective.getComponent(sp.Skeleton)
                //                                             ske.setAnimation(0, "animation", true);
                //                                             tween(objective).to(2, { position: v3(-650, -600) })
                //                                                 .call(() => {
                //                                                     GH_GameManager.instance.mask.active = false;
                //                                                     GH_GameManager.instance.refresh()
                //                                                     objective.active = false
                //                                                 })
                //                                                 .start()
                //                                         })
                //                                         .start();
                //                                 })
                //                                 .start();
                //                         }, 2);

                //                     }, 2);
                //                 })
                //                 .start();
                //         }//--------------------------------------------------------------------------------------------------

                //         if (this.node.name == "小吸管_Touch") {
                //             objective.active = false;
                //             tween(this.after)
                //                 .to(1, { position: this.pos })
                //                 .call(() => {
                //                     this.after.active = false;
                //                     objective.active = true;
                //                     objective.setPosition(-345, -395)
                //                     const lb = objective.getChildByName("Label");
                //                     lb.active = true;
                //                     lb.getChildByName("String").getComponent(Label).string = "这是以前咖啡忍者叔叔教我的";
                //                     GH_GameManager.instance.playAudio("这是以前咖啡忍者叔叔教我的")

                //                     this.scheduleOnce(() => {
                //                         lb.active = false;
                //                         const ske = objective.getComponent(sp.Skeleton)
                //                         ske.setAnimation(0, "animation", true);
                //                         tween(objective).to(2, { position: v3(-650, -600) })
                //                             .call(() => {
                //                                 GH_GameManager.instance.mask.active = false;
                //                                 GH_GameManager.instance.refresh()
                //                                 objective.active = false
                //                             }).start()
                //                     }, 2);
                //                 })
                //                 .start();
                //         }
                //     }
                // } else {
                //     this.node.setPosition(this.originalPos);
                //     this.node.setSiblingIndex(this.originalIndex);
                // }
            }

        });

    }

    move(objective: Node, dump: Vec3, objectivePos: Vec3, str: string) {
        try {
            this.scheduleOnce(() => {
                tween(objective)
                    .to(0.3, { position: v3(0, 250, 0) })
                    .to(0.2, { position: dump })
                    .call(() => {
                        tween(objective)
                            .to(0.5, { position: v3(objective.position.x + objectivePos.x, objective.position.y + objectivePos.y) })
                            .start()
                        tween(this.after)
                            .to(0.5, { position: this.pos })
                            .call(() => {
                                const uio = this.after.getComponent(UIOpacity)
                                tween(uio).to(0.5, { opacity: 0 }).call(() => { this.after.destroy() }).start()
                                tween(objective)
                                    .to(0.2, { position: v3(objective.position.x, objective.position.y + 50) })
                                    .to(0.3, { position: v3(-345, -395) })
                                    .call(() => {
                                        const lb = objective.getChildByName("Label");
                                        lb.active = true;
                                        lb.getChildByName("String").getComponent(Label).string = str;
                                        GH_GameManager.instance.playAudio(str)
                                        this.scheduleOnce(() => {
                                            lb.active = false;
                                            const ske = objective.getComponent(sp.Skeleton)
                                            ske.setAnimation(0, "animation", true);
                                            tween(objective)
                                                .to(2, { position: v3(-650, -600) })
                                                .call(() => {
                                                    GH_GameManager.instance.mask.active = false;
                                                    objective.active = false
                                                    GH_GameManager.instance.refresh()
                                                })
                                                .start()
                                        }, 2);
                                    }).start()
                            }).start()
                    }).start()
            }, 0.5)
        } catch (error) {
            console.error(error)
        }
    }
}