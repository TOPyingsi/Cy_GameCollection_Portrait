import { _decorator, AnimationComponent, AudioClip, AudioSource, Color, Component, EventTouch, Node, NodeEventType, Prefab, tween, UIOpacity, UITransform, v3, Vec3 } from 'cc';
import QLED_ClearMask from './QLED_ClearMask';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('QLED_GameMgr')
export class QLED_GameMgr extends Component {

    @property(Prefab)
    answerPrefab: Prefab = null;

    @property(Node)
    DingNode: Node = null;

    @property({ type: [Node] })
    clearNodes: Node[] = [];

    @property({ type: [Node] })
    jiejiaNodes: Node[] = [];

    @property(AudioClip)
    washClip: AudioClip = null;

    @property(AudioClip)
    clearClip: AudioClip = null;

    @property(AudioClip)
    getErshiClip: AudioClip = null;

    @property(AudioClip)
    lostClip: AudioClip = null;

    @property(AudioClip)
    winClip: AudioClip = null;

    public jiejiaMap: Map<string, any> = new Map();

    public jiejiaStart: boolean = false;

    public plasterNum: number = 0;

    clearMasks: QLED_ClearMask[] = [];
    audio: AudioSource = null;

    public static instance: QLED_GameMgr = null;
    start() {
        QLED_GameMgr.instance = this;

        this.audio = this.getComponent(AudioSource);

        GamePanel.Instance._answerPrefab = this.answerPrefab;

        for (let i = 0; i < this.clearNodes.length; i++) {
            this.clearMasks.push(this.clearNodes[i].getComponent(QLED_ClearMask));
        }

        for (let j = 0; j < this.jiejiaNodes.length; j++) {

            let node = this.jiejiaNodes[j];

            let ani = this.jiejiaNodes[j].getComponent(AnimationComponent);

            let arr = [node, false, ani];

            this.jiejiaMap.set("结痂" + j.toString(), arr);
        }
    }

    @property(Node)
    dirtyNode: Node = null;

    public dingPick: boolean = false;
    public dingReturn: boolean = false;

    dingStartPos: Vec3 = null;

    dingTouchStart(event: EventTouch) {

        if (!this.dingPick) {

            tween(this.DingNode)
                .by(0.8, { position: v3(500, 0, 0) })
                .to(0.5, { scale: v3(1, 1, 1) })
                .call(() => {
                    this.dingPick = true;

                    this.clearMasks[2].isLock = false;

                    this.DingNode.active = false;

                    this.dingStartPos = this.DingNode.worldPosition.clone();
                })
                .start();
            return;
        }

        // 获取触摸位置
        const touchPos = event.getUILocation();

        // 设置节点位置
        this.DingNode.worldPosition = v3(touchPos.x, touchPos.y, 0);

    }

    dingTouchMove(event: EventTouch) {
        if (this.dingReturn) {
            return;
        }

        if (!this.dingPick) {
            return;
        }

        // 获取触摸位置
        const touchPos = v3(event.getUILocation().x, event.getUILocation().y, 0);

        // 计算偏移量
        const offset = new Vec3(touchPos.x, touchPos.y, 0).subtract(this.dingStartPos);
        // 设置节点位置
        this.DingNode.worldPosition = offset.add(this.dingStartPos);

        let uiTrans = this.clearNodes[11].getComponent(UITransform);
        let pointX = this.clearNodes[11].worldPosition.x - uiTrans.width / 2;
        let pointY = this.clearNodes[11].worldPosition.y - uiTrans.height / 2;

        if (touchPos.x >= pointX && touchPos.y >= pointY
            && touchPos.x <= uiTrans.width + pointX
            && touchPos.y <= uiTrans.height + pointY) {

            this.dingReturn = true;

            this.DingNode.worldPosition = this.clearNodes[11].worldPosition;

        }
    }

    dingTouchEnd(event: EventTouch) {
        if (this.dingReturn) {
            this.dingReturn = false;

            AudioManager.Instance.PlaySFX(this.winClip);

            GamePanel.Instance.Win();
            return;
        }
    }

    Ding() {
        this.getComponent(AnimationComponent).play("change2");
    }

    nextClear(ID: number) {
        if (this.jiejiaStart) {
            return;
        }

        if (ID === 1) {
            this.DingNode.on(NodeEventType.TOUCH_START, this.dingTouchStart, this);
            this.DingNode.on(NodeEventType.TOUCH_MOVE, this.dingTouchMove, this);
            this.DingNode.on(NodeEventType.TOUCH_END, this.dingTouchEnd, this);

            this.clearNodes[ID].active = false;

            if (!this.dingPick) {
                return;
            }
        }

        if (ID === 2) {

            if (!this.dingPick) {
                return;
            }

            this.clearNodes[ID].active = false;

            this.jiejiaStart = true;
            return;
        }
        if (ID === 0) {
            this.dirtyNode.active = false;
            this.clearNodes[ID + 2].active = true;
        }

        this.clearNodes[ID].active = false;
        this.clearNodes[ID + 1].active = true;
        this.clearMasks[ID + 1].isLock = false;
    }

    nextStep() {
        this.getComponent(AnimationComponent).play("change1");
        AudioManager.Instance.PlaySFX(this.winClip);
    }

    startPlaster() {
        for (let j = 3; j < this.clearNodes.length; j++) {
            this.clearNodes[j].active = true;
            this.clearMasks[j].isLock = false;
        }
    }

    lost() {
        this.getComponent(AnimationComponent).play("lost");
    }

    Wash() {
        if (AudioManager.IsSoundOn && !this.audio.playing) {
            this.audio.clip = this.washClip;
            this.audio.play();
        }
    }

    Clear() {
        if (AudioManager.IsSoundOn && !this.audio.playing) {
            this.audio.clip = this.clearClip;
            this.audio.play();
        }
    }

    getErshi() {
        AudioManager.Instance.PlaySFX(this.getErshiClip);

    }
}


