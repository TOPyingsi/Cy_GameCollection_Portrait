import { _decorator, Component, easing, error, find, Node, Prefab, tween, UIOpacity, v3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SJCD_GameManager')
export class SJCD_GameManager extends Component {
    public static Instance: SJCD_GameManager = null;
    @property(Node)
    chose: Node = null; // 判断节点
    @property(Node)
    chose1: Node[] = []; // 判断节点
    @property(Node)
    chose3: Node[] = []; // 判断节点
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;
    protected onLoad(): void {
        SJCD_GameManager.Instance = this;
    }
    start() {
        // this.gamePanel.answerPrefab= this.answer;
    }

    update(deltaTime: number) {

    }
    win() {
        if (this.chose.active == true) {
            tween(find("Canvas/level/蓝电线").getComponent(UIOpacity))
                .call(() => {
                    find("Canvas/禁止").active = true;
                    this.DuiGou();
                    this.Qiehuan();
                })
                .delay(1)
                .to(0, { opacity: 255 })
                .to(0.1, { opacity: 0 })
                .call(() => {
                    this.chose.active = false;
                    find("Canvas/禁止").active = false;
                    find("Canvas/level/蓝电线").active = false;
                })
                .start();

        }
        if (this.chose1[0].active == true && this.chose1[1].active == true) {
            tween(find("Canvas/level/第二关").getComponent(UIOpacity))
                .call(() => {
                    find("Canvas/禁止").active = true;
                    this.DuiGou();
                    this.Qiehuan1();
                })
                .delay(1)
                .to(0, { opacity: 255 })
                .to(0.1, { opacity: 0 })
                .call(() => {
                    this.chose1[0].active = false;
                    this.chose1[1].active = false;
                    find("Canvas/禁止").active = false;
                    find("Canvas/level/第二关").active = false;
                })
                .start();
        }
        if (this.chose3[0].active == true && this.chose3[1].active == true && this.chose3[2].active == true) {
            this.DuiGou1();

        }
    }

    DuiGou() {
        tween(find("Canvas/Icon_T").getComponent(UIOpacity))
            .to(0, { opacity: 0 })
            .to(0.5, { opacity: 255 })
            .to(0.5, { opacity: 0 })
            .start();
    }
    DuiGou1() {
        tween(find("Canvas/Icon_T").getComponent(UIOpacity))
            .call(() => {
                find("Canvas/禁止").active = true;
            })
            .to(0, { opacity: 0 })
            .to(0.5, { opacity: 255 })
            .to(1, { opacity: 0 })
            .call(() => {
                this.gamePanel.Win();
                find("Canvas/禁止").active = false;
            })
            .start();
    }
    Qiehuan() {
        find("Canvas/level/第二关").active = true;
        tween(find("Canvas/level/第二关").getComponent(UIOpacity))
            .delay(1.3)
            .to(0, { opacity: 0 })
            .to(0.5, { opacity: 255 })
            .start();
        tween(find("Canvas/level/第二关"))
            .delay(1.3)
            .to(0, { scale: v3(1, 1, 1) })
            .to(0.3, { scale: v3(1.1, 1.1, 1) }, { easing: "backOut" })
            .to(0.2, { scale: v3(1, 1, 1) })
            .start();
    }
    Qiehuan1() {
        find("Canvas/level/第三关").active = true;
        tween(find("Canvas/level/第三关").getComponent(UIOpacity))
            .delay(1.3)
            .to(0, { opacity: 0 })
            .to(0.5, { opacity: 255 })
            .start();
        tween(find("Canvas/level/第三关"))
            .delay(1.3)
            .to(0, { scale: v3(1, 1, 1) })
            .to(0.3, { scale: v3(1.1, 1.1, 1) }, { easing: "backOut" })
            .to(0.2, { scale: v3(1, 1, 1) })
            .start();
    }
}


