import { _decorator, Animation, AudioClip, Component, director, Label, Node, UITransform, Vec2 } from 'cc';
import { OFNR_BlockSet } from './OFNR_BlockSet';
import { OFNR_BlockSpawn } from './OFNR_BlockSpawn';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('OFNR_RoleControl')
export class OFNR_RoleControl extends Component {

    private targetPrefab1: Node = null; // 需要检测的预制体
    private targetPrefab2: Node = null;
    private static expectedSequence: number[] = [1, 2, 4, 6, 8, 10, 13, 16];
    private static role1CollisionHistory: number[] = [];
    private _uiTransform: UITransform = null;
    private _isInRange = false;
    private _isGameOver: number = 2;

    // @property(GamePanel)
    // private panel:GamePanel=null;
    protected onLoad(): void {
    }
    start() {
        this._uiTransform = this.getComponent(UITransform);
        this.schedule(() => {
            if (!this.node.parent.getChildByName("移动方块")) return;
            this.targetPrefab1 = this.node.parent.getChildByName("移动方块")?.getChildByName("1");
            this.targetPrefab2 = this.node.parent.getChildByName("移动方块")?.getChildByName("2");

            [this.targetPrefab1, this.targetPrefab2].forEach(target => {
                if (!target?.isValid) return;

                const targetPos3D = target.worldPosition;
                const targetPos = new Vec2(targetPos3D.x, targetPos3D.y);
                const bounds = this._uiTransform.getBoundingBoxToWorld();

                if (bounds.contains(targetPos)) {
                    this.onTargetEnter(target);
                }
            }, 1);
        })
    }

    update(deltaTime: number) {

    }

    private onTargetEnter(target: Node) {
        if (this._isGameOver == 3) return;
        const currID = target.getComponent(OFNR_BlockSet).getBlockId();
        const roleIndex = this.node.name === "OFNR_Nezha" ? 1 : 2;
        console.log(`角色${roleIndex}当前ID方块是：` + currID);
        if (roleIndex === 1) {
            OFNR_RoleControl.role1CollisionHistory.push(currID);
            // console.log(`角色1碰撞历史：${OFNR_RoleControl.role1CollisionHistory}`);
        }
        target.parent.getComponent(OFNR_BlockSpawn).spawnTwinBlocks(currID);
        switch (currID) {
            case 0:
                this.node.getChildByName("0").active = false;
                this.node.getChildByName("高素体").active = true;
                if (roleIndex == 1) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "谁把我身体拉这么长";
                    director.emit("bgm", 28);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                if (roleIndex == 2) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "这个身材我很满意";
                    director.emit("bgm", 31);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                break;
            case 1:
                this.node.getChildByName("0").active = false;
                this.node.getChildByName("矮素体").active = true;
                this.scheduleOnce(() => {
                    if (roleIndex == 1) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "我可不是一般小孩";
                        director.emit("bgm", 11);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                    if (roleIndex == 2) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "谁把搓成矮冬瓜了";
                        director.emit("bgm", 27);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                }, 1);

                break;
            case 2:
                this.node.getChildByName("高素体").getChildByName("高身体").active = true;
                this.node.getChildByName("矮素体").getChildByName("矮身体").active = true;
                this.node.getChildByName("高素体").getChildByName("高身体").getChildByName("动画").getComponent(Animation).play("1");
                this.node.getChildByName("矮素体").getChildByName("矮身体").getChildByName("动画").getComponent(Animation).play("1");
                this.node.getChildByName("高素体").getChildByName("高1").active = false;
                this.node.getChildByName("矮素体").getChildByName("矮1").active = false;
                if (roleIndex == 1) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "暖洋洋的很舒坦";
                    director.emit("bgm", 18);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                if (roleIndex == 2) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "我快被烧焦了";
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                break;
            case 3:
                this.node.getChildByName("高素体").getChildByName("高身体").active = true;
                this.node.getChildByName("矮素体").getChildByName("矮身体").active = true;
                this.node.getChildByName("高素体").getChildByName("高身体").getChildByName("动画").getComponent(Animation).play("0");
                this.node.getChildByName("矮素体").getChildByName("矮身体").getChildByName("动画").getComponent(Animation).play("0");
                this.node.getChildByName("高素体").getChildByName("高1").active = false;
                this.node.getChildByName("矮素体").getChildByName("矮1").active = false;
                this.scheduleOnce(() => {
                    if (roleIndex == 1) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "我快被泡软了";
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                    if (roleIndex == 2) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "真是如鱼得水啊";
                        director.emit("bgm", 21);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                }, 1);
                break;
            case 4:
                this.node.getChildByName("高素体").getChildByName("高身体").active = false;
                this.node.getChildByName("矮素体").getChildByName("矮身体").active = false;
                this.node.getChildByName("高素体").getChildByName("丸子头").active = true;
                this.node.getChildByName("矮素体").getChildByName("丸子头").active = true;
                if (roleIndex == 1) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "这发型很精神";
                    director.emit("bgm", 34);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                if (roleIndex == 2) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "这是什么奇怪审美";
                    director.emit("bgm", 35);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                break;
            case 5:
                this.node.getChildByName("高素体").getChildByName("高身体").active = false;
                this.node.getChildByName("矮素体").getChildByName("矮身体").active = false;
                this.node.getChildByName("高素体").getChildByName("蓝头发").active = true;
                this.node.getChildByName("矮素体").getChildByName("蓝头发").active = true;
                this.scheduleOnce(() => {
                    if (roleIndex == 1) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "头发太长打架不方便";
                        director.emit("bgm", 5);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                    if (roleIndex == 2) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "这发型很帅";
                        director.emit("bgm", 33);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                }, 1);
                break;
            case 6:
                this.node.getChildByName("高素体").getChildByName("4红眼睛").active = true;
                this.node.getChildByName("矮素体").getChildByName("4红眼睛").active = true;
                if (roleIndex == 1) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "眼睛炯炯有神";
                    director.emit("bgm", 22);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                if (roleIndex == 2) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "火辣辣的有点辣眼睛";
                    director.emit("bgm", 19);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                break;
            case 7:
                this.node.getChildByName("高素体").getChildByName("4蓝眼睛").active = true;
                this.node.getChildByName("矮素体").getChildByName("4蓝眼睛").active = true;
                this.scheduleOnce(() => {
                    if (roleIndex == 1) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "这个双眼也太没气势了";
                        director.emit("bgm", 32);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                    if (roleIndex == 2) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "心眼明亮了";
                        director.emit("bgm", 9);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                }, 1);
                break;
            case 8:
                this.node.getChildByName("高素体").getChildByName("5尖牙").active = true;
                this.node.getChildByName("矮素体").getChildByName("5尖牙").active = true;
                if (roleIndex == 1) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "尖牙才能凸显我的叛逆";
                    director.emit("bgm", 6);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                if (roleIndex == 2) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "跟鲨鱼似的不好看";
                    director.emit("bgm", 29);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                break;
            case 9:
                this.node.getChildByName("高素体").getChildByName("5皓齿").active = true;
                this.node.getChildByName("矮素体").getChildByName("5皓齿").active = true;
                this.scheduleOnce(() => {
                    if (roleIndex == 1) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "整齐大白牙有点憨";
                        director.emit("bgm", 17);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                    if (roleIndex == 2) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "看我的帅气微笑";
                        director.emit("bgm", 20);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                }, 1);
                break;
            case 10:
                this.node.getChildByName("高素体").getChildByName("6短袖").active = true;
                this.node.getChildByName("矮素体").getChildByName("6短袖").active = true;
                this.node.getChildByName("高素体").getChildByName("丸子头").getChildByName("2高身莲花").active = false;
                this.node.getChildByName("矮素体").getChildByName("丸子头").getChildByName("2矮身莲花").active = false;
                if (roleIndex == 1) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "凉快，方便活动";
                    director.emit("bgm", 0);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                if (roleIndex == 2) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "衣服那么短，成何体统";
                    director.emit("bgm", 25);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                break;
            case 11:
                this.node.getChildByName("高素体").getChildByName("6长袍").active = true;
                this.node.getChildByName("矮素体").getChildByName("6长袍").active = true;
                this.node.getChildByName("高素体").getChildByName("蓝头发").getChildByName("2高身莲花").active = false;
                this.node.getChildByName("矮素体").getChildByName("蓝头发").getChildByName("2矮身莲花").active = false;
                this.scheduleOnce(() => {
                    if (roleIndex == 1) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "衣服这么长容易绊脚";
                        director.emit("bgm", 26);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                    if (roleIndex == 2) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "衣服很合身";
                        director.emit("bgm", 24);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                }, 1);
                break;
            case 12:
                this.node.getChildByName("高素体").getChildByName("7敖丙武器").active = true;
                this.node.getChildByName("矮素体").getChildByName("7敖丙武器").active = true;
                if (roleIndex == 1) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "这武器太重了";
                    director.emit("bgm", 37);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                if (roleIndex == 2) {
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "出门在外还是要带\n一些趁手的兵器";
                    director.emit("bgm", 1);
                    this.scheduleOnce(() => {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                break;
            case 13:
                this.node.getChildByName("高素体").getChildByName("7哪吒武器").active = true;
                this.node.getChildByName("矮素体").getChildByName("7哪吒武器").active = true;
                this.scheduleOnce(() => {
                    if (roleIndex == 1) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "轻便好用来战";
                        director.emit("bgm", 30);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                    if (roleIndex == 2) {
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "这是小孩子的玩具吧";
                        director.emit("bgm", 36);
                        this.scheduleOnce(() => {
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                }, 1);
                director.emit("isMove", 1);
                break;
            case 14:
                console.log("游戏失败");
                this.scheduleOnce(() => {
                    if (roleIndex == 1) {
                        if (!this.node.parent.getChildByName("对话框")) return;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "我快控制不住了";
                        director.emit("bgm", 2);
                        this.scheduleOnce(() => {
                            if (!this.node.parent.getChildByName("对话框")) return;
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                    if (roleIndex == 2) {
                        if (!this.node.parent.getChildByName("对话框")) return;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "我快控制不住了";
                        director.emit("bgm", 15);
                        this.scheduleOnce(() => {
                            if (!this.node.parent.getChildByName("对话框")) return;
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                }, 1);
                this._isGameOver = 3;
                this.scheduleOnce(() => {
                    director.emit("gameLose");
                }, 2)

                // this.panel.Lost();


                break;
            case 15:
                this.node.getChildByName("高素体").getChildByName("8水纹").active = true;
                this.node.getChildByName("矮素体").getChildByName("8水纹").active = true;
                if (roleIndex == 1) {
                    if (!this.node.parent.getChildByName("对话框")) return;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "这不是属于我的力量";
                    director.emit("bgm", 3);
                    this.scheduleOnce(() => {
                        if (!this.node.parent.getChildByName("对话框")) return;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                if (roleIndex == 2) {
                    if (!this.node.parent.getChildByName("对话框")) return;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = true;
                    this.node.parent.getChildByName("对话框").getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "离复活更近了一步";
                    director.emit("bgm", 12);
                    this.scheduleOnce(() => {
                        if (!this.node.parent.getChildByName("对话框")) return;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框1").active = false;
                    }, 1);
                }
                break;
            case 16:
                this.node.getChildByName("高素体").getChildByName("8火纹").active = true;
                this.node.getChildByName("矮素体").getChildByName("8火纹").active = true;
                this.scheduleOnce(() => {
                    if (roleIndex == 1) {
                        if (!this.node.parent.getChildByName("对话框")) return;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "我好像恢复了力量";
                        director.emit("bgm", 12);
                        this.scheduleOnce(() => {
                            if (!this.node.parent.getChildByName("对话框")) return;
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                    if (roleIndex == 2) {
                        if (!this.node.parent.getChildByName("对话框")) return;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = true;
                        this.node.parent.getChildByName("对话框").getChildByName("对话框2").getChildByName("Label").getComponent(Label).string = "这不是属于我的力量";
                        director.emit("bgm", 16);
                        this.scheduleOnce(() => {
                            if (!this.node.parent.getChildByName("对话框")) return;
                            this.node.parent.getChildByName("对话框").getChildByName("对话框2").active = false;
                        }, 1);
                    }
                }, 1);
                this.winJudge();
                break;
        }

    }
    winJudge() {
        if (OFNR_RoleControl.role1CollisionHistory.length === OFNR_RoleControl.expectedSequence.length) {
            const isWin = OFNR_RoleControl.role1CollisionHistory.every((val, idx) =>
                val === OFNR_RoleControl.expectedSequence[idx]
            );

            if (isWin) {
                this.unscheduleAllCallbacks();
                // this.panel.Win();
                director.emit("gameWin");
                console.log("游戏胜利！");
                OFNR_RoleControl.role1CollisionHistory = [];
            } else {
                this.unscheduleAllCallbacks();
                director.emit("gameLose");
                // this.panel.Lost();
                console.log("游戏失败！");
            }
        }
        else {
            this.unscheduleAllCallbacks();
            director.emit("gameLose");
            // this.panel.Lost();
            console.log("游戏失败！");
        }
    }

}


