import { _decorator, Component, Slider, Sprite } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('MJMJ_EffectController')
export class MJMJ_EffectController extends Component {

    private static instance: MJMJ_EffectController | null = null;

    public static get Instance(): MJMJ_EffectController {
        return this.instance;
    }


    @property(Sprite)
    SpriteAblation_sp: Sprite = null

    num: number = 0

    protected onLoad(): void {
        MJMJ_EffectController.instance = this;
    }

    protected update(dt: number): void {
        const value = this.num += 0.005
        this.SpriteAblation_sp.getMaterial(0)!.setProperty('noiseThreshold', value);
    }

    reSet() {
        this.num = 0
        this.SpriteAblation_sp.getMaterial(0)!.setProperty('noiseThreshold', this.num);
    }
}
