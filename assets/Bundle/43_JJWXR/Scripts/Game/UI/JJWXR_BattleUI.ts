import { _decorator, Component, Node, Input, Button, Vec2, Vec3, UITransform, AudioClip } from 'cc';
import { eventCenter } from '../../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../../Utils/JJWXR_Events'
const { ccclass, property } = _decorator;

@ccclass('JJWXR_BattleUI')
export class JJWXR_BattleUI extends Component {

    @property(Button)
    private shootButton: Button = null; // 绑定射击按钮

    // @property({ type: Node })
    // private preciseHitUI: Node = null; // 绑定精准射击UI

    // private input = new Input();
    private isReturn: boolean = false; // 是否返回
    private shootInterval: number = 0.1; // 射击间隔
    private lastShootTime: number = 0; // 时间

    private static _instance: JJWXR_BattleUI = null;
    public static get instance(): JJWXR_BattleUI {
        return this._instance;
    }
    protected onLoad(): void {
        JJWXR_BattleUI._instance = this;
    }

    start() {
    }

    onBattleUIShow() {
        this.shootButton.node.on('click', this.onShoot, this); // 监听射击按钮点击事件
        eventCenter.on(JJWXR_Events.ONTOUCHSTART_BATTLEUI, this.onTouchStartBattleUI, this); // 监听触摸事件
        eventCenter.on(JJWXR_Events.ONTOUCHMOVE_BATTLEUI, this.onTouchMoveBattleUI, this); // 监听触摸事件
        eventCenter.on(JJWXR_Events.ONTOUCHEND_BATTLEUI, this.onTouchEndBattleUI, this); // 监听触摸事件

        eventCenter.on(JJWXR_Events.ON_RETURN_BATTLEUI, this.onReturn, this); // 监听显示精准射击UI事件
    }
    onBattleUIHide() {
        eventCenter.off(JJWXR_Events.ONTOUCHSTART_BATTLEUI, this.onTouchStartBattleUI, this); // 取消监听触摸事件
        eventCenter.off(JJWXR_Events.ONTOUCHMOVE_BATTLEUI, this.onTouchMoveBattleUI, this); // 取消监听触摸事件
        eventCenter.off(JJWXR_Events.ONTOUCHEND_BATTLEUI, this.onTouchEndBattleUI, this); // 取消监听触摸事件

        eventCenter.off(JJWXR_Events.ON_RETURN_BATTLEUI, this.onReturn, this); // 取消监听显示精准射击UI事件
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 触摸事件
    // 开始点击事件
    public onTouchStartBattleUI(pos: Vec2) {
        // console.log("开始触摸事件监听器");
        // 检查是否点击了射击按钮
        if (this.isTouchOnButton(pos, this.shootButton.node)) {
            // 射击间隔
            const currentTime = Date.now() / 1000; // 获取当前时间（秒）

            // 检查射击间隔
            if (currentTime - this.lastShootTime < this.shootInterval) {
                return; // 射击间隔未到，忽略射击请求
            }
            this.onShoot(); // 执行射击逻辑
            // 更新上次射击时间
            this.lastShootTime = currentTime;
        } else {
            this.isReturn = true;
            // this.onTouchEndBattleUI(); // 执行返回逻辑
        }
    }

    // 移动点击事件
    public onTouchMoveBattleUI() {
        // console.log("移动触摸事件监听器");
        // 检查是否点击了射击按钮
        // if (this.isReturn) {
        //     this.isReturn = false;
        // }
    }

    // 结束点击事件
    public onTouchEndBattleUI() {
        // console.log("结束触摸事件监听器");
        console.log("返回"); // 替换为实际的返回逻辑
        if (this.isReturn) {
            this.onReturn(); // 执行返回逻辑
            this.isReturn = false;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 判断触摸点是否在按钮上
    public isTouchOnButton(touchPos: Vec2, buttonNode: Node): boolean {
        const buttonWorldPos = new Vec3();
        buttonNode.getWorldPosition(buttonWorldPos); // 获取按钮的世界坐标

        // 将按钮的世界坐标转换为屏幕坐标
        const buttonScreenPos = new Vec2(buttonWorldPos.x, buttonWorldPos.y);
        // 获取按钮半径
        const buttonSize = buttonNode.getComponent(UITransform).contentSize;
        const buttonRadius = buttonSize.width / 2;
        // 计算触摸点与按钮中心的距离
        const distance = touchPos.subtract(buttonScreenPos).length();

        // 判断触摸点是否在按钮范围内
        return distance <= buttonRadius;
    }

    // 射击逻辑
    public onShoot() {
        console.log("Shoot"); // 替换为实际的射击逻辑
        eventCenter.emit(JJWXR_Events.ON_FIRE); // 发射子弹
        this.onReturn(); // 返回逻辑

        // 记录射击次数
        let shotNumber = parseInt(localStorage.getItem('shotNumber')) || 0;
        shotNumber++;
        localStorage.setItem('shotNumber', shotNumber.toString());

        eventCenter.emit(JJWXR_Events.GUN_RELOAD); // 枪械自动上膛
        eventCenter.emit(JJWXR_Events.GUN_FIRED); // 枪械开火
    }

    // 返回逻辑
    public onReturn() {
        console.log("Return"); // 替换为实际的返回逻辑
        eventCenter.emit(JJWXR_Events.HIDE_BATTLE_UI); // 隐藏战斗UI
        eventCenter.emit(JJWXR_Events.SHOW_GAME_UI);     // 显示游戏UI
        eventCenter.emit(JJWXR_Events.CHANGE_CAMERA_FOV_BACK);     // 发送返回事件
        eventCenter.emit(JJWXR_Events.CHANGE_CAMERA_FOV_SPEED_BACK);     // 发送返回事件
    }
}