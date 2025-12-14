import { _decorator, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MGFJSHJ_ScrollBg')
export class MGFJSHJ_ScrollBg extends Component {
    @property(Node)
    public scrollNode: Node[] = [];

    start() {
        this.scroolBg();
    }

    index: number = 0;
    scroolBg() {
        tween(this.node)
            .by(10, { position: v3(-1080, 0, 0) })
            .call(() => {
                let x = this.index % 2;
                this.scrollNode[x].position.add(v3(2160, 0, 0));
                this.index++;
                this.scroolBg();
            })
            .start();
    }

}


