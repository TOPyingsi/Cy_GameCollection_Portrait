import { _decorator, Animation, Button, EventTouch, Node, ParticleSystem2D, Prefab, randomRangeInt, sp, Sprite, SpriteFrame, Tween, tween, UIOpacity, v3, Vec3, Widget } from 'cc';
import { SHJCB_UIBase } from './SHJCB_UIBase';
import { SHJCB_MainPanel } from './SHJCB_MainPanel';
import { SHJCB_DataManager } from './SHJCB_DataManager';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { SHJCB_Item } from './SHJCB_Item';
import { SHJCB_LivePanel } from './SHJCB_LivePanel';
import { eventCenter } from './SHJCB_EventCenter';
import { SHJCB_AudioManager } from './SHJCB_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_GamePanel')
export class SHJCB_GamePanel extends SHJCB_UIBase {

    private static instance: SHJCB_GamePanel;
    public static get Instance(): SHJCB_GamePanel {
        return this.instance;
    }

    @property(Sprite)
    bg: Sprite;

    @property(Sprite)
    table: Sprite;

    @property(Sprite)
    timeProcess: Sprite;

    @property(Prefab)
    itemPrefab: Prefab;

    @property(Node)
    process: Node;

    @property(Node)
    request: Node;

    @property(Node)
    requestMubkang: Node;

    @property(Node)
    mubkang: Node;

    @property(Node)
    finishMubkang: Node;

    @property(Node)
    fan: Node;

    @property(Node)
    top2: Node;

    @property(Node)
    content: Node;

    @property(Node)
    next: Node;

    @property(Node)
    touch: Node;

    @property(Node)
    tutorials: Node;

    @property([SpriteFrame])
    processSfs: SpriteFrame[] = [];

    isRequest = false;
    isAni = false;
    isTouch = false;
    step = 0;
    clickTime = 0;

    protected onLoad(): void {
        super.onLoad();
        SHJCB_GamePanel.instance = this;
        this._InitTouch();
    }

    _InitTouch() {
        this.touch.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        this.touch.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.touch.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.touch.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
    }

    TouchStart(event: EventTouch) {
        if (!this.timeProcess.node.parent.active) return;
        this.isTouch = true;
        let pos = v3(event.getUILocation().x, event.getUILocation().y);
        if (this.step == 2) {
            SHJCB_AudioManager.Instance._PLayLoopSound(47);
            this.tutorials.children[0].active = false;
            this.fan.setWorldPosition(pos);
            this.fan.getComponent(Animation).play();
            let particles = this.fan.children[0].getComponentsInChildren(ParticleSystem2D);
            for (let i = 0; i < particles.length; i++) {
                const element = particles[i];
                element.resetSystem();
            }
        }
        else if (this.step == 5) {
            SHJCB_AudioManager.Instance._PLayLoopSound(48);
            this.tutorials.children[1].active = false;
            this.top2.setWorldPosition(v3(pos.x, this.top2.getWorldPosition().y));
            let particles = this.top2.children[SHJCB_DataManager.curMubkang[3] - 1].getComponentsInChildren(ParticleSystem2D);
            for (let i = 0; i < particles.length; i++) {
                const element = particles[i];
                element.resetSystem();
            }
        }
    }

    TouchMove(event: EventTouch) {
        if (!this.timeProcess.node.parent.active) return;
        let pos = v3(event.getUILocation().x, event.getUILocation().y);
        if (this.step == 2) this.fan.setWorldPosition(pos);
        else if (this.step == 5) this.top2.setWorldPosition(v3(pos.x, this.top2.getWorldPosition().y));
    }

    TouchEnd(event: EventTouch) {
        if (!this.timeProcess.node.parent.active) return;
        SHJCB_AudioManager.Instance._StopLoopSound();
        this.isTouch = false;
        if (this.step == 2) {
            this.fan.getComponent(Animation).stop();
            let particles = this.fan.children[0].getComponentsInChildren(ParticleSystem2D);
            for (let i = 0; i < particles.length; i++) {
                const element = particles[i];
                element.stopSystem();
            }
        }
        else if (this.step == 5) {
            let particles = this.top2.children[SHJCB_DataManager.curMubkang[3] - 1].getComponentsInChildren(ParticleSystem2D);
            for (let i = 0; i < particles.length; i++) {
                const element = particles[i];
                element.stopSystem();
            }
        }
    }

    protected _InitData(): void {
        SHJCB_AudioManager.Instance._PlayCookMusic();
        this.bg.spriteFrame = SHJCB_MainPanel.Instance.bg.spriteFrame;
        this.table.spriteFrame = SHJCB_MainPanel.Instance.table.spriteFrame;
        SHJCB_DataManager.curMubkang = [-1, -1, -1, -1];
        this.timeProcess.node.parent.active = false;
        for (let i = 0; i < this.tutorials.children.length; i++) {
            const element = this.tutorials.children[i];
            element.active = false;
        }
        for (let i = 0; i < this.mubkang.children.length; i++) {
            const element = this.mubkang.children[i];
            element.active = false;
        }
        this.mubkang.angle = 0;
        this.mubkang.setPosition(v3(0, -200));
        this.mubkang.active = true;
        this.finishMubkang.active = false;
        this.finishMubkang.parent.active = false;
        this.finishMubkang.children[0].getComponent(UIOpacity).opacity = 0;
        this.finishMubkang.children[1].active = false;
        this.top2.getComponent(Sprite).spriteFrame = null;
        this.step = 0;
        this.content.parent.parent.getComponent(Widget).bottom = 200;
        this._InitRequest();
        this._InitStep();
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    _InitRequest() {
        if (SHJCB_DataManager.chatSfs) this.request.children[3].getComponent(Sprite).spriteFrame = SHJCB_DataManager.chatSfs[SHJCB_DataManager.requestViewer];
        else eventCenter.once("chatSfs", () => { this.request.children[3].getComponent(Sprite).spriteFrame = SHJCB_DataManager.chatSfs[SHJCB_DataManager.requestViewer]; }, this);
        this.requestMubkang.getComponent(Sprite).spriteFrame = SHJCB_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${SHJCB_DataManager.requestMubkang[0] + 1}-${SHJCB_DataManager.jellyName[SHJCB_DataManager.requestMubkang[1]]}_1`) return value; });
        this.requestMubkang.children[0].getComponent(Sprite).spriteFrame = SHJCB_DataManager.requestMubkang[3] == 0 ? null : SHJCB_DataManager.gameTop2.find((value, index, obj) => { if (value.name == `blink${SHJCB_DataManager.requestMubkang[3]}`) return value; });
        this.requestMubkang.children[1].getComponent(Sprite).spriteFrame = SHJCB_DataManager.top1.find((value, index, obj) => { if (value.name == SHJCB_DataManager.top1Name[SHJCB_DataManager.requestMubkang[2]]) return value; });
    }

    protected update(dt: number): void {
        if (this.isTouch && (this.step == 2 || this.step == 5) && this.timeProcess.node.parent.active) {
            this.timeProcess.fillRange += dt / 5;
            if (this.step == 5) this.finishMubkang.children[0].getComponent(UIOpacity).opacity = 255 * this.timeProcess.fillRange;
            if (this.timeProcess.fillRange >= 1) {
                this.isTouch = false;
                this.timeProcess.fillRange = 1;
                this.step++;
                this._InitStep();
                SHJCB_AudioManager.Instance._StopLoopSound();
            }
        }
    }

    OpenRequest() {
        if (this.isRequest) return;
        this.isRequest = true;
        this.request.parent.active = true;
        Tween.stopAllByTarget(this.request);
        tween(this.request)
            .to(0.5, { scale: Vec3.ONE }, { easing: EasingType.backOut })
            .call(() => { this.isRequest = false; })
            .start();
    }

    CloseRequest() {
        if (this.isRequest) return;
        this.isRequest = true;
        Tween.stopAllByTarget(this.request);
        tween(this.request)
            .to(0.5, { scale: Vec3.ZERO }, { easing: EasingType.backIn })
            .call(() => {
                this.request.parent.active = false;
                this.isRequest = false;
            })
            .start();
    }

    _InitStep() {
        this.next.active = false;
        for (let i = 0; i < this.process.children.length; i++) {
            const element = this.process.children[i].getComponent(Sprite);
            element.spriteFrame = this.processSfs[i > this.step ? 0 : i == this.step ? 1 : 2];
        }
        switch (this.step) {
            case 0:
                for (let i = 0; i < this.mubkang.children.length; i++) {
                    const element = this.mubkang.children[i];
                    element.active = true;
                    element.getComponent(sp.Skeleton).animation = "close";
                    element.active = false;
                }
                let num = 0;
                let items = SHJCB_DataManager.unlockItemLevels[this.step];
                for (let j = 0; j < items.length; j++) {
                    let item = this.content.children[num];
                    if (!item) item = PoolManager.GetNodeByPrefab(this.itemPrefab, this.content);
                    item.getComponent(SHJCB_Item)._Init(this.step, j);
                    num++;
                }
                for (let i = items.length; i < this.content.children.length; i++) {
                    const element = this.content.children[i];
                    element.active = false;
                }
                break;
            case 1:
                this.isAni = true;
                tween(this.content.parent.parent.getComponent(Widget))
                    .by(0.5, { bottom: -500 }, { easing: EasingType.backIn })
                    .call(() => {
                        let num = 0;
                        items = SHJCB_DataManager.unlockItemLevels[this.step];
                        for (let j = 0; j < items.length; j++) {
                            let item = this.content.children[num];
                            if (!item) item = PoolManager.GetNodeByPrefab(this.itemPrefab, this.content);
                            item.getComponent(SHJCB_Item)._Init(this.step, j);
                            num++;
                        }
                        for (let i = items.length; i < this.content.children.length; i++) {
                            const element = this.content.children[i];
                            element.active = false;
                        }
                    })
                    .by(0.5, { bottom: 500 }, { easing: EasingType.backOut })
                    .call(() => { this.isAni = false; })
                    .start();
                break;
            case 2:
                this.isAni = true;
                SHJCB_AudioManager.Instance._PlaySound(50);
                let data = SHJCB_DataManager.curMubkang;
                let spine = this.mubkang.children[1].getComponent(sp.Skeleton);
                spine.setSkin(`color/${SHJCB_DataManager.jellyName[data[1]]}`);
                spine.animation = `mold${data[0] + 1}`;
                spine = this.mubkang.children[2].getComponent(sp.Skeleton);
                spine.node.active = true;
                spine.setSkin(`mold${data[0] + 1}/mold${data[0] + 1}-${SHJCB_DataManager.jellyName[data[1]]}`);
                spine.animation = `mold${data[0] + 1}`;
                let time = spine.findAnimation(`mold${data[0] + 1}`).duration;
                this.scheduleOnce(() => {
                    this.timeProcess.node.parent.active = true;
                    this.timeProcess.fillRange = 0;
                    this.tutorials.children[0].active = true;
                    tween(this.fan)
                        .to(0.5, { position: v3(200, -500) }, { easing: EasingType.backOut })
                        .call(() => { this.isAni = false; })
                        .start();
                }, time);
                tween(this.content.parent.parent.getComponent(Widget))
                    .by(0.5, { bottom: -500 }, { easing: EasingType.backIn })
                    .start();
                break;
            case 3:
                this.isAni = true;
                this.fan.getComponent(Animation).stop();
                let particles = this.fan.children[0].getComponentsInChildren(ParticleSystem2D);
                for (let i = 0; i < particles.length; i++) {
                    const element = particles[i];
                    element.stopSystem();
                }
                spine = this.mubkang.children[2].getComponent(sp.Skeleton);
                spine.animation = "transform";
                time = spine.findAnimation("transform").duration;
                let x = this;
                this.scheduleOnce(() => {
                    SHJCB_MainPanel.Instance._Fade(() => {
                        x.isAni = false;
                        x.fan.setPosition(v3(1000, -500));
                        x.timeProcess.node.parent.active = false;
                        x.mubkang.children[1].active = false;
                        x.mubkang.angle = 180;
                        x.mubkang.setPosition(v3(0, 300));
                        x.mubkang.getComponent(Button).enabled = true;
                        x.clickTime = 0;
                        x.finishMubkang.parent.active = true;
                        x.tutorials.children[1].active = true;
                    })
                }, time);
                break;
            case 4:
                this.isAni = true;
                this.mubkang.active = false;
                num = 0;
                items = SHJCB_DataManager.unlockItemLevels[2];
                for (let j = 0; j < items.length; j++) {
                    let item = this.content.children[num];
                    if (!item) item = PoolManager.GetNodeByPrefab(this.itemPrefab, this.content);
                    item.getComponent(SHJCB_Item)._Init(2, j);
                    num++;
                }
                for (let i = items.length; i < this.content.children.length; i++) {
                    const element = this.content.children[i];
                    element.active = false;
                }
                tween(this.content.parent.parent.getComponent(Widget))
                    .by(0.5, { bottom: 500 }, { easing: EasingType.backOut })
                    .call(() => { this.isAni = false; })
                    .start();
                break;
            case 5:
                this.isAni = true;
                tween(this.content.parent.parent.getComponent(Widget))
                    .by(0.5, { bottom: -500 }, { easing: EasingType.backIn })
                    .call(() => {
                        let num = 0;
                        items = SHJCB_DataManager.unlockItemLevels[3];
                        for (let j = 0; j < items.length; j++) {
                            let item = this.content.children[num];
                            if (!item) item = PoolManager.GetNodeByPrefab(this.itemPrefab, this.content);
                            item.getComponent(SHJCB_Item)._Init(3, j);
                            num++;
                        }
                        for (let i = items.length; i < this.content.children.length; i++) {
                            const element = this.content.children[i];
                            element.active = false;
                        }
                    })
                    .by(0.5, { bottom: 500 }, { easing: EasingType.backOut })
                    .call(() => { this.isAni = false; })
                    .start();
                break;
            case 6:
                SHJCB_MainPanel.Instance.completePanel.active = true;
                particles = this.top2.children[SHJCB_DataManager.curMubkang[3] - 1]?.getComponentsInChildren(ParticleSystem2D);
                if (particles) for (let i = 0; i < particles.length; i++) {
                    const element = particles[i];
                    element.stopSystem();
                }
                break;
        }
    }

    NextStep() {
        if (this.step == 5 && SHJCB_DataManager.curMubkang[3] != 0) {
            this.next.active = false;
            this.isAni = true;
            tween(this.content.parent.parent.getComponent(Widget))
                .by(0.5, { bottom: -500 }, { easing: EasingType.backIn })
                .call(() => {
                    this.isAni = false;
                    this.timeProcess.fillRange = 0;
                    this.timeProcess.node.parent.active = true;
                    this.tutorials.children[2].active = true;
                })
                .start();
        }
        else {
            this.step++;
            this._InitStep();
        }
    }

    Click() {
        if (this.clickTime > 2) return;
        this.tutorials.children[1].active = false;
        this.clickTime++;
        if (this.clickTime > 2) {
            this.mubkang.children[2].active = false;
            let data = SHJCB_DataManager.curMubkang;
            this.finishMubkang.setPosition(v3(0, 300));
            this.finishMubkang.getComponent(Sprite).spriteFrame = SHJCB_DataManager.mukbangSfs.find((value, index, obj) => { if (value.name == `mold${data[0] + 1}-${SHJCB_DataManager.jellyName[data[1]]}_1`) return value; });
            this.finishMubkang.getComponent(UIOpacity).opacity = 0;
            this.finishMubkang.active = true;
            tween(this.finishMubkang)
                .to(0.5, { position: v3(0, 100) }, { easing: EasingType.circIn })
                .call(() => { SHJCB_AudioManager.Instance._PlaySound(51); })
                .to(0.1, { scale: v3(0.8, 1.2, 1) })
                .to(0.1, { scale: Vec3.ONE })
                .call(() => { this.NextStep(); }).start();
            tween(this.finishMubkang.getComponent(UIOpacity))
                .to(0.1, { opacity: 255 }).start();
        }
    }

}