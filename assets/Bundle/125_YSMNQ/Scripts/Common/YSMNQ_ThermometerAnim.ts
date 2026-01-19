import { _decorator, Component, Label, Node, tween, Vec3, Color } from 'cc';
import { YSMNQ_AnimBase } from '../Common/YSMNQ_AnimBase';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_ThermometerAnim')
export class YSMNQ_ThermometerAnim extends YSMNQ_AnimBase {
    @property(Number)
    startTemp: number = 36; // 当前温度

    @property(Number)
    targetTemp: number = 38.6; // 当前温度

    @property(Number)
    duration: number =  2; // 总升温时长（秒）

    @property({type: Boolean})
    needChangeColor: boolean =  true; // 是否需要改变文字颜色

    @property(Number)
    changeColorNumber: number =  37.5; // 改变文字颜色的温度阈值

    label: Label = null;
    
    // 温度相关参数
    private currentTemp: number = 36; // 当前温度
    private tempStep: number = 0; // 每帧温度增量
    private isAnimating: boolean = false; // 是否正在动画
    private isStopped: boolean = false; // 是否已停止升温

    protected onLoad(): void {
        this.label = this.node.getComponent(Label);
        // 初始化显示
        this.label.string = this.startTemp.toFixed(1);
    }
    
    play() {
        // 重置状态
        this.currentTemp = this.startTemp;
        this.isAnimating = true;
        this.isStopped = false;
        this.label.string = this.currentTemp.toFixed(1);
        if(this.needChangeColor){
            this.label.color = Color.WHITE; // 初始白色
        }
        
        
        // 计算每秒温度增量（2秒从36到38.6，总增量2.6）
        const totalDelta = this.targetTemp - this.currentTemp;
        this.tempStep = totalDelta / this.duration;
    }

    update(deltaTime: number) {
        if (!this.isAnimating || this.isStopped) return;

        // 计算本次更新的温度增量
        const tempIncrease = this.tempStep * deltaTime;
        this.currentTemp += tempIncrease;
        
        // 温度超过38时，固定为38并停止升温
        if (this.currentTemp >= this.targetTemp) {
            this.currentTemp = this.targetTemp;
            this.isStopped = true;
            this.playRemindScaleAnimation(); // 播放缩放提醒动画
        }
        
        // 更新温度显示（保留1位小数）
        this.label.string = this.currentTemp.toFixed(1);
        
        // 温度超过37.5时文字变红
        if (this.currentTemp >= this.changeColorNumber) {
            if(this.needChangeColor){
                this.label.color = Color.RED;
            }
        }
        
        // 边界保护：防止温度超出目标值
        if (this.currentTemp >= this.targetTemp) {
            this.currentTemp = this.targetTemp;
            this.isAnimating = false;
        }
    }

    /**
     * 播放缩放提醒动画（缩放两次）
     */
    private playRemindScaleAnimation() {
        // 保存原始缩放值
        const originalScale = this.node.scale.clone();
        
        // 使用tween实现两次缩放动画
        tween(this.node)
            // 第一次缩放：放大到1.2倍（0.2秒）
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
            // 缩回到原大小（0.2秒）
            .to(0.2, { scale: originalScale })
            // 延迟0.1秒
            .delay(0.1)
            // 第二次缩放：放大到1.2倍（0.2秒）
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
            // 缩回到原大小（0.2秒）
            .to(0.2, { scale: originalScale })
            .start();
    }


    stop(){
     // 重置状态
        this.currentTemp = this.startTemp;
        this.isAnimating = false;
        this.isStopped = true;
    }
}