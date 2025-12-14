import { _decorator, Component, director, Node, tween, Vec3 } from 'cc';
import PlayerManager from '../Manage/SSL_PlayerManager';
import { sharesManager } from '../Manage/SSL_sharesManager';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('gameOverController')
export class gameOverController extends Component {
    protected onLoad(): void {
        this.node.setScale(Vec3.ZERO);
    }

    windownsComeIn() {
        tween(this.node).to(0.3, { scale: Vec3.ONE }).call(() => { }).start();
    }

    windownsComeOut() {
        tween(this.node).to(0.3, { scale: Vec3.ZERO }).call(() => { }).start();
    }

    reborn() {
        this.windownsComeOut();
        this.scheduleOnce(() => { director.getScene().emit("backToMain") }, 0.3);
        PlayerManager.Instance.reBurn();
        sharesManager.Instance.reborn();
    }

    watchAd() {
        Banner.Instance.ShowVideoAd(() => {
            this.windownsComeOut();
            this.scheduleOnce(() => { director.getScene().emit("backToMain") }, 0.3);
            PlayerManager.Instance.afterAd();
        });
    }
}


