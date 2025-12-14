import { _decorator, Component, Node, EventTouch, Vec3, v3, EventMouse, view, director, tween, Tween } from 'cc';
import { JTLXC_GameManager } from './JTLXC_GameManager';
const { ccclass, property } = _decorator;

@ccclass('JTLXC_MoveNode')
export class JTLXC_MoveNode extends Component {
    // 初始缩放
    private initialScale: number = 1;
    // 当前缩放比例
    private currentScale: number = 1;
    // 最小缩放比例（动态计算）
    private minScale: number = 0.5;
    // 最大缩放比例
    private maxScale: number = 2;
    // 拖拽速度系数，会根据缩放调整
    private dragSpeedFactor: number = 1;
    // 触摸起始位置
    private startPos: Vec3 = new Vec3();
    // 节点起始位置
    private nodeStartPos: Vec3 = new Vec3();
    // 是否正在拖拽
    private isDragging: boolean = false;
    // 记录上一次双指触摸的距离
    private lastTouchDistance: number = 0;

    // 游戏管理器引用
    private gameManager: JTLXC_GameManager = null;

    // 网格大小（与GameManager中一致）
    private gridSize: number = 50;

    // 基础拖动限制范围
    private readonly BASE_DRAG_LIMIT: number = 1000;

    // 动画Tween
    private scaleTween: Tween = null;

    protected onLoad(): void {
        // 监听关卡加载完成事件
        director.getScene().on('level-loaded', this.onLevelLoaded, this);
    }
    start() {
        // 获取游戏管理器实例
        const gameNode = director.getScene().getChildByName('Canvas')?.getChildByName('Game');
        if (gameNode) {
            this.gameManager = gameNode.getComponent(JTLXC_GameManager);

            // 初始化为默认缩放
            this.initialScale = this.node.scale.x;
            this.currentScale = this.initialScale;

            // 计算最小缩放比例
            this.calculateMinScale();


        }

        // 注册触摸事件
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        // 注册鼠标滚轮事件，用于在电脑上测试缩放
        this.node.on(Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    update(deltaTime: number) {
        // 不在update中强制限制位置
    }

    // 关卡加载完成回调
    private onLevelLoaded() {
        // 使用calculateMinScale计算出的最小缩放作为初始缩放
        console.log("场景宽度:" + JTLXC_GameManager.Instance.width);
        if (JTLXC_GameManager.Instance.width >= 15) {
            this.node.setScale(v3(0.7, 0.7, 1));
        }
    }

    // 计算最小缩放比例，确保整个游戏网格能在屏幕上完整显示
    private calculateMinScale() {
        if (!this.gameManager) return;

        // 获取屏幕尺寸
        const visibleSize = view.getVisibleSize();

        // 计算游戏网格的实际尺寸
        const gridWidth = this.gameManager.width * this.gridSize;
        const gridHeight = this.gameManager.height * this.gridSize;

        // 计算最小缩放比例，确保网格能完整显示在屏幕上（保留一点边距）
        const margin = 50; // 边距
        const scaleX = (visibleSize.width - margin) / gridWidth;
        const scaleY = (visibleSize.height - margin) / gridHeight;

        // 取较小的比例作为最小缩放比例
        this.minScale = Math.min(scaleX, scaleY);

        // 设定最小缩放下限，避免过小
        this.minScale = Math.max(this.minScale, 0.6);

        // 确保最小缩放比例不超过最大缩放比例
        this.minScale = Math.min(this.minScale, this.maxScale);

        console.log(`计算得到的最小缩放比例: ${this.minScale}`);
    }

    // 获取根据缩放调整后的拖动限制
    private getDragLimit(): number {
        // 拖动限制随着缩放比例调整
        // 缩放越大，可拖动范围越大；缩放越小，可拖动范围越小
        // 使用平方来增加放大时的可拖动范围
        return this.BASE_DRAG_LIMIT * Math.pow(this.currentScale, 1.5);
    }

    // 限制位置在指定矩形范围内
    private clampPosition(position: Vec3): Vec3 {
        const dragLimit = this.getDragLimit();
        // 限制X和Y坐标在-dragLimit到dragLimit之间
        const clampedX = Math.min(Math.max(position.x, -dragLimit), dragLimit);
        const clampedY = Math.min(Math.max(position.y, -dragLimit), dragLimit);
        return new Vec3(clampedX, clampedY);
    }

    // 回弹缩放到合法范围
    private bounceBackScale() {
        // 停止正在进行的缩放动画
        if (this.scaleTween) {
            this.scaleTween.stop();
        }

        let targetScale = this.currentScale;

        // 检查是否超出范围
        if (this.currentScale < this.minScale) {
            targetScale = this.minScale;
        } else if (this.currentScale > this.maxScale) {
            targetScale = this.maxScale;
        }

        // 如果需要回弹，则创建动画
        if (targetScale !== this.currentScale) {
            this.scaleTween = tween(this.node)
                .to(0.3, { scale: v3(targetScale, targetScale, 1) }, {
                    onUpdate: (target, ratio) => {
                        // 更新当前缩放值
                        this.currentScale = target.scale.x;
                        // 根据缩放调整拖拽速度因子
                        this.dragSpeedFactor = this.initialScale / this.currentScale;
                    }
                })
                .call(() => {
                    this.currentScale = targetScale;
                    this.dragSpeedFactor = this.initialScale / this.currentScale;
                })
                .start();
        }
    }

    onTouchStart(event: EventTouch) {
        // 如果是单指触摸
        if (event.getTouches().length === 1) {
            this.isDragging = true;
            // 记录触摸起始位置和节点起始位置
            this.startPos.set(event.getUILocation().x, event.getUILocation().y);
            this.nodeStartPos.set(this.node.position);
        }
        // 如果是双指触摸
        else if (event.getTouches().length === 2) {
            this.isDragging = false;
            // 计算初始双指距离
            const touches = event.getTouches();
            const touch1Pos = touches[0].getUILocation();
            const touch2Pos = touches[1].getUILocation();
            const distance = Math.sqrt(
                Math.pow(touch2Pos.x - touch1Pos.x, 2) +
                Math.pow(touch2Pos.y - touch1Pos.y, 2)
            );
            this.lastTouchDistance = distance;
        }
    }

    onTouchMove(event: EventTouch) {
        // 单指拖拽处理
        if (event.getTouches().length === 1 && this.isDragging) {
            const currentPos = event.getUILocation();
            // 根据缩放调整拖拽速度
            const deltaX = (currentPos.x - this.startPos.x) * this.dragSpeedFactor;
            const deltaY = (currentPos.y - this.startPos.y) * this.dragSpeedFactor;

            // 更新节点位置（限制在矩形范围内，范围随缩放调整）
            const newX = this.nodeStartPos.x + deltaX;
            const newY = this.nodeStartPos.y + deltaY;

            const clampedPosition = this.clampPosition(new Vec3(newX, newY));
            this.node.setPosition(clampedPosition);
        }
        // 双指缩放处理
        else if (event.getTouches().length === 2) {
            director.getScene().emit("箭头乐消除_教程", 1);
            const touches = event.getTouches();
            const touch1Pos = touches[0].getUILocation();
            const touch2Pos = touches[1].getUILocation();

            // 计算当前双指距离
            const distance = Math.sqrt(
                Math.pow(touch2Pos.x - touch1Pos.x, 2) +
                Math.pow(touch2Pos.y - touch1Pos.y, 2)
            );

            // 如果有有效的距离变化
            if (this.lastTouchDistance > 0 && distance > 0) {
                // 计算缩放比例
                const scaleRatio = distance / this.lastTouchDistance;
                const newScale = this.currentScale * scaleRatio;

                // 更新缩放（不再硬性限制范围）
                this.currentScale = newScale;
                this.node.setScale(v3(this.currentScale, this.currentScale, 1));

                // 根据缩放调整拖拽速度因子
                this.dragSpeedFactor = this.initialScale / this.currentScale;
            }

            this.lastTouchDistance = distance;
        }
    }

    onTouchEnd(event: EventTouch) {
        this.isDragging = false;
        this.lastTouchDistance = 0;

        // 触摸结束后只检查缩放是否需要回弹
        this.bounceBackScale();
    }

    // 鼠标滚轮缩放处理
    onMouseWheel(event: EventMouse) {
        director.getScene().emit("箭头乐消除_教程", 1);
        // 获取滚轮滚动的增量
        const delta = event.getScrollY();

        // 根据滚轮方向调整缩放比例
        let scaleChange = 0;
        if (delta > 0) {
            // 向上滚动，放大
            scaleChange = 0.1;
        } else if (delta < 0) {
            // 向下滚动，缩小
            scaleChange = -0.1;
        }

        // 计算新的缩放值
        const newScale = this.currentScale + scaleChange;

        // 更新缩放（不再硬性限制范围）
        this.currentScale = newScale;
        this.node.setScale(v3(this.currentScale, this.currentScale, 1));

        // 根据缩放调整拖拽速度因子
        this.dragSpeedFactor = this.initialScale / this.currentScale;

        // 缩放后检查是否需要回弹
        this.bounceBackScale();
    }

    onDestroy() {
        // 清理Tween
        // if (this.scaleTween) {
        //     this.scaleTween.stop();
        //     this.scaleTween = null;
        // }

        // // 清理事件监听
        // director.getScene().off('level-loaded', this.onLevelLoaded, this);
    }
}