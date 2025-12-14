import { _decorator, Collider2D, Color, color, Component, Contact2DType, ICollisionEvent, IPhysics2DContact, Node, RigidBody2D, Sprite, v2, Vec2 } from 'cc';
import { TLQSH_GameManager } from './TLQSH_GameManager';
import { TLQSH_Enemy } from './TLQSH_Enemy';
const { ccclass, property } = _decorator;

@ccclass('TLQSH_Player')
export class TLQSH_Player extends Component {
    public Speed: number = 5;
    private _rg: RigidBody2D = null;
    private _collider: Collider2D = null;

    public HuoTime: number = 0;//火焰持续时间

    start() {
        this._rg = this.node.getComponent(RigidBody2D);
        this._collider = this.node.getComponent(Collider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this)


    }
    private onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("碰到主角" + otherCollider.node.name);
        switch (otherCollider.node.name) {
            case "Enemy":
                if (this.HuoTime > 0) {//身上有火
                    TLQSH_GameManager.Instance.ShowTip("秦始皇被火烧死！", 1.5);
                    TLQSH_GameManager.Instance.PlayAnimation("秦始皇火烧", 1.66);
                    otherCollider.node.getComponent(TLQSH_Enemy).twenn.stop();
                    this.scheduleOnce(() => { TLQSH_GameManager.Instance.RideQinShiHuang() }, 1.5);
                    this.scheduleOnce(() => { otherCollider.node.active = false; });
                } else {
                    TLQSH_GameManager.Instance.GameOver();
                }
                break;
            case "闪电":
                TLQSH_GameManager.Instance.ShowTip("获得五秒加速暴走", 1.5);
                this.node.getComponent(Sprite).color = new Color("E0FF00");
                this.Speed = 10;
                this.scheduleOnce(() => {
                    this.node.getComponent(Sprite).color = new Color("FFFFFF");
                    this.Speed = 5;
                }, 5)
                this.scheduleOnce(() => { otherCollider.node.active = false; });
                break;
            case "Key":
                TLQSH_GameManager.Instance.ShowTip("获得钥匙，快去门口！", 1.5);
                TLQSH_GameManager.Instance.KeyNum += 1;
                this.scheduleOnce(() => { otherCollider.node.active = false; });
                break;
            case "大门":
                if (TLQSH_GameManager.Instance.KeyNum > 0) {
                    TLQSH_GameManager.Instance.GameWin();
                } else {
                    TLQSH_GameManager.Instance.ShowTip("没有钥匙打不开门！", 1.5);
                }
                break;
            case "火":
                this.GetHuo();
                this.scheduleOnce(() => { otherCollider.node.active = false; })
                break;
            case "冰块":
                TLQSH_GameManager.Instance.ShowTip("秦始皇冷冻六秒", 1.5);
                TLQSH_GameManager.Instance.GameNode.getChildByPath("Map/Enemy").getComponent(TLQSH_Enemy).Freeze(6);
                this.scheduleOnce(() => { otherCollider.node.active = false; })
                break;
            case "冰山":
                TLQSH_GameManager.Instance.ShowTip("秦始皇冷冻八秒，恢复后移速降低8秒", 1.5);
                TLQSH_GameManager.Instance.GameNode.getChildByPath("Map/Enemy").getComponent(TLQSH_Enemy).Freeze(8);
                TLQSH_GameManager.Instance.GameNode.getChildByPath("Map/Enemy").getComponent(TLQSH_Enemy).freezeTime = 16;
                TLQSH_GameManager.Instance.PlayAnimation("秦始皇冰山", 2);
                this.scheduleOnce(() => { otherCollider.node.active = false; })
                break;
            case "恐吓药水":
                TLQSH_GameManager.Instance.PlayAnimation("秦始皇惊吓", 1.8);
                TLQSH_GameManager.Instance.GameNode.getChildByPath("Map/Enemy").getComponent(TLQSH_Enemy).twenn.stop();
                this.scheduleOnce(() => { TLQSH_GameManager.Instance.RideQinShiHuang() }, 2);
                this.scheduleOnce(() => { TLQSH_GameManager.Instance.GameNode.getChildByPath("Map/Enemy").active = false; });
                this.scheduleOnce(() => { otherCollider.node.active = false; })
                break;
        }
    }
    update(deltaTime: number) {
        if (this.HuoTime > 0) {
            this.HuoTime -= deltaTime;
            if (this.HuoTime <= 0) {
                this.node.getChildByName("火").active = false;
            }
        }
    }

    move(x: number, y: number, radius: number) {
        if (this._rg && TLQSH_GameManager.Instance.GamePause == false) {
            this._rg.linearVelocity = v2(x, y).multiplyScalar(this.Speed);
        }
    }
    Stop() {
        if (this._rg) {
            this._rg.linearVelocity = v2(0, 0)
        }
    }

    //获得火焰buff
    GetHuo() {
        this.HuoTime = 3;
        this.node.getChildByName("火").active = true;
    }
}


