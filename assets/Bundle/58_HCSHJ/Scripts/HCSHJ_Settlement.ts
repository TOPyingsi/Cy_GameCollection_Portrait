import { _decorator, AudioClip, AudioSource, Component, Node, Sprite, SpriteFrame } from 'cc';
import { HCSHJ_DynamicDt } from './HCSHJ_DynamicDt';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_')
export class HCSHJ_ extends Component {
    @property([SpriteFrame])
    levelImg: SpriteFrame[] = [];

    @property([SpriteFrame])
    PowImg: SpriteFrame[] = [];

    @property([SpriteFrame])
    roleName: SpriteFrame[] = [];

    @property([AudioClip])
    roleAudio: AudioClip[] = [];

    @property([AudioClip])
    role: AudioClip[] = [];

    protected onLoad(): void {
        this.node.getComponent(AudioSource).clip = this.roleAudio[HCSHJ_DynamicDt.Instance.getroleId()];
        this.node.getComponent(AudioSource).play();
        this.node.getChildByName("role_jiesuan").getComponent(Sprite).spriteFrame = this.node.parent.getChildByName("role").getComponent(Sprite).spriteFrame;
        this.node.getChildByName("roleName").getComponent(Sprite).spriteFrame = this.roleName[HCSHJ_DynamicDt.Instance.roleID];
        this.node.getChildByName("powerN").getComponent(Sprite).spriteFrame = this.PowImg[HCSHJ_DynamicDt.Instance.roleID];
        this.node.getChildByName("level").getComponent(Sprite).spriteFrame = this.levelImg[HCSHJ_DynamicDt.Instance.roleID];

    }
}


