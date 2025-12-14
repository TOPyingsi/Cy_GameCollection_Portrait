import { _decorator, Component, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_Panel')
export class XDMKQ_Panel extends Component {

    @property(Node)
    Panel: Node = null;

    @property(Node)
    Main: Node = null;

    @property
    Use: boolean = true;

    Show() {
        if (!this.Use) {
            this.Main.active = true;
            this.Panel.active = true;
            this.node.active = true;
            return;
        }
        this.node.active = true;
        Tween.stopAllByTarget(this.Main);
        this.Main.active = true;
        this.Main.scale = new Vec3(0, 0, 0);
        tween(this.Main)
            .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'sineOut' })
            .call(() => {
                this.Panel.active = true;
            })
            .start();
    }

    Close() {
        if (!this.Use) {
            this.Main.active = false;
            this.Panel.active = false;
            this.node.active = false;
            return;
        }
        Tween.stopAllByTarget(this.Main);
        tween(this.Main)
            .to(0.3, { scale: new Vec3(0, 0, 0) }, { easing: `sineOut` })
            .call(() => {
                this.Main.active = false;
                this.Panel.active = false;
                this.node.active = false;
            })
            .start();
    }

}


