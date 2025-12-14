import { _decorator, AudioClip, Component, director, EventTouch, Label, Node, Prefab, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v2, Vec3 } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { NZABSJ_PropController } from './NZABSJ_PropController';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { NZABSJ_RoleController } from './NZABSJ_RoleController';
import { NZABSJ_BoxColliderController } from './NZABSJ_BoxColliderController';
const { ccclass, property } = _decorator;


@ccclass('NZABSJ_GameMain')
export class NZABSJ_GameMain extends Component {

    private static instance: NZABSJ_GameMain;

    public static get Instance(): NZABSJ_GameMain {
        if (!this.instance) {
            this.instance = new NZABSJ_GameMain();
        }
        return this.instance;
    }

    @property(Node)
    progressNode: Node = null;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    @property(Prefab)
    answer: Prefab = null;

    round = 0;

    protected onLoad(): void {
        NZABSJ_GameMain.instance = this;

    }

    protected start(): void {
        NZABSJ_PropController.Instance.onLoadSprite(this.round);
        this.gamePanel.answerPrefab = this.answer;
    }

    loadProgress() {
        this.round++
        this.progressNode.getChildByName("Progress").getComponent(Sprite).fillRange += 0.143;
        this.progressNode.getChildByName("ProgressLabel").getComponent(Label).string = (this.round) + "/7";
        NZABSJ_PropController.Instance.onLoadSprite(this.round);

        if (this.round >= 7) {
            const eNumber = NZABSJ_RoleController.Instance.eCount;
            console.log("eNumber", eNumber);
            if (eNumber == 0) {
                this.gamePanel.Win()
            } else if (eNumber > 0) {
                this.gamePanel.Lost()
            }
        }
    }



}


