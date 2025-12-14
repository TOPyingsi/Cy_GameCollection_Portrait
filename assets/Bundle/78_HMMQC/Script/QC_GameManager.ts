import { _decorator, Component, Label, Node, Prefab, Tween, tween, v2, v3, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { QC_AudioManager } from './QC_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('QC_GameManager')
export class QC_GameManager extends Component {
    public static instance: QC_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;

    @property({ type: Node, displayName: "女儿腿" }) tui: Node = null;
    @property({ type: Node, displayName: "蚊子" }) wz: Node = null;
    @property({ type: Node, displayName: "锣锤" }) lc: Node = null;
    @property(Node) girlLabel: Node = null;
    @property(Node) momLabel: Node = null;

    @property(Node) a: Node = null;
    @property(Node) b: Node = null;

    @property(Node) mask: Node = null;

    isbz: boolean = false;
    iskg: boolean = false;

    private wzPos: Vec3 = new Vec3();
    count: number = 0

    protected onLoad(): void {
        QC_GameManager.instance = this;
        this.wzPos = this.wz.position;
    }

    protected update(dt: number): void {
        console.log(this.mask.active)
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;


        this.tuiTween();
        this.wzTween();

        const time = QC_AudioManager.instance.playAudio("妈妈快点起床啊，你说好带我出去玩的");
        this.setLabel(true, "妈妈快点起床啊，你说好带我出去玩的", time);
    }

    tuiTween() {
        const startPos = this.tui.position.clone();
        tween(this.tui)
            .to(0.3, { position: v3(startPos.x, startPos.y + 20, startPos.z) })
            .to(0.3, { position: v3(startPos.x, startPos.y, startPos.z) })
            .union()
            .repeatForever()
            .start();
    }

    wzTween() {
        this.wz.setPosition(0, 200)
        this.wz.scale = v3(1, 1, 1);
        tween(this.wz)
            .to(3, { position: v3(this.wz.position.x - 200, this.wz.position.y, this.wz.position.z) })
            .call(() => {
                this.wz.scale = v3(-1, 1, 1);
            })
            .to(3, { position: v3(this.wz.position.x + 200, this.wz.position.y, this.wz.position.z) })
            .call(() => {
                this.wz.scale = v3(1, 1, 1);
            })
            .union()
            .repeatForever()
            .start();
    }

    lcTween(callback?: Function) {
        tween(this.lc)
            .to(0.2, { eulerAngles: v3(0, 0, 20) })
            .to(0.2, { eulerAngles: v3(0, 0, 0) })
            .union()
            .repeat(3)
            .call(() => {
                callback()
            })
            .start();
    }

    /** true是girl false是mom */
    setLabel(bol: boolean, str: string, time: number = 0) {
        if (bol) {
            this.girlLabel.active = true;
            this.girlLabel.getChildByName("String").getComponent(Label).string = str;
            this.scheduleOnce(() => {
                this.girlLabel.active = false;
            }, time);
        }
        else {
            this.momLabel.active = true;
            this.momLabel.getChildByName("String").getComponent(Label).string = str;
            this.scheduleOnce(() => {
                this.momLabel.active = false;
            }, time);
        }
    }

    hh() {
        this.count++
        if (this.count >= 10) {
            this.scheduleOnce(() => {
                this.a.active = true;
                this.b.active = false;
                const time = QC_AudioManager.instance.playAudio("乖女儿，妈妈这就带你出去玩")
                this.setLabel(false, "乖女儿，妈妈这就带你出去玩", time)
                this.scheduleOnce(() => {
                    Tween.stopAll()
                    this.gamePanel.Win()
                }, time)
            }, 3)
        }
    }

}


