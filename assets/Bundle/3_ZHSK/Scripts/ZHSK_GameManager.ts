import { _decorator, Button, Camera, Component, director, find, instantiate, Node, tween, v3 } from 'cc';
import { ZHSK_Player } from './ZHSK_Player';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import Banner from 'db://assets/Scripts/Banner';

const { ccclass, property } = _decorator;

@ccclass('ZHSK_GameManager')
export class ZHSK_GameManager extends Component {
    public _win: boolean = null;
    public _Puase: boolean = false;
    public static Instance: ZHSK_GameManager = null;
    public Anation: number = 0;
    @property(Node)
    Lose: Node = null;
    @property(Node)
    Win: Node = null;
    @property(Node)
    Diepos: Node = null;
    NameNumber: number = 0;
    Speed: number = 0;
    SpeedEnable: number = 0;
    protected onLoad(): void {
        ZHSK_GameManager.Instance = this;
    }
    start() {

        if (director.getScene().name == "ZHSK_JDMSGame" || director.getScene().name == "ZHSK_ZZJHGame" || director.getScene().name == "ZHSK_WKJHGame" || director.getScene().name == "ZHSK_BBLYGame") {
            find("Camera").getComponent(Camera).orthoHeight = 500;
        }
        else {
            find("Camera").getComponent(Camera).orthoHeight = 1170;
        }
        ProjectEventManager.emit(ProjectEvent.游戏开始, "召唤神鲲");
    }

    update(deltaTime: number) {
        if (find("Canvas/奇遇面板").active == true) {


            // this.scheduleOnce(() => {
            director.pause();
            // }, 0.2)
        }

    }
    WinorLose() {
        if (this._win == false && this.Anation == 0) {
            ProjectEventManager.emit(ProjectEvent.游戏结束, "召唤神鲲");
            if (this.SpeedEnable == 0) {
                this.Speed = find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed;
                console.error(this.Speed);

                this.SpeedEnable = 1;
            }


            find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0;
            tween(this.Lose)
                .to(0, { scale: v3(0, 0, 1) })
                .call(() => {
                    this.Lose.active = true;
                })
                // .delay(1)
                .to(0.2, { scale: v3(1, 1, 1,) })
                .call(() => {
                    find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = this.Speed;
                    // if (director.getScene().name == "ZHSK_JDMSGame") {
                    //     find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.03;
                    // }
                    // if (director.getScene().name == "ZHSK_BFHZGame") {
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player1" || "Player") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.025;

                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player2") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.035;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player3") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.035;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player4") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.04;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player5") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.05;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player6") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.075;
                    //     }
                    //     else {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.075;
                    //     }
                    // }
                    // else if (director.getScene().name != "ZHSK_JDMSGame" && director.getScene().name != "ZHSK_BFHZGame") {
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player1" || "Player") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.05;

                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player2") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.07;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player3") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.07;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player4") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.08;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player5") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.1;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player6") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.15;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player7") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.15;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player8") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.15;
                    //     }
                    //     if (find("Canvas/PlayerManager").children[0].name == "Player9") {
                    //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.15;
                    //     }
                    // }

                })
                .start();
            const Name = find("Canvas/PlayerManager").children[0].children[1].name;
            for (let k = 0; k < this.Diepos.children.length; k++) {
                if (this.Diepos.children[k].name == Name) {
                    find("Canvas/不复活弹窗/位置").children[k].active = true;
                    this.Diepos.children[k].active = true;
                    break;
                }
            }
        }
        else if (this._win == true && this.Anation == 0) {
            ProjectEventManager.emit(ProjectEvent.游戏结束, "召唤神鲲");
            find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0;

            tween(this.Win)
                .to(0, { scale: v3(0, 0, 1) })
                .delay(0.5)
                .call(() => {
                    this.Win.active = true;
                })
                .to(0.2, { scale: v3(1, 1, 1) })

                .start();
            for (let j = 0; j < find("Canvas/暂存").children.length; j++) {
                find("Canvas/暂存").children[j].destroy();
                if (this._win == null) {
                    break;
                }
            }
        }
    }

    FuHuo() {//复活
        Banner.Instance.ShowVideoAd(() => {
            ZHSK_GameManager.Instance.Anation = 0;
            const Name = find("Canvas/PlayerManager").children[0].children[1].name;
            find("Canvas/角色升级").active = true;
            find("Canvas/冰冻").active = true;
            for (let k = 0; k < this.Diepos.children.length; k++) {
                if (this.Diepos.children[k].name == Name) {
                    find("Canvas/不复活弹窗/位置").children[k].active = false;
                    this.Diepos.children[k].active = false;
                    break;
                }
            }
            for (let j = 0; j < find("Canvas/暂存").children.length; j++) {
                find("Canvas/暂存").children[j].destroy();
                if (this._win == null) {
                    break;
                }
            }
            find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = this.Speed;
            this.SpeedEnable = 0;
            // if (director.getScene().name == "ZHSK_JDMSGame") {
            //     find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.03;
            // }
            // if (director.getScene().name == "ZHSK_BFHZGame") {
            //     if (find("Canvas/PlayerManager").children[0].name == "Player1" || "Player") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.025;

            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player2") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.035;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player3") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.035;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player4") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.04;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player5") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.05;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player6") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.075;
            //     }
            //     else {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.075;
            //     }
            // }
            // else if (director.getScene().name != "ZHSK_JDMSGame" && director.getScene().name != "ZHSK_BFHZGame") {
            //     if (find("Canvas/PlayerManager").children[0].name == "Player1" || "Player") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.05;

            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player2") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.07;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player3") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.07;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player4") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.08;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player5") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.1;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player6") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.15;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player7") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.15;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player8") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.15;
            //     }
            //     if (find("Canvas/PlayerManager").children[0].name == "Player9") {
            //         find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.15;
            //     }
            // }

            find("Canvas/PlayerManager").children[0].active = true;
            this.Lose.active = false;
            this._win = null;
        })


    }

    OpenQiyuPanel() {
        // find("Canvas/奇遇面板").active = true;
        // find("Canvas/奇遇面板").getComponent(Animation).play();

    }
}


