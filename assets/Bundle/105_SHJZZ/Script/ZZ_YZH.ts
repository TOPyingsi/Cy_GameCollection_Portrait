import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZZ_YZH')
export class ZZ_YZH extends Component {

    public static instance: ZZ_YZH = null;

    @property(Label) title: Label = null;

    @property([Node]) props: Node[] = [];

    round: number = 0;

    protected onLoad(): void {
        ZZ_YZH.instance = this;
    }

    protected start(): void {
        this.loadTitle();
        this.loadPropsToRound();
    }

    loadTitle() {
        console.log("this.round", this.round);
        switch (this.round) {
            case 0:
                this.title.string = "将身体放置到正确的位置"
                break;
            case 1:
                this.title.string = "用角磨机打磨壳子"
                break;
            case 2:
                this.title.string = "用锯子把椰子分开"
                break;
            case 3:
                this.title.string = "好像少点什么？把头安装上试试"
                break;
            case 4:
                this.title.string = "他看起来不太开心，把椰汁给他喝吧"
                break;
            case 5:
                this.title.string = "椰子猴看起来心情不错，送他个礼物吧！"
                break;
            case 6:
                this.title.string = "把四肢给他安装上"
                break;
            case 7:
                this.title.string = "帮他修剪一下毛毛"
                break;
            case 8:
                this.title.string = "恭喜你!!!"
                break;
        }
    }

    loadPropsToRound() {
        const node = this.props[this.round]
        node.active = true;
        tween(node)
            .to(0.5, { position: new Vec3(node.position.x + 1500, node.position.y) })
            .start();
    }
}


