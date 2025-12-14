import { _decorator, AudioClip, Component, Event, Node, Tween, tween, UIOpacity, v3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import PrefsManager from 'db://assets/Scripts/Framework/Managers/PrefsManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('ZZ_GameManager')
export class ZZ_GameManager extends Component {

    public static instance: ZZ_GameManager = null;

    @property(Node) mgr: Node = null;
    @property(Node) kf: Node = null;
    @property(Node) yzh: Node = null;
    @property(Node) rz: Node = null;
    @property(Node) jz: Node = null;
    @property(Node) blackMask: Node = null;
    @property([Node]) panels: Node[] = [];

    @property(Node) hand: Node = null;

    @property(GamePanel) gamePanel: GamePanel = null;

    @property(AudioClip) bgm: AudioClip = null;
    @property(AudioClip) buttonClick: AudioClip = null;
    @property([AudioClip]) rolesAudio: AudioClip[] = [];

    private selectedRole: Node = null;

    onLoad() {
        ZZ_GameManager.instance = this;
    }

    protected start(): void {
        AudioManager.Instance.PlayBGM(this.bgm);

        const bol = PrefsManager.GetBool("firstOn");
        if (!bol) {
            this.hand.active = true;
            this.handTween();
        }
    }

    select(event: Event) {
        const bol = PrefsManager.GetBool("firstOn");
        if (!bol) {
            this.handTween1();
        }
        this.playButton();

        this.selectedRole = event.target;
        this.mgr.getChildByName("Selected").active = event.target == this.mgr;
        this.kf.getChildByName("Selected").active = event.target == this.kf;
        this.yzh.getChildByName("Selected").active = event.target == this.yzh;
        this.rz.getChildByName("Selected").active = event.target == this.rz;
        this.jz.getChildByName("Selected").active = event.target == this.jz;
        console.log(this.selectedRole.name);
    }

    startMake() {
        this.playButton();
        if (!this.selectedRole) return;
        PrefsManager.SetBool("firstOn", true)

        Tween.stopAllByTarget(this.hand);
        this.hand.destroy();
        this.blackMask.active = true;
        const uio = this.blackMask.getComponent(UIOpacity);
        uio.opacity = 0;
        tween(uio)
            .to(0.5, { opacity: 255 })
            .call(() => {
                const panel = this.panels.find(panel => panel.active = panel.name == `${this.selectedRole.name}Panel`)
                panel.active = true;
                console.log(panel.name);

                tween(uio)
                    .to(0.5, { opacity: 0 })
                    .call(() => {
                        this.blackMask.active = false;
                    })
                    .start();
            })
            .start();
    }

    playRoleAudio() {
        const audio = this.rolesAudio.find(audio => audio.name == this.selectedRole.name)
        if (audio) {
            AudioManager.Instance.PlaySFX(audio);
            return audio.getDuration();
        } else {
            console.log("没有找到角色音频:", this.selectedRole.name);
        }
    }

    playButton() {
        AudioManager.Instance.PlaySFX(this.buttonClick);
    }

    handTween() {
        this.hand.setPosition(-150, 200);
        tween(this.hand)
            .to(0.2, { eulerAngles: v3(0, 0, 10) })
            .to(0.2, { eulerAngles: v3(0, 0, 0) })
            .union()
            .repeatForever()
            .start();
    }

    handTween1() {
        this.hand.setPosition(100, -670);
        tween(this.hand)
            .to(0.2, { eulerAngles: v3(0, 0, 10) })
            .to(0.2, { eulerAngles: v3(0, 0, 0) })
            .union()
            .repeatForever()
            .start();
    }
}


