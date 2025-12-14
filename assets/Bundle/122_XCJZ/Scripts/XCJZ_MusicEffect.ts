import { _decorator, Component, find, Node, ParticleSystem2D, Sprite, tween, Tween } from 'cc';
import { XCJZ_EventManager, XCJZ_MyEvent } from './XCJZ_EventManager';
const { ccclass, property } = _decorator;

@ccclass('XCJZ_MusicEffect')
export class XCJZ_MusicEffect extends Component {

    @property
    Drution: number = 0.5;

    Lamplight: Node = null;
    Items: Sprite[] = [];
    Particle: ParticleSystem2D = null;

    private _timer: number = 0;
    private _isPause: boolean = true;
    protected onLoad(): void {
        this.Lamplight = find("Lamplight", this.node);
        this.Particle = find("MusicParticle/Particle2D", this.node).getComponent(ParticleSystem2D);

        find("SpriteEffect", this.node).children.forEach(child => {
            if (child.getComponent(Sprite)) this.Items.push(child.getComponent(Sprite));
        });
    }

    protected onEnable(): void {
        XCJZ_EventManager.On(XCJZ_MyEvent.XCJZ_MUSIC_PLAY, this.Play, this);
        XCJZ_EventManager.On(XCJZ_MyEvent.XCJZ_MUSIC_PAUSE, this.Pause, this);
    }

    protected onDisable(): void {
        XCJZ_EventManager.Off(XCJZ_MyEvent.XCJZ_MUSIC_PLAY, this.Play, this);
        XCJZ_EventManager.Off(XCJZ_MyEvent.XCJZ_MUSIC_PAUSE, this.Pause, this);
    }

    protected update(dt: number): void {
        if (this._isPause) return;
        this._timer += dt;
        if (this._timer > this.Drution) {
            this.Reset();
        }
    }

    Play() {
        this.Reset();
        this.ShowLight();
    }

    Reset() {
        this._isPause = false;
        this._timer = 0;
        if (this.Particle.stopped) this.Particle.resetSystem();
        this.Items.forEach(item => {
            Tween.stopAllByTarget(item);
            tween(item)
                .to(this.Drution, { fillRange: Math.random() }, { easing: `sineInOut` })
                .start();
        });
    }

    Pause() {
        this._isPause = true;
        this._timer = 0;
        this.Particle.stopSystem();
        this.Items.forEach(item => {
            Tween.stopAllByTarget(item);
            tween(item)
                .to(this.Drution, { fillRange: 0 }, { easing: `sineInOut` })
                .start();
        });
    }

    ShowLight() {
        this.Lamplight.active = !this.Lamplight.active;
        this.scheduleOnce(() => {
            if (this._isPause) {
                this.Lamplight.active = false;
                return;
            }
            this.ShowLight();
        }, Math.random() * 0.3 + 0.1);
    }

    // CloseLight() {
    //     this.Lamplight.active = false;
    // }
}


