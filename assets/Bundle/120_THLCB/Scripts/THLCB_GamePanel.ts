import { _decorator, Animation, clamp, EventTouch, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame, Tween, tween, UIOpacity, UITransform, v3, Vec3, Widget } from 'cc';
import { THLCB_UIBase } from './THLCB_UIBase';
import { THLCB_MainPanel } from './THLCB_MainPanel';
import { THLCB_DataManager } from './THLCB_DataManager';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { THLCB_Item } from './THLCB_Item';
import { eventCenter } from './THLCB_EventCenter';
import { THLCB_AudioManager } from './THLCB_AudioManager';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('THLCB_GamePanel')
export class THLCB_GamePanel extends THLCB_UIBase {

    private static instance: THLCB_GamePanel;
    public static get Instance(): THLCB_GamePanel {
        return this.instance;
    }

    @property(Sprite)
    bg: Sprite;

    @property(Sprite)
    table: Sprite;

    @property(Label)
    potLabel: Label;

    @property(Prefab)
    itemPrefab: Prefab;

    @property(Node)
    request: Node;

    @property(Node)
    requestThl: Node;

    @property(Node)
    thl: Node;

    @property(Node)
    content: Node;

    @property(Node)
    touch: Node;

    @property(Node)
    potPanel: Node;

    @property(Node)
    sugar: Node;

    @property(Node)
    water: Node;

    @property(Node)
    pot: Node;

    @property(Node)
    potThl: Node;

    @property(Node)
    potBtn: Node;

    @property(Node)
    fire: Node;

    @property([SpriteFrame])
    processSfs: SpriteFrame[] = [];

    isRequest = false;
    isAni = false;
    touchTarget: Node;
    step = 0;
    potStep = 0;
    clickTime = 0;
    itemNum = 0;
    thlSugar = [0, 0, 0, 0];

    protected onLoad(): void {
        super.onLoad();
        THLCB_GamePanel.instance = this;
        this._InitTouch();
    }

    protected update(dt: number): void {
        if (this.touchTarget == this.sugar) {
            if (this.potStep != 0) return;
            let sprite = this.pot.children[0].getComponent(Sprite);
            if (sprite.fillRange < 1) {
                sprite.fillRange += dt / 4;
                if (sprite.fillRange >= 1) {
                    this.touchTarget = null;
                    this.sugar.active = false;
                    this.potLabel.string = "请加水";
                    this.potStep++;
                    tween(this.water)
                        .to(0.5, { scale: v3(1.1, 1.1, 1.1) })
                        .to(0.5, { scale: Vec3.ONE })
                        .union().repeatForever().start();
                    THLCB_AudioManager.Instance._StopLoopSound();
                }
            }
        }
        else if (this.touchTarget == this.water) {
            if (this.potStep != 1) return;
            let sprite = this.pot.children[1].getComponent(Sprite);
            if (sprite.fillRange < 1) {
                sprite.fillRange += dt / 2;
                if (sprite.fillRange >= 1) {
                    this.touchTarget = null;
                    this.water.active = false;
                    this.potLabel.string = "请点火";
                    this.potStep++;
                    tween(this.potBtn)
                        .to(0.5, { scale: v3(1.1, 1.1, 1.1) })
                        .to(0.5, { scale: Vec3.ONE })
                        .union().repeatForever().start();
                    THLCB_AudioManager.Instance._StopLoopSound();
                }
            }
        }
        else if (this.fire.active) {
            if (this.potStep != 2) return;
            let opacity = this.pot.children[2].getComponent(UIOpacity);
            if (opacity.opacity < 255) {
                opacity.opacity++;
            }
            opacity = this.pot.children[3].getComponent(UIOpacity);
            if (opacity.opacity < 255) {
                opacity.opacity++;
                if (opacity.opacity >= 255) {
                    this.fire.active = false;
                    this.potThl.active = true;
                    this.potLabel.string = "请左右搅拌糖葫芦";
                    this.potStep++;
                    let op = this.potThl.getComponent(UIOpacity);
                    op.opacity = 0;
                    tween(op)
                        .to(0.5, { opacity: 255 })
                        .start();
                    tween(this.potThl)
                        .to(0.5, { scale: Vec3.ONE.clone().multiplyScalar(1.2) })
                        .to(0.5, { scale: Vec3.ONE.clone().multiplyScalar(1.3) })
                        .union().repeatForever().start();
                }
            }
        }
    }

    _InitTouch() {
        this.sugar.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        this.sugar.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.sugar.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        this.water.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        this.water.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.water.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        this.potPanel.on(Node.EventType.TOUCH_MOVE, this.ThlMove, this);
    }

    TouchStart(event: EventTouch) {
        let target: Node = event.target;
        if (target == this.sugar) {
            if (this.potStep != 0) return;
            target.angle = -45;
        }
        else {
            if (this.potStep != 1) return;
            target.angle = 45;
        }
        target.children[0].active = true;
        Tween.stopAllByTarget(target);
        this.touchTarget = target;
        THLCB_AudioManager.Instance._PLayLoopSound(50);
    }

    TouchEnd(event: EventTouch) {
        THLCB_AudioManager.Instance._StopLoopSound();
        this.touchTarget = null;
        let target: Node = event.target;
        target.angle = 0;
        target.children[0].active = false;
    }

    ThlMove(event: EventTouch) {
        if (this.potStep != 3) return;
        Tween.stopAllByTarget(this.potThl);
        this.potThl.getComponent(UIOpacity).opacity = 255;
        let deltaX = event.getDeltaX() / 100;
        this.potThl.angle = clamp(this.potThl.angle - deltaX * 30, 160, 200);
        let isFull = true;
        for (let i = this.thlSugar.length - 1; i >= 0; i--) {
            if (this.thlSugar[i] >= 5) continue;
            isFull = false;
            this.thlSugar[i] += Math.abs(deltaX);
            let sprite = this.potThl.children[i].getComponent(Sprite);
            if (this.thlSugar[i] >= 5) {
                sprite.spriteFrame = THLCB_DataManager.thl2Sfs.find((value, index, obj) => { if (value.name == sprite.spriteFrame.name) return value; });
                THLCB_AudioManager.Instance._PlaySound(1);
                tween(this.potThl.children[i])
                    .to(0.1, { scale: v3(1.2, 1.2, 1.2) })
                    .to(0.1, { scale: Vec3.ONE })
                    .start();
            }
            break;
        }
        if (isFull) this.NextStep();
    }

    ItemTouchStart(event: EventTouch) {
        if (this.step != 0) return;
        this.touch.setWorldPosition(event.getUILocation().toVec3());
        THLCB_AudioManager.Instance._PlaySound(1);
    }

    ItemTouchMove(event: EventTouch) {
        if (this.step != 0) return;
        let target: Node = event.target;
        let num = target.getSiblingIndex();
        let scrollView = this.content.parent.parent;
        if (!scrollView.getComponent(UITransform).getBoundingBoxToWorld().contains(event.getUILocation())) {
            scrollView.getComponent(ScrollView).enabled = false;
        }
        let thlUI = this.thl.getComponent(UITransform);
        if (thlUI.getBoundingBoxToWorld().contains(event.getUILocation())) {
            this.touch.getComponent(Sprite).spriteFrame = null;
            let item = this.thl.children[this.itemNum];
            item.getComponent(Sprite).spriteFrame = THLCB_DataManager.thlSfs.find((value, index, obj) => { if (value.name == (num + 1).toString()) return value; });
            let pos = event.getUILocation().toVec3();
            pos.x = item.getWorldPosition().x;
            item.setWorldPosition(pos);
        }
        else {
            if (!scrollView.getComponent(UITransform).getBoundingBoxToWorld().contains(event.getUILocation())) this.touch.getComponent(Sprite).spriteFrame = THLCB_DataManager.thlSfs.find((value, index, obj) => { if (value.name == (num + 1).toString()) return value; });
            this.thl.children[this.itemNum].getComponent(Sprite).spriteFrame = null;
            this.touch.setWorldPosition(event.getUILocation().toVec3());
        }
    }

    ItemTouchEnd(event: EventTouch) {
        if (this.step != 0) return;
        let target: Node = event.target;
        let scrollView = this.content.parent.parent;
        scrollView.getComponent(ScrollView).enabled = true;
        let thlUI = this.thl.getComponent(UITransform);
        if (thlUI.getBoundingBoxToWorld().contains(event.getUILocation())) {
            let num = this.itemNum;
            let item = this.thl.children[num];
            tween(item)
                .to(0.1, { position: v3(0, -50 + 100 * num) })
                .start();
            THLCB_DataManager.curThl[num] = target.getComponent(THLCB_Item).num;
            this.itemNum++;
            if (this.itemNum == 4) this.NextStep();
            THLCB_AudioManager.Instance._PlaySound(1);
        }
        this.touch.getComponent(Sprite).spriteFrame = null;
    }

    protected _InitData(): void {
        THLCB_AudioManager.Instance._PlayCookMusic();
        this.bg.spriteFrame = THLCB_MainPanel.Instance.bg.spriteFrame;
        this.table.spriteFrame = THLCB_MainPanel.Instance.table.spriteFrame;
        THLCB_DataManager.curThl = [-1, -1, -1, -1];
        this.thlSugar = [0, 0, 0, 0];
        this.itemNum = 0;
        this.step = 0;
        this.potStep = 0;
        this.potPanel.active = false;
        this._InitRequest();
        this._InitStep();
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "果冻大师：吃播ASMR");
    }

    _InitRequest() {
        if (THLCB_DataManager.chatSfs) this.request.children[4].getComponent(Sprite).spriteFrame = THLCB_DataManager.chatSfs[THLCB_DataManager.requestViewer];
        else eventCenter.once("chatSfs", () => { this.request.children[4].getComponent(Sprite).spriteFrame = THLCB_DataManager.chatSfs[THLCB_DataManager.requestViewer]; }, this);
        for (let i = 0; i < this.requestThl.children.length; i++) {
            const element = this.requestThl.children[i].getComponent(Sprite);
            element.spriteFrame = THLCB_DataManager.thl2Sfs.find((value, index, obj) => { if (value.name == (THLCB_DataManager.requestThl[i] + 1).toString()) return value; });
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
        switch (this.step) {
            case 0:
                this.thl.angle = 0;
                this.thl.setPosition(v3(200, -200));
                for (let i = 0; i < this.thl.children.length; i++) {
                    const element = this.thl.children[i].getComponent(Sprite);
                    if (element) element.spriteFrame = null;
                }
                for (let i = 0; i < THLCB_DataManager.unlockItemLevels.length; i++) {
                    let item: Node = PoolManager.GetNodeByPrefab(this.itemPrefab, this.content);
                    item.getComponent(THLCB_Item)._Init(i);
                }
                break;
            case 1:
                let x = this;
                THLCB_MainPanel.Instance._Fade(() => {
                    x.potLabel.string = "请加糖";
                    x.potPanel.active = true;
                    x.potBtn.angle = 0;
                    x.sugar.active = true;
                    x.water.active = true;
                    x.potThl.active = false;
                    x.sugar.children[0].active = false;
                    x.water.children[0].active = false;
                    x.sugar.angle = 0;
                    x.water.angle = 0;
                    x.potThl.angle = 180;
                    for (let i = 0; i < this.potThl.children.length; i++) {
                        const element = this.potThl.children[i].getComponent(Sprite);
                        element.spriteFrame = THLCB_DataManager.thlSfs.find((value, index, obj) => { if (value.name == (THLCB_DataManager.curThl[i] + 1).toString()) return value; });
                    }
                    for (let i = 0; i < this.pot.children.length; i++) {
                        const element = this.pot.children[i];
                        if (i < 2) element.getComponent(Sprite).fillRange = 0;
                        else element.getComponent(UIOpacity).opacity = 0;
                    }
                    tween(x.sugar)
                        .to(0.5, { scale: v3(1.1, 1.1, 1.1) })
                        .to(0.5, { scale: Vec3.ONE })
                        .union().repeatForever().start();
                })
                break;
            case 2:
                THLCB_MainPanel.Instance.completePanel.active = true;
                break;
        }
    }

    NextStep() {
        this.step++;
        this._InitStep();
    }

    Click() {
        if (this.fire.active || this.potThl.active) return;
        this.fire.active = true;
        THLCB_AudioManager.Instance._PlaySound(53);
        Tween.stopAllByTarget(this.potBtn);
        tween(this.potBtn)
            .to(0.5, { angle: 90 })
            .start();
    }

}