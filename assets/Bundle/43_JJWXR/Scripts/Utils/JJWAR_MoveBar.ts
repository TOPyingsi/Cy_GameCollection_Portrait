import { _decorator, Component, Label, Node, randomRangeInt, Vec3 } from 'cc';
import { eventCenter } from './JJWXR_EventCenter';
import { JJWXR_Events } from './JJWXR_Events';
const { ccclass, property } = _decorator;

@ccclass('JJWAR_MoveBar')
export class JJWAR_MoveBar extends Component {
    @property(Node)
    private startPos: Node = null;

    @property(Node)
    private endPos: Node = null;

    @property(Label)
    private moneyLabel: Label = null;

    private speed = 500;
    private isMoving = true;
    private dir = true;
    private money = 50;

    start() {
        this.node.setPosition(this.startPos.position);
        eventCenter.on(JJWXR_Events.STOP_MOVE_BAR, this.onStop, this);  // 监听停止移动事件
    }

    onDestroy() {
        eventCenter.off(JJWXR_Events.STOP_MOVE_BAR, this.onStop, this); // 取消监听停止移动事件
    }

    update(deltaTime: number) {
        if (!this.isMoving) return;
        // 判断是否到达目标位置
        if (this.dir && this.node.position.x >= this.endPos.position.x) {
            this.dir = false;
        }
        if (!this.dir && this.node.position.x <= this.startPos.position.x) {
            this.dir = true;
        }
        // 计算目标位置
        const targetPos = this.dir ? this.endPos.position : this.startPos.position;
        let moveDistance = 1;
        if (this.dir) {
            // 计算移动距离
            moveDistance = this.speed * deltaTime;
        } else {
            // 计算移动距离
            moveDistance = -this.speed * deltaTime;
        }
        const distance = this.node.position.x + moveDistance;
        // 更新节点位置
        this.node.setPosition(distance, this.node.position.y, this.node.position.z);

        if (this.node.position.x >= this.endPos.position.x * 0.75 || this.node.position.x <= this.startPos.position.x * 0.75) {
            this.onGetMoney(2);
        } else if (this.node.position.x >= this.endPos.position.x * 0.5 || this.node.position.x <= this.startPos.position.x * 0.5) {
            this.onGetMoney(3);
        } else if (this.node.position.x >= this.endPos.position.x * 0.25 || this.node.position.x <= this.startPos.position.x * 0.25) {
            this.onGetMoney(4);
        } else {
            this.onGetMoney(5);
        }

        // this.onGetMoreMoney();
    }

    // 停止移动
    onStop() {
        this.isMoving = false;
        eventCenter.emit(JJWXR_Events.GET_MORE_MONEY, this.money); // 发送获取更多金钱事件
    }

    // 获取更多金钱
    onGetMoney(mul: number) {
        let money = 50;
        money = money * mul;
        this.money = money;
        this.moneyLabel.string = this.money.toString();
    }

    // 获取更多金钱
    onGetMoreMoney() {
        this.money = 50;
        let random = randomRangeInt(2, 5) + 1;
        this.money = this.money * random;
        this.moneyLabel.string = this.money.toString();
    }
}