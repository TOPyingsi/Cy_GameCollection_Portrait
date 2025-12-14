import { _decorator, AudioClip, AudioSource, Component, director, EventTouch, Input, input, Node, NodeEventType, Prefab, tween, Vec2, Vec3 } from 'cc';
import { AudioManager, Audios } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('OFNR_GameManager')
export class OFNR_GameManager extends Component {
    @property(Node)
    private targetNode1: Node = null;
    @property(Node)
    private targetNode2: Node = null;

    @property([AudioClip])
    clips: AudioClip[] = [];
    @property(Prefab)
    private answerPrefab: Prefab = null;
    @property(AudioSource)
    private audio: AudioSource = null;

    private touchStartPos: Vec2 = new Vec2();
    private isSwapping: boolean = false;

    @property(GamePanel)
    panel: GamePanel = null;

    private roleNamePos: number = 200;
    protected onLoad(): void {
        director.on("gameLose", this.gameLose, this);
        director.on("gameWin", this.gameWin, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        director.on("bgm", this.bgmPlay, this);
        this.panel.answerPrefab = this.answerPrefab;
        this.panel.winStr = "多亏了你，我们的身体得以重塑！";
        this.panel.lostStr = "好像哪里搞错了，再试试看。";

    }
    private bgmPlay(id) {
        // this.audio.playOneShot(this.clips[id]);
        AudioManager.Instance.PlaySFX(this.clips[id]);
    }
    gameWin() {
        this.node.parent.getChildByName("游戏成功").active = true;
        this.scheduleOnce(() => {
            this.panel.Win();
        }, 1);
    }
    gameLose() {
        this.node.parent.getChildByName("游戏失败").active = true;
        const neza = this.node.getChildByName("OFNR_Nezha");
        const aobin = this.node.getChildByName("OFNR_Aobin");
        this.node.parent.getChildByName("游戏失败").getChildByName("哪吒").addChild(neza);
        this.node.parent.getChildByName("游戏失败").getChildByName("敖丙").addChild(aobin);
        this.scheduleOnce(() => {
            this.panel.Lost();
        }, 1);



    }


    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        event.getStartLocation(this.touchStartPos);
    }

    private onTouchEnd(event: EventTouch) {
        if (this.isSwapping) return;

        const endPos = new Vec2();
        event.getLocation(endPos);
        const deltaX = endPos.x - this.touchStartPos.x;


        if (Math.abs(deltaX) > 50) {
            this.isSwapping = true;
            deltaX > 0 ? this.swapRight() : this.swapLeft();
        }
    }
    private swapRight() {
        this.swapNodes(this.targetNode1.position.clone(), this.targetNode2.position.clone());
    }

    private swapLeft() {
        this.swapNodes(this.targetNode1.position.clone(), this.targetNode2.position.clone());
    }

    private swapNodes(pos1: Vec3, pos2: Vec3) {
        tween(this.targetNode1)
            .to(0.3, { position: pos2 })
            .call(() => this.isSwapping = false)
            .call(() => {
                this.targetNode1.getChildByName("OFNR_RoleName").setPosition(this.roleNamePos, 0, 0);

            })
            .start();

        tween(this.targetNode2)
            .to(0.3, { position: pos1 })
            .call(() => {
                this.targetNode2.getChildByName("OFNR_RoleName").setPosition(-this.roleNamePos, 0, 0);
                this.roleNamePos = -this.roleNamePos;
            })
            .start();
    }
    start() {
        this.targetNode1 = this.node.getChildByName("OFNR_Nezha");
        this.targetNode2 = this.node.getChildByName("OFNR_Aobin");
    }

    update(deltaTime: number) {

    }
}


