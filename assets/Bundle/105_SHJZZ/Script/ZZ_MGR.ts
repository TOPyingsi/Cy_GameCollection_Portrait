import { _decorator, Component, find, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZZ_MGR')
export class ZZ_MGR extends Component {

    public static instance: ZZ_MGR = null;

    @property(Label) title: Label = null;

    @property([Node]) round1_Props: Node[] = [];
    @property(Node) round2_Props: Node = null;
    @property(Node) round3_Props: Node = null;
    @property(Node) round4_Props: Node = null;
    @property(Node) round5_Props: Node = null;
    @property(Node) round6_Props: Node = null;
    @property(Node) round7_Props: Node = null;
    @property(Node) round8_Props: Node = null;
    @property(Node) round9_Props: Node = null;
    @property(Node) round10_Props: Node = null;

    round: number = 0;
    hh = 0;

    protected onLoad(): void {
        ZZ_MGR.instance = this;
    }

    protected start(): void {
        this.loadTitle();
        this.loadPropsToRound();
    }

    loadTitle() {
        switch (this.round) {
            case 0:
                this.title.string = "将木头放置到正确的位置"
                break;
            case 1:
                this.title.string = "锯出木棍人的形状"
                break;
            case 2:
                this.title.string = "用吹风机吹走据沫"
                break;
            case 3:
                this.title.string = "用刻刀雕刻出眼睛和嘴巴"
                break;
            case 4:
                this.title.string = "用角磨机打磨一下"
                break;
            case 5:
                this.title.string = "给木棍人安装上眼睛"
                break;
            case 6:
                this.title.string = "给木棍人安装上鼻子"
                break;
            case 7:
                this.title.string = "给木棍人安装上双腿"
                break;
            case 8:
                this.title.string = "给木棍人安装上右手"
                break;
            case 9:
                this.title.string = "把木棍给木棍人"
                break;
            case 10:
                this.title.string = "恭喜你！！！"
                break;

        }
    }

    loadPropsToRound() {
        switch (this.round) {
            case 0:
                this.round1_Props.forEach(element => {
                    element.active = true;
                    tween(element)
                        .to(0.5, { position: new Vec3(element.position.x + 1500, element.position.y) })
                        .start();
                });
                break;

            case 1:
                this.round2_Props.active = true;
                tween(this.round2_Props)
                    .to(0.5, { position: new Vec3(this.round2_Props.position.x + 1500, this.round2_Props.position.y) })
                    .start();
                break;

            case 2:
                this.round3_Props.active = true;
                tween(this.round3_Props)
                    .to(0.5, { position: new Vec3(this.round3_Props.position.x + 1500, this.round3_Props.position.y) })
                    .start();
                break;

            case 3:
                this.round4_Props.active = true;
                tween(this.round4_Props)
                    .to(0.5, { position: new Vec3(this.round4_Props.position.x + 1500, this.round4_Props.position.y) })
                    .start();
                break;

            case 4:
                this.round5_Props.active = true;
                tween(this.round5_Props)
                    .to(0.5, { position: new Vec3(this.round5_Props.position.x + 1500, this.round5_Props.position.y) })
                    .start();
                break;

            case 5:
                this.round6_Props.active = true;
                tween(this.round6_Props)
                    .to(0.5, { position: new Vec3(this.round6_Props.position.x + 1500, this.round6_Props.position.y) })
                    .start();
                break;

            case 6:
                this.round7_Props.active = true;
                tween(this.round7_Props)
                    .to(0.5, { position: new Vec3(this.round7_Props.position.x + 1500, this.round7_Props.position.y) })
                    .start();
                break;

            case 7:
                this.round8_Props.active = true;
                tween(this.round8_Props)
                    .to(0.5, { position: new Vec3(this.round8_Props.position.x + 1500, this.round8_Props.position.y) })
                    .start();
                break;

            case 8:
                this.round9_Props.active = true;
                tween(this.round9_Props)
                    .to(0.5, { position: new Vec3(this.round9_Props.position.x + 1500, this.round9_Props.position.y) })
                    .start();
                break;

            case 9:
                this.round10_Props.active = true;
                tween(this.round10_Props)
                    .to(0.5, { position: new Vec3(this.round10_Props.position.x + 1500, this.round10_Props.position.y) })
                    .start();
                break;

            case 10:
                this.scheduleOnce(() => {
                    find("Canvas/GameArea/木棍人Panel/_角磨机").active = false;
                    find("Canvas/GameArea/木棍人Panel/脚").active = false;
                    find("Canvas/GameArea/木棍人Panel/手拿木棍").active = false;
                    find("Canvas/GameArea/木棍人Panel/Ani").active = true;

                    this.scheduleOnce(() => {
                        console.log("win")
                    }, 1);
                }, 1);
                break;
        }
    }

}


