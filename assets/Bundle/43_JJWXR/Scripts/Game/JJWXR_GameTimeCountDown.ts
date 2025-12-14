import { _decorator, Component, Node, Label } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_GameTimeCountDown')
export class JJWXR_GameTimeCountDown extends Component {

    @property(Label)
    labelCountDownTime: Label = null; // 绑定到场景中的Label组件

    private endTime: number = 0; // 倒计时结束的时间点（毫秒）
    private isCounting: boolean = false; // 是否正在倒计时
    private pausedTime: number = 0; // 暂停时的剩余时间（毫秒）
    allTime = 0;

    start() {
        let curlevel = (parseInt(localStorage.getItem('currentLevel'))) % 6;
        if (curlevel == 0) curlevel = 6;
        // for (let i = 0; i < 6; i++) {
        this.startCountdown(this.endTime); // 启动倒计时
        switch (curlevel) {
            case 1:
                let levelData = JSON.parse(localStorage.getItem('level01'));
                this.endTime = levelData.time;
                this.allTime = levelData.time;
                break;
            case 2:
                let levelData2 = JSON.parse(localStorage.getItem('level02'));
                this.endTime = levelData2.time;
                this.allTime = levelData2.time;
                break;
            case 3:
                let levelData3 = JSON.parse(localStorage.getItem('level03'));
                this.endTime = levelData3.time;
                this.allTime = levelData3.time;
                break;
            case 4:
                let levelData4 = JSON.parse(localStorage.getItem('level04'));
                this.endTime = levelData4.time;
                this.allTime = levelData4.time;
                break;
            case 5:
                let levelData5 = JSON.parse(localStorage.getItem('level05'));
                this.endTime = levelData5.time;
                this.allTime = levelData5.time;
                break;
            case 6:
                let levelData6 = JSON.parse(localStorage.getItem('level06'));
                this.endTime = levelData6.time;
                this.allTime = levelData6.time;
                break;
        }
        // this.endTime = 0;
        this.getTime();
        this.schedule(() => {
            this.getTime();
        }, 1);
        // }

        eventCenter.on(JJWXR_Events.GAME_START, this.startCountdown, this); // 监听游戏开始事件
        eventCenter.on(JJWXR_Events.GAME_STOP, this.pauseCountdown, this); // 监听游戏开始事件
        eventCenter.on(JJWXR_Events.GAME_RESUME, this.resumeCountdown, this); // 监听游戏结束事件
        eventCenter.on(JJWXR_Events.GAME_OVER, this.stopCountdown, this); // 监听游戏暂停事件
    }

    onDestroy() {
        // 在组件销毁时，取消事件监听
        eventCenter.off(JJWXR_Events.GAME_START, this.startCountdown, this);
        eventCenter.off(JJWXR_Events.GAME_STOP, this.pauseCountdown, this);
        eventCenter.off(JJWXR_Events.GAME_RESUME, this.resumeCountdown, this);
        eventCenter.off(JJWXR_Events.GAME_OVER, this.stopCountdown, this);
    }

    // 每帧更新
    update() {
    }

    getTime() {
        // 检查倒计时是否结束
        if (this.isCountdownEnd()) {
            console.log("倒计时结束");
            eventCenter.emit(JJWXR_Events.SHOW_FAILED_UI); // 发送游戏结束事件
        }
        if (!this.isCounting) {
            return;
        }

        // 计算剩余时间（毫秒）
        const remainingTime = this.endTime--;

        if (remainingTime <= 0) {
            this.stopCountdown(); // 倒计时结束
            this.labelCountDownTime.string = "00:00"; // 显示倒计时结束
            return;
        }

        // // 将剩余时间转换为秒
        // const remainingSeconds = Math.floor(remainingTime / 1000);

        // 计算分钟和秒
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        // 格式化时间
        const formattedTime = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        // 更新Label显示
        this.labelCountDownTime.string = formattedTime;
    }

    // 启动倒计时
    startCountdown(totalSeconds: number = 0) {
        // this.endTime = Date.now() + totalSeconds * 1000; // 计算结束时间
        this.endTime += totalSeconds;
        this.isCounting = true;
    }

    // 暂停倒计时
    pauseCountdown() {
        if (this.isCounting) {
            console.log("暂停倒计时");
            // this.pausedTime = this.endTime - Date.now(); // 记录剩余时间
            this.isCounting = false;
        }
    }

    // 恢复倒计时
    resumeCountdown() {
        if (this.pausedTime > 0) {
            // this.endTime = Date.now() + this.pausedTime; // 重新计算结束时间
            this.isCounting = true;
            // this.pausedTime = 0; // 重置暂停时间
        }
    }

    // 停止倒计时, 游戏结束
    stopCountdown() {
        if (this.isCounting) {
            this.isCounting = false;
        }
        else {
            this.isCounting = true;
        }

        let levelTime = 0;
        let curlevel = parseInt(localStorage.getItem('currentLevel')) % 6;
        if (curlevel == 0) curlevel = 6;
        for (let i = 0; i < 6; i++) {
            switch (curlevel) {
                case 1:
                    let levelData = JSON.parse(localStorage.getItem('level01'));
                    levelTime = levelData.time;
                    break;
                case 2:
                    let levelData2 = JSON.parse(localStorage.getItem('level02'));
                    levelTime = levelData2.time;
                    break;
                case 3:
                    let levelData3 = JSON.parse(localStorage.getItem('level03'));
                    levelTime = levelData3.time;
                    break;
                case 4:
                    let levelData4 = JSON.parse(localStorage.getItem('level04'));
                    levelTime = levelData4.time;
                    break;
                case 5:
                    let levelData5 = JSON.parse(localStorage.getItem('level05'));
                    levelTime = levelData5.time;
                    break;
                case 6:
                    let levelData6 = JSON.parse(localStorage.getItem('level06'));
                    levelTime = levelData6.time;
                    break;
            }
        }
        const spendTime = levelTime - Math.floor(this.allTime - this.endTime);
        localStorage.setItem('spendTime', JSON.stringify(spendTime));
    }

    // 检查倒计时是否结束
    isCountdownEnd(): boolean {
        return this.isCounting && this.endTime <= 0;
    }
}