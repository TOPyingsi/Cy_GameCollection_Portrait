import { _decorator, AudioSource, Component, EventTouch, Label, log, Node, NodeEventType, UITransform, Vec3 } from 'cc';
import { KBQNDW_GlobalDt } from './KBQNDW_GlobalDt';
const { ccclass, property } = _decorator;

@ccclass('KBQNDW_Wa')
export class KBQNDW_Wa extends Component {

    private originalPos: Vec3 = new Vec3(); // 初始位置

    private offset: Vec3 = new Vec3(); // 触摸点与节点中心的偏移

    private playArea: Node = null;

    private audio: AudioSource = null;

    private audioLength: number = null;

    protected onLoad(): void {
        this.playArea = this.node.parent.parent;
        this.audio = this.playArea.getComponent(AudioSource);

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if (KBQNDW_GlobalDt.Instance.wawaSequence != Number(this.node.name)) {
            return;
        }

        this.originalPos.set(this.node.position.x, this.node.position.y, 0);

        //触摸点
        let touchPos = event.getUILocation();//世界
        let nodePos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));//本地(节点)

        this.offset.set(this.node.position.x - nodePos.x, this.node.position.y - nodePos.y, 0);
    }

    onTouchMove(event: EventTouch) {
        if (KBQNDW_GlobalDt.Instance.wawaSequence != Number(this.node.name)) {
            return;
        }

        let touchPos = event.getUILocation();
        let nodePos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        this.node.setPosition(nodePos.x + this.offset.x, nodePos.y + this.offset.y);

    }

    onTouchEnd(event: EventTouch) {
        if (KBQNDW_GlobalDt.Instance.wawaSequence != Number(this.node.name)) {
            return;
        }

        this.node.position = this.originalPos.clone();
        for (let trigger of KBQNDW_GlobalDt.Instance.triggerN) {
            let transform = trigger.getComponent(UITransform);
            if (transform.getBoundingBoxToWorld().contains(event.getUILocation())) {

                switch (trigger.name) {
                    case "jiejie":

                        this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[8];
                        this.audio.play();
                        this.playArea.getChildByName("notTouch").active = true;
                        this.playArea.getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "好久不见姐姐了，也帮我带带娃吧";
                        this.playArea.getChildByName("对话框1").active = true;
                        KBQNDW_GlobalDt.Instance.delDHK1();

                        trigger.getChildByName("wa").active = true;
                        KBQNDW_GlobalDt.Instance.deleteTriggerN(trigger);
                        break;

                    case "nvkafeii":
                        this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[1];
                        this.audio.play();
                        this.playArea.getChildByName("notTouch").active = true;
                        this.playArea.getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "这孩子长的和他爸一模一样";
                        this.playArea.getChildByName("对话框1").active = true;
                        KBQNDW_GlobalDt.Instance.delDHK1();

                        trigger.getChildByName("wa").active = true;
                        KBQNDW_GlobalDt.Instance.deleteTriggerN(trigger);
                        break;

                    case "renzhe":
                        // if(this.embrace > 2){
                        //     return;
                        // }
                        if (KBQNDW_GlobalDt.Instance.embrace === 0) {
                            this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[2];
                            this.audio.play();
                            this.playArea.getChildByName("notTouch").active = true;
                            this.playArea.getChildByName("Label").getComponent(Label).string = "这可是我和balleringcappuccino恩爱的结晶";
                            this.playArea.getChildByName("Label").active = true;
                            this.playArea.getChildByName("对话框2").active = true;
                            KBQNDW_GlobalDt.Instance.delDHK2();

                            trigger.getChildByName("wa1").active = true;

                        }

                        if (KBQNDW_GlobalDt.Instance.embrace === 1) {
                            this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[3];
                            this.audio.play();
                            this.playArea.getChildByName("notTouch").active = true;
                            this.playArea.getChildByName("Label").getComponent(Label).string = "怎么会辛苦呢，我只觉得幸福";
                            this.playArea.getChildByName("Label").active = true;
                            this.playArea.getChildByName("对话框2").active = true;
                            KBQNDW_GlobalDt.Instance.delDHK2();

                            trigger.getChildByName("ku").active = true;
                            trigger.getChildByName("wa2").active = true;
                            KBQNDW_GlobalDt.Instance.deleteTriggerN(trigger);
                        }
                        KBQNDW_GlobalDt.Instance.embrace += 1;
                        break;

                    case "xi":
                        this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[5];
                        this.audio.play();
                        this.playArea.getChildByName("notTouch").active = true;
                        this.playArea.getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "Glorbo Frutto Drillo你也跑不了";
                        this.playArea.getChildByName("对话框1").active = true;
                        KBQNDW_GlobalDt.Instance.delDHK1();

                        trigger.parent.getChildByName("xigua").getChildByName("西瓜鳄").getChildByName("wa").active = true;

                        KBQNDW_GlobalDt.Instance.deleteTriggerN(trigger);
                        break;

                    case "飞机鳄鱼":
                        this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[9];
                        this.audio.play();
                        this.playArea.getChildByName("notTouch").active = true;
                        this.playArea.getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "路过的BombardiroCrocodilo你也别闲着,也来帮忙带一下娃吧";
                        this.playArea.getChildByName("对话框1").active = true;
                        KBQNDW_GlobalDt.Instance.delDHK1();

                        trigger.getChildByName("wa").active = true;
                        KBQNDW_GlobalDt.Instance.deleteTriggerN(trigger);
                        break;

                    case "shayu":
                        this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[4];
                        this.audio.play();
                        this.playArea.getChildByName("notTouch").active = true;
                        this.playArea.getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "也辛苦Tralalerotralala帮忙带一下娃";
                        this.playArea.getChildByName("对话框1").active = true;
                        KBQNDW_GlobalDt.Instance.delDHK1();

                        trigger.getChildByName("wa").active = true;
                        KBQNDW_GlobalDt.Instance.deleteTriggerN(trigger);
                        break;

                    case "肌肉":
                        this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[6];
                        this.audio.play();
                        this.playArea.getChildByName("notTouch").active = true;
                        this.playArea.getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "他只是路过来借厕所的，也让他帮忙带一下娃吧";
                        this.playArea.getChildByName("对话框1").active = true;
                        KBQNDW_GlobalDt.Instance.delDHK1();

                        trigger.getChildByName("wa").active = true;
                        KBQNDW_GlobalDt.Instance.deleteTriggerN(trigger);
                        break;

                    case "卡皮巴拉":
                        this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[7];
                        this.audio.play();
                        this.playArea.getChildByName("notTouch").active = true;
                        this.playArea.getChildByName("对话框1").getChildByName("Label").getComponent(Label).string = "卡皮巴拉情绪稳定不愧是带娃的一把好手";
                        this.playArea.getChildByName("对话框1").active = true;
                        KBQNDW_GlobalDt.Instance.delDHK1();

                        trigger.getChildByName("wa").active = true;
                        KBQNDW_GlobalDt.Instance.deleteTriggerN(trigger);
                        break;

                    case "木棍人":
                        this.audio.clip = KBQNDW_GlobalDt.Instance.audioGroup[10];
                        this.audio.play();
                        this.playArea.getChildByName("notTouch").active = true;
                        this.playArea.getChildByName("对话框3").getChildByName("Label").getComponent(Label).string = "这孩子怎么不认生，不过我隔壁老棍最喜欢小孩儿了";
                        this.playArea.getChildByName("对话框3").active = true;
                        KBQNDW_GlobalDt.Instance.delDHK3();

                        trigger.getChildByName("wa").active = true;
                        KBQNDW_GlobalDt.Instance.deleteTriggerN(trigger);
                        break;

                }
                KBQNDW_GlobalDt.Instance.wawaSequence += 1;
                if(KBQNDW_GlobalDt.Instance.wawaSequence === 10){
                    KBQNDW_GlobalDt.Instance.gamewin();
                }
                
                console.log(KBQNDW_GlobalDt.Instance.wawaSequence);
                this.node.removeFromParent();
                return;

            }
        }
    }

}
