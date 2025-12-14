import { _decorator, Animation, AudioClip, AudioSource, Component, director, EventTouch, Material, Node, SkinnedMeshRenderer, tween, Tween, UITransform, v3, Vec3 } from 'cc';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { Panel, UIManager } from '../../../Scripts/Framework/Managers/UIManager';
const { ccclass, property } = _decorator;

@ccclass('TalkingLarry_GameManager')
export class TalkingLarry_GameManager extends Component {

    private static instance: TalkingLarry_GameManager;
    public static get Instance() {
        return this.instance;
    }

    @property([AudioClip])
    clips: AudioClip[] = [];

    @property([Material])
    materials: Material[] = [];

    @property(Animation)
    ani: Animation;

    @property(AudioSource)
    audio: AudioSource;

    @property(Node)
    piano: Node;

    @property(Node)
    boom: Node;

    @property(Node)
    lightning: Node;

    @property(Node)
    guozi: Node;

    pianoNum = -1;
    isTouch = false;
    dontCancel = false;

    protected onLoad(): void {
        TalkingLarry_GameManager.instance = this;
    }

    start() {
        ProjectEventManager.emit(ProjectEvent.游戏开始, "会说话的拉里鸟");
        this.piano.on(Node.EventType.TOUCH_START, this.Touch, this);
        this.piano.on(Node.EventType.TOUCH_MOVE, this.Touch, this);
        this.piano.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
    }

    update(deltaTime: number) {

    }

    Touch(event: EventTouch) {
        if (this.dontCancel) return;
        var pos = event.getUILocation();
        var num = 0;
        for (let i = 0; i < this.piano.children.length; i++) {
            const element = this.piano.children[i];
            if (element.getComponent(UITransform).getBoundingBoxToWorld().contains(pos)) {
                num = i;
                break;
            }
        }
        console.log(num)
        if (num == this.pianoNum) return;
        if (!this.isTouch) this.isTouch = true;
        this.pianoNum = num;
        this.Piano();
    }

    TouchEnd() {
        this.isTouch = false;
        this.pianoNum = -1;
    }

    Piano() {
        this.ani?.play("说话");
        this.audio.stop();
        this.audio.clip = this.clips[6];
        this.audio.play();
    }

    Boom() {
        this.dontCancel = true;
        this.ani.node.active = false;
        Tween.stopAllByTarget(this.boom);
        this.boom.setScale(Vec3.ONE);
        tween(this.boom)
            .to(1, { scale: Vec3.ZERO })
            .call(() => {
                this.Revive();
            })
            .start();
        this.audio.stop();
        this.audio.clip = this.clips[0];
        this.audio.play();
    }

    Revive() {
        var renderer = this.ani.node.children[0].getComponent(SkinnedMeshRenderer);
        renderer.material = this.materials[0];
        var model = this.ani.node;
        model.setPosition(v3(0.047, -5, -10));
        model.active = true;
        tween(model)
            .to(2, { position: v3(0.047, -1.177, -6.519) })
            .start();
        this.ani?.play("起飞");
        this.audio.stop();
        this.audio.clip = this.clips[5];
        this.audio.play();
    }

    Lightning() {
        if (this.dontCancel) return;
        this.dontCancel = true;
        this.lightning.active = true;
        this.scheduleOnce(() => {
            this.lightning.active = false;
        }, 0.1);
        var renderer = this.ani.node.children[0].getComponent(SkinnedMeshRenderer);
        renderer.material = this.materials[1];
        this.ani?.play("电击");
        this.audio.stop();
        this.audio.clip = this.clips[2];
        this.audio.play();
    }

    Feed() {
        if (this.dontCancel) return;
        this.dontCancel = true;
        tween(this.guozi)
            .to(0.25, { position: v3(-0.34, -0.34, -3.5) })
            .delay(1.1)
            .to(0.25, { position: v3(-3, -0.34, -3.5) })
            .start();
        this.ani?.play("吃");
        this.audio.stop();
        this.audio.clip = this.clips[1];
        this.audio.play();
    }

    Thank() {
        if (this.dontCancel) return;
        this.dontCancel = true;
        this.ani?.play("致谢");
        this.audio.stop();
        this.audio.clip = this.clips[7];
        this.audio.play();
    }

    Point() {
        if (this.dontCancel) return;
        this.dontCancel = true;
        this.ani?.play("生气");
        this.audio.stop();
        this.audio.clip = this.clips[3];
        this.audio.play();
    }

    PointHead() {
        if (this.dontCancel) return;
        this.dontCancel = true;
        this.ani?.play("转圈");
        this.audio.stop();
        this.audio.clip = this.clips[4];
        this.audio.play();
    }

    Back() {
        director.loadScene(GameManager.StartScene);
        UIManager.ShowPanel(Panel.ReturnPanel);
    }

}


