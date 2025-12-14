import { _decorator, Camera, Color, Component, director, EPhysics2DDrawFlags, EventTouch, game, geometry, Input, Line, math, Node, PhysicsSystem, RigidBody, Vec2, Vec3, view } from 'cc';
import { SXZW_PlayManage } from './SXZW_PlayManage';
import { SXZW_RoundEnum } from './SXZW_RoundEnum';
import { SXZW_WeaponPrefab } from './SXZW_WeaponPrefab';
import { SXZW_Utils } from './SXZW_Utils';
import { SXZW_RoleControl } from './SXZW_RoleControl';
import { SXZW_PlayerControl } from './SXZW_PlayerControl';
const { ccclass, property } = _decorator;

@ccclass('SXZW_ThrowManage')
export class SXZW_ThrowManage extends Component {

    @property(Node)
    touchNode: Node = null;

    private weaponPrefab: SXZW_WeaponPrefab = null;

    touchStartPos: Vec2;

    @property(Line)
    line: Line = null;

    private currentVelocity = new Vec3();

    public get getCurrentVelocity() {
        return this.currentVelocity;
    }

    @property({ type: Number })
    minTountLen: number = 15;
    @property({ type: Number })
    maxTountLen: number = 100;
    @property({ type: Number })
    maxPower: number = 100;


    start() {
        //PhysicsSystem.instance.debugDrawFlags = PhysicsSystem.PhysicsGroup.DEFAULT
    }

    protected onEnable(): void {
        this.touchNode.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchNode.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchNode.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchNode.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    update(deltaTime: number) {
        if (SXZW_PlayManage.Instance.round === SXZW_RoundEnum.Player && this.weaponPrefab == null) {
            this.weaponPrefab = SXZW_PlayManage.Instance.playerChooseWeapon;
        }
    }

    private onTouchStart(event: EventTouch) {
        if (SXZW_PlayManage.Instance.round === SXZW_RoundEnum.Player && this.weaponPrefab) {
            this.line.enabled = true;
            this.touchStartPos = event.getLocation().clone();
            this.updataLine(event, this.weaponPrefab.getLaunchPos(SXZW_PlayManage.Instance.currentPlayer.role.spawnPoint));
        }
    }

    private onTouchMove(event: EventTouch) {
        if (SXZW_PlayManage.Instance.round === SXZW_RoundEnum.Player && this.weaponPrefab) {
            this.updataLine(event, this.weaponPrefab.getLaunchPos(SXZW_PlayManage.Instance.currentPlayer.role.spawnPoint));
        }
    }

    private onTouchEnd(event: EventTouch) {
        if (SXZW_PlayManage.Instance.round === SXZW_RoundEnum.Player && this.weaponPrefab) {
            this.line.enabled = false;
            SXZW_PlayManage.Instance.round = SXZW_RoundEnum.PlayerFinish
            const weaponPrefab = this.weaponPrefab;
            this.weaponPrefab = null
            weaponPrefab.role = SXZW_PlayManage.Instance.currentPlayer.role;
            weaponPrefab.launch(
                SXZW_PlayManage.Instance.currentLevel.node,
                weaponPrefab.getLaunchPos(SXZW_PlayManage.Instance.currentPlayer.role.spawnPoint),
                this.currentVelocity
            );
            if (weaponPrefab.isEemitter) {
                SXZW_PlayManage.Instance.currentPlayer.role.stand();
            } else {
                SXZW_PlayManage.Instance.currentPlayer.role.throw();
            }
        }
    }

    updataLine(event: EventTouch, startPos: Vec3) {
        if (this.touchStartPos) {
            const endTouch = event.getLocation();
            this.currentVelocity = this.computeVelocityFromTouch(this.touchStartPos.clone(), endTouch.clone());
            let len = Vec2.subtract(new Vec2(), endTouch.clone(), this.touchStartPos).length()
            this.updataLine2(len, startPos, this.currentVelocity);
        }
    }

    updataLine2(len: number, startPos: Vec3, v: Vec3) {
        len = math.lerp(1, 36, math.clamp01(math.clamp(len, 0, this.maxTountLen) / this.maxTountLen)); // 限制点数量范围
        const trajectoryPoints = this.simulateTrajectory(
            startPos,
            v,
            PhysicsSystem.instance.gravity,
            2 / 60,
            60,
            len
        );

        this.line.tile = new Vec2(len / this.line.width.getMax(), 1);
        this.line.positions = trajectoryPoints;
    }

    simulateTrajectory(start: Vec3, velocity: Vec3, gravity: Vec3, stepSec: number, count: number, len: number): Vec3[] {
        const points: Vec3[] = [];
        let currentLen = 0;
        let lastPoint = start.clone();
        for (let i = 0; i < count; i++) {
            const t = stepSec * i;
            const x = start.x + velocity.x * t + 0.5 * gravity.x * t * t;
            const y = start.y + velocity.y * t + 0.5 * gravity.y * t * t;
            const z = start.z + velocity.z * t + 0.5 * gravity.z * t * t;
            points.push(new Vec3(x, y, z));
            currentLen += Vec3.subtract(new Vec3(), new Vec3(x, y, z), lastPoint).length();
            lastPoint = new Vec3(x, y, z);
            if (currentLen > len) {
                break;
            }
        }
        return points;
    }

    simulateTrajectoryAi(start: Vec3, targetWorldPos: Vec3, velocity: Vec3, gravity: Vec3): boolean {
        let lastPos = start.clone()
        for (let i = 1; i < 999; i++) {
            const t = 0.1 * i;
            if (t > 5) return false;
            const x = start.x + velocity.x * t + 0.5 * gravity.x * t * t;
            const y = start.y + velocity.y * t + 0.5 * gravity.y * t * t;
            const z = start.z + velocity.z * t + 0.5 * gravity.z * t * t;

            if (x - targetWorldPos.x < lastPos.x - targetWorldPos.x) {
                const ray = new geometry.Ray();
                geometry.Ray.fromPoints(ray, lastPos, new Vec3(x, y, z));

                const maxDistance = Vec3.distance(lastPos, new Vec3(x, y, z));
                const result = PhysicsSystem.instance.raycast(ray, 0b1010001110, maxDistance);
                if (result) {
                    let b = false;
                    PhysicsSystem.instance.raycastResults.forEach((prr) => {
                        if ((prr.collider.getGroup() === 2)) {
                            let r = prr.collider.node.getComponent(SXZW_PlayerControl)
                            if (!r) r = SXZW_Utils.getComponentInParent(prr.collider.node, SXZW_PlayerControl);
                            if (r) {
                                b = true // 检测到目标
                                //console.log("检测到玩家 " + r)
                                return;
                            } else {
                                //console.log("检测到自身 " + r)
                            }
                        }
                    })
                    if (b || i > 1) return b;
                }
            } else if (i > 2) {
                return false;
            }
            lastPos = new Vec3(x, y, z);
        }
        return false;
    }

    computeVelocityFromTouch(start: Vec2, end: Vec2): Vec3 {
        const dragVec = end.subtract(start);
        const dragDir = dragVec.clone().normalize();

        const dragLength = math.clamp(dragVec.length(), this.minTountLen, this.maxTountLen);

        const angleRad = Math.atan2(dragDir.y, dragDir.x);

        SXZW_PlayManage.Instance.currentPlayer.role.setRorate(angleRad * 180 / Math.PI)
        return this.computeVelocityFromTouch2(dragLength, angleRad, this.weaponPrefab.data.levelData.pushForce / this.weaponPrefab.velocityScaling)
    }

    computeVelocityFromTouch2(dragLength: number, angleRad: number, pow: number) {
        const power = math.clamp01(dragLength / this.maxTountLen) * (pow + 60);

        const velocityX = Math.cos(angleRad) * power;
        const velocityY = Math.sin(angleRad) * power;
        const velocityZ = 0;

        return new Vec3(velocityX, velocityY, velocityZ);
    }

    aiTest(startPos: Vec3, targetWorldPos: Vec3, dragLength: number, angleRad: number, pow: number) {
        const v = this.computeVelocityFromTouch2(dragLength, angleRad * (Math.PI / 180), pow);
        return this.simulateTrajectoryAi(startPos, targetWorldPos, v, PhysicsSystem.instance.gravity);
    }

    onDisable() {
        this.touchNode.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchNode.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchNode.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchNode.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}


