import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZZ_RZ')
export class ZZ_RZ extends Component {

    public static instance: ZZ_RZ = null;

    @property(Label) title: Label = null;

    @property([Node]) props: Node[] = [];

    round: number = 0;

    protected onLoad(): void {
        ZZ_RZ.instance = this;
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
                this.title.string = "将杯套放置到正确位置"
                break;
            case 2:
                this.title.string = "将杯套放置到正确位置"
                break;
            case 3:
                this.title.string = "用清洁剂将灰尘打湿"
                break;
            case 4:
                this.title.string = "用抹布擦干净灰尘"
                break;
            case 5:
                this.title.string = "把表情给奶茶忍者"
                break;
            case 6:
                this.title.string = "把双手给奶茶忍者安装上"
                break;
            case 7:
                this.title.string = "把双脚给奶茶忍者安装上"
                break;
            case 8:
                this.title.string = "把双刀给奶茶忍者拿着"
                break;
            case 9:
                this.title.string = "他的刀有点锈了，帮他打磨一下吧"
                break;
            case 10:
                this.title.string = "他看起来还是有点不开心，把棒棒糖给他吧！"
                break;
            case 11:
                this.title.string = "好像还缺点什么？给忍者喷层金漆！"
                break;
            case 12:
                this.title.string = "恭喜你！！！"
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


