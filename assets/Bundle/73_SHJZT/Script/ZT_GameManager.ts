import { _decorator, AudioClip, CCInteger, Color, Component, Label, Node, Prefab, Size, Sprite, SpriteFrame, Tween, tween, UIOpacity, UITransform, v2, v3, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('ZT_GameManager')
export class ZT_GameManager extends Component {
    public static instance: ZT_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;

    @property(Node) playArea: Node = null;
    @property(Node) objective: Node = null;
    @property(Node) role: Node = null;
    @property(Node) rightIcon: Node = null;
    @property(Node) failIcon: Node = null;
    @property(Node) bg: Node = null;

    @property(AudioClip) rightClip: AudioClip = null;
    @property(AudioClip) failClip: AudioClip = null;

    @property(Label) TVT: Label = null;
    @property(Label) time: Label = null;

    @property([SpriteFrame]) roleSf: SpriteFrame[] = [];
    @property([SpriteFrame]) objectiveSf: SpriteFrame[] = [];
    @property([SpriteFrame]) bgSf: SpriteFrame[] = [];

    @property(CCInteger) move_offset: number = 10;
    @property(CCInteger) rotation_offset: number = 3;
    @property(CCInteger) speed: number = 2;
    @property(Prefab) answer: Prefab = null;

    private count: number = 0;

    protected onLoad(): void {
        ZT_GameManager.instance = this;
        // this.gamePanel.time = 20 * this.roleSf.length;
        this.gamePanel.lostStr = '菜就多练';
    }

    protected start(): void {
        this.initRole();
        this.gamePanel.answerPrefab = this.answer;
    }

    updateTVT() {
        this.TVT.string = `进度：${this.count}/${this.roleSf.length}`
        if (this.count >= this.roleSf.length) {
            this.gamePanel.Win()
        }
    }


    initRole() {
        this.gamePanel.time = 20

        this.updateTVT();
        if (this.count % 2 === 0) {
            console.log("AAAAAAAAAAAAA");

            const sp = this.role.getComponent(Sprite);
            sp.spriteFrame = this.roleSf[this.count];
            const tran = this.role.getComponent(UITransform)
            tran.anchorY = 0.5;
            tran.anchorX = 0.5;
            this.role.angle = 0;
            this.role.setPosition(540, 0, 0);

            const _sp = this.objective.getComponent(Sprite);
            _sp.spriteFrame = this.objectiveSf[this.count]
            if (this.count == 34) {
                this.objective.setPosition(32, 5, 0)
            } else {
                this.objective.setPosition(Vec3.ZERO)
            }

            this.bg.getComponent(Sprite).spriteFrame = this.bgSf[this.count]

            this.roleMoveTween();
        }
        else {
            console.log("BBBBBBBBBBBB");
            const sp = this.role.getComponent(Sprite);
            sp.spriteFrame = this.roleSf[this.count];
            const tran = this.role.getComponent(UITransform);
            tran.anchorY = 1;
            this.role.setPosition(0, tran.contentSize.y / this.speed, 0);

            const _sp = this.objective.getComponent(Sprite);
            _sp.spriteFrame = this.objectiveSf[this.count]
            this.objective.setPosition(Vec3.ZERO)

            this.bg.getComponent(Sprite).spriteFrame = this.bgSf[this.count]

            this.roleRotationTween();
        }
    }

    roleMoveTween(pos?: Vec3) {
        const x = this.playArea.getComponent(UITransform).contentSize.width;
        const speed = x / this.speed; // 计算恒定速度 (像素/秒)

        // 设置起始位置
        const startPos = pos || v3(x / this.speed, this.role.position.y, 0);
        this.role.setPosition(startPos);

        // 计算剩余距离和所需时间
        const distance = Math.abs(startPos.x - (-x / this.speed));
        const duration = distance / speed; // 根据距离和速度计算时间

        tween(this.role)
            .to(duration, { position: v3(-x / this.speed, this.role.position.y) })
            .call(() => {
                this.roleMoveTween();
            })
            .start()
    }

    roleRotationTween(angle?: number) {
        if (angle) {
            this.role.angle = angle;
        } else {
            this.role.angle = 0;
        }
        tween(this.role)
            .by(this.speed, { angle: 360 })
            .repeatForever()
            .start()
    }

    private isCanClick = true;
    stop() {
        if (!this.isCanClick) return;
        this.isCanClick = false;
        Tween.stopAll()
        if (this.count % 2 === 0) {
            const x = this.role.position.x
            const _x = 0

            console.log(x, "偏移量：", this.move_offset);

            if (x >= _x - this.move_offset && x <= _x + this.move_offset) {
                this.ovo()
            }
            else {
                this.failIcon.active = true;
                AudioManager.Instance.PlaySFX(this.failClip)
                this.scheduleOnce(() => {
                    this.failIcon.active = false;
                    this.isCanClick = true;
                    this.roleMoveTween(this.role.position)
                }, this.failClip.getDuration())
            }
        }
        else {
            let angle = this.normalizeAngle(this.role.angle);
            const _angle = this.normalizeAngle(this.objective.angle);
            // if (angle > 0) angle = Math.floor(angle);


            const isInRange =
                // 正常区间判断
                Math.abs(angle - _angle) <= this.rotation_offset ||
                // 处理跨360度临界点的情况
                Math.abs(angle - _angle - 360) <= this.rotation_offset ||
                Math.abs(angle - _angle + 360) <= this.rotation_offset;

            console.log(angle, "偏移量：", this.rotation_offset);

            if (isInRange) {
                this.ovo();
            }
            else {
                this.failIcon.active = true;
                AudioManager.Instance.PlaySFX(this.failClip);
                this.scheduleOnce(() => {
                    this.failIcon.active = false;
                    this.isCanClick = true;
                    this.roleRotationTween(this.role.angle);
                }, this.failClip.getDuration());
            }
        }
    }

    private normalizeAngle(angle: number): number {
        return ((angle % 360) + 360) % 360; // 将角度值标准化到 [0, 360) 范围内
    }

    ovo() {
        if (this.count % 2 === 0) {
            this.role.setPosition(Vec3.ZERO)
        }
        else {
            this.role.angle = 0;
        }

        tween(this.role)
            .to(0.2, { scale: v3(1.2, 1.2, 1.2) })
            .to(0.2, { scale: v3(1, 1, 1) })
            .start()

        this.rightIcon.active = true;
        AudioManager.Instance.PlaySFX(this.rightClip)
        this.scheduleOnce(() => {
            this.rightIcon.active = false;
            this.isCanClick = true;
            this.count++
            this.initRole()
        }, this.rightClip.getDuration())
    }

}


