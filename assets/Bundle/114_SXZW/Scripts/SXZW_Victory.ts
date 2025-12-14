import { _decorator, Component, Label, math, Node, Sprite, Vec2, Vec3 } from 'cc';
import { SXZW_PlayManage } from './SXZW_PlayManage';
import { SXZW_GameManage } from './SXZW_GameManage';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('SXZW_Victory')
export class SXZW_Victory extends Component {

    @property(Sprite)
    bgSprite: Sprite = null

    @property(Label)
    moneyLabel: Label = null

    @property(Node)
    button: Node = null

    @property(Node)
    x2button: Node = null

    @property(Node)
    moneyList: Node[] = []

    @property(Node)
    topMoneyPos: Node = null

    private spriteRotateCircleTime = 2;
    private spriteRotateTime = 0;

    private moneyAnim1UseTime = 0.1;
    private moneyAnim2UseTime = 0.3;
    private moneyAnim3UseTime = 0.7;
    private moneyAnimTime = 0;
    private moneyAnimUseTimeList = []

    moneyPos: Vec3[] = []

    moneyAinm = 0;
    private money = 0;
    private finishMoney = 0;

    private buttonWorldPos = null;

    start() {
        this.moneyList.forEach((m) => {
            this.moneyPos.push(m.worldPosition.clone())
            m.active = false;
        }, this);
        this.buttonWorldPos = this.button.worldPosition.clone();
    }

    update(deltaTime: number) {
        const t = this.spriteRotateTime / this.spriteRotateCircleTime;
        this.bgSprite.node.angle = math.lerp(0, 360, t)
        if (t >= 1) {
            this.spriteRotateTime = 0;
        } else {
            this.spriteRotateTime += deltaTime;
        }
        if (this.moneyAinm === 1) {
            let next = 1;
            for (let index = 0; index < this.moneyList.length; index++) {
                const t1 = math.clamp01(this.moneyAnimTime / this.moneyAnimUseTimeList[index]);
                this.moneyList[index].setWorldPosition(
                    Vec3.lerp(new Vec3, this.button.worldPosition, this.moneyPos[index], t1));
                next = Math.min(t1, next)
            }
            this.money = Math.round(math.lerp(this.money, 0, next))
            this.moneyLabel.string = "" + this.money;
            if (next >= 1) {
                this.moneyAinm = 2;
                this.moneyAnimTime = 0;
            } else {
                this.moneyAnimTime += deltaTime;
            }
        } else if (this.moneyAinm === 2) {
            if (this.moneyAnimTime >= this.moneyAnim2UseTime) {
                this.moneyAinm = 3;
                this.moneyAnimTime = 0;
            } else {
                this.moneyAnimTime += deltaTime;
            }
        } else if (this.moneyAinm === 3) {
            const t3 = this.moneyAnimTime / this.moneyAnim3UseTime;
            for (let index = 0; index < this.moneyList.length; index++) {
                this.moneyList[index].setWorldPosition(
                    Vec3.lerp(new Vec3, this.moneyPos[index], this.topMoneyPos.worldPosition, t3));
            }
            if (t3 >= 1) {
                this.moneyAinm = 4;
                this.moneyAnimTime = 0;
                this.moneyList.forEach((m) => {
                    m.active = false;
                }, this);
                SXZW_GameManage.AddCoin(this.finishMoney)
            } else {
                this.moneyAnimTime += deltaTime;
            }
        } else if (this.moneyAinm === 4) {
            if (this.moneyAnimTime >= this.moneyAnim2UseTime) {
                this.moneyAinm = 0;
                this.moneyAnimTime = 0;
                this.node.active = false;
                SXZW_GameManage.Instance.endGame();
            } else {
                this.moneyAnimTime += deltaTime;
            }
        }
    }

    victory(level: number, first: boolean, blood: number) {
        this.node.active = true;
        this.money = this.finishMoney = 20 + level * 10 + (first ? 100 : 0) + Math.floor(blood / 10) * 5;
        this.moneyLabel.string = "" + this.money;
        this.button.once(Node.EventType.TOUCH_END, this.getMoney, this)
        this.x2button.once(Node.EventType.TOUCH_END, this.getMoneyX2, this)
        this.x2button.active = true;
        if (this.buttonWorldPos) this.button.setWorldPosition(this.buttonWorldPos);
    }

    getMoney() {
        if (!this.x2button.active) return;
        this.x2button.active = false;
        this.moneyAnimUseTimeList = []
        for (let index = 0; index < this.moneyList.length; index++) {
            const element = this.moneyList[index];
            element.setWorldPosition(this.button.worldPosition);
            element.active = true;
            this.moneyAnimUseTimeList.push(this.moneyAnim1UseTime * (index + 1))
        }
        this.moneyAinm = 1
    }
    getMoneyX2() {
        Banner.Instance.ShowVideoAd(() => {
            this.money = this.finishMoney = this.finishMoney * 2;
            this.moneyLabel.string = "" + this.money;
            this.button.setWorldPosition(this.x2button.getWorldPosition())
            this.getMoney()
        });
    }

    protected onDisable(): void {
        this.button.off(Node.EventType.TOUCH_END, this.getMoney, this)
        this.x2button.off(Node.EventType.TOUCH_END, this.getMoneyX2, this)
    }

}


