import { _decorator, Vec3, v3, Component, Node, Label, UIOpacity, Tween, tween, UITransform } from 'cc';
import { PoolManager } from '../Managers/PoolManager';
import NodeUtil from '../Utils/NodeUtil';
const { ccclass, property } = _decorator;

const oriPos: Vec3 = v3(0, 100, 0);

@ccclass('Tip')
export default class Tip extends Component {
    mask: UITransform = null!;
    tipLb: Label | null = null!;
    tipTrans: UITransform = null!;
    onLoad() {
        this.mask = NodeUtil.GetComponent("Mask", this.node, UITransform);
        this.tipLb = this.node.getChildByName(`TipLb`).getComponent(Label);
        this.tipTrans = this.tipLb.getComponent(UITransform);
    }
    Show(content: string, delay: number = 0.75, tweenType: number = 1) {
        if (this.node.getComponent(UIOpacity)) this.node.getComponent(UIOpacity).opacity = 255;
        else this.node.addComponent(UIOpacity);

        this.tipLb.string = `${content}`;
        this.tipLb.updateRenderData(true);
        this.mask.setContentSize(this.tipTrans.contentSize.width + 200, this.mask.contentSize.height);

        switch (tweenType) {
            case 1:
                this.ShowTween1(delay);
                break;
            case 2:
                this.ShowTween2(delay);
                break;
            default:
                this.ShowTween1(delay);
                break;
        }
    }
    ShowTween1(delay: number = 0.75) {
        this.node.setScale(0, 0, 0);
        this.node.setPosition(oriPos);
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(0.5, { scale: Vec3.ONE }, { easing: `elasticOut` })
            .delay(delay)
            .to(0.25, { position: v3(0, 250), scale: Vec3.ZERO })
            .call(() => {
                PoolManager.PutNode(this.node);
            })
            .start();
    }
    ShowTween2(delay: number = 0.75) {
        this.node.setScale(Vec3.ONE);
        this.node.setPosition(oriPos);
        Tween.stopAllByTarget(this.node);
        tween(this.node).delay(delay).to(0.25, { position: v3(0, 250) }).call(() => { PoolManager.PutNode(this.node); }).start();
        tween(this.node.getComponent(UIOpacity)).delay(delay).to(0.25, { opacity: 0 }).start();
    }
}