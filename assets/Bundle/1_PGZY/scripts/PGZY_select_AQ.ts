import { _decorator, Component, Event, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PGZY_select_AQ')
export class PGZY_select_AQ extends Component {

    buttons: Node = null;
    cb: Function;

    Show(active: boolean = false, position: Vec3 = Vec3.ZERO, cb: Function = null) {
        this.node.active = active;

        if (active) {
            this.cb = cb;
            this.node.getChildByName("Buttons").setWorldPosition(position);
        }
    }


    OnButtonClick(event: Event) {
        // AudioManager.PlayNormalUIAudio(Constant.Audio.ButtonClick);

        switch (event.target.name) {
            // case "Mask":
            //     this.Show(false);
            //     break;

            case "Right":
                this.Show(false);
                this.cb && this.cb(true);
                break;

            case "Wrong":
                this.Show(false);
                this.cb && this.cb(false);
                break;
        }
    }

}


