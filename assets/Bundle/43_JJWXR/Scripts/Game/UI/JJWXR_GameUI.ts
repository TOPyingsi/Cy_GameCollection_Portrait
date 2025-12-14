import { _decorator, Button, Component, instantiate, Label, Node, Prefab } from 'cc';
import { JJWXR_UIManager } from './JJWXR_UIManager';
import { eventCenter } from '../../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../../Utils/JJWXR_Events';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_GameUI')
export class JJWXR_GameUI extends Component {

    @property(Button)
    private btnSetting: Button = null;
    // -----------------------------------------------------------------------------------------------------------------------------
    @property(Label)
    private labelLevel: Label = null;
    @property(Label)
    private labelCountDownTime: Label = null;

    // -----------------------------------------------------------------------------------------------------------------------------
    @property(Button)
    private btnAim: Button = null;

    @property(Button)
    private btnCheat01: Button = null;
    @property(Button)
    private btnCheat02: Button = null;
    @property(Button)
    private btnArmory: Button = null;

    // -----------------------------------------------------------------------------------------------------------------------------
    @property(Node)
    private settingUI: Node = null;

    @property(Node)
    private boardBarUI: Node = null;

    @property(Node)
    private armoryUI: Node = null;

    @property(Node)
    private reticleUI: Node = null;

    // -----------------------------------------------------------------------------------------------------------------------------

    private level: number = 1;
    private remainIndex: number = 0;

    public totalTime: number = 90; // 倒计时总时间（秒）
    private currentTime: number = 0; // 当前剩余时间


    onLoad() {
        this.hideSettingUI();
    }
    start() {

        this.init();
        this.btnSetting.node.on(Button.EventType.CLICK, this.onSetting, this);
        this.btnAim.node.on(Button.EventType.CLICK, this.onAim, this);
        this.btnCheat01.node.on(Button.EventType.CLICK, this.onCheat01, this);
        this.btnCheat02.node.on(Button.EventType.CLICK, this.onCheat02, this);
        this.btnArmory.node.on(Button.EventType.CLICK, this.onArmory, this);

        eventCenter.on(JJWXR_Events.HIDE_ENEMY_UI, this.hideEnemyUI, this); // 开始订阅敌人UI隐藏事件
        eventCenter.on(JJWXR_Events.HIDE_RETICLE_UI, this.hideReticleUI, this); //  开始订阅准星UI显示事件
    }

    protected onDestroy(): void {
        eventCenter.off(JJWXR_Events.HIDE_ENEMY_UI, this.hideEnemyUI, this);    //  取消订阅敌人UI隐藏事件
        eventCenter.off(JJWXR_Events.HIDE_RETICLE_UI, this.hideReticleUI, this); // 取消订阅准星UI显示事件
    }

    init() {
        let curLevel = parseInt(localStorage.getItem('currentLevel')); // 获取当前关卡
        this.level = curLevel;
        this.updateLevelLabel(); // 更新关卡UI
        this.showReticleUI();
        // this.showRemainCount();
    }

    // 更新关卡Label
    updateLevelLabel() {
        this.labelLevel.string = `第${this.level}关`;
    }

    // 设置倒计时
    updateCountDown() {
        this.currentTime--;

        this.updateCountDownLabel(); // 更新倒计时UI

        if (this.currentTime <= 0) {
            this.unschedule(this.updateCountDown);
            this.onCountdownEnd();
        }
    }

    // 更新倒计时UI
    updateCountDownLabel() {
        let minute = Math.floor(this.currentTime / 60);
        let second = this.currentTime % 60;
        // 格式化字符串，确保秒数始终是两位数
        let formattedTime = `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
        this.labelCountDownTime.string = formattedTime;
    }

    // 倒计时结束
    onCountdownEnd() {
        console.log('倒计时结束');
    }


    // 设置按钮
    onSetting() {
        this.showSettingUI();
    }

    // 瞄准按钮
    onAim() {
        console.log('开镜');
        JJWXR_UIManager.instance.showBattleUI();
        JJWXR_UIManager.instance.hideGameUI();
        eventCenter.emit(JJWXR_Events.CHANGE_CAMERA_FOV);
        eventCenter.emit(JJWXR_Events.CHANGE_CAMERA_FOV_SPEED);
    }

    // 作弊按钮01
    onCheat01() {
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            console.log('作弊按钮01');
            x.showEnemyPic();
            eventCenter.emit(JJWXR_Events.ENEMY_PICTURE);
        })
    }

    // 作弊按钮02
    onCheat02() {
        Banner.Instance.ShowVideoAd(() => {
            console.log('作弊按钮02');
            eventCenter.emit(JJWXR_Events.ENEMY_WORLDPOSITION);
            eventCenter.emit(JJWXR_Events.ON_SPAWN_RING);
        });
    }

    // 装备按钮
    onArmory() {
        console.log('装备按钮');
        this.armoryUI.active = true;
        ProjectEventManager.emit(ProjectEvent.弹出窗口);
    }

    // 显示敌人图片
    showEnemyPic() {
        this.boardBarUI.active = true;
    }

    // 隐藏敌人图片
    hideEnemyUI() {
        this.boardBarUI.active = false;
    }

    // 显示设置UI
    showSettingUI() {
        eventCenter.emit(JJWXR_Events.GAME_STOP);
        this.settingUI.active = true;
    }
    // 隐藏设置UI
    hideSettingUI() {
        this.settingUI.active = false;
    }

    // 显示准星UI
    showReticleUI() {
        this.reticleUI.active = true;
    }

    // 隐藏准星UI
    hideReticleUI() {
        this.reticleUI.active = false;
    }
}