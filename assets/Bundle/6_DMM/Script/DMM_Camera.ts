import { _decorator, Camera, Component, error, Node, Quat, Tween, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DMM_Camera')
export class DMM_Camera extends Component {

    public static Instance: DMM_Camera = null;

    @property(Node)
    Target: Node = null;

    @property({ type: Vec3 })
    Offset1: Vec3 = new Vec3();

    Camera: Camera = null;

    IsMoveTrace: boolean = false;
    IsRotateTrace: boolean = false;
    initialPosition: Vec3 = new Vec3();
    initialRotation: Quat = new Quat();

    private _off: Vec3 = new Vec3(0, 0, 0);
    private _isMove: boolean = false;
    private _targetPos: Vec3 = new Vec3();
    private _forward: Vec3 = new Vec3();

    protected onLoad(): void {
        DMM_Camera.Instance = this;
        this.Camera = this.getComponent(Camera);
        this._targetPos = this.Target.getWorldPosition().clone();
        this._forward = this.Target.forward.clone();
    }

    protected start(): void {
        this._off = this.node.getPosition().clone().subtract(this.Target.getPosition().clone());
        // 记录摄像机的初始位置和旋转
        this.initialPosition = this.node.getWorldPosition().clone();
        this.initialRotation = this.node.getWorldRotation().clone();
    }

    protected update(dt: number): void {
        if (this.Target) {
            // this.move(dt);
            if (this.IsMoveTrace) {
                const targtePos: Vec3 = this.Target.getWorldPosition().clone().add(this._off);
                this.node.setWorldPosition(targtePos);
            } else if (this.IsRotateTrace) {
                this.orientationBuyTarget(this.Target, dt);
            }
        }
    }

    epsilon = 0.1;
    speed = 1

    startMoveTrace(target: Node = null) {
        this.Target = target || this.Target;
        this._off = this.node.getPosition().clone().subtract(this.Target.getPosition().clone());
        this.IsMoveTrace = true;
        this.IsRotateTrace = false;
    }

    startRotateTrace(target: Node = null) {
        this.Target = target || this.Target;
        this.IsMoveTrace = false;
        this.IsRotateTrace = true;
    }

    fov(fov: number, duration: number) {
        // this.unscheduleAllCallbacks();
        if (this.Camera) {
            tween(this.Camera)
                .to(duration, { fov: fov }) // 平滑调整视野角度
                .start();
        }
    }


    move(duration: number) {
        if (this._isMove) return;
        this._isMove = true;
        Tween.stopAllByTarget(this.node);

        const targtePos: Vec3 = this.Target.getWorldPosition().clone().add(this._off);
        // this.node.setWorldPosition(targtePos);
        tween(this.node)
            .to(duration, { worldPosition: targtePos })
            .call(() => {
                this._isMove = false;
            })
            .start();
    }

    /**
     * 摄像机移动到目标位置
     * @param targetPos 目标位置世界坐标
     * @param duration 持续时间
     * @returns 
     */
    moveByTarget(targetPos: Vec3, duration: number, cb: Function = null) {
        tween(this.node)
            .to(duration, { worldPosition: targetPos })
            .call(() => cb && cb())
            .start();
    }

    // moveWithArc(targetPos: Vec3, duration: number, arcHeight: number) {
    //     this.unscheduleAllCallbacks();

    //     const startPos = this.node.worldPosition; // 摄像机当前的位置
    //     const endPos = targetPos.add(this._off); // 最终位置
    //     const midPos = new Vec3(
    //         (startPos.x + endPos.x) / 2,
    //         (startPos.y + endPos.y) / 2 + arcHeight, // 中间点的高度提升，形成弧度
    //         (startPos.z + endPos.z) / 2
    //     );

    //     this._isMove = true;

    //     let elapsedTime = 0;

    //     this.schedule((dt) => {
    //         elapsedTime += dt;
    //         let t = Math.min(elapsedTime / duration, 1); // 计算时间进度（0 ~ 1）

    //         // 应用缓动函数 (ease-in-out)
    //         t = t * t * (3 - 2 * t); // 使用 S 曲线缓动函数（类似 ease-in-out）

    //         // 计算贝塞尔曲线的位置
    //         const x = (1 - t) * (1 - t) * startPos.x +
    //             2 * (1 - t) * t * midPos.x +
    //             t * t * endPos.x;
    //         const y = (1 - t) * (1 - t) * startPos.y +
    //             2 * (1 - t) * t * midPos.y +
    //             t * t * endPos.y;
    //         const z = (1 - t) * (1 - t) * startPos.z +
    //             2 * (1 - t) * t * midPos.z +
    //             t * t * endPos.z;

    //         this.node.setWorldPosition(new Vec3(x, y, z));

    //         // 如果动画完成，停止调度
    //         if (t >= 1) {
    //             this._isMove = false;
    //             this.unscheduleAllCallbacks();
    //         }
    //     }, 0); // 每帧更新
    // }

    // moveWithArcAndRotate(targetPos: Vec3, duration: number, arcHeight: number, lookAtTarget: Vec3) {
    //     this.unscheduleAllCallbacks();

    //     const startPos = this.node.worldPosition; // 摄像机当前的位置
    //     const endPos = targetPos.add(this._off); // 最终位置
    //     const midPos = new Vec3(
    //         (startPos.x + endPos.x) / 2,
    //         (startPos.y + endPos.y) / 2 + arcHeight, // 中间点的高度提升，形成弧度
    //         (startPos.z + endPos.z) / 2
    //     );

    //     this._isMove = true;
    //     let elapsedTime = 0;

    //     this.schedule((dt) => {
    //         elapsedTime += dt;
    //         let t = Math.min(elapsedTime / duration, 1);

    //         // 使用缓动函数
    //         t = t * t * (3 - 2 * t);

    //         // 贝塞尔曲线插值计算位置
    //         const x = (1 - t) * (1 - t) * startPos.x +
    //             2 * (1 - t) * t * midPos.x +
    //             t * t * endPos.x;
    //         const y = (1 - t) * (1 - t) * startPos.y +
    //             2 * (1 - t) * t * midPos.y +
    //             t * t * endPos.y;
    //         const z = (1 - t) * (1 - t) * startPos.z +
    //             2 * (1 - t) * t * midPos.z +
    //             t * t * endPos.z;

    //         this.node.setWorldPosition(new Vec3(x, y, z));

    //         // 动态调整摄像机朝向
    //         const lookDirection = lookAtTarget.subtract(new Vec3(x, y, z)).normalize();
    //         this.node.lookAt(lookDirection);

    //         // 结束移动
    //         if (t >= 1) {
    //             this._isMove = false;
    //             this.unscheduleAllCallbacks();
    //         }
    //     }, 0); // 每帧更新
    // }

    /**
     * 旋转到正前方
     * @param duration 旋转时间
     * @param onComplete 回调函数
     */
    rotateAndMoveToTarget(duration: number, onComplete: Function = null) {
        this.IsMoveTrace = false;

        // 计算目标位置
        // const targetPosition = this.Target.getWorldPosition().clone();
        const targetPosition = this._targetPos.clone();


        // 动态计算固定距离
        // const fixedDistance = this.initialPosition.subtract(targetPosition).length();
        const fixedDistance = 5;

        const forward = this._forward.clone(); // 玩家朝向的正前方向
        let targetCameraPosition = targetPosition.subtract(forward.multiplyScalar(fixedDistance));

        // 如果需要调整高度偏移，可在此处修改 targetCameraPosition 的 y 值
        targetCameraPosition = new Vec3(targetCameraPosition.x, targetCameraPosition.y, targetCameraPosition.z);

        // 计算目标旋转
        const direction = targetPosition.subtract(targetCameraPosition).normalize(); // 指向玩家的方向
        const targetRotation = Quat.fromViewUp(new Quat(), direction, Vec3.UP); // 目标旋转

        let elapsedTime = 0;

        // 更新函数
        const updateToTarget = (dt) => {
            elapsedTime += dt;

            // 计算插值因子
            const t = Math.min(elapsedTime / duration, 1); // 确保 t 不超过 1

            // 位置插值
            const currentPosition = new Vec3();
            Vec3.lerp(currentPosition, this.initialPosition, targetCameraPosition, t);

            // 旋转插值
            const currentRotation = new Quat();
            Quat.slerp(currentRotation, this.initialRotation, targetRotation, t);

            // 应用到摄像机
            this.node.setWorldPosition(currentPosition);
            this.node.setWorldRotation(currentRotation);

            // 停止更新并执行回调
            if (t >= 1) {
                this.unschedule(updateToTarget);
                if (onComplete) onComplete();
            }
        };

        // 开始调度
        this.schedule(updateToTarget, 0);
    }

    /**
     * 旋转到初始位置
     * @param duration 旋转时间
     * @param onComplete 回调函数
     */
    returnToInitialPosition(duration: number, onComplete: Function = null) {
        // 确保初始位置和旋转已记录
        if (!this.initialPosition || !this.initialRotation) {
            console.error("Initial position or rotation is not set!");
            return;
        }

        const currentCameraPosition = this.node.getWorldPosition().clone();
        const currentCameraRotation = this.node.getWorldRotation().clone();

        let elapsedTime = 0;

        // 更新函数
        const updateToInitial = (dt) => {
            elapsedTime += dt;

            // 计算插值因子
            const t = Math.min(elapsedTime / duration, 1); // 确保 t 不超过 1

            // 位置插值
            const currentPosition = new Vec3();
            Vec3.lerp(currentPosition, currentCameraPosition, this.initialPosition, t);

            // 旋转插值
            const currentRotation = new Quat();
            Quat.slerp(currentRotation, currentCameraRotation, this.initialRotation, t);

            // 应用到摄像机
            this.node.setWorldPosition(currentPosition);
            this.node.setWorldRotation(currentRotation);

            // 停止更新并执行回调
            if (t >= 1) {
                this.unschedule(updateToInitial);
                if (onComplete) onComplete();
            }
        };

        // 开始调度
        this.schedule(updateToInitial, 0);
    }


    /**
     * 摄像机旋转到玩家后上方
     * @param cb 
     */
    rotateCameraAndMoveToBackTop(cb: Function = null) {
        const centerPos = this.Target.worldPosition; // 角色的世界位置

        // 计算后上方的目标位置（保持不变）
        const targetPosition = new Vec3(
            centerPos.x + this.Offset1.x,
            centerPos.y + this.Offset1.y,
            centerPos.z + this.Offset1.z
        );

        // 计算摄像机指向角色的旋转（保持不变）
        const lookDirection = new Vec3();
        Vec3.subtract(lookDirection, targetPosition, centerPos,);
        lookDirection.normalize();
        const targetRotation = new Quat();
        Quat.fromViewUp(targetRotation, lookDirection, Vec3.UP);

        // 使用 Quat.slerp 实现平滑旋转
        const startRotation = this.node.rotation.clone(); // 摄像机的当前旋转
        tween(this.node)
            .parallel(
                tween(this.node).to(1, { rotation: targetRotation }, { easing: 'sineInOut' }).start(),
                tween(this.node).to(1, { position: targetPosition }, { easing: 'sineOut' }).start(),
            )
            .call(() => {
                this._off = this.node.getPosition().clone().subtract(this.Target.getPosition().clone());
                this.IsMoveTrace = true;
                cb && cb();
            })
            .start();
    }

    /**
     * 摄像机朝向目标
     * @param target 
     */
    orientationBuyTarget(target: Node, duration: number, cb: Function = null) {
        const targetPos = target.getWorldPosition();
        targetPos.add3f(0, 10, 0);
        const cameraPos = this.node.getWorldPosition();
        const dir: Vec3 = new Vec3();
        Vec3.subtract(dir, cameraPos, targetPos);
        dir.normalize();
        const rotation: Quat = Quat.fromViewUp(new Quat(), dir, Vec3.UP);
        tween(this.node)
            .to(duration, { worldRotation: rotation }, { easing: `sineOut` })
            .call(() => {
                cb && cb();
            })
            .start();
    }

    /**
    * 摄像机朝向目标
    * @param target 
    */
    orientationTarget(duration: number, cb: Function = null) {
        if (!this.Target) return;
        const targetPos = this.Target.getWorldPosition();
        // targetPos.add3f(0, 10, 0);
        const cameraPos = this.node.getWorldPosition().clone().add3f(0, -5, 0);
        const dir: Vec3 = new Vec3();
        Vec3.subtract(dir, cameraPos, targetPos);
        dir.normalize();
        const rotation: Quat = Quat.fromViewUp(new Quat(), dir, Vec3.UP);
        tween(this.node)
            .to(duration, { worldRotation: rotation }, { easing: `sineOut` })
            .call(() => {
                cb && cb();
            })
            .start();
        tween(this.node)
            .to(duration, { worldPosition: cameraPos }, { easing: `sineOut` })
            .start();
    }

    originalPosition: Vec3 = new Vec3();
    //屏幕抖动
    shakeScreen(duration: number, magnitude: number) {
        // 保存节点的原始位置
        this.originalPosition.set(this.node.position);

        // 抖动时间计数
        let elapsed = 0;

        // 使用 tween 来实现抖动效果
        const updateShake = () => {
            if (elapsed < duration) {
                // 计算一个随机的偏移量
                const offsetX = (Math.random() - 0.5) * 2 * magnitude;
                const offsetY = (Math.random() - 0.5) * 2 * magnitude;

                // 设置节点的新位置
                this.node.setPosition(
                    this.originalPosition.x + offsetX,
                    this.originalPosition.y + offsetY,
                    this.originalPosition.z
                );

                // 增加计时器
                elapsed += 1 / 60; // 每帧大约为 1/60 秒

                // 下一帧继续抖动
                requestAnimationFrame(updateShake);
            } else {
                // 恢复到原始位置
                this.node.setPosition(this.originalPosition);
            }
        };

        // 开始抖动
        updateShake();
    }

}
