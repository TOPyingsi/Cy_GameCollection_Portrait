import { _decorator, Component, Node, director, AudioClip, assetManager } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Player } from './JJWXR_Player';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
import { AudioManager } from '../Utils/JJWXR_AudioManager';
import { PhysicsManager } from 'db://assets/Scripts/Framework/Managers/PhysicsManager';
import { GameManager } from 'db://assets/Scripts/GameManager';

const { ccclass, property } = _decorator;

@ccclass('JJWXR_GameManager')
export class JJWXR_GameManager extends Component {
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 游戏玩家
    public player_JJWXR: JJWXR_Player = new JJWXR_Player();

    @property(AudioClip)
    public backgroundMusic: AudioClip = null;

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 单例模式
    private static _instance: JJWXR_GameManager = null;
    public static get instance(): JJWXR_GameManager {
        return this._instance;
    }

    onLoad() {
        JJWXR_GameManager._instance = this;
        PhysicsManager.SetCollisionMatrix(GameManager.GameData);
        // localStorage.setItem('currentLevel', '6');
    }

    start() {
        let isPlay = JSON.parse(localStorage.getItem('setting'));
        AudioManager.instance.play(this.backgroundMusic, isPlay.sound);
        eventCenter.on(JJWXR_Events.LOAD_MENU_SCENE, this.loadMenuScene, this);
        eventCenter.on(JJWXR_Events.RESTART_GAME, this.restartGame, this);
    }

    onDestroy() {
        eventCenter.off(JJWXR_Events.LOAD_MENU_SCENE, this.loadMenuScene, this);
        eventCenter.off(JJWXR_Events.RESTART_GAME, this.restartGame, this);

        // 停止背景音乐
        AudioManager.instance.stop();
    }

    public loadMenuScene() {
        director.loadScene("JJWXR_MenuScene"); // 加载场景
    }

    public restartGame() {
        director.loadScene(director.getScene().name); // 加载场景
    }
}