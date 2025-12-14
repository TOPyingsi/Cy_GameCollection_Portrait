import { _decorator, Component, Node, Label } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_MenuTimeCountDown')
export class JJWXR_MenuTimeCountDown extends Component {

    @property(Label)
    countDownTimeLabel: Label = null; // 绑定到场景中的Label组件

    private endTime: number = 0; // 倒计时结束的时间点（毫秒）
    private interval: number = 600; // 倒计时间隔
    private isCounting: boolean = false; // 是否正在倒计时
    private isEnergyFull: boolean = false; // 是否能量满

    start() {
        // TODO: 读取剩余时间
        if (!this.isEnergyFull) {
            this.startCountdown(this.interval); // 启动倒计时
        }
        eventCenter.on(JJWXR_Events.STOP_COUNTDOWN, this.stopCountdown, this); // 监听停止倒计时事件
        eventCenter.on(JJWXR_Events.ENERGY_FULL, this.energyFull, this); // 监听开始倒计时事件
        eventCenter.on(JJWXR_Events.ENERGY_NOT_FULL, this.energyNotFull, this); // 监听获取能量事件
    }

    onDestroy() {
        eventCenter.off(JJWXR_Events.STOP_COUNTDOWN, this.stopCountdown, this); // 取消监听停止倒计时事件
        eventCenter.off(JJWXR_Events.ENERGY_FULL, this.energyFull, this); // 取消监听开始倒计时事件
        eventCenter.off(JJWXR_Events.ENERGY_NOT_FULL, this.energyNotFull, this); // 取消监听获取能量事件
    }
    // 每帧更新
    update() {
        if (!this.isCounting) return;

        // 计算剩余时间（毫秒）
        const remainingTime = this.endTime - Date.now();
        // 如果剩余时间小于等于0，则倒计时结束
        if (remainingTime <= 0) {
            this.stopCountdown(); // 倒计时结束
            this.countDownTimeLabel.string = "00:00"; // 显示倒计时结束
            if (this.isEnergyFull) {
                this.countDownTimeLabel.string = "00:00"; // 显示倒计时结束
                return;
            } else {
                eventCenter.emit(JJWXR_Events.GET_ENERGY); // 发送获取能量事件
                this.startCountdown(this.interval); // 重新开始倒计时
            }
            return;
        }
        // 将剩余时间转换为秒
        const remainingSeconds = Math.floor(remainingTime / 1000);

        // 计算分钟和秒
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        // 格式化时间
        const formattedTime = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        // 更新Label显示
        this.countDownTimeLabel.string = formattedTime;
    }

    // 启动倒计时
    startCountdown(totalSeconds: number) {
        // this.remainMenuTime(); // 恢复倒计时
        this.endTime = Date.now() + totalSeconds * 1000; // 计算结束时间
        this.isCounting = true; // 设置倒计时状态为正在倒计时
    }

    // 停止倒计时
    stopCountdown() {
        console.log("停止倒计时");
        this.isCounting = false;
        this.endTime = 0; // 重置结束时间
    }

    // 能量满
    energyFull() {
        this.isEnergyFull = true;
    }
    // 能量未满
    energyNotFull() {
        this.isEnergyFull = false;
    }
}