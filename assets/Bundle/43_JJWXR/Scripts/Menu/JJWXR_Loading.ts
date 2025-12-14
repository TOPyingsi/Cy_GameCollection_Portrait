import { _decorator, Component, Scene, director, ProgressBar, Node, assetManager, SceneAsset } from 'cc';
const { ccclass, property } = _decorator;

export class LevelData {
    public static GAMESCENE: string = "JJWXR_ShootAndHide";
    // public static GAMESCENE: string = "JJWXR_GameScene00";
    public static LEVEL01: number = 1;
}
@ccclass('JJWXR_Loading')
export class JJWXR_Loading extends Component {
    @property(Node)
    loadingBar: Node = null;

    private bar: ProgressBar = null;
    private currentTime: number = 0;
    private totalTime: number = 3;

    start() {
        director.preloadScene(LevelData.GAMESCENE);
        // 进度条
        this.bar = this.loadingBar.getComponent(ProgressBar);
        this.bar.progress = 0;
        this.currentTime = 0;
        this.loadingGameScene();
    }

    update(deltaTime: number) {
        if (this.currentTime <= this.totalTime) {
            this.currentTime += deltaTime;
            this.bar.progress = this.currentTime / this.totalTime;
        }
    }

    loadingGameScene() {
        // assetManager.releaseAsset(this.scene);
        director.loadScene(LevelData.GAMESCENE);
    }
}