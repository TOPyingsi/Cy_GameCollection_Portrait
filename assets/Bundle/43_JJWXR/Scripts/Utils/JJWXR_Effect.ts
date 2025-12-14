import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_Effect')
export class JJWXR_Effect extends Component {
    showDuration: number = 7; // 显示时间 (秒)

    hideDuration: number = 1; // 隐藏时间 (秒)

    private isVisible: boolean = true; // 当前是否可见
    private time: number = 0;   // 累计时间

    start() {
        // 初始化节点的可见状态
        this.updateVisibility();
    }

    update(deltaTime: number) {
        // 更新累计时间
        this.time += deltaTime;

        if (this.time >= this.showDuration && this.isVisible) {
            // 隐藏效果
            this.isVisible = false;
            this.time = 0;
            this.updateVisibility();
        }
        if (this.time >= this.hideDuration && !this.isVisible) {
            // 显示效果
            this.isVisible = true;
            this.time = 0;
            this.updateVisibility();
        }
    }

    updateVisibility() {
        if (this.isVisible) {
            // 设置节点完全可见
            this.node.active = true;
        } else {
            // 设置节点完全不可见
            this.node.active = false;
        }
    }
}