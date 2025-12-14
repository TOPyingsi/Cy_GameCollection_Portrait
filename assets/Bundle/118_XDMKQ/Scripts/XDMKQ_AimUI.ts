import { _decorator, Component, find, Node, tween, Tween, Vec3 } from 'cc';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_AimUI')
export class XDMKQ_AimUI extends Component {

    @property(Node)
    Sights: Node[] = [];

    @property
    Enlargement: number = 0.2;

    @property
    Reduce: number = 0.3;

    @property
    HitShowTime: number = 0.5;

    // 初始位置
    InitPos: Vec3[] = [
        new Vec3(0, 50, 0),
        new Vec3(-50, 0, 0),
        new Vec3(0, -50, 0),
        new Vec3(50, 0, 0),
    ];

    // 移动位置
    MovePos: Vec3[] = [
        new Vec3(0, 80, 0),
        new Vec3(-80, 0, 0),
        new Vec3(0, -80, 0),
        new Vec3(80, 0, 0),
    ];

    // 移动位置
    ShakePos: Vec3[] = [
        new Vec3(0, 87, 0),
        new Vec3(-87, 0, 0),
        new Vec3(0, -87, 0),
        new Vec3(87, 0, 0),
    ];

    Hit: Node = null;

    protected onLoad(): void {
        this.Hit = find("Hit", this.node);
    }

    protected onEnable(): void {
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_SIGHT_ENLARGEMENT, this.SightEnlargement, this);
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_SIGHT_REDUCE, this.SightReduce, this);
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_HIT_SHOW, this.ShowHit, this);
        XDMKQ_EventManager.On(XDMKQ_MyEvent.XDMKQ_AIM_SHOW, this.Show, this);
    }

    protected onDisable(): void {
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_SIGHT_ENLARGEMENT, this.SightEnlargement, this);
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_SIGHT_REDUCE, this.SightReduce, this);
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_HIT_SHOW, this.ShowHit, this);
        XDMKQ_EventManager.Off(XDMKQ_MyEvent.XDMKQ_AIM_SHOW, this.Show, this);
    }

    Show(show: boolean) {
        this.Sights.forEach(e => e.active = show);
        // this.node.active = show;
    }

    SightEnlargement() {
        for (let i = 0; i < this.Sights.length; i++) {
            Tween.stopAllByTarget(this.Sights[i]);
            tween(this.Sights[i])
                .to(this.Enlargement, { position: this.MovePos[i] }, { easing: 'backOut' })
                .call(() => {
                    tween(this.Sights[i])
                        .to(0.1, { position: this.ShakePos[i] }, { easing: 'backIn' })
                        .to(0.1, { position: this.MovePos[i] }, { easing: 'backOut' })
                        .union()
                        .repeatForever()
                        .start()
                })
                .start()
        }
    }

    SightReduce() {
        for (let i = 0; i < this.Sights.length; i++) {
            Tween.stopAllByTarget(this.Sights[i]);
            tween(this.Sights[i])
                .to(this.Enlargement, { position: this.InitPos[i] }, { easing: 'backIn' })
                .start();
        }
    }

    ShowHit() {
        this.Hit.active = true;
        this.unschedule(this.HideHit)
        this.scheduleOnce(this.HideHit, this.HitShowTime);
    }

    HideHit() {
        this.Hit.active = false;
    }

}


