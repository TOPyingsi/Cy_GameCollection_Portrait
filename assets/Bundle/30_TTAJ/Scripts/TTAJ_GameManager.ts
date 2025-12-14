import { _decorator, Component, director, error, find, Label, Node, Prefab, tween, v3, Vec3 } from 'cc';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('TTAJ_GameManager')
export class TTAJ_GameManager extends Component {
    public Level1: number = 0;
    public Level2: number = 0;
    public Level3: number = 1;
    public static Instance: TTAJ_GameManager = null;
    @property(Node)
    renwu: Node[] = [];
    @property(Label)
    jingdu: Label = null;
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;

    protected onLoad(): void {
        TTAJ_GameManager.Instance = this;
        this.gamePanel.winStr = "你有一双火眼金睛！！！";
        this.gamePanel.lostStr = "还得练啊，老弟";
        this.gamePanel.answerPrefab = this.answer;
    }

    start() {
        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.init, this);
        } else {
            this.init();
        }


    }
    init() {
        tween(this.renwu[0])
            .to(0, { position: v3(this.renwu[0].position) })
            .to(1, { position: v3(this.renwu[0].position.x + 831, this.renwu[0].position.y, this.renwu[0].position.z) })
            .call(() => {
                this.renwu[0].children[0].active = true;
            })
            .delay(2)
            .to(1, { position: v3(this.renwu[0].position.x + 2000, this.renwu[0].position.y, this.renwu[0].position.z) })
            .call(() => {

                this.ShiBing();
                this.Renwu1PosBk();
            })
            .start();
    }
    Renwu1PosBk() {
        const starpos = find("Canvas/放大镜/放大镜").children[1].worldPosition
        tween(this.renwu[1])
            .to(0, { worldPosition: v3(this.renwu[1].worldPosition.x, this.renwu[1].worldPosition.y, this.renwu[1].worldPosition.z), scale: v3(0.8, 0.8, 1) })
            .to(2, { worldPosition: v3(starpos.x, starpos.y, starpos.z), scale: v3(1, 1, 1) })
            .call(() => {
                find("Canvas/背景/放行按钮").active = true;
                this.renwu[1].setSiblingIndex(4);
                this.jingdu.string = this.renwu[1].name + "  线索：" + this.Level1 + "/3" + "当前人物：" + this.Level3 + "/4";
            })
            .start();
    }



    ShiBing() {
        for (let i = 0; i < find("Canvas/背景/放行").children.length; i++) {

            tween(find("Canvas/背景/放行").children[i])
                .to(0, { eulerAngles: v3(find("Canvas/背景/放行").children[i].eulerAngles.x, find("Canvas/背景/放行").children[i].eulerAngles.y, find("Canvas/背景/放行").children[i].eulerAngles.z) })
                .to(2, { eulerAngles: v3(find("Canvas/背景/放行").children[i].eulerAngles.x, find("Canvas/背景/放行").children[i].eulerAngles.y, -45) })
                .to(1, { eulerAngles: v3(find("Canvas/背景/放行").children[i].eulerAngles.x, find("Canvas/背景/放行").children[i].eulerAngles.y, find("Canvas/背景/放行").children[i].eulerAngles.z) })
                .call(() => {
                    find("Canvas/放大镜/放大镜").children[1].active = true;
                })
                .start();
        }

    }
    Renwu2PosBk() {

        const destroyPos = find("Canvas/背景/敖丙").position;
        tween(find("Canvas/背景/敖丙"))
            .call(() => {
                find("Canvas/放大镜/放大镜").children[1].destroy();
            })
            .to(0, { position: v3(destroyPos.x, destroyPos.y, destroyPos.z) })
            .to(1, { position: v3(destroyPos.x + 800, destroyPos.y, destroyPos.z) })
            .call(() => {
                find("Canvas/背景/敖丙").destroy();
            })
            .start();
        const starpos = find("Canvas/放大镜/放大镜/底层悟空").worldPosition
        tween(this.renwu[2])
            .delay(0.5)
            .call(() => {
                this.ShiBing();
            })
            .to(0, { worldPosition: v3(this.renwu[2].worldPosition.x, this.renwu[2].worldPosition.y, this.renwu[2].worldPosition.z), scale: v3(0.8, 0.8, 1) })
            .to(2, { worldPosition: v3(starpos.x, starpos.y, starpos.z), scale: v3(1, 1, 1) })
            .call(() => {
                find("Canvas/背景/放行按钮").active = true;
                this.jingdu.string = this.renwu[2].name + "  线索：" + this.Level1 + "/4" + "当前人物：" + this.Level3 + "/4";
                this.renwu[2].setSiblingIndex(3);
            })
            .start();
    }
    Renwu3PosBk() {

        const destroyPos = find("Canvas/背景/悟空").position;
        tween(find("Canvas/背景/悟空"))
            .call(() => {
                find("Canvas/放大镜/放大镜").children[1].destroy();
            })
            .to(0, { position: v3(destroyPos.x, destroyPos.y, destroyPos.z) })
            .to(1, { position: v3(destroyPos.x + 800, destroyPos.y, destroyPos.z) })
            .call(() => {
                find("Canvas/背景/悟空").destroy();
            })
            .start();
        const starpos = find("Canvas/放大镜/放大镜/哪吒").worldPosition
        tween(this.renwu[3])
            .delay(0.5)
            .call(() => {
                this.ShiBing();
            })
            .to(0, { worldPosition: v3(this.renwu[3].worldPosition.x, this.renwu[3].worldPosition.y, this.renwu[3].worldPosition.z), scale: v3(0.8, 0.8, 1) })
            .to(2, { worldPosition: v3(starpos.x, starpos.y, starpos.z), scale: v3(1, 1, 1) })
            .call(() => {
                find("Canvas/背景/放行按钮").active = true;
                this.jingdu.string = this.renwu[3].name + "  线索：" + this.Level1 + "/4" + "当前人物：" + this.Level3 + "/4";
                this.renwu[3].setSiblingIndex(3);
            })
            .start();
    }
    Renwu4PosBk() {

        const destroyPos = find("Canvas/背景/哪吒").position;
        tween(find("Canvas/背景/哪吒"))
            .call(() => {
                find("Canvas/放大镜/放大镜").children[1].destroy();
            })
            .to(0, { position: v3(destroyPos.x, destroyPos.y, destroyPos.z) })
            .to(1, { position: v3(destroyPos.x + 800, destroyPos.y, destroyPos.z) })
            .call(() => {
                find("Canvas/背景/哪吒").destroy();
            })
            .start();
        const starpos = find("Canvas/放大镜/放大镜/无量仙翁").worldPosition
        tween(this.renwu[4])
            .delay(0.5)
            .call(() => {
                this.ShiBing();
            })
            .to(0, { worldPosition: v3(this.renwu[4].worldPosition.x, this.renwu[4].worldPosition.y, this.renwu[4].worldPosition.z), scale: v3(0.8, 0.8, 1) })
            .to(2, { worldPosition: v3(starpos.x, starpos.y, starpos.z), scale: v3(1, 1, 1) })
            .call(() => {
                find("Canvas/背景/放行按钮").active = true;
                this.jingdu.string = this.renwu[4].name + "  线索：" + this.Level1 + "/4" + "当前人物：" + this.Level3 + "/4";
                this.renwu[4].setSiblingIndex(3);
            })
            .start();
    }

    winorlose() {
        if (this.Level2 >= 3) {
            find("Canvas/背景/放行按钮").active = false;
            this.scheduleOnce(() => {
                this.gamePanel.Win();
            }, 1);

        }
        else {
            this.gamePanel.Lost();
        }
    }
}