import { _decorator, AudioSource, Component, EventTouch, find, instantiate, Node, size, Tween, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { WNDW_GameManager } from './WNDW_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

/**
 * 处理木头人触摸事件
 */
@ccclass('WNDW_MTRTouch')
export class WNDW_MTRTouch extends Component {

    private originalPos: Vec3 = new Vec3();
    private originalParent: Node = null;
    private originalIndex: number = 0;
    private playArea: Node = null;
    private num: number = 0;

    protected onLoad(): void {
        this.playArea = find('Canvas/PlayArea');

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        console.log("MTRTouch", this.node.name);
        if (this.node != WNDW_GameManager.instance.mtr[WNDW_GameManager.instance.mtr.length - 1]) return;

        this.originalPos = this.node.position.clone();
        this.originalParent = this.node.parent;
        this.originalIndex = this.node.getSiblingIndex();

        this.node.setParent(this.playArea);

        const touchStartPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        this.node.setPosition(touchStartPos.x, touchStartPos.y);
    }

    onTouchMove(event: EventTouch) {
        if (this.node != WNDW_GameManager.instance.mtr[WNDW_GameManager.instance.mtr.length - 1]) return;

        const touchMovePos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(touchMovePos.x, touchMovePos.y);
    }

    onTouchEnd(event: EventTouch) {
        if (this.node != WNDW_GameManager.instance.mtr[WNDW_GameManager.instance.mtr.length - 1]) return;

        const touchEndPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        WNDW_GameManager.instance.mtr_objectives.forEach(objective => {

            const bol = objective.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y))

            if (bol) {

                AudioManager.Instance.PlaySFX(WNDW_GameManager.instance.loosenClip);
                WNDW_GameManager.instance.mtr_objectives.splice(WNDW_GameManager.instance.mtr_objectives.indexOf(objective), 1)
                if (WNDW_GameManager.instance.sy_objectives.includes(objective)) {
                    if (objective.name == "Dad") {

                    } else {
                        WNDW_GameManager.instance.sy_objectives.splice(WNDW_GameManager.instance.sy_objectives.indexOf(objective), 1)
                    }
                }
                this.node.destroy();
                const node = instantiate(WNDW_GameManager.instance.MTR)
                node.setParent(this.playArea)

                find("Canvas/PlayArea/木头人").setSiblingIndex(999)

                if (objective.name === "Mom" && objective.active) {
                    node.setParent(objective);
                    node.setPosition(v3(75.035, 175.687))
                    WNDW_GameManager.instance.activeLabelToRole(objective, "跟他爸爸一样帅")
                }
                else if (objective.name === "恐龙" && objective.active) {
                    node.setPosition(v3(340.987, -697.925))
                    tween(objective).to(0.2, { eulerAngles: v3(0, 0, 95) }).call(() => {
                        this.scheduleOnce(() => { Tween.stopAll(), WNDW_GameManager.instance.gamePanel.Lost(); }, 1);
                    }).start()
                }
                else if (objective.name === "Dad" && objective.active) {
                    node.setParent(objective);
                    node.setPosition(v3(0, 430))
                    WNDW_GameManager.instance.activeLabelToRole(objective, "小孩爱闹，说明活泼")
                }
                else if (objective.name === "树人" && objective.active) {
                    node.setPosition(v3(-386.382, 41.107))
                    WNDW_GameManager.instance.activeLabelToRole(WNDW_GameManager.instance.mom, "大脚猴辛苦你一下啦")
                }
                else if (objective.name === "香蕉猴" && objective.active) {
                    node.setPosition(v3(-424.829, -712.835));
                    WNDW_GameManager.instance.activeLabelToRole(WNDW_GameManager.instance.mom, "给你吃香蕉了帮我照顾一下孩子吧")
                }
                else if (objective.name === "窗帘_ON" && objective.active) {
                    node.setPosition(v3(-380.308, 560.127))
                    WNDW_GameManager.instance.activeLabelToRole(find("Canvas/PlayArea/窗帘_ON"), "我只是路过的好心人罢了")
                }
                else if (objective.name === "仓鼠" && objective.active) {
                    node.setPosition(v3(-122.181, 98.542))
                    WNDW_GameManager.instance.activeLabelToRole(WNDW_GameManager.instance.mom, "养鼠千日，用鼠一时")
                }
                else if (objective.name === "隔壁老王" && objective.active) {
                    node.setPosition(v3(87.391, 202.345))
                    WNDW_GameManager.instance.activeLabelToRole(objective, "都是邻居这点小事不算麻烦")
                }
                node.setSiblingIndex(objective.getSiblingIndex() + 1)
                WNDW_GameManager.instance.progress()
                this.delete(this.node)
            } else {
                this.num++
                if (this.num >= WNDW_GameManager.instance.mtr_objectives.length) {
                    this.refesh()
                }
            }
        });
    }

    ovo() {

    }

    refesh() {
        this.node.position = this.originalPos.clone();
        this.node.setParent(this.originalParent);
        this.node.setSiblingIndex(this.originalIndex);
        this.num = 0
    }

    delete(node: Node) {
        WNDW_GameManager.instance.mtr.splice(WNDW_GameManager.instance.mtr.indexOf(node), 1)
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}


