import { _decorator, Color, Component, math, Node, randomRangeInt, Vec2 } from 'cc';
import { SXZW_RoleControl } from './SXZW_RoleControl';
import { SXZW_PlayManage } from './SXZW_PlayManage';
import { SXZW_RoundEnum } from './SXZW_RoundEnum';
import { SXZW_WeaponPrefab } from './SXZW_WeaponPrefab';
const { ccclass, property } = _decorator;

@ccclass('SXZW_AiControl')
export class SXZW_AiControl extends Component {

    private _role: SXZW_RoleControl
    public get role() {
        if (this._role == null) {
            this._role = this.getComponent(SXZW_RoleControl)
        }
        return this._role;
    }

    private angle = -70;

    private readyThrow = false;
    private calculateThrow = false;

    public aiWisdom = 50;

    private weapon: SXZW_WeaponPrefab = null
    private waitFrame = 0;

    start() {
        this.role.angle = this.angle;
    }

    update(deltaTime: number) {
        if (this.waitFrame > 0) {
            this.waitFrame--;
            return;
        }
        if (SXZW_PlayManage.Instance.round === SXZW_RoundEnum.Enemy && !this.role.animPlaying && !this.readyThrow && !this.calculateThrow) {
            this.weapon = SXZW_PlayManage.Instance.aiChoose();
            this.role.readyThrow()
            this.readyThrow = true;
            this.waitFrame = 1;
        } else if (this.readyThrow && !this.calculateThrow) {
            this.readyThrow = false;
            this.calculateThrow = true;
            const minLen = SXZW_PlayManage.Instance.throwManage.minTountLen;
            const maxLen = SXZW_PlayManage.Instance.throwManage.maxTountLen;

            let maxAngle, minAngle;

            const x = SXZW_PlayManage.Instance.currentPlayer.node.worldPosition.x;
            const x2 = this.node.worldPosition.x;
            if (x > x2) {
                maxAngle = 90;
                minAngle = -90;
            } else {
                maxAngle = 270;
                minAngle = 90
            }

            let finishLen = null
            let finishAnage = null
            const dataList = []

            if (this.aiWisdom >= 50 || randomRangeInt(-5, 6) <= Math.ceil(this.aiWisdom / 10)) {
                const sep = math.lerp(8, 3, randomRangeInt(0, 100) < Math.max(this.aiWisdom, 20) ? 1 : math.clamp01(this.aiWisdom / 100))
                //const startTime = performance.now();
                for (let angle = minAngle; angle < maxAngle; angle += sep) {
                    this.role.setRorate(angle)
                    this.role.node.updateWorldTransform()
                    const v3 = this.weapon.getLaunchPos(this.role.spawnPoint);
                    v3.z = SXZW_PlayManage.Instance.currentLevel.node.worldPosition.z;
                    for (let len = minLen; len < maxLen; len += sep) {
                        const b = SXZW_PlayManage.Instance.throwManage.aiTest(
                            v3,
                            SXZW_PlayManage.Instance.currentPlayer.role.headCollider.node.getWorldPosition().clone(),
                            len,
                            angle,
                            this.weapon.data.levelData.pushForce / this.weapon.velocityScaling
                        );
                        if (b) {
                            dataList.push(new Vec2(angle, len))
                        }
                    }
                    /* if (finishAnage) {
                        break
                    } */
                }
            }

            /* const endTime = performance.now();
            const duration = endTime - startTime;
            console.log("Ai检测结果 数量：" + dataList.length + " 使用时间ms " + duration) */

            if (dataList.length > 0) {
                const finishData = randomRangeInt(0, 100) < this.aiWisdom ? dataList[math.clamp(Math.round(dataList.length / 2), 0, dataList.length - 1)] : dataList[math.randomRangeInt(0, dataList.length)]
                finishAnage = finishData.x;
                finishLen = finishData.y;
            }

            if (!finishAnage) {
                console.log("无结果")
                finishAnage = math.randomRange(minAngle + 20, maxAngle - 20)
                finishLen = math.randomRange(minLen, maxLen)
            }

            this.role.setRorate(finishAnage)
            this.role.node.updateWorldTransform();

            const v3 = this.weapon.getLaunchPos(this.role.spawnPoint)
            SXZW_PlayManage.Instance.throwManage.line.enabled = true;
            const v = SXZW_PlayManage.Instance.throwManage.computeVelocityFromTouch2(finishLen, finishAnage * (Math.PI / 180), this.weapon.data.levelData.pushForce / this.weapon.velocityScaling)
            SXZW_PlayManage.Instance.throwManage.updataLine2(finishLen, v3, v)
            v3.z = SXZW_PlayManage.Instance.currentLevel.node.worldPosition.z;
            this.scheduleOnce(() => {
                this.calculateThrow = false;
                SXZW_PlayManage.Instance.round = SXZW_RoundEnum.EnemyFinish
                SXZW_PlayManage.Instance.throwManage.line.enabled = false;
                this.weapon.role = this.role;
                this.weapon.launch(
                    SXZW_PlayManage.Instance.currentLevel.node,
                    v3,
                    v
                )
                if (this.weapon.isEemitter) {
                    this.role.stand()
                } else {
                    this.role.throw()
                }
            }, 1);

        } else if (SXZW_PlayManage.Instance.round === SXZW_RoundEnum.EnemyFinish) {
            /* if (this.test_time < 0) {
                this.test_time = 0.1;
                if (this.test_len < this.test_maxLen) {
                    this.test_len += 5;
                    console.log("开始测试 角度 " + this.test_angle + " 距离 " + this.test_len)
                    this.test = true;
                    const b = PlayManage.Instance.throwManage.aiTest(
                        this.role.spawnPoint.worldPosition.clone(),
                        PlayManage.Instance.currentPlayer.role.spawnPoint.worldPosition.clone(),
                        this.test_len,
                        this.test_angle
                    );
                    this.test = false;
                    if (b) {
                        PlayManage.Instance.round = RoundEnum.None
                        console.log("测试完成")
                    } else {

                    }
                } else {
                    if (this.test_angle < this.test_maxAngle) {
                        this.test_len = this.test_minLen;
                        this.test_angle += 5;
                    } else {
                        PlayManage.Instance.round = RoundEnum.None
                        console.log("结束 无")
                    }
                }

            } else if (!this.test) {
                this.test_time -= deltaTime;
            } */
        }
    }


}


