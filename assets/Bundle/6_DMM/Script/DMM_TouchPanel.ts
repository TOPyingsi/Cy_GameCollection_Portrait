import { _decorator, Component, EventTouch, find, Node, UITransform, v3, Vec3 } from 'cc';
import { DMM_Camera } from './DMM_Camera';
import { DMM_LV } from './DMM_LV';
import { DMM_GameManager } from './DMM_GameManager';
import { DMM_EventManager, DMM_MyEvent } from './DMM_EventManager';
const { ccclass, property } = _decorator;

@ccclass('DMM_TouchPanel')
export class DMM_TouchPanel extends Component {

    Rocker: Node = null;
    RockerBase: Node = null;

    RpckerPos: Vec3 = new Vec3();

    // 记录触摸的初始位置
    private touchStartPos: Vec3 = new Vec3(0, 0, 0);
    private touchPrevPos: Vec3 = new Vec3(0, 0, 0);

    protected onLoad(): void {
        this.Rocker = find("摇杆底", this.node);
        this.RockerBase = find("摇杆底/摇杆", this.node);

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.RpckerPos = this.Rocker.getPosition().clone();
    }

    onTouchStart(event: EventTouch) {
        if (!DMM_LV.Instance || !DMM_LV.Instance.IsGameStart) return;
        // 获取触摸的起始位置
        this.touchPrevPos.set(event.getLocation().x, event.getLocation().y, 0);

        let x = event.getUILocation().x;
        let y = event.getUILocation().y;

        this.Rocker.setPosition(x - this.node.getComponent(UITransform).width / 2, y - this.node.getComponent(UITransform).height / 2, 0);
        this.RockerBase.setPosition(0, 0, 0);
    }

    onTouchMove(event: EventTouch) {
        if (!DMM_LV.Instance || !DMM_LV.Instance.IsGameStart) return;
        // 获取触摸的当前位置
        // const touchCurrentPos = event.getLocation();

        // // 计算触摸的位移
        // const deltaX = touchCurrentPos.x - this.touchPrevPos.x;
        // const deltaY = touchCurrentPos.y - this.touchPrevPos.y;

        // // 计算移动方向的向量
        // let direction = v3(deltaX, 0, -deltaY); // 使用 deltaX 和 deltaY 创建一个方向向量

        // console.error(direction.length());

        // if (direction.length() > 7) {
        //     // 将方向向量归一化
        //     direction = direction.normalize();

        //     if (DMM_Camera.Instance.Target) {
        //         const offX = direction.x;
        //         const offY = direction.z; // Y 轴改为 Z 轴，因为 Z 轴通常是 3D 场景中的前后方向

        //         EventManager.Scene.emit(MyEvent.DMM_MOVEMENT, offX, offY);
        //     }

        //     // 更新上一次触摸的位置
        //     this.touchPrevPos.set(touchCurrentPos.x, touchCurrentPos.y, 0);
        // }

        let x = event.getUILocation().x;
        let y = event.getUILocation().y;

        let pos = this.Rocker.position;

        let ox = x - this.node.getComponent(UITransform).width / 2 - pos.x;
        let oy = y - this.node.getComponent(UITransform).height / 2 - pos.y;

        let len = Math.sqrt(ox * ox + oy * oy);
        if (len <= 0) {
            return;
        }

        let dirX = ox / len;
        let dirY = oy / len;
        let radius = this.Rocker.getComponent(UITransform).width / 2;
        if (len > radius) {
            len = radius;
            ox = dirX * radius;
            oy = dirY * radius;
        }
        this.RockerBase.setPosition(ox, oy, 0);
        DMM_EventManager.Scene.emit(DMM_MyEvent.DMM_MOVEMENT, dirX, dirY, len / radius);
    }

    onTouchEnd(event: EventTouch) {
        if (!DMM_LV.Instance || !DMM_LV.Instance.IsGameStart) return;
        DMM_EventManager.Scene.emit(DMM_MyEvent.DMM_MOVEMENT_STOP);
        this.Rocker.setPosition(this.RpckerPos);
        this.RockerBase.setPosition(Vec3.ZERO);
    }

}


