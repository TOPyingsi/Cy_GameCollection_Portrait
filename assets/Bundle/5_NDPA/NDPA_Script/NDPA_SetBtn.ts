import { _decorator, Button, Component, Enum, EventTouch, Node } from 'cc';
import { NDPA_BUTTON } from './NDPA_GameConstant';
const { ccclass, property } = _decorator;

@ccclass('NDPA_SetBtn')
export class NDPA_SetBtn extends Component {

    @property({ type: Enum(NDPA_BUTTON) })
    ButtonType: NDPA_BUTTON = NDPA_BUTTON.MUSIC;

    isPitchOn: boolean = true;
    Picture: Node = null;

    protected onLoad(): void {
        this.Picture = this.node.getChildByName("对勾");
        this.show();
    }

    show() {
        this.Picture.active = this.isPitchOn;
    }

    click() {
        this.isPitchOn = !this.isPitchOn;
        this.show();
    }
}


