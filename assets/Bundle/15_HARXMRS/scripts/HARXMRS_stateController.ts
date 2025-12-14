import { _decorator, AudioClip, color, Component, director, Node, Sprite, tween, UIOpacity } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('stateController')
export class stateController extends Component {

    @property(UIOpacity)
    uio: UIOpacity;
    @property(Node)
    logmen: Node;
    @property(Node)
    logwomen: Node;

    @property(AudioClip)
    women: AudioClip;
    @property(AudioClip)
    men: AudioClip;

    protected onLoad(): void {
        this.logwomen.setScale(0, 0, 0);
        this.logmen.setScale(0, 0, 0);
        director.getScene().once(MyEvent.TreasureBoxDestroy, () => {
            this.gameStart();
        }, this);
    }

    isGameStart: number = 0;

    start() {
        this.node.setScale(1, 1, 1);
        this.uio.opacity = 0;
        // this.gameStart();
    }

    private gameStart() {
        this.scheduleOnce(() => {
            this.logwomen.setScale(1, 1, 1);
            AudioManager.Instance.PlaySFX(this.women);
        }, 0);
        this.scheduleOnce(() => {
            this.logwomen.setScale(0, 0, 0);
            AudioManager.Instance.PlaySFX(this.men);
            this.logmen.setScale(1, 1, 1);
        }, 4);
        this.scheduleOnce(() => {
            this.scheduleOnce(() => {
                tween(this.uio).to(2, { opacity: 255 }).call(() => {
                    this.node.setScale(0, 0, 0);
                    tween(this.uio).to(1, { opacity: 0 }).call(() => {
                        director.getScene().emit("gameStart");
                    }).start();
                }).start();
            });
        }, 7);
    }

    update(deltaTime: number) {
        if (ProjectEventManager.GameStartIsShowTreasureBox == false && this.isGameStart == 0) {
            this.isGameStart++;
            this.gameStart();
        }
    }
}


