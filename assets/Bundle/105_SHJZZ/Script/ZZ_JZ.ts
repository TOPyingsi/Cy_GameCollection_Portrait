import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZZ_JZ')
export class ZZ_JZ extends Component {
    public static instance: ZZ_JZ = null;

    @property(Label) title: Label = null;

    @property([Node]) props: Node[] = [];

    round: number = 0;

    protected onLoad(): void {
        ZZ_JZ.instance = this;
    }

    protected start(): void {
        this.loadTitle();
        this.loadPropsToRound();
    }

    loadTitle() {
        console.log("this.round", this.round);
        switch (this.round) {
            case 0:
                this.title.string = "将橘子放置到正确的位置"
                break;
            case 1:
                this.title.string = "用催化剂进行催熟"
                break;
            case 2:
                this.title.string = "好像少点什么，把叶子加上试试"
                break;
            case 3:
                this.title.string = "给橘子安装一个表情看看"
                break;
            case 4:
                this.title.string = "看起来不是很开心，请他喝果汁吧！"
                break;
            case 5:
                this.title.string = "给橘子安装一双腿"
                break;
            case 6:
                this.title.string = "给橘子安装一双手"
                break;
            case 7:
                this.title.string = "给橘子穿上鞋子"
                break;
            case 8:
                this.title.string = "鞋子有点脏了，帮他刷一下"
                break;
            case 9:
                this.title.string = "细胳膊细腿的，让他锻炼一下"
                break;
            case 10:
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


