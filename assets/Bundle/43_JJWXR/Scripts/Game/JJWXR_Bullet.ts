import { _decorator, Component, Node, tween, Vec3, RigidBody, PhysicsSystem, geometry, Prefab, instantiate, director, CapsuleCollider, ITriggerEvent, Camera, PhysicsRayResult, v3 } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';//自定义事件中心，用于模块间通信。
import { JJWXR_Events } from '../Utils/JJWXR_Events';//自定义事件枚举
import { JJWXR_Player } from './JJWXR_Player';
import { JJWXR_SucceedUI } from './UI/JJWXR_SucceedUI';//游戏结算 UI 脚本
const { ccclass, property } = _decorator;

@ccclass('JJWXR_Bullet')
export class JJWXR_Bullet extends Component {

    @property(Prefab)
    private bulletEffect: Prefab = null;//子弹命中时生成的特效预制体
    @property(Camera)
    private camera: Camera = null;

    public timeScale: number = 0.2; // 子弹时间的时间缩放（0.2 表示 20% 的速度）
    private speed: number = 2; // 移动速度
    private bulletTimeSpeed: number = 40; // 子弹时间的移动速度

    private lifeTime: number = 0.3; // 子弹的存活时间（秒）
    private bulletTimeLifeTime: number = 1.5; // 子弹时间的存活时间（秒）
    private rigidBody: RigidBody = null; // 子弹的刚体组件
    private direction: Vec3 = Vec3.FORWARD; // 移动方向

    public static isBulletTime: boolean = false; // 是否处于子弹时间状态

    private hitPos: PhysicsRayResult = null; // 子弹击中的位置

    start() {
        // 获取刚体组件
        this.rigidBody = this.node.getComponent(RigidBody);
        this.rigidBody.useCCD = true;

        // 初始化子弹
        this.direction = this.node.forward;

        // this.camera.node.active = false;

        // 射线检测
        this.fireRaycast();
        if (!JJWXR_Bullet.isBulletTime) {
            // 自动销毁子弹
            this.scheduleOnce(() => {
                this.destroyBullet();
            }, this.lifeTime);
        }
        // else {
        //     // 自动销毁子弹
        //     this.scheduleOnce(() => {
        //         this.camera.node.setParent(director.getScene());
        //         this.destroyBullet();
        //     }, this.bulletTimeLifeTime);// 子弹时间射线检测
        // }

    }

    // // 子弹时间碰撞检测  
    // onTriggerEnter(event: ITriggerEvent) {
    //     // event.otherCollider.node.getComponent(JJWXR_Player); // 获取碰撞的节点
    //     this.spawnHieEffect(this.hitPos);
    //     this.camera.node.setParent(director.getScene());
    //     this.destroyBullet(); // 销毁子弹
    //     eventCenter.emit(JJWXR_Events.ENEMY_DESTROY, this.hitPos.collider.node.parent);
    // }

    // // 移动子弹
    // move(deltaTime: number) {
    //     // // 根据方向和速度移动子弹
    //     // const newPosition = this.node.position.clone();
    //     // Vec3.scaleAndAdd(newPosition, newPosition, this.direction, this.speed * deltaTime);
    //     // // newPosition.z += this.direction.z * this.speed * deltaTime;
    //     // // newPosition.y += this.direction.y * this.speed * deltaTime;
    //     // // newPosition.x += this.direction.x * this.speed * deltaTime;
    //     // this.node.setPosition(newPosition);

    //     // 使用刚体组件移动子弹
    //     this.rigidBody.setLinearVelocity(this.direction.multiplyScalar(this.speed)); // 使用刚体组件移动子弹

    // }


    moveBulletTime() {
        // console.log("子弹时间移动" + this.node.position);
        eventCenter.emit(JJWXR_Events.HIDE_RETICLE_UI);
        // 使用刚体组件移动子弹
        this.rigidBody.setLinearVelocity(this.direction.multiplyScalar(this.bulletTimeSpeed)); // 使用刚体组件移动子弹
    }

    // 摄像机跟随方法
    followTarget() {
        // 检查摄像机是否设置
        if (!this.camera) {
            console.error("摄像机未设置");
            return;
        }
        this.camera.node.active = true;
        JJWXR_Player.instance.camera.enabled = false; // 禁用玩家摄像机
        // 获取摄像机节点
        const cameraNode = this.camera.node;
        // 设置摄像机的位置和旋转
        cameraNode.setPosition(new Vec3(30, 20, 50)); // 调整摄像机的位置
        cameraNode.lookAt(this.node.worldPosition); // 让摄像机看向目标
        tween(cameraNode)
            .to(1.4, {
                position: v3(0, 0, 60),
                eulerAngles: Vec3.ZERO
            })
            .start();
    }

    // 射线检测
    fireRaycast() {
        // 创建射线
        const ray = new geometry.Ray(
            this.node.position.x, this.node.position.y, this.node.position.z, // 起点
            this.direction.x, this.direction.y, this.direction.z // 方向
        );

        // 射线检测
        if (PhysicsSystem.instance.raycast(ray)) {
            // 获取碰撞结果
            const results = PhysicsSystem.instance.raycastResults;
            console.log(results);

            // 处理碰撞结果
            for (let i = 0; i < results.length; i++) {
                const hit = results[i];
                const hitNode = hit.collider;
                console.log("子弹击中了物体, 分组为: " + hitNode.getGroup());
                if ((hitNode.getGroup() === 4 || hitNode.getGroup() === 8) && JJWXR_Bullet.isBulletTime) {
                    eventCenter.emit(JJWXR_Events.HIDE_GAME_UI);
                    this.hitPos = results[i].clone();
                    // // 获取碰撞组件
                    // let collider = this.getComponent(CapsuleCollider);
                    // // 监听碰撞事件
                    // if (collider) {
                    //     collider.on('onTriggerEnter', this.onTriggerEnter, this);
                    // }
                    tween(this.node)
                        .to(this.bulletTimeLifeTime, { worldPosition: this.hitPos.hitPoint })
                        .call(() => {
                            this.spawnHieEffect(this.hitPos.hitPoint);
                            this.camera.node.setParent(director.getScene(), true);
                            this.destroyBullet(); // 销毁子弹
                            eventCenter.emit(JJWXR_Events.ENEMY_DESTROY, this.hitPos.collider.node.parent);
                        })
                        .start();
                    // 开启摄像机跟随
                    console.log("开启摄像机跟随");
                    this.followTarget();
                    this.moveBulletTime();
                    // this.checkHit(hit, hitNode.getGroup());
                    break;
                }
                else {
                    this.checkHit(hit, hitNode.getGroup());
                }

            }
        }
    }

    // 检查命中的物体
    private checkHit(hit: any, index: number) {
        if (index === 4 || index === 8) {
            // 播放精确命中特效
            const HitPosition = hit.hitPoint;
            this.spawnHieEffect(HitPosition);
        }

        // 销毁子弹
        if (!JJWXR_Bullet.isBulletTime) this.destroyBullet();

        // 播放精确命中音效
        if (index === 4) {
            // let headShot = parseInt(localStorage.getItem("headShot")) || 0;
            // console.log(headShot);
            // let shothead = headShot + 1;
            // localStorage.setItem("headShot", shothead.toString());

            // let hitShot = parseInt(localStorage.getItem("hitShot")) || 0;
            // console.log(hitShot);
            // let shotHit = hitShot + 1;
            // localStorage.setItem("hitShot", shotHit.toString());
            JJWXR_SucceedUI.headShot++;
            JJWXR_SucceedUI.hitShot++;

            // 播放精确命中动画
            eventCenter.emit(JJWXR_Events.SHOWPRECISEHIT);
            console.log("精确命中");
            // 敌人死亡
            eventCenter.emit(JJWXR_Events.ENEMY_DESTROY, hit.collider.node.parent);
        }
        else if (index === 8) {
            // 播放命中动画
            // 敌人死亡
            // enemy.destroyEnemy();

            // let hitShot = parseInt(localStorage.getItem("hitShot")) || 0;
            // console.log(hitShot);
            // let shot = hitShot + 1;
            // localStorage.setItem("hitShot", shot.toString());
            // 播放精确命中动画
            eventCenter.emit(JJWXR_Events.SHOWPRECISEHIT);
            console.log("精确命中");
            JJWXR_SucceedUI.hitShot++;

            eventCenter.emit(JJWXR_Events.ENEMY_DESTROY, hit.collider.node.parent);
        }
    }

    // 生成命中特效
    private spawnHieEffect(position: Vec3) {
        // 实例化特效
        const effect = instantiate(this.bulletEffect);
        // 添加到场景中
        director.getScene().addChild(effect);
        // 设置特效位置
        effect.setPosition(position);

        // 延迟销毁
        this.scheduleOnce(() => {
            effect.destroy();
        }, 1.2);
    }

    // 销毁子弹
    destroyBullet() {
        this.node.destroy();
    }
}