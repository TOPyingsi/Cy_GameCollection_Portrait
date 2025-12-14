import { _decorator, Component, director, Label, Node, randomRangeInt } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_MoneyManager')
export class JJWXR_MoneyManager extends Component {
    @property(Label)
    private moneyLabel: Label = null;

    public static money: number = 0;
    public static get Money() {
        return this.money;
    }
    public static set Money(value: number) {
        this.money = value;
        eventCenter.emit("UpdateMoneyLabel");
    }

    onLoad() {
        // 读取本地存储的金币数量
        let num = localStorage.getItem('money');
        if (num == null || num == undefined || num == '') {
            localStorage.setItem('money', '0');
        }
        JJWXR_MoneyManager.Money = parseInt(localStorage.getItem('money') || '0');
    }

    start() {
        this.updateMoneyLabel();
        if (this.node.parent.name == "ArmoryUI" && director.getScene().name == "JJWXR_MenuScene") return eventCenter.on("UpdateMoneyLabel", this.updateMoneyLabel, this);
        eventCenter.on(JJWXR_Events.GET_MORE_REWARD_SCENE, this.getMoreRewardMoney, this);
        eventCenter.on(JJWXR_Events.GET_SUCCEED_MONEY, this.getSucceedMoney, this);
        eventCenter.on(JJWXR_Events.GET_MORE_MONEY, this.getMoreMoney, this);
        eventCenter.on(JJWXR_Events.SUB_MONEY, this.subMoney, this);
    }

    onDestroy() {
        eventCenter.off("UpdateMoneyLabel", this.updateMoneyLabel, this);
        eventCenter.off(JJWXR_Events.GET_MORE_REWARD_SCENE, this.getMoreRewardMoney, this);
        eventCenter.off(JJWXR_Events.GET_SUCCEED_MONEY, this.getSucceedMoney, this);
        eventCenter.off(JJWXR_Events.GET_MORE_MONEY, this.getMoreMoney, this);
        eventCenter.off(JJWXR_Events.SUB_MONEY, this.subMoney, this);
    }

    // 更新金币标签的方法
    updateMoneyLabel() {
        this.moneyLabel.string = JJWXR_MoneyManager.Money.toString();
    }

    // 获取金币的方法
    getMoreRewardMoney(money: number) {
        this.addMoney(money);
        this.updateMoneyLabel();
    }

    // 获取金币的方法
    getSucceedMoney() {
        let money = 50;
        this.addMoney(money);
        this.updateMoneyLabel();
    }

    // 获取金币的方法
    getMoreMoney() {
        ProjectEventManager.emit(ProjectEvent.弹出窗口);
        this.addMoney(200);
        this.updateMoneyLabel();
    }

    // 添加金币的方法
    addMoney(addMoney: number) {
        JJWXR_MoneyManager.Money += addMoney;
        if (JJWXR_MoneyManager.Money > 999999) {
            JJWXR_MoneyManager.Money = 999999;
        }
        // 保存金币数量到本地存储
        localStorage.setItem('money', JJWXR_MoneyManager.Money.toString());
    }

    // 扣除金币的方法
    subMoney(subMoney: number) {
        JJWXR_MoneyManager.Money -= subMoney;
        localStorage.setItem('money', JJWXR_MoneyManager.Money.toString());
        this.updateMoneyLabel();
    }
}