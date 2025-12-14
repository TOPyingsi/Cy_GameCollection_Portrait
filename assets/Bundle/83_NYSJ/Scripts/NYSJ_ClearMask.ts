import { _decorator, color, Component, director, EventTouch, Graphics, Intersection2D, Mask, Node, Rect, rect, Sprite, UITransform, v3, Vec2, Vec3 } from 'cc';
import { NYSJ_GameManager } from './NYSJ_GameManager';
import { NYSJ_AudioMgr } from './NYSJ_AudioMgr';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('NYSJ_ClearMask')
export default class NYSJ_ClearMask extends Mask {

    @property()
    public isLock: boolean = true;
    @property()
    public maskIndex: number = 0;

    ticketNode: UITransform;

    LineWidth: number = 60;
    polygonPointsList: { rect: Rect; isHit: boolean }[] = [];
    ClearPoints: number = 0;
    ClearRate: number = 0;
    isFinish: boolean = false;
    isWrong: boolean = false;

    JinDuTiao: Sprite = null;
    start() {
        // this.node.on(Node.EventType.TOUCH_START, this.touchStartEvent, this);
        // this.node.on(Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
        this.Reset();
        this.JinDuTiao = this.ticketNode.getComponent(Sprite);
        console.log(this.JinDuTiao);

        director.getScene().on("擦手机壳_开始清灰", this.TouchMove, this);
        director.getScene().on("擦手机壳_清灰结束", this.touchEnd, this);
        // this.node.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        // this.node.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
    }

    /**
     * 重置刮奖票证的状态
     * 此方法用于初始化或重置刮奖票证的图形和数据结构，以便于重新开始一次刮奖过程
     */
    Reset() {
        // 初始化多边形点列表，用于记录涂层的刮开情况
        this.polygonPointsList = [];
        // 初始化清除点数和清除率，表示尚未有任何刮开动作
        this.ClearPoints = 0;
        this.ClearRate = 0;
        // 清空当前图形，为重新绘制做准备
        this._graphics.clear();
        // 选取票证节点，用于后续的绘制和计算
        this.ticketNode = this.node.children[0].getComponent(UITransform);
        // 初始化临时绘制点列表，用于记录即将绘制的点
        this.tempDrawPoints = [];
        // 生成小格子，用来辅助统计涂层的刮开比例
        for (let x = 0; x < this.ticketNode.width; x += this.LineWidth) {
            for (let y = 0; y < this.ticketNode.height; y += this.LineWidth) {
                this.polygonPointsList.push({
                    rect: rect(x - this.ticketNode.width / 2, y - this.ticketNode.height / 2, this.LineWidth, this.LineWidth),
                    isHit: false
                });
            }
        }
    }

    /**
     * 处理触摸开始事件
     * 将触摸位置转换为节点空间坐标，并根据偏移量清除掩膜
     * 
     * @param pos - 触摸位置的三维向量
     * @param offsetX - 可选的x轴偏移量，默认为0
     * @param offsetY - 可选的y轴偏移量，默认为0
     */
    touchStartEvent(pos: Vec3, offsetX: number = 0, offsetY: number = 0) {
        // 将触摸位置转换为节点空间坐标
        let point = this.ticketNode.convertToNodeSpaceAR(pos);
        // 根据偏移量清除掩膜
        this.clearMask(new Vec2(point.x + offsetX, point.y + offsetY));
    }

    isForceReset: boolean = false;
    /**
     * 处理触摸移动事件
     * @param pos - 触摸位置，使用 Vec3 对象表示
     * @param offsetX - 相对于触摸位置的X轴偏移量，默认为0
     * @param offsetY - 相对于触摸位置的Y轴偏移量，默认为0
     */
    touchMoveEvent(pos: Vec3, index: number, offsetX: number = 0, offsetY: number = 0) {
        if (this.isFinish) {
            return;
        }

        // if (Banner.IS_HarmonyOSNext_GAME || Banner.IS_ANDROID) {
        if (!this.isForceReset) {
            this.isForceReset = true;
            this.scheduleOnce(() => {
                this.isFinish = true;
                // this.isLock = true;
                switch (this.maskIndex) {
                    case 0:
                        this.ClearRate = 55 / 100;
                        this.JinDuTiao.fillRange = 0;
                        NYSJ_AudioMgr.instance.playEffect("酒精湿巾");
                        break;
                    case 1:
                        this.ClearRate = 55 / 100;
                        this.JinDuTiao.fillRange = 0;
                        NYSJ_AudioMgr.instance.playEffect("棉签");
                        break;
                    case 3:
                        this.JinDuTiao.fillRange = 1;
                        this.ClearRate = 35 / 100;
                        NYSJ_AudioMgr.instance.playEffect("刮平");
                        break;
                    case 2:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        this.JinDuTiao.fillRange = 1;
                        this.ClearRate = 35 / 100;
                        NYSJ_AudioMgr.instance.playEffect("奶油");
                        break;
                }
                director.getScene().emit("奶油手机_强制下一关", this.maskIndex);
            }, 1);
            // }
        }

        // 将触摸位置转换为节点空间内的位置
        let point = this.ticketNode.convertToNodeSpaceAR(pos);
        // 清除掩膜，考虑偏移量
        this.clearMask(new Vec2(point.x + offsetX, point.y + offsetY));

        // 重置清除点数
        this.ClearPoints = 0;
        // 遍历多边形点列表，统计被击中的点的数量
        this.polygonPointsList.forEach((item) => {
            if (item.isHit) {
                this.ClearPoints++;
            }
        });

        // if (Banner.IS_HarmonyOSNext_GAME || Banner.IS_HarmonyOSNext_GAME) {


        // 计算清除比例
        if (this.inverted) {
            this.ClearRate = 1 - this.ClearPoints / this.polygonPointsList.length;

            if (this.ClearRate * 100 >= 55) {
                this.JinDuTiao.fillRange = 1;

                this.isFinish = true;
                return;
            }

            // 更新进度条的填充范围，如果进度条存在
            if (this.JinDuTiao) {
                this.JinDuTiao.fillRange = this.ClearRate;
            }

        }
        else {
            this.ClearRate = this.ClearPoints / this.polygonPointsList.length;

            if (this.ClearRate * 100 >= 35) {
                this.JinDuTiao.fillRange = 1;

                this.isFinish = true;
                return;
            }

            // 更新进度条的填充范围，如果进度条存在
            if (this.JinDuTiao) {
                this.JinDuTiao.fillRange = this.ClearRate;
            }

        }

        // console.log("刮开比例" + (this.ClearRate * 100).toFixed(1) + "%");

        switch (this.maskIndex) {
            case 0:
                NYSJ_AudioMgr.instance.playEffect("酒精湿巾");
                break;
            case 1:
                NYSJ_AudioMgr.instance.playEffect("棉签");
                break;
            case 3:
                NYSJ_AudioMgr.instance.playEffect("刮平");
                break;
            case 2:
            case 4:
            case 5:
            case 6:
            case 7:
                NYSJ_AudioMgr.instance.playEffect("奶油");
                break;

        }

    }

    /**
     * 处理触摸开始事件
     * 
     * 此函数将触摸位置转换到节点的本地空间，并根据偏移量调整位置，然后调用clearMask方法清除该位置的遮罩
     * 主要用于在触摸开始时，根据触摸位置更新游戏中的遮罩状态
     * 
     * @param event 触摸事件对象，包含触摸的位置信息
     * @param offsetX x轴上的偏移量，默认为0，用于调整触摸位置
     * @param offsetY y轴上的偏移量，默认为0，用于调整触摸位置
     */
    public TouchStart(event, index: number, offsetX: number = 0, offsetY: number = 0) {
        if (this.isLock) {
            return;
        }
        if (this.maskIndex !== index) {
            return;
        }
        // 将触摸位置转换到节点的本地空间
        let point = this.ticketNode.convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y, 0));
        // 根据偏移量调整位置，并清除该位置的遮罩
        this.clearMask(new Vec2(point.x + offsetX, point.y + offsetY));

        // this.touchStartEvent(point, offsetX, offsetY);
    }

    /**
     * 处理触摸移动事件，以刮卡片效果
     * @param event 触摸事件对象
     * @param offsetX X轴偏移量，默认为0
     * @param offsetY Y轴偏移量，默认为0
     */
    public TouchMove(event, index: number, offsetX: number = 0, offsetY: number = 0) {
        if (this.isLock) {
            return;
        }

        if (this.maskIndex !== index) {
            this.isWrong = true;
            director.getScene().emit("奶油手机_步骤错误");
            NYSJ_AudioMgr.instance.wrong();
            return;
        }
        else {
            this.isWrong = false;
        }

        // 将触摸位置转换为节点空间坐标
        let point = this.ticketNode.convertToNodeSpaceAR(v3(event.x, event.y, 0));
        // 在触摸位置加上偏移量后清除遮罩
        this.clearMask(new Vec2(point.x + offsetX, point.y + offsetY));

        // 重置已清除的点数量
        this.ClearPoints = 0;
        // 遍历所有多边形点，统计被击中的点的数量
        this.polygonPointsList.forEach((item) => {
            if (item.isHit) {
                this.ClearPoints++;
            }
        });
        // 计算清除比例
        this.ClearRate = 1 - this.ClearPoints / this.polygonPointsList.length;

        this.touchMoveEvent(point, offsetX, offsetY);
        // 输出刮开比例
        // console.log("刮开比例" + (this.ClearRate * 100).toFixed(1) + "%");
    }

    public touchEnd() {
        if (this.isLock) {

            return;
        }
        else {
            if (this.isWrong) {
                NYSJ_GameManager.instance.wrong();
                NYSJ_AudioMgr.instance.playEffect("wrong");
            }
        }

        if (!this.isFinish) {
            return;
        }
        else {
            this.isLock = true;

            console.log(this.inverted);
            console.log(this.ClearRate);

            if (this.ClearRate * 100 >= 55 && this.inverted) {
                console.log(this.ClearRate);

                this.JinDuTiao.fillRange = 0;
                NYSJ_AudioMgr.instance.right();

                if (this.maskIndex < 2) {
                    this.node.active = false;
                }
                this.getComponent(Mask).enabled = false;
                this.isLock = true;
                NYSJ_GameManager.instance.nextClear(this.maskIndex + 1);

                return;
            }

            if (this.ClearRate * 100 >= 35 && !this.inverted) {
                console.log(this.ClearRate);

                this.JinDuTiao.fillRange = 1;
                NYSJ_AudioMgr.instance.right();
                this.isLock = true;

                this.getComponent(Mask).enabled = false;
                NYSJ_GameManager.instance.nextClear(this.maskIndex + 1);
            }


        }

    }

    tempDrawPoints: Vec2[] = [];
    /**
     * 清除涂层功能
     * 该方法用于在图形上清除涂层，可以根据触摸或鼠标输入的位置来清除图形上的涂层
     * @param pos 用户输入的位置，用于清除涂层
     */
    clearMask(pos: Vec2) {
        // 获取图形对象
        let stencil = this._graphics;
        // 获取当前绘制点列表的长度
        const len = this.tempDrawPoints.length;
        // 将新的位置点添加到绘制点列表中
        this.tempDrawPoints.push(pos);

        // if (len <= 1) {
        // 当绘制点数量不超过1时，使用圆形区域来清除涂层
        stencil.circle(pos.x, pos.y, this.LineWidth);
        stencil.fill();

        // 遍历所有多边形点，检查并标记被点击的格子
        this.polygonPointsList.forEach((item) => {
            if (item.isHit) return;
            const xFlag = pos.x > item.rect.x && pos.x < item.rect.x + item.rect.width;
            const yFlag = pos.y > item.rect.y && pos.y < item.rect.y + item.rect.height;
            if (xFlag && yFlag) item.isHit = true;
        });

        // }else {
        //     // 当绘制点数量超过1时，使用线段来清除涂层
        //     let prevPos = this.tempDrawPoints[len - 2];
        //     let curPos = this.tempDrawPoints[len - 1];

        //     stencil.moveTo(prevPos.x, prevPos.y);
        //     stencil.lineTo(curPos.x, curPos.y);
        //     stencil.lineWidth = this.LineWidth;
        //     stencil.lineCap = Graphics.LineCap.ROUND;
        //     stencil.lineJoin = Graphics.LineJoin.ROUND;
        //     stencil.strokeColor = color(255, 255, 255, 0);
        //     stencil.stroke();

        //     // 遍历所有多边形点，检查并标记被线段触及的格子
        //     this.polygonPointsList.forEach((item) => {
        //         item.isHit = item.isHit || Intersection2D.lineRect(prevPos, curPos, item.rect);
        //     });
        // }
    }

}
