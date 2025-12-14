import { _decorator, Component, director, EventTouch, find, instantiate, Node, quat, size, Tween, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { WNDW_GameManager } from './WNDW_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;


/**
 * 处理鲨鱼触摸事件
 */
@ccclass('WNDW_SYTouch')
export class WNDW_SYTouch extends Component {

    private originalPos: Vec3 = new Vec3();
    private originalParent: Node = null;
    private originalIndex: number = 0;
    private playArea: Node = null;

    protected onLoad(): void {
        this.playArea = find('Canvas/PlayArea');

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {

        AudioManager.Instance.PlaySFX( WNDW_GameManager.instance.clickClip);

        if (this.node !=  WNDW_GameManager.instance.sy[ WNDW_GameManager.instance.sy.length - 1]) return;

        this.originalPos = this.node.position.clone();
        this.originalParent = this.node.parent;
        this.originalIndex = this.node.getSiblingIndex();

        this.node.setParent(this.playArea);

        const touchStartPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

        this.node.setPosition(touchStartPos.x, touchStartPos.y);
    }

    onTouchMove(event: EventTouch) {
        if (this.node !=  WNDW_GameManager.instance.sy[ WNDW_GameManager.instance.sy.length - 1]) return;

        const touchMovePos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));
        this.node.setPosition(touchMovePos.x, touchMovePos.y);
    }

    private num: number = 0;

    onTouchEnd(event: EventTouch) {
        if (this.node !=  WNDW_GameManager.instance.sy[ WNDW_GameManager.instance.sy.length - 1]) return;

        const touchEndPos = this.playArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y));

         WNDW_GameManager.instance.sy_objectives.forEach(objective => {
            const bol = objective.getComponent(UITransform).getBoundingBox().contains(v2(touchEndPos.x, touchEndPos.y));

            if (bol && objective.active) {
                AudioManager.Instance.PlaySFX( WNDW_GameManager.instance.loosenClip);
                 WNDW_GameManager.instance.sy_objectives.splice( WNDW_GameManager.instance.sy_objectives.indexOf(objective), 1);
                if ( WNDW_GameManager.instance.mtr_objectives.includes(objective)) {
                    if (objective.name == "Dad") {
                        // 特殊处理 Dad
                    } else {
                         WNDW_GameManager.instance.mtr_objectives.splice( WNDW_GameManager.instance.mtr_objectives.indexOf(objective), 1);
                    }
                }

                this.node.destroy();
                const node = instantiate( WNDW_GameManager.instance.SY);
                node.setParent(this.playArea);
                find("Canvas/PlayArea/鲨鱼").setSiblingIndex(999);

                if (objective.name === "Mom" && objective.active) {
                    node.setParent(objective);
                    node.setPosition(v3(75.035, 175.687))
                     WNDW_GameManager.instance.activeLabelToRole(objective, "跟他爸爸一样帅");
                }
                else if (objective.name === "恐龙" && objective.active) {
                    node.setPosition(v3(340.987, -697.925));
                    tween(objective).to(0.2, { eulerAngles: v3(0, 0, 95) }).call(() => {
                        this.scheduleOnce(() => {
                            Tween.stopAll();

                            WNDW_GameManager.instance.gamePanel.Lost();
                        }, 1);
                    }).start();
                }
                else if (objective.name === "Dad" && objective.active) {
                    node.setParent(objective);
                    node.setPosition(v3(-131.07, 135.949));
                     WNDW_GameManager.instance.activeLabelToRole(objective, "让爸爸好好来疼爱你们吧");
                }
                else if (objective.name === "树人" && objective.active) {
                    node.setPosition(v3(-386.382, 41.107));
                     WNDW_GameManager.instance.activeLabelToRole( WNDW_GameManager.instance.mom, "大脚猴辛苦你一下啦");
                }
                else if (objective.name === "香蕉猴" && objective.active) {
                    node.setPosition(v3(-424.829, -712.835));
                     WNDW_GameManager.instance.activeLabelToRole( WNDW_GameManager.instance.mom, "给你吃香蕉了帮我照顾一下孩子吧");
                }
                else if (objective.name === "窗帘_ON" && objective.active) {
                    node.setPosition(v3(-380.308, 560.127));
                     WNDW_GameManager.instance.activeLabelToRole(find("Canvas/PlayArea/窗帘_ON"), "我只是路过的好心人罢了");
                }
                else if (objective.name === "大鲨鱼" && objective.active) {
                    node.setPosition(v3(308.947, 287.837));
                     WNDW_GameManager.instance.activeLabelToRole(find("Canvas/PlayArea/大鲨鱼"), "老妹，以后有这种事情，尽管叫我就好了");
                }
                else if (objective.name === "仓鼠" && objective.active) {
                    node.setPosition(v3(-122.181, 98.542));
                     WNDW_GameManager.instance.activeLabelToRole( WNDW_GameManager.instance.mom, "养鼠千日，用鼠一时");
                }

                node.setSiblingIndex(objective.getSiblingIndex() + 1);
                this.delete(this.node);
                 WNDW_GameManager.instance.progress();
            } else {
                this.num++;
                if (this.num >=  WNDW_GameManager.instance.sy_objectives.length) {
                    this.refesh();
                }
            }
        });
    }

    refesh() {
        this.node.position = this.originalPos.clone();
        this.node.setParent(this.originalParent);
        this.node.setSiblingIndex(this.originalIndex);
        this.num = 0
    }

    delete(node: Node) {
         WNDW_GameManager.instance.sy.splice( WNDW_GameManager.instance.sy.indexOf(node), 1)
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

}


