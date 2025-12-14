import { _decorator, AudioSource, Button, Component, Node, Sprite, tween, v2 } from 'cc';
import { ZCBZ_GameManager } from './ZCBZ_GameManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ZCBZ_ButtonManager')
export class ZCBZ_ButtonManager extends Component {
    private fillSpeed: number = 0.01; // 填充速度
    private currentFill: number = 0;
    private fillDuration: number = 0.7; // 填充动画持续时间
    start() {
        this.node.getComponent(Sprite).type = Sprite.Type.FILLED;
        this.node.getComponent(Sprite).fillType = Sprite.FillType.RADIAL; // 使用径向填充
        this.node.getComponent(Sprite).fillCenter = v2(0.5, 0.5); // 设置填充中心点
        this.node.getComponent(Sprite).fillStart = 0; // 填充起始角度
        this.node.getComponent(Sprite).fillRange = 0; // 初始填充范围为 0

    }

    update(deltaTime: number) {
    }
    StartFillAnimation() {
        AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
        tween(this.node.getComponent(Sprite))
            .to(this.fillDuration, { fillRange: 1 }, { // 从 0 到 1 填充
                onUpdate: (target: Sprite, ratio: number) => {
                    // 在每一帧更新时调用
                    target.fillRange = ratio;
                }
            })
            .start(); // 启动动画
        this.node.getComponent(Button).enabled = false;

        ZCBZ_GameManager.Instance.WinNumber += 1;
        ZCBZ_GameManager.Instance.LabelChange();
        ZCBZ_GameManager.Instance.WinorLose();
    }
}


