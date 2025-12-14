
import { _decorator, Component, Slider, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Effect_Demo')
export class Effect_Demo extends Component {

    @property(Sprite)
    SpriteAblation_sp: Sprite = null

    private SpriteAblationSliderCallback(slider: Slider, customEventData: string) {
        const value = slider.progress * 1.0;
        this.SpriteAblation_sp.getMaterial(0)!.setProperty('noiseThreshold', value);
    }
}

