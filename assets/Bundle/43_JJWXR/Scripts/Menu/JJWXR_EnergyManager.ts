import { _decorator, Component, Node, Label, Button } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_EnergyManager')
export class JJWXR_EnergyManager extends Component {
    @property(Label)
    private energyLabel: Label = null; // 绑定到场景中的能量标签
    @property(Button)
    private getEnergyButton: Button = null; // 绑定到场景中的获取能量按钮

    private energyNum: number = 0; // 能量数量

    private static _instance: JJWXR_EnergyManager = null;
    public static get instance(): JJWXR_EnergyManager {
        return this._instance;
    }
    onLoad() {
        JJWXR_EnergyManager._instance = this; // 单例模式

        // 读取本地存储的能量数量
        // this.energyNum = parseInt(localStorage.getItem('energy') || '5');
        let data = localStorage.getItem('energy');
        this.energyNum = 15;
        if(data != null && data != "")this.energyNum = parseInt(data);
        if (this.energyNum > 20) {
            eventCenter.emit(JJWXR_Events.ENERGY_FULL); // 能量已满
        }
    }

    start() {
        this.updateEnergyLabel(); // 初始化能量标签
        this.getEnergyButton.node.on(Button.EventType.CLICK, this.getEnergyUI, this); // 监听获取能量按钮点击事件
        eventCenter.on(JJWXR_Events.UPDATE_ENERGY, this.updateEnergyLabel, this); // 监听能量更新事件
        eventCenter.on(JJWXR_Events.GET_ENERGY, this.getEnergy, this); // 监听获取能量事件
        eventCenter.on(JJWXR_Events.GET_MORE_ENERGY, this.getMoreEnergy, this); // 监听获取能量事件
        eventCenter.on(JJWXR_Events.USE_ENERGY, this.useEnergy, this); // 监听使用能量事件
        if (this.energyNum < 20) {
            eventCenter.emit(JJWXR_Events.ENERGY_NOT_FULL); // 能量未满
        }
    }

    onDestroy() {
        eventCenter.off(JJWXR_Events.UPDATE_ENERGY, this.updateEnergyLabel, this); // 移除事件监听
        eventCenter.off(JJWXR_Events.GET_ENERGY, this.getEnergy, this); // 移除事件监听
        eventCenter.off(JJWXR_Events.GET_MORE_ENERGY, this.getMoreEnergy, this); // 移除事件监听
        eventCenter.off(JJWXR_Events.USE_ENERGY, this.useEnergy, this); // 移除事件监听
    }

    update() {
    }

    // 获取能量UI
    private getEnergyUI() {
        eventCenter.emit(JJWXR_Events.SHOW_ADD_ENERGY_UI); // 显示获取能量界面
    }

    // 获取能量数量
    public getEnergyNum(): number {
        // 返回能量数量
        return this.energyNum;
    }

    // 更新能量标签的方法
    private updateEnergyLabel() {
        this.energyLabel.string = this.energyNum.toString();
    }

    // 增加能量的方法
    private getEnergy() {

        if (this.energyNum > 19) {
            eventCenter.emit(JJWXR_Events.ENERGY_FULL); // 能量已满
        }
        else {
            this.energyNum += 1;
        }
        localStorage.setItem('energy', this.energyNum.toString());
        this.updateEnergyLabel();
    }

    // 增加能量的方法
    private getMoreEnergy() {
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            x.addEnergy(5);
            x.updateEnergyLabel();
            eventCenter.emit(JJWXR_Events.HIDE_ADD_ENERGY_UI); // 显示获取能量界面
        })
    }

    // 减少能量的方法
    private useEnergy() {
        if (this.energyNum <= 0) {
            eventCenter.emit(JJWXR_Events.SHOW_WARNING_UI); // 显示FailedUI警告界面
            return;
        }
        this.addEnergy(-1);
        this.updateEnergyLabel();
    }

    // 增加能量
    public addEnergy(addEnergy: number) {
        let x = this;
        x.energyNum += addEnergy;
        if (x.energyNum > 30) {
            x.energyNum = 30;
        }
        // 保存能量数量到本地存储
        localStorage.setItem('energy', x.energyNum.toString());
    }
}