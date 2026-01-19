import { _decorator, Button, Component, Node, director, AudioClip, assetManager } from 'cc';
import { eventCenter } from '../Utils/JJWXR_pigeon_EventCenter';
import { JJWXR_pigeon_Events } from '../Utils/JJWXR_pigeon_Events';
import { JJWXR_pigeon_AudioManager } from '../Utils/JJWXR_pigeon_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_pigeon_SettingUI')
export class JJWXR_pigeon_SettingUI extends Component {

    @property(Button)
    private btnEscape: Button = null;
    @property(Button)
    private btnSoundEffect: Button = null;
    @property(Button)
    private btnOscillation: Button = null;
    @property(Button)
    private btnComeBack: Button = null;
    @property(Button)
    private btnRestart: Button = null;

    @property(AudioClip)
    private backgroundMusic: AudioClip = null; // 点击音效

    private soundClose: Node = null;
    private soundOpen: Node = null;
    private oscillationClose: Node = null;
    private oscillationOpen: Node = null;

    start() {
        this.initBtn();
        this.btnEscape.node.on(Button.EventType.CLICK, this.onBtnClose, this);
        this.btnSoundEffect.node.on(Button.EventType.CLICK, this.onBtnSound, this);
        this.btnOscillation.node.on(Button.EventType.CLICK, this.onBtnVibration, this);
        this.btnComeBack.node.on(Button.EventType.CLICK, this.onBtnComeBack, this);
        this.btnRestart.node.on(Button.EventType.CLICK, this.onBtnRestart, this);
    }

    initBtn() {
        // 初始化按钮状态
        let isOpened = JSON.parse(localStorage.getItem('JJWXR_pigeon_setting'));
        this.soundClose = this.btnSoundEffect.node.getChildByName('BtnClose');
        this.soundOpen = this.btnSoundEffect.node.getChildByName('BtnOpen');
        this.oscillationClose = this.btnOscillation.node.getChildByName('BtnClose');
        this.oscillationOpen = this.btnOscillation.node.getChildByName('BtnOpen');

        if (isOpened.sound) {
            this.soundClose.active = false;
            this.soundOpen.active = true;
        }
        else {
            this.soundClose.active = true;
            this.soundOpen.active = false;
        }

        if (isOpened.oscillation) {
            this.oscillationClose.active = false;
            this.oscillationOpen.active = true;
        }
        else {
            this.oscillationClose.active = true;
            this.oscillationOpen.active = false;
        }
    }

    // 返回按钮
    onBtnClose() {
        eventCenter.emit(JJWXR_pigeon_Events.GAME_RESUME);
        this.node.active = false;
    }

    // 声音
    onBtnSound() {
        console.log('onBtnSound');
        // TODO：声音开关
        let isOpened = JSON.parse(localStorage.getItem('JJWXR_pigeon_setting'));
        this.soundClose.active = !this.soundClose.active;
        this.soundOpen.active = !this.soundOpen.active;
        isOpened.sound = !isOpened.sound;
        localStorage.setItem('JJWXR_pigeon_setting', JSON.stringify(isOpened));
        JJWXR_pigeon_AudioManager.instance.play(this.backgroundMusic, isOpened.sound);
    }

    onBtnVibration() {
        console.log('onBtnVibration');
        // TODO：震动开关
        let isOpened = JSON.parse(localStorage.getItem('JJWXR_pigeon_setting'));
        this.oscillationClose.active = !this.oscillationClose.active;
        this.oscillationOpen.active = !this.oscillationOpen.active;
        isOpened.oscillation = !isOpened.oscillation;
        localStorage.setItem('JJWXR_pigeon_setting', JSON.stringify(isOpened));
    }

    onBtnComeBack() {
        this.node.active = false;
        director.loadScene('JJWXR_pigeon_MenuScene');
    }

    onBtnRestart() {
        console.log('onBtnRestart');
        // 重新开始
        director.loadScene(director.getScene().name);
    }

}