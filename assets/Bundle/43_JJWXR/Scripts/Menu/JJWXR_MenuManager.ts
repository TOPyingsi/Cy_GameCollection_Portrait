import { _decorator, Component, Node, Button, director, AudioClip, Event, tween, v3, Label } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
import { JJWXR_EnergyManager } from './JJWXR_EnergyManager';
import { LevelData } from './JJWXR_Loading';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { AudioManager } from '../Utils/JJWXR_AudioManager';
import { BannerManager } from 'db://assets/Scripts/Framework/Managers/BannerManager';
import { AudioManager as AudioManager2 } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import Banner from 'db://assets/Scripts/Banner';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
const { ccclass, property } = _decorator;


@ccclass('JJWXR_MenuManager')
export class JJWXR_MenuManager extends Component {

    @property(Button)
    private btnSetting: Button = null;    // 设置按钮

    @property(AudioClip)
    private backgroundMusic: AudioClip = null; // 点击音效
    // -------------------------------------------------------------------------------------------------------------------------------

    @property(Button)
    private btnGameStart: Button = null;  // 游戏开始按钮
    // -------------------------------------------------------------------------------------------------------------------------------
    @property(Node)
    private settingUI: Node = null; // 设置界面
    @property(Node)
    private addEnergyUI: Node = null; // 添加能量界面
    @property(Node)
    private warningUI: Node = null; // 警告界面

    @property(Node)
    private weaponUI: Node = null;

    @property(Node)
    private weaponContent: Node = null;

    weaponNum = 1;
    isTween = false;
    gunData: any[] = [];
    // -------------------------------------------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------------------------------
    // 单例模式
    private static _instance: JJWXR_MenuManager = null;
    public static get instance(): JJWXR_MenuManager {
        return this._instance;
    }

    onLoad() {
        JJWXR_MenuManager._instance = this;
        this.btnSetting.node.on(Button.EventType.CLICK, this.onSetting, this);
        this.btnGameStart.node.on(Button.EventType.CLICK, this.onGameStart, this);
        BannerManager.Instance.Init();
        AudioManager2.Instance.StopBGM();
    }

    start() {
        const isFirstPlay = localStorage.getItem('isFirstPlay');
        const currentLevel = parseInt(localStorage.getItem('currentLevel'));
        // if (isFirstPlay && currentLevel == 1) {
        //     console.log('第一次进入游戏MenuManager' + isFirstPlay + currentLevel);
        //     director.loadScene('JJWXR_LoadingScene'); // 第一次进入游戏，加载加载场景
        // }
        // else {
        //     let isFirstPlay = JSON.parse(localStorage.getItem('isFirstPlay'));
        //     const isPlay = false;
        //     localStorage.setItem('isFirstPlay', JSON.stringify(isPlay));
        // }

        // 初始化菜单界面
        this.hideSettingUI();
        this.hideAddEnergyUI();

        this.playBackgroundMusic();

        eventCenter.on(JJWXR_Events.SHOW_ADD_ENERGY_UI, this.showAddEnergyUI, this);
        eventCenter.on(JJWXR_Events.HIDE_ADD_ENERGY_UI, this.hideAddEnergyUI, this);
        this.WeaponShow();
    }

    onDestroy() {
        eventCenter.off(JJWXR_Events.SHOW_ADD_ENERGY_UI, this.showAddEnergyUI, this);
        eventCenter.off(JJWXR_Events.HIDE_ADD_ENERGY_UI, this.hideAddEnergyUI, this);

        // 停止背景音乐
        AudioManager.instance.stop();
    }

    // 设置按钮
    onSetting() {
        console.log('跳转到设置界面');
        // 跳转到设置界面
        this.showSettingUI();
    }

    // 播放背景音乐
    playBackgroundMusic() {
        // 播放背景音乐
        let data = localStorage.getItem('setting');
        let isPlayBGM = JSON.parse(data);
        AudioManager.instance.play(this.backgroundMusic, isPlayBGM.sound);
    }

    // 添加时间按钮
    onAddEnergy() {
        console.log('跳转到添加时间界面');
        // 跳转到添加时间界面
        this.showAddEnergyUI();
    }

    // 游戏开始按钮
    onGameStart() {
        console.log('跳转到游戏界面');
        // // 判断是否可以开始游戏
        // if (JJWXR_EnergyManager.instance.getEnergyNum() <= 0) {
        //     // 显示警告界面
        //     this.showWarningUI();
        //     return;
        // }
        // // 消耗能量
        // eventCenter.emit(JJWXR_Events.USE_ENERGY);
        LevelData.GAMESCENE = "JJWXR_GameScene00";
        // 跳转到加载游戏界面
        director.loadScene('JJWXR_LoadingScene');
    }

    // 显示设置界面
    showSettingUI() {
        this.settingUI.active = true;
    }
    // 隐藏设置界面
    hideSettingUI() {
        this.settingUI.active = false;
    }

    // 显示添加能量界面
    showAddEnergyUI() {
        this.addEnergyUI.active = true;
    }
    // 隐藏添加能量界面
    hideAddEnergyUI() {
        this.addEnergyUI.active = false;
    }

    // 显示警告界面
    showWarningUI() {
        this.warningUI.active = true;
        this.scheduleOnce(() => {
            this.hideWarningUI();
        }, 2);
    }
    // 隐藏警告界面
    hideWarningUI() {
        this.warningUI.active = false;
    }

    WeaponShow(event?: Event) {
        if (this.isTween) return;
        let num = 0;
        if (event) {
            let target: Node = event.target;
            num = target.getSiblingIndex() == 0 ? -1 : 1;
        }
        if (num == 0) {
            const gun1 = JSON.parse(localStorage.getItem('gun1'));
            const gun2 = JSON.parse(localStorage.getItem('gun2'));
            const gun3 = JSON.parse(localStorage.getItem('gun3'));
            const gun4 = JSON.parse(localStorage.getItem('gun4'));
            const gun5 = JSON.parse(localStorage.getItem('gun5'));
            const gun6 = JSON.parse(localStorage.getItem('gun6'));
            this.gunData = [gun1, gun2, gun3, gun4, gun5, gun6];
            if (!localStorage.getItem("gunIndex")) localStorage.setItem("gunIndex", "1");
        }
        else if (this.weaponNum > 1 && this.weaponNum < 6 || (this.weaponNum == 1 && num == 1) || (this.weaponNum == 6 && num == -1)) {
            this.isTween = true;
            this.weaponNum += num;
            tween(this.weaponContent)
                .by(0.1, { position: v3(-846 * num, 0) })
                .call(() => { this.isTween = false; })
                .start();
        }
        let index = parseInt(localStorage.getItem("gunIndex"));
        this.weaponUI.children[3].active = !this.gunData[this.weaponNum - 1].isBuy;
        this.weaponUI.children[3].children[0].getComponent(Label).string = this.gunData[this.weaponNum - 1].price.toString();
        this.weaponUI.children[4].active = this.gunData[this.weaponNum - 1].isBuy && index != this.weaponNum;
        this.weaponUI.children[5].active = this.gunData[this.weaponNum - 1].isBuy && index == this.weaponNum;
    }

    BuyGun() {
        let money = parseInt(localStorage.getItem("money"));
        let price = this.gunData[this.weaponNum - 1].price;
        if (money < price) return UIManager.ShowTip("代币不足！");
        eventCenter.emit(JJWXR_Events.SUB_MONEY, price);
        this.gunData[this.weaponNum - 1].isBuy = true;
        localStorage.setItem(`gun${this.weaponNum}`, JSON.stringify(this.gunData[this.weaponNum - 1]));
        this.weaponUI.children[3].active = false;
        this.weaponUI.children[4].active = true;
    }

    UseGun() {
        localStorage.setItem("gunIndex", this.weaponNum.toString());
        let index = parseInt(localStorage.getItem("gunIndex"));
        this.weaponUI.children[3].active = !this.gunData[this.weaponNum - 1].isBuy;
        this.weaponUI.children[3].children[0].getComponent(Label).string = this.gunData[this.weaponNum - 1].price.toString();
        this.weaponUI.children[4].active = this.gunData[this.weaponNum - 1].isBuy && index != this.weaponNum;
        this.weaponUI.children[5].active = this.gunData[this.weaponNum - 1].isBuy && index == this.weaponNum;
    }

    onGetMoreMoney() {
        Banner.Instance.ShowVideoAd(() => {
            eventCenter.emit(JJWXR_Events.GET_MORE_MONEY);
            eventCenter.emit(JJWXR_Events.UPDATE_MONEY);
        });
    }

}