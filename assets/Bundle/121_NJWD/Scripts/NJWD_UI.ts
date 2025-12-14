import { _decorator, Animation, Component, director, Event, EventTouch, Label, Layout, Node, RigidBody, size, Size, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v3, Vec3, Widget } from 'cc';
import { NJWD_GameManager } from './NJWD_GameManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('NJWD_UI')
export class NJWD_UI extends Component {

    private static instance: NJWD_UI;
    public static get Instance(): NJWD_UI {
        return this.instance;
    }

    @property(Node)
    panel: Node;

    @property(Node)
    ammos: Node;

    @property(Node)
    shoot: Node;

    @property(Node)
    move: Node;

    @property(Node)
    switchBan: Node;

    @property(Node)
    fade: Node;

    @property(Node)
    hit: Node;

    @property(Node)
    winPanel: Node;

    @property(Node)
    failPanel: Node;

    @property(Node)
    actPanel: Node;

    @property(Node)
    acts: Node;

    @property([SpriteFrame])
    hitSfs: SpriteFrame[] = [];

    time = 5;
    ammo = 3;
    isHit = false;

    protected onLoad(): void {
        NJWD_UI.instance = this;
        ProjectEventManager.emit(ProjectEvent.游戏开始, "狙击外星人-你狙我躲");
    }

    protected start(): void {
    }

    protected update(dt: number): void {
    }

    ReadyShoot() {
        this.time = 5;
        this.move.active = false;
        this.panel.active = true;
        this.panel.children[0].active = true;
        this.panel.children[1].active = false;
        this.panel.children[0].children[0].getComponent(Label).string = "敌人正在躲藏……";
        this.panel.children[0].children[1].getComponent(Label).string = this.time.toString();
        this.schedule(() => {
            this.time--;
            this.panel.children[0].children[1].getComponent(Label).string = this.time.toString();
            if (this.time == 0) this.InShoot();
        }, 1, 4);
    }

    InShoot() {
        this.isHit = false;
        this.panel.children[0].active = false;
        this.panel.children[1].active = true;
        this.ammo = 3;
        NJWD_GameManager.Instance.particles[1].stopEmitting();
        for (let i = 0; i < this.ammos.children.length; i++) {
            const element = this.ammos.children[i].children[0];
            element.setScale(Vec3.ONE);
            element.getComponent(UIOpacity).opacity = 255;
        }
        this.shoot.active = true;
        NJWD_GameManager.Instance.InShoot();
    }

    Shoot() {
        this.ammo--;
        let bullet = this.ammos.children[this.ammo].children[0];
        tween(bullet)
            .to(0.25, { scale: v3(1.2, 1.2, 1.2) })
            .start();
        tween(bullet.getComponent(UIOpacity))
            .to(0.5, { opacity: 0 })
            .start();
        if (this.ammo == 0 && !this.isHit) this.scheduleOnce(() => { this.ShootEnd(); }, 0.5);
        if (this.shoot.children[2].active) this.shoot.children[2].active = false;
    }

    EnemyShoot() {
        this.ammo--;
        let bullet = this.ammos.children[this.ammo].children[0];
        tween(bullet)
            .to(0.25, { scale: v3(1.2, 1.2, 1.2) })
            .start();
        tween(bullet.getComponent(UIOpacity))
            .to(0.5, { opacity: 0 })
            .start();
        if (this.ammo == 0 && !this.isHit) this.scheduleOnce(() => { this.EnemyShootEnd(); }, 0.5);
        else if (!this.isHit) this.scheduleOnce(() => { NJWD_GameManager.Instance.EnemyInShoot(); }, 2);
    }

    ShowHit(damage: number) {
        let num = damage == 100 ? 0 : damage == 30 ? 1 : 2;
        this.hit.getComponent(Sprite).spriteFrame = this.hitSfs[num];
        this.hit.setScale(v3(2, 2, 1));
        tween(this.hit)
            .to(0.25, { scale: Vec3.ONE })
            .start();
        tween(this.hit.getComponent(UIOpacity))
            .to(0.25, { opacity: 255 })
            .delay(0.5)
            .to(0.25, { opacity: 0 })
            .start();
    }

    ShootEnd() {
        this.switchBan.active = true;
        this.switchBan.children[0].getComponent(Label).string = this.isHit ? "击中对手，切换射击方" : "未命中，切换射击方";
        this.switchBan.setPosition(v3(-1500, 0));
        tween(this.switchBan)
            .to(0.5, { position: Vec3.ZERO })
            .delay(1)
            .to(0.5, { position: v3(1500, 0) })
            .delay(0.5)
            .call(() => {
                this.Fade(() => { NJWD_GameManager.Instance.EnemyReadyShoot(); })
            })
            .start();
    }

    EnemyShootEnd() {
        this.switchBan.active = true;
        this.switchBan.children[0].getComponent(Label).string = this.isHit ? "击中对手，切换射击方" : "未命中，切换射击方";
        this.switchBan.setPosition(v3(-1500, 0));
        tween(this.switchBan)
            .to(0.5, { position: Vec3.ZERO })
            .delay(1)
            .to(0.5, { position: v3(1500, 0) })
            .delay(0.5)
            .call(() => {
                this.Fade(() => { NJWD_GameManager.Instance.ReadyShoot(); })
            })
            .start();
    }

    Fade(call: Function) {
        this.fade.active = true;
        tween(this.fade.getComponent(UITransform))
            .to(0.5, { contentSize: Size.ZERO })
            .call(() => {
                let arr = [...NJWD_GameManager.Instance.brokenBricks.children];
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    PoolManager.PutNode(element);
                }
                call();
            })
            .delay(0.5)
            .to(0.5, { contentSize: size(3000, 3000) })
            .call(() => { this.fade.active = false; })
            .start();
    }

    EnemyReadyShoot() {
        this.time = 5;
        this.shoot.active = false;
        this.move.active = true;
        this.panel.active = true;
        this.panel.children[0].active = true;
        this.panel.children[1].active = false;
        this.panel.children[0].children[0].getComponent(Label).string = "敌人即将射击……";
        this.panel.children[0].children[1].getComponent(Label).string = this.time.toString();
        this.schedule(() => {
            this.time--;
            this.panel.children[0].children[1].getComponent(Label).string = this.time.toString();
            if (this.time == 0) this.EnemyInShoot();
        }, 1, 4);
    }

    EnemyInShoot() {
        this.isHit = false;
        this.panel.children[0].active = false;
        this.panel.children[1].active = true;
        this.ammo = 3;
        NJWD_GameManager.Instance.particles[0].stopEmitting();
        for (let i = 0; i < this.ammos.children.length; i++) {
            const element = this.ammos.children[i].children[0];
            element.setScale(Vec3.ONE);
            element.getComponent(UIOpacity).opacity = 255;
        }
        this.scheduleOnce(() => { NJWD_GameManager.Instance.EnemyInShoot(); }, 2);
    }

    Win() {
        this.winPanel.active = true;
        ProjectEventManager.emit(ProjectEvent.游戏结束, "狙击外星人-你狙我躲");
    }

    Fail() {
        this.failPanel.active = true;
        ProjectEventManager.emit(ProjectEvent.游戏结束, "狙击外星人-你狙我躲");
    }

    Reset() {
        UIManager.ShowLoadingPanel("NJWD_Match");
    }

    Back() {
        UIManager.ShowPanel(Panel.ReturnPanel);
    }

    VideoFind() {
        if (NJWD_GameManager.Instance.isUfo) return UIManager.ShowTip("已经定位敌人！");
        Banner.Instance.ShowVideoAd(() => { NJWD_GameManager.Instance.UFOFind(); });
    }

    ShowActPanel() {
        this.actPanel.active = true;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "狙击外星人-你狙我躲");
    }

    CloseActPanel() {
        this.actPanel.active = false;
    }

    VideoAct() {
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            x.acts.children[2].active = true;
            x.acts.children[4].active = true;
            x.acts.children[6].active = true;
            x.acts.getComponent(Layout).spacingX = 0;
            x.CloseActPanel();
        });
    }

}
