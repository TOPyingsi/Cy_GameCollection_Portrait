import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { HCSHJ_DynamicDt } from './HCSHJ_DynamicDt';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_ProgressCtl')
export class HCSHJ_ProgressCtl extends Component {


    @property([SpriteFrame])
    pro: SpriteFrame[] = [];

    protected update(dt: number): void {
        
        let n: number = HCSHJ_DynamicDt.Instance.progress;
        this.node.getComponent(Sprite).spriteFrame = this.pro[n];
        
    }
}


