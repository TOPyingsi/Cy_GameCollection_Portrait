import { _decorator, AudioClip, AudioSource, clamp, Component, director, EventTouch, Label, Node, Prefab, randomRangeInt, Sprite, SpriteFrame, tween, UITransform, v3, Vec2, Vec3 } from 'cc';
import { BZJXL_GameData } from './BZJXL_GameData';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { BZJXL_Point } from './BZJXL_Point';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BZJXL_GameManager')
export class BZJXL_GameManager extends Component {

    @property(Node)
    talkPanel: Node;

    @property(Node)
    startPanel: Node;

    @property(Node)
    gamePanel: Node;

    @property(Node)
    player: Node;

    @property(Node)
    boss: Node;

    @property(Node)
    sword: Node;

    @property(Node)
    winPanel: Node;

    @property(Node)
    failPanel: Node;

    @property(Label)
    pointLabel: Label;

    @property(AudioSource)
    audio: AudioSource;


    @property(Prefab)
    pointPrefab: Prefab;

    @property([SpriteFrame])
    pointSfs: SpriteFrame[] = [];

    @property([SpriteFrame])
    bossSfs: SpriteFrame[] = [];

    @property([AudioClip])
    clips: AudioClip[] = [];

    @property(GamePanel)
    GamePanel: GamePanel;

    @property(Prefab)
    Prefab: Prefab;

    point = 0;
    public get Point(): number {
        return this.point;
    }
    public set Point(value: number) {
        this.point = value;
        this.pointLabel.string = "成长值：" + this.point;
        let num = Math.max(Math.floor(this.point / 12), 0);
        let bool = false;
        for (let i = 0; i < this.player.children[0].children.length; i++) {
            const element = this.player.children[0].children[i];
            if (element.active != (num == i)) bool = true;
            element.active = num == i;
        }
        if (bool) {
            let node = this.player.children[2];
            node.active = true;
            tween(node.getComponent(Sprite))
                .to(0.25, { fillRange: 1 })
                .to(0.25, { fillRange: 0 })
                .call(() => {
                    node.active = false;
                })
                .start();
        }
    }

    round = 0;
    pointNum = 0;
    lastTouch: Vec2;
    swordPos: Vec3;
    isEnd = false;

    protected onLoad(): void {
        this.GamePanel.answerPrefab = this.Prefab;
        this.GamePanel.winStr = "我命由我不由天";
        this.GamePanel.lostStr = "人心中的成见就是一座大山";
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        else this.Init();
    }

    start() {
    }

    Init() {
        this.Talk(BZJXL_GameData.StartStr[0], 0, () => {
            this.startPanel.active = false;
            this.Talk(BZJXL_GameData.StartStr[1], 1, () => { this.Play(); });
        })
        this.TouchInit();
    }

    update(deltaTime: number) {

    }

    TouchInit() {
        this.player.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        this.player.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.player.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.player.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
    }

    SwordInit() {
        this.sword.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        this.sword.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.sword.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.sword.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        this.swordPos = this.sword.getWorldPosition();
    }

    TouchStart(event: EventTouch) {
        let node: Node = event.target;
        if (node == this.player) {
            let pos = v3(event.getUILocation().x, this.player.getWorldPosition().y);
            this.player.setWorldPosition(pos);
        }
        else {
            this.sword.setWorldPosition(v3(event.getUILocation().x, event.getUILocation().y));
        }
    }

    TouchMove(event: EventTouch) {
        let node: Node = event.target;
        if (node == this.player) {
            let pos = v3(event.getUILocation().x, this.player.getWorldPosition().y);
            this.player.setWorldPosition(pos);
        }
        else {
            this.sword.setWorldPosition(v3(event.getUILocation().x, event.getUILocation().y));
        }
    }

    TouchEnd(event: EventTouch) {
        let node: Node = event.target;
        if (node == this.player) {
            let pos = v3(0, this.player.getPosition().y);
            this.player.setPosition(pos);
        }
        else {
            if (this.sword.getComponent(UITransform).getBoundingBoxToWorld().intersects(this.player.getComponent(UITransform).getBoundingBoxToWorld())) {
                this.sword.active = false;
                this.Point += 18;
                this.boss.active = false;
                this.Talk(BZJXL_GameData.EndStr, 16, () => {
                    this.End();
                });
            }
            else this.sword.setWorldPosition(v3(event.getUILocation().x, event.getUILocation().y));
        }
    }

    Talk(str: string, num: number, callback: Function) {
        // this.audio.playOneShot(this.clips[num]);
        AudioManager.Instance.PlaySFX(this.clips[num]);
        this.talkPanel.active = true;
        let label = this.talkPanel.children[0].getComponent(Label);
        label.string = str;
        this.scheduleOnce(() => {
            this.talkPanel.active = false;
            callback();
        }, this.clips[num].getDuration());
    }

    Play() {
        if (this.round == BZJXL_GameData.GameStrs.length) return this.End();
        let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let num = 5;
        while (num > 0) {
            let random = randomRangeInt(0, arr.length);
            if (arr[random] == 0) {
                num--;
                arr[random] = 1;
            }
        }
        this.schedule(() => {
            let way = randomRangeInt(0, 3);
            let point: Node = PoolManager.GetNodeByPrefab(this.pointPrefab, this.gamePanel.children[0].children[2].children[way]);
            point.getComponent(Sprite).spriteFrame = this.pointSfs[arr[num]];
            point.getComponent(BZJXL_Point).point = arr[num] == 1 ? 2 : -2;
            point.setPosition(Vec3.ZERO);
            num++;
            tween(point)
                .to(3, { worldPosition: v3(point.getWorldPosition().x, this.player.getWorldPosition().y + 500) })
                .call(() => {
                    this.pointNum++;
                    if (point.getComponent(UITransform).getBoundingBoxToWorld().intersects(this.player.getComponent(UITransform).getBoundingBoxToWorld())) {
                        PoolManager.PutNode(point);
                        this.Point += point.getComponent(BZJXL_Point).point;
                        this.CheckBoss();
                    }
                    else tween(point)
                        .by(0.5, { position: v3(0, -1000) })
                        .call(() => {
                            PoolManager.PutNode(point);
                            this.CheckBoss();
                        })
                        .start();
                })
                .start();
        }, 1, 9);
        this.round++;
    }

    CheckBoss() {
        let num = this.pointNum % 10;
        if (num == 0) {
            this.boss.setPosition(v3(0, 100));
            let num2 = randomRangeInt(0, 2);
            let num3 = this.pointNum / 10;
            if (num3 == 7) this.SwordInit();
            this.boss.children[0].children[0].getComponent(Sprite).spriteFrame = this.bossSfs[num3 * 2 - 2 + num2];
            this.boss.children[0].children[1].getComponent(Label).string = this.bossSfs[num3 * 2 - 2 + num2].name;
            this.boss.children[1].children[0].getComponent(Sprite).spriteFrame = this.bossSfs[num3 * 2 - 1 - num2];
            this.boss.children[1].children[1].getComponent(Label).string = this.bossSfs[num3 * 2 - 1 - num2].name;
            this.boss.active = true;
            tween(this.boss)
                .to(3, { worldPosition: v3(this.boss.getWorldPosition().x, this.player.getWorldPosition().y + 500) })
                .call(() => {
                    if (!this.sword.active) return;
                    let num4 = -2;
                    if (this.boss.children[0].getComponent(UITransform).getBoundingBoxToWorld().intersects(this.player.getComponent(UITransform).getBoundingBoxToWorld()) && this.player.position.x <= 0) {
                        num4 = num2 == 0 ? 2 : -2;
                    }
                    else if (this.boss.children[1].getComponent(UITransform).getBoundingBoxToWorld().intersects(this.player.getComponent(UITransform).getBoundingBoxToWorld()) && this.player.position.x > 0) {
                        num4 = num2 == 0 ? -2 : 2;
                    }
                    this.Point += num4;
                    this.Talk(BZJXL_GameData.GameStrs[num3 - 1][num4 == 2 ? 0 : 1], num3 * 2 + (num4 == 2 ? 0 : 1), () => {
                        this.Play();
                    });
                    this.boss.active = false;
                })
                .start();
        }
    }

    End() {
        if (this.Point < 100) this.Fail();
        else this.Win();
    }

    Win() {
        this.winPanel.active = true;
        this.Talk(BZJXL_GameData.WinStr, 17, () => {
            if (this.isEnd) return;
            console.log("Victory");
            this.isEnd = true;
            this.GamePanel.Win();
        })
    }

    Fail() {
        let player = this.failPanel.children[0].children[1];
        let num = clamp(Math.floor(this.Point / 12), 0, 7);
        player.children[num].active = true;
        this.failPanel.active = true;
        this.Talk(BZJXL_GameData.FailStr[0], 18, () => {
            this.Talk(BZJXL_GameData.FailStr[1], 19, () => {
                if (this.isEnd) return;
                this.failPanel.children[0].children[4].active = true;
                console.log("Fail");
                this.isEnd = true;
                this.GamePanel.Lost();
            })
        })
    }

}


