import { _decorator, Component, Node, Label, sys, director } from 'cc';
import { WZBPW_FrogController } from './WZBPW_FrogController';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;


// 本地存储键名
const LASER_COUNT_KEY = "WZBPW_LASER_COUNT";
const LASER_FIRST_TIME_KEY = "WZBPW_LASER_FIRST_TIME"; // 标记是否首次进入

/**
 * 激光按钮控制器
 * 处理激光瞄准器道具的获取和使用
 */
@ccclass('WZBPW_LaserButton')
export class WZBPW_LaserButton extends Component {
    // 数量显示Label节点
    @property(Label)
    public countLabel: Label | null = null;

    // 红点节点（有道具时显示）
    @property(Node)
    public redDotNode: Node | null = null;

    // Video节点（没有道具时显示）
    @property(Node)
    public videoNode: Node | null = null;

    // 当前激光道具数量
    private _laserCount: number = 0;

    // 是否已激活（本关内有效）
    private _isActiveThisLevel: boolean = false;

    // 青蛙控制器引用（运行时查找）
    private _frogController: WZBPW_FrogController | null = null;

    onLoad() {
        // 加载激光道具数量
        this.loadLaserCount();

        // 更新UI显示
        this.updateCountDisplay();

        // 注册点击事件
        this.node.on(Node.EventType.TOUCH_END, this.onButtonClick, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_END, this.onButtonClick, this);
    }

    /**
     * 按钮点击事件
     */
    private onButtonClick(): void {
        if (this._laserCount > 0) {
            // 有道具的情况
            if (this._isActiveThisLevel) {
                // 本关已经使用过，不能再使用
                console.warn('WZBPW_LaserButton: Laser already used this level, cannot use again');
                return;
            } else {
                // 本关未使用，可以使用
                this.useLaser();
            }
        } else {
            // 没有道具，看广告获取（无论本关是否已使用）
            this.watchAdToGetLaser();
            console.log("111");

        }
    }

    /**
     * 使用激光道具
     */
    private useLaser(): void {
        if (this._laserCount <= 0) {
            console.warn('WZBPW_LaserButton: No laser available');
            return;
        }

        if (this._isActiveThisLevel) {
            console.warn('WZBPW_LaserButton: Laser already used this level');
            return;
        }

        // 扣除一个道具
        this._laserCount--;
        this.saveLaserCount();
        this.updateCountDisplay();

        // 标记本关已使用
        this._isActiveThisLevel = true;

        // 激活激光瞄准器（本关内有效）
        this.activateLaserAimer();

        console.log(`WZBPW_LaserButton: Laser used, remaining: ${this._laserCount}`);
    }

    /**
     * 看广告获取激光道具
     */
    private watchAdToGetLaser(): void {
        // 检查广告SDK是否可用
        if (typeof Banner === 'undefined' || !Banner.Instance) {
            console.warn('WZBPW_LaserButton: Ad SDK not available, adding lasers directly for testing');
            this.addLasers(2);
            return;
        }

        // 显示广告
        Banner.Instance.ShowVideoAd(() => {
            // 广告观看完成，获得2个激光道具
            this.addLasers(2);
            console.log('WZBPW_LaserButton: Ad watched, received 2 lasers');
        });
    }

    /**
     * 添加激光道具
     */
    private addLasers(count: number): void {
        this._laserCount += count;
        this.saveLaserCount();
        this.updateCountDisplay();
        console.log(`WZBPW_LaserButton: Added ${count} lasers, total: ${this._laserCount}`);
    }

    /**
     * 激活激光瞄准器
     */
    private activateLaserAimer(): void {
        // 每次激活时都重新查找青蛙控制器（因为关卡切换后是新实例）
        this._frogController = this.findFrogController();

        if (this._frogController) {
            this._frogController.setLaserAimerActive(true);
            console.log('WZBPW_LaserButton: Laser aimer activated');
        } else {
            console.warn('WZBPW_LaserButton: Frog controller not found');
        }
    }

    /**
     * 查找青蛙控制器
     */
    private findFrogController(): WZBPW_FrogController | null {
        const scene = director.getScene();
        if (!scene) return null;

        return this.findComponentRecursive(scene, WZBPW_FrogController);
    }

    /**
     * 递归查找组件
     */
    private findComponentRecursive<T extends Component>(node: Node, componentClass: new () => T): T | null {
        const comp = node.getComponent(componentClass);
        if (comp) return comp;

        for (const child of node.children) {
            const found = this.findComponentRecursive(child, componentClass);
            if (found) return found;
        }

        return null;
    }

    /**
     * 更新数量显示
     */
    private updateCountDisplay(): void {
        if (this._laserCount > 0) {
            // 有道具，显示数量和红点，隐藏video
            if (this.countLabel) {
                this.countLabel.string = this._laserCount.toString();
                // 显示Label的父节点
                if (this.countLabel.node.parent) {
                    this.countLabel.node.parent.active = true;
                }
            }

            if (this.redDotNode) {
                this.redDotNode.active = true;
            }

            if (this.videoNode) {
                this.videoNode.active = false;
            }
        } else {
            // 没有道具，隐藏数量和红点，显示video
            if (this.countLabel && this.countLabel.node.parent) {
                this.countLabel.node.parent.active = false;
            }

            if (this.redDotNode) {
                this.redDotNode.active = false;
            }

            if (this.videoNode) {
                this.videoNode.active = true;
            }
        }
    }

    /**
     * 保存激光道具数量到本地存储
     */
    private saveLaserCount(): void {
        sys.localStorage.setItem(LASER_COUNT_KEY, this._laserCount.toString());
    }

    /**
     * 从本地存储加载激光道具数量
     */
    private loadLaserCount(): void {
        try {
            // 检查是否首次进入（严格检查，只有明确是 '1' 才算已经给过）
            const firstTimeData = sys.localStorage.getItem(LASER_FIRST_TIME_KEY);

            if (firstTimeData !== '1') {
                // 首次进入（包括 null、空字符串、undefined 等情况），给1个激光道具
                this._laserCount = 1;
                sys.localStorage.setItem(LASER_FIRST_TIME_KEY, '1'); // 标记已经给过新人礼包
                this.saveLaserCount();
                console.log('WZBPW_LaserButton: First time (data: ' + firstTimeData + '), granted 1 laser');
            } else {
                // 非首次进入，从本地存储加载
                const data = sys.localStorage.getItem(LASER_COUNT_KEY);
                if (data && data.trim() !== '') {
                    const parsed = parseInt(data);
                    this._laserCount = isNaN(parsed) ? 0 : parsed;
                } else {
                    this._laserCount = 0;
                }
                console.log('WZBPW_LaserButton: Loaded laser count: ' + this._laserCount);
            }
        } catch (e) {
            console.warn('WZBPW_LaserButton: Failed to load laser count, defaulting to 1');
            // 出错时给1个道具（当作首次）
            this._laserCount = 1;
            sys.localStorage.setItem(LASER_FIRST_TIME_KEY, '1');
            this.saveLaserCount();
        }
    }

    /**
     * 关卡开始时调用（重置本关激活状态）
     */
    public onLevelStart(): void {
        this._isActiveThisLevel = false;

        // 不要在这里停用激光瞄准器，因为可能用户刚点击使用
        // 激光瞄准器会在发射舌头后自动隐藏

        console.log('WZBPW_LaserButton: Level started, reset laser state');
    }
}
