import { _decorator, Component, Node, Vec3, Animation, SkeletalAnimation } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events'
const { ccclass, property } = _decorator;

@ccclass('JJWXR_LoadGun')
export class JJWXR_LoadGun extends Component {
    private index: number = 0; // 当前枪的索引
    @property({ type: Node })
    private gun: Node[] = [];

    onLoad() {
        eventCenter.on(JJWXR_Events.GUN_RELOAD, this.reloadGun, this);  // 监听枪械换弹事件
        eventCenter.on(JJWXR_Events.GUN_CHANGE, this.updateGun, this);  // 监听枪械更换事件
    }

    start() {
        this.updateGun();
    }

    onDestroy() {
        eventCenter.off(JJWXR_Events.GUN_RELOAD, this.reloadGun, this); // 取消监听枪械换弹事件
        eventCenter.off(JJWXR_Events.GUN_CHANGE, this.updateGun, this); // 取消监听枪械更换事件
    }

    // 更新枪械信息
    public updateGun() {
        let gunIdex = parseInt(localStorage.getItem("gunIndex"));
        console.log(gunIdex);
        if (gunIdex) {
            this.index = gunIdex - 1;
        }
        for (let i = 0; i < this.gun.length; i++) {
            if (i == this.index) {
                this.gun[i].active = true;
            }
            else {
                this.gun[i].active = false;
            }
        }
    }

    // 换弹动画
    public reloadGun() {
        this.gun[this.index].getComponent(SkeletalAnimation).play(); // 播放动画
    }
}