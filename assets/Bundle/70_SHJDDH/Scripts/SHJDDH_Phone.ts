import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SHJDDH_Phone')
export class SHJDDH_Phone extends Component {
    @property([SpriteFrame])
    roleImg:SpriteFrame[] = [];
    
}


