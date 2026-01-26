import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WZBPW_MuBiao')
export class WZBPW_MuBiao extends Component {

    @property(Node)
    private MuBiao: Node = null!;      // 把 UI2 拖进来

    @property(Node)
    private openBtn: Node = null!;      // 把打开按钮拖进来

    @property(Node)
    private closeBtn: Node = null!;     // 把关闭按钮拖进来

    protected onLoad(): void {
        // 自动给两个按钮注册点击
        this.openBtn.on(Node.EventType.TOUCH_END, this.showUI2, this);
        this.closeBtn.on(Node.EventType.TOUCH_END, this.hideUI2, this);
    }

    private showUI2(): void {
        this.MuBiao.active = true;
    }

    private hideUI2(): void {
        this.MuBiao.active = false;
    }
}


