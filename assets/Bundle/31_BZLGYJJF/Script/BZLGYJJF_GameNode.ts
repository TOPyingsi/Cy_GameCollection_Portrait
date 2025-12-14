import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BZLGYJJF_GameNode')
export class BZLGYJJF_GameNode extends Component {
    @property()
    public Id: number = 0;
    @property()
    public IsLook: boolean = false;
    private _skeleton: sp.Skeleton = null;
    protected start(): void {
        this._skeleton = this.node.getComponentInChildren(sp.Skeleton);
    }
    //减肥
    JianFei() {
        this.IsLook = false;
        this.PlayAinimation("motion", () => {
            this.PlayAinimation("thin", null, true);
        });
    }
    //播放龙骨动画
    PlayAinimation(animationName: string, callBack: Function, isloop: boolean = false) {
        this._skeleton.setCompleteListener(null);
        this._skeleton.setAnimation(0, animationName, isloop);
        this._skeleton.setCompleteListener(() => {
            if (callBack) {
                callBack();
            }
        });
    }
}


