import { _decorator, Component, find, Node, tween, UIOpacity } from 'cc';
import { QC_AudioManager } from './QC_AudioManager';
import { QC_GameManager } from './QC_GameManager';
const { ccclass, property } = _decorator;

@ccclass('QC_Ani')
export class QC_Ani extends Component {

    public static instance: QC_Ani = null;

    isjd: boolean = false;

    protected onLoad(): void {
        QC_Ani.instance = this;
    }


    nz(objective_after: Node, objective_befor: Node) {
        const time = QC_AudioManager.instance.playAudio("乖女儿，让我再睡几分钟")
        QC_GameManager.instance.setLabel(false, "乖女儿，让我再睡几分钟", time)

        objective_after.active = true;
        objective_befor.active = false;
        QC_GameManager.instance.hh()
        this.scheduleOnce(() => {
            QC_GameManager.instance.mask.active = false;
            objective_after.active = false;
            objective_befor.active = true;
        }, time)
    }

    sj(objective_after: Node, objective_befor: Node, time: number) {


        objective_after.active = true;
        objective_befor.active = false;
        QC_GameManager.instance.hh()

        this.scheduleOnce(() => {
            QC_GameManager.instance.mask.active = false;
            objective_after.active = false;
            objective_befor.active = true;
        }, time)
    }

    j(objective_after: Node, objective_befor: Node, time: number) {


        objective_after.active = true;
        objective_befor.active = false;
        QC_GameManager.instance.hh()

        this.scheduleOnce(() => {
            QC_GameManager.instance.mask.active = false;
            objective_after.active = false;
            objective_befor.active = true;
        }, time)
    }

    jd(objective_after: Node, objective_befor: Node) {
        const time = QC_AudioManager.instance.playAudio("等我睡醒了再教训你")
        QC_GameManager.instance.setLabel(false, "等我睡醒了再教训你", time)

        objective_after.active = true;
        objective_after.getChildByName("脚红肿").active = true;
        objective_befor.active = false;
        QC_GameManager.instance.hh()

        this.scheduleOnce(() => {
            QC_GameManager.instance.mask.active = false;
            objective_after.active = false;
            objective_befor.active = true;
            objective_befor.getChildByName("脚红肿").active = true;

            this.isjd = true;
        }, time)
    }

    kg(objective_after: Node, objective_befor: Node) {
        if (QC_GameManager.instance.iskg) {
            console.warn("1111111111111111111111111111")
            QC_GameManager.instance.mask.active = false;
            return;
        }
        QC_GameManager.instance.iskg = true;
        QC_GameManager.instance.hh();
        // this.originalPos = this.node.position.clone();
        const x = find("Canvas/GameArea/BG/台灯/灯光")
        const uio = x.getComponent(UIOpacity)
        tween(uio)
            .to(0.1, { opacity: 255 })
            .to(0.1, { opacity: 0 })
            .union().repeat(5)
            .call(() => {
                const time = QC_AudioManager.instance.playAudio("我数到三快点给我关灯")
                QC_GameManager.instance.setLabel(false, "我数到三快点给我关灯", time)
                objective_after.active = true;
                objective_befor.active = false;
                this.scheduleOnce(() => {
                    objective_after.active = false;
                    objective_befor.active = true;
                    QC_GameManager.instance.mask.active = false;
                }, time)
            })
            .start();

    }
}


