import { _decorator, Component, Event, EventTouch, Input, Node, Vec2, Vec3 } from 'cc';
import { PGZY_SXZY } from './PGZY_SXZY';
import { PGZY_Language_AQ } from './PGZY_Language_AQ';
const { ccclass, property } = _decorator;

@ccclass('PGZY_Item_Language_AQ')
export class PGZY_Item_Language_AQ extends Component {
    @property
    MissionIndex: number = 0;

    done: boolean = false;
    touchCancel: boolean = false;

    onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    pos: Vec2 = null;
    protected onTouchStart(event: EventTouch): void {
        console.log("onTouchStart");
        this.touchCancel = false;
    }

    protected onTouchCancel(event: EventTouch): void {
        this.touchCancel = true;
    }

    protected onTouchEnd(event: EventTouch): void {
        console.log("onTouchEnd");
        if (this.done) return;
        if (!this.touchCancel) {
     
            PGZY_Language_AQ.Instance.Select(this);
        }
    }

    ShowRight() {
        this.done = true;
        this.node.children.forEach(e => e.active = true);
    }

}


