import { _decorator, Component, Node, director, AudioClip, assetManager } from 'cc';
import { eventCenter } from '../Utils/JJWXR_pigeon_EventCenter';
import { JJWXR_pigeon_Player } from './JJWXR_pigeon_Player';
import { JJWXR_pigeon_Events } from '../Utils/JJWXR_pigeon_Events';
import { JJWXR_pigeon_AudioManager } from '../Utils/JJWXR_pigeon_AudioManager';
import { PhysicsManager } from 'db://assets/Scripts/Framework/Managers/PhysicsManager';
import { GameManager } from 'db://assets/Scripts/GameManager';

const { ccclass, property } = _decorator;

@ccclass('JJWXR_pigeon_GameManager')
export class JJWXR_pigeon_GameManager extends Component {
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 游戏玩家
    public player_JJWXR_pigeon: JJWXR_pigeon_Player = new JJWXR_pigeon_Player();

    @property(AudioClip)
    public backgroundMusic: AudioClip = null;

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 单例模式
    private static _instance: JJWXR_pigeon_GameManager = null;
    public static get instance(): JJWXR_pigeon_GameManager {
        return this._instance;
    }

    onLoad() {
        JJWXR_pigeon_GameManager._instance = this;
        PhysicsManager.SetCollisionMatrix(GameManager.GameData);
        // localStorage.setItem('JJWXR_pigeon_currentLevel', '6');
    }

    start() {
        let isPlay = JSON.parse(localStorage.getItem('JJWXR_pigeon_setting'));
        JJWXR_pigeon_AudioManager.instance.play(this.backgroundMusic, isPlay.sound);
        eventCenter.on(JJWXR_pigeon_Events.LOAD_MENU_SCENE, this.loadMenuScene, this);
        eventCenter.on(JJWXR_pigeon_Events.RESTART_GAME, this.restartGame, this);
    }

    onDestroy() {
        eventCenter.off(JJWXR_pigeon_Events.LOAD_MENU_SCENE, this.loadMenuScene, this);
        eventCenter.off(JJWXR_pigeon_Events.RESTART_GAME, this.restartGame, this);

        // 停止背景音乐
        JJWXR_pigeon_AudioManager.instance.stop();
    }

    public loadMenuScene() {
        director.loadScene("JJWXR_pigeon_MenuScene"); // 加载场景
    }

    public restartGame() {
        director.loadScene(director.getScene().name); // 加载场景
    }
}