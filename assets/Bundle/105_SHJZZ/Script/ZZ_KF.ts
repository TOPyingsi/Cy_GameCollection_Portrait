import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZZ_KF')
export class ZZ_KF extends Component {

    public static instance: ZZ_KF = null;

    @property(Label) title: Label = null;

    @property([Node]) props: Node[] = [];

    round: number = 0;

    protected onLoad(): void {
        ZZ_KF.instance = this;
    }

    protected start(): void {
        this.loadTitle();
        this.loadPropsToRound();
    }

    loadTitle() {
        console.log("this.round", this.round);
        switch (this.round) {
            case 0:
                this.title.string = "将杯子放置到正确的位置"
                break;
            case 1:
                this.title.string = "用擦布对杯子进行清洁"
                break;
            case 2:
                this.title.string = "用胶水填补缝隙"
                break;
            case 3:
                this.title.string = "用吹风机将胶水吹干"
                break;
            case 4:
                this.title.string = "用咖啡豆给杯子加上咖啡液"
                break;
            case 5:
                this.title.string = "把牛奶加入杯子中"
                break;
            case 6:
                this.title.string = "给咖啡贴上五官"
                break;
            case 7:
                this.title.string = "给咖啡添加身体"
                break;
            case 8:
                this.title.string = "用剪刀修改裙子"
                break;
            case 9:
                this.title.string = "给咖啡小姐穿上鞋子"
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


