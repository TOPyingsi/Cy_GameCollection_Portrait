import { _decorator, Component, Event, Node, tween, UITransform, v3 } from 'cc';
import { MGRKT_AudioManager } from './MGRKT_AudioManager';
import { MGRKT_EnemyCtrl } from './MGRKT_EnemyCtrl';
import { MGRKT_GameManager } from './MGRKT_GameManager';
const { ccclass, property } = _decorator;

@ccclass('MGRKT_ButtonCtrl')
export class MGRKT_ButtonCtrl extends Component {
    public static instance: MGRKT_ButtonCtrl = null;

    private buttons: Node[] = [];
    private button: Node = null;

    protected onLoad(): void {
        MGRKT_ButtonCtrl.instance = this;
        this.buttons = this.node.children;
    }

    activeButton(name: string): Node {
        this.button = this.buttons.find(x => x.name == name)
        this.button.active = true;
        tween(this.button)
            .to(0.5, { position: v3(0, -500, 0) })
            .start()
        return this.button;
    }

    onButtonClick(event: Event) {
        this.button.destroy()
        MGRKT_GameManager.instance.loadProp(event.target.name, this.callBack.bind(this))
    }

    callBack(buttonName: string) {
        MGRKT_EnemyCtrl.instance.loadSkinOrAniByRole(buttonName)
        const enemy = MGRKT_EnemyCtrl.instance.enemy
        const time = MGRKT_AudioManager.instance.playAudio(`${enemy.name}_${buttonName}`)
        const label = MGRKT_GameManager.instance.setLabel(buttonName)
        const pos = MGRKT_EnemyCtrl.instance.enemyInitialPos
        switch (buttonName) {
            case "加特林": case "颜料盘": case "锤子": case "地钻": case "榨汁机": case "泡泡糖": case "打气筒": case "情书":
                this.scheduleOnce(() => {
                    label.active = false
                    tween(enemy)
                        .to(0.5, { position: pos })
                        .call(() => {
                            enemy.destroy()
                            MGRKT_GameManager.instance.next()
                        }).start()
                }, time)
                break;

            default:
                try {
                    this.scheduleOnce(() => {
                        label.active = false
                        MGRKT_GameManager.instance.mgrSke.setAnimation(0, "daodi", false)
                        this.scheduleOnce(() => {
                            MGRKT_GameManager.instance.gamePanel.Lost();
                        }, 1)
                    }, time)
                } catch (error) {
                    console.error(error)
                }
                break;
        }
    }
}


