import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact } from 'cc';
import NZLLX_WenziGame from './NZLLX_WenziGame';
import NZLLX_TextControl from './NZLLX_TextControl';

const { ccclass, property } = _decorator;


@ccclass('PengZhuang')
export default class NZLLX_PengZhuang extends Component {
    protected start(): void {
        this.node.getComponent(BoxCollider2D).on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => {
            console.log("碰到了");
            if (NZLLX_WenziGame.Instance.IsBeGin == false) {
                NZLLX_WenziGame.Instance.IsBeGin = true;
                NZLLX_WenziGame.Instance.Beging();
            }
            otherCollider.getComponent(NZLLX_TextControl)?.Fun_JiHuo();
            console.log(otherCollider.getComponent(NZLLX_TextControl)?.X, otherCollider.getComponent(NZLLX_TextControl)?.Y);

        })
    }
}