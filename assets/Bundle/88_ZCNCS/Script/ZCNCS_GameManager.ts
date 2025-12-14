import { _decorator, AudioClip, Component, director, instantiate, Label, Node, Prefab, SpriteFrame, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { ZCNCS_ManCtrl } from './ZCNCS_ManCtrl';
import { ZCNCS_WomenCtrl } from './ZCNCS_WomenCtrl';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

export enum SEX {
    MAN = 0,
    WOMEN = 1
}

@ccclass('ZCNCS_GameManager')
export class ZCNCS_GameManager extends Component {
    public static instance: ZCNCS_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Node) gameArea: Node = null;
    @property([SpriteFrame]) manSF: SpriteFrame[] = [];
    @property([SpriteFrame]) womenSF: SpriteFrame[] = [];
    @property(Prefab) manPrefab: Prefab = null;
    @property(Prefab) womenPrefab: Prefab = null;
    @property(Label) progress: Label = null;
    @property(AudioClip) buttonClick: AudioClip = null;
    @property(Prefab) answer: Prefab = null;

    private round = 0;
    private currentMan: Node = null;
    private currentWomen: Node = null;
    private leftPos = new Vec3(-250, 0, 0);
    private rightPos = new Vec3(250, 0, 0);

    protected onLoad(): void {
        ZCNCS_GameManager.instance = this;
        director.getScene().on("selected", this.handler, this);
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;
        this.init();
    }

    init() {
        this.refreshProgress();

        const man = instantiate(this.manPrefab);
        const women = instantiate(this.womenPrefab);

        man.getComponent(ZCNCS_ManCtrl).init(this.manSF[this.round]);
        women.getComponent(ZCNCS_WomenCtrl).init(this.womenSF[this.round]);

        const bol = Math.random() > 0.5;

        man.setPosition(bol ? this.leftPos : this.rightPos);
        women.setPosition(bol ? this.rightPos : this.leftPos);

        man.setParent(this.gameArea);
        women.setParent(this.gameArea);

        this.currentMan = man;
        this.currentWomen = women;
    }

    refreshProgress() {
        this.progress.string = `${this.round + 1} / 20`;
    }

    handler(type: SEX) {
        AudioManager.Instance.PlaySFX(this.buttonClick);
        this.round++;

        if (this.round >= 20) {
            this.gamePanel.Win();
        } else {
            this.scheduleOnce(() => {
                this.currentMan.destroy();
                this.currentWomen.destroy();

                if (type == SEX.MAN) { this.scheduleOnce(() => { this.init() }, 0.5) };
                if (type == SEX.WOMEN) { this.scheduleOnce(() => { this.gamePanel.Lost() }, 0.5) };
            }, 0.5);
        }
    }
}


