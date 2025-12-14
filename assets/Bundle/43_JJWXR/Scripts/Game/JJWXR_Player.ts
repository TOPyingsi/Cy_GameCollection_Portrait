import { _decorator, Component, Node, Vec2, EventTouch, Vec3, Input, Camera, Prefab, instantiate, tween, AudioClip, randomRange, director } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
import { AudioManager } from '../Utils/JJWXR_AudioManager';
import { JJWXR_BattleUI } from './UI/JJWXR_BattleUI';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_Player')
export class JJWXR_Player extends Component {
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    @property(Node)
    private cameraNode: Node = null; // 绑定 main 摄像机节点

    @property({ type: Vec2 })
    private minRotation: Vec2 = new Vec2(-30, -60); // X轴和Y轴的最小旋转角度
    @property({ type: Vec2 })
    private maxRotation: Vec2 = new Vec2(30, 60); // X轴和Y轴的最大旋转角度
    @property({ type: Node })
    private firePoint: Node = null; // 绑定发射点节点
    @property({ type: Node })
    private ringSpawnPoint: Node = null; // 绑定发射点节点

    @property(Prefab)
    private ringPrefab: Prefab = null; // 能量环预制体

    @property(Prefab)
    private bulletPrefab: Prefab = null; // 子弹预制体

    @property(AudioClip)
    private fireSound: AudioClip = null;
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    public speed = 5; // 移动速度
    // public input = new Input();
    @property(Node)
    input: Node;
    @property(Node)
    input2: Node;
    private rotationSpeed: number = this.speed; // 旋转速度
    private touchStartPos: Vec2 = null; // 记录触摸开始位置
    private touchEndPos: Vec2 = null; // 记录触摸结束位置
    camera: Camera = null;

    @property({ type: Node })
    private theFirstPosition: Node = null;
    @property({ type: Node })
    public bulletTimePos: Node = null;

    private defaulePos: Vec3 = new Vec3(0, 10, 0);

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 单例模式
    private static _instance: JJWXR_Player = null;
    public static get instance(): JJWXR_Player {
        return this._instance;
    }

    onLoad() {
        console.log('初始化');
        JJWXR_Player._instance = this; // 单例模式
        this.onTouchEventStart();
        eventCenter.on(JJWXR_Events.ON_FIRE, this.onFire, this); // 监听发射子弹事件
    }

    private currentRotation: Vec3 = new Vec3();
    private rotationDelta: Vec3 = new Vec3(); // 旋转增量
    start() {
        this.currentRotation.set(this.node.eulerAngles); // 初始化当前旋转角度
        const isFirstPlay = localStorage.getItem('isFirstPlay');
        if (isFirstPlay == "true") {
            this.node.setWorldPosition(this.theFirstPosition.worldPosition);
        }

        this.camera = this.cameraNode.getComponent(Camera); // 获取摄像机组件
        eventCenter.on(JJWXR_Events.ON_TOUCH_EVENT_START, this.onTouchEventStart, this); // 监听触摸事件
        eventCenter.on(JJWXR_Events.ON_TOUCH_EVENT_END, this.onTouchEventEnd, this); // 监听触摸事件
        eventCenter.on(JJWXR_Events.CHANGE_CAMERA_FOV, this.onChangeCameraFov, this); // 监听改变摄像机视野大小事件
        eventCenter.on(JJWXR_Events.CHANGE_CAMERA_FOV_BACK, this.onChangeCameraFovBack, this); // 监听改变摄像机视野大小事件
        eventCenter.on(JJWXR_Events.CHANGE_CAMERA_FOV_SPEED, this.onChangeCameraFovSpeed, this); // 监听改变摄像机视野大小事件
        eventCenter.on(JJWXR_Events.CHANGE_CAMERA_FOV_SPEED_BACK, this.onChangeCameraFovSpeedBack, this); // 监听改变摄像机视野大小事件

        eventCenter.on(JJWXR_Events.ON_SPAWN_RING, this.onSpawnRing, this); // 生成环
        eventCenter.on(JJWXR_Events.ON_REMOVE_RING, this.onRemoveRing, this); // 移除环

        eventCenter.emit(JJWXR_Events.LOOKAT_TARGET_POSITION, this.lookAtTargetPosition, this); // 发射子弹事件初始化摄像机视野大小

        eventCenter.on(JJWXR_Events.MOVE_TO_ORIGIN_POSITION, this.moveToOriginPosition, this); // 移动到初始位置
    }

    onDestroy() {
        eventCenter.off(JJWXR_Events.ON_TOUCH_EVENT_START, this.onTouchEventStart, this); // 取消监听触摸事件
        eventCenter.off(JJWXR_Events.ON_TOUCH_EVENT_END, this.onTouchEventEnd, this); // 取消监听触摸事件
        eventCenter.off(JJWXR_Events.CHANGE_CAMERA_FOV, this.onChangeCameraFov, this); // 取消监听改变摄像机视野大小事件
        eventCenter.off(JJWXR_Events.CHANGE_CAMERA_FOV_BACK, this.onChangeCameraFovBack, this); // 监听改变摄像机视野大小事件
        eventCenter.off(JJWXR_Events.CHANGE_CAMERA_FOV_SPEED, this.onChangeCameraFovSpeed, this); // 取消监听改变摄像机视野大小事件
        eventCenter.off(JJWXR_Events.CHANGE_CAMERA_FOV_SPEED_BACK, this.onChangeCameraFovSpeedBack, this); // 监听改变摄像机视野大小事件
        eventCenter.off(JJWXR_Events.ON_FIRE, this.onFire, this); // 取消监听发射子弹事件

        eventCenter.off(JJWXR_Events.ON_SPAWN_RING, this.onSpawnRing, this); // 生成环
        eventCenter.off(JJWXR_Events.ON_REMOVE_RING, this.onRemoveRing, this); // 移除环

        eventCenter.off(JJWXR_Events.LOOKAT_TARGET_POSITION, this.lookAtTargetPosition, this); // 取消监听发射子弹事件

        eventCenter.off(JJWXR_Events.MOVE_TO_ORIGIN_POSITION, this.moveToOriginPosition, this); // 取消监听移动到初始位置
    }

    // 开始监听触摸事件
    onTouchEventStart() {
        // 监听触摸事件
        this.input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.input2.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.input2.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.input2.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // 取消监听触摸事件
    onTouchEventEnd() {
        // 取消监听触摸事件
        this.input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.input2.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.input2.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.input2.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    startPos: Vec2;
    // 触摸开始
    private onTouchStart(event: EventTouch) {
        const touchLocation = event.getUILocation(); // 获取触摸点的 UI 坐标
        this.touchStartPos = new Vec2(touchLocation.x, touchLocation.y);
        this.startPos = event.getUILocation();
        // console.log('触摸开始' + this.touchStartPos);
        eventCenter.emit(JJWXR_Events.ONTOUCHSTART_BATTLEUI, touchLocation); // 发送触摸开始事件
    }

    // 触摸移动
    private onTouchMove(event: EventTouch) {
        // console.log('触摸移动');
        if (!this.cameraNode || !this.touchStartPos) return;
        let touchLocation = event.getUILocation(); // 获取当前触摸点的 UI 坐标
        // 计算触摸偏移量
        const delta = new Vec2(
            touchLocation.x - this.touchStartPos.x,
            touchLocation.y - this.touchStartPos.y
        );

        // 根据触摸偏移量计算旋转角度
        const rotationDelta = new Vec3(
            delta.y * this.rotationSpeed / 100, // 垂直方向控制俯仰角
            -delta.x * this.rotationSpeed / 100,  // 水平方向控制偏航角
            0
        );

        // 限制俯仰角在 -90 到 90 度之间
        let currentRotation = this.cameraNode.eulerAngles.clone(); // 当前旋转角度
        // 更新目标节点的旋转
        currentRotation = currentRotation.add(rotationDelta); // 添加旋转增量

        // 限制旋转范围
        currentRotation.x = Math.max(this.minRotation.x, Math.min(currentRotation.x, this.maxRotation.x));
        currentRotation.y = Math.max(this.minRotation.y, Math.min(currentRotation.y, this.maxRotation.y));

        this.cameraNode.eulerAngles = currentRotation;

        this.touchStartPos.set(touchLocation.x, touchLocation.y);
        // eventCenter.emit(JJWXR_Events.ONTOUCHMOVE_BATTLEUI, this.cameraNode.eulerAngles); // 发送触摸移动事件
    }

    // 触摸结束
    private onTouchEnd(event: EventTouch) {
        console.log('触摸结束');
        const touchLocation = event.getUILocation(); // 获取当前触摸点的 UI 坐标
        console.log(`点击开始: ${this.touchStartPos}, 点击结束位置: ${touchLocation}`);

        if (!this.touchStartPos) return; // 如果没有开始触摸，则直接返回
        // 判断是否有移动
        if (this.startPos.x === touchLocation.x && this.startPos.y === touchLocation.y) {
            console.log('点击');
            // JJWXR_BattleUI.instance.onTouchEndBattleUI();
            eventCenter.emit(JJWXR_Events.ONTOUCHEND_BATTLEUI); // 发送触摸结束事件
        } else {
            console.log('滑动');
        }

        this.touchStartPos = null; // 重置触摸开始位置
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // 平滑移动至原位置
    moveToOriginPosition() {
        console.log('移动至原位置');
        // 使用 Tween 实现平滑移动
        tween(this.node)
            .to(2, { position: this.defaulePos }) // 2 秒内移动到目标位置
            .start();
    }

    // 朝向目标位置
    lookAtTargetPosition(targetEnemy?: Node) {
        console.log('朝向目标位置');
        let Offset = randomRange(-0.5, 0.5);
        let target = targetEnemy.worldPosition;
        target = new Vec3(target.x + Offset, target.y + Offset, target.z + Offset);
        // 朝向目标位置
        this.cameraNode.lookAt(target);
    }

    // 改变摄像机视野速度
    onChangeCameraFovSpeed() {
        console.log('改变摄像机视野速度');
        // 改变摄像机视野速度
        this.rotationSpeed = this.speed / 10;
    }
    // 改变摄像机视野速度
    onChangeCameraFovSpeedBack() {
        this.rotationSpeed = this.speed;
    }

    // 改变摄像机视野
    onChangeCameraFov() {
        // onChangeCameraFov(fovNumber: number) {
        console.log('改变摄像机视野');
        // 改变摄像机视野
        this.camera.fov = 5;
    }

    // 改变摄像机视野
    onChangeCameraFovBack() {
        this.camera.fov = 45;
    }

    // 生成环
    onSpawnRing() {
        const rings = this.node.scene.getChildByName('RingPoint');
        if (rings) {
            return;
        } else {
            // 实例化环
            const ring = instantiate(this.ringPrefab);

            // 设置环的位置和旋转
            ring.setWorldPosition(this.ringSpawnPoint.worldPosition);
            ring.setWorldRotation(this.ringSpawnPoint.worldRotation);

            // 将子弹添加到场景中
            this.node.scene.addChild(ring);
        }
    }

    // 移除环
    onRemoveRing() {
        const ring = this.node.scene.getChildByName('RingPoint');
        if (ring) {
            ring.destroy();
        }
    }

    // 子弹发射
    onFire() {
        const bullet: Node = PoolManager.GetNodeByPrefab(this.bulletPrefab, director.getScene());
        // 设置子弹的位置和旋转
        bullet.setWorldPosition(this.cameraNode.getWorldPosition());
        bullet.setWorldRotation(this.cameraNode.getWorldRotation());

        // 添加开火音效
        AudioManager.instance.playOneShot(this.fireSound);
    }
}