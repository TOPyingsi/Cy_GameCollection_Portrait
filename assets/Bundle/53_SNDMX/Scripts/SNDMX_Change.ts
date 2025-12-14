import { _decorator, Animation, BoxCollider2D, Collider2D, Component, Contact2DType, EPhysics2DDrawFlags, EPhysicsDrawFlags, Event, EventTouch, IPhysics2DContact, Node, PhysicsSystem, PhysicsSystem2D, Rect, RigidBody2D, Script, UITransform, Vec2, Vec3 } from 'cc';
import { SNDMX_scene } from './SNDMX_scene';
import { SNDMX_Picturecontainer } from './SNDMX_Picturecontainer';
import { SNDMX_AduioMgr } from './SNDMX_AduioMgr';
import { SNDMX_StateControl } from './SNDMX_StateControl';
// import { ANIMATION } from '../../../../extensions/plugin-import-2x/creator/components/Animation';
const { ccclass, property } = _decorator;

@ccclass('Change')
export class Change extends Component {

    @property(SNDMX_AduioMgr)
    audioMgr: SNDMX_AduioMgr;


    private originalPos: Vec3 = new Vec3(); // 初始位置

    private offset: Vec3 = new Vec3(); // 触摸点与节点中心的偏移


    private box: BoxCollider2D = null;


    private changeScene: Node[] = []

    protected onLoad(): void {

        this.changeScene = SNDMX_Picturecontainer.getInstance().getDropZonesContainer();
        // this.box = this.node.getComponent(BoxCollider2D);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

    }

    onTouchStart(event: EventTouch) {
        // console.log(this.MuBtnID);
        // 获取触摸点在世界坐标系的位置
        let touchPos = event.getUILocation();
        // 将触摸点坐标转换为节点本地坐标
        let nodePos = this.node.parent!.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        // 计算偏移量
        this.originalPos.set(this.node.position.x, this.node.position.y, 0);
        this.offset.set(this.node.position.x - nodePos.x, this.node.position.y - nodePos.y, 0);
    }

    onTouchMove(event: EventTouch) {
        // 更新节点位置
        let touchPos = event.getUILocation();
        let worldPos = this.node.parent!.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        this.node.setPosition(worldPos.x + this.offset.x, worldPos.y + this.offset.y);

    }

    onTouchEnd(event: EventTouch) {
        // this.CanCollion = true;
        this.node.position = this.originalPos;


        for (let element of this.changeScene) {
            let transform = element.getComponent(UITransform);
            if (!transform.enabled) {
                continue;
            }
            if (transform.getBoundingBoxToWorld().contains(event.getUILocation())) {
                let targetName = element.name;
                let parent = this.node.parent.parent;//UIManager
                console.log(this.changeScene);

                switch (targetName) {
                    case "废墟":
                        SNDMX_StateControl.getInstance().win += 1;
                        parent.getChildByName("废墟").active = false;
                        parent.getChildByName("废墟").getComponent(UITransform).enabled = false;
                        parent.getChildByName("鱼缸").active = true;
                        this.audioMgr.PlayClip(5);
                        this.node.destroy();
                        break;

                    case "垃圾堆":
                        SNDMX_StateControl.getInstance().win += 1;
                        parent.getChildByName("垃圾堆").active = false;
                        parent.getChildByName("垃圾堆").getComponent(UITransform).enabled = false;
                        parent.getChildByName("黄金书盆栽").active = true;
                        this.audioMgr.PlayClip(8);
                        this.node.destroy();
                        break;
                    case "草席":
                        SNDMX_StateControl.getInstance().win += 1;
                        parent.getChildByName("草席").active = false;
                        parent.getChildByName("草席").getComponent(UITransform).enabled = false;
                        parent.getChildByName("沙发").active = true;
                        this.audioMgr.PlayClip(6);
                        this.node.destroy();
                        break;

                    case "waterTouchu":
                        SNDMX_StateControl.getInstance().win += 1;
                        parent.getChildByName("水").active = false;
                        parent.getChildByName("水").getComponent(UITransform).enabled = false;
                        parent.getChildByName("水晶吊灯").active = true;
                        this.audioMgr.PlayClip(9);
                        this.node.destroy();
                        break;

                    case "tou":
                        SNDMX_StateControl.getInstance().win += 1;
                        parent.getChildByName("厨房1").active = false;
                        parent.getChildByName("厨房1").getChildByName("tou").getComponent(UITransform).enabled = false;
                        parent.getChildByName("厨房2").active = true;
                        this.audioMgr.PlayClip(7);
                        this.node.destroy();
                        break;

                    case "墙1":
                        SNDMX_StateControl.getInstance().win += 1;
                        parent.getChildByName("墙1").active = false;
                        parent.getChildByName("墙1").getComponent(UITransform).enabled = false;
                        parent.getChildByName("墙2").active = true;
                        this.audioMgr.PlayClip(4);
                        this.node.destroy();
                        break;

                    case "touch":
                        SNDMX_StateControl.getInstance().win += 1;
                        parent.getChildByName("地板1").active = false;
                        parent.getChildByName("地板1").getChildByName("touch").getComponent(UITransform).enabled = false;
                        parent.getChildByName("地板2").active = true;
                        this.audioMgr.PlayClip(3);
                        this.node.destroy();
                        break;

                    case "门":
                        SNDMX_StateControl.getInstance().doorOpen = true;
                        parent.getChildByName("门").active = false;
                        parent.getChildByName("门").getComponent(UITransform).enabled = false;
                        parent.getChildByName("openDoor").active = true;
                        SNDMX_StateControl.getInstance().openDorr = true;
                        this.node.destroy();
                        this.audioMgr.PlayClip(12);
                        if (SNDMX_StateControl.getInstance().win < 8) {
                            parent.getChildByName("木棍人").getComponent(Animation).play("stop")
                           //老子进来了

                            parent.getChildByName("Occlusion").active = true;
                            console.log(2222);
                            parent.getChildByName("木棍人").getComponent(Animation).play("enterDoor");





                        } else {
                            parent.getChildByName("木棍人").getComponent(Animation).play("stop")
                        }
                        break;

                    case "咖啡忍者身体":
                        if (SNDMX_StateControl.getInstance().win === 7) {
                            SNDMX_StateControl.getInstance().win += 1;
                            parent.getChildByName("忍者").getChildByName("咖啡忍者身体").getComponent(UITransform).enabled = false;

                            this.audioMgr.PlayClip(11);

                            parent.getChildByName("忍者").getChildByName("咖啡忍者-金").active = true;

                            this.node.destroy();
                            break;
                        }
                        break;

                }
                break;
            }
        }


    }






}


