import { _decorator, Component, Enum, find, Slider, Sprite, Node, EventTouch } from 'cc';
import { XCJZ_SET } from './XCJZ_Constant';
import { XCJZ_GameData } from './XCJZ_GameData';
import { XCJZ_AudioManager } from './XCJZ_AudioManager';

const { ccclass, property } = _decorator;

@ccclass('XCJZ_SetItem')
export class XCJZ_SetItem extends Component {

    @property({ type: Enum(XCJZ_SET) })
    Type: XCJZ_SET = XCJZ_SET.音乐;

    Slider: Slider = null;
    Sprite: Sprite = null;

    Open: Node = null;
    Close: Node = null;

    protected onLoad(): void {
        if (this.Type == XCJZ_SET.震动) {
            this.Open = find("Open", this.node);
            this.Close = find("Close", this.node);
            this.Show();
            return;
        }
        this.Slider = find("Slider", this.node).getComponent(Slider);
        this.Sprite = find("Slider/Sprite", this.node).getComponent(Sprite);
        this.Slider.node.on('slide', this.OnSlide, this);

        this.Slider.progress = this.Type == XCJZ_SET.音乐 ? XCJZ_GameData.Instance.Music : XCJZ_GameData.Instance.Sound;
        this.Show();
    }

    Show() {
        if (this.Type == XCJZ_SET.震动) {
            this.Open.active = XCJZ_GameData.Instance.Shake;
            this.Close.active = !XCJZ_GameData.Instance.Shake;
            return;
        }
        this.Sprite.fillRange = this.Slider.progress;
    }

    OnSlide(slider: Slider) {
        this.Type == XCJZ_SET.音乐 ? XCJZ_GameData.Instance.Music = this.Slider.progress : XCJZ_GameData.Instance.Sound = this.Slider.progress;
        XCJZ_GameData.DateSave();
        XCJZ_AudioManager.Instance.ChangeVolume();
        this.Show();
    }

    OnButtonClick(event: EventTouch) {
        switch (event.getCurrentTarget().name) {
            case "Open":
                XCJZ_GameData.Instance.Shake = false;
                XCJZ_GameData.DateSave();
                this.Show();
                break;
            case "Close":
                XCJZ_GameData.Instance.Shake = true;
                XCJZ_GameData.DateSave();
                this.Show();
                break;
        }
    }
}


