import { _decorator, AudioClip, Component, director, Node, Prefab, tween, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJBS_GameManager')
export class SHJBS_GameManager extends Component {

    public static instance: SHJBS_GameManager;

    @property(Node) nextButton: Node = null;
    @property(Node) upButton: Node = null;
    @property(Node) T: Node = null;
    @property(Node) F: Node = null;
    @property(GamePanel) gamePanel: GamePanel = null;
    @property([Node]) roles: Node[] = [];

    @property(AudioClip) TClip: AudioClip = null;
    @property(AudioClip) FClip: AudioClip = null;
    @property([AudioClip]) clips: AudioClip[] = [];

    @property(Node) YW: Node = null;
    @property([Node]) HP: Node[] = [];

    @property(Prefab) answer: Prefab = null;

    currentRoleIndex: number = 0;
    private isClick: boolean = true;
    hp: number = 3;
    winCount: number = 0;


    protected onLoad(): void {
        SHJBS_GameManager.instance = this;
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;
        this.upButton.active = false;
        director.getScene().emit("role", this.roles[this.currentRoleIndex]);
    }


    next() {
        if (!this.isClick) return;
        if (this.currentRoleIndex >= this.roles.length - 1) return;
        this.isClick = false;
        tween(this.roles[this.currentRoleIndex])
            .to(0.3, { position: new Vec3(-1080, 0, 0) })
            .start();

        this.currentRoleIndex++;

        tween(this.roles[this.currentRoleIndex])
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .call(() => {
                this.isClick = true;
                director.getScene().emit("role", this.roles[this.currentRoleIndex]);
            })
            .start();

        this.upButton.active = this.currentRoleIndex > 0;
        this.nextButton.active = this.currentRoleIndex < this.roles.length - 1;
    }

    up() {
        if (!this.isClick) return;
        this.isClick = false;

        tween(this.roles[this.currentRoleIndex])
            .to(0.3, { position: new Vec3(1080, 0, 0) })
            .start();

        this.currentRoleIndex--;

        tween(this.roles[this.currentRoleIndex])
            .to(0.3, { position: new Vec3(0, 0, 0) })
            .call(() => {
                this.isClick = true;
                director.getScene().emit("role", this.roles[this.currentRoleIndex]);
            })
            .start();

        this.upButton.active = this.currentRoleIndex > 0;
        this.nextButton.active = this.currentRoleIndex < this.roles.length - 1;
    }

    tip(bool: boolean) {
        if (bool) {
            // AudioManager.Instance.PlaySFX(this.TClip)
            this.T.active = true;
            this.scheduleOnce(() => {
                this.T.active = false;
            }, 2)
        } else if (!bool) {
            AudioManager.Instance.PlaySFX(this.FClip)
            this.F.active = true;
            this.scheduleOnce(() => {
                this.F.active = false;
            }, this.FClip.getDuration())
        }
    }

    // 修改 completedRoles 为记录角色名称而不是索引
    private completedRoles: Set<string> = new Set();

    // 修改 playAudio 方法
    playAudio(str: string) {
        this.isClick = false;
        const c = this.clips.find(item => item.name === str);
        AudioManager.Instance.PlaySFX(c);
        this.scheduleOnce(() => {
            this.isClick = true;

            // 记录完成的是角色名称而不是索引
            this.completedRoles.add(str);

            if (this.winCount >= 12) {
                this.gamePanel.Win();
            } else {
                this.next();
            }
        }, c.getDuration());
        return c.getDuration();
    }

    // 修改检查方法
    public isRoleCompleted(roleName: string): boolean {
        return this.completedRoles.has(roleName);
    }

    laodYW() {
        this.YW.active = true;
        this.YW.setScale(0.8, 0.8, 0.8);
        tween(this.YW)
            .to(0.2, { scale: new Vec3(2, 2, 2) })
            .to(0.2, { scale: new Vec3(0, 0, 0) })
            .call(() => {
                this.YW.active = false;
            })
            .start();
    }

    delHP() {
        this.HP[this.hp - 1].destroy();
        this.hp--;
        if (this.hp == 0) {
            this.gamePanel.Lost();
        }
    }

}


