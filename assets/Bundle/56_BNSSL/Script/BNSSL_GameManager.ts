import { _decorator, Animation, Component, director, EventTarget, Label, Node, Prefab } from 'cc';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { BNSSL_AudioManager } from './BNSSL_AudioManager';
import { BNSSL_TouchHandler } from './BNSSL_TouchHandler';
const { ccclass, property } = _decorator;

@ccclass('BNSSL_GameManager')
export class BNSSL_GameManager extends Component {

    public static _instance: BNSSL_GameManager;

    @property(Prefab) answer: Prefab = null;
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Label) ROP: Label = null;
    @property(Node) dachuanghu: Node = null;
    @property(Node) male: Node = null;
    @property(Node) female: Node = null;
    @property(Node) labelBG: Node = null;


    count: number = 0;

    protected onLoad(): void {
        this.ROP.string = `${this.count}/15`;
    }

    start() {
        BNSSL_GameManager._instance = this;
        this.gamePanel.answerPrefab = this.answer;
        this.gamePanel.time = 180;

        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        } else {
            this.Init();
        }
    }

    Init() {
        const num = BNSSL_AudioManager.Instance.playAudio("你个臭男人，我倒要看看你和狐狸精在干嘛")
        this.setRoleLabel("你个臭男人，我倒要看看你和狐狸精在干嘛", num)
    }


    refreshROP() {
        this.count++
        this.ROP.string = ` ${this.count}/15`
        console.log(this.count)

        if (this.count >= 15) {
            this.scheduleOnce(() => {
                this.dachuanghu.active = true;
                const maleAni = this.male.getComponent(Animation)
                maleAni.play("Male");
                const femaleAni = this.female.getComponent(Animation)
                femaleAni.play("女主惊讶");
                const num1 = BNSSL_AudioManager.Instance.playAudio("总算上来了")
                this.setRoleLabel("总算上来了", num1)

                this.scheduleOnce(() => {
                    const num2 = BNSSL_AudioManager.Instance.playAudio("老婆你怎么来了")
                    this.setRoleLabel("老婆你怎么来了", num2)

                    this.scheduleOnce(() => {
                        this.gamePanel.Win();
                    }, num2);
                }, num1);
            });
        }
    }

    setRoleLabel(str: string, num: number) {
        BNSSL_TouchHandler.instance.isTouching = true;
        this.labelBG.active = true;
        this.labelBG.getChildByName("Label").getComponent(Label).string = str
        this.scheduleOnce(() => {
            this.labelBG.active = false;
            BNSSL_TouchHandler.instance.isTouching = false;
        }, num);
    }

}


