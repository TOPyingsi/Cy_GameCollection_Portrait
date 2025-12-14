import { _decorator, Component, Node, Color, Sprite, instantiate, find, color, EventTouch, v3 } from 'cc';
import NZLLX_WenziGame from './NZLLX_WenziGame';
const { ccclass, property } = _decorator;


@ccclass('NZLLX_TextControl')
export default class NZLLX_TextControl extends Component {
    public Txt: string = "";
    public X: number = 0; //列
    public Y: number = 0; //行
    public Jihuo: boolean = false;
    private PenZhuang: Node = null;
    public ChanggeColor(color: Color) {
        this.node.getComponent(Sprite).color = color;

    }
    start() {
        this.node.on(Node.EventType.TOUCH_START, (even) => { this.OnTouchStart(even) });
        this.node.on(Node.EventType.TOUCH_END, (even) => { this.OnTouchEnd(even) });
        this.node.on(Node.EventType.TOUCH_CANCEL, (even) => { this.OnTouchEnd(even) });
        this.node.on(Node.EventType.TOUCH_MOVE, (even) => { this.OnTouchMove(even) });
    }
    OnTouchStart(even) {
        this.PenZhuang = instantiate(NZLLX_WenziGame.Instance.PenZuan);
        this.PenZhuang.setParent(find("Canvas"));
        this.PenZhuang.setWorldPosition(even.getLocation());
    }
    OnTouchEnd(even) {
        this.PenZhuang.destroy();
        NZLLX_WenziGame.Instance.YesOrNo();
        NZLLX_WenziGame.Instance.Wenzi_JiHe.splice(0);//清空数组
    }
    OnTouchMove(even: EventTouch) {
        this.PenZhuang.setWorldPosition(v3(even.getUILocation().x, even.getUILocation().y));
    }
    //    //激活筛选
    public Fun_JiHuo() {
        if (NZLLX_WenziGame.Instance.Wenzi_JiHe.length == 0 && this.Jihuo == false) {
            this.Function_JiHuo();
            return;
        }
        if (NZLLX_WenziGame.Instance.Wenzi_JiHe.length == 0 && this.Jihuo == true) {
            return;
        }
        let LastX = NZLLX_WenziGame.Instance.Wenzi_JiHe[NZLLX_WenziGame.Instance.Wenzi_JiHe.length - 1].getComponent(NZLLX_TextControl).X;
        let LastY = NZLLX_WenziGame.Instance.Wenzi_JiHe[NZLLX_WenziGame.Instance.Wenzi_JiHe.length - 1].getComponent(NZLLX_TextControl).Y;
        if ((this.Y == LastY && (this.X == LastX + 1 || this.X == LastX - 1))
            || (this.X == LastX && (this.Y == LastY + 1 || this.Y == LastY - 1))) {
            if (NZLLX_WenziGame.Instance.Wenzi_JiHe.length > 1) {
                let Last2X = NZLLX_WenziGame.Instance.Wenzi_JiHe[NZLLX_WenziGame.Instance.Wenzi_JiHe.length - 2].getComponent(NZLLX_TextControl).X;
                let Last2Y = NZLLX_WenziGame.Instance.Wenzi_JiHe[NZLLX_WenziGame.Instance.Wenzi_JiHe.length - 2].getComponent(NZLLX_TextControl).Y;
                if (this.X == Last2X && this.Y == Last2Y) {
                    // audioEngine.playEffect(WenziGame.Instance.YingYue[12], false);
                    this.Function_TuiJiHuo();
                    return;
                }
            }
            this.Function_JiHuo();
            //audioEngine.playEffect(WenziGame.Instance.YingYue[12], false);
        }
    }
    //    //激活
    Function_JiHuo() {
        if (this.Jihuo == false) {
            this.Jihuo = true;
            this.ChanggeColor(color(106, 252, 255));
            NZLLX_WenziGame.Instance.Wenzi_JiHe.push(this.node);
        }
    }
    //    //退激活
    Function_TuiJiHuo() {
        if (NZLLX_WenziGame.Instance.Wenzi_JiHe[NZLLX_WenziGame.Instance.Wenzi_JiHe.length - 1].getComponent(NZLLX_TextControl).Jihuo == true) {
            NZLLX_WenziGame.Instance.Wenzi_JiHe[NZLLX_WenziGame.Instance.Wenzi_JiHe.length - 1].getComponent(NZLLX_TextControl).Jihuo = false;
            NZLLX_WenziGame.Instance.Wenzi_JiHe[NZLLX_WenziGame.Instance.Wenzi_JiHe.length - 1].getComponent(NZLLX_TextControl).ChanggeColor(color(255, 255, 255));
            NZLLX_WenziGame.Instance.Wenzi_JiHe.pop();
        }
    }
}


