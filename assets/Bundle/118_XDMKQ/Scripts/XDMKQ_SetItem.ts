import { _decorator, Component, Enum, EventTouch, find, Node, Slider, Sprite } from 'cc';
import { XDMKQ_AUDIO, XDMKQ_SET } from './XDMKQ_Constant';
import { XDMKQ_GameData } from './XDMKQ_GameData';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_SetItem')
export class XDMKQ_SetItem extends Component {

    @property({ type: Enum(XDMKQ_SET) })
    Type: XDMKQ_SET = XDMKQ_SET.音乐;

    Slider: Slider = null;
    Sprite: Sprite = null;

    Open: Node = null;
    Close: Node = null;

    protected onLoad(): void {
        if (this.Type == XDMKQ_SET.震动) {
            this.Open = find("Open", this.node);
            this.Close = find("Close", this.node);
            this.Show();
            return;
        }
        this.Slider = find("Slider", this.node).getComponent(Slider);
        this.Sprite = find("Slider/Sprite", this.node).getComponent(Sprite);
        this.Slider.node.on('slide', this.OnSlide, this);

        this.Slider.progress = this.Type == XDMKQ_SET.音乐 ? XDMKQ_GameData.Instance.Music : XDMKQ_GameData.Instance.Sound;
        this.Show();
    }

    Show() {
        if (this.Type == XDMKQ_SET.震动) {
            this.Open.active = XDMKQ_GameData.Instance.Shake;
            this.Close.active = !XDMKQ_GameData.Instance.Shake;
            return;
        }
        this.Sprite.fillRange = this.Slider.progress;
    }

    OnSlide(slider: Slider) {
        this.Type == XDMKQ_SET.音乐 ? XDMKQ_GameData.Instance.Music = this.Slider.progress : XDMKQ_GameData.Instance.Sound = this.Slider.progress;
        XDMKQ_AudioManager.Instance.ChangeVolume();
        XDMKQ_GameData.DateSave();
        this.Show();
    }

    OnButtonClick(event: EventTouch) {
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.点击);
        switch (event.getCurrentTarget().name) {
            case "Open":
                XDMKQ_GameData.Instance.Shake = false;
                XDMKQ_GameData.DateSave();
                this.Show();
                break;
            case "Close":
                XDMKQ_GameData.Instance.Shake = true;
                XDMKQ_GameData.DateSave();
                this.Show();
                break;
        }
    }
}


