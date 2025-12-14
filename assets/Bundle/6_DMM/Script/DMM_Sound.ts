import { _decorator, Component, Enum, Node } from 'cc';
import { DMM_SOUND } from './DMM_Constant';
import { DMM_PrefsManager } from './DMM_PrefsManager';
const { ccclass, property } = _decorator;

@ccclass('DMM_Sound')
export class DMM_Sound extends Component {
    @property({ type: Enum(DMM_SOUND) })
    Type: DMM_SOUND = DMM_SOUND.MUSIC;

    Open: Node = null;
    Close: Node = null;

    IsMute: boolean = false;

    protected onLoad(): void {
        this.Open = this.node.getChildByName("开启");
        this.Close = this.node.getChildByName("关闭");
    }

    protected start(): void {
        this.init();
    }

    init() {
        this.IsMute = DMM_PrefsManager.Instance.userData.Sound[this.Type];
        this.Open.active = !this.IsMute;
        this.Close.active = this.IsMute;
    }

    switch() {
        this.IsMute = !this.IsMute;
        this.Open.active = !this.IsMute;
        this.Close.active = this.IsMute;
        DMM_PrefsManager.Instance.userData.Sound[this.Type] = this.IsMute;
        DMM_PrefsManager.Instance.saveData();
    }
}


