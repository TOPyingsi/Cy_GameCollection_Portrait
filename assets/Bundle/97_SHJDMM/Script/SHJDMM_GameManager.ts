import { _decorator, AudioClip, Component, director, Label, Node, Prefab, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v3, Vec2, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJDMM_GameManager')
export class SHJDMM_GameManager extends Component {
    public static instance: SHJDMM_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Label) time: Label = null;
    @property(Node) NPC: Node = null;
    @property(Node) mask: Node = null;
    @property(Node) blackMask: Node = null;
    @property(SpriteFrame) NPC_sf: SpriteFrame = null;
    @property([Node]) panels: Node[] = [];
    @property(AudioClip) wbbb: AudioClip = null;
    @property(AudioClip) bgm: AudioClip = null;
    @property([Prefab]) answers: Prefab[] = [];

    // map记录发生碰撞的角色 key是role value是mask
    map: Map<Node, Node> = new Map()
    // _map记录处于遮罩下的角色 key是role value是mask
    _map: Map<Node, Node> = new Map()

    private countdown: number = 15;  // 倒计时总时间（秒）
    private currentTime: number = 0; // 当前剩余时间
    private isCounting: boolean = false; // 是否正在倒计时
    private round: number = 0;

    initPos: Vec3 = new Vec3()

    protected onLoad(): void {
        SHJDMM_GameManager.instance = this;
        this.initPos = this.NPC.getPosition().clone();
    }

    protected start(): void {
        this.loadGameToRound();
        AudioManager.Instance.PlayBGM(this.bgm)
    }

    // 开始倒计时的方法
    startCountdown() {
        this.currentTime = this.countdown;
        this.isCounting = true;
        this.updateTimeDisplay();
    }

    // 每帧更新
    protected update(dt: number) {
        if (this.isCounting) {
            this.currentTime -= dt;

            this.updateTimeDisplay();

            // 检查倒计时是否结束
            if (this.currentTime <= 0) {
                this.currentTime = 0;
                this.isCounting = false;
                this.onCountdownEnd();
            }
        }
    }

    loadGameToRound() {
        this.map.clear()
        this._map.clear()
        this.blackMask.active = true;
        const uio = this.blackMask.getComponent(UIOpacity)
        tween(uio)
            .to(0.5, { opacity: 255 })
            .call(() => {
                if (this.round >= 3) {
                    this.gamePanel.Win();
                } else {
                    if (this.round > 0) {
                        this.panels[this.round - 1].destroy();
                    }
                    this.panels[this.round].active = true;
                    this.gamePanel.answerPrefab = this.answers[this.round];
                    this.countdown = 15;
                    this.NPC.setPosition(-835, -600, 0)

                    tween(uio)
                        .to(0.5, { opacity: 0 })
                        .call(() => {
                            this.blackMask.active = false;
                            this.startCountdown();
                        })
                        .start()
                }
            })
            .start()
    }

    // 更新时间显示
    private updateTimeDisplay() {
        if (this.time) {
            this.time.string = Math.ceil(this.currentTime).toString();
        }
    }

    // 倒计时结束的处理
    private onCountdownEnd() {
        console.log("倒计时结束");
        this.mask.active = true;
        director.getScene().emit("timeOut");
        this.move();
    }

    move() {
        tween(this.NPC)
            .to(3, { position: v3(0, this.initPos.y, this.initPos.z) })
            .call(() => {

                this.scheduleOnce(() => {
                    const bol = this.check()

                    if (this.round == 0) { director.emit("round1_changeSf"); };
                    if (this.round == 1) { director.emit("round2_changeSf"); };
                    if (this.round == 2) { director.emit("round3_changeSf"); };

                    if (bol) {
                        tween(this.NPC)
                            .to(3, { position: v3(-this.initPos.x, this.initPos.y, this.initPos.z) })
                            .call(() => {
                                console.log("成功")
                                this.mask.active = false;
                                this.round++
                                this.loadGameToRound()
                            })
                            .start()
                    } else {
                        AudioManager.Instance.PlaySFX(this.wbbb)
                        this.NPC.getComponent(Sprite).spriteFrame = this.NPC_sf;
                        this.NPC.getChildByName("嘴").active = true;
                        this.scheduleOnce(() => {
                            this.gamePanel.Lost();
                        }, 1)
                    }
                }, 1)
            })
            .start()
    }

    check() {
        if (this._map.size >= 3 && this.map.size == 0) { return true; }
        else { return false; }
    }
}